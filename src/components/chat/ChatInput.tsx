import { useState } from 'react';
import { Smile, Send, Gift } from 'lucide-react';

const EMOJIS = ['😂', '🔥', '💯', '👏', '🎉', '😍', '🤣', '😭', '💀', '🙏', '❤️', '😎', '🤯', '🫡', '🤝', '👑'];

interface ChatInputProps {
  onSend: (msg: string) => void;
}

export default function ChatInput({ onSend }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);

  const handleSend = () => {
    if (!message.trim()) return;
    onSend(message.trim());
    setMessage('');
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const addEmoji = (emoji: string) => {
    setMessage(m => m + emoji);
    setShowEmoji(false);
  };

  return (
    <div className="p-3 border-t border-surface-border">
      {showEmoji && (
        <div className="mb-2 p-2 bg-surface-elevated border border-surface-border rounded-xl animate-scale-in">
          <div className="grid grid-cols-8 gap-1">
            {EMOJIS.map(e => (
              <button
                key={e}
                onClick={() => addEmoji(e)}
                className="text-xl p-1.5 rounded-lg hover:bg-surface-hover transition-colors"
              >
                {e}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <div className="flex-1 flex items-center gap-2 bg-surface border border-surface-border rounded-xl px-3 py-2 focus-within:border-accent/40 transition-colors">
          <input
            type="text"
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Say something..."
            maxLength={300}
            className="flex-1 bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none"
          />
          <button
            onClick={() => setShowEmoji(s => !s)}
            className={`shrink-0 transition-colors ${showEmoji ? 'text-accent' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <Smile size={16} />
          </button>
        </div>

        <button className="p-2.5 rounded-xl bg-surface border border-surface-border text-zinc-400 hover:text-yellow-400 hover:border-yellow-400/30 transition-all">
          <Gift size={15} />
        </button>

        <button
          onClick={handleSend}
          disabled={!message.trim()}
          className="p-2.5 rounded-xl bg-accent hover:bg-accent-dim disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
        >
          <Send size={15} className="text-black" />
        </button>
      </div>
    </div>
  );
}
