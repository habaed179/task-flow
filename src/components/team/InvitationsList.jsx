import React, { useState, useEffect } from 'react';
import { Mail, Clock, RefreshCw, XCircle, CheckCircle, Copy } from 'lucide-react';
import { collection, getDocs, doc, updateDoc, query, where } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../hooks/useAuth';
import { useWorkspace } from '../../hooks/useWorkspace';
import { acceptInvitation } from '../../services/invitationService';

export default function InvitationsList() {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const { currentWorkspace, refreshWorkspaces, switchWorkspace } = useWorkspace();
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!currentWorkspace?.id) {
        setInvitations([]);
        setLoading(false);
        return;
      }
      try {
        const q = query(
          collection(db, 'invitations'),
          where('workspaceId', '==', currentWorkspace.id),
          where('status', '==', 'pending')
        );
        const snap = await getDocs(q);
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setInvitations(list);
      } catch (err) {
        console.error('Error fetching workspace pending invitations from Firestore:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [currentWorkspace?.id]);

  const handleAccept = async (inv) => {
    try {
      const ok = await acceptInvitation(inv.id, currentUser);
      if (ok) {
        toast.success(`Accepted invitation! Joined workspace.`);
        setInvitations((prev) => prev.filter((i) => i.id !== inv.id));
        if (refreshWorkspaces) {
          await refreshWorkspaces();
        }
        if (inv.workspaceId) {
          switchWorkspace(inv.workspaceId);
        }
      } else {
        toast.error('Failed to accept invitation. Make sure logged in email matches invitation.');
      }
    } catch (err) {
      toast.error('Error accepting invitation.');
    }
  };

  const handleResend = (id, email) => {
    const cleanEmail = (email || '').toLowerCase().trim();
    const subject = encodeURIComponent(`Invitation to join ${currentWorkspace?.name || 'TaskFlow Workspace'}`);
    const body = encodeURIComponent(
      `Hi,\n\nReminder: You have been invited to join "${currentWorkspace?.name || 'TaskFlow Workspace'}" on TaskFlow SaaS.\n\nPlease log in at https://task-flow-two-fawn.vercel.app to accept.\n\nBest regards,\n${currentUser?.email}`
    );
    window.location.href = `mailto:${cleanEmail}?subject=${subject}&body=${body}`;
    toast.success(`Opened mail client to resend invitation to ${cleanEmail}`);
  };

  const handleCopyLink = (invId) => {
    const link = `${window.location.origin}/register?invite=${invId}`;
    navigator.clipboard.writeText(link);
    toast.success('Invitation link copied to clipboard!');
  };

  const handleRevoke = async (id, email) => {
    try {
      await updateDoc(doc(db, 'invitations', id), { status: 'revoked' });
      setInvitations((prev) => prev.filter((i) => i.id !== id));
      toast.info(`Revoked invitation for ${email}`);
    } catch (err) {
      toast.error('Failed to revoke invitation');
    }
  };

  if (loading || invitations.length === 0) return null;

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 font-sans">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Mail className="w-5 h-5 text-amber-500" />
          Pending Invitations Sent From Workspace ({invitations.length})
        </h3>
        <span className="text-xs font-semibold text-slate-400">Workspace: {currentWorkspace?.name}</span>
      </div>

      <div className="space-y-3">
        {invitations.map((inv) => {
          const isRecipient = currentUser?.email && inv.email && inv.email.toLowerCase().trim() === currentUser.email.toLowerCase().trim();
          return (
            <div
              key={inv.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{inv.email}</p>
                  <p className="text-[11px] text-slate-400">Invited as {inv.role || 'member'} by {inv.invitedBy || 'Admin'}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isRecipient && (
                  <button
                    type="button"
                    onClick={() => handleAccept(inv)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors shadow-xs"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Accept & Join</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleCopyLink(inv.id)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold transition-colors"
                  title="Copy Invite Link"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleResend(inv.id, inv.email)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Resend</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRevoke(inv.id, inv.email)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-semibold transition-colors"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Revoke</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
