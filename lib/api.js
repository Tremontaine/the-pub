import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import gfm from 'remark-gfm';

const contentDirectory = path.join(process.cwd(), 'content');

function parseCR(cr) {
  if (cr === undefined) return 0;
  if (cr === '1/8') return 0.125;
  if (cr === '1/4') return 0.25;
  if (cr === '1/2') return 0.5;
  return parseFloat(cr);
}

export function getContentPaths(type) {
  const typeDirectory = path.join(contentDirectory, type);
  if (!fs.existsSync(typeDirectory)) {
    return [];
  }
  return fs.readdirSync(typeDirectory).filter(file => file.endsWith('.md'));
}

export function getContentBySlug(type, slug, fields = []) {
  const typeDirectory = path.join(contentDirectory, type);
  const fullPath = path.join(typeDirectory, `${slug}.md`);
  
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  const items = {};

  // Ensure only the minimal needed data is exposed
  fields.forEach((field) => {
    if (field === 'slug') {
      items[field] = slug;
    }
    if (field === 'content') {
      items[field] = content;
    }
    if (field === 'type') {
      items[field] = type;
    }

    if (data[field]) {
      items[field] = data[field];
    }
  });

  return items;
}

export async function getContentBySlugWithHTML(type, slug) {
  const entry = getContentBySlug(type, slug, [
    'name',
    'type',
    'content',
    // Bestiary fields
    'challenge_rating',
    'size',
    'alignment',
    // Spell fields
    'level',
    'school',
    'casting_time',
    'range',
    'components',
    'duration',
    // Item fields
    'rarity',
    'requires_attunement',
    // Subclass fields
    'class',
    'source',
  ]);
  
  if (!entry) {
    return null;
  }

  // Get raw file contents for the "show markdown" feature
  const typeDirectory = path.join(contentDirectory, type);
  const fullPath = path.join(typeDirectory, `${slug}.md`);
  const rawMarkdown = fs.readFileSync(fullPath, 'utf8');

  // Convert markdown to HTML with better error handling
  let contentHtml = '';
  try {
    // Always use gfm for consistent table rendering
    const processor = remark()
      .use(gfm)
      .use(html, { sanitize: false });
    
    const result = await processor.process(entry.content || '');
    contentHtml = result.toString();
  } catch (error) {
    console.error('Error processing markdown:', error);
    contentHtml = `<p>Error rendering content: ${error.message}</p>`;
  }

  return {
    entry,
    content: contentHtml,
    rawMarkdown
  };
}

export function getAllContent(type, fields = []) {
  const contentPaths = getContentPaths(type);
  
  if (contentPaths.length === 0) {
    return [];
  }
  
  const allContent = contentPaths.map(fileName => {
    const slug = fileName.replace(/\.md$/, '');
    return getContentBySlug(type, slug, fields);
  });

  // Special sorting for bestiary by CR
  if (type === 'bestiary') {
    allContent.sort((a, b) => {
      return parseCR(a.challenge_rating) - parseCR(b.challenge_rating);
    });
  }

  return allContent;
}

export function searchAllContent(query) {
  const types = ['bestiary', 'spells', 'items', 'subclasses'];
  let results = [];

  types.forEach(type => {
    const typeItems = getAllContent(type, ['name', 'slug'])
      .filter(item => item.name.toLowerCase().includes(query.toLowerCase()))
      .map(item => ({
        ...item,
        type
      }));
    
    results = [...results, ...typeItems];
  });

  return results;
}
