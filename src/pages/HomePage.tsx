import { useEffect, useState } from 'react';
import FeaturedCarousel from '../components/home/FeaturedCarousel';
import StreamGrid from '../components/home/StreamGrid';
import CategoriesSection from '../components/home/CategoriesSection';
import AIRecommendations from '../components/home/AIRecommendations';
import { FEATURED_STREAMS, RECOMMENDED_STREAMS, CATEGORIES } from '../data/mockData';
import { streamService } from '../lib/streams';
import type { Stream, Category } from '../types';

interface HomePageProps {
  onSelectStream: (id: string) => void;
}

export default function HomePage({ onSelectStream }: HomePageProps) {
  const [liveStreams, setLiveStreams] = useState<Stream[]>(FEATURED_STREAMS);
  const [categories, setCategories] = useState<Category[]>(CATEGORIES);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data: streamsData } = await streamService.getLiveStreams(20);
      const { data: categoriesData } = await streamService.getCategories();

      if (streamsData && streamsData.length > 0) {
        setLiveStreams(streamsData.map(s => ({
          id: s.id,
          title: s.title,
          streamerName: s.profiles?.display_name || 'Unknown',
          streamerAvatar: s.profiles?.avatar_url || 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg',
          thumbnail: s.thumbnail_url || 'https://images.pexels.com/photos/7862357/pexels-photo-7862357.jpeg',
          category: s.stream_categories?.name || 'Variety',
          viewers: s.viewer_count || 0,
          followers: s.profiles?.follower_count || 0,
          totalViews: s.profiles?.total_views || 0,
          tags: s.stream_tags?.map((t: any) => t.tag) || [],
          isLive: s.is_live,
          startedAt: s.started_at ? new Date(s.started_at).toLocaleString() : '0h',
        } as Stream)));
      }

      if (categoriesData && categoriesData.length > 0) {
        setCategories(categoriesData.map(c => ({
          id: c.id,
          name: c.name,
          thumbnail: c.thumbnail_url || 'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg',
          viewers: Math.floor(Math.random() * 100000) + 10000,
          streams: Math.floor(Math.random() * 5000) + 100,
          color: '#00FF7F',
        } as Category)));
      }
    } catch (error) {
      console.error('Failed to load streams:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-zinc-400">Loading streams...</div>;
  }

  return (
    <div className="space-y-10 pb-16">
      <FeaturedCarousel streams={liveStreams.length > 0 ? liveStreams : FEATURED_STREAMS} onSelectStream={onSelectStream} />
      <AIRecommendations streams={RECOMMENDED_STREAMS} onSelectStream={onSelectStream} />
      <CategoriesSection categories={categories} />
      <StreamGrid
        streams={liveStreams.length > 0 ? liveStreams : RECOMMENDED_STREAMS}
        onSelectStream={onSelectStream}
        title="Live Now"
        subtitle="Streams going on right now across all categories"
      />
      <StreamGrid
        streams={liveStreams.length > 0 ? [...liveStreams].reverse() : RECOMMENDED_STREAMS}
        onSelectStream={onSelectStream}
        title="Rising Streamers"
        subtitle="Growing channels worth checking out"
      />
    </div>
  );
}
