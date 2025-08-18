import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useTheme } from '../../ThemeContext';

const SortableTable = ({ 
  data = [], 
  columns = [], 
  defaultSortColumn = null,
  defaultSortDirection = 'desc',
  title = "",
  subtitle = "",
  className = "",
  onRowClick = null,
  showRowIndex = false,
  striped = true,
  hover = true,
  compact = false
}) => {
  const { isDark } = useTheme();
  const [sortColumn, setSortColumn] = useState(defaultSortColumn || (columns.length > 0 ? columns[0].key : null));
  const [sortDirection, setSortDirection] = useState(defaultSortDirection);
  const [topN, setTopN] = useState('All');

  const sortedData = useMemo(() => {
    if (!sortColumn || !data.length) return data;
    return [...data].sort((a, b) => {
      let aValue = a[sortColumn];
      let bValue = b[sortColumn];

      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sortDirection === 'asc' ? -1 : 1;
      if (bValue == null) return sortDirection === 'asc' ? 1 : -1;

      const aNum = parseFloat(String(aValue).replace(/[^0-9.-]/g, ''));
      const bNum = parseFloat(String(bValue).replace(/[^0-9.-]/g, ''));
      
      if (!isNaN(aNum) && !isNaN(bNum)) {
        aValue = aNum;
        bValue = bNum;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return sortDirection === 'asc' 
          ? aValue - bValue
          : bValue - aValue;
      }
    });
  }, [data, sortColumn, sortDirection]);

  const displayedData = useMemo(() => {
    if (topN === 'All') return sortedData;
    return sortedData.slice(0, Number(topN));
  }, [sortedData, topN]);

  const handleSort = (columnKey) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('desc');
    }
  };

  const formatCellValue = (value, column) => {
    if (value == null) return '-';
    if (column.formatter) return column.formatter(value);
    switch (column.type) {
      case 'percentage':
        const numVal = parseFloat(value);
        const sign = numVal > 0 ? '+' : '';
        return `${sign}${numVal.toFixed(column.decimals || 2)}%`;
      case 'currency':
        return `$${Number(value).toLocaleString()}`;
      case 'number':
      case 'ratio':
        return Number(value).toFixed(column.decimals || 2);
      default:
        return value;
    }
  };

  const getCellColorClass = (value, column) => {
    if (!column.colorize) return '';
    const numVal = parseFloat(String(value).replace(/[^0-9.-]/g, ''));
    if (isNaN(numVal)) return '';
    if (numVal > 0) return 'text-green-500';
    if (numVal < 0) return 'text-red-500';
    return '';
  };

  const renderSortIcon = (columnKey) => {
    if (sortColumn !== columnKey) return <div className="w-4 h-4" />;
    return sortDirection === 'asc' 
      ? <ChevronUp className="w-4 h-4 text-blue-500" />
      : <ChevronDown className="w-4 h-4 text-blue-500" />;
  };

  if (!data.length || !columns.length) {
    return (
      <div className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${
        isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white'
      }`}>
        <div className="text-center py-8">
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>
            No data available
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-1 relative transition-colors duration-300 ${
      isDark ? 'bg-gray-800' : 'bg-white'
    } ${className}`}>
      
      {/* Floating Top N selector */}
      <div className="absolute -top-8 right-0 flex items-center">
        <label className={`mr-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          Show top:
        </label>
        <select
          value={topN}
          onChange={(e) => setTopN(e.target.value)}
          className={`border rounded px-2 py-1 text-sm transition-colors duration-300
            ${isDark ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-white text-gray-800 border-gray-300'}
          `}
        >
          {[5, 10, 20, 30, 50, 'All'].map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`${isDark ? 'border-gray-600' : 'border-gray-200'} border-b-2 transition-colors duration-300`}>
              {showRowIndex && (
                <th className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-left py-3 px-4 font-semibold transition-colors duration-300`}>
                  #
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`pb-3 px-2 font-semibold cursor-pointer select-none hover:bg-opacity-10 hover:bg-blue-500 transition-colors duration-300 ${
                    column.align === 'center' ? 'text-center' : 
                    column.align === 'right' ? 'text-right' : 'text-left'
                  } ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                  onClick={() => handleSort(column.key)}
                >
                  <div className={`flex items-center ${
                    column.align === 'center' ? 'justify-center' : 
                    column.align === 'right' ? 'justify-end' : 'justify-start'
                  }`}>
                    {column.align === 'right' && renderSortIcon(column.key)}
                    <span className="mx-2">{column.label}</span>
                    {column.align !== 'right' && renderSortIcon(column.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayedData.map((row, index) => (
              <tr
                key={row.id || index}
                onClick={() => onRowClick && onRowClick(row, index)}
                className={`border-b transition-colors duration-300 ${
                  onRowClick ? 'cursor-pointer' : ''
                } ${isDark ? 'border-gray-600' : 'border-gray-100'} ${
                  hover && onRowClick ? (
                    isDark ? 'hover:bg-gray-700' : 'hover:bg-blue-50'
                  ) : ''
                } ${striped && index % 2 === 1 ? (
                    isDark ? 'bg-gray-750' : 'bg-gray-25'
                  ) : ''}`}
              >
                {showRowIndex && (
                  <td className={`${isDark ? 'text-gray-400' : 'text-gray-500'} py-3 px-4 text-sm font-medium transition-colors duration-300`}>
                    {index + 1}
                  </td>
                )}
                {columns.map((column) => {
                  const value = row[column.key];
                  const formattedValue = formatCellValue(value, column);
                  const colorClass = getCellColorClass(value, column);
                  return (
                    <td
                      key={column.key}
                      className={`py-3 px-4 ${compact ? 'text-sm' : ''} ${
                        column.align === 'center' ? 'text-center' : 
                        column.align === 'right' ? 'text-right' : 'text-left'
                      } ${
                        colorClass || (
                          column.key === sortColumn ? 
                            (isDark ? 'text-white font-medium' : 'text-gray-900 font-medium') :
                            (isDark ? 'text-gray-300' : 'text-gray-600')
                        )
                      } transition-colors duration-300`}
                    >
                      {column.icon ? (
                        <div className="flex items-center space-x-2">
                          <column.icon className="w-4 h-4" />
                          <span>{formattedValue}</span>
                        </div>
                      ) : (
                        formattedValue
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="mt-4 flex justify-between items-center text-sm">
        <div className={`${isDark ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>
          Showing {displayedData.length} of {sortedData.length} items
        </div>
        {sortColumn && (
          <div className={`${isDark ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>
            Sorted by {columns.find(col => col.key === sortColumn)?.label} ({sortDirection === 'asc' ? 'ascending' : 'descending'})
          </div>
        )}
      </div>
    </div>
  );
};

export default SortableTable;
