import { useState } from 'react';
import { BadgeCheck, Users, Eye, Star, Play, Clock, Calendar, Twitter, Youtube, MessageSquare, ArrowLeft } from 'lucide-react';
import { MOCK_PROFILE, MOCK_CLIPS, formatViewers } from '../data/mockData';

type ProfileTab = 'videos' | 'clips' | 'about' | 'schedule';

interface ProfilePageProps {
  onBack: () => void;
}

export default function ProfilePage({ onBack }: ProfilePageProps) {
  const [tab, setTab] = useState<ProfileTab>('clips');
  const profile = MOCK_PROFILE;

  const tabs: { key: ProfileTab; label: string }[] = [
    { key: 'videos', label: 'Videos' },
    { key: 'clips', label: 'Clips' },
    { key: 'about', label: 'About' },
    { key: 'schedule', label: 'Schedule' },
  ];

  return (
    <div className="pb-16 animate-fade-in">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-zinc-400 hover:text-white text-sm font-medium mb-4 transition-colors group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
        Back
      </button>

      <div className="relative rounded-2xl overflow-hidden h-48 mb-0">
        <img src={profile.banner} alt="Banner" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
      </div>

      <div className="relative -mt-14 px-4 pb-5 flex flex-col sm:flex-row items-start sm:items-end gap-4">
        <div className="relative shrink-0">
          <img
            src={profile.avatar}
            alt={profile.displayName}
            className="w-28 h-28 rounded-2xl object-cover border-4 border-[#0A0A0A]"
          />
          <span className="absolute -bottom-1 -right-1 badge-live text-xs px-2 py-0.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-white live-dot" />
            LIVE
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold text-white">{profile.displayName}</h1>
            {profile.isVerified && <BadgeCheck size={20} className="text-ai" />}
          </div>
          <p className="text-zinc-500 text-sm mt-0.5">@{profile.username}</p>

          <div className="flex items-center gap-5 mt-3 flex-wrap">
            <div className="text-center">
              <p className="text-white font-bold text-lg leading-none">{formatViewers(profile.followers)}</p>
              <p className="text-zinc-500 text-xs mt-0.5 flex items-center gap-1"><Users size={10} /> Followers</p>
            </div>
            <div className="text-center">
              <p className="text-white font-bold text-lg leading-none">{formatViewers(profile.totalViews)}</p>
              <p className="text-zinc-500 text-xs mt-0.5 flex items-center gap-1"><Eye size={10} /> Total Views</p>
            </div>
            <div className="text-center">
              <p className="text-white font-bold text-lg leading-none">{formatViewers(profile.subscriberCount)}</p>
              <p className="text-zinc-500 text-xs mt-0.5 flex items-center gap-1"><Star size={10} /> Subscribers</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button className="btn-outline text-sm">Follow</button>
          <button className="btn-accent text-sm">Subscribe</button>
          <div className="flex gap-1">
            {profile.socialLinks.map(link => {
              const icons: Record<string, React.ReactNode> = {
                Twitter: <Twitter size={14} />,
                YouTube: <Youtube size={14} />,
                Discord: <MessageSquare size={14} />,
              };
              return (
                <button key={link.platform} className="p-2 rounded-lg border border-surface-border text-zinc-400 hover:text-white hover:bg-surface-hover transition-colors">
                  {icons[link.platform] || <MessageSquare size={14} />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="border-b border-surface-border flex gap-0 mb-6">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
              tab === t.key
                ? 'border-accent text-accent'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'clips' && <ClipsTab />}
      {tab === 'videos' && <VideosTab />}
      {tab === 'about' && <AboutTab />}
      {tab === 'schedule' && <ScheduleTab />}
    </div>
  );
}

function ClipsTab() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {MOCK_CLIPS.map(clip => (
        <div key={clip.id} className="stream-card group">
          <div className="relative aspect-video rounded-xl overflow-hidden">
            <img src={clip.thumbnail} alt={clip.title} className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-12 h-12 rounded-full bg-black/60 flex items-center justify-center">
                <Play size={20} className="text-white ml-0.5" fill="white" />
              </div>
            </div>
            <div className="absolute bottom-1.5 right-1.5 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
              {clip.duration}
            </div>
          </div>
          <div className="p-2">
            <p className="text-white text-xs font-semibold line-clamp-2 leading-snug">{clip.title}</p>
            <div className="flex items-center gap-3 mt-1.5 text-zinc-500 text-xs">
              <span className="flex items-center gap-1"><Eye size={10} />{formatViewers(clip.views)}</span>
              <span>{clip.createdAt}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function VideosTab() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {MOCK_CLIPS.slice(0, 3).map(clip => (
        <div key={clip.id} className="stream-card group">
          <div className="relative aspect-video rounded-t-xl overflow-hidden">
            <img src={clip.thumbnail} alt={clip.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-14 h-14 rounded-full bg-black/60 flex items-center justify-center">
                <Play size={24} className="text-white ml-0.5" fill="white" />
              </div>
            </div>
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded flex items-center gap-1">
              <Clock size={10} />
              {clip.duration}
            </div>
          </div>
          <div className="p-3 bg-surface-elevated rounded-b-xl border-x border-b border-surface-border">
            <p className="text-white text-sm font-semibold">{clip.title}</p>
            <div className="flex items-center gap-3 mt-1.5 text-zinc-500 text-xs">
              <span>{formatViewers(clip.views)} views</span>
              <span>{clip.createdAt}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function AboutTab() {
  const profile = MOCK_PROFILE;
  return (
    <div className="max-w-2xl space-y-5">
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-white mb-3">About</h3>
        <p className="text-zinc-400 text-sm leading-relaxed">{profile.bio}</p>
      </div>
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-white mb-3">Channel Stats</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Followers', value: formatViewers(profile.followers) },
            { label: 'Total Views', value: formatViewers(profile.totalViews) },
            { label: 'Subscribers', value: formatViewers(profile.subscriberCount) },
            { label: 'Streaming Since', value: '2019' },
          ].map(s => (
            <div key={s.label} className="bg-surface rounded-lg p-3 border border-surface-border">
              <p className="text-xl font-bold text-white">{s.value}</p>
              <p className="text-zinc-500 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ScheduleTab() {
  const profile = MOCK_PROFILE;
  return (
    <div className="max-w-lg">
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={15} className="text-accent" />
          <h3 className="text-sm font-semibold text-white">Weekly Stream Schedule</h3>
          <span className="ml-auto text-xs text-zinc-500">All times EST</span>
        </div>
        <div className="space-y-2">
          {profile.schedule.map(day => (
            <div key={day.day} className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
              day.startTime === 'OFF' ? 'bg-surface/30 border-surface-border opacity-40' : 'bg-surface border-surface-border hover:border-accent/30'
            }`}>
              <div className="flex items-center gap-3">
                <span className="w-10 text-sm font-bold text-white">{day.day}</span>
                {day.startTime !== 'OFF' && (
                  <span className="w-2 h-2 rounded-full bg-accent" />
                )}
              </div>
              {day.startTime === 'OFF' ? (
                <span className="text-zinc-600 text-sm">Off day</span>
              ) : (
                <div className="text-right">
                  <p className="text-white text-sm font-medium">{day.startTime} – {day.endTime}</p>
                  <p className="text-zinc-500 text-xs">{day.category}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
