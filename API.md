# StreamFlow API Reference

## Authentication Services (`lib/auth.ts`)

### signUp
Register a new user.
```ts
authService.signUp(email, password, username, displayName)
// Returns: { user, session, error }
```

### signIn
Authenticate user.
```ts
authService.signIn(email, password)
// Returns: { user, session, error }
```

### signOut
Logout current user.
```ts
authService.signOut()
// Returns: { error }
```

### getCurrentUser
Get authenticated user.
```ts
authService.getCurrentUser()
// Returns: User | null
```

### onAuthStateChange
Listen to auth state changes.
```ts
authService.onAuthStateChange((user) => {
  console.log('User:', user)
})
```

### updateProfile
Update user profile.
```ts
authService.updateProfile(userId, {
  display_name?: string
  bio?: string
  avatar_url?: string
  banner_url?: string
  is_streamer?: boolean
})
// Returns: { data, error }
```

---

## Stream Services (`lib/streams.ts`)

### getLiveStreams
Fetch live streams.
```ts
streamService.getLiveStreams(limit = 50)
// Returns: { data: Stream[], error }
```

### getStreamById
Get single stream.
```ts
streamService.getStreamById(streamId)
// Returns: { data: Stream, error }
```

### getStreamsByCategory
Filter streams by category.
```ts
streamService.getStreamsByCategory(categoryId, limit = 20)
// Returns: { data: Stream[], error }
```

### getStreamerStreams
Get all streams from a creator.
```ts
streamService.getStreamerStreams(streamerId)
// Returns: { data: Stream[], error }
```

### createStream
Start a new stream.
```ts
streamService.createStream(streamerId, title, categoryId, tags)
// Returns: { data: Stream, error }
// Generates unique stream_key + rtmp_url
```

### updateStream
Modify stream.
```ts
streamService.updateStream(streamId, {
  title?: string
  description?: string
  is_live?: boolean
  viewer_count?: number
  peak_viewer_count?: number
})
// Returns: { data: Stream, error }
```

### endStream
Stop stream broadcasting.
```ts
streamService.endStream(streamId)
// Sets is_live=false, ended_at=now()
// Returns: { data: Stream, error }
```

### getCategories
Fetch all categories.
```ts
streamService.getCategories()
// Returns: { data: Category[], error }
```

### searchStreams
Search streams by query.
```ts
streamService.searchStreams(query)
// Returns: { data: Stream[], error }
```

---

## Chat Services (`lib/chat.ts`)

### sendMessage
Post chat message.
```ts
chatService.sendMessage(streamId, userId, message)
// Returns: { data: ChatMessage, error }
```

### getStreamChat
Fetch chat history.
```ts
chatService.getStreamChat(streamId, limit = 100)
// Returns: { data: ChatMessage[], error }
// Shows unflagged messages only
```

### getFlaggedMessages
Get moderation queue.
```ts
chatService.getFlaggedMessages(streamId)
// Returns: { data: ChatMessage[], error }
```

### moderateMessage
Flag message as inappropriate.
```ts
chatService.moderateMessage(messageId, reason)
// reason: "Toxic language detected", "Spam", etc.
// Returns: { data: ChatMessage, error }
```

### deleteMessage
Remove message.
```ts
chatService.deleteMessage(messageId)
// Returns: { error }
```

### getMessageCount
Count total messages in stream.
```ts
chatService.getMessageCount(streamId)
// Returns: { count, error }
```

---

## Follower Services (`lib/followers.ts`)

### follow
Follow a streamer.
```ts
followerService.follow(followerId, followingId)
// Increments following_id's follower_count
// Returns: { data, error }
```

### unfollow
Unfollow a streamer.
```ts
followerService.unfollow(followerId, followingId)
// Decrements following_id's follower_count
// Returns: { error }
```

### isFollowing
Check if user follows another.
```ts
followerService.isFollowing(followerId, followingId)
// Returns: { isFollowing: boolean, error }
```

### getFollowers
Get list of followers.
```ts
followerService.getFollowers(userId)
// Returns: { data: Profile[], error }
```

### getFollowing
Get list of users followed.
```ts
followerService.getFollowing(userId)
// Returns: { data: Profile[], error }
```

### getFollowerCount
Count followers.
```ts
followerService.getFollowerCount(userId)
// Returns: { count: number, error }
```

### getFollowingCount
Count users following.
```ts
followerService.getFollowingCount(userId)
// Returns: { count: number, error }
```

---

## Clip Services (`lib/clips.ts`)

### createClip
Create clip from stream.
```ts
clipService.createClip(streamId, creatorId, title, startTs, endTs)
// startTs, endTs in seconds
// Returns: { data: Clip, error }
```

### getStreamClips
Get clips from stream.
```ts
clipService.getStreamClips(streamId, limit = 20)
// Returns: { data: Clip[], error }
```

### getStreamerClips
Get all clips from creator.
```ts
clipService.getStreamerClips(streamerId, limit = 30)
// Returns: { data: Clip[], error }
```

### incrementClipViews
Add view to clip.
```ts
clipService.incrementClipViews(clipId)
// Returns: { data, error }
```

### deleteClip
Remove clip.
```ts
clipService.deleteClip(clipId, userId)
// Only creator can delete
// Returns: { error }
```

---

## Subscription Services (`lib/subscriptions.ts`)

### subscribe
Subscribe to streamer.
```ts
subscriptionService.subscribe(subscriberId, streamerId, tier = 1)
// tier: 1|2|3 subscription level
// Returns: { data, error }
```

### unsubscribe
Cancel subscription.
```ts
subscriptionService.unsubscribe(subscriberId, streamerId)
// Returns: { error }
```

### isSubscribed
Check subscription status.
```ts
subscriptionService.isSubscribed(subscriberId, streamerId)
// Returns: { isSubscribed: boolean, tier, error }
```

### getStreamerSubscribers
Count subscribers.
```ts
subscriptionService.getStreamerSubscribers(streamerId)
// Returns: { count: number, error }
```

### donate
Send donation.
```ts
subscriptionService.donate(donorId, streamerId, amount, message?, streamId?)
// amount in USD
// Returns: { data: Donation, error }
```

### getStreamDonations
Get donations for stream.
```ts
subscriptionService.getStreamDonations(streamId)
// Returns: { data: Donation[], error }
```

### getStreamerTotalDonations
Sum donations to streamer.
```ts
subscriptionService.getStreamerTotalDonations(streamerId)
// Returns: { total: number, error }
```

---

## Search Services (`lib/search.ts`)

### searchStreams
Find streams.
```ts
searchService.searchStreams(query)
// Returns: { data: Stream[], error }
```

### searchStreamers
Find creators.
```ts
searchService.searchStreamers(query)
// Returns: { data: Profile[], error }
```

### searchCategories
Find categories.
```ts
searchService.searchCategories(query)
// Returns: { data: Category[], error }
```

### globalSearch
Search all content types.
```ts
searchService.globalSearch(query)
// Returns: { streams, streamers, categories, error }
```

### getTrendingStreams
Get top streams.
```ts
searchService.getTrendingStreams(limit = 20)
// Returns: { data: Stream[], error }
```

### getRecommendedStreams
Get personalized recommendations.
```ts
searchService.getRecommendedStreams(userId, limit = 20)
// Returns: { data: Stream[], error }
// Based on user's follows
```

---

## Moderation & AI Services (`lib/moderation.ts`)

### checkMessage
AI check message for toxicity/spam.
```ts
moderationService.checkMessage(message)
// Edge Function: ai-moderation
// Returns: { data: { message, isFlagged, reason, confidence }, error }
```

### generateHighlights
Auto-clip best moments.
```ts
moderationService.generateHighlights(streamDuration)
// Edge Function: generate-highlights
// streamDuration in seconds
// Returns: { data: { highlights: Highlight[], totalHighlights }, error }
```

### getStreamAnalytics
Get stream statistics.
```ts
moderationService.getStreamAnalytics(streamId)
// Edge Function: stream-analytics
// Returns: { data: { current, previous, changes }, error }
```

### askAI
Query AI about stream.
```ts
moderationService.askAI(question, streamId)
// Edge Function: ai-chat
// Returns: { data: { response, confidence, type }, error }
```

---

## Edge Functions

### `ai-moderation`
POST `/functions/v1/ai-moderation`
```json
{
  "message": "string"
}
```
Response:
```json
{
  "message": "string",
  "isFlagged": boolean,
  "reason": "string?",
  "confidence": number
}
```

### `generate-highlights`
POST `/functions/v1/generate-highlights`
```json
{
  "streamDuration": number
}
```
Response:
```json
{
  "highlights": [
    {
      "start": number,
      "end": number,
      "type": "clutch|rage|hype|funny|skill",
      "confidence": number,
      "title": "string"
    }
  ],
  "totalHighlights": number,
  "generatedAt": "ISO string"
}
```

### `ai-chat`
POST `/functions/v1/ai-chat`
```json
{
  "question": "string",
  "streamId": "string"
}
```
Response:
```json
{
  "response": "string",
  "confidence": number,
  "type": "summary|qa|insight",
  "streamId": "string",
  "timestamp": "ISO string"
}
```

### `stream-analytics`
POST `/functions/v1/stream-analytics`
```json
{
  "streamId": "string",
  "period": "current|last_7|last_30"
}
```
Response:
```json
{
  "streamId": "string",
  "period": "string",
  "current": {
    "peakViewers": number,
    "avgViewers": number,
    "totalWatchTime": number,
    "newFollowers": number,
    "subs": number,
    "revenue": number,
    "trend": "up|down|stable"
  },
  "previous": { ... },
  "changes": {
    "peakViewersChange": number,
    "avgViewersChange": number,
    "followersChange": number,
    "subsChange": number,
    "revenueChange": number
  },
  "generatedAt": "ISO string"
}
```

---

## Error Handling

All services return errors in consistent format:
```ts
{
  data: T | null,
  error: PostgrestError | null
}
```

Always check error before using data:
```ts
const { data, error } = await streamService.getLiveStreams()
if (error) {
  console.error('Failed to fetch streams:', error.message)
  return
}
// Use data safely
```
