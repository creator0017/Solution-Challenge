import { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import AuthLeft from '../components/AuthLeft'

export default function Login() {
  const navigate = useNavigate()
  const { setUser } = useContext(AuthContext)
  const [email, setEmail] = useState('meera.sharma@xyzbank.in')
  const [pwd, setPwd] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  const submit = (e) => {
    e && e.preventDefault()
    setErr('')
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setUser({ email, name: 'Meera Sharma' })
      navigate('/home')
    }, 900)
  }

  return (
    <div className="page-enter" style={{ display: 'grid', gridTemplateColumns: '45% 55%', minHeight: '100vh' }}>
      <AuthLeft />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <form onSubmit={submit} style={{ width: '100%', maxWidth: 400 }}>
          <h1 style={{ fontSize: 26, marginBottom: 6 }}>Welcome back</h1>
          <div style={{ color: 'var(--text-grey)', fontSize: 14, marginBottom: 28 }}>Sign in to your audit dashboard</div>

          {err && (
            <div className="shake" style={{ background: 'var(--red-bg)', border: '1px solid #FFCDD2', color: 'var(--red-fail)', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              {err}
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label className="label">Work email</label>
            <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.in" />
          </div>

          <div style={{ marginBottom: 8 }}>
            <label className="label">Password</label>
            <div style={{ position: 'relative' }}>
              <input className="input" type={show ? 'text' : 'password'} value={pwd} onChange={e => setPwd(e.target.value)} style={{ paddingRight: 44 }} placeholder="Enter password" />
              <button type="button" onClick={() => setShow(s => !s)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                {show ? (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 2l12 12M6.5 6.6A2 2 0 0010 10M4 4.3C2.5 5.4 1 8 1 8s2.5 5 7 5c1.5 0 2.8-.5 3.9-1.2M6.5 3.2C7 3.1 7.5 3 8 3c4.5 0 7 5 7 5s-.7 1.4-1.9 2.7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.2"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2"/></svg>
                )}
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'right', marginBottom: 20 }}>
            <span style={{ color: 'var(--teal)', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>Forgot password?</span>
          </div>

          <button className="btn btn-primary" type="submit" style={{ width: '100%', height: 44 }} disabled={loading}>
            {loading ? <><div className="spinner" /> Signing in…</> : 'Sign in →'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }}/>
            <div style={{ color: 'var(--text-light)', fontSize: 12 }}>OR</div>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }}/>
          </div>

          <button className="btn btn-outline" type="button" style={{ width: '100%', height: 44 }} onClick={submit}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'var(--text-grey)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--teal)', fontWeight: 500 }}>Register free →</Link>
          </div>
        </form>
      </div>
    </div>
  )
}