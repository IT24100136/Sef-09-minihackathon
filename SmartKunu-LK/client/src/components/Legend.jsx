import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

const CEA_COLOR_CODES = [
  {
    category: 'Perishable Organic',
    colorName: 'Green',
    bgClass: 'bg-emerald-600 text-white',
    borderClass: 'border-emerald-700',
    description: 'Food scraps, garden waste, organic matter',
  },
  {
    category: 'Recyclable Plastics',
    colorName: 'Orange',
    bgClass: 'bg-orange-500 text-white',
    borderClass: 'border-orange-600',
    description: 'PET bottles, HDPE containers, polythene bags',
  },
  {
    category: 'Paper / Cardboard',
    colorName: 'Blue',
    bgClass: 'bg-blue-600 text-white',
    borderClass: 'border-blue-700',
    description: 'Cartons, newspapers, office papers, cardboard boxes',
  },
  {
    category: 'Glass',
    colorName: 'Red',
    bgClass: 'bg-red-600 text-white',
    borderClass: 'border-red-700',
    description: 'Bottles, glass jars, non-hazardous glassware',
  },
  {
    category: 'Electronic Waste / Metal',
    colorName: 'Brown',
    bgClass: 'bg-amber-800 text-white',
    borderClass: 'border-amber-900',
    description: 'Appliances, circuit boards, batteries, scrap metals',
  },
];

export default function Legend() {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-emerald-600" />
          <h2 className="text-lg font-bold text-slate-900">
            Central Environmental Authority (CEA) Waste Segregation Standards
          </h2>
        </div>
        <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-1 rounded-full border border-emerald-300">
          Official CEA Color Codes
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {CEA_COLOR_CODES.map((item) => (
          <div
            key={item.category}
            className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 space-y-2 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-md border ${item.bgClass} ${item.borderClass}`}
              >
                {item.colorName} Badge
              </span>
            </div>
            <h3 className="font-bold text-slate-800 text-sm leading-snug">{item.category}</h3>
            <p className="text-xs text-slate-500 leading-normal">{item.description}</p>
          </div>
        ))}
      </div>

      <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-4 flex items-start gap-3 text-xs text-emerald-950">
        <Info className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed font-medium">
          <strong className="text-emerald-900 font-bold">Why Segregation Matters for Dengue Prevention:</strong> Proper waste segregation ensures that non-perishables and plastic containers do not sit mixed in overflow dumps. Uncollected plastics trap rainwater during Sri Lankan monsoons, creating prime stagnant water breeding grounds for <em>Aedes aegypti</em> dengue mosquitoes and clogging urban drainage systems.
        </p>
      </div>
    </div>
  );
}