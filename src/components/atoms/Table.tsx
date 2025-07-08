import React from 'react';

interface Column {
  label: string;
  accessor: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface TableProps {
  columns: Column[];
  data: any[];
  className?: string;
  rowKey?: string | ((row: any) => string);
}

export default function Table({ columns, data, className, rowKey = 'id' }: TableProps) {
  return (
    <div className={`overflow-x-auto ${className || ''}`}>
      <table className="min-w-full bg-white rounded-xl shadow-sm text-sm border-separate border-spacing-0">
        <thead className="sticky top-0 z-10 bg-white/95">
          <tr className="text-blue-800 font-medium text-xs uppercase tracking-wider border-b border-blue-100">
            {columns.map(col => (
              <th key={col.accessor} className="py-2 px-3 text-left font-semibold whitespace-nowrap">{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={typeof rowKey === 'function' ? rowKey(row) : row[rowKey] || i}
              className="border-b border-blue-50 hover:bg-blue-50/60 transition group"
            >
              {columns.map(col => (
                <td
                  key={col.accessor}
                  className="py-2 px-3 text-gray-900 align-middle whitespace-nowrap text-[13px] font-medium group-hover:text-blue-900"
                >
                  {col.render ? col.render(row[col.accessor], row) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 