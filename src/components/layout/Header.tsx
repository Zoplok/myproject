import { useState } from 'react';
import { Search, Bell, Menu, Zap, X, Mic } from 'lucide-react';
import type { Page } from '../../types';
import { AI_SEARCH_SUGGESTIONS } from '../../data/mockData';

interface HeaderProps {
  onNavigate: (page: Page, id?: string) => void;
  onToggleSidebar: () => void;
}

export default function Header({ onNavigate, onToggleSidebar }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  const filteredSuggestions = AI_SEARCH_SUGGESTIONS.filter(s =>
    s.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-surface border-b border-surface-border z-40 flex items-center px-4 gap-4">
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-surface-hover transition-colors"
        >
          <Menu size={20} />
        </button>
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 group"
        >
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center group-hover:shadow-accent-sm transition-shadow">
            <Zap size={16} className="text-black" fill="black" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight hidden sm:block">StreamFlow</span>
        </button>
      </div>

      <div className="flex-1 max-w-xl mx-auto relative">
        <div className={`flex items-center bg-surface-elevated border rounded-xl px-3 gap-2 transition-colors ${
          searchFocused ? 'border-accent/40' : 'border-surface-border'
        }`}>
          <Search size={15} className="text-zinc-500 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
            placeholder="Search streams, categories, people..."
            className="flex-1 bg-transparent py-2 text-sm text-white placeholder-zinc-500 focus:outline-none"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-zinc-500 hover:text-white transition-colors">
              <X size={14} />
            </button>
          )}
          <div className="border-l border-surface-border pl-2">
            <span className="text-xs text-ai font-semibold">AI</span>
          </div>
          <button className="text-zinc-500 hover:text-ai transition-colors">
            <Mic size={14} />
          </button>
        </div>

        {searchFocused && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-surface-elevated border border-surface-border rounded-xl shadow-card overflow-hidden animate-scale-in z-50">
            <div className="p-2 border-b border-surface-border">
              <p className="text-xs font-semibold text-ai px-2 py-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-ai inline-block" />
                AI Search — try natural language
              </p>
            </div>
            {filteredSuggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => setSearchQuery(s)}
                className="w-full text-left px-4 py-2.5 text-sm text-zinc-300 hover:bg-surface-hover hover:text-white transition-colors flex items-center gap-2"
              >
                <Search size={13} className="text-zinc-600 shrink-0" />
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-surface-hover transition-colors relative">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
        </button>
        <button
          onClick={() => onNavigate('profile')}
          className="w-8 h-8 rounded-full overflow-hidden border-2 border-surface-border hover:border-accent/50 transition-colors"
        >
          <img
            src="https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?w=80&h=80&fit=crop"
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </button>
      </div>
    </header>
  );
}
