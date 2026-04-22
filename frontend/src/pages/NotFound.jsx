import { useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="page-enter" style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32, background: '#fff' }}>
      <div style={{ textAlign: 'center', maxWidth: 420 }}>
        <div style={{ fontSize: 120, fontWeight: 700, color: '#E5E7EB', letterSpacing: '-0.05em', lineHeight: 1 }}>404</div>
        <div style={{ width: 64, height: 64, borderRadius: 16, background: 'var(--bg-grey)', color: '#D1D5DB', margin: '16px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>
          🔍
        </div>
        <h1 style={{ fontSize: 28, marginBottom: 8 }}>Page not found</h1>
        <p style={{ color: 'var(--text-grey)', fontSize: 15, marginBottom: 24 }}>The page you're looking for doesn't exist or has been moved.</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <button className="btn btn-primary" onClick={() => navigate('/home')}>Go to home →</button>
          <button className="btn btn-outline" onClick={() => navigate(-1)}>Go back</button>
        </div>
      </div>
    </div>
  )
}