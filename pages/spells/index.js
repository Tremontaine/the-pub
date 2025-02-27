import { useState, useCallback } from 'react';
import Layout from '../../components/Layout';
import Table from '../../components/Table';
import Search from '../../components/Search';
import Filter from '../../components/Filter';
import { getAllContent } from '../../lib/api';

export default function Spells({ spells }) {
  const [filteredSpells, setFilteredSpells] = useState(spells);
  const [searchResults, setSearchResults] = useState(spells);
  const [activeFilters, setActiveFilters] = useState({});
  
  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'level', label: 'Level' },
    { key: 'school', label: 'School' },
    { key: 'casting_time', label: 'Casting Time' },
    { key: 'components', label: 'Components' },
  ];
  
  const handleSearch = (results) => {
    setSearchResults(results || spells);
    applyFilters(results || spells);
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
    
    setFilteredSpells(filtered);
  }, [activeFilters]);
  
  return (
    <Layout title="Spells | The Pub">
      <h1>Spells</h1>
      <p>Browse and search through our collection of homebrew spells.</p>
      
      <Search 
        data={spells} 
        placeholder="Search spells..."
        basePath="/spells"
        onSearch={handleSearch}
      />
      
      <div className="filters-section">
        <h3>Filters</h3>
        <div className="filters-grid">
          <Filter 
            data={spells} 
            field="level" 
            label="Level" 
            onFilter={handleFilter} 
          />
          <Filter 
            data={spells} 
            field="school" 
            label="School" 
            onFilter={handleFilter} 
          />
        </div>
        {Object.keys(activeFilters).length > 0 && (
<button 
  className="clear-filters-btn"
  onClick={() => {
    const emptyFilters = {};
    setActiveFilters(emptyFilters);
    applyFilters(searchResults, emptyFilters); // Call applyFilters with the empty filters
  }}
>
  Clear Filters
</button>
        )}
      </div>
      
      <div className="table-container">
        <Table 
          data={filteredSpells} 
          columns={columns} 
          basePath="/spells" 
        />
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const spells = getAllContent('spells', [
    'name',
    'slug',
    'level',
    'school',
    'casting_time',
    'components',
  ]);
  
  return {
    props: { spells },
  };
}
