import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const TIERS = [
  {
    name: 'Free', priceMonth: '₹0', priceAnnual: '₹0',
    subtitle: 'For first audits and evaluations',
    cta: 'Start free →', ctaVariant: 'outline',
    features: [
      ['Datasets up to 10,000 rows', true], ['3 audits per month', true],
      ['5 basic fairness metrics', true], ['India module: pincode only', true],
      ['Gemini explanations (3/mo)', true], ['PDF compliance report', false],
      ['Live bias monitoring', false], ['API access', false], ['Email support', true],
    ],
  },
  {
    name: 'Professional', priceMonth: '₹15,000', priceAnnual: '₹12,000',
    subtitle: 'For compliance teams shipping production AI',
    cta: 'Get Professional →', ctaVariant: 'primary', popular: true,
    features: [
      ['Unlimited dataset size', true], ['Unlimited audits', true],
      ['All 8+ fairness metrics', true], ['Full India module', true],
      ['Unlimited Gemini explanations', true], ['DPDP + EU AI Act PDF reports', true],
      ['Live bias monitoring', false], ['API · 1,000 calls/mo', true], ['Priority email support', true],
    ],
  },
  {
    name: 'Enterprise', priceMonth: '₹50,000+', priceAnnual: 'Contact sales',
    subtitle: 'For regulated industries & large orgs',
    cta: 'Contact sales →', ctaVariant: 'outline',
    features: [
      ['Unlimited dataset size', true], ['Unlimited audits', true],
      ['All 8+ metrics + custom', true], ['India module + custom proxies', true],
      ['Unlimited Gemini explanations', true], ['Custom-branded PDF reports', true],
      ['Live bias monitoring', true], ['Unlimited API access', true], ['Dedicated account manager', true],
    ],
  },
]

const FAQS = [
  ['Is the free tier truly free forever?', 'Yes. 3 audits per month, 5 fairness metrics, basic India module — no card needed, no trial clock.'],
  ['What file formats do you accept?', 'CSV, Excel (.xlsx), pickled scikit-learn models (.pkl), and ONNX (.onnx). Max 50 MB.'],
  ['Does FairSight store my data?', 'Only for the duration of the audit. Raw datasets are deleted within 24 hours. Results and metadata are retained.'],
  ['What is the India Context Module?', "A proprietary layer that detects caste, regional, and socioeconomic proxies unique to Indian datasets — pincodes, surnames, school names, father's occupation."],
  ['Can I get a refund?', 'Yes — 14-day refund, no questions asked, for all paid plans.'],
]

export default function Pricing() {
  const navigate = useNavigate()
  const [annual, setAnnual] = useState(true)
  const [openFaq, setOpenFaq] = useState(0)

  return (
    <div className="page-enter" style={{ background: '#fff', minHeight: 'calc(100vh - 64px)', padding: '48px 24px 80px' }}>
      <div className="container-med">
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--teal)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>PRICING</div>
          <h1 style={{ fontSize: 42, letterSpacing: '-0.02em', marginBottom: 12 }}>Simple, transparent pricing</h1>
          <p style={{ fontSize: 17, color: 'var(--text-grey)', maxWidth: 540, margin: '0 auto' }}>Start free. Upgrade when you need compliance documentation.</p>
        </div>

        {/* Toggle */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 40 }}>
          <div style={{ background: 'var(--bg-grey)', borderRadius: 999, padding: 4, display: 'inline-flex' }}>
            {['Monthly', 'Annual'].map((k, i) => {
              const active = (k === 'Annual') === annual
              return (
                <button key={k} onClick={() => setAnnual(i === 1)} style={{ padding: '8px 20px', borderRadius: 999, background: active ? '#fff' : 'transparent', boxShadow: active ? 'var(--shadow-card)' : 'none', color: active ? 'var(--text-dark)' : 'var(--text-grey)', fontSize: 13, fontWeight: 500, transition: 'all 200ms', cursor: 'pointer', border: 'none' }}>
                  {k}
                  {k === 'Annual' && <span style={{ marginLeft: 8, fontSize: 11, color: 'var(--teal)', fontWeight: 600 }}>Save 20%</span>}
                </button>
              )
            })}
          </div>
        </div>

        {/* Tier cards */}
        <div className="pricing-grid" style={{ marginBottom: 64 }}>
          {TIERS.map(t => (
            <div key={t.name} className="card" style={{ padding: 32, position: 'relative', border: t.popular ? '2px solid var(--teal)' : '1px solid var(--border)', boxShadow: t.popular ? '0 8px 32px rgba(15,118,110,0.2)' : 'var(--shadow-card)', transform: t.popular ? 'translateY(-8px)' : 'none' }}>
              {t.popular && (
                <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: 'var(--teal)', color: '#fff', padding: '5px 14px', borderRadius: 999, fontSize: 12, fontWeight: 600 }}>★ Most popular</div>
              )}
              <h3 style={{ fontSize: 18, marginBottom: 4 }}>{t.name}</h3>
              <p style={{ fontSize: 13, color: 'var(--text-grey)', marginBottom: 24, minHeight: 36 }}>{t.subtitle}</p>
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <div style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-0.02em' }}>{annual ? t.priceAnnual : t.priceMonth}</div>
                  {t.priceMonth !== '₹0' && t.priceAnnual !== 'Contact sales' && <div style={{ fontSize: 13, color: 'var(--text-grey)' }}>/ month</div>}
                </div>
                {annual && t.priceAnnual !== t.priceMonth && t.priceAnnual !== 'Contact sales' && <div style={{ fontSize: 12, color: 'var(--teal)', marginTop: 4 }}>Billed annually</div>}
              </div>
              <button className={`btn btn-${t.ctaVariant} btn-lg`} style={{ width: '100%', marginBottom: 24 }} onClick={() => t.name === 'Free' ? navigate('/sector') : null}>
                {t.cta}
              </button>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {t.features.map(([f, y]) => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: y ? 'var(--text-dark)' : 'var(--text-light)' }}>
                    <div style={{ width: 18, height: 18, borderRadius: 999, flexShrink: 0, background: y ? 'var(--teal-bg)' : '#F3F4F6', color: y ? 'var(--teal)' : 'var(--text-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>
                      {y ? '✓' : '✕'}
                    </div>
                    {f}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <h2 style={{ fontSize: 28, textAlign: 'center', marginBottom: 24 }}>Frequently asked</h2>
        <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 32 }}>
          {FAQS.map(([q, a], i) => (
            <div key={q} style={{ borderTop: i === 0 ? 'none' : '1px solid var(--border)' }}>
              <button onClick={() => setOpenFaq(openFaq === i ? -1 : i)} style={{ width: '100%', textAlign: 'left', padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 15, fontWeight: 500, color: 'var(--text-dark)', cursor: 'pointer', background: 'none', border: 'none', fontFamily: 'inherit' }}>
                {q}
                <span style={{ transform: openFaq === i ? 'rotate(180deg)' : 'none', transition: 'transform 300ms', color: 'var(--text-grey)', display: 'inline-block' }}>▾</span>
              </button>
              <div style={{ maxHeight: openFaq === i ? 200 : 0, overflow: 'hidden', transition: 'max-height 300ms' }}>
                <div style={{ padding: '0 24px 20px', fontSize: 14, color: 'var(--text-grey)', lineHeight: 1.55 }}>{a}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust row */}
        <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
          {['No credit card for free', 'Cancel anytime', 'DPDP Act compliant', 'Data never sold'].map(t => (
            <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-grey)' }}>
              <div style={{ width: 18, height: 18, borderRadius: 999, background: 'var(--teal-bg)', color: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>✓</div>
              {t}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}