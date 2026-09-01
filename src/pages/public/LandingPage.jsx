import React from 'react';
import { Link } from 'react-router-dom';
import {
  Zap,
  CheckCircle2,
  Kanban,
  Users,
  BarChart3,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Layers,
  Clock,
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import { PLANS } from '../../utils/constants';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-brand-500 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-32 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20 text-xs font-semibold mb-6 animate-fadeIn">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Generation SaaS Project Management</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight max-w-4xl mx-auto leading-[1.1]">
            Plan smarter. Work together.{' '}
            <span className="bg-gradient-to-r from-brand-500 via-sky-400 to-indigo-500 bg-clip-text text-transparent">
              Get things done.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            TaskFlow gives engineering and product teams real-time workspace collaboration, customizable Kanban boards, role-based controls, and team analytics.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-bold text-base transition-all shadow-lg shadow-brand-600/30 flex items-center justify-center gap-2 group"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 font-bold text-base transition-colors"
            >
              View Live Demo
            </Link>
          </div>

          {/* Interactive UI Mockup Preview */}
          <div className="mt-14 max-w-5xl mx-auto rounded-3xl p-3 sm:p-4 bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-md">
            <div className="rounded-2xl overflow-hidden bg-slate-950 p-6 text-left border border-slate-800/80">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="ml-2 text-xs font-mono text-slate-400">taskflow.app/dashboard</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-500/20 text-brand-400 border border-brand-500/30">
                  LIVE WORKSPACE DEMO
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {['Todo (4)', 'In Progress (7)', 'Review (2)', 'Done (12)'].map((col, idx) => (
                  <div key={col} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                    <p className="text-xs font-bold text-slate-300">{col}</p>
                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 space-y-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/15 text-rose-400">High Priority</span>
                      <p className="text-xs font-semibold text-white">Implement Firebase Auth & RBAC</p>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                        <span>Due Sep 10</span>
                        <div className="w-5 h-5 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-[10px]">HO</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-20 bg-white dark:bg-slate-900 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Engineered for Modern SaaS Teams
            </h2>
            <p className="mt-3 text-base text-slate-600 dark:text-slate-400">
              Everything your team needs to stay aligned, track sprint deliverables, and scale workflows effortlessly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                <Kanban className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Interactive Kanban Boards</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Drag and drop tasks across columns with status tracking, custom categories, due date alerts, and file attachments.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Role-Based Team Collaboration</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Assign tasks to team members, leave comments, track activity timelines, and grant Owner, Admin, Manager, or Member permissions.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Real-Time SaaS Analytics</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Visualize team throughput, user growth, task completion rates, and active workspace metrics with Recharts analytics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto mb-12">
            Start for free and scale as your team grows. No hidden fees or surprise lock-ins.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`p-8 rounded-3xl bg-white dark:bg-slate-900 border flex flex-col justify-between transition-all ${
                  plan.isPopular
                    ? 'border-brand-500 ring-2 ring-brand-500/20 shadow-xl relative'
                    : 'border-slate-200/80 dark:border-slate-800 shadow-sm'
                }`}
              >
                {plan.isPopular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-brand-600 text-white shadow-md">
                    Most Popular
                  </span>
                )}

                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{plan.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{plan.description}</p>

                  <div className="mt-6 flex items-baseline">
                    <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{plan.price}</span>
                    <span className="text-slate-500 dark:text-slate-400 text-sm ml-1">{plan.period}</span>
                  </div>

                  <ul className="mt-6 space-y-3 text-xs font-medium text-slate-700 dark:text-slate-300">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  to="/register"
                  className={`mt-8 w-full py-3 rounded-xl text-center font-bold text-sm transition-all ${
                    plan.isPopular
                      ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-600/30'
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white'
                  }`}
                >
                  {plan.ctaText}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-10 bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-brand-500 fill-current" />
            <span className="font-bold text-white">TaskFlow</span>
            <span>— SaaS Project Management Platform</span>
          </div>
          <p>© 2026 TaskFlow. All rights reserved. Built with React & Firebase.</p>
        </div>
      </footer>
    </div>
  );
}
