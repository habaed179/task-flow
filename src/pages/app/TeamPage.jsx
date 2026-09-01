import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserPlus, Shield, Mail, CheckCircle2, MessageSquare, ShieldCheck, Crown, MoreVertical, Edit3, UserMinus, Clock } from 'lucide-react';
import { useWorkspace } from '../../hooks/useWorkspace';
import { useAuth } from '../../hooks/useAuth';
import InviteMemberModal from '../../components/team/InviteMemberModal';
import InvitationsList from '../../components/team/InvitationsList';
import PendingInviteBanner from '../../components/team/PendingInviteBanner';
import TeamChat from '../../components/team/TeamChat';
import ChangeRoleModal from '../../components/team/ChangeRoleModal';
import RemoveMemberModal from '../../components/team/RemoveMemberModal';
import { getInvitationsForWorkspace } from '../../services/invitationService';

export default function TeamPage() {
  const navigate = useNavigate();
  const { currentWorkspace, refreshWorkspaces } = useWorkspace();
  const { userProfile, currentUser } = useAuth();

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('members'); // 'members' | 'chat'
  const [selectedMemberForRole, setSelectedMemberForRole] = useState(null);
  const [selectedMemberForRemove, setSelectedMemberForRemove] = useState(null);
  const [activeMenuMemberId, setActiveMenuMemberId] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);

  const members = currentWorkspace?.members || [
    {
      id: currentUser?.uid || 'user-owner',
      name: userProfile?.displayName || currentUser?.email || 'Workspace Leader',
      email: currentUser?.email || '',
      role: 'Owner',
    },
  ];

  const currentMember = members.find(
    (m) => m.id === currentUser?.uid || (m.email && m.email.toLowerCase() === currentUser?.email?.toLowerCase())
  );
  const myRole = currentMember?.role || (currentWorkspace?.ownerId === currentUser?.uid ? 'Owner' : 'Member');

  const isOwner = myRole === 'Owner' || currentWorkspace?.ownerId === currentUser?.uid;
  const isAdmin = myRole === 'Admin' || isOwner;

  useEffect(() => {
    async function loadPending() {
      if (!currentWorkspace?.id) return;
      const invs = await getInvitationsForWorkspace(currentWorkspace.id);
      setPendingCount(invs.length);
    }
    loadPending();
  }, [currentWorkspace?.id]);

  const getRoleBadgeLabel = (role) => {
    const r = (role || '').toLowerCase();
    if (r === 'owner') return { label: 'Workspace Leader', icon: Crown, color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30' };
    if (r === 'admin') return { label: 'Admin', icon: ShieldCheck, color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30' };
    if (r === 'manager') return { label: 'Manager', icon: Shield, color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30' };
    if (r === 'viewer') return { label: 'Viewer', icon: Shield, color: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30' };
    return { label: 'Team Member', icon: Users, color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30' };
  };

  const handleMemberUpdated = () => {
    if (refreshWorkspaces) refreshWorkspaces();
  };

  return (
    <div className="space-y-6 animate-fadeIn font-sans">
      {/* Pending Workspace Invites Banner for Logged In User */}
      <PendingInviteBanner />

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            Team Roster & Collaboration Hub
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage workspace members, roles, in-app invitations, and real-time team chat.
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

          {isAdmin && (
            <button
              onClick={() => setIsInviteModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-600/20"
            >
              <UserPlus className="w-4 h-4" />
              <span>Invite Member</span>
            </button>
          )}
        </div>
      </div>

      {/* Top Workspace Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Members</p>
          <p className="text-xl font-extrabold text-slate-900 dark:text-white">{members.length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pending Invitations</p>
          <p className="text-xl font-extrabold text-amber-500">{pendingCount}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Workspace</p>
          <p className="text-sm font-extrabold text-slate-900 dark:text-white truncate">{currentWorkspace?.name || 'Workspace'}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Your Role</p>
          <p className="text-sm font-extrabold text-brand-600 dark:text-brand-400">
            {myRole === 'Owner' ? 'Workspace Leader' : myRole}
          </p>
        </div>
      </div>

      {activeTab === 'chat' ? (
        <TeamChat />
      ) : (
        <>
          {/* Pending Invitations Sent From Active Workspace */}
          <InvitationsList />

          {/* Members Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((member) => {
              const badge = getRoleBadgeLabel(member.role);
              const BadgeIcon = badge.icon;
              const isMe = member.id === currentUser?.uid || member.email === currentUser?.email;
              const canManageThisMember = isAdmin && member.role !== 'Owner' && (!isMe || isOwner);

              return (
                <div
                  key={member.id || member.email}
                  className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-brand-500/50 dark:hover:border-brand-500/50 transition-all space-y-4 relative group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-brand-500/20 text-brand-600 dark:text-brand-400 font-bold text-base flex items-center justify-center group-hover:scale-105 transition-transform">
                        {(member.name || member.email || 'M').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          {member.name || 'Team Member'}
                          {isMe && <span className="text-[10px] bg-brand-500/15 text-brand-600 px-1.5 py-0.5 rounded-md font-bold">(You)</span>}
                        </h3>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3" />
                          <span>{member.email || 'Member Email'}</span>
                        </p>
                      </div>
                    </div>

                    {canManageThisMember && (
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setActiveMenuMemberId(activeMenuMemberId === member.id ? null : member.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {activeMenuMemberId === member.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setActiveMenuMemberId(null)} />
                            <div className="absolute right-0 top-full mt-1 z-20 w-44 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-1 text-xs font-semibold animate-scaleUp">
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuMemberId(null);
                                  setSelectedMemberForRole(member);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              >
                                <Edit3 className="w-3.5 h-3.5 text-brand-500" />
                                <span>Change Role</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuMemberId(null);
                                  setSelectedMemberForRemove(member);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors"
                              >
                                <UserMinus className="w-3.5 h-3.5" />
                                <span>Remove Member</span>
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <span className={`px-2.5 py-1 rounded-lg font-bold border flex items-center gap-1 ${badge.color}`}>
                      <BadgeIcon className="w-3.5 h-3.5" />
                      {badge.label}
                    </span>

                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Active Member
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Modals */}
      <InviteMemberModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
      />

      <ChangeRoleModal
        isOpen={!!selectedMemberForRole}
        onClose={() => setSelectedMemberForRole(null)}
        member={selectedMemberForRole}
        onUpdated={handleMemberUpdated}
      />

      <RemoveMemberModal
        isOpen={!!selectedMemberForRemove}
        onClose={() => setSelectedMemberForRemove(null)}
        member={selectedMemberForRemove}
        onUpdated={handleMemberUpdated}
      />
    </div>
  );
}
