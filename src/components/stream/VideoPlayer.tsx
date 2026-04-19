import { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, Files as Subtitles, Globe } from 'lucide-react';
import type { Stream } from '../../types';
import { formatViewers } from '../../data/mockData';

interface VideoPlayerProps {
  stream: Stream;
}

const LANGUAGES = ['English', 'Spanish', 'Japanese', 'French', 'Portuguese', 'Korean'];

export default function VideoPlayer({ stream }: VideoPlayerProps) {
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [captionsOn, setCaptionsOn] = useState(false);
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [selectedLang, setSelectedLang] = useState('English');

  return (
    <div
      className="relative w-full aspect-video bg-black rounded-xl overflow-hidden group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => { setShowControls(false); setShowLangPicker(false); }}
    >
      <img
        src={stream.thumbnail}
        alt={stream.title}
        className="w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-black/10" />

      {captionsOn && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-center">
          <span className="bg-black/80 text-white text-sm px-3 py-1.5 rounded-lg font-medium">
            [AI Captions] — {selectedLang} — Real-time translation active
          </span>
        </div>
      )}

      <div className="absolute top-3 left-3 flex items-center gap-2">
        <span className="badge-live flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-white live-dot" />
          LIVE
        </span>
        <span className="bg-black/60 text-white text-xs px-2 py-1 rounded-lg">
          {formatViewers(stream.viewers)} watching
        </span>
      </div>

      <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-200 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <div className="w-full h-1 bg-white/20 rounded-full mb-3 cursor-pointer group/progress">
          <div className="h-full w-[65%] bg-accent rounded-full relative">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover/progress:opacity-100 transition-opacity" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setPlaying(p => !p)}
            className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            {playing ? <Pause size={16} /> : <Play size={16} />}
          </button>

          <button
            onClick={() => setMuted(m => !m)}
            className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>

          <div className="w-24 h-1 bg-white/20 rounded-full cursor-pointer">
            <div className={`h-full bg-white rounded-full transition-all ${muted ? 'w-0' : 'w-3/4'}`} />
          </div>

          <span className="text-white/60 text-xs ml-1">{stream.startedAt} elapsed</span>

          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => { setCaptionsOn(c => !c); setShowLangPicker(false); }}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  captionsOn ? 'bg-ai/20 text-ai border border-ai/30' : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <Subtitles size={13} />
                CC
              </button>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowLangPicker(s => !s)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  showLangPicker ? 'bg-ai/20 text-ai border border-ai/30' : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <Globe size={13} />
                {selectedLang}
              </button>
              {showLangPicker && (
                <div className="absolute bottom-full right-0 mb-2 bg-surface-elevated border border-surface-border rounded-xl overflow-hidden shadow-card min-w-[140px] animate-scale-in">
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang}
                      onClick={() => { setSelectedLang(lang); setShowLangPicker(false); setCaptionsOn(true); }}
                      className={`w-full text-left px-3 py-2 text-sm transition-colors hover:bg-surface-hover ${
                        lang === selectedLang ? 'text-ai' : 'text-zinc-300'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
              <Settings size={15} />
            </button>
            <button className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
              <Maximize size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
