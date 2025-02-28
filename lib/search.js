// In lib/search.js
import Fuse from 'fuse.js';
import { getAllContent } from './api';

// Create search indices at build time
const searchIndices = {};

export function initSearchIndices() {
  const types = ['bestiary', 'spells', 'items', 'subclasses'];

  types.forEach(type => {
    const allItems = getAllContent(type, ['name', 'slug', 'type']);
    searchIndices[type] = new Fuse(allItems, {
      keys: ['name'],
      threshold: 0.3,
    });
  });
}

export function searchContent(query, type = null) {
  if (!query || query.length < 2) {
    return [];
  }

  if (type && searchIndices[type]) {
    return searchIndices[type].search(query).map(result => result.item);
  }

  // Search all types
  let results = [];
  Object.entries(searchIndices).forEach(([type, index]) => {
    const typeResults = index.search(query).map(result => ({
      ...result.item,
      type
    }));
    results = [...results, ...typeResults];
  });

  return results;
}
