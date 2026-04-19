import { useState } from 'react';
import { Key, Eye, EyeOff, Copy, RefreshCw, Check } from 'lucide-react';

export default function StreamKeyPanel() {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const streamKey = 'live_sk_f7a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6';

  const handleCopy = () => {
    navigator.clipboard.writeText(streamKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card p-5 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-accent-muted border border-accent/20 flex items-center justify-center">
          <Key size={15} className="text-accent" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">Stream Key</h3>
          <p className="text-xs text-zinc-500">Use in OBS, Streamlabs, or any RTMP client</p>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-zinc-400">Primary Stream Key</label>
        <div className="flex gap-2">
          <div className="flex-1 flex items-center gap-2 bg-surface border border-surface-border rounded-xl px-3 py-2.5">
            <span className="flex-1 font-mono text-xs text-zinc-300 truncate">
              {visible ? streamKey : '•'.repeat(32)}
            </span>
            <button
              onClick={() => setVisible(v => !v)}
              className="text-zinc-500 hover:text-zinc-300 transition-colors shrink-0"
            >
              {visible ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          <button
            onClick={handleCopy}
            className={`px-3 rounded-xl border transition-all text-sm font-medium flex items-center gap-1.5 ${
              copied
                ? 'bg-accent-muted border-accent/30 text-accent'
                : 'border-surface-border text-zinc-400 hover:text-white hover:bg-surface-hover'
            }`}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-zinc-400">RTMP Ingest URL</label>
        <div className="flex items-center gap-2 bg-surface border border-surface-border rounded-xl px-3 py-2.5">
          <span className="flex-1 font-mono text-xs text-zinc-300">rtmp://ingest.streamflow.tv/live</span>
          <button className="text-zinc-500 hover:text-zinc-300 transition-colors shrink-0">
            <Copy size={13} />
          </button>
        </div>
      </div>

      <button className="flex items-center gap-2 text-xs text-zinc-500 hover:text-red-400 transition-colors">
        <RefreshCw size={12} />
        Reset stream key
      </button>
    </div>
  );
}
