import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import AuthLeft from '../components/AuthLeft'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ first: '', last: '', org: '', email: '', pwd: '', confirm: '', sector: 'Banking & Credit' })
  const update = k => e => setForm(f => ({ ...f, [k]: e.target.value }))
  const [loading, setLoading] = useState(false)

  const strength = form.pwd.length === 0 ? 0 : form.pwd.length < 6 ? 1 : form.pwd.length < 9 ? 2 : 3
  const strengthLabel = ['', 'Weak', 'Fair', 'Strong'][strength]
  const strengthColor = ['#E5E7EB', '#C62828', '#E65100', '#2E7D32'][strength]
  const mismatch = form.confirm && form.pwd !== form.confirm

  const submit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => { setLoading(false); navigate('/verify-otp') }, 900)
  }

  return (
    <div className="page-enter auth-grid">
      <div className="auth-left"><AuthLeft /></div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <form onSubmit={submit} style={{ width: '100%', maxWidth: 440 }}>
          <h1 style={{ fontSize: 26, marginBottom: 6 }}>Create your account</h1>
          <div style={{ color: 'var(--text-grey)', fontSize: 14, marginBottom: 24 }}>Free to start — no credit card needed</div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
            <div><label className="label">First name</label><input className="input" value={form.first} onChange={update('first')} placeholder="Meera" /></div>
            <div><label className="label">Last name</label><input className="input" value={form.last} onChange={update('last')} placeholder="Sharma" /></div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label className="label">Organisation name</label>
            <input className="input" value={form.org} onChange={update('org')} placeholder="XYZ Bank Ltd." />
          </div>

          <div style={{ marginBottom: 14 }}>
            <label className="label">Work email</label>
            <input className="input" type="email" value={form.email} onChange={update('email')} placeholder="you@company.in" />
          </div>

          <div style={{ marginBottom: 6 }}>
            <label className="label">Password</label>
            <input className="input" type="password" value={form.pwd} onChange={update('pwd')} placeholder="At least 8 characters" />
          </div>
          <div style={{ height: 4, background: '#F3F4F6', borderRadius: 2, overflow: 'hidden', marginBottom: 4 }}>
            <div style={{ height: '100%', width: `${strength * 33}%`, background: strengthColor, transition: 'width 200ms, background 200ms' }} />
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-light)', marginBottom: 14 }}>{strengthLabel || 'Use 8+ characters'}</div>

          <div style={{ marginBottom: 14 }}>
            <label className="label">Confirm password</label>
            <input className="input" type="password" value={form.confirm} onChange={update('confirm')}
              style={{ borderColor: mismatch ? 'var(--red-fail)' : undefined }} />
            {mismatch && <div style={{ color: 'var(--red-fail)', fontSize: 12, marginTop: 6 }}>Passwords do not match</div>}
          </div>

          <div style={{ marginBottom: 20 }}>
            <label className="label">Primary sector</label>
            <select className="select" value={form.sector} onChange={update('sector')}>
              <option>Banking &amp; Credit</option>
              <option>Hiring &amp; HR</option>
              <option>Healthcare</option>
              <option>Education</option>
              <option>Other</option>
            </select>
          </div>

          <button className="btn btn-primary" type="submit" style={{ width: '100%', height: 44 }} disabled={loading}>
            {loading ? <><div className="spinner" /> Creating account…</> : 'Create account →'}
          </button>

          <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-light)', margin: '16px 0 0' }}>
            By creating an account you agree to our Terms and Privacy Policy
          </div>

          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--text-grey)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--teal)', fontWeight: 500 }}>Sign in →</Link>
          </div>
        </form>
      </div>
    </div>
  )
}