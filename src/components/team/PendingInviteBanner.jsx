import React, { useState, useEffect } from 'react';
import { Mail, Check, X, Building2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useWorkspace } from '../../hooks/useWorkspace';
import { getPendingInvitationsForUser, acceptInvitation, declineInvitation } from '../../services/invitationService';
import { useToast } from '../../context/ToastContext';

export default function PendingInviteBanner() {
  const { currentUser } = useAuth();
  const { switchWorkspace } = useWorkspace();
  const { toast } = useToast();
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchInvites = async () => {
    if (!currentUser?.email) return;
    const list = await getPendingInvitationsForUser(currentUser.email);
    setInvites(list);
  };

  useEffect(() => {
    fetchInvites();
  }, [currentUser]);

  if (!invites || invites.length === 0) return null;

  const handleAccept = async (inv) => {
    setLoading(true);
    try {
      const ok = await acceptInvitation(inv.id, currentUser);
      if (ok) {
        toast.success(`Accepted invitation to join workspace!`);
        setInvites((prev) => prev.filter((i) => i.id !== inv.id));
        if (inv.workspaceId) {
          switchWorkspace(inv.workspaceId);
        }
      } else {
        toast.error('Failed to accept invitation.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = async (inv) => {
    setLoading(true);
    try {
      const ok = await declineInvitation(inv.id);
      if (ok) {
        toast.info('Invitation declined.');
        setInvites((prev) => prev.filter((i) => i.id !== inv.id));
      } else {
        toast.error('Failed to decline invitation.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2 mb-4 animate-fadeIn">
      {invites.map((inv) => (
        <div
          key={inv.id}
          className="p-4 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <p className="font-extrabold text-sm">Workspace Invitation</p>
              <p className="text-white/80">
                You have been invited to join <span className="font-bold underline">{inv.workspaceId || 'a Workspace'}</span> as <span className="font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-md">{inv.role || 'Member'}</span> by {inv.invitedBy || 'Admin'}.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              type="button"
              disabled={loading}
              onClick={() => handleAccept(inv)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-brand-700 font-bold hover:bg-slate-100 transition-colors shadow-sm"
            >
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Accept & Join</span>
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => handleDecline(inv)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-black/20 hover:bg-black/30 text-white font-semibold transition-colors"
            >
              <X className="w-4 h-4 text-rose-300" />
              <span>Decline</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
