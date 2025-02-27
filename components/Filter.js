import { useState, useEffect, useRef } from 'react';

export default function Filter({ data, field, label, onFilter, resetKey = 0 }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState([]);
  const [searchText, setSearchText] = useState('');
  const dropdownRef = useRef(null);
  
  // Get unique values for the field from the data
  const uniqueValues = [...new Set(data.map(item => item[field]))].sort((a, b) => {
    // Handle numeric sorting for CR
    if (field === 'challenge_rating') {
      return parseFloat(a) - parseFloat(b);
    }
    // Handle level sorting
    if (field === 'level') {
      return parseInt(a) - parseInt(b);
    }
    // Default string comparison
    return String(a).localeCompare(String(b));
  });

  const pluralize = (word) => {
  // Dictionary of irregular plurals common in D&D context
  const irregularPlurals = {
    'Class': 'Classes',
    'Subclass': 'Subclasses',
    'Rarity': 'Rarities',
    'Attunement': 'Attunement', // Should not be pluralized
    'Alignment': 'Alignments',
    'Proficiency': 'Proficiencies',
  };
  
  // Check if we have a special case for this word
  if (irregularPlurals[word]) {
    return irregularPlurals[word];
  }
  
  // Don't add 's' if the word already ends with 's'
  if (word.endsWith('s')) {
    return word;
  }
  
  // Words ending in 'y' preceded by a consonant
  if (word.endsWith('y') && !['a','e','i','o','u'].includes(word.charAt(word.length-2).toLowerCase())) {
    return word.slice(0, -1) + 'ies';
  }
  
  // Regular pluralization
  return `${word}s`;
  };
  
  // Filter values based on search text
  const filteredValues = searchText 
    ? uniqueValues.filter(val => 
        String(val).toLowerCase().includes(searchText.toLowerCase()))
    : uniqueValues;
  
  const handleCheckboxChange = (e, value) => {
    e.stopPropagation(); // Stop event from propagating
    
    let newSelectedValues;
    
    if (selectedValues.includes(value)) {
      newSelectedValues = selectedValues.filter(v => v !== value);
    } else {
      newSelectedValues = [...selectedValues, value];
    }
    
    setSelectedValues(newSelectedValues);
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Add this effect to reset selectedValues when resetKey changes
  useEffect(() => {
    if (resetKey > 0) {  // Skip the initial render
      setSelectedValues([]);
      setSearchText('');
    }
  }, [resetKey]);
  
  // Update filtered data whenever selections change
  useEffect(() => {
    if (selectedValues.length === 0) {
      // If nothing is selected, don't filter
      onFilter(field, null);
    } else {
      // Filter data to only include items with selected values
      onFilter(field, selectedValues);
    }
  }, [selectedValues, field, onFilter]);
  
const toggleDropdown = (e) => {
  e.preventDefault();
  e.stopPropagation();
  setIsOpen(!isOpen);
};
  
  const handleApply = (e) => {
    e.stopPropagation(); // Stop event from propagating
    setIsOpen(false);
  };
  
  return (
    <div className="filter-dropdown" ref={dropdownRef}>
      <div className="filter-header">
        <label>{label}</label>
        <button 
          type="button"
          className={`filter-toggle ${selectedValues.length > 0 ? 'active' : ''}`} 
          onClick={toggleDropdown}
        >
          {selectedValues.length > 0 ? `${label} (${selectedValues.length})` : label}
          <span className="dropdown-arrow">{isOpen ? '▲' : '▼'}</span>
        </button>
      </div>
      
      {isOpen && (
        <div className="dropdown-content"
            onClick={(e) => e.stopPropagation()}
            >
          <div className="dropdown-search">
            <input 
              type="text" 
              placeholder={`Search ${label}`} 
              value={searchText}
              onChange={(e) => {
                e.stopPropagation();
                setSearchText(e.target.value);
              }}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          
          <div className="dropdown-items">
            <label className="filter-option" onClick={(e) => e.stopPropagation()}>
              <input
                type="checkbox"
                checked={selectedValues.length === 0}
                onChange={(e) => {
                  e.stopPropagation();
                  setSelectedValues([]);
                }}
              />
              <span><strong>All {pluralize(label)}</strong></span>
            </label>
            
            {filteredValues.map(value => (
              <label key={value} className="filter-option" onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={selectedValues.includes(value)}
                  onChange={(e) => handleCheckboxChange(e, value)}
                />
                <span>{value}</span>
              </label>
            ))}
          </div>
          
<div className="dropdown-footer">
  <button 
    type="button"
    className="dropdown-close"
    onClick={() => setIsOpen(false)}
  >
    Close
  </button>
</div>
        </div>
      )}
    </div>
  );
}
