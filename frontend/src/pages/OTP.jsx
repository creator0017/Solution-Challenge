import { useState, useEffect, useRef, useContext } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { auth } from '../services/firebase'
import { sendEmailVerification, reload } from 'firebase/auth'

export default function OTP() {
  const navigate   = useNavigate()
  const location   = useLocation()
  const { user }   = useContext(AuthContext)

  // Email passed from Register page
  const email = location.state?.email || user?.email || ''

  const [checking, setChecking]   = useState(false)
  const [verified, setVerified]   = useState(false)
  const [resending, setResending] = useState(false)
  const [resent, setResent]       = useState(false)
  const [countdown, setCountdown] = useState(30)
  const [err, setErr]             = useState('')

  // Countdown timer for resend button
  useEffect(() => {
    const id = setInterval(() => setCountdown(c => c > 0 ? c - 1 : 0), 1000)
    return () => clearInterval(id)
  }, [])

  // Auto-poll Firebase every 3 seconds to detect when user clicks the email link
  useEffect(() => {
    if (!user || verified) return
    const poll = setInterval(async () => {
      try {
        await reload(user)             // refresh Firebase user object
        if (user.emailVerified) {
          clearInterval(poll)
          setVerified(true)
          setTimeout(() => navigate('/home'), 1500)
        }
      } catch { /* ignore */ }
    }, 3000)
    return () => clearInterval(poll)
  }, [user, verified, navigate])

  // Manual "I've verified" check button
  async function checkVerification() {
    if (!user) return
    setChecking(true); setErr('')
    try {
      await reload(user)
      if (user.emailVerified) {
        setVerified(true)
        setTimeout(() => navigate('/home'), 1500)
      } else {
        setErr("Email not verified yet. Click the link in your inbox, then try again.")
      }
    } catch {
      setErr('Could not check verification status. Please try again.')
    } finally {
      setChecking(false)
    }
  }

  // Resend verification email
  async function resendEmail() {
    if (!user) return
    setResending(true); setErr('')
    try {
      await sendEmailVerification(user)
      setResent(true)
      setCountdown(30)
    } catch (error) {
      if (error.code === 'auth/too-many-requests') {
        setErr('Too many requests. Please wait a few minutes before resending.')
      } else {
        setErr('Could not resend email. Please try again.')
      }
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="page-enter" style={{ minHeight: '100vh', background: 'var(--bg-grey)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div className="card" style={{ maxWidth: 460, width: '100%', padding: 48, textAlign: 'center' }}>

        <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--teal)', fontSize: 13, marginBottom: 24 }}>
          ← Back to register
        </Link>

        {/* Icon */}
        <div style={{ width: 64, height: 64, borderRadius: 999, background: verified ? 'var(--green-bg)' : 'var(--teal-bg)', color: verified ? 'var(--green-pass)' : 'var(--teal)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          {verified
            ? <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M6 16l7 7 13-13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            : <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><rect x="2" y="6" width="24" height="16" rx="3" stroke="currentColor" strokeWidth="1.8"/><path d="M2 10l12 7 12-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
          }
        </div>

        <h1 style={{ fontSize: 24, marginBottom: 8 }}>
          {verified ? 'Email verified!' : 'Check your inbox'}
        </h1>

        <div style={{ color: 'var(--text-grey)', fontSize: 14, marginBottom: 28, lineHeight: 1.6 }}>
          {verified
            ? 'Redirecting you to FairSight…'
            : <>We sent a verification link to<br/><b style={{ color: 'var(--text-dark)' }}>{email || 'your email'}</b><br/>Click the link to verify your account.</>
          }
        </div>

        {!verified && (
          <>
            {err && (
              <div style={{ background: 'var(--red-bg)', border: '1px solid #FFCDD2', color: 'var(--red-fail)', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16, textAlign: 'left' }}>
                ⚠ {err}
              </div>
            )}

            {resent && (
              <div style={{ background: 'var(--green-bg)', border: '1px solid #A5D6A7', color: 'var(--green-pass)', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16 }}>
                ✓ Verification email resent to {email}
              </div>
            )}

            {/* How it works note */}
            <div style={{ background: 'var(--teal-bg)', border: '1px solid var(--teal-border)', borderRadius: 10, padding: 14, marginBottom: 24, fontSize: 13, color: 'var(--text-dark)', textAlign: 'left' }}>
              <div style={{ fontWeight: 600, marginBottom: 6, color: 'var(--teal)' }}>How to verify:</div>
              <div style={{ color: 'var(--text-grey)', lineHeight: 1.6 }}>
                1. Open the email from Firebase / FairSight AI<br/>
                2. Click <b>"Verify email"</b> in that email<br/>
                3. Come back here and click the button below
              </div>
            </div>

            <button className="btn btn-primary" style={{ width: '100%', height: 44, marginBottom: 12 }} onClick={checkVerification} disabled={checking}>
              {checking ? <><div className="spinner"/> Checking…</> : "I've verified my email →"}
            </button>

            <div style={{ fontSize: 13, color: 'var(--text-grey)', marginTop: 8 }}>
              Didn't receive it?{' '}
              {countdown > 0
                ? <span style={{ color: 'var(--text-light)' }}>Resend in {countdown}s</span>
                : <span onClick={resendEmail} style={{ color: 'var(--teal)', fontWeight: 500, cursor: resending ? 'default' : 'pointer' }}>
                    {resending ? 'Sending…' : 'Resend email'}
                  </span>
              }
            </div>

            <div style={{ marginTop: 10, fontSize: 12 }}>
              <Link to="/register" style={{ color: 'var(--text-light)' }}>Wrong email? Go back and change it</Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}