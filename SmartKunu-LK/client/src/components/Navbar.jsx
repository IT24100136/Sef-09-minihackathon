import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Trash2, Calendar, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  return (
    <header className="bg-emerald-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="bg-emerald-600 p-2.5 rounded-xl shadow-inner flex items-center justify-center hover:bg-emerald-500 transition-colors">
              <Trash2 className="h-7 w-7 text-white" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <Link to="/" className="font-extrabold text-2xl tracking-tight text-white hover:text-emerald-300 transition-colors">
                  SmartKunu LK
                </Link>
                {/* Clicking on Civic Portal badge redirects to Admin Portal */}
                <Link
                  to="/admin"
                  title="Click to access Municipal Admin Portal"
                  className="bg-emerald-800 hover:bg-amber-600 text-emerald-100 hover:text-white text-xs px-2.5 py-0.5 rounded-full font-bold border border-emerald-500 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ShieldCheck className="h-3 w-3 text-amber-300" />
                  <span>Civic Portal</span>
                  <span className="text-[10px] bg-amber-400 text-slate-950 px-1 py-0 rounded font-black uppercase">
                    Admin
                  </span>
                </Link>
              </div>
              <p className="text-xs text-emerald-200 hidden sm:block">
                Sri Lanka Urban Waste Management & Dengue Prevention
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-2 sm:space-x-4">
            <Link
              to="/"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                location.pathname === '/'
                  ? 'bg-emerald-700 text-white shadow-md'
                  : 'text-emerald-100 hover:bg-emerald-800 hover:text-white'
              }`}
            >
              <Calendar className="h-4 w-4 text-emerald-300" />
              <span>Collection Schedules</span>
            </Link>

            <Link
              to="/report"
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold shadow-md transition-all ${
                location.pathname === '/report'
                  ? 'bg-amber-600 text-white ring-2 ring-amber-400'
                  : 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow-amber-900/20'
              }`}
            >
              <AlertTriangle className="h-4 w-4" />
              <span>Report Dumping</span>
            </Link>

            <Link
              to="/admin"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                location.pathname === '/admin'
                  ? 'bg-purple-700 text-white shadow-md ring-2 ring-purple-400'
                  : 'bg-emerald-950 text-purple-200 hover:bg-purple-800 hover:text-white border border-purple-500/40'
              }`}
            >
              <ShieldCheck className="h-4 w-4 text-purple-300" />
              <span>Admin Portal</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}