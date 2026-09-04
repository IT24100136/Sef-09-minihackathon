import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScheduleView from './features/schedules/ScheduleView';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800 antialiased">
        <Navbar />
        <main className="flex-1 pb-12">
          <Routes>
            <Route path="/" element={<ScheduleView />} />
            <Route
              path="/report"
              element={
                <div className="max-w-4xl mx-auto my-12 p-8 bg-white rounded-2xl shadow-md text-center border border-slate-200">
                  <h2 className="text-xl font-bold text-slate-800">
                    Report Form coming soon (Member 2)
                  </h2>
                </div>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}