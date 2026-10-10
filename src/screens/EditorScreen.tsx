import { ArrowRight, CalendarDays, ChevronDown, Sparkles, Trash2 } from 'lucide-react'
import type { Folder, Note } from '../types'
import { formatNoteDate } from '../utils'

type Props = { note: Note; folders: Folder[]; onBack: () => void; onUpdate: (patch: Partial<Note>) => void; onMove: () => void; onExtract: () => void; onDelete: () => void }

export default function EditorScreen({ note, folders, onBack, onUpdate, onMove, onExtract, onDelete }: Props) {
  const folderName = note.folderId ? folders.find(f => f.id === note.folderId)?.name : 'غير مصنف'
  return <section className="screen editor-screen">
    <div className="editor-head"><button className="back-btn" onClick={onBack}><ArrowRight size={19} /> رجوع</button><button className="delete-link" onClick={onDelete}><Trash2 size={17} /> حذف</button></div>
    <input className="editor-title" value={note.title} onChange={e => onUpdate({ title: e.target.value })} placeholder="عنوان الملاحظة" aria-label="عنوان الملاحظة" />
    <textarea className="editor-body" value={note.body} onChange={e => onUpdate({ body: e.target.value })} placeholder="اكتب ما يدور في بالك..." aria-label="نص الملاحظة" />
    <div className="editor-toolbar"><div className="toolbar-line"><button className="folder-select" onClick={onMove}><span>{folderName}</span><ChevronDown size={16} /></button><span className="note-meta"><CalendarDays size={14} /> {formatNoteDate(note.updatedAt).slice(0, -6).trim()} <span dir="ltr" style={{ unicodeBidi: 'isolate' }}>{formatNoteDate(note.updatedAt).slice(-5)}</span></span></div><button className="extract-btn" onClick={onExtract}><Sparkles size={17} /> استخرج مهام</button></div>
  </section>
}
