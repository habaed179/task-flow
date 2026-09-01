import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserPlus, Shield, Mail, CheckCircle2, MessageSquare, ShieldCheck, Crown } from 'lucide-react';
import { useWorkspace } from '../../hooks/useWorkspace';
import { useAuth } from '../../hooks/useAuth';
import InviteMemberModal from '../../components/team/InviteMemberModal';
import InvitationsList from '../../components/team/InvitationsList';
import PendingInviteBanner from '../../components/team/PendingInviteBanner';
import TeamChat from '../../components/team/TeamChat';

export default function TeamPage() {
  const navigate = useNavigate();
  const { currentWorkspace } = useWorkspace();
  const { userProfile, currentUser } = useAuth();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('members'); // 'members' | 'chat'

  const members = currentWorkspace?.members || [
    {
      id: currentUser?.uid || 'user-owner',
      name: userProfile?.displayName || currentUser?.email || 'Workspace Leader',
      email: currentUser?.email || '',
      role: 'Owner',
    },
  ];

  const getRoleBadgeLabel = (role) => {
    const r = (role || '').toLowerCase();
    if (r === 'owner') return { label: 'Workspace Leader', icon: Crown, color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30' };
    if (r === 'admin') return { label: 'Admin', icon: ShieldCheck, color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30' };
    if (r === 'manager') return { label: 'Manager', icon: Shield, color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30' };
    if (r === 'viewer') return { label: 'Viewer', icon: Shield, color: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30' };
    return { label: 'Team Member', icon: Users, color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30' };
  };

  return (
    <div className="space-y-6 animate-fadeIn font-sans">
      {/* Pending Workspace Invites Banner */}
      <PendingInviteBanner />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            Team Roster & Real-Time Chat
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage team members, roles, in-app invitations, and real-time workspace discussions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveTab('members')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'members' ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Members ({members.length})
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                activeTab === 'chat' ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Team Chat</span>
            </button>
          </div>

          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-600/20"
          >
            <UserPlus className="w-4 h-4" />
            <span>Invite Member</span>
          </button>
        </div>
      </div>

      {activeTab === 'chat' ? (
        <TeamChat />
      ) : (
        <>
          {/* Pending Workspace Invitations Manager */}
          <InvitationsList />

          {/* Members Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((member) => {
              const badge = getRoleBadgeLabel(member.role);
              const BadgeIcon = badge.icon;
              return (
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
                    <span className={`px-2.5 py-1 rounded-lg font-bold border flex items-center gap-1 ${badge.color}`}>
                      <BadgeIcon className="w-3.5 h-3.5" />
                      {badge.label}
                    </span>

                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Active
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <InviteMemberModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
      />
    </div>
  );
}
