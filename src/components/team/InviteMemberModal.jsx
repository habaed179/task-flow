import React, { useState } from 'react';
import { X, UserPlus, Mail, AlertCircle, Send } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useWorkspace } from '../../hooks/useWorkspace';
import { useAuth } from '../../hooks/useAuth';
import { sendInvitation } from '../../services/invitationService';

export default function InviteMemberModal({ isOpen, onClose }) {
  const { toast } = useToast();
  const { currentWorkspace } = useWorkspace();
  const { currentUser, userProfile } = useAuth();

  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Member');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanEmail = email.toLowerCase().trim();
    if (!cleanEmail) {
      setError('Email address is required.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const inv = await sendInvitation({
        workspaceId: currentWorkspace?.id || 'ws-main',
        email: cleanEmail,
        role,
        invitedBy: userProfile?.displayName || currentUser?.email || 'Workspace Admin',
      });

      if (inv) {
        toast.success(`Invitation created for ${cleanEmail}! In-app banner active.`);

        // Dispatch mailto link so sender can also send direct Gmail
        const subject = encodeURIComponent(`Invitation to join ${currentWorkspace?.name || 'TaskFlow Workspace'}`);
        const body = encodeURIComponent(
          `Hi,\n\nYou have been invited to join "${currentWorkspace?.name || 'TaskFlow Workspace'}" on TaskFlow SaaS as a ${role}.\n\nPlease log in to your account at https://task-flow-two-fawn.vercel.app to accept the invitation.\n\nBest regards,\n${userProfile?.displayName || currentUser?.email || 'TaskFlow Team'}`
        );
        window.open(`mailto:${cleanEmail}?subject=${subject}&body=${body}`, '_blank');

        setEmail('');
        onClose();
      } else {
        setError('Failed to create invitation in Firestore.');
      }
    } catch (err) {
      setError('Error sending invitation. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn font-sans">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-scaleUp">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Invite Team Member</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
              Member Email Address <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="colleague@company.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                autoFocus
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
            {error && (
              <p className="mt-1 text-xs text-rose-500 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {error}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
              Workspace Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
            >
              <option value="Admin">Admin (Full workspace management)</option>
              <option value="Manager">Manager (Manage projects & assign tasks)</option>
              <option value="Member">Member (Work on assigned tasks)</option>
              <option value="Viewer">Viewer (Read only access)</option>
            </select>
          </div>

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
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm transition-all shadow-md shadow-brand-600/20"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Sending...' : 'Send Invitation'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
