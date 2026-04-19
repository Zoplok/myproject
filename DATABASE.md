# StreamFlow Database Architecture

## Overview
StreamFlow uses Supabase PostgreSQL with comprehensive RLS policies for secure, multi-tenant streaming operations.

## Core Tables

### `profiles`
User and streamer information.
```sql
- id (uuid, PK) - References auth.users
- username (text, UNIQUE) - Display handle
- display_name (text) - Full name
- bio (text) - Profile bio
- avatar_url (text) - Profile picture
- banner_url (text) - Banner image
- follower_count (int) - Cached follower count
- total_views (int) - Lifetime views
- is_verified (bool) - Verified badge
- is_streamer (bool) - Creator account
- created_at, updated_at (timestamptz)
```

### `streams`
Live stream records and metadata.
```sql
- id (uuid, PK)
- streamer_id (uuid, FK) - Profile reference
- title (text) - Stream title
- description (text) - About the stream
- thumbnail_url (text) - Stream thumbnail
- category_id (uuid, FK) - Category reference
- is_live (bool) - Current status
- started_at, ended_at (timestamptz) - Stream duration
- viewer_count (int) - Current viewers
- peak_viewer_count (int) - Max viewers
- stream_key (text, UNIQUE) - RTMP key
- rtmp_url (text) - Ingest endpoint
- created_at, updated_at (timestamptz)
```

### `stream_categories`
Stream content categories.
```sql
- id (uuid, PK)
- name (text, UNIQUE) - Category name
- slug (text, UNIQUE) - URL-friendly slug
- description (text)
- thumbnail_url (text)
- created_at (timestamptz)
```

### `stream_tags`
Searchable tags per stream.
```sql
- id (uuid, PK)
- stream_id (uuid, FK) - Stream reference
- tag (text) - Tag value
- created_at (timestamptz)
```

### `chat_messages`
Live chat and message history.
```sql
- id (uuid, PK)
- stream_id (uuid, FK) - Stream reference
- user_id (uuid, FK) - Sender profile
- message (text) - Message content
- is_moderated (bool) - AI flagged
- moderation_reason (text) - Why flagged
- created_at (timestamptz)
```

### `followers`
Follow relationships between users.
```sql
- follower_id (uuid, FK) - Follower profile
- following_id (uuid, FK) - Followed profile
- created_at (timestamptz)
- PK: (follower_id, following_id)
```

### `clips`
User-created clips from streams.
```sql
- id (uuid, PK)
- stream_id (uuid, FK) - Source stream
- creator_id (uuid, FK) - Clip creator
- title (text) - Clip title
- description (text)
- thumbnail_url (text)
- video_url (text) - Clip URL
- start_timestamp, end_timestamp (int) - Clip bounds
- view_count (int) - Clip views
- created_at (timestamptz)
```

### `ai_highlights`
AI-generated stream highlights.
```sql
- id (uuid, PK)
- stream_id (uuid, FK) - Source stream
- title (text) - Highlight name
- description (text)
- thumbnail_url (text)
- start_timestamp, end_timestamp (int) - Time bounds
- clip_type (text) - clutch|rage|hype|funny|skill
- confidence_score (float) - 0-1 AI confidence
- created_at (timestamptz)
```

### `subscribers`
Subscription relationships.
```sql
- subscriber_id (uuid, FK) - Subscriber profile
- streamer_id (uuid, FK) - Streamer profile
- tier (int) - 1|2|3 subscription level
- started_at, renewed_at (timestamptz)
- PK: (subscriber_id, streamer_id)
```

### `donations`
Viewer donations to streamers.
```sql
- id (uuid, PK)
- donor_id (uuid, FK) - Donor profile
- streamer_id (uuid, FK) - Recipient profile
- stream_id (uuid, FK) - Associated stream (nullable)
- amount (decimal) - Donation amount
- message (text) - Optional donation message
- created_at (timestamptz)
```

## Row Level Security (RLS) Policies

### Public Access
- Profiles: Everyone can read
- Streams: Everyone can read live streams (private ones only for creator)
- Categories: Everyone can read
- Clips: Everyone can read
- AI Highlights: Everyone can read

### Authenticated Only
- Chat Messages: Send if authenticated, view if stream is live
- Followers: Create/delete own follows, view all
- Subscribers: Private to subscriber/streamer only
- Donations: Private to donor/recipient only

### Ownership Rules
- Profiles: Users modify only their own
- Streams: Creators manage only their own
- Clips: Creators manage only their own
- Subscribers: Only streamer can set tier

## Indexes

```sql
- streams(streamer_id) - Streamer's streams
- streams(is_live) WHERE is_live - Active streams only
- streams(category_id) - Category browsing
- chat_messages(stream_id) - Stream chat lookup
- chat_messages(created_at DESC) - Chat chronology
- followers(following_id) - Follower lists
- clips(stream_id) - Stream's clips
- ai_highlights(stream_id) - Stream's highlights
```

## Data Flow Patterns

### Stream Creation
1. Creator signs in → `profiles` exists
2. Click "Go Live" → New `streams` record
3. RTMP client connects → Update `is_live` + `viewer_count`
4. Stream ends → Set `ended_at`, `is_live = false`

### Chat System
1. User types message
2. AI moderation via Edge Function checks toxicity
3. If flagged: `is_moderated = true`, `moderation_reason` set
4. Message visible (blurred if flagged) → `chat_messages` insert

### Recommendations
1. Load user's `followers` → get `following_id` list
2. Query live `streams` where `streamer_id IN (following_ids)`
3. Order by `viewer_count` DESC
4. Show in "For You" section

### Analytics
1. Peak viewers tracked in `peak_viewer_count`
2. Total views from `profiles.total_views`
3. Subscriber count from `subscribers` table
4. Revenue from `donations.amount` sum

## Security Best Practices

1. **Never trust client**: All operations verified server-side via RLS
2. **Stream keys**: Unique per stream, rotate on demand
3. **Chat moderation**: AI flagging automatic, mods review before delete
4. **Private data**: Subscriptions/donations hidden from public
5. **Cascade deletes**: Profile deletion cascades to streams, chat, etc.

## Migration Files

- `001_create_core_tables.sql` - Initial schema with RLS policies

## Common Queries

### Get live streams
```ts
await streamService.getLiveStreams(limit)
```

### Get stream chat
```ts
await chatService.getStreamChat(streamId)
```

### Follow a streamer
```ts
await followerService.follow(userId, streamerId)
```

### Check if user subscribes
```ts
await subscriptionService.isSubscribed(userId, streamerId)
```

### Search all content
```ts
await searchService.globalSearch(query)
```
