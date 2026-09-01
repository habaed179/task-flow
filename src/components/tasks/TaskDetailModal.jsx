import React, { useState } from 'react';
import { X, Calendar, Tag, User, Paperclip, Upload } from 'lucide-react';
import { TASK_STATUSES, TASK_PRIORITIES, CATEGORIES } from '../../utils/constants';
import CommentSection from './CommentSection';
import SubtaskChecklist from './SubtaskChecklist';
import TaskTimeTracker from './TaskTimeTracker';
import { uploadTaskAttachment } from '../../services/storageService';
import { useToast } from '../../context/ToastContext';

export default function TaskDetailModal({ task, isOpen, onClose, onEdit }) {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  if (!isOpen || !task) return null;

  const statusObj = TASK_STATUSES.find((s) => s.id === task.status) || TASK_STATUSES[0];
  const priorityObj = TASK_PRIORITIES.find((p) => p.id === task.priority) || TASK_PRIORITIES[1];
  const categoryObj = CATEGORIES.find((c) => c.id === task.category) || CATEGORIES[0];

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const attachment = await uploadTaskAttachment(task.id, file, (p) => setProgress(p));
      const updatedAttachments = [...(task.attachments || []), attachment];
      onEdit(task.id, { attachments: updatedAttachments });
      toast.success(`Uploaded ${file.name}`);
    } catch (err) {
      toast.error('File upload failed');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleSubtasksChange = (updatedSubtasks) => {
    onEdit(task.id, { subtasks: updatedSubtasks });
  };

  const handleSaveTime = (seconds) => {
    onEdit(task.id, { trackedTime: seconds });
    toast.success('Tracked time saved');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-scaleUp my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${statusObj.badge}`}>
              {statusObj.label}
            </span>
            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${priorityObj.badgeClass}`}>
              {priorityObj.label}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white leading-snug">
              {task.title}
            </h2>
            {task.description && (
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {task.description}
              </p>
            )}
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 font-medium block uppercase tracking-wider text-[10px] mb-1">Assignee</span>
              <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                <User className="w-3.5 h-3.5 text-brand-500" />
                <span>{task.assigneeName || 'Unassigned'}</span>
              </div>
            </div>

            <div>
              <span className="text-slate-400 font-medium block uppercase tracking-wider text-[10px] mb-1">Category</span>
              <span className={`inline-block px-2 py-0.5 rounded font-semibold border ${categoryObj.bgLight} ${categoryObj.bgDark}`}>
                {categoryObj.label}
              </span>
            </div>

            <div>
              <span className="text-slate-400 font-medium block uppercase tracking-wider text-[10px] mb-1">Due Date</span>
              <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{task.dueDate || 'No deadline'}</span>
              </div>
            </div>
          </div>

          {/* Subtasks Checklist Component */}
          <SubtaskChecklist
            subtasks={task.subtasks || []}
            onChange={handleSubtasksChange}
          />

          {/* Time Tracking Widget */}
          <TaskTimeTracker
            estimatedHours={task.estimatedTime || 0}
            trackedSeconds={task.trackedTime || 0}
            onSaveTime={handleSaveTime}
          />

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">Tags</span>
              <div className="flex flex-wrap gap-1.5">
                {task.tags.map((t) => (
                  <span key={t} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-brand-500/10 text-brand-600 dark:text-brand-300 border border-brand-500/20">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Attachments Section */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Paperclip className="w-4 h-4 text-brand-500" />
                Attachments ({task.attachments?.length || 0})
              </span>
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload File</span>
                <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} />
              </label>
            </div>

            {uploading && (
              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                <div className="bg-brand-500 h-full transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            )}

            {task.attachments && task.attachments.length > 0 && (
              <div className="space-y-2">
                {task.attachments.map((att, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{att.name}</span>
                    <a href={att.url} target="_blank" rel="noreferrer" className="text-brand-600 dark:text-brand-400 font-bold hover:underline">
                      Download
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Comments Component */}
          <CommentSection taskId={task.id} />
        </div>
      </div>
    </div>
  );
}
