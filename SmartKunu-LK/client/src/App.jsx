import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScheduleView from './features/schedules/ScheduleView';
import ReportForm from './features/reports/ReportForm';
import AdminPortal from './features/admin/AdminPortal';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800 antialiased">
        <Navbar />
        <main className="flex-1 pb-12">
          <Routes>
            <Route path="/" element={<ScheduleView />} />
            <Route path="/report" element={<ReportForm />} />
            <Route path="/admin" element={<AdminPortal />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}