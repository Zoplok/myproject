import { useState } from 'react';
import { Zap, Clock, TrendingUp, Lightbulb, RefreshCw } from 'lucide-react';

const TITLE_SUGGESTIONS = [
  'Ranked Grind to Master — Road to Top 500',
  'Late Night Chill Games + Viewer Matches',
  'Trying NEW Season Meta — Challenger POV',
  '1v1 Anyone in Chat — Prove You\'re Better',
];

const TAG_SUGGESTIONS = ['FPS', 'Ranked', 'Educational', 'Competitive', 'Chill', 'No-commentary', 'English'];

const BEST_TIMES = [
  { time: '8:00 PM EST', score: 94, reason: 'Peak viewership window for your category' },
  { time: '6:00 PM EST', score: 78, reason: 'Post-work audience spike' },
  { time: '12:00 PM EST', score: 61, reason: 'Lunchtime casual viewers' },
];

const GROWTH_INSIGHTS = [
  { label: 'Avg session length is up 18% — viewers stay longer on weekends', icon: TrendingUp, color: 'text-accent' },
  { label: 'Your clips on YouTube drive 23% of new followers', icon: Zap, color: 'text-ai' },
  { label: 'Streams over 3h perform 40% better for subs', icon: Clock, color: 'text-yellow-400' },
];

export default function AICreatorAssistant() {
  const [activeTitle, setActiveTitle] = useState(TITLE_SUGGESTIONS[0]);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(r => setTimeout(r, 800));
    setRefreshing(false);
  };

  return (
    <div className="card p-5 space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-ai/10 border border-ai/20 flex items-center justify-center ai-pulse">
          <Zap size={15} className="text-ai" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">AI Creator Assistant</h3>
          <p className="text-xs text-zinc-500">Smart suggestions for your next stream</p>
        </div>
        <span className="ml-auto badge-ai">AI</span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
            <Lightbulb size={12} className="text-ai" />
            Suggested Stream Titles
          </label>
          <button
            onClick={handleRefresh}
            className="text-zinc-500 hover:text-ai transition-colors"
          >
            <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
          </button>
        </div>
        <div className="space-y-1.5">
          {TITLE_SUGGESTIONS.map(title => (
            <button
              key={title}
              onClick={() => setActiveTitle(title)}
              className={`w-full text-left px-3 py-2.5 rounded-xl border text-xs transition-all ${
                activeTitle === title
                  ? 'bg-ai/10 border-ai/30 text-white'
                  : 'bg-surface border-surface-border text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'
              }`}
            >
              {title}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
          <Zap size={12} className="text-ai" />
          Suggested Tags
        </label>
        <div className="flex flex-wrap gap-1.5">
          {TAG_SUGGESTIONS.map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
          <Clock size={12} className="text-ai" />
          Best Time to Stream
        </label>
        <div className="space-y-1.5">
          {BEST_TIMES.map((t, i) => (
            <div key={i} className="flex items-center gap-3 p-2.5 bg-surface rounded-xl border border-surface-border">
              <span className="text-white text-xs font-semibold w-20 shrink-0">{t.time}</span>
              <div className="flex-1">
                <div className="h-1.5 bg-surface-hover rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${t.score}%`,
                      backgroundColor: i === 0 ? '#00FF7F' : '#2A2A2A',
                    }}
                  />
                </div>
                <p className="text-zinc-600 text-xs mt-1">{t.reason}</p>
              </div>
              <span className={`text-xs font-bold shrink-0 ${i === 0 ? 'text-accent' : 'text-zinc-500'}`}>
                {t.score}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
          <TrendingUp size={12} className="text-ai" />
          Growth Insights
        </label>
        <div className="space-y-2">
          {GROWTH_INSIGHTS.map((insight, i) => {
            const Icon = insight.icon;
            return (
              <div key={i} className="flex items-start gap-2.5 p-2.5 bg-surface rounded-xl border border-surface-border">
                <Icon size={13} className={`${insight.color} shrink-0 mt-0.5`} />
                <p className="text-zinc-400 text-xs leading-relaxed">{insight.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
