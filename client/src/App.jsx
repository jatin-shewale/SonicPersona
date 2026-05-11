import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import HomePage from './pages/HomePage'
import LoadingPage from './pages/LoadingPage'
import ResultsPage from './pages/ResultsPage'
import Navbar from './components/Navbar'

function ProtectedRoute({ children }) {
  const { authenticated, loading } = useAuth()
  if (loading) return null
  if (!authenticated) return <Navigate to="/" replace />
  return children
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/loading" element={
          <ProtectedRoute><LoadingPage /></ProtectedRoute>
        } />
        <Route path="/results" element={
          <ProtectedRoute><ResultsPage /></ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="noise-bg min-h-screen bg-brand-dark">
          <AppRoutes />
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}
