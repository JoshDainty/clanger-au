import { useState } from 'react'
import { Search, Users, MessageSquare, ArrowLeft, Pencil, X, UserPlus } from 'lucide-react'
import { MOCK_CONVERSATIONS, getMockMessages, useRealtimeMessages, type Conversation } from '@/lib/messages'
import ChatPanel from '@/components/ChatPanel'

const SUGGESTED_USERS = [
  { name: 'SlamDunkSid', initials: 'SS', color: '#10B981' },
  { name: 'BallerBrisbane', initials: 'BB', color: '#EC4899' },
  { name: 'CourtVision', initials: 'CV', color: '#8B5CF6' },
  { name: 'HoopsDreamer', initials: 'HD', color: '#F59E0B' },
  { name: 'DraftKingAU', initials: 'DK', color: '#F97316' },
  { name: 'MattKellyFF', initials: 'MK', color: '#EF4444' },
]

function NewMessageModal({ onClose, onStart }: { onClose: () => void; onStart: (name: string, isGroup: boolean) => void }) {
  const [tab, setTab] = useState<'direct' | 'group'>('direct')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<typeof SUGGESTED_USERS>([])

  const filtered = SUGGESTED_USERS.filter(u =>
    u.name.toLowerCase().includes(query.toLowerCase()) && !selected.find(s => s.name === u.name)
  )

  const toggle = (user: typeof SUGGESTED_USERS[0]) => {
    if (tab === 'direct') {
      onStart(user.name, false)
    } else {
      setSelected(prev => prev.find(s => s.name === user.name) ? prev.filter(s => s.name !== user.name) : [...prev, user])
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-sm bg-bg-card border border-border rounded-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-border">
          <h2 className="text-base font-bold text-text-primary">New Message</h2>
          <button onClick={onClose} className="text-text-tertiary hover:text-text-primary"><X className="w-4 h-4" /></button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          {(['direct', 'group'] as const).map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setSelected([]) }}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${tab === t ? 'text-accent-light border-b-2 border-accent' : 'text-text-tertiary hover:text-text-secondary'}`}
            >
              {t === 'direct' ? 'Direct Message' : 'Group Chat'}
            </button>
          ))}
        </div>

        <div className="p-4 space-y-3">
          {/* Selected group members */}
          {tab === 'group' && selected.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selected.map(u => (
                <div key={u.name} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium" style={{ backgroundColor: u.color + '15', borderColor: u.color + '30', color: u.color }}>
                  {u.name}
                  <button onClick={() => setSelected(prev => prev.filter(s => s.name !== u.name))}>
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search players..."
              className="w-full h-10 pl-9 pr-3 bg-bg-secondary border border-border rounded-xl text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none"
            />
          </div>

          {/* User list */}
          <div className="space-y-1 max-h-52 overflow-y-auto">
            {filtered.length === 0 && (
              <p className="text-sm text-text-tertiary text-center py-4">No players found.</p>
            )}
            {filtered.map(user => (
              <button
                key={user.name}
                onClick={() => toggle(user)}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.03] transition-colors text-left"
              >
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border flex-shrink-0"
                  style={{ backgroundColor: user.color + '20', borderColor: user.color + '35', color: user.color }}>
                  {user.initials}
                </div>
                <span className="text-sm font-medium text-text-primary flex-1">{user.name}</span>
                {tab === 'group' && selected.find(s => s.name === user.name) && (
                  <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                    <X className="w-3 h-3 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Start group button */}
          {tab === 'group' && (
            <button
              disabled={selected.length < 2}
              onClick={() => onStart(selected.map(s => s.name).join(', '), true)}
              className="w-full h-10 bg-accent hover:bg-accent-dark disabled:opacity-30 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Users className="w-4 h-4" />
              Start Group Chat ({selected.length} selected)
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Chat() {
  const [selectedConvo, setSelectedConvo] = useState<Conversation | null>(null)
  const { messages, setMessages, sendMessage } = useRealtimeMessages(selectedConvo?.id ?? null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showNewMessage, setShowNewMessage] = useState(false)

  const handleStartNew = (name: string, isGroup: boolean) => {
    const newConvo: Conversation = {
      id: `new-${Date.now()}`,
      name,
      type: isGroup ? 'league' : 'direct',
      avatarInitials: name.slice(0, 2).toUpperCase(),
      avatarColor: '#3B82F6',
      lastMessage: 'Start the conversation...',
      lastMessageTime: 'Now',
      unreadCount: 0,
      isOnline: true,
      memberCount: isGroup ? name.split(', ').length + 1 : undefined,
    }
    setShowNewMessage(false)
    setSelectedConvo(newConvo)
    setMessages([])
  }

  // Load mock messages when selecting a conversation
  const handleSelectConvo = (convo: Conversation) => {
    setSelectedConvo(convo)
    setMessages(getMockMessages(convo.id))
  }

  const filteredConvos = searchQuery.trim()
    ? MOCK_CONVERSATIONS.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : MOCK_CONVERSATIONS

  // Mobile: show either list or chat
  const showingChat = !!selectedConvo

  return (
    <>
    <div className="flex h-[calc(100svh-64px-72px)] lg:h-[calc(100svh-64px)] -m-4 lg:-m-6">

      {/* LEFT: Conversation List */}
      <div className={`w-full lg:w-80 flex-shrink-0 flex flex-col border-r border-border bg-bg-secondary ${showingChat ? 'hidden lg:flex' : 'flex'}`}>
        <div className="p-4 border-b border-border space-y-3">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-text-primary">Messages</h1>
            <button
              onClick={() => setShowNewMessage(true)}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-accent/10 border border-accent/20 text-accent-light hover:bg-accent/20 transition-colors"
              title="New message"
            >
              <Pencil className="w-4 h-4" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 bg-bg-card border border-border rounded-lg text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none"
              placeholder="Search conversations..."
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConvos.map(convo => (
            <button
              key={convo.id}
              onClick={() => handleSelectConvo(convo)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/[0.02] transition-colors border-b border-border/30 ${
                selectedConvo?.id === convo.id ? 'bg-accent/[0.04] border-l-2 border-l-accent' : ''
              }`}
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold border"
                  style={{ backgroundColor: convo.avatarColor + '20', borderColor: convo.avatarColor + '35', color: convo.avatarColor }}
                >
                  {convo.type === 'league' ? <Users className="w-4 h-4" /> : convo.avatarInitials}
                </div>
                {convo.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-bg-secondary" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-semibold truncate ${convo.unreadCount > 0 ? 'text-text-primary' : 'text-text-secondary'}`}>
                    {convo.name}
                  </span>
                  <span className="text-[10px] text-text-tertiary ml-2 flex-shrink-0">{convo.lastMessageTime}</span>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <span className={`text-xs truncate ${convo.unreadCount > 0 ? 'text-text-secondary' : 'text-text-tertiary'}`}>
                    {convo.lastMessage}
                  </span>
                  {convo.unreadCount > 0 && (
                    <span className="ml-2 w-5 h-5 flex items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white flex-shrink-0">
                      {convo.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT: Chat Panel */}
      <div className={`flex-1 flex flex-col bg-bg-primary min-w-0 ${!showingChat ? 'hidden lg:flex' : 'flex'}`}>
        {selectedConvo ? (
          <>
            {/* Chat header */}
            <div className="flex items-center gap-3 px-4 h-14 border-b border-border flex-shrink-0">
              <button
                onClick={() => setSelectedConvo(null)}
                className="lg:hidden text-text-tertiary hover:text-text-secondary"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold border flex-shrink-0"
                style={{ backgroundColor: selectedConvo.avatarColor + '20', borderColor: selectedConvo.avatarColor + '35', color: selectedConvo.avatarColor }}
              >
                {selectedConvo.type === 'league' ? <Users className="w-3.5 h-3.5" /> : selectedConvo.avatarInitials}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-text-primary truncate">{selectedConvo.name}</div>
                <div className="text-[10px] text-text-tertiary">
                  {selectedConvo.type === 'league'
                    ? `${selectedConvo.memberCount} members`
                    : selectedConvo.isOnline ? 'Online' : 'Offline'
                  }
                </div>
              </div>
            </div>

            <ChatPanel
              messages={messages}
              onSend={sendMessage}
              placeholder={`Message ${selectedConvo.name}...`}
            />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 rounded-2xl bg-bg-card border border-border flex items-center justify-center mb-4">
              <MessageSquare className="w-7 h-7 text-text-tertiary" />
            </div>
            <h3 className="text-base font-semibold text-text-primary mb-1">No conversation selected</h3>
            <p className="text-sm text-text-tertiary max-w-xs mb-5">Choose an existing chat or start a new one.</p>
            <button
              onClick={() => setShowNewMessage(true)}
              className="flex items-center gap-2 h-10 px-5 bg-accent hover:bg-accent-dark text-white text-sm font-bold rounded-xl transition-colors"
            >
              <UserPlus className="w-4 h-4" /> New Message
            </button>
          </div>
        )}
      </div>
    </div>

    {showNewMessage && (
      <NewMessageModal
        onClose={() => setShowNewMessage(false)}
        onStart={handleStartNew}
      />
    )}
    </>
  )
}
