import { useState } from 'react';
import { Radio, Settings, Tag, Hash, ArrowLeft, Tv } from 'lucide-react';
import StreamKeyPanel from '../components/dashboard/StreamKeyPanel';
import AnalyticsPanel from '../components/dashboard/AnalyticsPanel';
import AICreatorAssistant from '../components/dashboard/AICreatorAssistant';
import { CATEGORIES } from '../data/mockData';

interface DashboardPageProps {
  onBack: () => void;
}

export default function DashboardPage({ onBack }: DashboardPageProps) {
  const [isLive, setIsLive] = useState(false);
  const [title, setTitle] = useState('Ranked Grind to Master — Road to Top 500');
  const [category, setCategory] = useState('League of Legends');
  const [tags, setTags] = useState('Ranked, Educational, English');

  return (
    <div className="pb-16 animate-fade-in">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-zinc-400 hover:text-white text-sm font-medium mb-6 transition-colors group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
        Back to Home
      </button>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Creator Dashboard</h1>
          <p className="text-zinc-500 text-sm mt-0.5">Manage your stream and track performance</p>
        </div>
        <div className="flex items-center gap-3">
          {isLive && (
            <div className="flex items-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-red-500 live-dot" />
              <span className="text-red-400 text-sm font-semibold">You are LIVE</span>
            </div>
          )}
          <button
            onClick={() => setIsLive(l => !l)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 ${
              isLive
                ? 'bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30'
                : 'bg-accent text-black hover:bg-accent-dim hover:shadow-accent-sm'
            }`}
          >
            <Radio size={15} />
            {isLive ? 'End Stream' : 'Go Live'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 space-y-5">
          <div className="card p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-surface border border-surface-border flex items-center justify-center">
                <Settings size={15} className="text-accent" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Stream Settings</h3>
                <p className="text-xs text-zinc-500">Configure your live stream details</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-zinc-400 mb-1.5 flex items-center gap-1.5">
                  <Tv size={11} />
                  Stream Title
                </label>
                <input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="input-dark w-full"
                  maxLength={140}
                  placeholder="Give your stream a title..."
                />
                <div className="flex justify-end mt-1">
                  <span className="text-xs text-zinc-600">{title.length}/140</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-400 mb-1.5 flex items-center gap-1.5">
                  <Tag size={11} />
                  Category
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="input-dark w-full appearance-none"
                >
                  {CATEGORIES.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                  <option>League of Legends</option>
                  <option>Valorant</option>
                  <option>Minecraft</option>
                  <option>Elden Ring</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-400 mb-1.5 flex items-center gap-1.5">
                  <Hash size={11} />
                  Tags
                </label>
                <input
                  value={tags}
                  onChange={e => setTags(e.target.value)}
                  className="input-dark w-full"
                  placeholder="Add tags separated by commas..."
                />
                <p className="text-xs text-zinc-600 mt-1">Separate tags with commas. Max 5 tags.</p>
              </div>

              <button className="btn-accent text-sm">
                Save Settings
              </button>
            </div>
          </div>

          <AnalyticsPanel />
          <StreamKeyPanel />
        </div>

        <div className="space-y-5">
          <AICreatorAssistant />

          <div className="card p-5">
            <h3 className="text-sm font-bold text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Run Ad', desc: 'Run a 30s ad break' },
                { label: 'Poll', desc: 'Create viewer poll' },
                { label: 'Clip It', desc: 'Save last 30s' },
                { label: 'Host', desc: 'Host another channel' },
              ].map(a => (
                <button key={a.label} className="p-3 bg-surface rounded-xl border border-surface-border hover:bg-surface-hover hover:border-zinc-600 transition-all text-left">
                  <p className="text-white text-xs font-semibold">{a.label}</p>
                  <p className="text-zinc-500 text-xs mt-0.5">{a.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
