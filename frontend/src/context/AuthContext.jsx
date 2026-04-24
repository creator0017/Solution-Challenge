import { createContext, useState, useEffect } from 'react'
import { observeAuth, getUserProfile } from '../services/firebase'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = observeAuth(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)
        try {
          const prof = await getUserProfile(firebaseUser.uid)
          setProfile(prof)
        } catch {
          setProfile(null)
        }
      } else {
        setUser(null)
        setProfile(null)
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser, profile, setProfile, loading }}>
      {children}
    </AuthContext.Provider>
  )
}