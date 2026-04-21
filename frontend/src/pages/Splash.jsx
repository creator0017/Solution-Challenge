import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const STEPS = [
  { pct: 0,   label: 'Initialising...' },
  { pct: 25,  label: 'Connecting to Gemini AI...' },
  { pct: 60,  label: 'Setting up bias engine...' },
  { pct: 90,  label: 'Almost ready...' },
  { pct: 100, label: 'Ready!' },
]

export default function Splash() {
  const navigate = useNavigate()
  const [pct, setPct]     = useState(0)
  const [label, setLabel] = useState('Initialising...')

  useEffect(() => {
    let i = 0
    const iv = setInterval(() => {
      i++
      if (i >= STEPS.length) { clearInterval(iv); return }
      setPct(STEPS[i].pct)
      setLabel(STEPS[i].label)
    }, 600)

    const timer = setTimeout(() => navigate('/login'), 3200)
    return () => { clearInterval(iv); clearTimeout(timer) }
  }, [navigate])

  return (
    <div style={S.page}>
      {/* Decorative circles */}
      <div style={S.circleTopRight} />
      <div style={S.circleBottomLeft} />

      {/* Center content */}
      <div style={S.center}>
        {/* Logo mark */}
        <div style={S.logoMark}>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <circle cx="18" cy="18" r="12" stroke="white" strokeWidth="2.5"/>
            <circle cx="18" cy="18" r="4" fill="white"/>
            <path d="M18 6v12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M26 10l-8 8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>

        {/* Brand name */}
        <div style={S.brandName}>
          <span style={{ color: '#0F2A26' }}>Fair</span>
          <span style={{ color: '#0F766E' }}>Sight</span>
          <span style={{ color: '#0F2A26' }}> AI</span>
        </div>

        {/* Tagline */}
        <p style={S.tagline}>Bias Detection &amp; Fairness Auditing for AI Systems</p>

        {/* Progress bar */}
        <div style={S.barTrack}>
          <div style={{ ...S.barFill, width: pct + '%' }} />
        </div>

        {/* Loading label */}
        <p style={S.loadLabel}>{label}</p>
      </div>

      {/* Version footer */}
      <p style={S.version}>FairSight AI v1.0 · Solution Challenge 2026</p>
    </div>
  )
}

const S = {
  page: {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    background: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    fontFamily: "'Inter', -apple-system, sans-serif",
  },
  circleTopRight: {
    position: 'absolute',
    top: -80,
    right: -80,
    width: 320,
    height: 320,
    borderRadius: '50%',
    background: '#E0F5F1',
    opacity: 0.6,
  },
  circleBottomLeft: {
    position: 'absolute',
    bottom: -60,
    left: -60,
    width: 240,
    height: 240,
    borderRadius: '50%',
    background: '#F0FDFA',
    opacity: 0.8,
  },
  center: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    zIndex: 1,
  },
  logoMark: {
    width: 80,
    height: 80,
    background: '#0F766E',
    borderRadius: 22,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    boxShadow: '0 8px 32px rgba(15,118,110,0.25)',
  },
  brandName: {
    fontSize: 32,
    fontWeight: 700,
    letterSpacing: '-0.5px',
  },
  tagline: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 28,
  },
  barTrack: {
    width: 240,
    height: 4,
    background: '#E5E7EB',
    borderRadius: 999,
    overflow: 'hidden',
  },
  barFill: {
    height: 4,
    background: '#0F766E',
    borderRadius: 999,
    transition: 'width 0.5s ease',
  },
  loadLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 8,
  },
  version: {
    position: 'absolute',
    bottom: 24,
    fontSize: 11,
    color: '#D1D5DB',
  },
}