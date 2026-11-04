import React from 'react';

export const Table = ({ headers = [], children, emptyMessage = 'No data available' }) => {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-slate-200/80 bg-white shadow-sm">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/75 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {headers.map((header, idx) => (
              <th
                key={idx}
                className={`px-5 py-3.5 ${
                  typeof header === 'object' ? header.className : ''
                }`}
              >
                {typeof header === 'object' ? header.label : header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">{children}</tbody>
      </table>
    </div>
  );
};
