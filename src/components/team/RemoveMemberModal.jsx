import React, { useState } from 'react';
import { UserMinus, AlertTriangle, X } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useWorkspace } from '../../hooks/useWorkspace';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';

export default function RemoveMemberModal({ isOpen, onClose, member, onUpdated }) {
  const { toast } = useToast();
  const { currentWorkspace } = useWorkspace();
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !member) return null;

  const handleRemove = async () => {
    if (member.role === 'Owner') {
      toast.error('The Workspace Leader / Owner cannot be removed.');
      return;
    }

    setSubmitting(true);
    try {
      const wsRef = doc(db, 'workspaces', currentWorkspace.id);
      const wsSnap = await getDoc(wsRef);
      if (wsSnap.exists()) {
        const membersList = wsSnap.data().members || [];
        const filteredList = membersList.filter(
          (m) => m.id !== member.id && m.email !== member.email
        );
        await updateDoc(wsRef, {
          members: filteredList,
          updatedAt: serverTimestamp(),
        });
        toast.info(`Removed ${member.name} from workspace.`);
        if (onUpdated) onUpdated();
        onClose();
      }
    } catch (err) {
      toast.error('Failed to remove member from workspace.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn font-sans">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-scaleUp">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
            <UserMinus className="w-5 h-5" />
            <h2 className="text-lg font-bold">Remove Team Member</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              Confirm Member Removal
            </p>
            <p>
              Are you sure you want to remove <span className="font-bold underline">{member.name}</span> ({member.email}) from <span className="font-bold">{currentWorkspace?.name}</span>? They will lose access to this workspace, its projects, and tasks.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={handleRemove}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-medium text-sm transition-all shadow-md shadow-rose-600/20"
            >
              {submitting ? 'Removing...' : 'Yes, Remove Member'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
