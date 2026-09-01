import React, { useState, useEffect } from 'react';
import StatsCard from '../../components/StatsCard';
import { Users, Building2, FolderKanban, CheckSquare, ShieldCheck, Activity } from 'lucide-react';
import { UserGrowthChart, TaskCompletionChart } from '../../components/admin/AnalyticsCharts';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeWorkspaces: 0,
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    completionRate: 0,
  });

  useEffect(() => {
    async function load() {
      try {
        const usersSnap = await getDocs(collection(db, 'users'));
        const workspacesSnap = await getDocs(collection(db, 'workspaces'));
        const projectsSnap = await getDocs(collection(db, 'projects'));
        const tasksSnap = await getDocs(collection(db, 'tasks'));

        const totalUsers = usersSnap.size;
        const activeWorkspaces = workspacesSnap.size;
        const totalProjects = projectsSnap.size;
        const totalTasks = tasksSnap.size;

        const completedTasks = tasksSnap.docs.filter((d) => {
          const data = d.data();
          return data.completed || data.status === 'Done';
        }).length;

        const rate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        setStats({
          totalUsers,
          activeWorkspaces,
          totalProjects,
          totalTasks,
          completedTasks,
          completionRate: rate,
        });
      } catch (err) {
        console.error('Error computing admin dashboard stats from Firestore:', err);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-8 animate-fadeIn text-slate-100 font-sans">
      {/* Admin Hero */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-rose-950 to-slate-950 border border-rose-900/40 shadow-xl">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          System Administration Overview
        </h2>
        <p className="mt-1 text-sm text-slate-300">
          Monitor live platform metrics, user growth, active workspace throughput, and system audit logs.
        </p>
      </div>

      {/* 6 Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard title="Registered Users" value={stats.totalUsers} total={stats.totalUsers || 1} icon={Users} color="blue" indicatorText="Live Firestore count" />
        <StatsCard title="Active Workspaces" value={stats.activeWorkspaces} total={stats.activeWorkspaces || 1} icon={Building2} color="amber" indicatorText="Live workspaces" />
        <StatsCard title="Total Projects" value={stats.totalProjects} total={stats.totalProjects || 1} icon={FolderKanban} color="emerald" indicatorText="Across workspaces" />
        <StatsCard title="Total Tasks Created" value={stats.totalTasks} total={stats.totalTasks || 1} icon={CheckSquare} color="rose" indicatorText="Lifetime creation" />
        <StatsCard title="Task Completion Rate" value={`${stats.completionRate}%`} total={100} icon={ShieldCheck} color="emerald" indicatorText={`${stats.completedTasks} completed`} />
        <StatsCard title="System Operational Status" value="Online" total={100} icon={Activity} color="blue" indicatorText="Firebase cloud systems active" />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white">User Growth Overview</h3>
          <UserGrowthChart />
        </div>

        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white">Weekly Task Creation vs Completion</h3>
          <TaskCompletionChart />
        </div>
      </div>
    </div>
  );
}
