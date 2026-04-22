import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Results.css'

// ── Stepper ───────────────────────────────────────────────────────────────────
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

// ── MetricCard ────────────────────────────────────────────────────────────────
function MetricCard({ name, score, verdict, breakdown, single, threshold, note }) {
  const pass = verdict === 'PASS'
  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <h4 style={{ fontSize: 15, flex: 1, margin: 0 }}>{name}</h4>
        <div style={{ fontSize: 18, fontWeight: 700, color: pass ? 'var(--green-pass)' : 'var(--red-fail)' }}>{score}</div>
        <div className={`pill ${pass ? 'pill-green' : 'pill-red'}`} style={{ fontWeight: 600 }}>{verdict}</div>
      </div>

      {breakdown && (
        <div style={{ marginBottom: 10 }}>
          {breakdown.map(b => (
            <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <div style={{ width: 180, fontSize: 12, color: 'var(--text-grey)', flexShrink: 0 }}>{b.label}</div>
              <div style={{ flex: 1, height: 8, background: '#F3F4F6', borderRadius: 999, position: 'relative', overflow: 'hidden' }}>
                <div style={{ width: `${b.val}%`, height: '100%', background: b.color, borderRadius: 999, transition: 'width 800ms' }} />
                {threshold && (
                  <div style={{ position: 'absolute', left: `${threshold}%`, top: -3, bottom: -3, width: 2, background: 'var(--orange)' }} />
                )}
              </div>
              <div style={{ width: 42, textAlign: 'right', fontSize: 12, fontWeight: 600, color: b.color }}>{b.val}%</div>
            </div>
          ))}
        </div>
      )}

      {single && (
        <div style={{ marginBottom: 10 }}>
          <div style={{ height: 10, background: '#F3F4F6', borderRadius: 999, position: 'relative', overflow: 'hidden' }}>
            <div style={{ width: `${single.val}%`, height: '100%', background: single.color, borderRadius: 999 }} />
            {threshold && (
              <div style={{ position: 'absolute', left: `${threshold}%`, top: -3, bottom: -3, width: 2, background: 'var(--orange)' }} />
            )}
          </div>
        </div>
      )}

      <div style={{ fontSize: 12, color: 'var(--text-grey)' }}>{note}</div>
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
  const [fixState, setFixState] = useState('idle') // idle | fixing | success | compliant
  const [fixStep, setFixStep] = useState(0)

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

  // KPI data
  const kpis = compliant
    ? [
        { v: '0',    l: 'metrics failed',       color: 'var(--green-pass)', bg: 'var(--green-bg)', delta: '−3' },
        { v: '0.83', l: 'disparate impact',      color: 'var(--green-pass)', bg: 'var(--green-bg)', delta: '+0.23' },
        { v: '4%',   l: 'parity gap (M vs W)',   color: 'var(--green-pass)', bg: 'var(--green-bg)', delta: '−24pp' },
        { v: '0',    l: 'India proxies remain',  color: 'var(--green-pass)', bg: 'var(--green-bg)', delta: '−2' },
      ]
    : [
        { v: '3',    l: 'metrics failed',        color: 'var(--red-fail)',   bg: 'var(--red-bg)' },
        { v: '0.60', l: 'disparate impact',      color: 'var(--orange)',     bg: '#FFF3E0' },
        { v: '28%',  l: 'parity gap (M vs W)',   color: 'var(--red-fail)',   bg: 'var(--red-bg)' },
        { v: '2',    l: 'India proxies flagged', color: 'var(--green-pass)', bg: 'var(--green-bg)' },
      ]

  return (
    <div className="page-enter" style={{ background: 'var(--bg-grey)', minHeight: 'calc(100vh - 64px)', paddingBottom: 80 }}>

      {/* Fix overlay */}
      <FixOverlay fixState={fixState} fixStep={fixStep} />

      {/* Verdict banner */}
      {compliant ? (
        <div className="page-enter" style={{ background: 'var(--green-bg)', borderBottom: '3px solid var(--green-pass)', padding: '24px 32px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ width: 52, height: 52, borderRadius: 12, background: 'var(--green-pass)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>✓</div>
            <div style={{ flex: 1, minWidth: 240 }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--green-pass)', letterSpacing: 0.3 }}>COMPLIANT</div>
              <div style={{ fontSize: 13, color: 'var(--green-pass)', opacity: 0.85 }}>Auto-remediated · XYZ Bank · Home Loan Approval v3.2-fixed · 18 Apr 2026</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <div className="pill pill-green">✓ All thresholds met</div>
              <div className="pill pill-teal">✦ AIF360 Reweighing applied</div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ background: 'var(--red-bg)', borderBottom: '3px solid var(--red-fail)', padding: '24px 32px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ width: 52, height: 52, borderRadius: 12, background: 'var(--red-fail)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>⚠</div>
            <div style={{ flex: 1, minWidth: 240 }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--red-fail)', letterSpacing: 0.3 }}>NON-COMPLIANT</div>
              <div style={{ fontSize: 13, color: 'var(--red-fail)', opacity: 0.85 }}>Immediate action required · XYZ Bank · Home Loan Approval v3.2 · 18 Apr 2026</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <div className="pill pill-red">⚠ 3 violations</div>
              <div className="pill pill-green">◉ 2 India proxies</div>
            </div>
          </div>
        </div>
      )}

      {/* One-click fix strip */}
      {!compliant && fixState === 'idle' && (
        <div style={{ maxWidth: 1100, margin: '24px auto 0', padding: '0 24px' }}>
          <div style={{ background: 'linear-gradient(135deg, #0F766E 0%, #134E4A 100%)', borderRadius: 16, padding: '24px 28px', color: '#fff', display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap', boxShadow: '0 12px 32px rgba(15,118,110,0.25)' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 22 }}>✦</div>
            <div style={{ flex: 1, minWidth: 280 }}>
              <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>One-click automated remediation</div>
              <div style={{ fontSize: 13, opacity: 0.85 }}>Apply AIF360 Reweighing + drop proxy features. Get a fixed CSV + compliance trail in seconds.</div>
            </div>
            <button onClick={runFix} style={{ background: '#fff', color: 'var(--teal)', padding: '0 22px', height: 48, borderRadius: 10, fontWeight: 600, fontSize: 15, display: 'inline-flex', alignItems: 'center', gap: 8, border: 'none', cursor: 'pointer' }}>
              ✦ Generate Fixed Dataset
            </button>
          </div>
        </div>
      )}

      {/* Fixed CSV download strip */}
      {compliant && (
        <div className="page-enter" style={{ maxWidth: 1100, margin: '24px auto 0', padding: '0 24px' }}>
          <div className="card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16, borderLeft: '4px solid var(--teal)' }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--teal-bg)', color: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>📄</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>home_loan_applicants_2015_2025_FIXED.csv</div>
              <div style={{ fontSize: 12, color: 'var(--text-grey)' }}>47,832 rows · reweighed · Father's Occupation removed · 8.4 MB</div>
            </div>
            <button className="btn btn-primary">↓ Download fixed CSV</button>
          </div>
        </div>
      )}

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px 0' }}>
        <Stepper active={3} />

        {/* KPI cards */}
        <div className="kpi-grid" style={{ marginBottom: 24 }}>
          {kpis.map(k => (
            <div key={k.l} className="card" style={{ padding: 20, position: 'relative' }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: k.bg, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                <div style={{ width: 8, height: 8, borderRadius: 999, background: k.color }} />
              </div>
              {k.delta && (
                <div style={{ position: 'absolute', top: 16, right: 16, fontSize: 11, fontWeight: 600, color: 'var(--green-pass)', background: 'var(--green-bg)', padding: '3px 8px', borderRadius: 999 }}>{k.delta}</div>
              )}
              <div style={{ fontSize: 28, fontWeight: 700, color: k.color, lineHeight: 1, letterSpacing: '-0.02em' }}>{k.v}</div>
              <div style={{ fontSize: 13, color: 'var(--text-grey)', marginTop: 4 }}>{k.l}</div>
            </div>
          ))}
        </div>

        {/* Metrics */}
        <h2 style={{ fontSize: 18, marginBottom: 12 }}>
          Fairness metrics
          {compliant && <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--green-pass)', marginLeft: 8 }}>· post-remediation</span>}
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
          <MetricCard
            name="Demographic Parity"
            score={compliant ? '0.84' : '0.43'}
            verdict={compliant ? 'PASS' : 'FAIL'}
            breakdown={compliant
              ? [{ label: 'Men', val: 69, color: 'var(--teal)' }, { label: 'Women', val: 65, color: 'var(--green-pass)' }]
              : [{ label: 'Men', val: 71, color: 'var(--teal)' }, { label: 'Women', val: 43, color: 'var(--red-fail)' }]}
            threshold={80}
            note={compliant ? 'Parity gap closed to 4pp. Meets EU AI Act threshold.' : 'Women approved 28% less often. EU AI Act requires parity above 80%.'}
          />
          <MetricCard
            name="Disparate Impact"
            score={compliant ? '0.83' : '0.60'}
            verdict={compliant ? 'PASS' : 'FAIL'}
            single={{ val: compliant ? 83 : 60, color: compliant ? 'var(--green-pass)' : 'var(--red-fail)' }}
            threshold={80}
            note={compliant ? 'Above the four-fifths rule. DPDP Act compliant.' : 'Legally actionable under the four-fifths rule. Threshold: 0.80.'}
          />
          <MetricCard
            name="Equalized Odds"
            score={compliant ? '3pp gap' : '24pp gap'}
            verdict={compliant ? 'PASS' : 'FAIL'}
            breakdown={compliant
              ? [{ label: 'Men wrongly rejected', val: 10, color: 'var(--teal)' }, { label: 'Women wrongly rejected', val: 13, color: 'var(--green-pass)' }]
              : [{ label: 'Men wrongly rejected', val: 9, color: 'var(--teal)' }, { label: 'Women wrongly rejected', val: 34, color: 'var(--red-fail)' }]}
            note={compliant ? 'False-negative rate balanced across groups.' : 'False-negative rate much higher for women.'}
          />
          <MetricCard
            name="Calibration"
            score="0.88"
            verdict="PASS"
            single={{ val: 88, color: 'var(--green-pass)' }}
            note="Predictions calibrated across groups."
          />
          <MetricCard
            name="Individual Fairness"
            score="0.82"
            verdict="PASS"
            single={{ val: 82, color: 'var(--green-pass)' }}
            note="Similar applicants receive similar outcomes."
          />
        </div>

        {/* India module */}
        <div className="card" style={{ background: 'var(--green-bg)', border: '1px solid #A5D6A7', padding: 20, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--green-pass)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>◉</div>
            <h3 style={{ fontSize: 16, margin: 0 }}>India Context Module</h3>
            <div className="pill" style={{ background: '#fff', color: 'var(--green-pass)', border: '1px solid #A5D6A7' }}>Unique to FairSight</div>
          </div>
          <div className="india-module-grid">
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
              <div key={item.title} style={{ background: '#fff', padding: 14, borderRadius: 10, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div style={{ width: 8, height: 8, borderRadius: 999, background: compliant ? 'var(--green-pass)' : 'var(--red-fail)', marginTop: 6, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{item.title} {compliant && '✓'}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-grey)' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gemini explanation */}
        <div className="card" style={{ padding: 20, borderLeft: '4px solid var(--purple)', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--purple-bg)', color: 'var(--purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>G</div>
            <h3 style={{ fontSize: 16, margin: 0 }}>Gemini explanation</h3>
            <div className="pill pill-orange" style={{ marginLeft: 'auto' }}>AI-generated · verify</div>
          </div>
          {compliant ? (
            <p style={{ fontSize: 14, color: 'var(--text-grey)', lineHeight: 1.6, margin: 0 }}>
              Remediation complete. After applying AIF360 Reweighing to the pincode groups and dropping <b style={{ color: 'var(--text-dark)' }}>Father's Occupation</b>, the model now scores women and men with equivalent income &amp; credit history within 4 percentage points of each other. The previously flagged applicant <b style={{ color: 'var(--text-dark)' }}>Priya Sharma</b> re-scored from <b>0.43</b> to <b style={{ color: 'var(--green-pass)' }}>0.52</b>.
            </p>
          ) : (
            <p style={{ fontSize: 14, color: 'var(--text-grey)', lineHeight: 1.6, margin: 0 }}>
              Your Home Loan Approval v3.2 model systematically rejects women at 28 percentage points higher than identically-qualified men. The root cause is <b style={{ color: 'var(--text-dark)' }}>pincode</b>: neighbourhoods 560034–560099 are predominantly women-led households, and the model has learned to penalise them indirectly. <b style={{ color: 'var(--text-dark)' }}>Priya Sharma</b>, a 28-year-old software engineer, was scored <b>0.43</b> vs a man with identical income and credit history scored <b>0.51</b>. The gap is entirely pincode-driven.
            </p>
          )}
        </div>

        {/* Remediation plan / trail */}
        {compliant ? (
          <div className="card page-enter" style={{ background: 'var(--green-bg)', border: '1px solid #A5D6A7', padding: 20, marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <h3 style={{ fontSize: 16, color: '#1B5E20', margin: 0 }}>Applied automated fixes</h3>
              <div className="pill pill-green" style={{ marginLeft: 'auto' }}>✓ Logged for audit</div>
            </div>
            <p style={{ fontSize: 13, color: '#2E7D32', marginBottom: 14 }}>These actions are recorded in the Compliance Report as your DPDP Act legal trail.</p>
            {[
              ["Dropped feature: Father's Occupation", 'DPDP Act § 4(1) — socioeconomic proxy removed from training set.'],
              ['AIF360 Reweighing on pincode groups', 'Re-balanced training weights across 47,832 rows in 8 neighbourhood clusters.'],
              ['Automated re-audit against all 8 metrics', '3 of 3 failing metrics now PASS — disparate impact 0.60 → 0.83.'],
            ].map(([t, s], i) => (
              <div key={t} style={{ display: 'flex', gap: 12, padding: '10px 0', borderTop: i === 0 ? 'none' : '1px solid #C8E6C9' }}>
                <div style={{ width: 24, height: 24, borderRadius: 999, background: 'var(--green-pass)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 13 }}>✓</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#1B5E20' }}>{t}</div>
                  <div style={{ fontSize: 12, color: '#2E7D32' }}>{s}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card" style={{ background: '#E3F2FD', border: '1px solid #90CAF9', padding: 20, marginBottom: 24 }}>
            <h3 style={{ fontSize: 16, marginBottom: 4, color: '#0D47A1', margin: 0 }}>Remediation plan</h3>
            <p style={{ fontSize: 13, color: '#1565C0', margin: '8px 0 14px' }}>Apply in order. Expected improvement: 0.60 → 0.83 disparate impact.</p>
            {[
              ["Remove Father's Occupation from feature set", 'Blocks the most obvious socioeconomic proxy.'],
              ['Apply AIF360 Reweighing to pincode groups', 'Re-balances training weights by neighbourhood.'],
              ['Re-train & re-audit with fixed feature set', 'Target: disparate impact ≥ 0.80.'],
            ].map(([t, s], i) => (
              <div key={t} style={{ display: 'flex', gap: 12, padding: '10px 0', borderTop: i === 0 ? 'none' : '1px solid #BBDEFB' }}>
                <div style={{ width: 24, height: 24, borderRadius: 999, background: '#fff', color: '#0D47A1', fontWeight: 700, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#0D47A1' }}>{t}</div>
                  <div style={{ fontSize: 12, color: '#1565C0' }}>{s}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action buttons */}
        <div className="action-btns-grid">
          <button className="btn btn-purple btn-lg" onClick={() => navigate('/gemini-chat')}>
            G Ask Gemini →
          </button>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/report')}>
            ↓ {compliant ? 'Download compliance report' : 'Download PDF'}
          </button>
          {compliant ? (
            <button className="btn btn-outline btn-lg" onClick={() => { setFixState('idle'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
              ↺ View original audit
            </button>
          ) : (
            <button className="btn btn-outline btn-lg" onClick={() => navigate('/upload')}>
              ↺ Re-audit with fixed model
            </button>
          )}
        </div>
      </div>
    </div>
  )
}