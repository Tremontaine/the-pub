import { useState, useCallback } from 'react';
import Layout from '../../components/Layout';
import Table from '../../components/Table';
import Search from '../../components/Search';
import Filter from '../../components/Filter';
import { getAllContent } from '../../lib/api';

export default function Bestiary({ monsters }) {
  const [filteredMonsters, setFilteredMonsters] = useState(monsters);
  const [searchResults, setSearchResults] = useState(monsters);
  const [activeFilters, setActiveFilters] = useState({});
  
  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'type', label: 'Type' },
    { key: 'challenge_rating', label: 'CR' },
    { key: 'size', label: 'Size' },
  ];
  
  const handleSearch = (results) => {
    setSearchResults(results || monsters);
    applyFilters(results || monsters);
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
    
    setFilteredMonsters(filtered);
  }, [activeFilters]);
  
  return (
    <Layout title="Bestiary | The Pub">
      <h1>Bestiary</h1>
      <p>Browse and search through our collection of homebrew monsters and creatures.</p>
      
      <Search 
        data={monsters} 
        placeholder="Search monsters..."
        basePath="/bestiary"
        onSearch={handleSearch}
      />
      
      <div className="filters-section">
        <h3>Filters</h3>
        <div className="filters-grid">
          <Filter 
            data={monsters} 
            field="type" 
            label="Type" 
            onFilter={handleFilter} 
          />
          <Filter 
            data={monsters} 
            field="challenge_rating" 
            label="Challenge Rating" 
            onFilter={handleFilter} 
          />
          <Filter 
            data={monsters} 
            field="size" 
            label="Size" 
            onFilter={handleFilter} 
          />
        </div>
        {Object.keys(activeFilters).length > 0 && (
          <button 
            type="button"
            className="clear-filters-btn"
            onClick={() => {
              setActiveFilters({});
              setFilteredMonsters(searchResults);
            }}
          >
            Clear Filters
          </button>
        )}
      </div>
      
      <div className="table-container">
        <Table 
          data={filteredMonsters} 
          columns={columns} 
          basePath="/bestiary" 
        />
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const monsters = getAllContent('bestiary', [
    'name',
    'slug',
    'type',
    'challenge_rating',
    'size',
  ]);
  
  return {
    props: { monsters },
  };
}