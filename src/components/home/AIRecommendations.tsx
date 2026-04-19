import { Zap, Brain, TrendingUp, History } from 'lucide-react';
import type { Stream } from '../../types';
import { formatViewers } from '../../data/mockData';

interface AIRecommendationsProps {
  streams: Stream[];
  onSelectStream: (id: string) => void;
}

const AI_REASONS = [
  { icon: History, label: 'Based on watch history', color: 'text-ai' },
  { icon: TrendingUp, label: 'Trending in your genres', color: 'text-accent' },
  { icon: Brain, label: 'AI matched your taste', color: 'text-yellow-400' },
];

export default function AIRecommendations({ streams, onSelectStream }: AIRecommendationsProps) {
  const aiStreams = streams.filter(s => s.aiRecommended).slice(0, 4);

  return (
    <section className="card p-5">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl bg-ai/10 border border-ai/20 flex items-center justify-center ai-pulse">
          <Zap size={16} className="text-ai" />
        </div>
        <div>
          <h2 className="text-base font-bold text-white">For You</h2>
          <p className="text-xs text-zinc-500">Personalized picks based on your activity</p>
        </div>
        <span className="ml-auto badge-ai">AI Powered</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {aiStreams.map((stream, i) => {
          const reason = AI_REASONS[i % AI_REASONS.length];
          const ReasonIcon = reason.icon;
          return (
            <div
              key={stream.id}
              onClick={() => onSelectStream(stream.id)}
              className="stream-card bg-surface rounded-xl border border-surface-border hover:border-ai/30 transition-colors"
            >
              <div className="relative aspect-video rounded-t-xl overflow-hidden">
                <img src={stream.thumbnail} alt={stream.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 viewer-count-bg" />
                <div className="absolute top-2 left-2 badge-live flex items-center gap-1 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-white live-dot" />
                  LIVE
                </div>
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                  {formatViewers(stream.viewers)} viewers
                </div>
              </div>

              <div className="p-3">
                <p className="text-white text-xs font-semibold line-clamp-2 leading-snug mb-1">{stream.title}</p>
                <p className="text-zinc-500 text-xs mb-2">{stream.streamerName} · {stream.category}</p>
                <div className={`flex items-center gap-1.5 text-xs font-medium ${reason.color}`}>
                  <ReasonIcon size={11} />
                  <span>{stream.aiReason || reason.label}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
