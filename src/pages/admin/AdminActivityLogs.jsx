import React, { useState, useEffect } from 'react';
import { Activity, Search } from 'lucide-react';
import { getActivities } from '../../services/activityService';

export default function AdminActivityLogs() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    async function load() {
      const list = await getActivities();
      setActivities(list);
    }
    load();
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn text-slate-100">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Activity className="w-6 h-6 text-rose-500" />
          System Audit & Activity Logs
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Chronological record of user registrations, task status changes, and workspace events.
        </p>
      </div>

      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-slate-400 uppercase font-bold text-[10px] border-b border-slate-800">
            <tr>
              <th className="p-4">Timestamp</th>
              <th className="p-4">Actor</th>
              <th className="p-4">Action</th>
              <th className="p-4">Target Entity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {activities.map((act) => (
              <tr key={act.id} className="hover:bg-slate-800/50">
                <td className="p-4 text-slate-400 font-mono">{act.timestamp ? act.timestamp.split('T')[0] : 'Today'}</td>
                <td className="p-4 font-bold text-white flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-[10px]">
                    {act.actorName ? act.actorName.charAt(0) : 'U'}
                  </div>
                  <span>{act.actorName}</span>
                </td>
                <td className="p-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 border border-slate-700 text-brand-400">
                    {act.action}
                  </span>
                </td>
                <td className="p-4 text-slate-200">{act.target}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
