import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { LogOut, Building2, User } from 'lucide-react';
import { Button } from '../common/Button';

export const Navbar = () => {
  const { user, organization, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-6 backdrop-blur-md">
      {/* Organization Pill */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200/80 text-xs font-semibold text-slate-700">
          <Building2 className="w-4 h-4 text-brand-600" />
          <span>{organization?.name || 'Organization'}</span>
        </div>
      </div>

      {/* User Info & Actions */}
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-600">
          <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs uppercase">
            {user?.email?.charAt(0) || 'U'}
          </div>
          <span className="font-medium text-slate-700">{user?.email}</span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          icon={LogOut}
          className="text-slate-500 hover:text-rose-600 hover:bg-rose-50"
        >
          Logout
        </Button>
      </div>
    </header>
  );
};

