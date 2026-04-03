import { useState, useRef, useEffect } from 'react'
import { Send, MoreVertical, Flag, VolumeX, X } from 'lucide-react'
import type { Message } from '@/lib/messages'

interface ChatPanelProps {
  messages: Message[]
  onSend: (content: string) => void
  placeholder?: string
}

function MessageBubble({ msg, onReport }: { msg: Message; onReport: (id: string) => void }) {
  const [showMenu, setShowMenu] = useState(false)

  if (msg.type === 'system') {
    return (
      <div className="flex justify-center py-2">
        <span className="text-[11px] text-text-tertiary bg-bg-elevated/60 px-3 py-1 rounded-full">
          {msg.content}
        </span>
      </div>
    )
  }

  return (
    <div className={`flex gap-2.5 group ${msg.isOwn ? 'flex-row-reverse' : ''}`}>
      {!msg.isOwn && (
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0 mt-0.5 border"
          style={{ backgroundColor: msg.senderColor + '20', borderColor: msg.senderColor + '35', color: msg.senderColor }}
        >
          {msg.senderInitials}
        </div>
      )}
      <div className={`max-w-[75%] relative ${msg.isOwn ? 'items-end' : ''}`}>
        {!msg.isOwn && (
          <span className="text-[10px] font-semibold text-text-tertiary mb-0.5 block">{msg.senderName}</span>
        )}
        <div className={`relative px-3 py-2 rounded-xl text-sm leading-relaxed ${
          msg.isOwn
            ? 'bg-accent/15 text-text-primary rounded-tr-sm'
            : 'bg-bg-elevated text-text-primary rounded-tl-sm'
        }`}>
          {msg.content}

          {/* Context menu trigger */}
          {!msg.isOwn && (
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="absolute -right-7 top-1 opacity-0 group-hover:opacity-100 transition-opacity text-text-tertiary hover:text-text-secondary p-0.5"
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Context menu */}
          {showMenu && !msg.isOwn && (
            <div className="absolute right-0 top-full mt-1 bg-bg-card border border-border rounded-lg shadow-xl z-20 py-1 w-36">
              <button
                onClick={() => { onReport(msg.id); setShowMenu(false) }}
                className="flex items-center gap-2 w-full px-3 py-2 text-xs text-text-secondary hover:text-danger hover:bg-danger/5 transition-colors"
              >
                <Flag className="w-3.5 h-3.5" /> Report Message
              </button>
              <button
                onClick={() => setShowMenu(false)}
                className="flex items-center gap-2 w-full px-3 py-2 text-xs text-text-secondary hover:text-warning hover:bg-warning/5 transition-colors"
              >
                <VolumeX className="w-3.5 h-3.5" /> Mute User
              </button>
            </div>
          )}
        </div>
        <span className={`text-[9px] text-text-tertiary mt-0.5 block ${msg.isOwn ? 'text-right' : ''}`}>
          {new Date(msg.createdAt).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  )
}

export default function ChatPanel({ messages, onSend, placeholder = 'Type a message...' }: ChatPanelProps) {
  const [input, setInput] = useState('')
  const [toast, setToast] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  const handleSend = () => {
    if (!input.trim()) return
    onSend(input)
    setInput('')
  }

  const handleReport = (_id: string) => {
    setToast('Message reported. Our team will review it.')
    setTimeout(() => setToast(''), 3000)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <span className="text-3xl mb-3">💬</span>
            <p className="text-sm text-text-tertiary">No messages yet. Start the conversation!</p>
          </div>
        )}
        {messages.map(msg => (
          <MessageBubble key={msg.id} msg={msg} onReport={handleReport} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Toast */}
      {toast && (
        <div className="mx-4 mb-2 flex items-center gap-2 p-2.5 bg-success/10 border border-success/20 rounded-lg text-xs text-success">
          <Flag className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="flex-1">{toast}</span>
          <button onClick={() => setToast('')}><X className="w-3 h-3" /></button>
        </div>
      )}

      {/* Input bar */}
      <div className="px-3 py-3 border-t border-border">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
            className="flex-1 h-10 px-4 bg-bg-card border border-border rounded-xl text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none transition-colors"
            placeholder={placeholder}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-accent hover:bg-accent-dark disabled:opacity-30 disabled:cursor-not-allowed text-white transition-colors flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
