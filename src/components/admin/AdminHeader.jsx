import React from 'react';
import { Menu, ShieldAlert, Sparkles } from 'lucide-react';

export default function AdminHeader({ onOpenSidebar, title = 'Admin Dashboard' }) {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between text-white">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:bg-slate-800"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-500" />
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-semibold">
        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
        <span>System Admin Mode</span>
      </div>
    </header>
  );
}
