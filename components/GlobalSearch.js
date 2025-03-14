import { useState } from 'react';
import { useRouter } from 'next/router';

export default function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

    const handleSearch = async (e) => {
      const value = e.target.value;
      setQuery(value);

      if (value.length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);

      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(value)}`);

        if (!res.ok) {
          throw new Error('Search failed');
        }

        const data = await res.json();
        setResults(data);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]); // Clear results on error
      } finally {
        setIsLoading(false);
      }
    };

  const handleResultClick = (item) => {
    router.push(`/${item.type}/${item.slug}`);
    setQuery('');
    setResults([]);
  };

  return (
    <div className="search-container">
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search everything..."
      />
      
      {isLoading && <div>Loading...</div>}
      
      {results.map(item => (
        <div key={`${item.type}-${item.slug}`} className="search-result-item">
          <a 
            href={`/${item.type}/${item.slug}`}
            style={{ display: 'block', color: 'inherit', textDecoration: 'none' }}
            onClick={(e) => {
              if (e.button === 0 && !e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                handleResultClick(item);
              }
            }}
          >
            <strong>{item.name}</strong> <small>({item.type})</small>
          </a>
        </div>
      ))}
    </div>
  );
}