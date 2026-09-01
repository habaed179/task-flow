import React, { useState } from 'react';
import { X, ShieldCheck, AlertCircle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useWorkspace } from '../../hooks/useWorkspace';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';

export default function ChangeRoleModal({ isOpen, onClose, member, onUpdated }) {
  const { toast } = useToast();
  const { currentWorkspace } = useWorkspace();
  const [role, setRole] = useState(member?.role || 'Member');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !member) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (member.role === 'Owner') {
      setError('The Workspace Leader / Owner role cannot be changed through member management.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const wsRef = doc(db, 'workspaces', currentWorkspace.id);
      const wsSnap = await getDoc(wsRef);
      if (wsSnap.exists()) {
        const membersList = wsSnap.data().members || [];
        const updatedList = membersList.map((m) =>
          m.id === member.id || m.email === member.email ? { ...m, role } : m
        );
        await updateDoc(wsRef, {
          members: updatedList,
          updatedAt: serverTimestamp(),
        });
        toast.success(`Updated ${member.name}'s role to ${role}!`);
        if (onUpdated) onUpdated();
        onClose();
      }
    } catch (err) {
      setError('Failed to update member role in database.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn font-sans">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-scaleUp">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Change Member Role</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 text-xs">
            <p className="font-bold text-slate-900 dark:text-white">{member.name}</p>
            <p className="text-[11px] text-slate-400">{member.email}</p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
              Select New Workspace Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 font-medium"
            >
              <option value="Admin">Admin (Full workspace management & members)</option>
              <option value="Manager">Manager (Manage projects & assign tasks)</option>
              <option value="Member">Team Member (Work on assigned tasks)</option>
              <option value="Viewer">Viewer (Read-only access)</option>
            </select>
          </div>

          {error && (
            <p className="text-xs text-rose-500 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {error}
            </p>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm transition-all shadow-md shadow-brand-600/20"
            >
              {submitting ? 'Saving...' : 'Save Role'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
