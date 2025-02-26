import Fuse from 'fuse.js';
import { getAllContent } from './api';

export function getSearchIndex(type) {
  const allItems = getAllContent(type, ['name', 'slug', 'type', 'level', 'challenge_rating', 'rarity']);
  
  const fuse = new Fuse(allItems, {
    keys: ['name'],
    threshold: 0.3,
  });
  
  return fuse;
}

export function search(searchIndex, query) {
  if (!query || query.length < 2) {
    return [];
  }
  
  return searchIndex.search(query).map(result => result.item);
}