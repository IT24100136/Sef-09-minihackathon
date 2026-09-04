import React, { useState, useMemo } from 'react';
import Legend from '../../components/Legend';
import { 
  Filter, 
  RotateCcw, 
  MapPin, 
  Calendar, 
  Truck, 
  CheckCircle2, 
  AlertCircle, 
  Search,
  Check
} from 'lucide-react';

const SCHEDULE_DATASET = [
  {
    id: 1,
    municipality: 'Colombo Municipal Council',
    ward: 'Colombo 03 - Kollupitiya',
    wasteCategory: 'Perishable Organic',
    pickupDates: 'Every Monday & Thursday',
    routeInfo: 'Galle Road Corridor',
    guidelines: 'CMC will reject mixed polythene bags',
  },
  {
    id: 2,
    municipality: 'Colombo Municipal Council',
    ward: 'Colombo 07 - Cinnamon Gardens',
    wasteCategory: 'Recyclable Plastics',
    pickupDates: 'Every Wednesday',
    routeInfo: 'Dharmapala Mawatha Sector',
    guidelines: 'Clean & dry plastics only',
  },
  {
    id: 3,
    municipality: 'Dehiwala-Mount Lavinia MC',
    ward: 'Dehiwala Ward 4',
    wasteCategory: 'Paper/Cardboard',
    pickupDates: 'Every Tuesday',
    routeInfo: 'Vandervort Place & Station Rd',
    guidelines: 'Flatten all cardboard cartons',
  },
  {
    id: 4,
    municipality: 'Dehiwala-Mount Lavinia MC',
    ward: 'Dehiwala Ward 4',
    wasteCategory: 'Electronic Waste',
    pickupDates: 'Last Friday of the month',
    routeInfo: 'Ward 4 Community Drop',
    guidelines: 'Includes appliances, batteries & scrap metal',
  },
  {
    id: 5,
    municipality: 'Kaduwela Municipal Council',
    ward: 'Battaramulla Ward 2',
    wasteCategory: 'Perishable Organic',
    pickupDates: 'Monday, Wednesday, Friday',
    routeInfo: 'Main Road Zone',
    guidelines: 'Only biodegradable waste collected',
  },
];

const WARD_OPTIONS = [
  'All Wards',
  'Colombo 03 - Kollupitiya',
  'Colombo 07 - Cinnamon Gardens',
  'Dehiwala Ward 4',
  'Battaramulla Ward 2',
];

const CATEGORY_OPTIONS = [
  'All Categories',
  'Perishable Organic',
  'Recyclable Plastics',
  'Paper/Cardboard',
  'Electronic Waste',
];

export default function ScheduleView() {
  const [selectedWard, setSelectedWard] = useState('All Wards');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  // Filter schedules based on active dropdown selections
  const filteredSchedules = useMemo(() => {
    return SCHEDULE_DATASET.filter((item) => {
      const matchWard =
        selectedWard === 'All Wards' || item.ward.toLowerCase() === selectedWard.toLowerCase();
      const matchCategory =
        selectedCategory === 'All Categories' ||
        item.wasteCategory.toLowerCase() === selectedCategory.toLowerCase();
      return matchWard && matchCategory;
    });
  }, [selectedWard, selectedCategory]);

  const handleReset = () => {
    setSelectedWard('All Wards');
    setSelectedCategory('All Categories');
  };

  // CEA Color badge mapping helper
  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case 'Perishable Organic':
        return 'bg-emerald-600 text-white border-emerald-700';
      case 'Recyclable Plastics':
        return 'bg-orange-500 text-white border-orange-600';
      case 'Paper/Cardboard':
        return 'bg-blue-600 text-white border-blue-700';
      case 'Electronic Waste':
        return 'bg-amber-800 text-white border-amber-900';
      default:
        return 'bg-slate-600 text-white border-slate-700';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Problem & Solution Context Banner */}
      <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-emerald-800/50 space-y-6">
        <div className="flex items-center gap-3">
          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
            Public Health & Civic Action Initiative
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-emerald-800/60">
          {/* Problem Block */}
          <div className="bg-red-950/40 border border-red-800/40 rounded-xl p-5 space-y-2">
            <h2 className="text-red-400 font-bold text-base flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-400" />
              The Problem
            </h2>
            <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
              Uncollected bulk waste in suburban councils like Dehiwala often ends up illegally dumped on roadsides, trapping stagnant water and creating dengue mosquito breeding grounds during monsoons.
            </p>
          </div>

          {/* Solution Block */}
          <div className="bg-emerald-950/40 border border-emerald-700/50 rounded-xl p-5 space-y-2">
            <h2 className="text-emerald-300 font-bold text-base flex items-center gap-2">
              <Check className="h-5 w-5 text-emerald-400" />
              The Solution
            </h2>
            <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
              A rapid-response portal that gives residents a searchable municipal timetable and a direct channel to report missed pickups and illegal dumping.
            </p>
          </div>
        </div>
      </div>

      {/* 2. CEA Waste Segregation Legend Component */}
      <Legend />

      {/* 3. Interactive Filter Controls Card */}
      <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-700">
              <Filter className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Schedule Search & Filter</h2>
              <p className="text-xs text-slate-500">Filter collection routes by Municipal Ward or Waste Category</p>
            </div>
          </div>

          {(selectedWard !== 'All Wards' || selectedCategory !== 'All Categories') && (
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 text-xs text-emerald-700 hover:text-emerald-900 font-bold bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-2 rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset Filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Dropdown 1: Municipal Council / Ward */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Municipal Council / Ward
            </label>
            <div className="relative">
              <select
                value={selectedWard}
                onChange={(e) => setSelectedWard(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 p-3 pr-10 font-medium cursor-pointer appearance-none transition-all"
              >
                {WARD_OPTIONS.map((ward) => (
                  <option key={ward} value={ward}>
                    {ward}
                  </option>
                ))}
              </select>
              <MapPin className="absolute right-3 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Dropdown 2: Waste Category */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Waste Category (CEA Standard)
            </label>
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 p-3 pr-10 font-medium cursor-pointer appearance-none transition-all"
              >
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <Filter className="absolute right-3 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Results Count Header */}
      <div className="flex items-center justify-between px-1">
        <span className="text-sm font-bold text-slate-700">
          Showing {filteredSchedules.length} of {SCHEDULE_DATASET.length} schedules
        </span>
        <span className="text-xs text-slate-500">Official Municipal Timetables</span>
      </div>

      {/* 5. Dynamic Responsive Schedule Table & Cards */}
      <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
        {filteredSchedules.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <Search className="h-12 w-12 text-slate-300 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-800">No matching collection schedules found</h3>
              <p className="text-xs text-slate-500">
                Try selecting a different ward or category, or clear your search filters.
              </p>
            </div>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 text-xs bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white text-xs uppercase font-bold tracking-wider">
                  <th className="py-4 px-6">Council & Ward</th>
                  <th className="py-4 px-4">Waste Category</th>
                  <th className="py-4 px-4">Pickup Days</th>
                  <th className="py-4 px-4">Truck Route</th>
                  <th className="py-4 px-6">Segregation Rules</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {filteredSchedules.map((schedule) => (
                  <tr key={schedule.id} className="hover:bg-slate-50 transition-colors">
                    {/* Column 1: Council & Ward */}
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900 text-base">{schedule.ward}</div>
                      <div className="text-xs text-slate-500 font-medium">{schedule.municipality}</div>
                    </td>

                    {/* Column 2: Waste Category */}
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-3 py-1 text-xs font-bold rounded-lg border shadow-sm ${getCategoryBadgeClass(
                          schedule.wasteCategory
                        )}`}
                      >
                        {schedule.wasteCategory}
                      </span>
                    </td>

                    {/* Column 3: Pickup Days */}
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-800 flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                        <span>{schedule.pickupDates}</span>
                      </div>
                    </td>

                    {/* Column 4: Truck Route */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1.5 rounded-md border border-slate-300 max-w-fit">
                        <Truck className="h-3.5 w-3.5 text-slate-500 flex-shrink-0" />
                        <span>{schedule.routeInfo}</span>
                      </div>
                    </td>

                    {/* Column 5: Segregation Rules */}
                    <td className="py-4 px-6 text-xs text-slate-700 font-medium leading-relaxed max-w-xs">
                      <div className="flex items-start gap-1.5">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{schedule.guidelines}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}