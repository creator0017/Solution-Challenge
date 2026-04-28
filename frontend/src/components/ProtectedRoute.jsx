import { Navigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
export default function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext)
  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
    </div>
  )
  if (!user) return <Navigate to="/login" replace />
  return children
}