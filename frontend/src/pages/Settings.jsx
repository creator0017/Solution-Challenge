import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Section({ title, children }) {
  return (
    <div className="card" style={{ padding: 28, marginBottom: 16 }}>
      <h3 style={{ fontSize: 17, marginBottom: 16 }}>{title}</h3>
      {children}
    </div>
  )
}

function ToggleRow({ label, desc, on, setOn }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderTop: '1px solid var(--border)' }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: 12, color: 'var(--text-grey)' }}>{desc}</div>
      </div>
      <div className={`toggle ${on ? 'on' : ''}`} onClick={() => setOn(!on)} />
    </div>
  )
}

export default function Settings() {
  const navigate = useNavigate()
  const [notif, setNotif] = useState({ complete: true, drift: true, reaudit: false })
  const [keyVisible, setKeyVisible] = useState(false)

  return (
    <div className="page-enter" style={{ background: 'var(--bg-grey)', minHeight: 'calc(100vh - 64px)', padding: '32px 24px 80px' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <span onClick={() => navigate('/home')} style={{ color: 'var(--teal)', fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer', marginBottom: 12 }}>
          ← Back
        </span>
        <h1 style={{ fontSize: 28, marginBottom: 20 }}>Settings</h1>

        <Section title="Profile">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            <div><label className="label">First name</label><input className="input" defaultValue="Meera" /></div>
            <div><label className="label">Last name</label><input className="input" defaultValue="Sharma" /></div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label className="label">Organisation</label>
            <input className="input" defaultValue="XYZ Bank Ltd." />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label className="label">Work email</label>
            <input className="input" defaultValue="meera.sharma@xyzbank.in" />
            <div style={{ fontSize: 12, color: 'var(--text-light)', marginTop: 6 }}>Changing email requires re-verification.</div>
          </div>
          <div style={{ marginBottom: 18 }}>
            <label className="label">Default sector</label>
            <select className="select" defaultValue="Banking & Credit">
              <option>Banking &amp; Credit</option>
              <option>Hiring &amp; HR</option>
              <option>Healthcare</option>
              <option>Education</option>
            </select>
          </div>
          <button className="btn btn-primary">Save changes</button>
        </Section>

        <Section title="Notifications">
          <ToggleRow label="Email when audit completes" desc="Gets sent to your work email." on={notif.complete} setOn={v => setNotif(n => ({ ...n, complete: v }))} />
          <ToggleRow label="Bias drift alerts" desc="Alert me if production parity drops below threshold." on={notif.drift} setOn={v => setNotif(n => ({ ...n, drift: v }))} />
          <ToggleRow label="Monthly re-audit reminder" desc="First Monday of every month." on={notif.reaudit} setOn={v => setNotif(n => ({ ...n, reaudit: v }))} />
        </Section>

        <Section title="API access">
          <label className="label">API key</label>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <input className="input" readOnly value={keyVisible ? 'fs_live_xk9m8a2b3c4d5e6f7g8h9i0j' : 'fs_live_xk9m••••••••••••••••'} style={{ fontFamily: 'monospace', fontSize: 13 }} />
            <button className="btn btn-outline" onClick={() => setKeyVisible(v => !v)} style={{ flexShrink: 0 }}>{keyVisible ? '🙈' : '👁'}</button>
            <button className="btn btn-outline" style={{ flexShrink: 0 }}>Copy</button>
            <button className="btn btn-outline" style={{ flexShrink: 0 }}>Regenerate</button>
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-grey)', marginBottom: 8 }}>47 API calls this month · Limit: 1,000</div>
          <div style={{ height: 6, background: '#F3F4F6', borderRadius: 999 }}>
            <div style={{ width: '4.7%', height: '100%', background: 'var(--teal)', borderRadius: 999 }} />
          </div>
          <span style={{ display: 'inline-block', marginTop: 14, color: 'var(--teal)', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>View API documentation →</span>
        </Section>

        <Section title="Security">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' }}>
            <div><div style={{ fontSize: 14, fontWeight: 500 }}>Password</div><div style={{ fontSize: 12, color: 'var(--text-grey)' }}>Last changed 3 months ago</div></div>
            <span style={{ color: 'var(--teal)', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>Change password →</span>
          </div>
          <ToggleRow label="Two-factor authentication" desc="Add an extra layer via authenticator app." on={false} setOn={() => {}} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderTop: '1px solid var(--border)' }}>
            <div><div style={{ fontSize: 14, fontWeight: 500 }}>Active sessions</div><div style={{ fontSize: 12, color: 'var(--text-grey)' }}>2 active · MacBook Pro, iPhone 15</div></div>
            <button className="btn btn-outline" style={{ height: 34, fontSize: 12 }}>Sign out all devices</button>
          </div>
        </Section>

        <div className="card" style={{ padding: 28, background: '#FFF5F5', border: '1px solid #FFCDD2' }}>
          <h3 style={{ fontSize: 17, marginBottom: 6, color: 'var(--red-fail)' }}>Danger zone</h3>
          <p style={{ fontSize: 13, color: 'var(--text-grey)', marginBottom: 16 }}>These actions are permanent and cannot be undone.</p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button className="btn btn-danger-outline">Delete all audit data</button>
            <button className="btn btn-danger-outline">Close account</button>
          </div>
        </div>
      </div>
    </div>
  )
}