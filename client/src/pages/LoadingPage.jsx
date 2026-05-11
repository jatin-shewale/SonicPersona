import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'

const LOADING_STEPS = [
  { label: 'Connecting to Spotify...', duration: 800 },
  { label: 'Reading your top artists...', duration: 1000 },
  { label: 'Analyzing your top tracks...', duration: 1000 },
  { label: 'Mapping your genre DNA...', duration: 900 },
  { label: 'Calculating mood spectrum...', duration: 900 },
  { label: 'Finding your archetype...', duration: 800 },
  { label: 'Generating AI personality reading...', duration: 2000 },
  { label: 'Finalizing your sonic identity...', duration: 600 },
]

export default function LoadingPage() {
  const navigate = useNavigate()
  const [stepIndex, setStepIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Start analysis fetch
    fetchAnalysis()

    // Animate through steps
    let current = 0
    let totalTime = 0
    const total = LOADING_STEPS.reduce((s, st) => s + st.duration, 0)

    const timers = LOADING_STEPS.map((step, i) => {
      const timer = setTimeout(() => {
        setStepIndex(i)
        setProgress(Math.round(((totalTime + step.duration) / total) * 100))
        totalTime += step.duration
      }, totalTime)
      totalTime += step.duration
      return timer
    })

    return () => timers.forEach(clearTimeout)
  }, [])

  const fetchAnalysis = async () => {
    try {
      const { data } = await axios.get('/personality/analyze', { withCredentials: true })
      // Store result and navigate
      sessionStorage.setItem('sonic_persona_result', JSON.stringify(data))
      // Wait for loading animation to feel good
      setTimeout(() => navigate('/results'), 7500)
    } catch (err) {
      console.error('Analysis error:', err)
      // Try demo fallback
      try {
        const { data } = await axios.get('/personality/demo')
        sessionStorage.setItem('sonic_persona_result', JSON.stringify(data))
        sessionStorage.setItem('is_demo', 'true')
        setTimeout(() => navigate('/results'), 7500)
      } catch {
        setError('Failed to analyze. Please try again.')
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Pulsing orb */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-96 h-96 rounded-full bg-brand-green opacity-5 animate-pulse-slow" />
        <div className="absolute w-64 h-64 rounded-full bg-brand-green opacity-5 animate-pulse-slow" style={{ animationDelay: '0.5s' }} />
        <div className="absolute w-32 h-32 rounded-full bg-brand-green opacity-10 animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      {/* Spinning ring */}
      <div className="relative w-32 h-32 mb-12">
        <svg className="spin-slow absolute inset-0 w-full h-full" viewBox="0 0 128 128">
          <circle cx="64" cy="64" r="60" fill="none" stroke="rgba(29,185,84,0.1)" strokeWidth="2" />
          <circle
            cx="64" cy="64" r="60"
            fill="none"
            stroke="url(#grad)"
            strokeWidth="2"
            strokeDasharray="377"
            strokeDashoffset={377 - (377 * progress / 100)}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1DB954" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono font-bold text-2xl text-brand-green">{progress}%</span>
        </div>
      </div>

      {/* Step text */}
      <div className="h-8 flex items-center justify-center mb-8">
        <AnimatePresence mode="wait">
          <motion.p
            key={stepIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-white/60 font-body text-lg text-center"
          >
            {error || LOADING_STEPS[stepIndex]?.label}
          </motion.p>
        </AnimatePresence>
      </div>

      <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-gradient text-center mb-4">
        Decoding your sonic DNA
      </h1>
      <p className="text-white/30 font-body text-center text-sm max-w-xs">
        AI is analyzing your listening history to build your unique music personality profile
      </p>

      {error && (
        <button
          onClick={() => window.location.href = '/'}
          className="mt-8 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white transition-colors font-display"
        >
          ← Go Back
        </button>
      )}
    </div>
  )
}
