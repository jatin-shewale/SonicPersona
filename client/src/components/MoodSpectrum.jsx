import { motion } from 'framer-motion'
import { Zap, Music2, Headphones, Sun, Music, Mic } from 'lucide-react'

const MOOD_CONFIG = {
  energy: { label: 'Energy', icon: Zap, desc: 'Intensity & power' },
  danceability: { label: 'Danceability', icon: Music2, desc: 'Groove & rhythm' },
  acousticness: { label: 'Acoustic', icon: Headphones, desc: 'Natural & raw sound' },
  valence: { label: 'Positivity', icon: Sun, desc: 'Emotional brightness' },
  instrumentalness: { label: 'Instrumental', icon: Music, desc: 'Music over lyrics' },
  speechiness: { label: 'Vocal Depth', icon: Mic, desc: 'Spoken word energy' },
}

const getBarColor = (value) => {
  if (value >= 70) return 'from-brand-green to-emerald-400'
  if (value >= 40) return 'from-cyan-500 to-blue-500'
  return 'from-purple-500 to-indigo-500'
}

export default function MoodSpectrum({ data }) {
  if (!data) return null

  return (
    <div className="space-y-4">
      {Object.entries(MOOD_CONFIG).map(([key, config], i) => {
        const value = data[key] ?? 0
        return (
          <motion.div
            key={key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <config.icon size={14} className="text-white/70" />
                <span className="text-white text-xs font-display font-bold uppercase tracking-wider">{config.label}</span>
                <span className="text-white/20 text-xs font-body hidden sm:block">· {config.desc}</span>
              </div>
              <span className="text-brand-green text-xs font-mono font-bold">{value}%</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full bg-gradient-to-r ${getBarColor(value)}`}
                initial={{ width: 0 }}
                animate={{ width: `${value}%` }}
                transition={{ duration: 1.2, ease: 'easeOut', delay: i * 0.1 }}
              />
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
