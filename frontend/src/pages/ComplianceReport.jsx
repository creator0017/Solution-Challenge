import { useNavigate } from 'react-router-dom'

export default function ComplianceReport() {
  const navigate = useNavigate()
  const fixed = false // set to true to show remediated state

  return (
    <div className="page-enter" style={{ background: 'var(--bg-grey)', minHeight: 'calc(100vh - 64px)', paddingBottom: 80 }}>
      <div className="container-chat" style={{ padding: '32px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <span onClick={() => navigate('/results')} style={{ color: 'var(--teal)', fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
            ← Back
          </span>
          <h1 style={{ fontSize: 22 }}>Compliance Report</h1>
          <button className="btn btn-primary" style={{ height: 38 }}>↓ Download PDF</button>
        </div>
        <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-grey)', marginBottom: 24 }}>
          Auto-generated · DPDP Act + EU AI Act aligned
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {/* Report header */}
          <div style={{ background: 'var(--text-dark)', color: '#fff', padding: '24px 28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 4 }}>FairSight AI · Official Audit Report</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>Home Loan Approval v3.2 — Bias Audit{fixed && <span style={{ color: '#4ADE80' }}> (Remediated)</span>}</div>
                <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 4 }}>Report #FSA-2026-04-18-0471 · Generated 18 Apr 2026, 11:24 IST</div>
              </div>
              <div style={{ padding: '8px 14px', borderRadius: 999, background: fixed ? 'var(--green-pass)' : 'var(--red-fail)', color: '#fff', fontWeight: 700, fontSize: 12, letterSpacing: 0.5 }}>
                {fixed ? 'COMPLIANT' : 'NON-COMPLIANT'}
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div style={{ padding: 28, borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, fontSize: 13 }}>
              {[['Organisation', 'XYZ Bank Ltd.'], ['Model', 'Home Loan Approval v3.2'], ['Dataset', '47,832 applicants (2015–2025)'], ['Sector', 'Banking & Credit'], ['India proxies', '2 detected'], ['Audit date', '18 Apr 2026']].map(([k, v]) => (
                <div key={k}>
                  <div style={{ fontSize: 11, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>{k}</div>
                  <div style={{ fontWeight: 500 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Metrics table */}
          <div style={{ padding: 28, borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: 15, marginBottom: 14 }}>Fairness metrics</h3>
            <div style={{ border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', fontSize: 12, background: 'var(--bg-grey)', fontWeight: 600, color: 'var(--text-grey)', textTransform: 'uppercase', letterSpacing: 0.6 }}>
                {['Metric', 'Score', 'Threshold', 'Verdict'].map(h => <div key={h} style={{ padding: '10px 14px' }}>{h}</div>)}
              </div>
              {[
                ['Demographic Parity', '0.43', '≥ 0.80', 'FAIL'],
                ['Disparate Impact', '0.60', '≥ 0.80', 'FAIL'],
                ['Equalized Odds', '24pp gap', '≤ 10pp', 'FAIL'],
                ['Calibration', '0.88', '≥ 0.85', 'PASS'],
                ['Individual Fairness', '0.82', '≥ 0.80', 'PASS'],
              ].map((r, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', fontSize: 13, borderTop: '1px solid var(--border)' }}>
                  <div style={{ padding: '10px 14px', fontWeight: 500 }}>{r[0]}</div>
                  <div style={{ padding: '10px 14px' }}>{r[1]}</div>
                  <div style={{ padding: '10px 14px', color: 'var(--text-grey)' }}>{r[2]}</div>
                  <div style={{ padding: '10px 14px' }}>
                    <span className={`pill ${r[3] === 'PASS' ? 'pill-green' : 'pill-red'}`}>{r[3]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* India proxies */}
          <div style={{ padding: 28, borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: 15, marginBottom: 12 }}>India context proxies</h3>
            {[
              ['Pincode 560034–560099', 'Regional bias proxy · r=0.71 with rejection'],
              ["Father's Occupation", 'Socioeconomic proxy · disallowed under DPDP Act §4(1)'],
            ].map(([t, s]) => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', fontSize: 13 }}>
                <div style={{ width: 10, height: 10, borderRadius: 999, background: 'var(--red-fail)' }}/>
                <div style={{ fontWeight: 500, flex: 1 }}>{t}</div>
                <div style={{ color: 'var(--text-grey)' }}>{s}</div>
              </div>
            ))}
          </div>

          {/* Legal violations */}
          <div style={{ padding: 28, background: '#FFF5F5', borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: 15, marginBottom: 12, color: 'var(--red-fail)' }}>Legal violations</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                ['DPDP Act · Section 4(1)', 'Data Fiduciaries must ensure lawful processing. Using neighbourhood pincode as a de-facto protected-class filter fails this test.'],
                ['EU AI Act · Article 10(3)', 'High-risk AI systems must demonstrate statistical fairness across protected groups. Disparate impact of 0.60 falls below the 0.80 threshold.'],
              ].map(([t, s]) => (
                <div key={t} style={{ background: '#fff', padding: 14, borderRadius: 10, border: '1px solid #FFCDD2' }}>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4, color: 'var(--red-fail)' }}>{t}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-grey)', lineHeight: 1.55 }}>{s}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Remediation */}
          <div style={{ padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ fontSize: 15 }}>Remediation steps</h3>
              <div className="pill pill-orange">⏱ 30-day deadline under DPDP Act</div>
            </div>
            {[
              ["Remove Father's Occupation from feature set", 'Blocks socioeconomic proxy. Expected -0.08 accuracy impact.'],
              ['Apply AIF360 Reweighing to pincode groups', 'Re-balances weights by neighbourhood cohort.'],
              ['Re-train & re-audit with fixed feature set', 'Target: disparate impact ≥ 0.80.'],
            ].map(([t, s], i) => (
              <div key={t} style={{ display: 'flex', gap: 14, padding: '12px 0', borderTop: i === 0 ? 'none' : '1px solid var(--border)' }}>
                <div style={{ width: 28, height: 28, borderRadius: 999, background: 'var(--teal-bg)', color: 'var(--teal)', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{t}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-grey)' }}>{s}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 20 }}>
          <button className="btn btn-primary">↓ Download PDF</button>
          <button className="btn btn-outline">⎘ Copy share link</button>
          <button className="btn btn-outline" onClick={() => navigate('/results')}>Back to results</button>
        </div>
      </div>
    </div>
  )
}