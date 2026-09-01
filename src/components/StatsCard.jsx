import React from 'react';

export default function StatsCard({ title, value, total, icon: Icon, color = 'blue', indicatorText }) {
  const colorMap = {
    blue: {
      bgIcon: 'bg-sky-500/10 text-sky-500 dark:bg-sky-500/15 dark:text-sky-400',
      border: 'hover:border-sky-500/30',
      bar: 'bg-sky-500',
    },
    amber: {
      bgIcon: 'bg-amber-500/10 text-amber-500 dark:bg-amber-500/15 dark:text-amber-400',
      border: 'hover:border-amber-500/30',
      bar: 'bg-amber-500',
    },
    emerald: {
      bgIcon: 'bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/15 dark:text-emerald-400',
      border: 'hover:border-emerald-500/30',
      bar: 'bg-emerald-500',
    },
    rose: {
      bgIcon: 'bg-rose-500/10 text-rose-500 dark:bg-rose-500/15 dark:text-rose-400',
      border: 'hover:border-rose-500/30',
      bar: 'bg-rose-500',
    },
  };

  const activeColor = colorMap[color] || colorMap.blue;
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div
      className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-200 ${activeColor.border} flex flex-col justify-between group`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1.5 tracking-tight">
            {value}
          </h3>
        </div>
        <div className={`p-3 rounded-xl ${activeColor.bgIcon} transition-transform duration-200 group-hover:scale-105`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>{indicatorText || `${percentage}% of total`}</span>
        {total > 0 && (
          <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full ${activeColor.bar} transition-all duration-500 rounded-full`}
              style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
