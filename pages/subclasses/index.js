import { useState, useCallback } from 'react';
import Layout from '../../components/Layout';
import Table from '../../components/Table';
import Search from '../../components/Search';
import Filter from '../../components/Filter';
import { getAllContent } from '../../lib/api';

export default function Subclasses({ subclasses }) {
  const [filteredSubclasses, setFilteredSubclasses] = useState(subclasses);
  const [searchResults, setSearchResults] = useState(subclasses);
  const [activeFilters, setActiveFilters] = useState({});
  const [filterResetKey, setFilterResetKey] = useState(0);
  
  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'class', label: 'Class' },
  ];
  
  const handleSearch = (results) => {
    setSearchResults(results || subclasses);
    applyFilters(results || subclasses);
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
    
    setFilteredSubclasses(filtered);
  }, [activeFilters]);
  
  return (
    <Layout title="Subclasses | The Pub">
      <h1>Subclasses</h1>
      <p>Browse and search through our collection of homebrew subclasses for D&D 5e.</p>
      
      <Search 
        data={subclasses} 
        placeholder="Search subclasses..."
        basePath="/subclasses"
        onSearch={handleSearch}
      />
      
      <div className="filters-section">
        <h3>Filters</h3>
        <div className="filters-grid">
          <Filter 
            data={subclasses} 
            field="class" 
            label="Class" 
            onFilter={handleFilter}
            resetKey={filterResetKey}
          />
        </div>
        {Object.keys(activeFilters).length > 0 && (
<button 
  className="clear-filters-btn"
  onClick={() => {
  setActiveFilters({});
  setFilteredSubclasses(searchResults);
  setFilterResetKey(prev => prev + 1); // Add this line
}}
>
  Clear Filters
</button>
        )}
      </div>
      
      <div className="table-container">
        <Table 
          data={filteredSubclasses} 
          columns={columns} 
          basePath="/subclasses" 
        />
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const subclasses = getAllContent('subclasses', [
    'name',
    'slug',
    'class',
  ]);
  
  return {
    props: { subclasses },
  };
}
