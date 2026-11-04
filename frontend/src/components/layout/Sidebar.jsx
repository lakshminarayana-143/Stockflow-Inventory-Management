import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Boxes, Settings, Package2 } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Products', href: '/products', icon: Boxes },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const Sidebar = () => {
  return (
    <aside className="w-64 flex-shrink-0 border-r border-slate-200/80 bg-white min-h-screen flex flex-col justify-between">
      <div>
        {/* Brand Logo & Name */}
        <div className="flex h-16 items-center gap-3 px-6 border-b border-slate-200/80">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-md shadow-brand-500/20">
            <Package2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-slate-900">
              Stock<span className="text-brand-600">Flow</span>
            </span>
            <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              SaaS Inventory
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1.5">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-brand-50 text-brand-700 font-semibold shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-5 h-5 ${
                        isActive ? 'text-brand-600' : 'text-slate-400'
                      }`}
                    />
                    <span>{item.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-100 text-center">
        <p className="text-[11px] text-slate-400 font-medium">StockFlow MVP v0.1</p>
      </div>
    </aside>
  );
};

