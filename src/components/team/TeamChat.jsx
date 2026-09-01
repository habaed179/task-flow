import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, CheckSquare, Sparkles, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useWorkspace } from '../../hooks/useWorkspace';
import { subscribeToWorkspaceChats, sendChatMessage } from '../../services/chatService';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';

export default function TeamChat() {
  const { currentUser, userProfile } = useAuth();
  const { currentWorkspace } = useWorkspace();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!currentWorkspace?.id) return;

    const unsubscribe = subscribeToWorkspaceChats(
      currentWorkspace.id,
      (fetchedMessages) => {
        setMessages(fetchedMessages);
      }
    );

    return () => unsubscribe();
  }, [currentWorkspace?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!text.trim() || sending || !currentWorkspace?.id) return;

    const content = text.trim();
    setText('');
    setSending(true);

    try {
      await sendChatMessage({
        workspaceId: currentWorkspace.id,
        senderId: currentUser?.uid || 'user-anon',
        senderName: userProfile?.displayName || currentUser?.email || 'Team Member',
        senderAvatar: userProfile?.photoURL || '',
        text: content,
      });
    } catch (err) {
      toast.error('Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderMessageContent = (msgText) => {
    // Detect task links or keywords like #task or /tasks
    const taskMatch = msgText.match(/\/tasks/i) || msgText.match(/#task/i);
    if (taskMatch) {
      return (
        <div>
          <span>{msgText}</span>
          <button
            onClick={() => navigate('/tasks')}
            className="mt-2 text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-500/10 px-2.5 py-1 rounded-lg flex items-center gap-1.5 hover:bg-brand-500/20 transition-colors"
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Open Tasks Dashboard</span>
          </button>
        </div>
      );
    }
    return <span>{msgText}</span>;
  };

  return (
    <div className="flex flex-col h-[550px] rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden font-sans">
      {/* Chat Header */}
      <div className="p-4 bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-brand-500/15 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Team Real-Time Chat
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </h3>
            <p className="text-[11px] text-slate-400">
              Workspace: <span className="font-semibold text-slate-700 dark:text-slate-300">{currentWorkspace?.name || 'Active Workspace'}</span>
            </p>
          </div>
        </div>
        <span className="text-[11px] font-semibold text-slate-400">
          {messages.length} messages
        </span>
      </div>

      {/* Messages List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50 dark:bg-slate-900/40">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <Sparkles className="w-8 h-8 text-brand-500 mb-2 opacity-50" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No team messages yet</p>
            <p className="text-xs mt-1">Start the conversation with your team members in this workspace!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === currentUser?.uid;
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                  isMe ? 'bg-brand-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}>
                  {msg.senderName ? msg.senderName.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                </div>

                <div className={`max-w-[75%] space-y-1 ${isMe ? 'text-right' : 'text-left'}`}>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold px-1">
                    <span>{msg.senderName}</span>
                    <span>•</span>
                    <span>{msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'just now'}</span>
                  </div>

                  <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                    isMe
                      ? 'bg-brand-600 text-white rounded-tr-none shadow-md shadow-brand-600/10'
                      : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-none border border-slate-200/80 dark:border-slate-700/60 shadow-xs'
                  }`}>
                    {renderMessageContent(msg.text)}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Box */}
      <form onSubmit={handleSend} className="p-3 bg-white dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800 flex items-center gap-2">
        <textarea
          rows="1"
          placeholder="Type a team message... (Shift+Enter for new line)"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-500 resize-none"
        />
        <button
          type="submit"
          disabled={!text.trim() || sending}
          className="p-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white transition-colors shadow-sm"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
