import { ArrowRight, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import type { ThemeMode } from '../types'

type Props = { provider: 'Gemini' | 'Groq'; apiKey: string; theme: ThemeMode; onBack: () => void; onProvider: (p: 'Gemini' | 'Groq') => void; onKey: (key: string) => void; onTheme: (theme: ThemeMode) => void }

export default function SettingsScreen({ provider, apiKey, theme, onBack, onProvider, onKey, onTheme }: Props) {
  const [key, setKey] = useState(apiKey); const [show, setShow] = useState(false)
  return <section className="screen">
    <div className="topbar"><button className="back-btn" onClick={onBack}><ArrowRight size={19} /> رجوع</button><h1>الإعدادات</h1><span style={{ width: 42 }} /></div>
    <div className="setting-section"><h3>مزود الذكاء الاصطناعي</h3><div className="card setting-card"><button className={`setting-option ${provider === 'Gemini' ? 'active' : ''}`} onClick={() => onProvider('Gemini')}>Gemini<span>{provider === 'Gemini' ? '✓' : ''}</span></button><button className={`setting-option ${provider === 'Groq' ? 'active' : ''}`} onClick={() => onProvider('Groq')}>Groq<span>{provider === 'Groq' ? '✓' : ''}</span></button></div></div>
    <div className="setting-section"><h3>مفتاح API</h3><div className="secret-field"><input className="text-input" type={show ? 'text' : 'password'} value={key} onChange={e => setKey(e.target.value)} placeholder="أدخل المفتاح" /><button aria-label={show ? 'إخفاء المفتاح' : 'إظهار المفتاح'} onClick={() => setShow(!show)}>{show ? <EyeOff size={17} /> : <Eye size={17} />}</button></div><button className="primary-btn" style={{ marginTop: 10, width: '100%' }} onClick={() => onKey(key)}>حفظ المفتاح</button><p className="helper-text" style={{ marginTop: 8 }}>يمكنك الحصول على مفتاح من لوحة المطوّر لدى المزود.</p></div>
    <div className="setting-section"><h3>المظهر</h3><div className="card setting-card"><button className={`setting-option ${theme === 'auto' ? 'active' : ''}`} onClick={() => onTheme('auto')}>تلقائي (يتبع الجهاز)<span>{theme === 'auto' ? '✓' : ''}</span></button><button className={`setting-option ${theme === 'light' ? 'active' : ''}`} onClick={() => onTheme('light')}>فاتح<span>{theme === 'light' ? '✓' : ''}</span></button><button className={`setting-option ${theme === 'dark' ? 'active' : ''}`} onClick={() => onTheme('dark')}>داكن<span>{theme === 'dark' ? '✓' : ''}</span></button></div></div>
    <div className="setting-section"><h3>عن التطبيق</h3><p className="version">الإصدار 1.0.0</p></div>
  </section>
}
