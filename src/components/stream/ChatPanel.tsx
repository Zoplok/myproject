import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Zap, Bot, FileText, AlertTriangle, ChevronDown } from 'lucide-react';
import type { ChatMessage } from '../../types';
import ChatMessageComponent from '../chat/ChatMessage';
import ChatInput from '../chat/ChatInput';
import { MOCK_CHAT } from '../../data/mockData';

type ChatTab = 'chat' | 'ai' | 'mod';

const AI_SUMMARY = "The streamer just hit rank Diamond I after a comeback game. Chat is hyped — 3 raid trains happened in the last hour. Current game: ranked League of Legends. Highlight moment at 1:23:45 — 1v5 clutch play.";

const AI_RESPONSES = [
  "The streamer explained they main jungle because it gives the most carry potential in solo queue.",
  "That champion was patched 2 weeks ago — the streamer mentioned they've been adapting their playstyle.",
  "Chat is asking about the streamer's setup — they mentioned it in the about section of their profile.",
];

export default function ChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_CHAT);
  const [tab, setTab] = useState<ChatTab>('chat');
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const flaggedCount = messages.filter(m => m.isFlagged).length;

  useEffect(() => {
    if (tab === 'chat') {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, tab]);

  useEffect(() => {
    const interval = setInterval(() => {
      const sample = MOCK_CHAT[Math.floor(Math.random() * MOCK_CHAT.length)];
      setMessages(prev => [...prev.slice(-50), {
        ...sample,
        id: `${Date.now()}-${Math.random()}`,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      }]);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const handleSend = (msg: string) => {
    const newMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      username: 'You',
      usernameColor: '#00FF7F',
      message: msg,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      badges: [{ type: 'subscriber', label: 'Sub' }],
    };
    setMessages(prev => [...prev, newMsg]);
  };

  const handleAIQuestion = async () => {
    if (!aiQuestion.trim()) return;
    setAiLoading(true);
    setAiAnswer('');
    await new Promise(r => setTimeout(r, 1200));
    setAiAnswer(AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)]);
    setAiLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-surface rounded-xl border border-surface-border overflow-hidden">
      <div className="flex items-center border-b border-surface-border">
        {[
          { key: 'chat' as ChatTab, label: 'Chat', icon: MessageSquare },
          { key: 'ai' as ChatTab, label: 'AI', icon: Bot },
          { key: 'mod' as ChatTab, label: `Mod ${flaggedCount > 0 ? `(${flaggedCount})` : ''}`, icon: AlertTriangle },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-medium border-b-2 transition-colors ${
              tab === key
                ? key === 'ai' ? 'border-ai text-ai' : key === 'mod' ? 'border-red-400 text-red-400' : 'border-accent text-accent'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {tab === 'chat' && (
        <>
          <div className="flex-1 overflow-y-auto py-2 space-y-0.5">
            {messages.map(m => <ChatMessageComponent key={m.id} message={m} />)}
            <div ref={bottomRef} />
          </div>
          <ChatInput onSend={handleSend} />
        </>
      )}

      {tab === 'ai' && (
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          <div className="card p-3">
            <div className="flex items-center gap-2 mb-2">
              <FileText size={13} className="text-ai" />
              <span className="text-xs font-semibold text-ai">Stream Summary</span>
              <span className="ml-auto text-xs text-zinc-500">Updated live</span>
            </div>
            <p className="text-sm text-zinc-300 leading-relaxed">{AI_SUMMARY}</p>
          </div>

          <div className="card p-3">
            <div className="flex items-center gap-2 mb-3">
              <Bot size={13} className="text-ai" />
              <span className="text-xs font-semibold text-ai">Ask AI anything</span>
            </div>
            <div className="flex gap-2">
              <input
                value={aiQuestion}
                onChange={e => setAiQuestion(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAIQuestion()}
                placeholder='e.g. "What just happened?"'
                className="input-dark flex-1 text-xs"
              />
              <button
                onClick={handleAIQuestion}
                disabled={aiLoading || !aiQuestion.trim()}
                className="btn-ai text-xs px-3 disabled:opacity-40"
              >
                {aiLoading ? '...' : 'Ask'}
              </button>
            </div>
            {aiLoading && (
              <div className="mt-3 flex items-center gap-2 text-ai text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-ai ai-pulse" />
                Analyzing stream...
              </div>
            )}
            {aiAnswer && (
              <div className="mt-3 p-2.5 bg-ai/5 border border-ai/20 rounded-lg animate-fade-in">
                <p className="text-sm text-zinc-300 leading-relaxed">{aiAnswer}</p>
              </div>
            )}
          </div>

          <div className="card p-3">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={13} className="text-accent" />
              <span className="text-xs font-semibold text-accent">Key Moments</span>
            </div>
            {['1:23:45 — 1v5 clutch', '2:14:10 — Hype raid train', '3:05:30 — Personal record'].map((m, i) => (
              <div key={i} className="flex items-center gap-2 py-1.5 border-b border-surface-border last:border-0">
                <ChevronDown size={12} className="text-zinc-600 rotate-[-90deg]" />
                <span className="text-xs text-zinc-400">{m}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'mod' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="flex items-center gap-2 p-2.5 bg-red-500/10 border border-red-500/20 rounded-xl">
            <AlertTriangle size={14} className="text-red-400 shrink-0" />
            <p className="text-xs text-red-400 font-medium">{flaggedCount} message{flaggedCount !== 1 ? 's' : ''} flagged by AI moderation</p>
          </div>
          {messages.filter(m => m.isFlagged).map(m => (
            <div key={m.id} className="card p-3">
              <div className="flex items-start gap-2 mb-2">
                <span className="text-xs font-bold text-red-400">{m.username}</span>
                <span className="ml-auto text-xs text-zinc-500">{m.timestamp}</span>
              </div>
              <p className="text-xs text-zinc-300 mb-2">{m.message}</p>
              <div className="flex items-center gap-1.5 mb-3">
                <AlertTriangle size={10} className="text-yellow-400" />
                <span className="text-xs text-yellow-400">{m.flagReason}</span>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 py-1.5 text-xs rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/20 transition-colors font-medium">
                  Timeout
                </button>
                <button className="flex-1 py-1.5 text-xs rounded-lg bg-surface-hover text-zinc-400 hover:text-white border border-surface-border transition-colors font-medium">
                  Dismiss
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
