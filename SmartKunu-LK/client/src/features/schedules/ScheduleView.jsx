import React, { useState, useMemo } from 'react';
import { Calendar, Filter, AlertCircle, CheckCircle2, MapPin, Truck, RefreshCw, Info } from 'lucide-react';

const STATIC_SCHEDULES = [
  {
    id: 1,
    council: 'Colombo Municipal Council',
    ward: 'Colombo 03 - Kollupitiya',
    category: 'Organic',
    pickupDays: 'Mon, Wed, Fri',
    timeWindow: '06:00 AM - 09:00 AM',
    routeCode: 'CMC-ROUTE-C03A',
    guideline: 'CMC will reject mixed polythene bags. All organic food waste must be placed in green bins or biodegradable bags.',
  },
  {
    id: 2,
    council: 'Colombo Municipal Council',
    ward: 'Colombo 03 - Kollupitiya',
    category: 'Plastics',
    pickupDays: 'Tuesdays & Saturdays',
    timeWindow: '07:00 AM - 11:00 AM',
    routeCode: 'CMC-ROUTE-C03B',
    guideline: 'Empty and rinse plastic containers. PET bottles must be crushed prior to handover.',
  },
  {
    id: 3,
    council: 'Colombo Municipal Council',
    ward: 'Colombo 07 - Cinnamon Gardens',
    category: 'Paper',
    pickupDays: 'Thursdays Only',
    timeWindow: '08:00 AM - 12:00 PM',
    routeCode: 'CMC-ROUTE-C07P',
    guideline: 'Flatten cardboard boxes and tie securely in newspaper bundles. Wet paper will not be collected.',
  },
  {
    id: 4,
    council: 'Dehiwala-Mount Lavinia MC',
    ward: 'Dehiwala Ward 4 - Nedimala',
    category: 'Organic',
    pickupDays: 'Daily (Mon - Sat)',
    timeWindow: '05:30 AM - 08:30 AM',
    routeCode: 'DMC-ROUTE-W04',
    guideline: 'Collection truck will sound horn twice. Keep wet food waste separate from garden cuttings.',
  },
  {
    id: 5,
    council: 'Dehiwala-Mount Lavinia MC',
    ward: 'Dehiwala Ward 4 - Nedimala',
    category: 'E-Waste',
    pickupDays: '1st & 3rd Sunday of Month',
    timeWindow: '09:00 AM - 01:00 PM',
    routeCode: 'DMC-SPECIAL-EW',
    guideline: 'Electronic items, battery cells, and CRT monitors must be handed directly to crew driver. Do not leave on curb.',
  },
  {
    id: 6,
    council: 'Sri Jayawardenepura Kotte MC',
    ward: 'Kotte Ward 2 - Rajagiriya',
    category: 'Plastics',
    pickupDays: 'Wednesdays Only',
    timeWindow: '06:30 AM - 10:00 AM',
    routeCode: 'KOT-ROUTE-R02',
    guideline: 'Poly-sacks mandatory for high-density polyethylene (HDPE). No sharp items inside plastic bags.',
  },
  {
    id: 7,
    council: 'Sri Jayawardenepura Kotte MC',
    ward: 'Kotte Ward 2 - Rajagiriya',
    category: 'Organic',
    pickupDays: 'Mon, Tue, Thu, Sat',
    timeWindow: '06:00 AM - 09:30 AM',
    routeCode: 'KOT-ROUTE-R02A',
    guideline: 'Home compost bin overflows must be sealed tightly. Strict prohibition on construction debris.',
  },
  {
    id: 8,
    council: 'Kandy Municipal Council',
    ward: 'Kandy Central Ward 1',
    category: 'E-Waste',
    pickupDays: 'Last Saturday of Month',
    timeWindow: '08:00 AM - 12:00 PM',
    routeCode: 'KMC-EWASTE-C01',
    guideline: 'Fluorescent tubes and lithium batteries must be wrapped in bubble wrap for safe municipal recycling.',
  },
  {
    id: 9,
    council: 'Kandy Municipal Council',
    ward: 'Kandy Central Ward 1',
    category: 'Paper',
    pickupDays: 'Tuesdays Only',
    timeWindow: '07:00 AM - 10:30 AM',
    routeCode: 'KMC-PAPER-C01',
    guideline: 'Ensure old newspapers and textbooks are bundled with jute string.',
  },
];

const WARD_OPTIONS = [
  'All Wards',
  'Colombo 03 - Kollupitiya',
  'Colombo 07 - Cinnamon Gardens',
  'Dehiwala Ward 4 - Nedimala',
  'Kotte Ward 2 - Rajagiriya',
  'Kandy Central Ward 1',
];

const CATEGORY_OPTIONS = ['All Categories', 'Organic', 'Plastics', 'Paper', 'E-Waste'];

export default function ScheduleView() {
  const [selectedWard, setSelectedWard] = useState('All Wards');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  // Filter schedules based on selected Ward and Category dropdowns
  const filteredSchedules = useMemo(() => {
    return STATIC_SCHEDULES.filter((item) => {
      const matchWard =
        selectedWard === 'All Wards' || item.ward.toLowerCase() === selectedWard.toLowerCase();
      const matchCategory =
        selectedCategory === 'All Categories' ||
        item.category.toLowerCase() === selectedCategory.toLowerCase();
      return matchWard && matchCategory;
    });
  }, [selectedWard, selectedCategory]);

  const handleResetFilters = () => {
    setSelectedWard('All Wards');
    setSelectedCategory('All Categories');
  };

  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case 'Organic':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Plastics':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Paper':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'E-Waste':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-emerald-700/60 text-emerald-200 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-500/40">
            <Truck className="h-3.5 w-3.5" />
            <span>Official Collection Timetable</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ward Waste Collection Schedule
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
            Select your Municipal Council ward and waste category below to find exact pickup days,
            route codes, and municipal compliance guidelines.
          </p>
        </div>
      </div>

      {/* Filter Controls Card */}
      <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-lg">
            <Filter className="h-5 w-5 text-emerald-600" />
            <h2>Interactive Schedule Filters</h2>
          </div>
          {(selectedWard !== 'All Wards' || selectedCategory !== 'All Categories') && (
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-emerald-700 font-medium cursor-pointer self-start sm:self-auto"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Reset Filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Dropdown 1: Municipal Council / Ward */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Municipal Council / Ward
            </label>
            <div className="relative">
              <select
                value={selectedWard}
                onChange={(e) => setSelectedWard(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-800 text-sm rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 p-3 pr-8 font-medium appearance-none transition-all cursor-pointer"
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
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Waste Category
            </label>
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-800 text-sm rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 p-3 pr-8 font-medium appearance-none transition-all cursor-pointer"
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

      {/* Segregation Guideline Alert Banner */}
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl shadow-sm flex items-start gap-3">
        <AlertCircle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h3 className="text-amber-900 font-bold text-sm">Important Municipal Rejection Notice</h3>
          <p className="text-amber-800 text-xs sm:text-sm leading-relaxed">
            <span className="font-semibold">CMC and regional councils will reject mixed polythene bags</span>. 
            All citizens are requested to strictly segregate household waste into designated color bins (Green for Organic, Blue for Plastics, Yellow for Paper).
          </p>
        </div>
      </div>

      {/* Schedules Table */}
      <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            Displaying {filteredSchedules.length} Collection Schedule{filteredSchedules.length !== 1 ? 's' : ''}
          </span>
          <span className="text-xs text-slate-500 font-medium">Updated Daily</span>
        </div>

        {filteredSchedules.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Info className="h-10 w-10 text-slate-300 mx-auto" />
            <p className="text-slate-600 font-medium">No collection schedules match your filter selection.</p>
            <button
              onClick={handleResetFilters}
              className="text-xs text-emerald-700 hover:underline font-semibold"
            >
              Clear filters to view all schedules
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 text-xs uppercase font-bold tracking-wider border-b border-slate-200">
                  <th className="py-3.5 px-4 sm:px-6">Municipal Ward / Council</th>
                  <th className="py-3.5 px-4">Waste Category</th>
                  <th className="py-3.5 px-4">Pickup Days & Window</th>
                  <th className="py-3.5 px-4">Route Code</th>
                  <th className="py-3.5 px-4 sm:px-6">Segregation Guideline</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {filteredSchedules.map((schedule) => (
                  <tr key={schedule.id} className="hover:bg-emerald-50/40 transition-colors">
                    <td className="py-4 px-4 sm:px-6 font-semibold text-slate-900">
                      <div>{schedule.ward}</div>
                      <div className="text-xs text-slate-500 font-normal">{schedule.council}</div>
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full border ${getCategoryBadgeClass(
                          schedule.category
                        )}`}
                      >
                        {schedule.category}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-emerald-600" />
                        {schedule.pickupDays}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">{schedule.timeWindow}</div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded border border-slate-300 font-semibold">
                        {schedule.routeCode}
                      </span>
                    </td>

                    <td className="py-4 px-4 sm:px-6 text-xs text-slate-700 leading-relaxed max-w-xs">
                      <div className="flex items-start gap-1.5">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{schedule.guideline}</span>
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
