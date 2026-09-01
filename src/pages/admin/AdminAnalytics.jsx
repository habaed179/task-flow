import React from 'react';
import { BarChart3, TrendingUp, Users, CheckCircle2, ShieldCheck } from 'lucide-react';
import { UserGrowthChart, TaskCompletionChart, CategoryPieChart } from '../../components/admin/AnalyticsCharts';

export default function AdminAnalytics() {
  return (
    <div className="space-y-8 animate-fadeIn text-slate-100">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-rose-500" />
          SaaS System Analytics
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Deep analytics on user acquisition, team productivity, and category breakdown.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 lg:col-span-2">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            User Acquisition & Active Throughput
          </h3>
          <UserGrowthChart />
        </div>

        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white">Task Category Breakdown</h3>
          <CategoryPieChart />
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white">Weekly Sprint Completion Velocity</h3>
        <TaskCompletionChart />
      </div>
    </div>
  );
}
