import { Home, Compass, Heart, Grid2x2 as Grid, Settings, Radio, Users, TrendingUp, Zap } from 'lucide-react';
import type { Page } from '../../types';
import { RECOMMENDED_STREAMS, formatViewers } from '../../data/mockData';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page, streamId?: string) => void;
  collapsed: boolean;
}

const navLinks = [
  { icon: Home, label: 'Home', page: 'home' as Page },
  { icon: Compass, label: 'Browse', page: 'home' as Page },
  { icon: Heart, label: 'Following', page: 'home' as Page },
  { icon: Grid, label: 'Categories', page: 'home' as Page },
  { icon: TrendingUp, label: 'Trending', page: 'home' as Page },
  { icon: Settings, label: 'Settings', page: 'dashboard' as Page },
];

export default function Sidebar({ currentPage, onNavigate, collapsed }: SidebarProps) {
  const liveFollowed = RECOMMENDED_STREAMS.slice(0, 5);

  return (
    <aside
      className={`fixed left-0 top-14 bottom-0 bg-surface border-r border-surface-border flex flex-col z-30 transition-all duration-300 overflow-hidden ${
        collapsed ? 'w-14' : 'w-60'
      }`}
    >
      <div className="flex-1 overflow-y-auto py-3 px-2">
        <nav className="space-y-0.5">
          {navLinks.map(({ icon: Icon, label, page }) => (
            <button
              key={label}
              onClick={() => onNavigate(page)}
              className={`sidebar-link w-full ${currentPage === page && label === 'Home' ? 'active' : ''}`}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span>{label}</span>}
            </button>
          ))}
        </nav>

        {!collapsed && (
          <>
            <div className="mt-5 mb-2 px-3">
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Following</p>
            </div>
            <div className="space-y-0.5">
              {liveFollowed.map((stream) => (
                <button
                  key={stream.id}
                  onClick={() => onNavigate('stream', stream.id)}
                  className="sidebar-link w-full group"
                >
                  <div className="relative shrink-0">
                    <img
                      src={stream.streamerAvatar}
                      alt={stream.streamerName}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-surface live-dot" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{stream.streamerName}</p>
                    <p className="text-xs text-zinc-500 truncate">{stream.category}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Users size={10} className="text-red-400" />
                    <span className="text-xs text-zinc-500">{formatViewers(stream.viewers)}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-5 mb-2 px-3">
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Creator</p>
            </div>
            <button
              onClick={() => onNavigate('dashboard')}
              className={`sidebar-link w-full ${currentPage === 'dashboard' ? 'active' : ''}`}
            >
              <Radio size={18} className="shrink-0" />
              <span>Go Live</span>
              <span className="ml-auto">
                <Zap size={12} className="text-accent" />
              </span>
            </button>
          </>
        )}
      </div>

      {!collapsed && (
        <div className="p-3 border-t border-surface-border">
          <button
            onClick={() => onNavigate('dashboard')}
            className="btn-accent w-full flex items-center justify-center gap-2 text-sm"
          >
            <Radio size={14} />
            Go Live
          </button>
        </div>
      )}
    </aside>
  );
}
