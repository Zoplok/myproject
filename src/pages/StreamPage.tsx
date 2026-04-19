import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import type { Stream } from '../types';
import VideoPlayer from '../components/stream/VideoPlayer';
import ChatPanel from '../components/stream/ChatPanel';
import StreamInfo from '../components/stream/StreamInfo';
import AIHighlights from '../components/stream/AIHighlights';
import StreamGrid from '../components/home/StreamGrid';
import { AI_HIGHLIGHTS, RECOMMENDED_STREAMS } from '../data/mockData';
import { streamService } from '../lib/streams';

interface StreamPageProps {
  stream: Stream;
  onBack: () => void;
  onSelectStream: (id: string) => void;
  onViewProfile: () => void;
}

export default function StreamPage({ stream, onBack, onSelectStream, onViewProfile }: StreamPageProps) {
  const [relatedStreams, setRelatedStreams] = useState(RECOMMENDED_STREAMS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRelatedStreams();
  }, [stream.id]);

  const loadRelatedStreams = async () => {
    setLoading(true);
    try {
      const { data } = await streamService.getStreamsByCategory(stream.id, 6);
      if (data && data.length > 0) {
        setRelatedStreams(data.map(s => ({
          id: s.id,
          title: s.title,
          streamerName: s.profiles?.display_name || 'Unknown',
          streamerAvatar: s.profiles?.avatar_url || '',
          thumbnail: s.thumbnail_url || '',
          category: s.stream_categories?.name || '',
          viewers: s.viewer_count || 0,
          followers: 0,
          totalViews: 0,
          tags: [],
          isLive: s.is_live,
          startedAt: '',
        } as Stream)));
      }
    } catch (error) {
      console.error('Failed to load related streams:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-16">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-zinc-400 hover:text-white text-sm font-medium mb-4 transition-colors group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
        Back to Home
      </button>

      <div className="flex gap-4 items-start">
        <div className="flex-1 min-w-0 space-y-4">
          <VideoPlayer stream={stream} />
          <StreamInfo stream={stream} onViewProfile={onViewProfile} />
          <AIHighlights highlights={AI_HIGHLIGHTS} />
          <StreamGrid
            streams={relatedStreams.filter(s => s.id !== stream.id).slice(0, 6)}
            onSelectStream={onSelectStream}
            title="More Live Streams"
            subtitle="You might also like"
          />
        </div>

        <div className="w-80 xl:w-96 shrink-0 sticky top-18" style={{ height: 'calc(100vh - 5rem)' }}>
          <ChatPanel />
        </div>
      </div>
    </div>
  );
}
