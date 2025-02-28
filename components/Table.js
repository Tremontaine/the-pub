// components/Table.js - Fixed rarity sorting
import { useState } from 'react';

export default function Table({ data, columns, basePath }) {
  const [sortConfig, setSortConfig] = useState({
    key: columns[0].key,
    direction: 'ascending'
  });

  // Helper function to parse CR values
  const parseCR = (cr) => {
    if (!cr) return 0;
    if (cr === '1/8') return 0.125;
    if (cr === '1/4') return 0.25;
    if (cr === '1/2') return 0.5;
    return parseFloat(cr);
  };

  // Helper function to get rarity weight for sorting
  const getRarityWeight = (rarity) => {
    if (!rarity) return 0;

    // Normalize the rarity string (lowercase, trim)
    const normalizedRarity = rarity.toLowerCase().trim();

    // Define rarity order with normalized keys
    const rarityOrder = {
      'common': 1,
      'uncommon': 2,
      'rare': 3,
      'very rare': 4,
      'legendary': 5,
      'artifact': 6
    };

    // Log for debugging
    console.log(`Rarity: "${rarity}", Normalized: "${normalizedRarity}", Weight: ${rarityOrder[normalizedRarity] || 0}`);

    return rarityOrder[normalizedRarity] || 0;
  };

  // Updated sorting logic
  const sortedData = [...data].sort((a, b) => {
    // Special handling for spell levels
    if (sortConfig.key === 'level') {
      // Convert to numbers for proper comparison
      // Handle "Cantrip" as level 0
      const levelA = a[sortConfig.key] === 'Cantrip' ? 0 : parseInt(a[sortConfig.key]);
      const levelB = b[sortConfig.key] === 'Cantrip' ? 0 : parseInt(b[sortConfig.key]);

      return sortConfig.direction === 'ascending' 
        ? levelA - levelB 
        : levelB - levelA;
    }

    // Special handling for challenge ratings
    if (sortConfig.key === 'challenge_rating') {
      const crA = parseCR(a[sortConfig.key]);
      const crB = parseCR(b[sortConfig.key]);

      return sortConfig.direction === 'ascending' 
        ? crA - crB 
        : crB - crA;
    }

    // Special handling for item rarities
    if (sortConfig.key === 'rarity') {
      const rarityA = getRarityWeight(a[sortConfig.key]);
      const rarityB = getRarityWeight(b[sortConfig.key]);

      // Log comparison for debugging
      console.log(`Comparing ${a[sortConfig.key]}(${rarityA}) with ${b[sortConfig.key]}(${rarityB})`);

      return sortConfig.direction === 'ascending' 
        ? rarityA - rarityB 
        : rarityB - rarityA;
    }

    // Default string comparison for other fields
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Direct navigation handler
  const handleRowClick = (slug) => {
    window.location.href = `${basePath}/${slug}`;
  };

  return (
    <div className="table-responsive">
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th 
                key={column.key} 
                onClick={() => requestSort(column.key)}
                className="sortable"
              >
                {column.label}
                {sortConfig.key === column.key && (
                  <span className="sort-indicator">
                    {sortConfig.direction === 'ascending' ? ' ↑' : ' ↓'}
                  </span>
                )}
              </th>
            ))}
            <th style={{ width: '40px' }}></th> {/* Column for background open button */}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item) => (
            <tr 
              key={item.slug} 
              className="table-row"
              onClick={() => handleRowClick(item.slug)}
              style={{ cursor: 'pointer' }}
            >
              {columns.map((column) => (
                <td key={`${item.slug}-${column.key}`}>
                  {item[column.key]}
                </td>
              ))}
              <td 
                style={{ textAlign: 'center', padding: '0.5rem' }}
                onClick={(e) => e.stopPropagation()} // Prevent row click
              >
                <a 
                  href={`${basePath}/${item.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Open in new tab"
                  style={{
                    display: 'inline-block',
                    padding: '4px',
                    borderRadius: '4px',
                    background: 'var(--hover-color)',
                    lineHeight: 1
                  }}
                >
                  ↗️
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
