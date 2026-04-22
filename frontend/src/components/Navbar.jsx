import { useState, useEffect, useContext, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, setUser } = useContext(AuthContext)
  const [scrolled, setScrolled] = useState(false)
  const [dropdown, setDropdown] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const dropRef = useRef()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onClick = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropdown(false) }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  // Hide navbar on auth pages
  const hideOn = ['/', '/login', '/register', '/verify-otp']
  if (hideOn.includes(location.pathname)) return null

  const route = location.pathname

  const NAV_LINKS = [
    { label: 'Home', path: '/home' },
    { label: 'How it works', path: '/home' },
    { label: 'Sectors', path: '/sector' },
    { label: 'Pricing', path: '/pricing' },
  ]

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-inner">
          {/* Logo */}
          <div className="logo-row" onClick={() => navigate('/home')}>
            <div className="logomark">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6" stroke="white" strokeWidth="1.5"/>
                <circle cx="8" cy="8" r="2" fill="white"/>
                <path d="M8 2v6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="brand">
              <span className="t-fair">Fair</span>
              <span className="t-sight">Sight</span>
              <span className="t-ai"> AI</span>
            </div>
          </div>

          {/* Nav links */}
          <div className="nav-links">
            {NAV_LINKS.map(l => (
              <span key={l.label} className={`nav-link ${route === l.path ? 'active' : ''}`} onClick={() => navigate(l.path)}>
                {l.label}
              </span>
            ))}
          </div>

          {/* Right */}
          <div className="nav-right">
            {!user ? (
              <>
                <button className="btn btn-outline desktop-only" style={{ height: 36, fontSize: 14 }} onClick={() => navigate('/login')}>Sign in</button>
                <button className="btn btn-primary desktop-only" style={{ height: 36, fontSize: 14 }} onClick={() => navigate('/sector')}>Start free audit</button>
              </>
            ) : (
              <div style={{ position: 'relative' }} ref={dropRef}>
                <div className="avatar" onClick={() => setDropdown(d => !d)}>
                  {user.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'MS'}
                </div>
                {dropdown && (
                  <div className="nav-dropdown">
                    <div style={{ padding: '10px 12px 6px', borderBottom: '1px solid var(--border)', marginBottom: 4 }}>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{user.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-grey)' }}>{user.email}</div>
                    </div>
                    <div className="nav-dropdown-item" onClick={() => { navigate('/home'); setDropdown(false) }}>🏠 My Dashboard</div>
                    <div className="nav-dropdown-item" onClick={() => { navigate('/sector'); setDropdown(false) }}>+ New Audit</div>
                    <div className="nav-dropdown-item" onClick={() => { navigate('/history'); setDropdown(false) }}>📋 History</div>
                    <div className="nav-dropdown-item" onClick={() => { navigate('/settings'); setDropdown(false) }}>⚙ Settings</div>
                    <div className="nav-dropdown-divider" />
                    <div className="nav-dropdown-item danger" onClick={() => { setUser(null); navigate('/login'); setDropdown(false) }}>Sign out</div>
                  </div>
                )}
              </div>
            )}

            {/* Hamburger */}
            <button className="hamburger" onClick={() => setMobileOpen(true)}>
              <span/><span/><span/>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div className={`mobile-overlay ${mobileOpen ? 'open' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
          <div className="logo-row">
            <div className="logomark"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="white" strokeWidth="1.5"/><circle cx="8" cy="8" r="2" fill="white"/></svg></div>
            <div className="brand"><span className="t-fair">Fair</span><span className="t-sight">Sight</span><span className="t-ai"> AI</span></div>
          </div>
          <button onClick={() => setMobileOpen(false)} style={{ width: 40, height: 40, borderRadius: 8, background: 'var(--bg-grey)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, border: 'none', cursor: 'pointer' }}>✕</button>
        </div>

        {user && (
          <div style={{ padding: '16px 24px 12px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{user.name}</div>
            <div style={{ fontSize: 12, color: 'var(--text-grey)' }}>{user.email}</div>
          </div>
        )}

        <div style={{ padding: '8px 24px', flex: 1 }}>
          {[...NAV_LINKS, ...(user ? [{ label: 'History', path: '/history' }, { label: 'Settings', path: '/settings' }] : [])].map(l => (
            <div key={l.label} onClick={() => { navigate(l.path); setMobileOpen(false) }}
              style={{ height: 52, display: 'flex', alignItems: 'center', fontSize: 16, color: route === l.path ? 'var(--teal)' : 'var(--text-dark)', fontWeight: route === l.path ? 600 : 400, borderBottom: '1px solid #F3F4F6', cursor: 'pointer' }}>
              {l.label}
            </div>
          ))}
        </div>

        <div style={{ padding: 24 }}>
          <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={() => { navigate('/sector'); setMobileOpen(false) }}>
            Start Free Audit →
          </button>
          {user && (
            <button style={{ width: '100%', marginTop: 12, padding: '12px 0', color: 'var(--red-fail)', fontSize: 14, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
              onClick={() => { setUser(null); navigate('/login'); setMobileOpen(false) }}>
              Sign out
            </button>
          )}
        </div>
      </div>
    </>
  )
}