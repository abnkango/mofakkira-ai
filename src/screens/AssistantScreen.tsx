import { ArrowRight, Send, Settings, Sparkles, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { ChatMessage, Note } from '../types'

type Props = { currentFolderName: string; notes: Note[]; apiKey: string; messages: ChatMessage[]; loading: boolean; error: boolean; scope: 'folder' | 'all'; onClose: () => void; onScope: (scope: 'folder' | 'all') => void; onSend: (text: string) => void; onRetry: () => void; onOpenNote: (note: Note) => void; onSettings: () => void }
const suggestions = ['ما المهام غير المنجزة؟', 'لخّص ملاحظات هذا المجلد', 'على ماذا أركز اليوم؟']

export default function AssistantScreen({ currentFolderName, notes, apiKey, messages, loading, error, scope, onClose, onScope, onSend, onRetry, onOpenNote, onSettings }: Props) {
  const [value, setValue] = useState(''); const listRef = useRef<HTMLDivElement>(null)
  useEffect(() => { listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' }) }, [messages, loading])
  const submit = () => { if (value.trim() && !loading) { onSend(value.trim()); setValue('') } }
  return <section className="assistant-sheet"><div className="assistant-head"><div className="topbar-title"><div className="brand-mark small"><Sparkles size={17} /></div><div><h2>المساعد</h2><p className="helper-text">{scope === 'folder' ? currentFolderName : 'كل الملاحظات'}</p></div></div><button className="icon-btn" aria-label="إغلاق" onClick={onClose}><X size={19} /></button></div>
    <div className="scope"><button className={scope === 'folder' ? 'active' : ''} onClick={() => onScope('folder')}>هذا المجلد</button><button className={scope === 'all' ? 'active' : ''} onClick={() => onScope('all')}>كل الملاحظات</button></div>
    <div className="chat-list" ref={listRef}>{messages.map(message => <div key={message.id} className={`bubble ${message.role}`}>{message.text}{message.noteId && (() => { const note = notes.find(n => n.id === message.noteId); return note ? <button className="note-link" onClick={() => onOpenNote(note)}>{note.title}</button> : null })()}</div>)}{loading && <div className="bubble assistant"><span className="loading-dots"><i /><i /><i /></span></div>}{error && <div className="bubble assistant"><span>تعذّر تجهيز الرد الآن.</span><button className="note-link" onClick={onRetry}>أعد المحاولة</button></div>}{!apiKey && <div className="bubble assistant"><span>أضف مفتاح API من الإعدادات لاستخدام المساعد.</span><button className="note-link" onClick={onSettings}><Settings size={14} /> الذهاب للإعدادات</button></div>}</div>
    <div className="quick-suggestions">{suggestions.map(item => <button key={item} className="suggestion" onClick={() => onSend(item)}>{item}</button>)}</div>
    <div className="chat-input"><input className="text-input" value={value} onChange={e => setValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && submit()} placeholder="اسأل المساعد..." /><button className="icon-btn" style={{ background: 'var(--accent)', color: '#fff', borderColor: 'var(--accent)' }} aria-label="إرسال" onClick={submit}><Send size={17} /></button></div>
  </section>
}
