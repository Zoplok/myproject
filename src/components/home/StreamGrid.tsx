import { Users, Zap } from 'lucide-react';
import type { Stream } from '../../types';
import { formatViewers } from '../../data/mockData';

interface StreamGridProps {
  streams: Stream[];
  onSelectStream: (id: string) => void;
  title: string;
  subtitle?: string;
}

export default function StreamGrid({ streams, onSelectStream, title, subtitle }: StreamGridProps) {
  return (
    <section>
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-white">{title}</h2>
          {subtitle && <p className="text-sm text-zinc-500 mt-0.5">{subtitle}</p>}
        </div>
        <button className="text-sm text-accent hover:text-accent-dim font-medium transition-colors">
          View all
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
        {streams.map(stream => (
          <StreamCard key={stream.id} stream={stream} onClick={() => onSelectStream(stream.id)} />
        ))}
      </div>
    </section>
  );
}

function StreamCard({ stream, onClick }: { stream: Stream; onClick: () => void }) {
  return (
    <div className="stream-card" onClick={onClick}>
      <div className="relative aspect-video bg-surface-elevated">
        <img
          src={stream.thumbnail}
          alt={stream.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 viewer-count-bg" />

        <div className="absolute top-2 left-2 flex items-center gap-1.5">
          <span className="badge-live flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-white live-dot" />
            LIVE
          </span>
        </div>

        {stream.aiRecommended && (
          <div className="absolute top-2 right-2">
            <span className="badge-ai flex items-center gap-1 text-xs">
              <Zap size={9} />
              AI Pick
            </span>
          </div>
        )}

        <div className="absolute bottom-2 left-2 flex items-center gap-1">
          <Users size={11} className="text-red-400" />
          <span className="text-white text-xs font-medium">{formatViewers(stream.viewers)}</span>
        </div>

        <div className="absolute bottom-2 right-2">
          <span className="bg-black/70 text-zinc-300 text-xs px-1.5 py-0.5 rounded">
            {stream.startedAt}
          </span>
        </div>
      </div>

      <div className="p-2.5">
        <div className="flex gap-2">
          <img
            src={stream.streamerAvatar}
            alt={stream.streamerName}
            className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5 border border-surface-border"
          />
          <div className="min-w-0">
            <p className="text-white text-sm font-semibold leading-snug line-clamp-1">{stream.title}</p>
            <p className="text-zinc-400 text-xs mt-0.5">{stream.streamerName}</p>
            <p className="text-zinc-500 text-xs">{stream.category}</p>
            <div className="flex flex-wrap gap-1 mt-1.5">
              {stream.tags.slice(0, 2).map(t => (
                <span key={t} className="text-xs text-zinc-500 bg-surface-hover px-1.5 py-0.5 rounded-md border border-surface-border">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
