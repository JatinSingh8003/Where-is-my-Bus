import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LogIn, Mail, Lock } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Login failed')
    }
  }

  return (
    <motion.main 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="pointer-events-auto flex w-full max-w-md flex-col"
    >
      <form onSubmit={handleSubmit} className="glass-panel rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Glow behind form */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/30 rounded-full blur-[60px] pointer-events-none"></div>

        <div className="relative z-10">
          <div className="mb-8 text-center">
            <div className="mx-auto w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-4 text-blue-400">
              <LogIn size={24} />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
            <p className="mt-2 text-sm text-slate-400">Enter your credentials to access Tracer.</p>
          </div>

          <div className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-xl text-center">
                {error}
              </div>
            )}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail size={18} />
              </div>
              <input 
                type="email"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Email address" 
                className="w-full bg-slate-900/50 border border-slate-700 focus:border-blue-500 rounded-xl py-3 pl-10 pr-4 outline-none transition-all focus:ring-2 focus:ring-blue-500/20" 
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
                className="w-full bg-slate-900/50 border border-slate-700 focus:border-blue-500 rounded-xl py-3 pl-10 pr-4 outline-none transition-all focus:ring-2 focus:ring-blue-500/20" 
                required 
              />
            </div>
          </div>

          <button type="submit" className="mt-8 w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-3.5 font-bold text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all">
            Sign In
          </button>
          
          <div className="mt-6 text-center text-sm text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
              Create one now
            </Link>
          </div>
        </div>
      </form>
    </motion.main>
  )
}
