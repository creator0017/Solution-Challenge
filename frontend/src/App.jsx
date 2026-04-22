import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { AuditProvider } from './context/AuditContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'

import Splash from './pages/Splash'
import Login from './pages/Login'
import Register from './pages/Register'
import OTP from './pages/OTP'
import Home from './pages/Home'
import SectorSelect from './pages/SectorSelect'
import Upload from './pages/Upload'
import Processing from './pages/Processing'
import Results from './pages/Results'
import GeminiChat from './pages/GeminiChat'
import ComplianceReport from './pages/ComplianceReport'
import AuditHistory from './pages/AuditHistory'
import Settings from './pages/Settings'
import Pricing from './pages/Pricing'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <AuthProvider>
      <AuditProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Splash />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-otp" element={<OTP />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/sector" element={<ProtectedRoute><SectorSelect /></ProtectedRoute>} />
            <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
            <Route path="/processing" element={<ProtectedRoute><Processing /></ProtectedRoute>} />
            <Route path="/results" element={<ProtectedRoute><Results /></ProtectedRoute>} />
            <Route path="/gemini-chat" element={<ProtectedRoute><GeminiChat /></ProtectedRoute>} />
            <Route path="/report" element={<ProtectedRoute><ComplianceReport /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute><AuditHistory /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuditProvider>
    </AuthProvider>
  )
}