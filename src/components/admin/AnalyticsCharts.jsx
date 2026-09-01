import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

const USER_GROWTH_DATA = [
  { month: 'Jan', users: 120, active: 90 },
  { month: 'Feb', users: 240, active: 180 },
  { month: 'Mar', users: 480, active: 390 },
  { month: 'Apr', users: 820, active: 680 },
  { month: 'May', users: 1250, active: 1040 },
  { month: 'Jun', users: 1890, active: 1520 },
];

const TASK_COMPLETION_DATA = [
  { day: 'Mon', created: 45, completed: 38 },
  { day: 'Tue', created: 52, completed: 49 },
  { day: 'Wed', created: 61, completed: 55 },
  { day: 'Thu', created: 58, completed: 60 },
  { day: 'Fri', created: 70, completed: 64 },
  { day: 'Sat', created: 25, completed: 30 },
  { day: 'Sun', created: 18, completed: 22 },
];

const CATEGORY_DISTRIBUTION = [
  { name: 'Development', value: 42, color: '#06b6d4' },
  { name: 'Design', value: 24, color: '#ec4899' },
  { name: 'Marketing', value: 18, color: '#f97316' },
  { name: 'Work', value: 16, color: '#3b82f6' },
];

export function UserGrowthChart() {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={USER_GROWTH_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
          <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
          <YAxis stroke="#94a3b8" fontSize={11} />
          <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          <Line type="monotone" dataKey="users" name="Total Registered Users" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4 }} />
          <Line type="monotone" dataKey="active" name="Active Daily Users" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TaskCompletionChart() {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={TASK_COMPLETION_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
          <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
          <YAxis stroke="#94a3b8" fontSize={11} />
          <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          <Bar dataKey="created" name="Tasks Created" fill="#3b82f6" radius={[6, 6, 0, 0]} />
          <Bar dataKey="completed" name="Tasks Completed" fill="#10b981" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CategoryPieChart() {
  return (
    <div className="h-64 w-full flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={CATEGORY_DISTRIBUTION} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
            {CATEGORY_DISTRIBUTION.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
          <Legend wrapperStyle={{ fontSize: '11px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
