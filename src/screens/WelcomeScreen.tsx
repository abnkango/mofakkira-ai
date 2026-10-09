import { KeyRound, Sparkles } from 'lucide-react'
import { useState } from 'react'

type Props = { onDone: (key?: string) => void }

export default function WelcomeScreen({ onDone }: Props) {
  const [step, setStep] = useState<'welcome' | 'key'>('welcome')
  const [key, setKey] = useState('')
  if (step === 'welcome') return (
    <section className="screen welcome">
      <div className="welcome-art">
        <div className="brand-mark"><Sparkles size={27} strokeWidth={2.2} /></div>
        <div><h1>المفكرة AI</h1><p>مساحة هادئة تجمع ملاحظاتك ومهامك، وتساعدك على تحويل الأفكار إلى خطوات.</p></div>
      </div>
      <div className="welcome-footer">
        <button className="primary-btn" onClick={() => setStep('key')}>ابدأ</button>
        <p className="helper-text" style={{ textAlign: 'center' }}>خصوصيتك أولاً، وتتحكم أنت بما تشاركه.</p>
      </div>
    </section>
  )
  return (
    <section className="screen welcome">
      <div className="form-stack">
        <button className="back-btn" onClick={() => setStep('welcome')}>رجوع</button>
        <div className="topbar-title"><div className="brand-mark small"><KeyRound size={18} /></div><h1>خطوة اختيارية</h1></div>
        <p className="helper-text">يمكنك إضافة مفتاح API الآن، لكنه اختياري. يعمل التطبيق بالكامل بدونه، ويحتاجه المساعد فقط.</p>
        <div className="field"><label htmlFor="welcome-key">مفتاح API</label><input id="welcome-key" className="text-input" type="password" value={key} onChange={e => setKey(e.target.value)} placeholder="ألصق المفتاح هنا" /></div>
      </div>
      <div className="welcome-footer">
        <button className="primary-btn" onClick={() => onDone(key || undefined)}>حفظ وابدأ</button>
        <button className="link-btn" onClick={() => onDone()}>لاحقًا</button>
      </div>
    </section>
  )
}
