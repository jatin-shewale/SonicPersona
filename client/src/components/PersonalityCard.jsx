import { motion } from 'framer-motion'
import { Moon, Shuffle, Sparkles } from 'lucide-react'

export default function PersonalityCard({ archetype, aiInsights }) {
  if (!archetype) return null

  const nightScore = aiInsights?.night_drive_score ?? 0
  const chaosScore = aiInsights?.chaos_calm_meter ?? 50

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-3xl glass border border-white/8 p-8"
    >
      {/* Glow accent */}
      <div
        className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: archetype.color }}
      />

      <div className="relative z-10">
        {/* Archetype badge */}
        <div className="flex items-start gap-4 mb-6">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0"
            style={{ background: `${archetype.color}20`, border: `1px solid ${archetype.color}40` }}
          >
            {archetype.emoji}
          </div>
          <div>
            <div className="flex items-center gap-2 text-white/30 text-xs font-mono uppercase tracking-widest mb-1">
              <Sparkles size={12} />
              <span>Your Archetype</span>
            </div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
              {archetype.name}
            </h2>
          </div>
        </div>

        {/* AI Story */}
        {aiInsights?.archetype_story && (
          <div className="mb-6 p-4 rounded-2xl bg-white/3 border border-white/5">
            <p className="text-white/80 font-body text-base leading-relaxed italic">
              "{aiInsights.archetype_story}"
            </p>
          </div>
        )}

        {/* Traits */}
        <div className="flex flex-wrap gap-2 mb-6">
          {archetype.traits?.map((trait) => (
            <span
              key={trait}
              className="px-3 py-1 rounded-full text-xs font-display font-bold uppercase tracking-wider"
              style={{ background: `${archetype.color}15`, color: archetype.color, border: `1px solid ${archetype.color}30` }}
            >
              {trait}
            </span>
          ))}
        </div>

        {/* Meters */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 text-white/30 text-xs font-mono">
              <Moon size={14} />
              <span>Night Drive Score</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${nightScore}%` }}
                transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
              />
            </div>
            <span className="text-indigo-400 text-xs font-mono mt-1 block">{nightScore}/100</span>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2 text-white/30 text-xs font-mono">
              <Shuffle size={14} />
              <span>Chaos vs Calm</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-400"
                initial={{ width: 0 }}
                animate={{ width: `${chaosScore}%` }}
                transition={{ duration: 1.2, ease: 'easeOut', delay: 0.4 }}
              />
            </div>
            <span className="text-cyan-400 text-xs font-mono mt-1 block">
              {chaosScore < 30 ? 'Pure Calm' : chaosScore > 70 ? 'Chaotic Good' : 'Balanced'} · {chaosScore}/100
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
