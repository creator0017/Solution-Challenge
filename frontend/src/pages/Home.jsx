import { useNavigate } from 'react-router-dom'

// ── Audit mockup card shown in hero ──────────────────────────────────────────
function AuditMockupCard({ style, ghost }) {
  return (
    <div className="card" style={{ width: 440, maxWidth: '100%', padding: 0, overflow: 'hidden', boxShadow: ghost ? 'var(--shadow-card)' : '0 20px 60px rgba(15,42,38,0.15), 0 8px 24px rgba(15,42,38,0.08)', ...style }}>
      <div style={{ background: 'var(--red-bg)', borderBottom: '3px solid var(--red-fail)', padding: '14px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--red-fail)', fontWeight: 700, fontSize: 13, letterSpacing: 0.5 }}>
          ⚠ NON-COMPLIANT
        </div>
        <div style={{ fontSize: 11, color: 'var(--red-fail)', opacity: 0.8, marginTop: 2 }}>XYZ Bank · Home Loan Approval v3.2</div>
      </div>
      <div style={{ padding: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
          {[['3', 'metrics failed', 'var(--red-fail)'], ['0.60', 'disparate impact', 'var(--orange)'], ['28%', 'parity gap', 'var(--red-fail)'], ['2', 'India proxies', 'var(--green-pass)']].map(([big, lbl, color]) => (
            <div key={lbl} style={{ background: 'var(--bg-grey)', padding: 12, borderRadius: 10 }}>
              <div style={{ fontSize: 22, fontWeight: 700, color }}>{big}</div>
              <div style={{ fontSize: 11, color: 'var(--text-grey)' }}>{lbl}</div>
            </div>
          ))}
        </div>
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
            <span style={{ fontWeight: 500 }}>Demographic Parity</span>
            <span className="pill pill-red" style={{ padding: '2px 8px', fontSize: 10 }}>FAIL</span>
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            <div style={{ flex: 0.71, height: 8, background: 'var(--teal)', borderRadius: 4 }}/>
            <div style={{ flex: 0.29, height: 8, background: '#F3F4F6', borderRadius: 4, position: 'relative' }}>
              <div style={{ position: 'absolute', left: '60%', top: -2, height: 12, width: 2, background: 'var(--orange)' }}/>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-light)', marginTop: 4 }}>
            <span>Men 71%</span><span>Women 43%</span><span>Threshold 80%</span>
          </div>
        </div>
        <div style={{ background: 'var(--purple-bg)', border: '1px solid #E1BEE7', borderLeft: '4px solid var(--purple)', padding: 12, borderRadius: 10, fontSize: 12, lineHeight: 1.5 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, color: 'var(--purple)', marginBottom: 4 }}>
            ✦ Gemini explanation
          </div>
          <span style={{ color: 'var(--text-grey)' }}>Pincode <b style={{ color: 'var(--text-dark)' }}>560034–560099</b> acts as a regional proxy. Priya's loan was rejected at 0.43 vs Men's identical profile at 0.51.</span>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="page-enter">
      {/* ── HERO ── */}
      <section style={{ minHeight: '90vh', background: '#fff', position: 'relative', overflow: 'hidden', padding: '64px 32px 80px' }}>
        <div style={{ position: 'absolute', top: -160, right: -160, width: 480, height: 480, borderRadius: 999, background: 'radial-gradient(circle, rgba(15,118,110,0.08) 0%, rgba(15,118,110,0) 70%)', pointerEvents: 'none' }}/>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: 64, alignItems: 'center' }}>
          <div>
            <div className="pill pill-teal" style={{ marginBottom: 20 }}>
              ✦ Solution Challenge 2026 · Build with AI
            </div>
            <h1 style={{ fontSize: 'clamp(40px, 5vw, 60px)', lineHeight: 1.05, letterSpacing: '-0.025em', marginBottom: 24 }}>
              Your AI is <span className="hl-underline">biased.</span><br/>
              Do you know by how much?
            </h1>
            <p style={{ fontSize: 18, color: 'var(--text-grey)', lineHeight: 1.55, marginBottom: 32, maxWidth: 520 }}>
              Upload your dataset. Get a bias audit in 60 seconds — in plain English, with fix code and a compliance PDF. No Python, no data science required.
            </p>
            <div style={{ display: 'flex', gap: 12, marginBottom: 40, flexWrap: 'wrap' }}>
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/sector')}>Start free audit →</button>
              <button className="btn btn-outline btn-lg">See how it works</button>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-light)', marginBottom: 12, letterSpacing: 0.8, textTransform: 'uppercase', fontWeight: 600 }}>Built with</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['Google Gemini 1.5 Pro', 'Firebase', 'IBM AIF360', 'Python'].map(t => (
                <div key={t} style={{ padding: '6px 12px', borderRadius: 999, background: 'var(--bg-grey)', border: '1px solid var(--border)', fontSize: 12, fontWeight: 500, color: 'var(--text-grey)' }}>{t}</div>
              ))}
            </div>
          </div>
          <div style={{ position: 'relative', minHeight: 460 }}>
            <AuditMockupCard style={{ position: 'absolute', top: 40, left: 40, right: 0, transform: 'rotate(2deg)', opacity: 0.35, filter: 'blur(0.3px)' }} ghost />
            <AuditMockupCard style={{ position: 'relative', transform: 'rotate(-2deg)', zIndex: 2 }} />
          </div>
        </div>
      </section>

      {/* ── PROBLEM STATS ── */}
      <section style={{ background: 'var(--bg-grey)', padding: '80px 32px' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--teal)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>THE PROBLEM</div>
            <h2 style={{ fontSize: 36, letterSpacing: '-0.02em' }}>AI is everywhere. Bias audits aren't.</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {[
              { big: '85%', lbl: 'of businesses never audit their AI', color: 'var(--red-fail)', bigSize: 72 },
              { big: '35–60%', lbl: 'of ML models show measurable bias', color: 'var(--orange)', bigSize: 64 },
              { big: '18 months', lbl: 'average bias lawsuit duration', color: 'var(--teal)', bigSize: 48 },
            ].map(s => (
              <div key={s.lbl} className="card" style={{ padding: 32, textAlign: 'center' }}>
                <div style={{ fontSize: s.bigSize, fontWeight: 700, color: s.color, letterSpacing: '-0.03em', lineHeight: 1 }}>{s.big}</div>
                <div style={{ color: 'var(--text-grey)', fontSize: 15, marginTop: 12, lineHeight: 1.4 }}>{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: '96px 32px', background: '#fff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--teal)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>HOW IT WORKS</div>
            <h2 style={{ fontSize: 36, letterSpacing: '-0.02em' }}>From messy data to fair AI in 4 steps</h2>
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: 32, left: '12.5%', right: '12.5%', height: 2, borderTop: '2px dashed #D1D5DB', zIndex: 0 }}/>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, position: 'relative', zIndex: 1 }}>
              {[
                { n: 1, title: 'Upload', body: 'CSV, Excel, .pkl or .onnx — no Python, no data-science prerequisites.', badge: null },
                { n: 2, title: 'Bias detected', body: 'AIF360 runs 8+ fairness metrics across every protected attribute.', badge: null },
                { n: 3, title: 'India context', body: "Pincode, surname, father's occupation & school-name proxies.", badge: 'Unique to FairSight' },
                { n: 4, title: 'Fix & report', body: 'Gemini explains, writes Python fix code, generates compliance PDF.', badge: null },
              ].map(s => (
                <div key={s.n} className="card" style={{ padding: 28, transition: 'transform 200ms, box-shadow 200ms' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lift)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--teal-bg)', color: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700 }}>{s.n}</div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-light)', letterSpacing: 1 }}>STEP {s.n}</div>
                  </div>
                  <h3 style={{ fontSize: 18, marginBottom: 8 }}>{s.title}</h3>
                  <p style={{ fontSize: 14, color: 'var(--text-grey)', lineHeight: 1.55 }}>{s.body}</p>
                  {s.badge && <div className="pill pill-green" style={{ marginTop: 12 }}>✓ {s.badge}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTORS ── */}
      <section style={{ padding: '80px 32px', background: 'var(--bg-grey)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--teal)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>SECTORS</div>
              <h2 style={{ fontSize: 36, letterSpacing: '-0.02em' }}>Built for high-stakes decisions</h2>
            </div>
            <button className="btn btn-outline" onClick={() => navigate('/sector')}>See all sectors →</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {[
              { name: 'Banking & Credit', desc: 'Loan approval, credit scoring, KYC risk. DPDP Act + EU AI Act aligned.', tags: ['DPDP Act', 'Disparate impact'] },
              { name: 'Hiring & HR', desc: 'Resume screeners, candidate ranking. EEOC-aligned for multinationals.', tags: ['EEOC', 'Surname bias'] },
              { name: 'Healthcare', desc: 'Diagnostic parity across rural vs urban demographics, caste proxies.', tags: ['Parity', 'Regional'] },
              { name: 'Education', desc: 'Admissions, exam grading, scholarship selection. Income proxy checks.', tags: ['Admissions', 'Income proxy'] },
            ].map(s => (
              <div key={s.name} className="card" style={{ padding: 24, cursor: 'pointer', transition: 'all 200ms' }}
                onClick={() => navigate('/sector')}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--teal)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-hover)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--teal-bg)', color: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, fontSize: 22 }}>
                  {s.name === 'Banking & Credit' ? '🏦' : s.name === 'Hiring & HR' ? '💼' : s.name === 'Healthcare' ? '🏥' : '🎓'}
                </div>
                <h3 style={{ fontSize: 17, marginBottom: 6 }}>{s.name}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-grey)', lineHeight: 1.5, marginBottom: 14 }}>{s.desc}</p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                  {s.tags.map(t => <div key={t} className="pill pill-grey">{t}</div>)}
                </div>
                <div style={{ color: 'var(--teal)', fontSize: 13, fontWeight: 500 }}>Start {s.name.split(' ')[0].toLowerCase()} audit →</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── KEY FEATURES ── */}
      <section style={{ padding: '96px 32px', background: '#fff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--teal)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>KEY FEATURES</div>
            <h2 style={{ fontSize: 36, letterSpacing: '-0.02em', marginBottom: 12 }}>Everything existing tools are missing</h2>
            <p style={{ color: 'var(--text-grey)', fontSize: 16, maxWidth: 560, margin: '0 auto' }}>IBM AIF360 gives you numbers. Google's What-If Tool needs Python. FairSight is the first end-to-end workflow built for Indian compliance teams.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
            {[
              { title: 'India Context Module', body: "Caste-proxy detection via surnames, pincodes, school names, father's occupation. No other tool does this.", badge: 'Globally unique', tone: 'teal' },
              { title: 'Gemini AI explanations', body: 'Every metric explained in plain English. Your compliance officer understands. No data science team needed.', badge: 'Powered by Gemini 1.5 Pro', tone: 'purple' },
              { title: '8+ fairness metrics', body: 'Demographic parity, disparate impact, equalized odds, calibration, individual fairness — the EU AI Act gold standard.', badge: null, tone: 'teal' },
              { title: 'DPDP Act compliance PDF', body: 'Auto-generated legal-grade report. Submit directly to RBI, auditors, or the court. Takes seconds, not weeks.', badge: null, tone: 'teal' },
            ].map(f => (
              <div key={f.title} className="card" style={{ padding: 28, display: 'flex', gap: 18 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, flexShrink: 0, background: f.tone === 'purple' ? 'var(--purple-bg)' : 'var(--teal-bg)', color: f.tone === 'purple' ? 'var(--purple)' : 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                  {f.tone === 'purple' ? '✦' : '◎'}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 17, marginBottom: 6 }}>{f.title}</h3>
                  <p style={{ fontSize: 14, color: 'var(--text-grey)', lineHeight: 1.55, marginBottom: f.badge ? 10 : 0 }}>{f.body}</p>
                  {f.badge && <div className={`pill ${f.tone === 'purple' ? 'pill-purple' : 'pill-teal'}`}>✦ {f.badge}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPARISON ── */}
      <section style={{ padding: '80px 32px', background: 'var(--bg-grey)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--teal)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>COMPARISON</div>
            <h2 style={{ fontSize: 36, letterSpacing: '-0.02em' }}>Why teams choose FairSight</h2>
          </div>
          <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.2fr', fontSize: 13 }}>
              {['Feature', 'IBM AIF360', 'What-If Tool', 'FairSight AI'].map((h, i) => (
                <div key={h} style={{ padding: '20px 24px', fontWeight: i === 3 ? 700 : 600, textAlign: i > 0 ? 'center' : 'left', color: i === 3 ? 'var(--teal)' : 'var(--text-grey)', fontSize: 12, letterSpacing: 0.8, textTransform: 'uppercase', background: i === 3 ? 'var(--teal-bg)' : '#fff', borderLeft: i === 3 ? '1px solid var(--teal-border)' : 'none', borderRight: i === 3 ? '1px solid var(--teal-border)' : 'none' }}>{h}</div>
              ))}
              {[
                ['Plain-language bias reports', false, false, true],
                ['No-code dataset upload', false, true, true],
                ['Automatic fix recommendations', false, false, true],
                ['DPDP Act compliance PDF', false, false, true],
                ['India context (caste / pincode)', false, false, true],
                ['Live bias monitoring', false, false, true],
                ['Free tier', true, true, true],
              ].map((r, i) => (
                <>
                  <div key={`${i}f`} style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', fontWeight: 500 }}>{r[0]}</div>
                  {[r[1], r[2], r[3]].map((yes, j) => (
                    <div key={`${i}${j}`} style={{ padding: '16px 24px', borderTop: `1px solid ${j === 2 ? 'var(--teal-border)' : 'var(--border)'}`, background: j === 2 ? 'var(--teal-bg)' : 'transparent', borderLeft: j === 2 ? '1px solid var(--teal-border)' : 'none', borderRight: j === 2 ? '1px solid var(--teal-border)' : 'none', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      {yes
                        ? <div style={{ width: 24, height: 24, borderRadius: 999, background: j === 2 ? 'var(--teal)' : '#E5E7EB', color: j === 2 ? '#fff' : 'var(--text-grey)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>✓</div>
                        : <div style={{ color: '#D1D5DB', fontSize: 18 }}>✕</div>}
                    </div>
                  ))}
                </>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA STRIP ── */}
      <section style={{ padding: '80px 32px', background: '#fff' }}>
        <div className="container">
          <div style={{ background: 'var(--text-dark)', color: '#fff', padding: '56px 48px', borderRadius: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 32, flexWrap: 'wrap', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', right: -80, top: -80, width: 280, height: 280, borderRadius: 999, background: 'radial-gradient(circle, rgba(15,118,110,0.4) 0%, rgba(15,118,110,0) 70%)', pointerEvents: 'none' }}/>
            <div style={{ zIndex: 2, maxWidth: 560 }}>
              <h2 style={{ color: '#fff', fontSize: 32, marginBottom: 12, letterSpacing: '-0.02em' }}>See your first bias report in 60 seconds.</h2>
              <p style={{ color: '#9CA3AF', fontSize: 16 }}>No credit card. 3 free audits every month. DPDP-ready.</p>
            </div>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/sector')} style={{ zIndex: 2 }}>Start free audit →</button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-cols">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div className="logomark"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="white" strokeWidth="1.5"/><circle cx="8" cy="8" r="2" fill="white"/></svg></div>
                <div className="brand" style={{ color: '#fff' }}>FairSight AI</div>
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.6, maxWidth: 280 }}>India's first no-code AI bias detection platform. Built for DPDP Act compliance.</p>
              <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                {['𝕏', 'in', '⌥'].map(s => <div key={s} style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 14 }}>{s}</div>)}
              </div>
            </div>
            <div>
              <h4>Product</h4>
              {['How it works', 'Sectors', 'Pricing', 'API docs'].map(l => <a key={l}>{l}</a>)}
            </div>
            <div>
              <h4>Company</h4>
              {['About', 'Blog', 'Careers', 'Contact'].map(l => <a key={l}>{l}</a>)}
            </div>
            <div>
              <h4>Legal</h4>
              {['Privacy policy', 'Terms of service', 'DPDP compliance', 'Cookie policy'].map(l => <a key={l}>{l}</a>)}
            </div>
          </div>
          <div className="footer-bottom" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <span>© 2026 FairSight AI · Built at SVIT Bengaluru · Solution Challenge 2026</span>
            <span>Made with ♥ for fair AI in India</span>
          </div>
        </div>
      </footer>
    </div>
  )
}