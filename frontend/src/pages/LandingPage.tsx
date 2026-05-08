import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, MapPin, Activity, Zap } from 'lucide-react'

export function LandingPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="pointer-events-auto w-full max-w-4xl glass-panel rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden"
    >
      {/* Decorative Neon Accents */}
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-[var(--color-primary-glow)] rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-[var(--color-accent-glow)] rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10">
        <header className="flex items-center justify-between mb-16">
          <motion.h1 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold tracking-tight"
          >
            TRACER <span className="text-gradient">2.0</span>
          </motion.h1>
          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex gap-4"
          >
            <Link to="/login" className="px-6 py-2.5 rounded-full border border-white/20 hover:bg-white/10 transition-colors backdrop-blur-md">
              Login
            </Link>
            <Link to="/register" className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all font-medium text-white">
              Get Started
            </Link>
          </motion.div>
        </header>

        <main className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-6">
              Ambient <br />
              <span className="text-gradient">Intelligence</span> <br />
              for Transit.
            </h2>
            <p className="text-lg text-slate-400 mb-8 max-w-md leading-relaxed">
              Experience the next generation of public transit tracking. Predictive routing, live ambient monitoring, and a premium immersive map interface.
            </p>
            <Link to="/dashboard" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black font-bold hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all duration-300">
              Launch Dashboard <ArrowRight size={20} />
            </Link>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="grid gap-4"
          >
            {[
              { icon: MapPin, title: 'Immersive Maps', desc: 'Real-time dark mode rendering' },
              { icon: Activity, title: 'Live Telemetry', desc: 'Sub-second positional updates' },
              { icon: Zap, title: 'Smart Predictions', desc: 'AI-driven routing suggestions' }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                whileHover={{ scale: 1.02, x: 10 }}
                className="flex items-center gap-5 p-5 rounded-2xl glass border border-white/10 hover:border-blue-500/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <feature.icon size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-white">{feature.title}</h3>
                  <p className="text-sm text-slate-400">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </main>
      </div>
    </motion.div>
  )
}
