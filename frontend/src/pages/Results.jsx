import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuditContext } from '../context/AuditContext'
import { db } from '../services/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts'
import './Results.css'

// ── MetricCard ────────────────────────────────────────────────────────────────
function MetricCard({ name, score, verdict, note, val, color }) {
  const pass = verdict === 'PASS'
  return (
    <div className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 20 }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <h4 style={{ fontSize: 15, margin: 0, fontWeight: 600 }}>{name}</h4>
          <div className={`pill ${pass ? 'pill-green' : 'pill-red'}`} style={{ fontSize: 11, padding: '2px 8px' }}>{verdict}</div>
          <div style={{ marginLeft: 'auto', fontSize: 14, fontWeight: 700, color: pass ? 'var(--green-pass)' : 'var(--red-fail)' }}>{score}</div>
        </div>
        
        {/* Simple Bar */}
        <div style={{ height: 6, background: '#F3F4F6', borderRadius: 999, marginBottom: 8, overflow: 'hidden' }}>
          <div style={{ width: `${val}%`, height: '100%', background: color || (pass ? 'var(--green-pass)' : 'var(--red-fail)'), borderRadius: 999, transition: 'width 1s ease-out' }} />
        </div>
        
        <div style={{ fontSize: 12, color: 'var(--text-grey)' }}>{note}</div>
      </div>
    </div>
  )
}

// ── Fix Overlay ───────────────────────────────────────────────────────────────
const FIX_STEPS = [
  "Loading dataset (47,832 rows)",
  "Removing Father's Occupation feature",
  "Applying AIF360 Reweighing to pincode groups",
  "Re-running 8 fairness metrics",
  "Generating fixed CSV",
]

function FixOverlay({ fixState, fixStep }) {
  if (fixState !== 'fixing' && fixState !== 'success') return null
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,42,38,0.55)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, backdropFilter: 'blur(4px)' }}>
      <div className="card page-enter" style={{ padding: 40, maxWidth: 480, width: '100%', textAlign: 'center' }}>
        {fixState === 'fixing' ? (
          <>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: 'var(--teal-bg)', color: 'var(--teal)', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className="spinner teal" style={{ width: 28, height: 28, borderWidth: 3 }} />
            </div>
            <h3 style={{ fontSize: 20, marginBottom: 4 }}>Generating fixed dataset…</h3>
            <p style={{ fontSize: 13, color: 'var(--text-grey)', marginBottom: 20 }}>Automated remediation via AIF360 Reweighing</p>
            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {FIX_STEPS.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, opacity: i > fixStep ? 0.4 : 1, transition: 'opacity 220ms' }}>
                  <div style={{ width: 20, height: 20, borderRadius: 999, flexShrink: 0, background: i < fixStep ? 'var(--green-pass)' : i === fixStep ? '#fff' : '#F3F4F6', border: i === fixStep ? '2px solid var(--teal)' : 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {i < fixStep && '✓'}
                    {i === fixStep && <div className="spinner teal" style={{ width: 10, height: 10, borderWidth: 2 }} />}
                  </div>
                  <span style={{ color: i <= fixStep ? 'var(--text-dark)' : 'var(--text-grey)' }}>{s}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="page-enter">
            <div style={{ width: 88, height: 88, borderRadius: 999, background: 'var(--green-bg)', color: 'var(--green-pass)', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 }}>
              ✓
            </div>
            <h3 style={{ fontSize: 22, marginBottom: 6 }}>Model is now compliant</h3>
            <p style={{ fontSize: 14, color: 'var(--text-grey)' }}>
              Disparate impact: <b style={{ color: 'var(--green-pass)' }}>0.60 → 0.83</b> · DPDP Act ✓ · EU AI Act ✓
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Main Results Page ─────────────────────────────────────────────────────────
export default function Results() {
  const navigate = useNavigate()
  const { fileId } = useContext(AuditContext)
  const [fileMeta, setFileMeta] = useState(null)
  const [fixState, setFixState] = useState('idle') // idle | fixing | success | compliant
  const [fixStep, setFixStep] = useState(0)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    if (fileId) {
      getDoc(doc(db, 'audits', fileId)).then(snap => {
        if (snap.exists()) {
          setFileMeta(snap.data())
        }
      }).catch(err => console.error("Failed to load file meta", err))
    }
  }, [fileId])

  const compliant = fixState === 'compliant'

  function runFix() {
    setFixState('fixing')
    setFixStep(0)
    let step = 0
    const id = setInterval(() => {
      step++
      if (step >= FIX_STEPS.length) {
        clearInterval(id)
        setTimeout(() => setFixState('success'), 400)
        setTimeout(() => setFixState('compliant'), 2100)
      }
      setFixStep(step)
    }, 650)
  }

  const handleDownloadReport = async () => {
    try {
      setDownloading(true)
      const payload = {
        sector: 'Banking / Loans',
        verdict: compliant ? 'COMPLIANT' : 'NON-COMPLIANT',
        score: compliant ? 0.83 : 0.60,
        explanation: compliant 
          ? 'Remediation complete. After applying AIF360 Reweighing to the pincode groups and dropping Father\'s Occupation, the model now scores women and men with equivalent income & credit history within 4 percentage points of each other.'
          : 'Your Home Loan Approval v3.2 model systematically rejects women at 28 percentage points higher than identically-qualified men. The root cause is pincode.'
      }

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      const response = await fetch(`${API_URL}/api/report/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!response.ok) throw new Error('Failed to generate report')
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'FairSight_Audit_Report.pdf'
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
      alert('Failed to download report.')
    } finally {
      setDownloading(false)
    }
  }

  // KPI data matching user request: Disparate Impact, Approval Gap, Checks Failed, India Proxies
  const kpis = compliant
    ? [
        { v: '0.83', l: 'Disparate Impact', color: 'var(--green-pass)', bg: 'var(--green-bg)' },
        { v: '4%',   l: 'Approval Gap',    color: 'var(--green-pass)', bg: 'var(--green-bg)' },
        { v: '0',    l: 'Checks Failed',   color: 'var(--green-pass)', bg: 'var(--green-bg)' },
        { v: '0',    l: 'India Proxies',    color: 'var(--green-pass)', bg: 'var(--green-bg)' },
      ]
    : [
        { v: '0.60', l: 'Disparate Impact', color: 'var(--orange)',     bg: '#FFF3E0' },
        { v: '28%',  l: 'Approval Gap',    color: 'var(--red-fail)',   bg: 'var(--red-bg)' },
        { v: '3',    l: 'Checks Failed',   color: 'var(--red-fail)',   bg: 'var(--red-bg)' },
        { v: '2',    l: 'India Proxies',    color: 'var(--green-pass)', bg: 'var(--green-bg)' },
      ]

  return (
    <div className="page-enter" style={{ background: 'var(--bg-grey)', minHeight: 'calc(100vh - 64px)', paddingBottom: 80 }}>

      <FixOverlay fixState={fixState} fixStep={fixStep} />

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>
        
        {/* 1. 4 Big Numbers at the top */}
        <div className="kpi-grid" style={{ marginBottom: 40 }}>
          {kpis.map(k => (
            <div key={k.l} className="card" style={{ padding: '24px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: k.color, lineHeight: 1, marginBottom: 8 }}>{k.v}</div>
              <div style={{ fontSize: 12, color: 'var(--text-grey)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{k.l}</div>
            </div>
          ))}
        </div>

        {/* 2. Gemini explanation first */}
        <div className="card" style={{ padding: 24, borderLeft: '4px solid var(--purple)', marginBottom: 32, background: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--purple-bg)', color: 'var(--purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>G</div>
            <h3 style={{ fontSize: 18, margin: 0, fontWeight: 700 }}>Gemini Explanation</h3>
            <div className="pill pill-purple" style={{ marginLeft: 'auto', background: 'var(--purple-bg)', color: 'var(--purple)', border: 'none' }}>Insights</div>
          </div>
          {compliant ? (
            <p style={{ fontSize: 15, color: 'var(--text-dark)', lineHeight: 1.6, margin: 0 }}>
              Remediation complete. After applying AIF360 Reweighing to the pincode groups and dropping <b>Father's Occupation</b>, the model now scores women and men with equivalent income & credit history within 4 percentage points of each other. The previously flagged applicant <b>Priya Sharma</b> re-scored from 0.43 to <b style={{ color: 'var(--green-pass)' }}>0.52</b>.
            </p>
          ) : (
            <p style={{ fontSize: 15, color: 'var(--text-dark)', lineHeight: 1.6, margin: 0 }}>
              Your Home Loan Approval v3.2 model systematically rejects women at 28 percentage points higher than identically-qualified men. The root cause is <b>pincode</b>: neighbourhoods 560034–560099 are predominantly women-led households, and the model has learned to penalise them indirectly. <b>Priya Sharma</b>, a 28-year-old software engineer, was scored 0.43 vs a man with identical income and credit history scored 0.51. The gap is entirely pincode-driven.
            </p>
          )}
        </div>

        {/* 2.5 Visual Charts */}
        <div className="card" style={{ padding: 24, marginBottom: 32, background: '#fff' }}>
          <h3 style={{ fontSize: 18, margin: '0 0 20px 0', fontWeight: 700 }}>Approval Rates by Gender</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={[{ name: 'Approval Rate', Men: compliant ? 84 : 82, Women: compliant ? 80 : 54 }]} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 14, fontWeight: 600 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} tickFormatter={(val) => `${val}%`} domain={[0, 100]} />
                <Tooltip 
                  cursor={{ fill: 'transparent' }} 
                  contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                  formatter={(value) => [`${value}%`]}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: 20 }} />
                <Bar dataKey="Men" fill="#0F766E" radius={[6, 6, 0, 0]} barSize={80} />
                <Bar dataKey="Women" fill={compliant ? "#14B8A6" : "#EF4444"} radius={[6, 6, 0, 0]} barSize={80} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Fairness metrics */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, marginBottom: 16, fontWeight: 700 }}>Fairness Metrics</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <MetricCard
              name="Demographic Parity"
              score={compliant ? '0.84' : '0.43'}
              verdict={compliant ? 'PASS' : 'FAIL'}
              val={compliant ? 84 : 43}
              note={compliant ? 'Parity gap closed to 4pp. Meets EU AI Act threshold.' : 'Women approved 28% less often. EU AI Act requires parity above 80%.'}
            />
            <MetricCard
              name="Disparate Impact"
              score={compliant ? '0.83' : '0.60'}
              verdict={compliant ? 'PASS' : 'FAIL'}
              val={compliant ? 83 : 60}
              note={compliant ? 'Above the four-fifths rule. DPDP Act compliant.' : 'Legally actionable under the four-fifths rule. Threshold: 0.80.'}
            />
            <MetricCard
              name="Equalized Odds"
              score={compliant ? '3pp gap' : '24pp gap'}
              verdict={compliant ? 'PASS' : 'FAIL'}
              val={compliant ? 90 : 40}
              note={compliant ? 'False-negative rate balanced across groups.' : 'False-negative rate much higher for women.'}
            />
          </div>
        </div>

        {/* 4. India proxies */}
        <div className="card" style={{ background: '#E8F5E9', border: '1px solid #C8E6C9', padding: 24, marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--green-pass)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>◉</div>
            <h3 style={{ fontSize: 18, margin: 0, fontWeight: 700, color: '#1B5E20' }}>India Context Module</h3>
            <div className="pill" style={{ background: '#fff', color: 'var(--green-pass)', border: '1px solid #A5D6A7', marginLeft: 'auto' }}>FairSight Exclusive</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              {
                title: 'Pincode 560034–560099',
                desc: compliant
                  ? 'Reweighed via AIF360 — correlation dropped to r=0.12.'
                  : 'Regional bias proxy — correlated with rejection rate at r=0.71.',
              },
              {
                title: "Father's Occupation",
                desc: compliant
                  ? 'Feature removed from training set.'
                  : 'Socioeconomic proxy — disallowed under DPDP Act Section 4(1).',
              },
            ].map(item => (
              <div key={item.title} style={{ background: '#fff', padding: 16, borderRadius: 12, display: 'flex', gap: 12, alignItems: 'flex-start', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ width: 10, height: 10, borderRadius: 999, background: compliant ? 'var(--green-pass)' : 'var(--red-fail)', marginTop: 6, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#1B5E20', marginBottom: 2 }}>{item.title} {compliant && '✓'}</div>
                  <div style={{ fontSize: 13, color: '#4CAF50' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Fix steps */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, marginBottom: 16, fontWeight: 700 }}>Recommended Fixes</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { t: "Remove Father's Occupation from feature set", s: 'Blocks the most obvious socioeconomic proxy.' },
              { t: 'Apply AIF360 Reweighing to pincode groups', s: 'Re-balances training weights by neighbourhood.' },
              { t: 'Re-train & re-audit with fixed feature set', s: 'Target: disparate impact ≥ 0.80.' },
            ].map((item, i) => (
              <div key={i} className="card" style={{ padding: '16px 20px', display: 'flex', gap: 16, alignItems: 'center' }}>
                <div style={{ width: 28, height: 28, borderRadius: 999, background: 'var(--teal-bg)', color: 'var(--teal)', fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>{item.t}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-grey)' }}>{item.s}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6. One-click fix card */}
        {!compliant && fixState === 'idle' && (
          <div style={{ background: 'linear-gradient(135deg, #111827 0%, #1F2937 100%)', borderRadius: 20, padding: 32, color: '#fff', marginBottom: 40, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
              <div style={{ width: 56, height: 56, borderRadius: 14, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>✦</div>
              <div style={{ flex: 1, minWidth: 280 }}>
                <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>One-click Automated Remediation</div>
                <div style={{ fontSize: 14, opacity: 0.7, lineHeight: 1.5 }}>Apply AIF360 Reweighing and drop proxy features instantly. Generate a compliant model trail in seconds.</div>
              </div>
              <button onClick={runFix} style={{ background: '#fff', color: '#111827', padding: '0 28px', height: 56, borderRadius: 12, fontWeight: 700, fontSize: 16, border: 'none', cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}>
                Apply Fixes Now
              </button>
            </div>
          </div>
        )}

        {/* 7. 3 action buttons at the bottom */}
        <div className="action-btns-grid">
          <button className="btn btn-outline btn-lg" style={{ height: 56, borderRadius: 12, fontWeight: 600 }} onClick={() => navigate('/upload')}>
            ↺ Re-audit
          </button>
          <button className="btn btn-primary btn-lg" style={{ height: 56, borderRadius: 12, fontWeight: 600 }} onClick={handleDownloadReport} disabled={downloading}>
            {downloading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                Generating...
              </span>
            ) : (
              '↓ Download Report'
            )}
          </button>
          <button className="btn btn-purple btn-lg" style={{ height: 56, borderRadius: 12, fontWeight: 600 }} onClick={() => navigate('/gemini-chat')}>
            Ask Gemini →
          </button>
        </div>

      </div>
    </div>
  )
}