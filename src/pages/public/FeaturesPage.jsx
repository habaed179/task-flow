import React from 'react';
import Navbar from '../../components/layout/Navbar';
import { Kanban, ShieldCheck, Users, BarChart3, Clock, Zap, Lock, Database } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FeaturesPage() {
  const featureList = [
    { icon: Kanban, title: 'Kanban Board & List Views', desc: 'Drag-and-drop tasks across custom columns with priority badges, categories, and due date relative warnings.' },
    { icon: Users, title: 'Team Collaboration & Comments', desc: 'Assign tasks to workspace team members, start comment discussions, and log real-time activity timelines.' },
    { icon: BarChart3, title: 'Recharts SaaS Analytics', desc: 'Monitor task completion velocity, total active projects, user activity growth, and workspace health.' },
    { icon: Lock, title: 'Role-Based Access Control (RBAC)', desc: 'Enforce granular Owner, Admin, Manager, and Member permissions across workspaces and projects.' },
    { icon: Database, title: 'Firebase Cloud Storage & Firestore', desc: 'Upload specification files and documents with secure Firestore data modeling and Storage rules.' },
    { icon: ShieldCheck, title: 'Firebase Authentication', desc: 'Secure email/password login, Google OAuth popup, password reset flows, and persistent auth listeners.' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold tracking-tight">Platform Features</h1>
          <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">
            Discover the technical power and UI elegance built into TaskFlow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featureList.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <Link to="/register" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-base transition-all shadow-lg shadow-brand-600/30">
            Start Building with TaskFlow
          </Link>
        </div>
      </main>
    </div>
  );
}
