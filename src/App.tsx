import { useEffect, useMemo, useState } from 'react'
import { Check, Folder, Trash2, X } from 'lucide-react'
import type { ChatMessage, Folder as FolderType, ModalState, Note, Screen, Task, ThemeMode } from './types'
import { daysRemaining, seedFolders, seedNotes, seedTasks } from './data'
import WelcomeScreen from './screens/WelcomeScreen'
import NotesScreen from './screens/NotesScreen'
import FoldersScreen from './screens/FoldersScreen'
import EditorScreen from './screens/EditorScreen'
import TasksScreen from './screens/TasksScreen'
import AssistantScreen from './screens/AssistantScreen'
import SettingsScreen from './screens/SettingsScreen'
import RecycleBinScreen from './screens/RecycleBinScreen'

const makeId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
const load = <T,>(key: string, fallback: T): T => { try { const value = localStorage.getItem(key); return value ? JSON.parse(value) as T : fallback } catch { return fallback } }

export default function App() {
  const [started, setStarted] = useState(() => localStorage.getItem('mofakkira-started') === 'yes')
  const [screen, setScreen] = useState<Screen>('notes')
  const [notes, setNotes] = useState<Note[]>(() => load('mofakkira-notes', seedNotes))
  const [folders, setFolders] = useState<FolderType[]>(() => load('mofakkira-folders', seedFolders))
  const [tasks, setTasks] = useState<Task[]>(() => load('mofakkira-tasks', seedTasks))
  const [theme, setTheme] = useState<ThemeMode>(() => load('mofakkira-theme', 'auto'))
  const [provider, setProvider] = useState<'Gemini' | 'Groq'>(() => load('mofakkira-provider', 'Gemini'))
  const [apiKey, setApiKey] = useState(() => load('mofakkira-key', ''))
  const [privacyAck, setPrivacyAck] = useState(() => load('mofakkira-privacy', false))
  const [selectedFolder, setSelectedFolder] = useState('all')
  const [search, setSearch] = useState('')
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)
  const [previousScreen, setPreviousScreen] = useState<Screen>('notes')
  const [modal, setModal] = useState<ModalState>(null)
  const [newFolderName, setNewFolderName] = useState('')
  const [extractSelected, setExtractSelected] = useState<string[]>([])
  const [toast, setToast] = useState('')
  const [assistantOpen, setAssistantOpen] = useState(false)
  const [assistantScope, setAssistantScope] = useState<'folder' | 'all'>('folder')
  const [assistantMessages, setAssistantMessages] = useState<ChatMessage[]>([{ id: 'welcome', role: 'assistant', text: 'مرحباً، أنا هنا لأساعدك على ترتيب أفكارك وتحويلها إلى خطوات.' }])
  const [assistantLoading, setAssistantLoading] = useState(false)
  const [assistantError, setAssistantError] = useState(false)
  const currentNote = notes.find(n => n.id === selectedNoteId)
  const visibleNotes = useMemo(() => notes.filter(n => !n.deletedAt && daysRemaining(n.deletedAt ?? new Date().toISOString()) >= 0), [notes])
  const currentFolderName = selectedFolder === 'all' ? 'كل الملاحظات' : selectedFolder === 'uncategorized' ? 'غير مصنف' : folders.find(f => f.id === selectedFolder)?.name ?? 'هذا المجلد'

  useEffect(() => { localStorage.setItem('mofakkira-notes', JSON.stringify(notes)); localStorage.setItem('mofakkira-folders', JSON.stringify(folders)); localStorage.setItem('mofakkira-tasks', JSON.stringify(tasks)) }, [notes, folders, tasks])
  useEffect(() => { localStorage.setItem('mofakkira-theme', JSON.stringify(theme)); const dark = theme === 'dark' || (theme === 'auto' && window.matchMedia?.('(prefers-color-scheme: dark)').matches); document.documentElement.dataset.theme = dark ? 'dark' : 'light' }, [theme])
  useEffect(() => { localStorage.setItem('mofakkira-provider', JSON.stringify(provider)); localStorage.setItem('mofakkira-key', JSON.stringify(apiKey)); localStorage.setItem('mofakkira-privacy', JSON.stringify(privacyAck)) }, [provider, apiKey, privacyAck])
  useEffect(() => { if (!toast) return; const timer = window.setTimeout(() => setToast(''), 2400); return () => window.clearTimeout(timer) }, [toast])

  const finishWelcome = (key?: string) => { if (key) setApiKey(key); setStarted(true); localStorage.setItem('mofakkira-started', 'yes') }
  const go = (next: Screen) => { setPreviousScreen(screen); setScreen(next) }
  const openNote = (note: Note) => { setSelectedNoteId(note.id); setPreviousScreen(screen); setScreen('editor'); setAssistantOpen(false) }
  const createNote = () => { const now = new Date().toISOString(); const folderId = selectedFolder !== 'all' && selectedFolder !== 'uncategorized' ? selectedFolder : undefined; const note: Note = { id: makeId('note'), title: '', body: '', folderId, createdAt: now, updatedAt: now }; setNotes(prev => [note, ...prev]); setSelectedNoteId(note.id); setPreviousScreen('notes'); setScreen('editor') }
  const updateNote = (patch: Partial<Note>) => { if (!selectedNoteId) return; setNotes(prev => prev.map(n => n.id === selectedNoteId ? { ...n, ...patch } : n)) }
  const moveNote = (noteId: string, folderId?: string) => { setNotes(prev => prev.map(n => n.id === noteId ? { ...n, folderId, updatedAt: new Date().toISOString() } : n)); setModal(null); setToast('تم نقل الملاحظة') }
  const deleteNote = (noteId: string) => { setNotes(prev => prev.map(n => n.id === noteId ? { ...n, deletedAt: new Date().toISOString(), originalFolderId: n.folderId, folderId: undefined } : n)); setModal(null); setAssistantOpen(false); if (screen === 'editor') setScreen(previousScreen === 'editor' ? 'notes' : previousScreen); setToast('نُقلت الملاحظة إلى سلة المحذوفات') }
  const restoreNote = (noteId: string) => { setNotes(prev => prev.map(n => n.id === noteId ? { ...n, deletedAt: undefined, folderId: n.originalFolderId && folders.some(f => f.id === n.originalFolderId) ? n.originalFolderId : undefined, originalFolderId: undefined } : n)); setToast('تمت استعادة الملاحظة') }
  const permanentDelete = (noteId: string) => { setNotes(prev => prev.filter(n => n.id !== noteId)); setModal(null); setToast('تم الحذف النهائي') }
  const addFolder = () => { const name = newFolderName.trim(); if (!name) return; const id = `folder-${Date.now()}`; setFolders(prev => [...prev, { id, name }]); setNewFolderName(''); setModal(null); setToast('تم إنشاء المجلد') }
  const deleteFolder = (folderId: string) => { setNotes(prev => prev.map(n => n.folderId === folderId ? { ...n, folderId: undefined } : n)); setFolders(prev => prev.filter(f => f.id !== folderId)); if (selectedFolder === folderId) setSelectedFolder('uncategorized'); setModal(null); setToast('تم حذف المجلد ونقل ملاحظاته') }
  const renameFolder = (folder: FolderType) => { const name = window.prompt('إعادة تسمية المجلد', folder.name)?.trim(); if (name) setFolders(prev => prev.map(f => f.id === folder.id ? { ...f, name } : f)); setModal(null) }
  const extractTasks = (note: Note) => { if (!note.body.trim()) { setToast('اكتب نصًا في الملاحظة أولاً'); return } const suggestions = note.body.split(/[،,؛;.!؟\n]/).map(s => s.trim()).filter(s => s.length > 5).slice(0, 4).map(s => s.replace(/^(تجهيز|مراجعة|شراء|إرسال|ترتيب|تحقق من)\s*/u, '').trim()).map(s => `مراجعة ${s}`); setExtractSelected(suggestions); setModal({ type: 'extract-tasks', noteId: note.id, suggestions }) }
  const confirmExtract = () => { if (!modal || modal.type !== 'extract-tasks') return; setTasks(prev => [...extractSelected.map(text => ({ id: makeId('task'), text, done: false, createdAt: new Date().toISOString() })), ...prev]); setModal(null); setToast('أضيفت المهام المحددة') }
  const sendAssistant = (text: string) => { if (!text.trim() || assistantLoading || !apiKey) return; const clean = text.trim(); setAssistantMessages(prev => [...prev, { id: makeId('user'), role: 'user', text: clean }]); setAssistantError(false); setAssistantLoading(true); window.setTimeout(() => { const pool = assistantScope === 'folder' && selectedFolder !== 'all' ? visibleNotes.filter(n => selectedFolder === 'uncategorized' ? !n.folderId : n.folderId === selectedFolder) : visibleNotes; const note = pool[0]; let reply = 'ابدأ بمهمة واحدة واضحة، ثم اترك مساحة لبقية اليوم. يبدو أن أفضل خطوة الآن هي مراجعة ما هو قريب من موعده.'; if (clean.includes('المهام')) reply = tasks.filter(t => !t.done).length ? `لديك ${tasks.filter(t => !t.done).length} مهام غير منجزة. اقترح البدء بـ«${tasks.find(t => !t.done)?.text}».` : 'رائع، لا توجد مهام غير منجزة حالياً.'; else if (clean.includes('لخّص')) reply = note ? `في هذا النطاق، تدور ملاحظاتك حول التخطيط وترتيب الخطوات العملية. أقرب ملاحظة لذلك هي:` : 'لا توجد ملاحظات في هذا النطاق بعد.'; else if (clean.includes('أركز')) reply = 'ركّز اليوم على مهمة واحدة من العمل، ثم خصص وقتاً قصيراً لترتيب ما بعدها.'; setAssistantMessages(prev => [...prev, { id: makeId('assistant'), role: 'assistant', text: reply, noteId: note && clean.includes('لخّص') ? note.id : undefined }]); setAssistantLoading(false) }, 850) }
  const openAssistant = () => { setAssistantOpen(true); setAssistantScope('folder'); if (!privacyAck) setModal({ type: 'privacy' }) }

  if (!started) return <div className="app-shell"><main className="phone-frame"><WelcomeScreen onDone={finishWelcome} /></main></div>
  return <div className="app-shell"><main className="phone-frame">
    {screen === 'notes' && <NotesScreen notes={visibleNotes} folders={folders} selectedFolder={selectedFolder} search={search} onSearch={setSearch} onSelectFolder={setSelectedFolder} onOpen={openNote} onLongPress={note => setModal({ type: 'move-note', noteId: note.id })} onSettings={() => go('settings')} onFolders={() => go('folders')} onNew={createNote} onAssistant={openAssistant} onTasks={() => go('tasks')} />}
    {screen === 'folders' && <FoldersScreen folders={folders} notes={notes} selectedFolder={selectedFolder} onBack={() => setScreen('notes')} onRecycle={() => go('recycle')} onSelect={setSelectedFolder} onNew={() => setModal({ type: 'new-folder' })} onFolderMenu={folder => setModal({ type: 'folder-menu', folderId: folder.id })} />}
    {screen === 'editor' && currentNote && <EditorScreen note={currentNote} folders={folders} onBack={() => setScreen(previousScreen === 'editor' ? 'notes' : previousScreen)} onUpdate={updateNote} onMove={() => setModal({ type: 'move-note', noteId: currentNote.id })} onExtract={() => extractTasks(currentNote)} onDelete={() => setModal({ type: 'delete-note', noteId: currentNote.id })} />}
    {screen === 'tasks' && <TasksScreen tasks={tasks} onBack={() => setScreen('notes')} onNotes={() => setScreen('notes')} onAssistant={openAssistant} onToggle={id => setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))} onAdd={text => setTasks(prev => [{ id: makeId('task'), text, done: false, createdAt: new Date().toISOString() }, ...prev])} onDelete={id => { setTasks(prev => prev.filter(t => t.id !== id)); setToast('حُذفت المهمة') }} />}
    {screen === 'settings' && <SettingsScreen provider={provider} apiKey={apiKey} theme={theme} onBack={() => setScreen(previousScreen === 'settings' ? 'notes' : previousScreen)} onProvider={setProvider} onKey={setApiKey} onTheme={setTheme} />}
    {screen === 'recycle' && <RecycleBinScreen notes={notes} onBack={() => setScreen('folders')} onRestore={restoreNote} onDelete={id => setModal({ type: 'delete-permanent', noteId: id })} />}
    {assistantOpen && <AssistantScreen currentFolderName={currentFolderName} notes={visibleNotes} apiKey={apiKey} messages={assistantMessages} loading={assistantLoading} error={assistantError} scope={assistantScope} onClose={() => setAssistantOpen(false)} onScope={setAssistantScope} onSend={sendAssistant} onRetry={() => setAssistantError(false)} onOpenNote={openNote} onSettings={() => { setAssistantOpen(false); go('settings') }} />}
    {modal && <Modal modal={modal} folders={folders} notes={notes} newFolderName={newFolderName} setNewFolderName={setNewFolderName} extractSelected={extractSelected} setExtractSelected={setExtractSelected} onClose={() => setModal(null)} onMove={moveNote} onDelete={id => setModal({ type: 'delete-note', noteId: id })} onConfirmDelete={deleteNote} onConfirmPermanent={permanentDelete} onAddFolder={addFolder} onDeleteFolder={deleteFolder} onRenameFolder={renameFolder} onAskDeleteFolder={id => setModal({ type: 'delete-folder', folderId: id })} onConfirmExtract={confirmExtract} onPrivacy={() => { setPrivacyAck(true); setModal(null) }} />}
    {toast && <div className="toast">{toast}</div>}
  </main></div>
}

type ModalProps = { modal: NonNullable<ModalState>; folders: FolderType[]; notes: Note[]; newFolderName: string; setNewFolderName: (v: string) => void; extractSelected: string[]; setExtractSelected: (v: string[]) => void; onClose: () => void; onMove: (noteId: string, folderId?: string) => void; onDelete: (id: string) => void; onConfirmDelete: (id: string) => void; onConfirmPermanent: (id: string) => void; onAddFolder: () => void; onDeleteFolder: (id: string) => void; onRenameFolder: (folder: FolderType) => void; onAskDeleteFolder: (id: string) => void; onConfirmExtract: () => void; onPrivacy: () => void }
function Modal({ modal, folders, notes, newFolderName, setNewFolderName, extractSelected, setExtractSelected, onClose, onMove, onDelete, onConfirmDelete, onConfirmPermanent, onAddFolder, onDeleteFolder, onRenameFolder, onAskDeleteFolder, onConfirmExtract, onPrivacy }: ModalProps) {
  const note = 'noteId' in modal ? notes.find(n => n.id === modal.noteId) : undefined
  const folder = modal.type === 'folder-menu' || modal.type === 'delete-folder' ? folders.find(f => f.id === modal.folderId) : undefined
  let content: React.ReactNode = null
  if (modal.type === 'move-note' && note) content = <><h3>نقل إلى مجلد</h3><div className="menu-actions">{folders.map(f => <button key={f.id} className="menu-action" onClick={() => onMove(note.id, f.id)}><Folder size={17} /> {f.name}</button>)}<button className="menu-action" onClick={() => onMove(note.id)}><Folder size={17} /> غير مصنف</button><button className="menu-action danger" onClick={() => onDelete(note.id)}><Trash2 size={17} /> حذف</button></div></>
  if (modal.type === 'delete-note' && note) content = <><h3>حذف الملاحظة؟</h3><p>ستُنقل «{note.title || 'هذه الملاحظة'}» إلى سلة المحذوفات.</p><div className="dialog-actions"><button className="ghost-btn" onClick={onClose}>إلغاء</button><button className="primary-btn" style={{ background: 'var(--danger)' }} onClick={() => onConfirmDelete(note.id)}>حذف</button></div></>
  if (modal.type === 'new-folder') content = <><h3>مجلد جديد</h3><input autoFocus className="folder-input" value={newFolderName} onChange={e => setNewFolderName(e.target.value)} placeholder="اسم المجلد" /><div className="dialog-actions"><button className="ghost-btn" onClick={onClose}>إلغاء</button><button className="primary-btn" onClick={onAddFolder} disabled={!newFolderName.trim()}>تأكيد</button></div></>
  if (modal.type === 'folder-menu' && folder) content = <><h3>{folder.name}</h3><div className="menu-actions"><button className="menu-action" onClick={() => onRenameFolder(folder)}>إعادة تسمية</button><button className="menu-action danger" onClick={() => onAskDeleteFolder(folder.id)}>حذف</button></div></>
  if (modal.type === 'delete-folder' && folder) content = <><h3>حذف المجلد؟</h3><p>ستنتقل ملاحظات هذا المجلد إلى غير مصنف</p><div className="dialog-actions"><button className="ghost-btn" onClick={onClose}>إلغاء</button><button className="primary-btn" style={{ background: 'var(--danger)' }} onClick={() => onDeleteFolder(folder.id)}>حذف</button></div></>
  if (modal.type === 'extract-tasks' && note) content = <><h3>المهام المقترحة</h3><p>اختر ما تريد إضافته إلى قائمة المهام.</p><div className="menu-actions">{modal.suggestions.map(item => <label key={item} className="menu-action" style={{ display: 'flex', alignItems: 'center', gap: 10 }}><input type="checkbox" checked={extractSelected.includes(item)} onChange={e => setExtractSelected(e.target.checked ? [...extractSelected, item] : extractSelected.filter(s => s !== item))} />{item}</label>)}</div><div className="dialog-actions"><button className="ghost-btn" onClick={onClose}>إلغاء</button><button className="primary-btn" onClick={onConfirmExtract}>إضافة المحدد</button></div></>
  if (modal.type === 'delete-permanent' && note) content = <><h3>حذف نهائي؟</h3><p>لا يمكن التراجع عن حذف هذه الملاحظة نهائياً.</p><div className="dialog-actions"><button className="ghost-btn" onClick={onClose}>إلغاء</button><button className="primary-btn" style={{ background: 'var(--danger)' }} onClick={() => onConfirmPermanent(note.id)}>حذف نهائي</button></div></>
  if (modal.type === 'privacy') content = <><h3>قبل استخدام المساعد</h3><p>ملاحظاتك تُرسل إلى مزود الذكاء الاصطناعي عند استخدام المساعد</p><button className="primary-btn" style={{ width: '100%' }} onClick={onPrivacy}>فهمت</button></>
  return <div className="dialog-backdrop" onPointerDown={e => { if (e.target === e.currentTarget) onClose() }}><div className="dialog">{content}<button className="icon-btn" style={{ position: 'absolute', insetInlineEnd: 16, bottom: 15, opacity: 0 }} aria-hidden="true"><X size={16} /></button></div></div>
}
