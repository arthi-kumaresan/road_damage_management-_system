import React from 'react';
import { ShieldCheck, Info, Cpu, CheckCircle2 } from 'lucide-react';

const About = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-extrabold text-gray-900">
          About RoadCare Civic Intelligence System
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-sm">
          A full-stack municipal platform streamlining citizen grievance redressal, smart hazard prioritization, and verified road maintenance workflows.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-base">
            <ShieldCheck className="w-5 h-5" /> Architectural Overview
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            Built with modern MERN architecture (MongoDB, Express.js, React.js, Node.js), this system enables rapid civic engagement. Citizens upload photographic evidence and GPS tags. Municipal engineers review complaints and dispatch localized maintenance crews.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-amber-600 font-bold text-base">
            <Cpu className="w-5 h-5" /> Automated Priority & AI Detection
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            The platform incorporates a dynamic scoring formula combining road hazard severity, incident age, and community duplicate clustering to rank hazards into Critical, High, Medium, or Low tiers. A decoupled AI prediction pipeline assists citizens in classifying road surface anomalies.
          </p>
        </div>
      </div>

      <div className="bg-slate-900 text-white rounded-xl p-8 space-y-4">
        <h2 className="text-lg font-bold text-amber-400">Project Quality Commitments</h2>
        <div className="grid sm:grid-cols-2 gap-3 text-xs text-gray-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Side-by-side Before/After repair photo audit</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Role-Based Access Control (Citizen, Authority, Maintenance)</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Road Condition Scoring (0 - 100 Index)</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Full status audit trail with citizen reopen workflows</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
