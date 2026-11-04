import React, { forwardRef } from 'react';

export const Input = forwardRef(
  (
    {
      label,
      error,
      helperText,
      type = 'text',
      id,
      name,
      className = '',
      required = false,
      ...props
    },
    ref
  ) => {
    const inputId = id || name;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            {label} {required && <span className="text-rose-500">*</span>}
          </label>
        )}
        <div className="relative rounded-lg shadow-sm">
          <input
            ref={ref}
            id={inputId}
            name={name}
            type={type}
            required={required}
            className={`block w-full rounded-lg text-sm px-3.5 py-2.5 transition-colors duration-150 border bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
              error
                ? 'border-rose-300 text-rose-900 focus:border-rose-500 focus:ring-rose-200'
                : 'border-slate-300 text-slate-900 focus:border-brand-500 focus:ring-brand-200'
            } disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 ${className}`}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-xs text-rose-600 font-medium">{error}</p>}
        {!error && helperText && (
          <p className="mt-1 text-xs text-slate-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

