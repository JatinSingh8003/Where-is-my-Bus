import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { LogOut, Bus, MapPin, Navigation, ShieldCheck, Power, PlusCircle, Settings, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function DriverDashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  
  const [isTripActive, setIsTripActive] = useState(false)
  const [locationSharing, setLocationSharing] = useState(false)

  // Redirect if not driver
  if (user?.role !== 'driver') {
    return (
      <div className="glass-panel p-8 text-center text-white">
        <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
        <h2 className="text-xl font-bold">Access Denied</h2>
        <p className="text-slate-400 mt-2">You must be registered as a Driver to view this page.</p>
      </div>
    )
  }

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <motion.main 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="pointer-events-auto flex w-full max-w-6xl flex-col gap-6 my-8"
    >
      {/* Header */}
      <header className="glass-panel rounded-3xl p-6 flex items-center justify-between shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/10 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 border border-emerald-500/30">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Driver Portal</h1>
            <p className="text-sm text-emerald-400 font-medium">Welcome back, {user?.name}</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="relative z-10 flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-red-500/20 text-slate-300 hover:text-red-400 rounded-xl transition-all border border-slate-700/50 hover:border-red-500/30"
        >
          <LogOut size={16} />
          <span className="text-sm font-semibold">Sign Out</span>
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Profile & Bus Details */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <section className="glass-panel rounded-3xl p-6 relative overflow-hidden h-full">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <UserIcon /> Profile Details
            </h2>
            <div className="space-y-4">
              <InfoRow label="Full Name" value={user.name} />
              <InfoRow label="Email" value={user.email} />
              <InfoRow label="Driving License" value={user.drivingLicense || 'Not Provided'} highlight />
              <InfoRow label="RC Number" value={user.rcNumber || 'Not Provided'} />
              <InfoRow label="Registered Bus" value={user.busRegistration || 'None'} highlight />
            </div>
          </section>
        </div>

        {/* Middle & Right Col: Active Trip & Actions */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Active Trip Controls */}
          <section className="glass-panel rounded-3xl p-8 relative overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            <div className={`absolute -top-32 -right-32 w-96 h-96 rounded-full blur-[100px] pointer-events-none transition-colors duration-1000 ${isTripActive ? 'bg-emerald-600/20' : 'bg-rose-600/10'}`}></div>
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-3 h-3 rounded-full ${isTripActive ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse' : 'bg-rose-500'}`}></div>
                  <h2 className="text-xl font-bold text-white">Live Routine Status</h2>
                </div>
                <p className="text-sm text-slate-400">
                  {isTripActive ? 'You are currently sharing location on route: Jaipur to Jodhpur.' : 'You are currently offline. Start a trip to broadcast GPS.'}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <button 
                  onClick={() => setIsTripActive(!isTripActive)}
                  className={`flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold transition-all shadow-lg ${isTripActive ? 'bg-rose-600/90 hover:bg-rose-500 text-white shadow-rose-900/50' : 'bg-emerald-600/90 hover:bg-emerald-500 text-white shadow-emerald-900/50'}`}
                >
                  <Power size={18} />
                  {isTripActive ? 'End Trip' : 'Start Trip'}
                </button>
                <button 
                  onClick={() => setLocationSharing(!locationSharing)}
                  disabled={!isTripActive}
                  className={`flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold transition-all border ${locationSharing ? 'bg-blue-600/20 border-blue-500/50 text-blue-400' : 'bg-slate-800/50 border-slate-700 text-slate-500'} ${!isTripActive && 'opacity-50 cursor-not-allowed'}`}
                >
                  <Navigation size={18} />
                  GPS {locationSharing ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>
          </section>

          {/* Manage Fleet */}
          <section className="glass-panel rounded-3xl p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Bus size={20} className="text-blue-400" /> Manage Fleet
              </h2>
              <button className="flex items-center gap-1.5 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1.5 rounded-lg border border-blue-500/20">
                <PlusCircle size={16} /> Add New Bus
              </button>
            </div>

            <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-5 flex items-center justify-between group hover:border-slate-700 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-blue-400 transition-colors">
                  <Bus size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">{user.busRegistration || 'RJ14-TR-102'}</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                    <MapPin size={12} /> Assigned Route: Jaipur - Jodhpur
                  </p>
                </div>
              </div>
              <button className="p-2 text-slate-500 hover:text-white bg-slate-800 rounded-lg transition-colors">
                <Settings size={18} />
              </button>
            </div>

          </section>

        </div>
      </div>
    </motion.main>
  )
}

function UserIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  )
}

function InfoRow({ label, value, highlight = false }: { label: string, value: string, highlight?: boolean }) {
  return (
    <div className="flex flex-col border-b border-slate-800/50 pb-3 last:border-0 last:pb-0">
      <span className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">{label}</span>
      <span className={`text-sm font-semibold ${highlight ? 'text-emerald-400' : 'text-slate-200'}`}>{value}</span>
    </div>
  )
}
