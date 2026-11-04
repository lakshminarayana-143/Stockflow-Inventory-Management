import React from 'react';
import { Search, Plus, X } from 'lucide-react';
import { Button } from '../common/Button';

export const ProductFilterBar = ({
  searchQuery,
  onSearchChange,
  onAddClick,
  totalCount = 0,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search products by Name or SKU..."
          className="block w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-9 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Action Button & Counter */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-slate-500 font-medium hidden sm:inline-block">
          {totalCount} {totalCount === 1 ? 'Product' : 'Products'}
        </span>
        <Button onClick={onAddClick} icon={Plus} variant="primary">
          Add Product
        </Button>
      </div>
    </div>
  );
};

