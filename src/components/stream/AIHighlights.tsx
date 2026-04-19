import { Zap, Play, TrendingUp, Laugh, Crosshair, Flame, Sword } from 'lucide-react';
import type { AIHighlight } from '../../types';

interface AIHighlightsProps {
  highlights: AIHighlight[];
}

const clipTypeConfig = {
  clutch: { label: 'Clutch', color: 'text-red-400', icon: Crosshair },
  rage: { label: 'Rage', color: 'text-orange-400', icon: Flame },
  hype: { label: 'Hype', color: 'text-yellow-400', icon: TrendingUp },
  funny: { label: 'Funny', color: 'text-green-400', icon: Laugh },
  skill: { label: 'Skill', color: 'text-ai', icon: Sword },
};

export default function AIHighlights({ highlights }: AIHighlightsProps) {
  return (
    <section className="card p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-ai/10 border border-ai/20 flex items-center justify-center">
          <Zap size={15} className="text-ai" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">AI Highlights</h3>
          <p className="text-xs text-zinc-500">Auto-clipped best moments from this stream</p>
        </div>
        <span className="ml-auto badge-ai">Live</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {highlights.map(h => {
          const config = clipTypeConfig[h.clipType];
          const Icon = config.icon;
          return (
            <div key={h.id} className="group cursor-pointer">
              <div className="relative aspect-video rounded-lg overflow-hidden bg-surface-elevated">
                <img src={h.thumbnail} alt={h.title} className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-10 h-10 rounded-full bg-black/60 flex items-center justify-center">
                    <Play size={18} className="text-white ml-0.5" fill="white" />
                  </div>
                </div>
                <div className="absolute bottom-1.5 right-1.5 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                  {h.duration}
                </div>
                <div className={`absolute top-1.5 left-1.5 flex items-center gap-1 text-xs font-semibold ${config.color}`}>
                  <Icon size={11} />
                  {config.label}
                </div>
              </div>
              <div className="mt-1.5 px-0.5">
                <p className="text-white text-xs font-medium line-clamp-2 leading-snug">{h.title}</p>
                <p className="text-zinc-500 text-xs mt-0.5">{h.timestamp}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
