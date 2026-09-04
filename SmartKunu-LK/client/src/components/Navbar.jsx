import React from 'react';
import { NavLink } from 'react-router-dom';
import { Trash2, Calendar, AlertTriangle, PhoneCall } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="bg-emerald-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-600 p-2.5 rounded-xl shadow-inner flex items-center justify-center">
              <Trash2 className="h-7 w-7 text-emerald-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-2xl tracking-tight text-emerald-400">
                  SmartKunu
                </span>
                <span className="bg-emerald-700 text-emerald-200 text-xs px-2 py-0.5 rounded-full font-semibold border border-emerald-500">
                  LK
                </span>
              </div>
              <p className="text-xs text-emerald-200 hidden sm:block">
                Sri Lanka Municipal Waste Management & Civic Portal
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-2 sm:space-x-4">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-md'
                    : 'text-emerald-100 hover:bg-emerald-800 hover:text-white'
                }`
              }
            >
              <Calendar className="h-4 w-4" />
              <span>Ward Schedules</span>
            </NavLink>

            <NavLink
              to="/report"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'bg-emerald-800 text-emerald-100 hover:bg-amber-700 hover:text-white'
                }`
              }
            >
              <AlertTriangle className="h-4 w-4 text-amber-300" />
              <span>Report Issue</span>
            </NavLink>
          </nav>

          {/* Civic Hotline Badge */}
          <div className="hidden lg:flex items-center gap-2 text-xs bg-emerald-950 px-3 py-1.5 rounded-full border border-emerald-700/50">
            <PhoneCall className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-emerald-300 font-medium">CMC Helpline: 1990</span>
          </div>
        </div>
      </div>
    </header>
  );
}
