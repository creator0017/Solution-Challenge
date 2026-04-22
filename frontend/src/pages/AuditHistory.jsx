import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ROWS = [
  { date: 'Apr 12, 2026', model: 'Home Loan Approval v3.2', sector: 'Banking', verdict: 'NON-COMPLIANT', fail: 3, pass: 2 },
  { date: 'Mar 28, 2026', model: 'Home Loan Approval v3.1', sector: 'Banking', verdict: 'COMPLIANT',     fail: 0, pass: 5 },
  { date: 'Mar 10, 2026', model: 'Resume Screener v2',       sector: 'Hiring',  verdict: 'NON-COMPLIANT', fail: 2, pass: 3 },
  { date: 'Feb 22, 2026', model: 'Diagnostic Classifier A1', sector: 'Healthcare', verdict: 'COMPLIANT', fail: 0, pass: 5 },
  { date: 'Feb 08, 2026', model: 'Credit Card Scorer v4',   sector: 'Banking', verdict: 'NON-COMPLIANT', fail: 4, pass: 1 },
]
const FILTERS = ['All', 'Non-compliant', 'Compliant', 'Banking', 'Hiring', 'Healthcare']
const SECTOR_COLOR = { Banking: 'pill-blue', Hiring: 'pill-purple', Healthcare: 'pill-green' }

export default function AuditHistory() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('All')
  const [q, setQ] = useState('')

  const filtered = ROWS.filter(r => {
    if (q && !r.model.toLowerCase().includes(q.toLowerCase())) return false
    if (filter === 'All') return true
    if (filter === 'Non-compliant') return r.verdict === 'NON-COMPLIANT'
    if (filter === 'Compliant') return r.verdict === 'COMPLIANT'
    return r.sector === filter
  })

  return (
    <div className="page-enter" style={{ background: 'var(--bg-grey)', minHeight: 'calc(100vh - 64px)', padding: '32px 24px 80px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 28 }}>Audit history</h1>
            <p style={{ color: 'var(--text-grey)', fontSize: 14, marginTop: 4 }}>All your previous audits, in one place.</p>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/sector')}>+ Start new audit</button>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '7px 14px', borderRadius: 999, background: filter === f ? 'var(--teal)' : '#fff', color: filter === f ? '#fff' : 'var(--text-grey)', border: `1px solid ${filter === f ? 'var(--teal)' : 'var(--border)'}`, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>{f}</button>
          ))}
          <div style={{ marginLeft: 'auto', position: 'relative' }}>
            <input className="input" placeholder="Search by model name…" value={q} onChange={e => setQ(e.target.value)} style={{ width: 280, height: 36, paddingLeft: 34, fontSize: 13 }}/>
            <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)', pointerEvents: 'none' }}>🔍</div>
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="table-scroll"><div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '150px 1.5fr 120px 180px 120px 130px', padding: '14px 24px', background: 'var(--bg-grey)', fontSize: 11, fontWeight: 600, color: 'var(--text-grey)', textTransform: 'uppercase', letterSpacing: 0.8 }}>
              <div>Date</div><div>Model name</div><div>Sector</div><div>Verdict</div><div>Metrics</div><div></div>
            </div>
            {filtered.map((r, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '150px 1.5fr 120px 180px 120px 130px', padding: '16px 24px', borderTop: '1px solid var(--border)', fontSize: 14, alignItems: 'center', cursor: 'pointer', transition: 'background 150ms' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-grey)'}
                onMouseLeave={e => e.currentTarget.style.background = ''}
                onClick={() => navigate('/results')}>
                <div style={{ color: 'var(--text-grey)', fontSize: 13 }}>{r.date}</div>
                <div style={{ fontWeight: 500 }}>{r.model}</div>
                <div><span className={`pill ${SECTOR_COLOR[r.sector] || 'pill-grey'}`}>{r.sector}</span></div>
                <div><span className={`pill ${r.verdict === 'COMPLIANT' ? 'pill-green' : 'pill-red'}`} style={{ fontWeight: 600 }}>{r.verdict}</span></div>
                <div style={{ fontSize: 13, color: 'var(--text-grey)' }}>
                  <span style={{ color: 'var(--red-fail)', fontWeight: 600 }}>{r.fail} fail</span>
                  {' · '}
                  <span style={{ color: 'var(--green-pass)', fontWeight: 600 }}>{r.pass} pass</span>
                </div>
                <div style={{ color: 'var(--teal)', fontWeight: 500, fontSize: 13 }}>View report →</div>
              </div>
            ))}
          </div></div>
        ) : (
          <div className="card" style={{ padding: 64, textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: 'var(--bg-grey)', color: 'var(--text-light)', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>📋</div>
            <h3 style={{ fontSize: 18, marginBottom: 6 }}>No audits match</h3>
            <p style={{ color: 'var(--text-grey)', fontSize: 14, marginBottom: 20 }}>Try a different filter or start a new audit.</p>
            <button className="btn btn-primary" onClick={() => navigate('/sector')}>Start your first audit →</button>
          </div>
        )}
      </div>
    </div>
  )
}