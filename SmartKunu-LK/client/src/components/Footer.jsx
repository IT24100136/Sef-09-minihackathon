import React from 'react';
import { ShieldCheck, Info, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Section 1: Portal Overview */}
          <div>
            <h3 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              SmartKunu-LK
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Empowering Sri Lankan citizens with real-time municipal waste collection schedules, 
              segregation guidelines, and transparent complaint reporting for cleaner cities.
            </p>
          </div>

          {/* Section 2: Municipalities Covered */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-emerald-400" />
              Supported Municipal Councils
            </h4>
            <ul className="text-sm text-slate-400 space-y-1.5">
              <li>• Colombo Municipal Council (CMC Wards 01-47)</li>
              <li>• Dehiwala - Mount Lavinia Municipal Council</li>
              <li>• Sri Jayawardenepura Kotte MC</li>
              <li>• Kandy Municipal Council</li>
            </ul>
          </div>

          {/* Section 3: Important Rules */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
              <Info className="h-4 w-4 text-amber-400" />
              National Segregation Rule
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed bg-slate-800 p-3 rounded-lg border border-slate-700">
              Under National Environmental Act regulations, all municipal trucks will strictly reject unsegregated household waste. Ensure organic waste is separated from recyclable plastics and paper.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-6 text-center text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} SmartKunu-LK Initiative. Ministry of Local Government & Provincial Councils.</p>
          <div className="flex gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Central Environmental Authority (CEA)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
