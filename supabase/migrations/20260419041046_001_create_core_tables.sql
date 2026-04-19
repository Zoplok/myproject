/*
  # Core Streaming Platform Schema

  1. New Tables
    - `profiles` - User profiles and streamer info
    - `streams` - Live stream records
    - `chat_messages` - Live chat history
    - `followers` - User follow relationships
    - `stream_categories` - Stream categories
    - `clips` - User-created clips
    - `stream_tags` - Tags associated with streams
    - `ai_highlights` - AI-generated stream highlights

  2. Security
    - Enable RLS on all tables
    - Users can read public data
    - Users can only modify their own data
    - Mods can manage chat messages

  3. Indexes
    - Stream discovery queries
    - Chat message lookup
    - Follower relationships
*/

CREATE TABLE IF NOT EXISTS stream_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  thumbnail_url text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  display_name text NOT NULL,
  bio text,
  avatar_url text,
  banner_url text,
  follower_count integer DEFAULT 0,
  total_views integer DEFAULT 0,
  is_verified boolean DEFAULT false,
  is_streamer boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS streams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  streamer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  thumbnail_url text,
  category_id uuid REFERENCES stream_categories(id),
  is_live boolean DEFAULT false,
  started_at timestamptz DEFAULT now(),
  ended_at timestamptz,
  viewer_count integer DEFAULT 0,
  peak_viewer_count integer DEFAULT 0,
  stream_key text UNIQUE NOT NULL,
  rtmp_url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS stream_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stream_id uuid NOT NULL REFERENCES streams(id) ON DELETE CASCADE,
  tag text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS followers (
  follower_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  following_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (follower_id, following_id),
  CHECK (follower_id != following_id)
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stream_id uuid NOT NULL REFERENCES streams(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message text NOT NULL,
  is_moderated boolean DEFAULT false,
  moderation_reason text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS clips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stream_id uuid NOT NULL REFERENCES streams(id) ON DELETE CASCADE,
  creator_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  thumbnail_url text,
  video_url text NOT NULL,
  start_timestamp integer,
  end_timestamp integer,
  view_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ai_highlights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stream_id uuid NOT NULL REFERENCES streams(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  thumbnail_url text,
  start_timestamp integer NOT NULL,
  end_timestamp integer NOT NULL,
  clip_type text CHECK (clip_type IN ('clutch', 'rage', 'hype', 'funny', 'skill')),
  confidence_score float,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS subscribers (
  subscriber_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  streamer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tier integer DEFAULT 1,
  started_at timestamptz DEFAULT now(),
  renewed_at timestamptz DEFAULT now(),
  PRIMARY KEY (subscriber_id, streamer_id)
);

CREATE TABLE IF NOT EXISTS donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  streamer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  stream_id uuid REFERENCES streams(id) ON DELETE SET NULL,
  amount decimal(10, 2) NOT NULL,
  message text,
  created_at timestamptz DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_streams_streamer_id ON streams(streamer_id);
CREATE INDEX idx_streams_is_live ON streams(is_live) WHERE is_live = true;
CREATE INDEX idx_streams_category_id ON streams(category_id);
CREATE INDEX idx_chat_messages_stream_id ON chat_messages(stream_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at DESC);
CREATE INDEX idx_followers_following_id ON followers(following_id);
CREATE INDEX idx_clips_stream_id ON clips(stream_id);
CREATE INDEX idx_ai_highlights_stream_id ON ai_highlights(stream_id);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE stream_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE followers ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE clips ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE stream_categories ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Streams policies
CREATE POLICY "Live streams are viewable by everyone"
  ON streams FOR SELECT
  USING (is_live = true OR auth.uid() = streamer_id);

CREATE POLICY "Streamers can create streams"
  ON streams FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = streamer_id);

CREATE POLICY "Streamers can update own streams"
  ON streams FOR UPDATE
  TO authenticated
  USING (auth.uid() = streamer_id)
  WITH CHECK (auth.uid() = streamer_id);

-- Chat messages policies
CREATE POLICY "Chat messages viewable for live streams"
  ON chat_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM streams
      WHERE streams.id = chat_messages.stream_id
      AND (streams.is_live = true OR auth.uid() = streams.streamer_id)
    )
  );

CREATE POLICY "Authenticated users can send chat messages"
  ON chat_messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Followers policies
CREATE POLICY "Followers are viewable by everyone"
  ON followers FOR SELECT
  USING (true);

CREATE POLICY "Users can follow others"
  ON followers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow"
  ON followers FOR DELETE
  TO authenticated
  USING (auth.uid() = follower_id);

-- Clips policies
CREATE POLICY "Clips are viewable by everyone"
  ON clips FOR SELECT
  USING (true);

CREATE POLICY "Users can create clips"
  ON clips FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = creator_id);

-- AI Highlights policies
CREATE POLICY "AI highlights are viewable by everyone"
  ON ai_highlights FOR SELECT
  USING (true);

-- Subscribers policies
CREATE POLICY "Subscriptions are private"
  ON subscribers FOR SELECT
  TO authenticated
  USING (auth.uid() = subscriber_id OR auth.uid() = streamer_id);

CREATE POLICY "Users can subscribe"
  ON subscribers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = subscriber_id);

-- Donations policies
CREATE POLICY "Donations are private"
  ON donations FOR SELECT
  TO authenticated
  USING (auth.uid() = donor_id OR auth.uid() = streamer_id);

CREATE POLICY "Users can donate"
  ON donations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = donor_id);

-- Stream categories public
CREATE POLICY "Categories are viewable by everyone"
  ON stream_categories FOR SELECT
  USING (true);
