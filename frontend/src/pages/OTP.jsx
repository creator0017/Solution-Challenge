import { useState, useEffect, useRef, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function OTP() {
  const navigate = useNavigate()
  const { setUser } = useContext(AuthContext)
  const [digits, setDigits] = useState(['', '', '', '', '', ''])
  const [err, setErr] = useState(false)
  const [verified, setVerified] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [countdown, setCountdown] = useState(30)
  const refs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()]

  useEffect(() => {
    refs[0].current?.focus()
    const id = setInterval(() => setCountdown(c => c > 0 ? c - 1 : 0), 1000)
    return () => clearInterval(id)
  }, [])

  const setDigit = (i, v) => {
    if (v && !/^\d$/.test(v)) return
    const next = [...digits]; next[i] = v; setDigits(next)
    if (v && i < 5) refs[i + 1].current?.focus()
  }

  const onKey = i => e => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) refs[i - 1].current?.focus()
  }

  const filled = digits.every(d => d !== '')

  const submit = () => {
    if (!filled) return
    setVerifying(true)
    setTimeout(() => {
      setVerifying(false)
      if (digits.join('') === '000000') {
        setErr(true); setTimeout(() => setErr(false), 400)
      } else {
        setVerified(true)
        setTimeout(() => { setUser({ email: 'meera.sharma@xyzbank.in', name: 'Meera Sharma' }); navigate('/home') }, 1500)
      }
    }, 900)
  }

  return (
    <div className="page-enter" style={{ minHeight: '100vh', background: 'var(--bg-grey)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div className="card" style={{ maxWidth: 440, width: '100%', padding: 48, textAlign: 'center' }}>
        <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--teal)', fontSize: 13, marginBottom: 24 }}>
          ← Back to register
        </Link>

        <div style={{ width: 60, height: 60, borderRadius: 999, background: 'var(--teal-bg)', color: 'var(--teal)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect x="2" y="6" width="24" height="16" rx="3" stroke="currentColor" strokeWidth="1.8"/>
            <path d="M2 10l12 7 12-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </div>

        <h1 style={{ fontSize: 24, marginBottom: 8 }}>{verified ? 'Email verified!' : 'Check your email'}</h1>
        <div style={{ color: 'var(--text-grey)', fontSize: 14, marginBottom: 28 }}>
          {verified ? 'Redirecting you to FairSight…' : <>We sent a 6-digit code to<br /><b style={{ color: 'var(--text-dark)' }}>meera.sharma@xyzbank.in</b></>}
        </div>

        {!verified && (
          <>
            <div className={err ? 'shake' : ''} style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 24 }}>
              {digits.map((d, i) => (
                <input
                  key={i} ref={refs[i]} inputMode="numeric" maxLength={1} value={d}
                  onChange={e => setDigit(i, e.target.value)}
                  onKeyDown={onKey(i)}
                  style={{
                    width: 48, height: 56, textAlign: 'center',
                    fontSize: 22, fontWeight: 600,
                    border: `2px solid ${err ? 'var(--red-fail)' : d ? 'var(--teal)' : '#E5E7EB'}`,
                    background: err ? 'var(--red-bg)' : d ? 'var(--teal-bg)' : '#fff',
                    color: 'var(--text-dark)', borderRadius: 8, outline: 'none',
                    transition: 'border-color 180ms, background 180ms', fontFamily: 'inherit',
                  }}
                />
              ))}
            </div>

            <button className="btn btn-primary" style={{ width: '100%', height: 44 }} disabled={!filled || verifying} onClick={submit}>
              {verifying ? <><div className="spinner" /> Verifying…</> : 'Verify email →'}
            </button>

            <div style={{ marginTop: 20, fontSize: 13, color: 'var(--text-grey)' }}>
              Didn't receive it?{' '}
              {countdown > 0
                ? <span>Resend in {countdown}s</span>
                : <span style={{ color: 'var(--teal)', fontWeight: 500, cursor: 'pointer' }} onClick={() => setCountdown(30)}>Resend code</span>}
            </div>
            <div style={{ marginTop: 8, fontSize: 12 }}>
              <Link to="/register" style={{ color: 'var(--text-light)' }}>Wrong email? Go back and change it</Link>
            </div>
          </>
        )}

        {verified && (
          <div style={{ width: 72, height: 72, borderRadius: 999, background: 'var(--green-bg)', color: 'var(--green-pass)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M6 16l7 7 13-13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}
      </div>
    </div>
  )
}