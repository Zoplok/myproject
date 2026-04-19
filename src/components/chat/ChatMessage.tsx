import { Shield, Star, Crown, Radio, BadgeCheck, AlertTriangle } from 'lucide-react';
import type { ChatMessage, Badge } from '../../types';

interface ChatMessageProps {
  message: ChatMessage;
}

function BadgeIcon({ badge }: { badge: Badge }) {
  switch (badge.type) {
    case 'moderator': return <Shield size={12} className="text-green-400" fill="currentColor" />;
    case 'vip': return <Crown size={12} className="text-yellow-400" fill="currentColor" />;
    case 'subscriber': return <Star size={12} className="text-accent" fill="currentColor" />;
    case 'broadcaster': return <Radio size={12} className="text-red-400" />;
    case 'verified': return <BadgeCheck size={12} className="text-ai" />;
    default: return null;
  }
}

export default function ChatMessageComponent({ message }: ChatMessageProps) {
  if (message.isFlagged) {
    return (
      <div className="chat-message px-3 py-2 hover:bg-surface-hover/30 transition-colors rounded-lg mx-1 group">
        <div className="flex items-start gap-2 opacity-50 blur-[2px] group-hover:blur-none group-hover:opacity-100 transition-all">
          <div className="flex items-center gap-1 shrink-0">
            {message.badges.map((b, i) => <BadgeIcon key={i} badge={b} />)}
            <span className="text-xs font-bold" style={{ color: message.usernameColor }}>
              {message.username}
            </span>
            <span className="text-zinc-600 text-xs">:</span>
          </div>
          <span className="text-zinc-300 text-xs leading-relaxed">{message.message}</span>
        </div>
        <div className="flex items-center gap-1 mt-1">
          <AlertTriangle size={10} className="text-red-400" />
          <span className="text-red-400 text-xs">AI flagged: {message.flagReason}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-message px-3 py-1.5 hover:bg-surface-hover/20 transition-colors rounded-lg mx-1 group">
      <span className="text-zinc-500 text-xs mr-2 hidden group-hover:inline">{message.timestamp}</span>
      <span className="inline-flex items-center gap-1 mr-1.5 shrink-0">
        {message.badges.map((b, i) => (
          <span key={i} title={b.label}>
            <BadgeIcon badge={b} />
          </span>
        ))}
      </span>
      <span className="text-xs font-bold mr-1.5" style={{ color: message.usernameColor }}>
        {message.username}:
      </span>
      <span className="text-zinc-300 text-xs leading-relaxed break-words">{message.message}</span>
    </div>
  );
}
