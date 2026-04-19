import { Users, Heart, BadgeCheck, Share2, DollarSign, Bell } from 'lucide-react';
import type { Stream } from '../../types';
import { formatViewers } from '../../data/mockData';

interface StreamInfoProps {
  stream: Stream;
  onViewProfile: () => void;
}

export default function StreamInfo({ stream, onViewProfile }: StreamInfoProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4">
        <button onClick={onViewProfile} className="shrink-0 relative group">
          <img
            src={stream.streamerAvatar}
            alt={stream.streamerName}
            className="w-14 h-14 rounded-full object-cover border-2 border-surface-border group-hover:border-accent/50 transition-colors"
          />
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 badge-live text-xs px-1.5 py-0.5">
            LIVE
          </span>
        </button>

        <div className="flex-1 min-w-0">
          <h1 className="text-white font-bold text-lg leading-tight">{stream.title}</h1>
          <div className="flex items-center gap-2 mt-1">
            <button
              onClick={onViewProfile}
              className="text-accent font-semibold text-sm hover:text-accent-dim transition-colors flex items-center gap-1"
            >
              {stream.streamerName}
              <BadgeCheck size={14} className="text-ai" />
            </button>
            <span className="text-zinc-600">·</span>
            <span className="text-zinc-400 text-sm">{stream.category}</span>
          </div>
          <div className="flex items-center gap-3 mt-1.5 text-sm text-zinc-500">
            <span className="flex items-center gap-1">
              <Users size={13} className="text-red-400" />
              {formatViewers(stream.viewers)} watching
            </span>
            <span className="flex items-center gap-1">
              <Heart size={13} />
              {formatViewers(stream.followers)} followers
            </span>
            <span>{stream.startedAt} ago</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
          <button className="btn-outline flex items-center gap-2 text-sm">
            <Bell size={14} />
            Follow
          </button>
          <button className="btn-accent flex items-center gap-2 text-sm">
            <Heart size={14} />
            Subscribe
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-yellow-500/30 text-yellow-400 text-sm font-medium hover:bg-yellow-500/10 transition-colors">
            <DollarSign size={14} />
            Donate
          </button>
          <button className="p-2 rounded-lg border border-surface-border text-zinc-400 hover:text-white hover:bg-surface-hover transition-colors">
            <Share2 size={15} />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {stream.tags.map(tag => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>
    </div>
  );
}
