import { useState } from 'react';
import { ChevronLeft, ChevronRight, Users, Zap } from 'lucide-react';
import type { Stream } from '../../types';
import { formatViewers } from '../../data/mockData';

interface FeaturedCarouselProps {
  streams: Stream[];
  onSelectStream: (id: string) => void;
}

export default function FeaturedCarousel({ streams, onSelectStream }: FeaturedCarouselProps) {
  const [active, setActive] = useState(0);

  const prev = () => setActive(i => (i - 1 + streams.length) % streams.length);
  const next = () => setActive(i => (i + 1) % streams.length);

  const stream = streams[active];

  return (
    <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden group cursor-pointer shadow-card"
      onClick={() => onSelectStream(stream.id)}>
      <img
        src={stream.thumbnail}
        alt={stream.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      <div className="absolute inset-0 featured-gradient" />

      {stream.aiRecommended && (
        <div className="absolute top-4 left-4">
          <span className="badge-ai flex items-center gap-1">
            <Zap size={10} />
            {stream.aiReason}
          </span>
        </div>
      )}

      <div className="absolute top-4 right-4 flex items-center gap-2">
        <span className="badge-live flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-white live-dot" />
          LIVE
        </span>
        <span className="bg-black/60 text-white text-xs px-2 py-1 rounded-lg flex items-center gap-1.5">
          <Users size={11} className="text-red-400" />
          {formatViewers(stream.viewers)}
        </span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="flex items-end justify-between">
          <div>
            <span className="tag mb-2 inline-block">{stream.category}</span>
            <h2 className="text-2xl font-bold text-white leading-tight mb-2 max-w-2xl">{stream.title}</h2>
            <div className="flex items-center gap-3">
              <img src={stream.streamerAvatar} alt={stream.streamerName}
                className="w-8 h-8 rounded-full object-cover border-2 border-accent/40" />
              <span className="text-white font-semibold">{stream.streamerName}</span>
              <span className="text-zinc-400 text-sm">{stream.startedAt} ago</span>
            </div>
            <div className="flex gap-2 mt-3">
              {stream.tags.map(t => <span key={t} className="tag">{t}</span>)}
            </div>
          </div>
          <button
            onClick={e => { e.stopPropagation(); onSelectStream(stream.id); }}
            className="btn-accent hidden sm:flex items-center gap-2 shrink-0"
          >
            Watch Now
          </button>
        </div>
      </div>

      <button
        onClick={e => { e.stopPropagation(); prev(); }}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={e => { e.stopPropagation(); next(); }}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
      >
        <ChevronRight size={20} />
      </button>

      <div className="absolute bottom-4 right-6 flex gap-1.5">
        {streams.map((_, i) => (
          <button
            key={i}
            onClick={e => { e.stopPropagation(); setActive(i); }}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === active ? 'bg-accent w-6' : 'bg-white/30 w-1.5 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
