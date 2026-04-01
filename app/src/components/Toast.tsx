import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { CheckCircle, AlertTriangle, Info, X, XCircle } from 'lucide-react'

/* ─── Types ─── */
type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  type: ToastType
  message: string
  exiting?: boolean
}

interface ToastContextValue {
  toast: (type: ToastType, message: string) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

/* ─── Provider ─── */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = crypto.randomUUID()
    setToasts(prev => [...prev, { id, type, message }])

    // Auto-dismiss after 4s
    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t))
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id))
      }, 200)
    }, 4000)
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t))
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 200)
  }, [])

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}

      {/* Toast container — top-right */}
      <div className="fixed top-4 right-4 z-[999] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map(t => (
          <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

/* ─── Toast Item ─── */
const TOAST_CONFIG: Record<ToastType, { icon: typeof CheckCircle; iconColor: string; borderColor: string; bgColor: string }> = {
  success: { icon: CheckCircle, iconColor: 'text-success', borderColor: 'border-success/20', bgColor: 'bg-success/[0.06]' },
  error: { icon: XCircle, iconColor: 'text-danger', borderColor: 'border-danger/20', bgColor: 'bg-danger/[0.06]' },
  warning: { icon: AlertTriangle, iconColor: 'text-warning', borderColor: 'border-warning/20', bgColor: 'bg-warning/[0.06]' },
  info: { icon: Info, iconColor: 'text-accent-light', borderColor: 'border-accent/20', bgColor: 'bg-accent/[0.06]' },
}

function ToastItem({ toast: t, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const config = TOAST_CONFIG[t.type]
  const Icon = config.icon

  return (
    <div className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-2xl ${config.borderColor} ${config.bgColor} bg-bg-card/90 ${t.exiting ? 'toast-exit' : 'toast-enter'}`}>
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${config.iconColor}`} />
      <p className="text-sm text-text-primary flex-1">{t.message}</p>
      <button
        onClick={() => onDismiss(t.id)}
        className="text-text-tertiary hover:text-text-secondary flex-shrink-0 mt-0.5"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
