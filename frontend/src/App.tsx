import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import type { ReactElement } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useAuth } from './hooks/useAuth'
import { LandingPage } from './pages/LandingPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { DashboardPage } from './pages/DashboardPage'
import { BusDetailsPage } from './pages/BusDetailsPage'
import { LiveTrackingPage } from './pages/LiveTrackingPage'
import { DriverDashboardPage } from './pages/DriverDashboardPage'
import { AdminDashboardPage } from './pages/AdminDashboardPage'
import { MapBackground } from './components/MapBackground'

function Protected({ children }: { children: ReactElement }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  const location = useLocation()
  
  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
      <MapBackground />
      
      {/* Route Content overlays the map */}
      <main className="relative z-20 w-full h-full flex flex-col items-center justify-center p-4 md:p-8 pointer-events-none">
        {/* pointer-events-none on main so we can click the map underneath, but pointer-events-auto on the actual glass panels inside pages */}
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<Protected><DashboardPage /></Protected>} />
            <Route path="/bus/:busId" element={<Protected><BusDetailsPage /></Protected>} />
            <Route path="/track/:busId" element={<Protected><LiveTrackingPage /></Protected>} />
            <Route path="/driver" element={<Protected><DriverDashboardPage /></Protected>} />
            <Route path="/admin" element={<Protected><AdminDashboardPage /></Protected>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  )
}
