import React from 'react';
import Navbar from '../../components/layout/Navbar';
import { Zap, Code, Shield, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1 space-y-8">
        <div className="text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-brand-500/20">
            <Zap className="w-7 h-7 fill-current" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">About TaskFlow</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            "Plan smarter. Work together. Get things done."
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 leading-relaxed text-sm text-slate-600 dark:text-slate-300">
          <p>
            TaskFlow is a production-grade SaaS Project & Task Management platform crafted to showcase modern frontend architecture using <strong>React.js</strong>, <strong>Tailwind CSS</strong>, <strong>Firebase</strong>, <strong>Recharts</strong>, and <strong>@hello-pangea/dnd</strong>.
          </p>
          <p>
            Designed with high usability, clean typography, responsive sidebar drawers, multi-workspace routing, role-based security rules, and real-time task drag-and-drop.
          </p>
        </div>
      </main>
    </div>
  );
}
