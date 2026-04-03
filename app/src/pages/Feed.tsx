import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Heart, MessageCircle, Share2, Bookmark, MoreHorizontal,
  Trophy, TrendingUp, Flame, Zap, Target, Star,
  ThumbsUp, Send, Image, ChevronRight, Users, Crown,
} from 'lucide-react'
import { useToast } from '@/components/Toast'

/* ─── Types ─── */
type PostType = 'result' | 'highlight' | 'discussion' | 'brag' | 'news' | 'tip'

interface FeedPost {
  id: string
  author: { name: string; initials: string; color: string; badge?: string }
  type: PostType
  content: string
  stat?: { label: string; value: string; subtext?: string }
  image?: boolean
  timestamp: string
  likes: number
  comments: number
  shares: number
  liked: boolean
  bookmarked: boolean
}

interface TrendingTopic {
  tag: string
  posts: number
  trending: boolean
}

interface LeaderboardEntry {
  rank: number
  name: string
  initials: string
  color: string
  winnings: string
  wins: number
}

/* ─── Mock Data ─── */
const TABS = ['For You', 'Following', 'Trending', 'News'] as const

const posts: FeedPost[] = [
  {
    id: '1',
    author: { name: 'SlamDunkSid', initials: 'SS', color: '#10B981', badge: 'Top 1%' },
    type: 'brag',
    content: 'Just hit 312 fantasy points in a single night. Luka went absolutely nuclear — 58.4 FPTS by himself. New personal best 🔥🔥🔥',
    stat: { label: 'Fantasy Points', value: '312.4', subtext: 'Personal best · Salary Cap' },
    timestamp: '12m ago',
    likes: 47,
    comments: 12,
    shares: 5,
    liked: false,
    bookmarked: false,
  },
  {
    id: '2',
    author: { name: 'Clanger.au', initials: 'C', color: '#3B82F6', badge: 'Official' },
    type: 'news',
    content: '🏀 NEW: $25,000 Guaranteed NBA Playoff Salary Cap Contest is LIVE. Biggest prize pool of the season. Entry just $10. Draft locks at tip-off.',
    timestamp: '34m ago',
    likes: 128,
    comments: 31,
    shares: 44,
    liked: true,
    bookmarked: true,
  },
  {
    id: '3',
    author: { name: 'HoopsDreamer', initials: 'HD', color: '#F59E0B' },
    type: 'discussion',
    content: 'Hot take: Victor Wembanyama is the best fantasy center in the league right now. His block rate is insane and he\'s averaging 24.8/10.5. Am I wrong?',
    timestamp: '1h ago',
    likes: 83,
    comments: 56,
    shares: 8,
    liked: false,
    bookmarked: false,
  },
  {
    id: '4',
    author: { name: 'BallerBrisbane', initials: 'BB', color: '#EC4899' },
    type: 'result',
    content: 'First place finish in the Tuesday Salary Showdown! The Ant Edwards + Trae Young combo carried hard. $125 in the bank 💰',
    stat: { label: 'Contest Result', value: '#1', subtext: '$125 won · 412 entries' },
    timestamp: '2h ago',
    likes: 34,
    comments: 8,
    shares: 2,
    liked: true,
    bookmarked: false,
  },
  {
    id: '5',
    author: { name: 'CourtVision', initials: 'CV', color: '#8B5CF6', badge: 'Analyst' },
    type: 'tip',
    content: 'Sleeper alert 🚨 De\'Aaron Fox is averaging 28.3 FPTS over his last 5 games but his salary hasn\'t moved. He\'s $7.8K in Salary Cap tonight against a bottom-5 defense. Lock him in.',
    timestamp: '3h ago',
    likes: 156,
    comments: 42,
    shares: 67,
    liked: false,
    bookmarked: true,
  },
  {
    id: '6',
    author: { name: 'DraftKingAU', initials: 'DK', color: '#F97316' },
    type: 'highlight',
    content: 'Anthony Edwards just dropped 42 points in real life. If you had him in your lineup tonight, you\'re eating GOOD. 52.8 fantasy points and counting.',
    image: true,
    timestamp: '3h ago',
    likes: 211,
    comments: 38,
    shares: 19,
    liked: false,
    bookmarked: false,
  },
  {
    id: '7',
    author: { name: 'MattKellyFF', initials: 'MK', color: '#EF4444' },
    type: 'discussion',
    content: 'Best Ball or Salary Cap for a beginner? I\'ve been playing Draft leagues but want to try something new this week.',
    timestamp: '4h ago',
    likes: 22,
    comments: 31,
    shares: 1,
    liked: false,
    bookmarked: false,
  },
  {
    id: '8',
    author: { name: 'Clanger.au', initials: 'C', color: '#3B82F6', badge: 'Official' },
    type: 'news',
    content: '📊 Weekly Power Rankings are out! Check who climbed and who dropped after a wild Week 10. Some major shakeups in the Top 20.',
    timestamp: '5h ago',
    likes: 89,
    comments: 24,
    shares: 15,
    liked: false,
    bookmarked: false,
  },
]

const trendingTopics: TrendingTopic[] = [
  { tag: 'NBAPlayoffs', posts: 1243, trending: true },
  { tag: 'LukaMagic', posts: 892, trending: true },
  { tag: 'SleeperPicks', posts: 456, trending: false },
  { tag: 'SalaryCapTips', posts: 334, trending: false },
  { tag: 'WembyWatch', posts: 278, trending: true },
]

const weeklyLeaders: LeaderboardEntry[] = [
  { rank: 1, name: 'SlamDunkSid', initials: 'SS', color: '#10B981', winnings: '$1,240', wins: 8 },
  { rank: 2, name: 'JoshDainty', initials: 'JD', color: '#3B82F6', winnings: '$842', wins: 6 },
  { rank: 3, name: 'CourtVision', initials: 'CV', color: '#8B5CF6', winnings: '$756', wins: 5 },
  { rank: 4, name: 'BallerBrisbane', initials: 'BB', color: '#EC4899', winnings: '$620', wins: 5 },
  { rank: 5, name: 'DraftKingAU', initials: 'DK', color: '#F97316', winnings: '$510', wins: 4 },
]

const TYPE_CONFIG: Record<PostType, { icon: typeof Trophy; label: string; color: string }> = {
  result: { icon: Trophy, label: 'Result', color: 'text-success' },
  highlight: { icon: Flame, label: 'Highlight', color: 'text-warning' },
  discussion: { icon: MessageCircle, label: 'Discussion', color: 'text-accent-light' },
  brag: { icon: Star, label: 'Brag', color: 'text-warning' },
  news: { icon: Zap, label: 'Official', color: 'text-accent-light' },
  tip: { icon: Target, label: 'Tip', color: 'text-success' },
}

/* ─── Components ─── */

function PostCard({ post }: { post: FeedPost }) {
  const [liked, setLiked] = useState(post.liked)
  const [likeCount, setLikeCount] = useState(post.likes)
  const [saved, setSaved] = useState(post.bookmarked)
  const typeConfig = TYPE_CONFIG[post.type]
  const TypeIcon = typeConfig.icon

  const toggleLike = () => {
    setLiked(!liked)
    setLikeCount(prev => liked ? prev - 1 : prev + 1)
  }

  return (
    <div className="bg-bg-card border border-border rounded-2xl overflow-hidden hover:border-border-light transition-colors">
      {/* Author header */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 border-2"
          style={{ backgroundColor: post.author.color + '20', borderColor: post.author.color + '40', color: post.author.color }}
        >
          {post.author.initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-text-primary">{post.author.name}</span>
            {post.author.badge && (
              <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full" style={{ backgroundColor: post.author.color + '15', color: post.author.color }}>
                {post.author.badge}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <TypeIcon className={`w-3 h-3 ${typeConfig.color}`} />
            <span className={`text-[10px] font-medium ${typeConfig.color}`}>{typeConfig.label}</span>
            <span className="text-[10px] text-text-tertiary">· {post.timestamp}</span>
          </div>
        </div>
        <button className="text-text-tertiary hover:text-text-secondary p-1">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="px-5 pb-3">
        <p className="text-sm text-text-primary leading-relaxed">{post.content}</p>
      </div>

      {/* Stat card (if present) */}
      {post.stat && (
        <div className="mx-5 mb-3 p-4 rounded-xl border border-border" style={{ background: 'rgba(236,72,153,0.04)' }}>
          <div className="text-[10px] text-text-tertiary uppercase tracking-wider font-medium mb-1">{post.stat.label}</div>
          <div className="text-2xl font-black text-accent-light">{post.stat.value}</div>
          {post.stat.subtext && <div className="text-xs text-text-tertiary mt-1">{post.stat.subtext}</div>}
        </div>
      )}

      {/* Image placeholder */}
      {post.image && (
        <div className="mx-5 mb-3 h-48 rounded-xl flex items-center justify-center border border-border" style={{ background: 'linear-gradient(135deg, rgba(236,72,153,0.08), rgba(139,92,246,0.08))' }}>
          <div className="text-center">
            <Flame className="w-8 h-8 text-warning mx-auto mb-2" />
            <span className="text-xs text-text-tertiary">Highlight Clip</span>
          </div>
        </div>
      )}

      {/* Engagement bar */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-border">
        <div className="flex items-center gap-1">
          <button
            onClick={toggleLike}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              liked ? 'text-danger' : 'text-text-tertiary hover:text-text-secondary hover:bg-white/5'
            }`}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
            {likeCount}
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-text-tertiary hover:text-text-secondary hover:bg-white/5 transition-colors">
            <MessageCircle className="w-4 h-4" />
            {post.comments}
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-text-tertiary hover:text-text-secondary hover:bg-white/5 transition-colors">
            <Share2 className="w-4 h-4" />
            {post.shares}
          </button>
        </div>
        <button
          onClick={() => setSaved(!saved)}
          className={`p-1.5 rounded-lg transition-colors ${saved ? 'text-accent-light' : 'text-text-tertiary hover:text-text-secondary'}`}
        >
          <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
        </button>
      </div>
    </div>
  )
}

/* ─── Main Page ─── */
export default function Feed() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>('For You')
  const [composerText, setComposerText] = useState('')
  const [activeHashtag, setActiveHashtag] = useState<string | null>(null)

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-6">

        {/* ─── Main Feed Column ─── */}
        <div className="flex-1 min-w-0 space-y-5">

          <h1 className="text-3xl font-black text-text-primary tracking-tight">Feed</h1>

          {/* Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab
                    ? 'bg-accent text-white shadow-lg'
                    : 'text-text-tertiary hover:text-text-secondary hover:bg-white/5'
                }`}
                style={activeTab === tab ? { boxShadow: '0 0 16px rgba(236,72,153,0.2)' } : {}}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Composer */}
          <div className="bg-bg-card border border-border rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 border-2" style={{ backgroundColor: '#3B82F625', borderColor: '#3B82F650', color: '#3B82F6' }}>
                JD
              </div>
              <div className="flex-1">
                <textarea
                  value={composerText}
                  onChange={e => setComposerText(e.target.value)}
                  rows={2}
                  className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-tertiary resize-none outline-none leading-relaxed"
                  placeholder="Share a brag, ask a question, or drop a hot take..."
                />
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toast('info', 'Photo upload coming soon!')}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-text-tertiary hover:text-text-secondary hover:bg-white/5 transition-colors"
                    >
                      <Image className="w-4 h-4" /> Photo
                    </button>
                    <button
                      onClick={() => toast('info', 'Attach a contest result to your post — coming soon!')}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-text-tertiary hover:text-text-secondary hover:bg-white/5 transition-colors"
                    >
                      <Trophy className="w-4 h-4" /> Result
                    </button>
                    <button
                      onClick={() => toast('info', 'Share a player stat card — coming soon!')}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-text-tertiary hover:text-text-secondary hover:bg-white/5 transition-colors"
                    >
                      <TrendingUp className="w-4 h-4" /> Stats
                    </button>
                  </div>
                  <button
                    disabled={!composerText.trim()}
                    onClick={() => { toast('success', 'Post shared!'); setComposerText('') }}
                    className="flex items-center gap-1.5 h-8 px-4 bg-accent hover:bg-accent-dark disabled:opacity-30 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" /> Post
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Active hashtag filter */}
          {activeHashtag && (
            <div className="flex items-center gap-2 px-4 py-2.5 bg-accent/10 border border-accent/20 rounded-xl">
              <TrendingUp className="w-4 h-4 text-accent-light" />
              <span className="text-sm font-medium text-accent-light flex-1">#{activeHashtag}</span>
              <button
                onClick={() => setActiveHashtag(null)}
                className="text-xs text-text-tertiary hover:text-text-secondary"
              >
                Clear filter
              </button>
            </div>
          )}

          {/* Posts */}
          <div className="space-y-4">
            {posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>

        {/* ─── Right Sidebar (desktop) ─── */}
        <div className="hidden lg:block w-72 flex-shrink-0 space-y-5">

          {/* Trending */}
          <div className="bg-bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <Flame className="w-4 h-4 text-warning" /> Trending
              </h3>
            </div>
            <div className="divide-y divide-border">
              {trendingTopics.map(topic => (
                <button
                  key={topic.tag}
                  onClick={() => { setActiveHashtag(activeHashtag === topic.tag ? null : topic.tag); setActiveTab('Trending') }}
                  className={`w-full flex items-center justify-between px-4 py-3 hover:bg-white/[0.02] transition-colors text-left ${activeHashtag === topic.tag ? 'bg-accent/5' : ''}`}
                >
                  <div>
                    <div className={`text-sm font-semibold ${activeHashtag === topic.tag ? 'text-accent-light' : 'text-text-primary'}`}>#{topic.tag}</div>
                    <div className="text-[11px] text-text-tertiary">{topic.posts} posts</div>
                  </div>
                  {topic.trending && (
                    <TrendingUp className="w-3.5 h-3.5 text-success flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Weekly Leaderboard */}
          <div className="bg-bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <Crown className="w-4 h-4 text-warning" /> Weekly Leaders
              </h3>
              <Link to="/players" className="text-[10px] text-accent hover:text-accent-light font-medium flex items-center gap-0.5">
                All <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="divide-y divide-border">
              {weeklyLeaders.map(entry => (
                <div key={entry.rank} className="flex items-center gap-3 px-4 py-2.5">
                  <span className={`text-xs font-bold w-5 text-center ${entry.rank <= 3 ? 'text-warning' : 'text-text-tertiary'}`}>
                    {entry.rank <= 3 ? ['🥇', '🥈', '🥉'][entry.rank - 1] : entry.rank}
                  </span>
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0 border"
                    style={{ backgroundColor: entry.color + '20', borderColor: entry.color + '35', color: entry.color }}
                  >
                    {entry.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-text-primary truncate">{entry.name}</div>
                    <div className="text-[10px] text-text-tertiary">{entry.wins} wins</div>
                  </div>
                  <span className="text-xs font-bold text-success">{entry.winnings}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Active Leagues */}
          <div className="bg-bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <Users className="w-4 h-4 text-accent-light" /> Your Leagues
              </h3>
              <Link to="/leagues" className="text-[10px] text-accent hover:text-accent-light font-medium flex items-center gap-0.5">
                All <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            {[
              { name: 'Mates League 2026', members: 8, rank: 1, color: '#3B82F6' },
              { name: 'Work Legends', members: 12, rank: 4, color: '#10B981' },
              { name: 'Best Ball Bros', members: 6, rank: 2, color: '#8B5CF6' },
            ].map(league => (
              <Link key={league.name} to="/leagues/1" className="flex items-center gap-3 px-4 py-2.5 border-b border-border last:border-0 hover:bg-white/[0.02] transition-colors">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[9px] font-bold border" style={{ backgroundColor: league.color + '15', borderColor: league.color + '25', color: league.color }}>
                  {league.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-text-primary truncate">{league.name}</div>
                  <div className="text-[10px] text-text-tertiary">{league.members} members</div>
                </div>
                <span className="text-[10px] font-bold text-text-tertiary">#{league.rank}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
