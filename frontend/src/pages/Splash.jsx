import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LottieDefault from 'lottie-react'
import logo from '../assets/io.png'
import logoAnimation from '../assets/fairsight_loader.json'

const Lottie = LottieDefault.default || LottieDefault;

const PARTICLES = 350
const GLITTERS  = 30

export default function Splash() {
  const navigate   = useNavigate()
  const lottieRef  = useRef(null)
  const animRef    = useRef(null)
  const [particles, setParticles] = useState([])
  const [glitters,  setGlitters]  = useState([])
  const [stage,     setStage]     = useState(0)

  useEffect(() => {
    const generated = Array.from({ length: PARTICLES }).map(() => {
      const angle  = Math.random() * Math.PI * 2
      const radius = Math.random() * 180
      const depth  = Math.random()
      return {
        startX:   (Math.random() - 0.5) * window.innerWidth,
        startY:   (Math.random() - 0.5) * window.innerHeight,
        endX:     Math.cos(angle) * radius,
        endY:     Math.sin(angle) * radius,
        delay:    Math.random() * 1.2,
        size:     1.5 + depth * 2,
        opacity:  0.5 + depth * 0.5,
        duration: 4.8 + (1 - depth) * 1.5,
      }
    })

    const glitterGen = Array.from({ length: GLITTERS }).map(() => ({
      x:     Math.random() * window.innerWidth,
      y:     Math.random() * window.innerHeight,
      delay: Math.random() * 2,
    }))

    setParticles(generated)
    setGlitters(glitterGen)

    const t1 = setTimeout(() => setStage(1), 400)
    const t2 = setTimeout(() => setStage(2), 4200)
    const t3 = setTimeout(() => setStage(3), 4800)
    const t4 = setTimeout(() => navigate('/login'), 6800)

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4) }
  }, [navigate])

  return (
    <div style={{
      width: '100vw', height: '100vh',
      background: '#f4f6f6',
      overflow: 'hidden',
      position: 'relative',
      fontFamily: "'Inter', -apple-system, sans-serif",
    }}>

      {/* Keyframe styles */}
      <style>{`
        @keyframes moveParticles {
          from { transform: translate3d(var(--sx), var(--sy), 0); }
          to   { transform: translate3d(var(--ex), var(--ey), 0); }
        }
        @keyframes fadeParticles {
          to { opacity: 0; transform: translate3d(var(--ex), var(--ey), 0) scale(0.3); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.05; }
          50% { opacity: 0.2; }
        }
        @keyframes revealLogo {
          from { opacity: 0; transform: scale(0.7); filter: blur(10px); }
          to   { opacity: 1; transform: scale(1);   filter: blur(0); }
        }
        @keyframes smoothFlow {
          0%   { transform: translateX(-120%); }
          50%  { transform: translateX(60%); }
          100% { transform: translateX(220%); }
        }
      `}</style>

      {/* Glitters */}
      {glitters.map((g, i) => (
        <div key={`g-${i}`} style={{
          position: 'fixed',
          width: 1, height: 1,
          background: '#0F766E',
          borderRadius: '50%',
          left: 0, top: 0,
          transform: `translate3d(${g.x}px, ${g.y}px, 0)`,
          animation: `twinkle 4s infinite ease-in-out ${g.delay}s`,
          opacity: 0.1,
        }}/>
      ))}

      {/* Particles */}
      {particles.map((p, i) => (
        <div key={i} style={{
          position: 'fixed',
          top: '50%', left: '50%',
          width: p.size, height: p.size,
          background: '#0F766E',
          borderRadius: '50%',
          boxShadow: '0 0 6px rgba(15,118,110,0.6)',
          opacity: stage === 0 ? 0 : stage === 1 ? p.opacity : 0,
          transform: `translate3d(${p.startX}px, ${p.startY}px, 0)`,
          animation: stage === 1
            ? `moveParticles ${p.duration}s cubic-bezier(0.25,1,0.5,1) ${p.delay}s forwards`
            : stage === 2
            ? `fadeParticles 1.2s ease forwards`
            : 'none',
          zIndex: 5,
        }}/>
      ))}

      {/* Center content */}
      <div style={{
        position: 'fixed',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        zIndex: 10,
      }}>

        {/* Lottie plays first (stage 1-2) as the dots-forming animation, then logo reveals */}
        <div style={{ width: 240, height: 240, margin: '0 auto', position: 'relative' }}>
          {stage >= 1 && stage < 3 && (
            <Lottie
              animationData={logoAnimation}
              loop={true}
              autoplay={true}
              style={{ width: '100%', height: '100%', opacity: 0.85 }}
            />
          )}
          {stage >= 3 && (
            <img
              src={logo}
              alt="FairSight AI"
              style={{
                width: 240,
                animation: 'revealLogo 1.4s cubic-bezier(0.25,1,0.5,1) forwards',
              }}
            />
          )}
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: 42, fontWeight: 700,
          color: '#0F2A26',
          marginTop: 10, marginBottom: 0,
          letterSpacing: '-0.02em',
          opacity: stage >= 3 ? 1 : 0,
          transition: stage >= 3 ? 'opacity 0.6s ease' : 'none',
        }}>
          FairSight <span style={{ color: '#0F766E' }}>AI</span>
        </h1>

        {/* Tagline */}
        <p style={{
          fontSize: 14, color: '#6B7280',
          marginTop: 6, marginBottom: 0,
          opacity: stage >= 3 ? 1 : 0,
          transition: stage >= 3 ? 'opacity 0.8s ease' : 'none',
        }}>
          Bias Detection &amp; Fairness Auditing for AI Systems
        </p>

        {/* Progress bar */}
        <div style={{
          width: '60%', maxWidth: 320, height: 6,
          margin: '18px auto 0',
          background: 'rgba(15,118,110,0.15)',
          borderRadius: 999, overflow: 'hidden',
          position: 'relative',
          opacity: stage >= 3 ? 1 : 0,
          transform: stage >= 3 ? 'translateY(0)' : 'translateY(10px)',
          transition: stage >= 3 ? 'all 0.5s ease' : 'none',
        }}>
          <div style={{
            position: 'absolute', height: '100%', width: '40%',
            background: 'linear-gradient(90deg, transparent, #0F766E, #0F766E, transparent)',
            borderRadius: 999,
            animation: stage >= 3 ? 'smoothFlow 1.6s ease-in-out infinite' : 'none',
          }}/>
        </div>

        {/* Loading text */}
        <p style={{
          fontSize: 12, color: '#9CA3AF',
          marginTop: 12,
          letterSpacing: '0.5px',
          opacity: stage >= 3 ? 1 : 0,
          transition: 'opacity 0.5s ease',
        }}>
          Connecting to AI...
        </p>
      </div>
    </div>
  )
}