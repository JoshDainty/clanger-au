/**
 * Message system types and Supabase Realtime subscription structure.
 *
 * Supabase table schema (to be created via migration):
 *
 * CREATE TABLE conversations (
 *   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 *   type TEXT NOT NULL CHECK (type IN ('league', 'direct')),
 *   league_id UUID REFERENCES leagues(id),
 *   created_at TIMESTAMPTZ DEFAULT now()
 * );
 *
 * CREATE TABLE conversation_members (
 *   conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
 *   user_id UUID REFERENCES auth.users(id),
 *   last_read_at TIMESTAMPTZ DEFAULT now(),
 *   muted BOOLEAN DEFAULT false,
 *   PRIMARY KEY (conversation_id, user_id)
 * );
 *
 * CREATE TABLE messages (
 *   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 *   conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
 *   sender_id UUID REFERENCES auth.users(id),
 *   content TEXT NOT NULL,
 *   type TEXT DEFAULT 'text' CHECK (type IN ('text', 'system', 'image')),
 *   reported BOOLEAN DEFAULT false,
 *   created_at TIMESTAMPTZ DEFAULT now()
 * );
 *
 * -- Enable Realtime
 * ALTER PUBLICATION supabase_realtime ADD TABLE messages;
 *
 * -- RLS policies would restrict access to conversation members only.
 */

import { useEffect, useRef, useCallback, useState } from 'react'
import { supabase } from '@/lib/supabase'

/* ─── Types ─── */
export interface Message {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  senderInitials: string
  senderColor: string
  content: string
  type: 'text' | 'system' | 'image'
  createdAt: string // ISO
  isOwn: boolean
}

export interface Conversation {
  id: string
  type: 'league' | 'direct'
  name: string
  avatarInitials: string
  avatarColor: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  memberCount?: number
  isOnline?: boolean // for DMs
}

/* ─── Supabase Realtime Hook (ready for real data) ─── */
export function useRealtimeMessages(conversationId: string | null) {
  const [messages, setMessages] = useState<Message[]>([])
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)

  useEffect(() => {
    if (!conversationId) return

    // In production, this would fetch initial messages:
    // const { data } = await supabase
    //   .from('messages')
    //   .select('*')
    //   .eq('conversation_id', conversationId)
    //   .order('created_at', { ascending: true })
    //   .limit(50)

    // Subscribe to new messages via Realtime
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const msg = payload.new as Record<string, unknown>
          setMessages(prev => [...prev, {
            id: msg.id as string,
            conversationId: msg.conversation_id as string,
            senderId: msg.sender_id as string,
            senderName: 'User', // would join with profiles
            senderInitials: 'U',
            senderColor: '#3B82F6',
            content: msg.content as string,
            type: (msg.type as Message['type']) || 'text',
            createdAt: msg.created_at as string,
            isOwn: false, // would compare with auth.user.id
          }])
        }
      )
      .subscribe()

    channelRef.current = channel

    return () => {
      supabase.removeChannel(channel)
    }
  }, [conversationId])

  const sendMessage = useCallback(async (content: string) => {
    if (!conversationId || !content.trim()) return

    // In production:
    // await supabase.from('messages').insert({
    //   conversation_id: conversationId,
    //   sender_id: (await supabase.auth.getUser()).data.user?.id,
    //   content: content.trim(),
    // })

    // For now, add locally:
    const newMsg: Message = {
      id: crypto.randomUUID(),
      conversationId,
      senderId: 'me',
      senderName: 'You',
      senderInitials: 'JD',
      senderColor: '#3B82F6',
      content: content.trim(),
      type: 'text',
      createdAt: new Date().toISOString(),
      isOwn: true,
    }
    setMessages(prev => [...prev, newMsg])
  }, [conversationId])

  return { messages, setMessages, sendMessage }
}

/* ─── Mock Data ─── */
export const MOCK_CONVERSATIONS: Conversation[] = [
  { id: 'league-1', type: 'league', name: 'Mates League 2026', avatarInitials: 'ML', avatarColor: '#3B82F6', lastMessage: 'SlamDunkSid: Luka going off tonight! 🔥', lastMessageTime: '2m ago', unreadCount: 3, memberCount: 8 },
  { id: 'league-2', type: 'league', name: 'Work Legends', avatarInitials: 'WL', avatarColor: '#10B981', lastMessage: 'CourtVision: Trade deadline moves?', lastMessageTime: '15m ago', unreadCount: 0, memberCount: 12 },
  { id: 'dm-1', type: 'direct', name: 'MattKellyFF', avatarInitials: 'MK', avatarColor: '#EF4444', lastMessage: 'GG mate, close one tonight', lastMessageTime: '1h ago', unreadCount: 1, isOnline: true },
  { id: 'dm-2', type: 'direct', name: 'SlamDunkSid', avatarInitials: 'SS', avatarColor: '#10B981', lastMessage: 'You: Want to trade Tatum?', lastMessageTime: '3h ago', unreadCount: 0, isOnline: false },
  { id: 'league-3', type: 'league', name: 'Best Ball Bros', avatarInitials: 'BB', avatarColor: '#8B5CF6', lastMessage: 'System: Week 10 matchups are set', lastMessageTime: '1d ago', unreadCount: 0, memberCount: 6 },
  { id: 'dm-3', type: 'direct', name: 'HoopsDreamer', avatarInitials: 'HD', avatarColor: '#F59E0B', lastMessage: 'HoopsDreamer: Nice draft pick 👍', lastMessageTime: '2d ago', unreadCount: 0, isOnline: false },
]

export function getMockMessages(conversationId: string): Message[] {
  if (conversationId === 'league-1') {
    return [
      { id: '1', conversationId, senderId: 'system', senderName: 'System', senderInitials: '⚙️', senderColor: '#6B7280', content: 'Week 10 matchups are live. Good luck everyone!', type: 'system', createdAt: '2026-03-31T10:00:00Z', isOwn: false },
      { id: '2', conversationId, senderId: 'user-2', senderName: 'SlamDunkSid', senderInitials: 'SS', senderColor: '#10B981', content: 'Anyone watching the DAL game tonight? Luka\'s been on a tear.', type: 'text', createdAt: '2026-03-31T18:30:00Z', isOwn: false },
      { id: '3', conversationId, senderId: 'me', senderName: 'JoshDainty', senderInitials: 'JD', senderColor: '#3B82F6', content: 'Yeah I\'ve got him in my lineup. Feeling confident 💪', type: 'text', createdAt: '2026-03-31T18:32:00Z', isOwn: true },
      { id: '4', conversationId, senderId: 'user-4', senderName: 'MattKellyFF', senderInitials: 'MK', senderColor: '#EF4444', content: 'I\'m starting SGA instead. His usage rate is insane this month.', type: 'text', createdAt: '2026-03-31T18:35:00Z', isOwn: false },
      { id: '5', conversationId, senderId: 'user-5', senderName: 'CourtVision', senderInitials: 'CV', senderColor: '#8B5CF6', content: 'Jokic is the safe pick though. Triple double machine 🃏', type: 'text', createdAt: '2026-03-31T18:38:00Z', isOwn: false },
      { id: '6', conversationId, senderId: 'user-2', senderName: 'SlamDunkSid', senderInitials: 'SS', senderColor: '#10B981', content: 'Luka going off tonight! 🔥 28 pts in the first half', type: 'text', createdAt: '2026-03-31T19:45:00Z', isOwn: false },
      { id: '7', conversationId, senderId: 'user-6', senderName: 'BallerBrisbane', senderInitials: 'BB', senderColor: '#EC4899', content: 'My whole team is on the bench tonight. Pain.', type: 'text', createdAt: '2026-03-31T19:50:00Z', isOwn: false },
      { id: '8', conversationId, senderId: 'me', senderName: 'JoshDainty', senderInitials: 'JD', senderColor: '#3B82F6', content: 'Ant Edwards with 24 already too. Great night for my squad.', type: 'text', createdAt: '2026-03-31T19:55:00Z', isOwn: true },
    ]
  }
  if (conversationId === 'dm-1') {
    return [
      { id: '1', conversationId, senderId: 'user-4', senderName: 'MattKellyFF', senderInitials: 'MK', senderColor: '#EF4444', content: 'Hey, good matchup this week!', type: 'text', createdAt: '2026-03-31T16:00:00Z', isOwn: false },
      { id: '2', conversationId, senderId: 'me', senderName: 'JoshDainty', senderInitials: 'JD', senderColor: '#3B82F6', content: 'Cheers! Should be a close one. Your SGA is scary.', type: 'text', createdAt: '2026-03-31T16:05:00Z', isOwn: true },
      { id: '3', conversationId, senderId: 'user-4', senderName: 'MattKellyFF', senderInitials: 'MK', senderColor: '#EF4444', content: 'Haha yeah but your Luka/Ant combo is nuts', type: 'text', createdAt: '2026-03-31T16:08:00Z', isOwn: false },
      { id: '4', conversationId, senderId: 'user-4', senderName: 'MattKellyFF', senderInitials: 'MK', senderColor: '#EF4444', content: 'GG mate, close one tonight', type: 'text', createdAt: '2026-03-31T21:30:00Z', isOwn: false },
    ]
  }
  return []
}
