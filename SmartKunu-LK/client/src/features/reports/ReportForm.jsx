import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { submitReportApi } from '../../services/api';
import { 
  AlertTriangle, 
  Send, 
  CheckCircle2, 
  Phone, 
  User, 
  MapPin, 
  FileText, 
  Flame, 
  Clock, 
  ShieldAlert 
} from 'lucide-react';

// Sri Lankan Mobile Number Regex: Matches 07XXXXXXXX, 947XXXXXXXX, or 7XXXXXXXX (9 digits starting with 7)
const SRI_LANKA_MOBILE_REGEX = /^(?:0|94)?7[0-9]{8}$/;

// Zod Validation Schema
const reportSchema = z.object({
  reporterName: z.string().min(1, 'Reporter Name is required.'),
  mobileNumber: z
    .string()
    .min(1, 'Mobile number is required.')
    .regex(
      SRI_LANKA_MOBILE_REGEX,
      'Invalid Sri Lankan mobile number! Format must be 07XXXXXXXX or 947XXXXXXXX (e.g., 0771234567)'
    ),
  wardName: z.string().min(1, 'Please select a Ward / Location.'),
  hazardCategory: z.string().min(1, 'Please select a Waste Hazard Category.'),
  description: z.string().min(10, 'Description must be at least 10 characters long.'),
});

const INITIAL_ACTIVE_COMPLAINTS = [
  {
    id: 101,
    reporterName: 'Sunil Perera',
    mobileNumber: '0778901234',
    wardName: 'Colombo 03 - Kollupitiya',
    hazardCategory: 'Illegal Dumping',
    description: 'Uncollected pile of polythene and commercial debris dumped near Marine Drive junction blocking sidewalk.',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    status: 'Investigating',
  },
  {
    id: 102,
    reporterName: 'Nimali Jayasinghe',
    mobileNumber: '0712345678',
    wardName: 'Dehiwala Ward 4 - Nedimala',
    hazardCategory: 'Missed Collection',
    description: 'Organic waste truck skipped Nedimala 2nd Lane on Wednesday pickup route. Bins overflowing.',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    status: 'Dispatched',
  },
];

const WARD_LIST = [
  'Colombo 01 - Fort',
  'Colombo 02 - Slave Island',
  'Colombo 03 - Kollupitiya',
  'Colombo 04 - Bambalapitiya',
  'Colombo 07 - Cinnamon Gardens',
  'Dehiwala Ward 4 - Nedimala',
  'Kotte Ward 2 - Rajagiriya',
  'Kandy Central Ward 1',
];

const HAZARD_CATEGORIES = [
  'Illegal Dumping',
  'Missed Collection',
  'Toxic / Hazardous Chemical',
  'E-Waste Abandonment',
  'Blocked Drain Overflow',
];

export default function ReportForm() {
  const [activeComplaints, setActiveComplaints] = useState(INITIAL_ACTIVE_COMPLAINTS);
  const [successAlert, setSuccessAlert] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      reporterName: '',
      mobileNumber: '',
      wardName: '',
      hazardCategory: '',
      description: '',
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSuccessAlert(null);

    try {
      // Send report to ASP.NET Core backend API
      const result = await submitReportApi(data);

      const newComplaint = {
        id: result?.id || Date.now(),
        reporterName: data.reporterName,
        mobileNumber: data.mobileNumber,
        wardName: data.wardName,
        hazardCategory: data.hazardCategory,
        description: data.description,
        createdAt: result?.createdAt || new Date().toISOString(),
        status: 'Logged',
      };

      // Dynamically prepend new complaint to active complaints feed state
      setActiveComplaints((prev) => [newComplaint, ...prev]);

      // Show visual confirmation alert
      setSuccessAlert({
        id: newComplaint.id,
        ward: data.wardName,
        category: data.hazardCategory,
        message: 'Your report has been successfully logged with the Municipal Environmental Unit.',
      });

      // Reset form fields
      reset();
    } catch (err) {
      console.error('Error submitting complaint:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 space-y-10">
      {/* Header section */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-bold border border-amber-300">
          <ShieldAlert className="h-4 w-4 text-amber-600" />
          <span>Municipal Citizen Complaint Portal</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Report Illegal Dumping or Missed Collection
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base">
          Submit details regarding uncollected waste, illegal roadside dumping, or hazardous environmental issues. 
          Reports are directly routed to the relevant Municipal Council ward officers.
        </p>
      </div>

      {/* Visual Success Alert */}
      {successAlert && (
        <div className="bg-emerald-50 border border-emerald-400 p-5 rounded-xl shadow-md flex items-start gap-4 animate-fade-in">
          <CheckCircle2 className="h-7 w-7 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-emerald-900 font-bold text-base">Complaint Successfully Filed!</h3>
              <span className="text-xs bg-emerald-200 text-emerald-900 px-2.5 py-0.5 rounded-full font-mono font-bold">
                REF #{successAlert.id}
              </span>
            </div>
            <p className="text-emerald-800 text-sm">{successAlert.message}</p>
            <p className="text-xs text-emerald-700 font-medium">
              Location: <span className="font-semibold">{successAlert.ward}</span> | Category:{' '}
              <span className="font-semibold">{successAlert.category}</span>
            </p>
          </div>
        </div>
      )}

      {/* Main Report Form Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg">
            <AlertTriangle className="h-5 w-5 text-amber-400" />
            <h2>Environmental Incident Report Form</h2>
          </div>
          <span className="text-xs text-slate-400">All fields required</span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Field 1: Reporter Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Reporter Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Kanthi Silva"
                  {...register('reporterName')}
                  className={`w-full bg-slate-50 border ${
                    errors.reporterName ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-emerald-500'
                  } text-slate-800 text-sm rounded-lg focus:ring-2 focus:outline-none p-3 pl-10`}
                />
                <User className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
              </div>
              {errors.reporterName && (
                <p className="text-red-500 text-xs font-medium mt-1">{errors.reporterName.message}</p>
              )}
            </div>

            {/* Field 2: Mobile Number (Sri Lankan regex validation) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Mobile Number (Sri Lanka)
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="0771234567 or 94771234567"
                  {...register('mobileNumber')}
                  className={`w-full bg-slate-50 border ${
                    errors.mobileNumber ? 'border-red-500 focus:ring-red-500 bg-red-50/20' : 'border-slate-300 focus:ring-emerald-500'
                  } text-slate-800 text-sm rounded-lg focus:ring-2 focus:outline-none p-3 pl-10`}
                />
                <Phone className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
              </div>
              {errors.mobileNumber ? (
                <div className="flex items-center gap-1.5 text-red-600 text-xs font-semibold bg-red-50 p-2 rounded border border-red-200 mt-1">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0 text-red-500" />
                  <span>{errors.mobileNumber.message}</span>
                </div>
              ) : (
                <p className="text-xs text-slate-500">Sri Lankan mobile formats: 07XXXXXXXX or 947XXXXXXXX</p>
              )}
            </div>

            {/* Field 3: Ward / Location Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Ward / Incident Location
              </label>
              <div className="relative">
                <select
                  {...register('wardName')}
                  className={`w-full bg-slate-50 border ${
                    errors.wardName ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-emerald-500'
                  } text-slate-800 text-sm rounded-lg focus:ring-2 focus:outline-none p-3 pl-10 appearance-none cursor-pointer`}
                >
                  <option value="">-- Select Ward Location --</option>
                  {WARD_LIST.map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </select>
                <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
              </div>
              {errors.wardName && (
                <p className="text-red-500 text-xs font-medium mt-1">{errors.wardName.message}</p>
              )}
            </div>

            {/* Field 4: Waste Hazard Category */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Waste Hazard Category
              </label>
              <div className="relative">
                <select
                  {...register('hazardCategory')}
                  className={`w-full bg-slate-50 border ${
                    errors.hazardCategory ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-emerald-500'
                  } text-slate-800 text-sm rounded-lg focus:ring-2 focus:outline-none p-3 pl-10 appearance-none cursor-pointer`}
                >
                  <option value="">-- Select Hazard Category --</option>
                  {HAZARD_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <Flame className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
              </div>
              {errors.hazardCategory && (
                <p className="text-red-500 text-xs font-medium mt-1">{errors.hazardCategory.message}</p>
              )}
            </div>
          </div>

          {/* Field 5: Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Detailed Incident Description (Min 10 chars)
            </label>
            <div className="relative">
              <textarea
                rows={4}
                placeholder="Describe exact street location, landmark, volume of waste, or blockage details..."
                {...register('description')}
                className={`w-full bg-slate-50 border ${
                  errors.description ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-emerald-500'
                } text-slate-800 text-sm rounded-lg focus:ring-2 focus:outline-none p-3 pl-10`}
              />
              <FileText className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
            </div>
            {errors.description && (
              <p className="text-red-500 text-xs font-medium mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Send className="h-5 w-5" />
            <span>{isSubmitting ? 'Submitting Complaint to Council...' : 'Submit Official Report'}</span>
          </button>
        </form>
      </div>

      {/* Active Complaints Feed */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-emerald-600" />
            <h2 className="text-xl font-bold text-slate-900">Active Complaints Feed</h2>
          </div>
          <span className="bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1 rounded-full border border-slate-300">
            {activeComplaints.length} Live Incident{activeComplaints.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="space-y-4">
          {activeComplaints.map((complaint) => (
            <div
              key={complaint.id}
              className="bg-slate-50 rounded-xl p-5 border border-slate-200 hover:border-emerald-300 transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/70 pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">{complaint.hazardCategory}</span>
                  <span className="bg-amber-100 text-amber-900 text-xs px-2 py-0.5 rounded font-semibold border border-amber-300">
                    {complaint.wardName}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span>Reporter: {complaint.reporterName} ({complaint.mobileNumber})</span>
                  <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                    {complaint.status || 'Active'}
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {complaint.description}
              </p>

              <div className="text-[11px] text-slate-400 text-right">
                Logged: {new Date(complaint.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
