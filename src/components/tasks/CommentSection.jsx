import React, { useState, useEffect } from 'react';
import { getCommentsForTask, addComment as addCommentService, deleteComment as deleteCommentService } from '../../services/commentService';
import { useAuth } from '../../hooks/useAuth';
import { useWorkspace } from '../../hooks/useWorkspace';
import { createNotification } from '../../services/notificationService';
import { Send, Trash2, MessageSquare, AtSign } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function CommentSection({ taskId }) {
  const { currentUser, userProfile } = useAuth();
  const { currentWorkspace } = useWorkspace();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    async function load() {
      if (!taskId) return;
      const data = await getCommentsForTask(taskId);
      setComments(data);
    }
    load();
  }, [taskId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = newComment.trim();
    if (!text) return;

    const added = await addCommentService(
      taskId,
      {
        uid: currentUser?.uid || 'user-hassan-demo',
        displayName: userProfile?.displayName || currentUser?.email || 'Hassan Obaed',
        photoURL: userProfile?.photoURL || '',
      },
      text
    );

    setComments((prev) => [...prev, added]);
    setNewComment('');

    // Check for @mentions in comment text
    if (text.includes('@') && currentWorkspace?.members) {
      currentWorkspace.members.forEach(async (member) => {
        const mentionTag = `@${member.name.split(' ')[0]}`;
        if (text.toLowerCase().includes(mentionTag.toLowerCase())) {
          await createNotification({
            userId: member.id,
            title: 'You were mentioned',
            message: `${userProfile?.displayName || 'A team member'} mentioned you in a task discussion: "${text}"`,
            type: 'mention',
          });
        }
      });
    }
  };

  const handleDelete = async (id) => {
    await deleteCommentService(id);
    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <span>Discussion ({comments.length})</span>
        </div>
        <span className="text-[10px] text-slate-400 font-normal">Use @name to mention a teammate</span>
      </div>

      <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
        {comments.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No comments yet. Start the conversation!</p>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 text-xs">
              <div className="w-7 h-7 rounded-full bg-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-xs shrink-0">
                {c.userName ? c.userName.charAt(0) : 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-slate-900 dark:text-white truncate">{c.userName}</span>
                  <span className="text-[10px] text-slate-400">
                    {c.createdAt ? formatDistanceToNow(new Date(c.createdAt), { addSuffix: true }) : 'just now'}
                  </span>
                </div>
                <p className="mt-1 text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {c.content}
                </p>
              </div>
              {c.userId === (currentUser?.uid || 'user-hassan-demo') && (
                <button
                  type="button"
                  onClick={() => handleDelete(c.id)}
                  className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                  title="Delete comment"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-2">
        <input
          type="text"
          placeholder="Add a comment... (Use @Name to mention)"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1 px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
        />
        <button
          type="submit"
          disabled={!newComment.trim()}
          className="p-2 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
