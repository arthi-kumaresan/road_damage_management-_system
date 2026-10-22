import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, CheckCircle, Wrench, BarChart2, ArrowRight } from 'lucide-react';

const Landing = () => {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-800 text-white py-20 px-4">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full text-amber-400 text-sm font-medium">
            <ShieldAlert className="w-4 h-4" /> Official Municipal Road Safety Initiative
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Report Road Damage. <br />
            <span className="text-amber-400">Track Repairs.</span> Improve Roads.
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-base md:text-lg">
            Empowering citizens to report potholes, cracks, and safety hazards directly to municipal authorities and track repair progress in real-time.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/citizen/report"
              className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-8 py-3.5 rounded-lg shadow-lg flex items-center justify-center gap-2 transition"
            >
              Report Road Damage Now <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto bg-slate-700/80 hover:bg-slate-700 border border-slate-600 text-white font-medium px-8 py-3.5 rounded-lg transition"
            >
              Sign In to Portal
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="max-w-6xl mx-auto py-16 px-4">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">
          End-to-End Infrastructure Accountability
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-3">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-bold">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">1. Citizen Reporting</h3>
            <p className="text-sm text-gray-600">
              Submit exact GPS locations, road descriptions, and photo evidence. AI assists in identifying damage severity.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-3">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center font-bold">
              <BarChart2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">2. Smart Prioritization</h3>
            <p className="text-sm text-gray-600">
              Automated scoring evaluates danger levels and duplicate reports so critical hazards receive prompt assignment.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-3">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center font-bold">
              <Wrench className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">3. Verified Resolution</h3>
            <p className="text-sm text-gray-600">
              Maintenance teams upload before & after repair photos. Citizens inspect results and provide feedback.
            </p>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="bg-slate-100 py-16 border-t border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Complete Lifecycle Transparency</h2>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs md:text-sm font-semibold text-slate-600">
            <span className="bg-white px-3 py-1.5 rounded-full shadow-sm">Submitted</span> &rarr;
            <span className="bg-white px-3 py-1.5 rounded-full shadow-sm">Under Review</span> &rarr;
            <span className="bg-white px-3 py-1.5 rounded-full shadow-sm">Verified</span> &rarr;
            <span className="bg-white px-3 py-1.5 rounded-full shadow-sm">Assigned</span> &rarr;
            <span className="bg-white px-3 py-1.5 rounded-full shadow-sm">In Progress</span> &rarr;
            <span className="bg-emerald-500 text-white px-3 py-1.5 rounded-full shadow-sm">Repaired & Closed</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
