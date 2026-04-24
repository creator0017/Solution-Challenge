import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerWithEmail, loginWithGoogle } from '../services/firebase'
import AuthLeft from '../components/AuthLeft'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ first: '', last: '', org: '', email: '', pwd: '', confirm: '', sector: 'Banking & Credit' })
  const update = k => e => setForm(f => ({ ...f, [k]: e.target.value }))
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [err, setErr] = useState('')

  const strength      = form.pwd.length === 0 ? 0 : form.pwd.length < 6 ? 1 : form.pwd.length < 9 ? 2 : 3
  const strengthLabel = ['', 'Weak', 'Fair', 'Strong'][strength]
  const strengthColor = ['#E5E7EB', '#C62828', '#E65100', '#2E7D32'][strength]
  const mismatch      = form.confirm && form.pwd !== form.confirm

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.first || !form.email || !form.pwd) { setErr('Please fill in all required fields.'); return }
    if (form.pwd !== form.confirm) { setErr('Passwords do not match.'); return }
    if (form.pwd.length < 8) { setErr('Password must be at least 8 characters.'); return }
    setErr(''); setLoading(true)
    try {
      await registerWithEmail({
        firstName:    form.first,
        lastName:     form.last,
        organisation: form.org,
        email:        form.email,
        password:     form.pwd,
        sector:       form.sector,
      })
      // Pass email to OTP page so it shows the right address
      navigate('/verify-otp', { state: { email: form.email } })
    } catch (error) {
      setLoading(false)
      switch (error.code) {
        case 'auth/email-already-in-use':
          setErr('This email is already registered. Sign in →'); break
        case 'auth/invalid-email':
          setErr('Please enter a valid email address.'); break
        case 'auth/weak-password':
          setErr('Password is too weak. Use at least 8 characters.'); break
        default:
          setErr('Registration failed. Please try again.')
      }
    }
  }

  async function handleGoogle() {
    setErr(''); setGoogleLoading(true)
    try {
      await loginWithGoogle()
      navigate('/home')
    } catch (error) {
      setGoogleLoading(false)
      if (error.code !== 'auth/popup-closed-by-user') {
        setErr('Google sign-in failed. Please try again.')
      }
    }
  }

  return (
    <div className="page-enter" style={{ display: 'grid', gridTemplateColumns: '45% 55%', minHeight: '100vh' }}>
      <AuthLeft />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 440 }}>
          <h1 style={{ fontSize: 26, marginBottom: 6 }}>Create your account</h1>
          <div style={{ color: 'var(--text-grey)', fontSize: 14, marginBottom: 24 }}>Free to start — no credit card needed</div>

          {err && (
            <div className="shake" style={{ background: 'var(--red-bg)', border: '1px solid #FFCDD2', color: 'var(--red-fail)', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16 }}>
              ⚠ {err}
            </div>
          )}

          {/* Name row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
            <div><label className="label">First name *</label><input className="input" value={form.first} onChange={update('first')} placeholder="Meera" required/></div>
            <div><label className="label">Last name</label><input className="input" value={form.last} onChange={update('last')} placeholder="Sharma"/></div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label className="label">Organisation name</label>
            <input className="input" value={form.org} onChange={update('org')} placeholder="XYZ Bank Ltd."/>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label className="label">Work email *</label>
            <input className="input" type="email" value={form.email} onChange={update('email')} placeholder="you@company.in" required autoComplete="email"/>
          </div>

          {/* Password + strength */}
          <div style={{ marginBottom: 6 }}>
            <label className="label">Password *</label>
            <input className="input" type="password" value={form.pwd} onChange={update('pwd')} placeholder="At least 8 characters" required autoComplete="new-password"/>
          </div>
          <div style={{ height: 4, background: '#F3F4F6', borderRadius: 2, overflow: 'hidden', marginBottom: 4 }}>
            <div style={{ height: '100%', width: `${strength * 33}%`, background: strengthColor, transition: 'width 200ms, background 200ms' }}/>
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-light)', marginBottom: 14 }}>{strengthLabel || 'Use 8+ characters'}</div>

          <div style={{ marginBottom: 14 }}>
            <label className="label">Confirm password *</label>
            <input className="input" type="password" value={form.confirm} onChange={update('confirm')} style={{ borderColor: mismatch ? 'var(--red-fail)' : undefined }} autoComplete="new-password"/>
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

          <button className="btn btn-primary" type="submit" style={{ width: '100%', height: 44 }} disabled={loading || googleLoading}>
            {loading ? <><div className="spinner"/> Creating account…</> : 'Create account →'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '16px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }}/><span style={{ color: 'var(--text-light)', fontSize: 12 }}>OR</span><div style={{ flex: 1, height: 1, background: 'var(--border)' }}/>
          </div>

          <button className="btn btn-outline" type="button" style={{ width: '100%', height: 44, marginBottom: 16 }} onClick={handleGoogle} disabled={loading || googleLoading}>
            {googleLoading ? <><div className="spinner teal"/> Connecting…</> : (
              <>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                  <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </>
            )}
          </button>

          <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-light)' }}>
            By creating an account you agree to our Terms and Privacy Policy
          </div>
          <div style={{ textAlign: 'center', marginTop: 16, fontSize: 14, color: 'var(--text-grey)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--teal)', fontWeight: 500 }}>Sign in →</Link>
          </div>
        </form>
      </div>
    </div>
  )
}