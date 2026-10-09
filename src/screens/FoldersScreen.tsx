import { ArrowRight, Check, Folder, MoreVertical, Plus, Recycle, Trash2 } from 'lucide-react'
import { useRef } from 'react'
import type { Folder as FolderType, Note } from '../types'

type Props = { folders: FolderType[]; notes: Note[]; selectedFolder: string; onBack: () => void; onRecycle: () => void; onSelect: (id: string) => void; onNew: () => void; onFolderMenu: (folder: FolderType) => void }

export default function FoldersScreen({ folders, notes, selectedFolder, onBack, onRecycle, onSelect, onNew, onFolderMenu }: Props) {
  const items: FolderType[] = [{ id: 'all', name: 'الكل', system: true }, ...folders, { id: 'uncategorized', name: 'غير مصنف', system: true }]
  const count = (id: string) => notes.filter(n => !n.deletedAt && (id === 'all' ? true : id === 'uncategorized' ? !n.folderId : n.folderId === id)).length
  const timer = useRef<number | undefined>(undefined)
  const longTriggered = useRef(false)
  return <section className="screen">
    <div className="topbar"><button className="back-btn" onClick={onBack}><ArrowRight size={19} /> رجوع</button><h1>مجلدات</h1><button className="icon-btn" aria-label="سلة المحذوفات" onClick={onRecycle}><Recycle size={19} /></button></div>
    <div className="folder-list">{items.map(folder => <button key={folder.id} className="card folder-row" onClick={() => { if (!longTriggered.current) { onSelect(folder.id); onBack() } longTriggered.current = false }} onPointerDown={() => { longTriggered.current = false; if (!folder.system) timer.current = window.setTimeout(() => { longTriggered.current = true; onFolderMenu(folder) }, 560) }} onPointerUp={() => { if (timer.current) window.clearTimeout(timer.current) }} onPointerCancel={() => { if (timer.current) window.clearTimeout(timer.current) }}>
      <span className="folder-row-main"><Folder size={19} /><span><strong>{folder.name}</strong><small>{count(folder.id)} ملاحظات</small></span></span><span className="folder-check">{selectedFolder === folder.id ? <Check size={19} /> : !folder.system ? <MoreVertical size={18} color="var(--muted)" /> : null}</span>
    </button>)}</div>
    <div style={{ marginTop: 16 }}><button className="card add-folder" onClick={onNew}><Plus size={18} /> مجلد جديد</button></div>
  </section>
}
