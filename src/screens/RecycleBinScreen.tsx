import { ArrowRight, Recycle, RotateCcw, Trash2 } from 'lucide-react'
import type { Note } from '../types'
import { daysRemaining } from '../data'

type Props = { notes: Note[]; onBack: () => void; onRestore: (id: string) => void; onDelete: (id: string) => void }

export default function RecycleBinScreen({ notes, onBack, onRestore, onDelete }: Props) {
  const deleted = notes.filter(n => n.deletedAt && daysRemaining(n.deletedAt) > 0)
  return <section className="screen"><div className="topbar"><button className="back-btn" onClick={onBack}><ArrowRight size={19} /> رجوع</button><div className="topbar-title"><Recycle size={20} color="var(--accent)" /><h1>سلة المحذوفات</h1></div><span style={{ width: 42 }} /></div>
    <div className="screen-scroll"><div className="recycle-list">{deleted.map(note => <article key={note.id} className="card recycle-card"><div className="recycle-main"><div><h3>{note.title || 'ملاحظة بلا عنوان'}</h3><small>تبقى {daysRemaining(note.deletedAt!)} يومًا</small></div><Trash2 size={18} color="var(--muted)" /></div><div className="recycle-actions"><button className="restore-btn" onClick={() => onRestore(note.id)}><RotateCcw size={14} /> استعادة</button><button className="permanent-btn" onClick={() => onDelete(note.id)}>حذف نهائي</button></div></article>)}</div>{!deleted.length && <div className="empty-state"><Recycle size={31} strokeWidth={1.5} /><p>سلة المحذوفات فارغة</p></div>}</div>
  </section>
}
