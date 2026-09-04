import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '../../services/api';
import { 
  AlertTriangle, 
  Send, 
  CheckCircle2, 
  Phone, 
  User, 
  MapPin, 
  FileText, 
  Clock, 
  Layers,
  WifiOff
} from 'lucide-react';

const SRI_LANKA_MOBILE_REGEX = /^(?:0|94)?7[0-9]{8}$/;

const reportSchema = z.object({
  reporterName: z.string().min(2, 'Name must be at least 2 characters'),
  mobileNumber: z
    .string()
    .min(1, 'Mobile number is required')
    .regex(SRI_LANKA_MOBILE_REGEX, 'Must be a valid 10-digit Sri Lankan mobile number, e.g., 07XXXXXXXX'),
  ward: z.string().min(2, 'Ward/Location is required'),
  wasteCategory: z.string().min(1, 'Please select a waste hazard category'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
});

const CATEGORY_OPTIONS = [
  'Perishable Organic',
  'Recyclable Plastics',
  'Paper/Cardboard',
  'Electronic Waste',
  'Glass/Metal',
  'Other Hazard',
];

export default function ReportForm() {
  const [submitStatus, setSubmitStatus] = useState(null);
  const [activeComplaints, setActiveComplaints] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      reporterName: '',
      mobileNumber: '',
      ward: '',
      wasteCategory: '',
      description: '',
    },
  });

  const onSubmit = async (data) => {
    setSubmitStatus(null);
    const newReportObj = {
      id: Date.now(),
      reporterName: data.reporterName,
      mobileNumber: data.mobileNumber,
      ward: data.ward,
      wasteCategory: data.wasteCategory,
      description: data.description,
      createdAt: new Date().toISOString(),
      timestampText: 'Just Now',
    };

    try {
      // POST request to backend API
      await api.post('/reports', {
        reporterName: data.reporterName,
        mobileNumber: data.mobileNumber,
        wardName: data.ward,
        hazardCategory: data.wasteCategory,
        description: data.description,
      });

      setSubmitStatus({
        type: 'success',
        message: 'Report submitted successfully to the municipal database!',
      });
      setActiveComplaints((prev) => [newReportObj, ...prev]);
      reset();
    } catch (error) {
      console.warn('API connection offline or error encountered. Operating in local demo mode:', error);
      // Fallback for hackathon demo mode: still prepend to activeComplaints
      setSubmitStatus({
        type: 'warning',
        message: 'Server offline / local demo mode: Report saved locally to active complaints feed.',
      });
      setActiveComplaints((prev) => [newReportObj, ...prev]);
      reset();
    }
  };

  const getBadgeColorClass = (category) => {
    switch (category) {
      case 'Perishable Organic':
        return 'bg-emerald-600 text-white';
      case 'Recyclable Plastics':
        return 'bg-orange-500 text-white';
      case 'Paper/Cardboard':
        return 'bg-blue-600 text-white';
      case 'Electronic Waste':
        return 'bg-amber-800 text-white';
      case 'Glass/Metal':
        return 'bg-red-600 text-white';
      default:
        return 'bg-slate-700 text-white';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 space-y-8">
      {/* Title & Subtitle Banner */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full border border-amber-300">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <span>Dengue Prevention & Rapid Response</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Report Illegal Dumping & Missed Collection
        </h1>
        <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
          Help keep our city clean and prevent dengue. Report hazards here.
        </p>
      </div>

      {/* Visual Confirmation Status Alerts */}
      {submitStatus && (
        <div
          className={`p-4 rounded-xl border flex items-start gap-3 shadow-md ${
            submitStatus.type === 'success'
              ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
              : 'bg-amber-50 border-amber-400 text-amber-900'
          }`}
        >
          {submitStatus.type === 'success' ? (
            <CheckCircle2 className="h-6 w-6 text-emerald-600 flex-shrink-0 mt-0.5" />
          ) : (
            <WifiOff className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
          )}
          <div>
            <h3 className="font-bold text-sm">
              {submitStatus.type === 'success' ? 'Report Logged Successfully!' : 'Local Demo Mode Active'}
            </h3>
            <p className="text-xs sm:text-sm mt-0.5">{submitStatus.message}</p>
          </div>
        </div>
      )}

      {/* Report Form Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg">
            <AlertTriangle className="h-5 w-5 text-amber-400" />
            <span>Hazard Incident Report</span>
          </div>
          <span className="text-xs text-slate-400 font-medium">Sri Lanka Municipal Incident Desk</span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input 1: Reporter Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Reporter Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter your full name"
                  {...register('reporterName')}
                  className={`w-full bg-slate-50 border ${
                    errors.reporterName ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-emerald-500'
                  } text-slate-900 text-sm rounded-xl focus:ring-2 focus:outline-none p-3 pl-10`}
                />
                <User className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
              </div>
              {errors.reporterName && (
                <p className="text-red-500 text-xs font-semibold mt-1">{errors.reporterName.message}</p>
              )}
            </div>

            {/* Input 2: Mobile Number */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Mobile Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. 0771234567 or 94771234567"
                  {...register('mobileNumber')}
                  className={`w-full bg-slate-50 border ${
                    errors.mobileNumber ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-emerald-500'
                  } text-slate-900 text-sm rounded-xl focus:ring-2 focus:outline-none p-3 pl-10`}
                />
                <Phone className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
              </div>
              {errors.mobileNumber && (
                <p className="text-red-500 text-xs font-semibold mt-1">{errors.mobileNumber.message}</p>
              )}
            </div>

            {/* Input 3: Ward / Location Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Ward / Location Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Dehiwala Ward 4 or Colombo 03"
                  {...register('ward')}
                  className={`w-full bg-slate-50 border ${
                    errors.ward ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-emerald-500'
                  } text-slate-900 text-sm rounded-xl focus:ring-2 focus:outline-none p-3 pl-10`}
                />
                <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
              </div>
              {errors.ward && (
                <p className="text-red-500 text-xs font-semibold mt-1">{errors.ward.message}</p>
              )}
            </div>

            {/* Input 4: Waste Hazard Category */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Waste Hazard Category
              </label>
              <div className="relative">
                <select
                  {...register('wasteCategory')}
                  className={`w-full bg-slate-50 border ${
                    errors.wasteCategory ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-emerald-500'
                  } text-slate-900 text-sm rounded-xl focus:ring-2 focus:outline-none p-3 pl-10 appearance-none cursor-pointer font-medium`}
                >
                  <option value="">-- Select Waste Hazard Category --</option>
                  {CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <Layers className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
              </div>
              {errors.wasteCategory && (
                <p className="text-red-500 text-xs font-semibold mt-1">{errors.wasteCategory.message}</p>
              )}
            </div>
          </div>

          {/* Input 5: Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Description
            </label>
            <div className="relative">
              <textarea
                rows={4}
                placeholder="Describe exact street location, landmark, or blockage details (minimum 10 characters)..."
                {...register('description')}
                className={`w-full bg-slate-50 border ${
                  errors.description ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-emerald-500'
                } text-slate-900 text-sm rounded-xl focus:ring-2 focus:outline-none p-3 pl-10`}
              />
              <FileText className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
            </div>
            {errors.description && (
              <p className="text-red-500 text-xs font-semibold mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Send className="h-5 w-5" />
            <span>{isSubmitting ? 'Submitting Report...' : 'Submit Incident Report'}</span>
          </button>
        </form>
      </div>

      {/* Live Feed UI */}
      <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-emerald-600" />
            <h2 className="text-xl font-bold text-slate-900">Active Complaints (Live Feed)</h2>
          </div>
          <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full border border-emerald-300">
            {activeComplaints.length} Reported
          </span>
        </div>

        {activeComplaints.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <p className="text-slate-500 font-medium text-sm">
              No new reports submitted in this session.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeComplaints.map((complaint) => (
              <div
                key={complaint.id}
                className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-3 shadow-sm hover:border-emerald-300 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-base">{complaint.ward}</span>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-md shadow-sm ${getBadgeColorClass(
                        complaint.wasteCategory
                      )}`}
                    >
                      {complaint.wasteCategory}
                    </span>
                  </div>
                  <span className="text-xs text-emerald-700 font-bold bg-emerald-100 px-2.5 py-0.5 rounded-full self-start sm:self-auto border border-emerald-300">
                    {complaint.timestampText}
                  </span>
                </div>

                <p className="text-sm text-slate-700 leading-relaxed font-normal">
                  {complaint.description}
                </p>

                <div className="flex justify-between items-center text-xs text-slate-500 pt-1 border-t border-slate-200/50">
                  <span>Reporter: <strong className="text-slate-700">{complaint.reporterName}</strong></span>
                  <span className="font-mono text-[11px] text-slate-400">Mobile: {complaint.mobileNumber}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}