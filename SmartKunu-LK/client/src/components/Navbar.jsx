import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Trash2, Calendar, AlertTriangle } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  return (
    <header className="bg-emerald-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Name */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-emerald-600 p-2.5 rounded-xl shadow-inner flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
              <Trash2 className="h-7 w-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-2xl tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                  SmartKunu LK
                </span>
                <span className="bg-emerald-700 text-emerald-200 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-emerald-500">
                  Civic Portal
                </span>
              </div>
              <p className="text-xs text-emerald-200 hidden sm:block">
                Sri Lanka Urban Waste Management & Dengue Prevention
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-3 sm:space-x-4">
            <Link
              to="/"
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
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
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold shadow-md transition-all ${
                location.pathname === '/report'
                  ? 'bg-amber-600 text-white ring-2 ring-amber-400'
                  : 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow-amber-900/20'
              }`}
            >
              <AlertTriangle className="h-4 w-4" />
              <span>Report Dumping / Missed</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}