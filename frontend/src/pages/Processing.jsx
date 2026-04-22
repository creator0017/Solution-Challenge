import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Stepper({ active }) {
  const steps = ['Sector', 'Upload', 'Processing', 'Results']
  return (
    <div className="stepper">
      {steps.map((s, i) => (
        <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className={`step ${i === active ? 'active' : i < active ? 'done' : ''}`}>
            <div className="num">{i < active ? '✓' : i + 1}</div>
            <span>{s}</span>
          </div>
          {i < steps.length - 1 && <div className="step-sep" />}
        </div>
      ))}
    </div>
  )
}

const STEPS = [
  'Dataset uploaded — 47,832 rows',
  'Data cleaned — 3 rows removed',
  'Running 8 fairness metrics',
  'India Context Module scanning',
  'Gemini AI generating explanation',
  'Building compliance PDF',
]

const METRICS = ['Demographic Parity', 'Disparate Impact', 'Equalized Odds', 'Calibration', 'Individual Fairness']

export default function Processing() {
  const navigate = useNavigate()
  const [cur, setCur] = useState(0)
  const [progress, setProgress] = useState(0)
  const [metric, setMetric] = useState('Demographic Parity')

  useEffect(() => {
    const start = Date.now()
    const total = 8000
    const id = setInterval(() => {
      const t = Math.min(1, (Date.now() - start) / total)
      setProgress(t * 100)
      setCur(Math.min(STEPS.length, Math.floor(t * STEPS.length * 1.05)))
      if (t >= 1) { clearInterval(id); setTimeout(() => navigate('/results'), 400) }
    }, 120)
    const mId = setInterval(() => setMetric(m => METRICS[(METRICS.indexOf(m) + 1) % METRICS.length]), 1600)
    return () => { clearInterval(id); clearInterval(mId) }
  }, [navigate])

  const remaining = Math.max(0, Math.round((1 - progress / 100) * 28))

  return (
    <div className="page-enter" style={{ background: 'var(--bg-grey)', minHeight: 'calc(100vh - 64px)', padding: '48px 24px 80px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <Stepper active={2} />
        <h1 style={{ fontSize: 28, textAlign: 'center', marginBottom: 6 }}>Auditing your model…</h1>
        <p style={{ textAlign: 'center', color: 'var(--text-grey)', fontSize: 14, marginBottom: 32 }}>Please keep this tab open. You'll be taken to your results automatically.</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* Left — live steps */}
          <div className="card" style={{ padding: 28 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {STEPS.map((s, i) => {
                const done = i < cur, active = i === cur
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, opacity: i > cur ? 0.5 : 1, transition: 'opacity 300ms' }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 999, flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: done ? 'var(--green-pass)' : active ? '#fff' : '#F3F4F6',
                      color: done ? '#fff' : active ? 'var(--teal)' : 'var(--text-light)',
                      border: active ? '2px solid var(--teal)' : 'none',
                      fontSize: done ? 13 : 12,
                    }}>
                      {done ? '✓' : active ? <div className="spinner teal" style={{ width: 14, height: 14 }} /> : i + 1}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: done || active ? 500 : 400 }}>
                      {s}
                      {active && i === 2 && <div style={{ fontSize: 12, color: 'var(--teal)', marginTop: 2 }}>Checking: {metric}…</div>}
                    </div>
                  </div>
                )
              })}
            </div>
            <div style={{ marginTop: 24, height: 6, background: '#F3F4F6', borderRadius: 999, overflow: 'hidden' }}>
              <div style={{ width: `${progress}%`, height: '100%', background: 'var(--teal)', transition: 'width 150ms linear' }}/>
            </div>
            <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-grey)', display: 'flex', justifyContent: 'space-between' }}>
              <span>Estimated: {remaining}s remaining</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>

          {/* Right — skeleton preview */}
          <div>
            <div style={{ fontSize: 13, color: 'var(--text-light)', marginBottom: 10 }}>Preview of your results</div>
            <div className="card" style={{ padding: 20 }}>
              <div className="shimmer" style={{ width: '100%', height: 52, marginBottom: 14 }}/>
              <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                {[0,1,2,3].map(i => <div key={i} className="shimmer" style={{ flex: 1, height: 72 }}/>)}
              </div>
              {[0,1,2].map(i => <div key={i} className="shimmer" style={{ width: '100%', height: 60, marginBottom: 10 }}/>)}
              <div className="shimmer" style={{ width: '100%', height: 80, marginBottom: 10, background: 'linear-gradient(90deg, #F0FDF4 0%, #E8F5E9 50%, #F0FDF4 100%)', backgroundSize: '200% 100%' }}/>
              <div className="shimmer" style={{ width: '100%', height: 70, marginBottom: 10, background: 'linear-gradient(90deg, #F5F3FF 0%, #EDE9FE 50%, #F5F3FF 100%)', backgroundSize: '200% 100%' }}/>
              <div style={{ display: 'flex', gap: 8 }}>
                <div className="shimmer" style={{ flex: 1, height: 44 }}/>
                <div className="shimmer" style={{ flex: 1, height: 44 }}/>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-light)', marginTop: 14, fontStyle: 'italic', textAlign: 'center' }}>Your results are being prepared…</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}