import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserPlus, Shield, Mail, CheckCircle2 } from 'lucide-react';
import { useWorkspace } from '../../hooks/useWorkspace';
import { useAuth } from '../../hooks/useAuth';
import InviteMemberModal from '../../components/team/InviteMemberModal';
import InvitationsList from '../../components/team/InvitationsList';

export default function TeamPage() {
  const navigate = useNavigate();
  const { currentWorkspace } = useWorkspace();
  const { userProfile, currentUser } = useAuth();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const members = currentWorkspace?.members || [
    {
      id: currentUser?.uid || 'user-owner',
      name: userProfile?.displayName || currentUser?.email || 'Workspace Owner',
      email: currentUser?.email || '',
      role: 'Owner',
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn font-sans">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            Team Roster & Members ({members.length})
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage workspace members, assign role permissions, and track individual throughput.
          </p>
        </div>

        <button
          onClick={() => setIsInviteModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold shadow-md shadow-brand-600/20"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite Member</span>
        </button>
      </div>

      {/* Pending Workspace Invitations Manager */}
      <InvitationsList />

      {/* Members Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => (
          <div
            key={member.id}
            onClick={() => navigate(`/team/${member.id}`)}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-brand-500 dark:hover:border-brand-500 cursor-pointer transition-all hover:shadow-md space-y-4 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-brand-500/20 text-brand-600 dark:text-brand-400 font-bold text-base flex items-center justify-center group-hover:scale-105 transition-transform">
                  {(member.name || 'M').charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <Mail className="w-3 h-3" />
                    <span>{member.email || 'Member Email'}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <span className="px-2.5 py-1 rounded-lg font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Shield className="w-3 h-3 text-brand-500" />
                {member.role || 'Member'}
              </span>

              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Active
              </span>
            </div>
          </div>
        ))}
      </div>

      <InviteMemberModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
      />
    </div>
  );
}
