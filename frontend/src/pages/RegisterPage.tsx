import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { UserPlus, User, Mail, Lock, Car, FileText, BadgeInfo } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import type { Role } from '../types'

export function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  
  const [role, setRole] = useState<Role>('passenger')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  const [drivingLicense, setDrivingLicense] = useState('')
  const [rcNumber, setRcNumber] = useState('')
  const [busRegistration, setBusRegistration] = useState('')
  
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    try {
      await register({
        name,
        email,
        password,
        role,
        ...(role === 'driver' && { drivingLicense, rcNumber, busRegistration })
      })
      
      if (role === 'driver') {
        navigate('/driver')
      } else {
        navigate('/dashboard')
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed')
    }
  }

  return (
    <motion.main 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="pointer-events-auto flex w-full max-w-md flex-col my-12"
    >
      <form onSubmit={handleSubmit} className="glass-panel rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Glow behind form */}
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-600/30 rounded-full blur-[60px] pointer-events-none"></div>

        <div className="relative z-10">
          <div className="mb-6 text-center">
            <div className="mx-auto w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center mb-4 text-blue-400">
              <UserPlus size={24} />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Create Account</h1>
            <p className="mt-2 text-sm text-slate-400">Join Tracer and experience smart transit.</p>
          </div>

          <div className="flex bg-slate-900/50 p-1 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => setRole('passenger')}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${role === 'passenger' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              Passenger
            </button>
            <button
              type="button"
              onClick={() => setRole('driver')}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${role === 'driver' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              Driver
            </button>
          </div>

          <div className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-xl text-center">
                {error}
              </div>
            )}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User size={18} />
              </div>
              <input 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Full name" 
                className={`w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-10 pr-4 outline-none transition-all focus:ring-2 ${role === 'driver' ? 'focus:border-emerald-500 focus:ring-emerald-500/20' : 'focus:border-blue-500 focus:ring-blue-500/20'}`}
                required 
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail size={18} />
              </div>
              <input 
                type="email"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Email address" 
                className={`w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-10 pr-4 outline-none transition-all focus:ring-2 ${role === 'driver' ? 'focus:border-emerald-500 focus:ring-emerald-500/20' : 'focus:border-blue-500 focus:ring-blue-500/20'}`}
                required 
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock size={18} />
              </div>
              <input 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                type="password" 
                placeholder="Password" 
                className={`w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-10 pr-4 outline-none transition-all focus:ring-2 ${role === 'driver' ? 'focus:border-emerald-500 focus:ring-emerald-500/20' : 'focus:border-blue-500 focus:ring-blue-500/20'}`}
                required 
              />
            </div>

            <AnimatePresence>
              {role === 'driver' && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <BadgeInfo size={18} />
                    </div>
                    <input 
                      value={drivingLicense} 
                      onChange={(e) => setDrivingLicense(e.target.value)} 
                      placeholder="Driving License Number" 
                      className="w-full bg-slate-900/50 border border-slate-700 focus:border-emerald-500 rounded-xl py-3 pl-10 pr-4 outline-none transition-all focus:ring-2 focus:ring-emerald-500/20"
                      required={role === 'driver'} 
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <FileText size={18} />
                    </div>
                    <input 
                      value={rcNumber} 
                      onChange={(e) => setRcNumber(e.target.value)} 
                      placeholder="RC Number" 
                      className="w-full bg-slate-900/50 border border-slate-700 focus:border-emerald-500 rounded-xl py-3 pl-10 pr-4 outline-none transition-all focus:ring-2 focus:ring-emerald-500/20"
                      required={role === 'driver'} 
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Car size={18} />
                    </div>
                    <input 
                      value={busRegistration} 
                      onChange={(e) => setBusRegistration(e.target.value)} 
                      placeholder="Bus Registration (e.g. RJ14-TR-101)" 
                      className="w-full bg-slate-900/50 border border-slate-700 focus:border-emerald-500 rounded-xl py-3 pl-10 pr-4 outline-none transition-all focus:ring-2 focus:ring-emerald-500/20"
                      required={role === 'driver'} 
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          <button type="submit" className={`mt-8 w-full rounded-xl py-3.5 font-bold text-white transition-all ${role === 'driver' ? 'bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_15px_rgba(5,150,105,0.4)]' : 'bg-blue-600 hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)]'}`}>
            Register as {role === 'driver' ? 'Driver' : 'Passenger'}
          </button>
          
          <div className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </form>
    </motion.main>
  )
}
