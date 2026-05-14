import { motion } from 'framer-motion'
import { Music, Sun, User } from 'lucide-react'

export function AlterEgoCard({ alterEgo, aiInsights }) {
  if (!alterEgo) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      className="glass rounded-2xl p-6 border border-white/5 relative overflow-hidden"
    >
      <div
        className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-15 blur-2xl"
        style={{ background: alterEgo.color || '#1DB954' }}
      />
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3 text-white/30 text-xs font-mono uppercase tracking-widest">
          <User size={12} />
          <Music size={12} />
          <span>Your Music Alter Ego</span>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-2xl">
            {alterEgo.emoji}
          </div>
          <div>
            <h3 className="font-display font-extrabold text-xl text-white">{alterEgo.name}</h3>
            <p className="text-white/40 text-sm font-body">{alterEgo.title}</p>
          </div>
        </div>
        {aiInsights?.alter_ego && (
          <p className="text-white/60 text-sm font-body leading-relaxed italic">
            "{aiInsights.alter_ego}"
          </p>
        )}
      </div>
    </motion.div>
  )
}

export function AuraCard({ aiInsights }) {
  if (!aiInsights?.emotional_aura) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass rounded-2xl p-6 border border-white/5 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-cyan-900/10 pointer-events-none" />
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3 text-white/30 text-xs font-mono uppercase tracking-widest">
          <Sun size={12} />
          <span>Emotional Aura</span>
        </div>
        <p className="text-white/80 font-body text-base leading-relaxed">
          {aiInsights.emotional_aura}
        </p>
      </div>
    </motion.div>
  )
}
