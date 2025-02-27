import { useState } from 'react';

export default function Table({ data, columns, basePath }) {
  const [sortConfig, setSortConfig] = useState({
    key: columns[0].key,
    direction: 'ascending'
  });

  const sortedData = [...data].sort((a, b) => {
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