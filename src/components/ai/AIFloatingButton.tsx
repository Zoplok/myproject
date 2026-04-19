import { useState } from 'react';
import { Zap, X, Brain, TrendingUp, Sparkles, ChevronRight } from 'lucide-react';

const QUICK_ACTIONS = [
  { icon: Brain, label: 'Summarize this page', color: 'text-ai' },
  { icon: TrendingUp, label: 'Show trending now', color: 'text-accent' },
  { icon: Sparkles, label: 'Discover new streams', color: 'text-yellow-400' },
];

const TIPS = [
  'Try the AI search: "chill FPS stream right now"',
  'AI captions available in English, Spanish, Japanese +8 more',
  'Chat AI can answer questions about what you\'re watching',
  'AI highlights are auto-generated every 15 minutes',
];

export default function AIFloatingButton() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="w-72 card p-4 animate-scale-in shadow-ai">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-ai/10 border border-ai/20 flex items-center justify-center">
              <Zap size={13} className="text-ai" />
            </div>
            <span className="text-sm font-bold text-white">AI Assistant</span>
            <button onClick={() => setOpen(false)} className="ml-auto text-zinc-500 hover:text-white transition-colors">
              <X size={15} />
            </button>
          </div>

          <div className="space-y-1.5 mb-4">
            {QUICK_ACTIONS.map(action => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  className="w-full flex items-center gap-2.5 p-2.5 rounded-xl bg-surface border border-surface-border hover:border-ai/30 hover:bg-ai/5 transition-all text-left group"
                >
                  <Icon size={14} className={action.color} />
                  <span className="text-zinc-300 text-xs flex-1">{action.label}</span>
                  <ChevronRight size={12} className="text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                </button>
              );
            })}
          </div>

          <div className="border-t border-surface-border pt-3">
            <p className="text-xs text-zinc-600 mb-2 font-medium">AI tip</p>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {TIPS[Math.floor(Math.random() * TIPS.length)]}
            </p>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(o => !o)}
        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 active:scale-95 ${
          open
            ? 'bg-surface border border-surface-border text-zinc-400 hover:text-white'
            : 'bg-ai text-black hover:shadow-ai ai-pulse'
        }`}
      >
        {open ? <X size={18} /> : <Zap size={18} fill="black" />}
      </button>
    </div>
  );
}
