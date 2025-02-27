import { useState, useCallback } from 'react';
import Layout from '../../components/Layout';
import Table from '../../components/Table';
import Search from '../../components/Search';
import Filter from '../../components/Filter';
import { getAllContent } from '../../lib/api';

export default function Items({ items }) {
  const [filteredItems, setFilteredItems] = useState(items);
  const [searchResults, setSearchResults] = useState(items);
  const [activeFilters, setActiveFilters] = useState({});
  const [filterResetKey, setFilterResetKey] = useState(0);
  
  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'type', label: 'Type' },
    { key: 'rarity', label: 'Rarity' },
    { key: 'requires_attunement', label: 'Attunement' },
  ];
  
  const handleSearch = (results) => {
    setSearchResults(results || items);
    applyFilters(results || items);
  };
  
  const handleFilter = useCallback((field, values) => {
    const newFilters = { ...activeFilters };
    
    if (!values) {
      delete newFilters[field];
    } else {
      newFilters[field] = values;
    }
    
    setActiveFilters(newFilters);
    applyFilters(searchResults, newFilters);
  }, [activeFilters, searchResults]);
  
  const applyFilters = useCallback((data, filters = activeFilters) => {
    if (!data) return;
    
    let filtered = [...data];
    
    // Apply all active filters
    Object.entries(filters).forEach(([field, values]) => {
      if (values && values.length > 0) {
        filtered = filtered.filter(item => values.includes(item[field]));
      }
    });
    
    setFilteredItems(filtered);
  }, [activeFilters]);
  
  return (
    <Layout title="Magic Items | The Pub">
      <h1>Magic Items</h1>
      <p>Browse and search through our collection of homebrew magic items.</p>
      
      <Search 
        data={items} 
        placeholder="Search items..."
        basePath="/items"
        onSearch={handleSearch}
      />
      
      <div className="filters-section">
        <h3>Filters</h3>
        <div className="filters-grid">
          <Filter 
            data={items} 
            field="type" 
            label="Type" 
            onFilter={handleFilter} 
            resetKey={filterResetKey}
          />
          <Filter 
            data={items} 
            field="rarity" 
            label="Rarity" 
            onFilter={handleFilter}
            resetKey={filterResetKey}
          />
          <Filter 
            data={items} 
            field="requires_attunement" 
            label="Attunement" 
            onFilter={handleFilter}
            resetKey={filterResetKey}
          />
        </div>
        {Object.keys(activeFilters).length > 0 && (
<button 
  className="clear-filters-btn"
  onClick={() => {
  setActiveFilters({});
  setFilteredItems(searchResults);
  setFilterResetKey(prev => prev + 1); // Add this line
}}
>
  Clear Filters
</button>
        )}
      </div>
      
      <div className="table-container">
        <Table 
          data={filteredItems} 
          columns={columns} 
          basePath="/items" 
        />
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const items = getAllContent('items', [
    'name',
    'slug',
    'type',
    'rarity',
    'requires_attunement',
  ]).map(item => ({
    ...item,
    requires_attunement: item.requires_attunement ? 'Yes' : 'No'
  }));
  
  return {
    props: { items },
  };
}
