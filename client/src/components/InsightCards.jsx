import { motion } from 'framer-motion'
import { Flame, Star, Heart, Zap, Clock } from 'lucide-react'

function InsightCard({ icon: Icon, label, content, color, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="glass rounded-2xl p-5 border border-white/5 card-hover"
    >
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: `${color}20`, border: `1px solid ${color}30` }}
        >
          <Icon size={14} style={{ color }} />
        </div>
        <span className="text-white/40 text-xs font-mono uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-white/80 font-body text-sm leading-relaxed">{content}</p>
    </motion.div>
  )
}

export default function InsightCards({ aiInsights }) {
  if (!aiInsights) return null

  const cards = [
    {
      icon: Flame,
      label: '🔥 Roast',
      content: aiInsights.roast,
      color: '#ef4444',
      delay: 0,
    },
    {
      icon: Star,
      label: '✨ Compliment',
      content: aiInsights.compliment,
      color: '#f59e0b',
      delay: 0.1,
    },
    {
      icon: Zap,
      label: '⚡ Main Character Energy',
      content: aiInsights.main_character_energy,
      color: '#8b5cf6',
      delay: 0.2,
    },
    {
      icon: Heart,
      label: '💗 Relationship Energy',
      content: aiInsights.relationship_energy,
      color: '#ec4899',
      delay: 0.3,
    },
    {
      icon: Clock,
      label: '📡 Listening Era',
      content: aiInsights.listening_era,
      color: '#06b6d4',
      delay: 0.4,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {cards.filter(c => c.content).map((card) => (
        <InsightCard key={card.label} {...card} />
      ))}
    </div>
  )
}
