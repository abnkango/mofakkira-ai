import { Folder, Search, Settings, StickyNote } from 'lucide-react'
import type { Folder as FolderType, Note } from '../types'
import { formatDate } from '../data'
import { useRef } from 'react'

type Props = {
  notes: Note[]; folders: FolderType[]; selectedFolder: string; search: string
  onSearch: (value: string) => void; onSelectFolder: (id: string) => void
  onOpen: (note: Note) => void; onLongPress: (note: Note) => void
  onSettings: () => void; onFolders: () => void
}

export default function NotesScreen({ notes, folders, selectedFolder, search, onSearch, onSelectFolder, onOpen, onLongPress, onSettings, onFolders }: Props) {
  const activeNotes = notes.filter(n => !n.deletedAt && (selectedFolder === 'all' ? true : selectedFolder === 'uncategorized' ? !n.folderId : n.folderId === selectedFolder)).filter(n => `${n.title} ${n.body}`.toLowerCase().includes(search.toLowerCase()))
  const timer = useRef<number | undefined>(undefined)
  const longTriggered = useRef(false)
  const startLong = (note: Note) => { longTriggered.current = false; timer.current = window.setTimeout(() => { longTriggered.current = true; onLongPress(note) }, 560) }
  const cancelLong = () => { if (timer.current) window.clearTimeout(timer.current) }
  return <section className="screen">
    <div className="topbar"><div className="topbar-title"><button className="icon-btn" aria-label="الإعدادات" onClick={onSettings}><Settings size={19} /></button><h1>الملاحظات</h1></div><button className="icon-btn" aria-label="المجلدات" onClick={onFolders}><Folder size={19} /></button></div>
    <div className="search-wrap"><Search size={18} /><input className="search-input" value={search} onChange={e => onSearch(e.target.value)} placeholder="ابحث في ملاحظاتك" /></div>
    <div className="chips">
      <button className={`chip ${selectedFolder === 'all' ? 'active' : ''}`} onClick={() => onSelectFolder('all')}>الكل</button>
      {folders.map(f => <button key={f.id} className={`chip ${selectedFolder === f.id ? 'active' : ''}`} onClick={() => onSelectFolder(f.id)}>{f.name}</button>)}
      <button className={`chip ${selectedFolder === 'uncategorized' ? 'active' : ''}`} onClick={() => onSelectFolder('uncategorized')}>غير مصنف</button>
    </div>
    <div className="section-label shrink-0"><h3>{selectedFolder === 'all' ? 'كل ملاحظاتك' : 'ملاحظات هذا المجلد'}</h3><span>{activeNotes.length} ملاحظات</span></div>
    <div className="screen-scroll"><div className="note-list">{activeNotes.map(note => <button key={note.id} className="card note-card" onClick={() => { if (!longTriggered.current) onOpen(note); longTriggered.current = false }} onPointerDown={() => startLong(note)} onPointerUp={cancelLong} onPointerCancel={cancelLong} onPointerLeave={cancelLong}>
      <h3>{note.title || 'ملاحظة بلا عنوان'}</h3><p>{note.body || 'لا يوجد نص بعد'}</p><div className="note-meta"><span>{formatDate(note.updatedAt)}</span>{note.folderId && <span className="folder-pill">{folders.find(f => f.id === note.folderId)?.name}</span>}</div>
    </button>)}</div>{!activeNotes.length && <div className="empty-state"><StickyNote size={30} strokeWidth={1.6} /><p>{search ? 'لا توجد نتائج مطابقة' : 'لا توجد ملاحظات بعد، اضغط + للبدء'}</p></div>}</div>
  </section>
}
