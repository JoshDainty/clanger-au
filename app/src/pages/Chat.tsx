import { useState } from 'react'
import { Search, Users, MessageSquare, ArrowLeft } from 'lucide-react'
import { MOCK_CONVERSATIONS, getMockMessages, useRealtimeMessages, type Conversation } from '@/lib/messages'
import ChatPanel from '@/components/ChatPanel'

export default function Chat() {
  const [selectedConvo, setSelectedConvo] = useState<Conversation | null>(null)
  const { messages, setMessages, sendMessage } = useRealtimeMessages(selectedConvo?.id ?? null)
  const [searchQuery, setSearchQuery] = useState('')

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
    <div className="flex h-[calc(100svh-64px-72px)] lg:h-[calc(100svh-64px)] -m-4 lg:-m-6">

      {/* LEFT: Conversation List */}
      <div className={`w-full lg:w-80 flex-shrink-0 flex flex-col border-r border-border bg-bg-secondary ${showingChat ? 'hidden lg:flex' : 'flex'}`}>
        <div className="p-4 border-b border-border space-y-3">
          <h1 className="text-lg font-bold text-text-primary">Messages</h1>
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
            <h3 className="text-base font-semibold text-text-primary mb-1">Select a conversation</h3>
            <p className="text-sm text-text-tertiary max-w-xs">Choose a league chat or direct message from the sidebar to start talking.</p>
          </div>
        )}
      </div>
    </div>
  )
}
