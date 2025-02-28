import { useState } from 'react';

export default function Table({ data, columns, basePath }) {
  const [sortConfig, setSortConfig] = useState({
    key: columns[0].key,
    direction: 'ascending'
  });

// components/Table.js - Updated sorting logic
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
      // Parse CR values like "1/4", "1/2", etc.
      const parseCR = (cr) => {
        if (cr === '1/8') return 0.125;
        if (cr === '1/4') return 0.25;
        if (cr === '1/2') return 0.5;
        return parseFloat(cr);
      };

      const crA = parseCR(a[sortConfig.key]);
      const crB = parseCR(b[sortConfig.key]);

      return sortConfig.direction === 'ascending' 
        ? crA - crB 
        : crB - crA;
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}