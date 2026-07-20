import { useState } from 'react'
import PhoneIcon from './PhoneIcon'
import { telHref } from '../data'

export type Msg = { id: number; mine: boolean; text: string; sub?: string }

/* Reusable chat screen with auto-translated bubbles.
   Used by both the passenger (↔ driver) and the driver (↔ passenger). */
export default function ChatScreen({
  title,
  subtitle,
  avatar,
  avatarAmber,
  phone,
  banner,
  initial,
  reply,
  placeholder,
  onBack,
}: {
  title: string
  subtitle: string
  avatar: string
  avatarAmber?: boolean
  phone?: string
  banner: string
  initial: Msg[]
  reply: Omit<Msg, 'id'>
  placeholder: string
  onBack: () => void
}) {
  const [msgs, setMsgs] = useState<Msg[]>(initial)
  const [draft, setDraft] = useState('')

  const send = () => {
    const text = draft.trim()
    if (!text) return
    setMsgs((m) => [...m, { id: Date.now(), mine: true, text }])
    setDraft('')
    setTimeout(
      () => setMsgs((m) => [...m, { ...reply, id: Date.now() + 1 }]),
      900,
    )
  }

  return (
    <div className="screen has-bottom-bar">
      <div className="top-bar left chat-top">
        <button className="back-btn" onClick={onBack} aria-label="Back">
          ‹
        </button>
        <span className={`avatar${avatarAmber ? ' amber' : ''}`}>{avatar}</span>
        <div className="chat-head">
          <strong>{title}</strong>
          <span>{subtitle}</span>
        </div>
        {phone && (
          <a className="call-btn" href={telHref(phone)} aria-label="Call">
            <PhoneIcon />
          </a>
        )}
      </div>

      <p className="translate-banner">{banner}</p>

      <div className="chat-list">
        {msgs.map((m) => (
          <div key={m.id} className={`bubble${m.mine ? ' mine' : ''}`}>
            <p>{m.text}</p>
            {m.sub && <span>{m.sub}</span>}
          </div>
        ))}
      </div>

      <div className="bottom-bar chat-input">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder={placeholder}
        />
        <button className="send-btn" onClick={send} aria-label="Send">
          ➤
        </button>
      </div>
    </div>
  )
}
