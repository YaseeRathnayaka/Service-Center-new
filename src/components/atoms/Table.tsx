import React from 'react';

export interface Column<T> {
  label: string;
  accessor: keyof T;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  className?: string;
  rowKey?: string | ((row: T) => string);
}

export default function Table<T>({ columns, data, className, rowKey = 'id' }: TableProps<T>) {
  return (
    <div className={`overflow-x-auto ${className || ''}`}>
      <div className="bg-white border-2 border-slate-200 shadow-lg">
        <table className="min-w-full">
          <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b-2 border-slate-200">
            <tr>
              {columns.map((col, index) => (
                <th 
                  key={String(col.accessor)} 
                  className={`py-4 px-6 text-left font-bold text-slate-700 text-sm uppercase tracking-wider whitespace-nowrap
                    ${index === 0 ? 'border-r border-slate-200' : ''}
                    ${index === columns.length - 1 ? '' : 'border-r border-slate-200'}
                  `}
                >
                  {col.label}
                </th>
            ))}
          </tr>
        </thead>
          <tbody className="divide-y divide-slate-200">
          {data.map((row, i) => (
            <tr
              key={typeof rowKey === 'function' ? rowKey(row) : (row[rowKey as keyof T] as React.Key) || i}
                className="bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 group border-l-4 border-l-transparent hover:border-l-blue-500"
            >
                {columns.map((col, index) => (
                <td
                  key={String(col.accessor)}
                    className={`py-4 px-6 text-slate-700 align-middle whitespace-nowrap text-sm font-medium group-hover:text-slate-900 transition-colors duration-200
                      ${index === 0 ? 'border-r border-slate-200' : ''}
                      ${index === columns.length - 1 ? '' : 'border-r border-slate-200'}
                    `}
                >
                  {col.render ? col.render(row[col.accessor], row) : (row[col.accessor] as React.ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
        {data.length === 0 && (
          <div className="py-12 px-6 text-center">
            <div className="text-slate-400 text-sm font-medium">No data available</div>
          </div>
        )}
      </div>
    </div>
  );
} 