import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Search({ data, placeholder, basePath, onSearch }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const router = useRouter();

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.length < 2) {
      setResults([]);
      if (onSearch) onSearch(data); // Reset to show all data
      return;
    }
    
    const filtered = data.filter(item => 
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    
    setResults(filtered);
    if (onSearch) onSearch(filtered); // Update the table data
  };

  const handleResultClick = (slug) => {
    router.push(`${basePath}/${slug}`);
    setQuery('');
    setResults([]);
  };

  return (
    <div className="search-container">
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder={placeholder}
      />
      
      {results.length > 0 && (
        <div className="search-results">
          {results.map(item => (
            <div key={item.slug} className="search-result-item">
              <a 
                href={`${basePath}/${item.slug}`}
                style={{ display: 'block', color: 'inherit', textDecoration: 'none' }}
                onClick={(e) => {
                  if (e.button === 0 && !e.ctrlKey && !e.metaKey) {
                    e.preventDefault();
                    handleResultClick(item.slug);
                  }
                }}
              >
                {item.name}
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}