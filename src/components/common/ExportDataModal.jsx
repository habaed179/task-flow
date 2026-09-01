import React, { useState } from 'react';
import { X, Download, FileText, Code } from 'lucide-react';
import { useTasks } from '../../hooks/useTasks';
import { useProjects } from '../../hooks/useProjects';
import { exportToCSV, exportToJSON } from '../../utils/exportHelpers';
import { useToast } from '../../context/ToastContext';

export default function ExportDataModal({ isOpen, onClose }) {
  const { toast } = useToast();
  const { tasks } = useTasks();
  const { projects } = useProjects();
  const [exportType, setExportType] = useState('tasks');
  const [format, setFormat] = useState('csv');

  if (!isOpen) return null;

  const handleExport = () => {
    const dataToExport = exportType === 'tasks' ? tasks : projects;
    const filename = `taskflow-${exportType}-${Date.now()}.${format}`;

    if (format === 'csv') {
      exportToCSV(dataToExport, filename);
    } else {
      exportToJSON(dataToExport, filename);
    }

    toast.success(`Exported ${dataToExport.length} ${exportType} to ${format.toUpperCase()}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-6 animate-scaleUp">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Download className="w-5 h-5 text-brand-500" />
            Export Workspace Data
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Export Data Type Choice */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
            Dataset to Export
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setExportType('tasks')}
              className={`p-3 rounded-2xl border text-xs font-bold transition-all ${
                exportType === 'tasks'
                  ? 'bg-brand-600 text-white border-brand-600 shadow-md'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              Tasks ({tasks.length})
            </button>
            <button
              type="button"
              onClick={() => setExportType('projects')}
              className={`p-3 rounded-2xl border text-xs font-bold transition-all ${
                exportType === 'projects'
                  ? 'bg-brand-600 text-white border-brand-600 shadow-md'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              Projects ({projects.length})
            </button>
          </div>
        </div>

        {/* Format Choice */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
            File Format
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormat('csv')}
              className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                format === 'csv'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>CSV Spreadsheet</span>
            </button>
            <button
              type="button"
              onClick={() => setFormat('json')}
              className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                format === 'json'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              <Code className="w-4 h-4" />
              <span>JSON Raw Data</span>
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-600/20 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download File</span>
          </button>
        </div>
      </div>
    </div>
  );
}
