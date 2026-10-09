import { Check, ChevronRight, ListTodo, Plus } from 'lucide-react'
import { useRef, useState } from 'react'
import type { Task } from '../types'

type Props = { tasks: Task[]; onToggle: (id: string) => void; onAdd: (text: string) => void; onDelete: (id: string) => void; onBack: () => void }
type Filter = 'all' | 'open' | 'done'

export default function TasksScreen({ tasks, onToggle, onAdd, onDelete, onBack }: Props) {
  const [value, setValue] = useState(''); const [filter, setFilter] = useState<Filter>('all'); const startX = useRef(0); const [dragging, setDragging] = useState<string | null>(null)
  const shown = [...tasks].filter(t => filter === 'all' || (filter === 'open' ? !t.done : t.done)).sort((a, b) => Number(a.done) - Number(b.done))
  const submit = () => { const clean = value.trim(); if (clean) { onAdd(clean); setValue('') } }
  return <section className="screen">
    <div className="topbar"><button className="back-btn" onClick={onBack}><ChevronRight size={19} /> رجوع</button><div className="topbar-title"><ListTodo size={20} color="var(--accent)" /><h1>المهام</h1></div><span style={{ width: 42 }} /></div>
    <div className="task-add"><input className="quick-input" value={value} onChange={e => setValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && submit()} placeholder="أضف مهمة سريعة" /><button className="icon-btn" aria-label="إضافة مهمة" onClick={submit}><Plus size={21} /></button></div>
    <div className="filters"><button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>الكل</button><button className={`filter-btn ${filter === 'open' ? 'active' : ''}`} onClick={() => setFilter('open')}>غير المنجزة</button><button className={`filter-btn ${filter === 'done' ? 'active' : ''}`} onClick={() => setFilter('done')}>المنجزة</button></div>
    <div className="task-list">{shown.map(task => <div key={task.id} className={`card task-row ${dragging === task.id ? 'dragging' : ''}`} onPointerDown={e => { startX.current = e.clientX; setDragging(task.id) }} onPointerUp={e => { const dx = e.clientX - startX.current; setDragging(null); if (Math.abs(dx) > 80) onDelete(task.id) }} onPointerCancel={() => setDragging(null)}><button className={`task-check ${task.done ? 'done' : ''}`} onClick={() => onToggle(task.id)} aria-label={task.done ? 'إلغاء الإنجاز' : 'إنجاز المهمة'}>{task.done && <Check size={15} />}</button><span className={`task-text ${task.done ? 'done' : ''}`}>{task.text}</span></div>)}</div>
    {!shown.length && <div className="empty-state"><ListTodo size={30} strokeWidth={1.6} /><p>لا توجد مهام {filter === 'open' ? 'غير منجزة' : filter === 'done' ? 'منجزة' : ''}</p></div>}
    <p className="helper-text" style={{ textAlign: 'center', marginTop: 22 }}>اسحب المهمة إلى أي جانب لحذفها</p>
  </section>
}
