import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuditContext } from '../context/AuditContext'

const SECTORS = [
  { id: 'banking', name: 'Banking & Credit', emoji: '🏦', desc: 'Loan, credit, KYC', tags: ['DPDP Act', 'Disparate Impact', 'Gender bias'] },
  { id: 'hiring',  name: 'Hiring & HR',      emoji: '💼', desc: 'Screeners, ranking',  tags: ['EEOC', 'School proxy', 'Surname bias'] },
  { id: 'health',  name: 'Healthcare',        emoji: '🏥', desc: 'Diagnostic models',  tags: ['Diagnostic parity', 'Regional bias'] },
  { id: 'edu',     name: 'Education',         emoji: '🎓', desc: 'Admissions, grading', tags: ['Admission bias', 'Income proxy'] },
]

function Stepper({ active }) {
  const steps = ['Sector', 'Upload', 'Processing', 'Results']
  return (
    <div className="stepper">
      {steps.map((s, i) => (
        <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className={`step ${i === active ? 'active' : i < active ? 'done' : ''}`}>
            <div className="num">
              {i < active ? '✓' : i + 1}
            </div>
            <span>{s}</span>
          </div>
          {i < steps.length - 1 && <div className="step-sep" />}
        </div>
      ))}
    </div>
  )
}

export default function SectorSelect() {
  const navigate = useNavigate()
  const { setSector } = useContext(AuditContext)
  const [picked, setPicked] = useState(null)

  const pickedObj = SECTORS.find(s => s.id === picked)

  const proceed = () => {
    setSector(pickedObj)
    navigate('/upload')
  }

  return (
    <div className="page-enter" style={{ background: 'var(--bg-grey)', minHeight: 'calc(100vh - 64px)', padding: '48px 24px 80px' }}>
      <div className="container-narrow">
        <Stepper active={0} />
        <h1 style={{ fontSize: 32, textAlign: 'center', marginBottom: 8 }}>Which sector are you auditing?</h1>
        <p style={{ textAlign: 'center', color: 'var(--text-grey)', fontSize: 15, marginBottom: 32 }}>We tune bias metrics and context rules to your industry.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {SECTORS.map(s => {
            const isPicked = picked === s.id
            return (
              <div key={s.id} onClick={() => setPicked(s.id)}
                style={{
                  background: isPicked ? 'var(--teal-bg)' : '#fff',
                  border: `${isPicked ? '2px' : '1.5px'} solid ${isPicked ? 'var(--teal)' : 'var(--border)'}`,
                  borderLeft: isPicked ? '6px solid var(--teal)' : '1.5px solid var(--border)',
                  borderRadius: 16, padding: 20, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 16,
                  position: 'relative', transition: 'all 200ms',
                }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: isPicked ? 'var(--teal)' : 'var(--teal-bg)', color: isPicked ? '#fff' : 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 22 }}>
                  {s.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 2 }}>{s.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-grey)', marginBottom: 10 }}>{s.desc}</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {s.tags.map(t => <div key={t} className="pill pill-grey" style={{ background: isPicked ? '#fff' : '#F3F4F6' }}>{t}</div>)}
                  </div>
                </div>
                {isPicked && (
                  <div style={{ position: 'absolute', top: 16, right: 16, width: 24, height: 24, borderRadius: 999, background: 'var(--teal)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>✓</div>
                )}
              </div>
            )
          })}
        </div>

        {picked && (
          <button className="btn btn-primary btn-lg page-enter" style={{ width: '100%', marginTop: 24 }} onClick={proceed}>
            Continue with {pickedObj.name} →
          </button>
        )}
      </div>
    </div>
  )
}