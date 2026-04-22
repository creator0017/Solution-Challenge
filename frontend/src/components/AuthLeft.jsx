// Shared left panel used by Login and Register pages
export default function AuthLeft() {
  return (
    <div style={{ background: 'var(--teal)', color: '#fff', padding: '48px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '100vh' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 48 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <circle cx="11" cy="11" r="8" stroke="white" strokeWidth="1.8"/>
              <circle cx="11" cy="11" r="3" fill="white"/>
              <path d="M11 3v8" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </div>
          <div style={{ fontWeight: 700, fontSize: 18 }}>FairSight AI</div>
        </div>

        <div style={{ fontSize: 28, fontWeight: 700, lineHeight: 1.2, marginBottom: 32, letterSpacing: '-0.02em' }}>
          Making AI fair for<br/>every Indian.
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {[
            ['Detect bias in 60 seconds', 'Upload CSV. Get a plain-English audit.'],
            ['India caste proxy detection', 'Pincode, surname & school name scans.'],
            ['DPDP Act compliance reports', 'Submit to RBI or court directly.'],
          ].map(([t, s]) => (
            <div key={t} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ width: 22, height: 22, borderRadius: 999, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{t}</div>
                <div style={{ fontSize: 13, opacity: 0.7 }}>{s}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 40, padding: 24, background: 'rgba(255,255,255,0.08)', borderRadius: 16 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 100 }}>
            {[36, 58, 44, 80, 30].map((h, i) => (
              <div key={i} style={{ flex: 1, height: `${h}%`, background: i === 3 ? '#FCA5A5' : 'rgba(255,255,255,0.6)', borderRadius: 4, position: 'relative' }}>
                {i === 3 && (
                  <div style={{ position: 'absolute', top: -22, left: '50%', transform: 'translateX(-50%)', width: 18, height: 18, borderRadius: 999, background: '#C62828', color: '#fff', fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>!</div>
                )}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 12, marginTop: 12, opacity: 0.75 }}>Outlier: Women rejection rate — 34% vs Men 9%</div>
        </div>
      </div>

      <div>
        <div style={{ fontSize: 12, opacity: 0.65, marginBottom: 12 }}>Trusted by compliance teams across India</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['XYZ Bank', 'FinCorp', 'HealthMed'].map(n => (
            <div key={n} style={{ padding: '6px 12px', borderRadius: 999, background: 'rgba(255,255,255,0.12)', fontSize: 12, fontWeight: 500 }}>{n}</div>
          ))}
        </div>
      </div>
    </div>
  )
}
