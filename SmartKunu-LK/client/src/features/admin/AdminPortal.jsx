import React, { useState, useEffect, useMemo } from 'react';
import { 
  fetchReportsApi, 
  updateReportApi, 
  deleteReportApi,
  fetchSchedulesApi,
  createScheduleApi,
  updateScheduleApi,
  deleteScheduleApi
} from '../../services/api';
import { 
  ShieldCheck, 
  Trash2, 
  Edit, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  X, 
  Save, 
  Plus,
  Calendar,
  Truck,
  MapPin,
  FileText
} from 'lucide-react';

const STATUS_OPTIONS = ['Pending', 'In Progress', 'Dispatched', 'Resolved'];

const CATEGORY_OPTIONS = [
  'Perishable Organic',
  'Recyclable Plastics',
  'Paper/Cardboard',
  'Electronic Waste',
  'Glass/Metal',
  'Other Hazard',
];

export default function AdminPortal() {
  const [activeTab, setActiveTab] = useState('reports'); // 'reports' | 'schedules'

  // Reports state
  const [reports, setReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [reportSearch, setReportSearch] = useState('');
  const [reportStatusFilter, setReportStatusFilter] = useState('All');
  const [editingReport, setEditingReport] = useState(null);
  const [deletingReportId, setDeletingReportId] = useState(null);

  // Schedules state
  const [schedules, setSchedules] = useState([]);
  const [loadingSchedules, setLoadingSchedules] = useState(true);
  const [scheduleSearch, setScheduleSearch] = useState('');
  const [addingSchedule, setAddingSchedule] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    municipality: '',
    ward: '',
    wasteCategory: 'Perishable Organic',
    pickupDates: '',
    routeInfo: '',
    guidelines: '',
  });
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [deletingScheduleId, setDeletingScheduleId] = useState(null);

  // Notification Banner
  const [notification, setNotification] = useState(null);

  // Load Reports from Database
  const loadReports = async () => {
    setLoadingReports(true);
    try {
      const data = await fetchReportsApi();
      if (Array.isArray(data)) setReports(data);
    } catch (err) {
      console.warn('Failed to fetch reports:', err);
    } finally {
      setLoadingReports(false);
    }
  };

  // Load Schedules from Database
  const loadSchedules = async () => {
    setLoadingSchedules(true);
    try {
      const data = await fetchSchedulesApi();
      if (Array.isArray(data)) setSchedules(data);
    } catch (err) {
      console.warn('Failed to fetch schedules:', err);
    } finally {
      setLoadingSchedules(false);
    }
  };

  useEffect(() => {
    loadReports();
    loadSchedules();
  }, []);

  // Filtered Reports
  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      const matchesSearch =
        r.reporterName?.toLowerCase().includes(reportSearch.toLowerCase()) ||
        r.ward?.toLowerCase().includes(reportSearch.toLowerCase()) ||
        r.description?.toLowerCase().includes(reportSearch.toLowerCase());

      const matchesStatus =
        reportStatusFilter === 'All' || (r.status || 'Pending').toLowerCase() === reportStatusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [reports, reportSearch, reportStatusFilter]);

  // Filtered Schedules
  const filteredSchedules = useMemo(() => {
    return schedules.filter((s) => {
      return (
        s.municipality?.toLowerCase().includes(scheduleSearch.toLowerCase()) ||
        s.ward?.toLowerCase().includes(scheduleSearch.toLowerCase()) ||
        s.wasteCategory?.toLowerCase().includes(scheduleSearch.toLowerCase()) ||
        s.routeInfo?.toLowerCase().includes(scheduleSearch.toLowerCase())
      );
    });
  }, [schedules, scheduleSearch]);

  // Handle Report Status Change
  const handleReportStatusChange = async (id, newStatus) => {
    try {
      await updateReportApi(id, { status: newStatus });
      setReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
      );
      setNotification({
        type: 'success',
        message: `Report REF #${id} status updated to '${newStatus}'.`,
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Report Edit
  const handleReportEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingReport) return;
    try {
      await updateReportApi(editingReport.id, editingReport);
      setReports((prev) =>
        prev.map((r) => (r.id === editingReport.id ? { ...editingReport } : r))
      );
      setNotification({
        type: 'success',
        message: `Report REF #${editingReport.id} successfully updated!`,
      });
      setEditingReport(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Report Delete
  const confirmReportDelete = async () => {
    if (!deletingReportId) return;
    try {
      await deleteReportApi(deletingReportId);
      setReports((prev) => prev.filter((r) => r.id !== deletingReportId));
      setNotification({
        type: 'success',
        message: `Report REF #${deletingReportId} deleted permanently.`,
      });
      setDeletingReportId(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Create Schedule
  const handleCreateScheduleSubmit = async (e) => {
    e.preventDefault();
    try {
      const created = await createScheduleApi(newSchedule);
      setSchedules((prev) => [...prev, created]);
      setNotification({
        type: 'success',
        message: `New Schedule for '${newSchedule.ward}' added to database!`,
      });
      setNewSchedule({
        municipality: '',
        ward: '',
        wasteCategory: 'Perishable Organic',
        pickupDates: '',
        routeInfo: '',
        guidelines: '',
      });
      setAddingSchedule(false);
    } catch (err) {
      console.error('Error creating schedule:', err);
    }
  };

  // Handle Update Schedule
  const handleUpdateScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!editingSchedule) return;
    try {
      await updateScheduleApi(editingSchedule.id, editingSchedule);
      setSchedules((prev) =>
        prev.map((s) => (s.id === editingSchedule.id ? { ...editingSchedule } : s))
      );
      setNotification({
        type: 'success',
        message: `Schedule ID #${editingSchedule.id} successfully updated!`,
      });
      setEditingSchedule(null);
    } catch (err) {
      console.error('Error updating schedule:', err);
    }
  };

  // Handle Delete Schedule
  const confirmDeleteSchedule = async () => {
    if (!deletingScheduleId) return;
    try {
      await deleteScheduleApi(deletingScheduleId);
      setSchedules((prev) => prev.filter((s) => s.id !== deletingScheduleId));
      setNotification({
        type: 'success',
        message: `Schedule ID #${deletingScheduleId} deleted permanently from database.`,
      });
      setDeletingScheduleId(null);
    } catch (err) {
      console.error('Error deleting schedule:', err);
    }
  };

  const getCategoryBadgeClass = (category) => {
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

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Resolved':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Dispatched':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'In Progress':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      default:
        return 'bg-purple-100 text-purple-800 border-purple-300';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-purple-800/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-purple-800/80 text-purple-200 text-xs font-bold px-3 py-1 rounded-full border border-purple-500/40">
            <ShieldCheck className="h-4 w-4 text-purple-300" />
            <span>Municipal Council Database Control Center</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Admin Reports & Schedules Portal
          </h1>
          <p className="text-purple-200 text-xs sm:text-sm max-w-2xl">
            Full administrative control to view, add, edit, or delete citizen reports and collection timetables in PostgreSQL.
          </p>
        </div>

        <button
          onClick={() => {
            loadReports();
            loadSchedules();
          }}
          className="inline-flex items-center gap-2 bg-purple-700 hover:bg-purple-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition-colors cursor-pointer"
        >
          <RefreshCw className={`h-4 w-4 ${loadingReports || loadingSchedules ? 'animate-spin' : ''}`} />
          Sync Both Tables
        </button>
      </div>

      {/* Toast Notification */}
      {notification && (
        <div className="bg-emerald-50 border border-emerald-400 p-4 rounded-xl shadow-md flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
            <span className="text-emerald-900 text-sm font-semibold">{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-emerald-700 hover:text-emerald-900 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveTab('reports')}
          className={`flex items-center gap-2 px-5 py-3 font-bold text-sm border-b-2 transition-all cursor-pointer ${
            activeTab === 'reports'
              ? 'border-purple-600 text-purple-900 bg-purple-50/50 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <span>Incident Reports ({reports.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('schedules')}
          className={`flex items-center gap-2 px-5 py-3 font-bold text-sm border-b-2 transition-all cursor-pointer ${
            activeTab === 'schedules'
              ? 'border-emerald-600 text-emerald-900 bg-emerald-50/50 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="h-4 w-4 text-emerald-600" />
          <span>Municipal Schedules ({schedules.length})</span>
        </button>
      </div>

      {/* ================= TAB 1: INCIDENT REPORTS ================= */}
      {activeTab === 'reports' && (
        <div className="space-y-6 animate-fade-in">
          {/* Stat Summaries */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs text-slate-500 font-bold uppercase">Total Reports</span>
              <p className="text-2xl font-black text-slate-900">{reports.length}</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 border border-purple-200 shadow-xs space-y-1">
              <span className="text-xs text-purple-700 font-bold uppercase">Pending</span>
              <p className="text-2xl font-black text-purple-900">
                {reports.filter((r) => (r.status || 'Pending') === 'Pending').length}
              </p>
            </div>
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 shadow-xs space-y-1">
              <span className="text-xs text-amber-800 font-bold uppercase">In Progress / Dispatched</span>
              <p className="text-2xl font-black text-amber-900">
                {reports.filter((r) => ['In Progress', 'Dispatched'].includes(r.status)).length}
              </p>
            </div>
            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200 shadow-xs space-y-1">
              <span className="text-xs text-emerald-800 font-bold uppercase">Resolved</span>
              <p className="text-2xl font-black text-emerald-900">
                {reports.filter((r) => r.status === 'Resolved').length}
              </p>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-5 flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Search by Reporter, Ward, or Description..."
                value={reportSearch}
                onChange={(e) => setReportSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <Filter className="h-4 w-4 text-slate-500" />
              <span className="text-xs font-bold text-slate-700 uppercase">Filter Status:</span>
              <select
                value={reportStatusFilter}
                onChange={(e) => setReportStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-medium text-slate-800 cursor-pointer focus:ring-2 focus:ring-purple-500"
              >
                <option value="All">All Statuses</option>
                {STATUS_OPTIONS.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Reports Table */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center">
              <h2 className="font-bold text-base flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-400" />
                Citizen Incident Records ({filteredReports.length})
              </h2>
              <span className="text-xs text-slate-400">PostgreSQL Reports Table</span>
            </div>

            {loadingReports ? (
              <div className="p-12 text-center text-slate-500 font-medium">
                Fetching reports from database...
              </div>
            ) : filteredReports.length === 0 ? (
              <div className="p-12 text-center text-slate-500 font-medium space-y-2">
                <AlertTriangle className="h-10 w-10 text-slate-300 mx-auto" />
                <p>No reports match your filters.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 text-xs uppercase font-bold tracking-wider border-b border-slate-200">
                      <th className="py-3.5 px-4">Ref ID</th>
                      <th className="py-3.5 px-4">Reporter & Contact</th>
                      <th className="py-3.5 px-4">Ward Location</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4 max-w-xs">Description</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-sm">
                    {filteredReports.map((report) => (
                      <tr key={report.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-4 font-mono font-bold text-xs text-slate-600">
                          #{report.id}
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-bold text-slate-900">{report.reporterName}</div>
                          <div className="text-xs text-slate-500 font-mono">{report.mobileNumber}</div>
                        </td>
                        <td className="py-4 px-4 font-medium text-slate-800">
                          {report.ward}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-block px-2.5 py-1 text-xs font-bold rounded-md shadow-xs ${getCategoryBadgeClass(
                              report.wasteCategory
                            )}`}
                          >
                            {report.wasteCategory}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-xs text-slate-700 leading-relaxed max-w-xs">
                          {report.description}
                        </td>
                        <td className="py-4 px-4">
                          <select
                            value={report.status || 'Pending'}
                            onChange={(e) => handleReportStatusChange(report.id, e.target.value)}
                            className={`text-xs font-bold px-2.5 py-1.5 rounded-lg border cursor-pointer focus:ring-2 focus:ring-purple-500 ${getStatusBadgeClass(
                              report.status
                            )}`}
                          >
                            {STATUS_OPTIONS.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-4 px-4 text-right space-x-2">
                          <button
                            onClick={() => setEditingReport({ ...report })}
                            className="p-2 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white rounded-lg transition-colors cursor-pointer"
                            title="Edit Report"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setDeletingReportId(report.id)}
                            className="p-2 bg-red-50 text-red-700 hover:bg-red-600 hover:text-white rounded-lg transition-colors cursor-pointer"
                            title="Delete Report"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 2: MUNICIPAL SCHEDULES ================= */}
      {activeTab === 'schedules' && (
        <div className="space-y-6 animate-fade-in">
          {/* Controls Bar */}
          <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-5 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="relative w-full sm:w-96">
              <input
                type="text"
                placeholder="Search by Municipality, Ward, or Category..."
                value={scheduleSearch}
                onChange={(e) => setScheduleSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            </div>

            <button
              onClick={() => setAddingSchedule(true)}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow transition-colors cursor-pointer w-full sm:w-auto justify-center"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Collection Schedule</span>
            </button>
          </div>

          {/* Schedules Data Table */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="bg-emerald-900 text-white px-6 py-4 flex justify-between items-center">
              <h2 className="font-bold text-base flex items-center gap-2">
                <Calendar className="h-5 w-5 text-emerald-400" />
                Municipal Collection Timetables ({filteredSchedules.length})
              </h2>
              <span className="text-xs text-emerald-200">PostgreSQL Schedules Table</span>
            </div>

            {loadingSchedules ? (
              <div className="p-12 text-center text-slate-500 font-medium">
                Loading schedules from PostgreSQL...
              </div>
            ) : filteredSchedules.length === 0 ? (
              <div className="p-12 text-center text-slate-500 font-medium space-y-2">
                <Calendar className="h-10 w-10 text-slate-300 mx-auto" />
                <p>No collection schedules found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 text-xs uppercase font-bold tracking-wider border-b border-slate-200">
                      <th className="py-3.5 px-4">ID</th>
                      <th className="py-3.5 px-4">Municipality & Ward</th>
                      <th className="py-3.5 px-4">Waste Category</th>
                      <th className="py-3.5 px-4">Pickup Days</th>
                      <th className="py-3.5 px-4">Truck Route</th>
                      <th className="py-3.5 px-4 max-w-xs">Segregation Guidelines</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-sm">
                    {filteredSchedules.map((schedule) => (
                      <tr key={schedule.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-4 font-mono font-bold text-xs text-slate-600">
                          #{schedule.id}
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-bold text-slate-900">{schedule.ward}</div>
                          <div className="text-xs text-slate-500 font-medium">{schedule.municipality}</div>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-block px-2.5 py-1 text-xs font-bold rounded-md shadow-xs ${getCategoryBadgeClass(
                              schedule.wasteCategory
                            )}`}
                          >
                            {schedule.wasteCategory}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-semibold text-slate-800">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-emerald-600" />
                            <span>{schedule.pickupDates}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded font-semibold border border-slate-300">
                            {schedule.routeInfo}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-xs text-slate-700 leading-relaxed max-w-xs">
                          {schedule.guidelines}
                        </td>
                        <td className="py-4 px-4 text-right space-x-2">
                          <button
                            onClick={() => setEditingSchedule({ ...schedule })}
                            className="p-2 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white rounded-lg transition-colors cursor-pointer"
                            title="Edit Schedule"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setDeletingScheduleId(schedule.id)}
                            className="p-2 bg-red-50 text-red-700 hover:bg-red-600 hover:text-white rounded-lg transition-colors cursor-pointer"
                            title="Delete Schedule"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= MODAL 1: ADD SCHEDULE ================= */}
      {addingSchedule && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 space-y-4">
            <div className="bg-emerald-900 text-white px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-2 font-bold text-lg">
                <Plus className="h-5 w-5 text-emerald-400" />
                <span>Add New Municipal Collection Schedule</span>
              </div>
              <button
                onClick={() => setAddingSchedule(false)}
                className="text-emerald-200 hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateScheduleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Municipal Council
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Colombo Municipal Council"
                    value={newSchedule.municipality}
                    onChange={(e) => setNewSchedule({ ...newSchedule, municipality: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Ward Name & Zone
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Colombo 03 - Kollupitiya"
                    value={newSchedule.ward}
                    onChange={(e) => setNewSchedule({ ...newSchedule, ward: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Waste Category
                  </label>
                  <select
                    value={newSchedule.wasteCategory}
                    onChange={(e) => setNewSchedule({ ...newSchedule, wasteCategory: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500"
                  >
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Pickup Days & Times
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Every Monday & Thursday"
                    value={newSchedule.pickupDates}
                    onChange={(e) => setNewSchedule({ ...newSchedule, pickupDates: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Truck Route Info
                </label>
                <input
                  type="text"
                  placeholder="e.g. Galle Road Corridor"
                  value={newSchedule.routeInfo}
                  onChange={(e) => setNewSchedule({ ...newSchedule, routeInfo: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Segregation Guidelines
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. CMC will reject mixed polythene bags"
                  value={newSchedule.guidelines}
                  onChange={(e) => setNewSchedule({ ...newSchedule, guidelines: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAddingSchedule(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow transition-colors cursor-pointer"
                >
                  <Save className="h-4 w-4" />
                  Save Schedule to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: EDIT SCHEDULE ================= */}
      {editingSchedule && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 space-y-4">
            <div className="bg-emerald-900 text-white px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-2 font-bold text-lg">
                <Edit className="h-5 w-5 text-emerald-400" />
                <span>Edit Schedule ID #{editingSchedule.id}</span>
              </div>
              <button
                onClick={() => setEditingSchedule(null)}
                className="text-emerald-200 hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateScheduleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Municipality
                  </label>
                  <input
                    type="text"
                    value={editingSchedule.municipality}
                    onChange={(e) => setEditingSchedule({ ...editingSchedule, municipality: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Ward Name
                  </label>
                  <input
                    type="text"
                    value={editingSchedule.ward}
                    onChange={(e) => setEditingSchedule({ ...editingSchedule, ward: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Waste Category
                  </label>
                  <select
                    value={editingSchedule.wasteCategory}
                    onChange={(e) => setEditingSchedule({ ...editingSchedule, wasteCategory: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500"
                  >
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Pickup Days
                  </label>
                  <input
                    type="text"
                    value={editingSchedule.pickupDates}
                    onChange={(e) => setEditingSchedule({ ...editingSchedule, pickupDates: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Truck Route Info
                </label>
                <input
                  type="text"
                  value={editingSchedule.routeInfo}
                  onChange={(e) => setEditingSchedule({ ...editingSchedule, routeInfo: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Segregation Guidelines
                </label>
                <textarea
                  rows={3}
                  value={editingSchedule.guidelines}
                  onChange={(e) => setEditingSchedule({ ...editingSchedule, guidelines: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingSchedule(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow transition-colors cursor-pointer"
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: DELETE SCHEDULE CONFIRMATION ================= */}
      {deletingScheduleId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 text-center">
            <div className="p-3 bg-red-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto text-red-600">
              <Trash2 className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Confirm Schedule Deletion</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete collection schedule <strong className="text-slate-900">ID #{deletingScheduleId}</strong>? This action will remove the record from the database.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingScheduleId(null)}
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteSchedule}
                className="px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow transition-colors cursor-pointer"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 4: EDIT REPORT DETAILS MODAL ================= */}
      {editingReport && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 space-y-4">
            <div className="bg-purple-900 text-white px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-2 font-bold text-lg">
                <Edit className="h-5 w-5 text-purple-300" />
                <span>Edit Incident Report #{editingReport.id}</span>
              </div>
              <button
                onClick={() => setEditingReport(null)}
                className="text-purple-200 hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleReportEditSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Reporter Name
                  </label>
                  <input
                    type="text"
                    value={editingReport.reporterName}
                    onChange={(e) =>
                      setEditingReport({ ...editingReport, reporterName: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    value={editingReport.mobileNumber}
                    onChange={(e) =>
                      setEditingReport({ ...editingReport, mobileNumber: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Ward Location
                  </label>
                  <input
                    type="text"
                    value={editingReport.ward}
                    onChange={(e) =>
                      setEditingReport({ ...editingReport, ward: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Waste Category
                  </label>
                  <select
                    value={editingReport.wasteCategory}
                    onChange={(e) =>
                      setEditingReport({ ...editingReport, wasteCategory: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-purple-500"
                  >
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Investigation Status
                </label>
                <select
                  value={editingReport.status || 'Pending'}
                  onChange={(e) =>
                    setEditingReport({ ...editingReport, status: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-purple-500"
                >
                  {STATUS_OPTIONS.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editingReport.description}
                  onChange={(e) =>
                    setEditingReport({ ...editingReport, description: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingReport(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-xl shadow transition-colors cursor-pointer"
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 5: DELETE REPORT CONFIRMATION ================= */}
      {deletingReportId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 text-center">
            <div className="p-3 bg-red-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto text-red-600">
              <Trash2 className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Confirm Incident Deletion</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to permanently delete report <strong className="text-slate-900">REF #{deletingReportId}</strong>? This action will remove the record from the database.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingReportId(null)}
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmReportDelete}
                className="px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow transition-colors cursor-pointer"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
