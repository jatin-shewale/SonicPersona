import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AnimatedBackground from '../components/AnimatedBackground'
import { Sparkles, Music2, Zap, Brain, Share2, Clock, Heart, Headphones, Cloud } from 'lucide-react'

const features = [
  { icon: Brain, label: 'AI Personality', desc: 'Deep character analysis from your listening DNA' },
  { icon: Zap, label: 'Mood Spectrum', desc: 'Visualize your emotional audio fingerprint' },
  { icon: Music2, label: 'Genre DNA', desc: 'Discover your musical heritage and archetypes' },
  { icon: Share2, label: 'Share Cards', desc: 'Download beautiful cards to flex your taste' },
]

const archetypes = [
  { icon: Music2, name: 'The Melomaniac' },
  { icon: Zap, name: 'The Rager' },
  { icon: Cloud, name: 'The Dreamer' },
  { icon: Clock, name: 'The Nostalgic' },
  { icon: Sparkles, name: 'The Chameleon' },
  { icon: Brain, name: 'The Cerebral' },
  { icon: Heart, name: 'The Soulful' },
  { icon: Headphones, name: 'The Hipster' },
]

export default function HomePage() {
  const { authenticated, login } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (authenticated) {
      // Check for URL error param
      const params = new URLSearchParams(window.location.search)
      if (!params.get('error')) {
        // Don't auto-redirect — let user decide to analyze
      }
    }
  }, [authenticated, navigate])

  return (
    <div className="relative min-h-screen flex flex-col">
      <AnimatedBackground />

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 pt-24 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-brand-green/20 mb-8"
          >
            <Sparkles size={14} className="text-brand-green" />
            <span className="text-brand-green text-xs font-mono font-medium tracking-wider uppercase">
              AI-Powered Music Personality
            </span>
          </motion.div>

          {/* Headline */}
          <h1 className="font-display font-extrabold text-5xl sm:text-7xl leading-[1.05] tracking-tight mb-6">
            <span className="text-gradient-white">Your music</span>
            <br />
            <span className="text-gradient">decoded.</span>
          </h1>

          <p className="text-white/50 text-lg sm:text-xl font-body max-w-2xl mx-auto mb-10 leading-relaxed">
            Connect Spotify and discover your listening archetype, emotional aura, genre DNA, 
            and the music alter ego you never knew you had.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {authenticated ? (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/loading')}
                className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-brand-green text-black font-display font-bold text-lg glow-green hover:bg-green-400 transition-all"
              >
                <Sparkles size={20} />
                Analyze My Music
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={login}
                className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-brand-green text-black font-display font-bold text-lg glow-green hover:bg-green-400 transition-all"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
                Connect Spotify
              </motion.button>
            )}

            <motion.a
              whileHover={{ scale: 1.02 }}
              href="/personality/demo"
              className="px-6 py-4 rounded-2xl glass border border-white/10 text-white/60 font-display font-medium hover:text-white hover:border-white/20 transition-all text-sm"
            >
              Try Demo →
            </motion.a>
          </div>
        </motion.div>

        {/* Archetype ticker */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16 w-full max-w-4xl mx-auto"
        >
          <p className="text-white/20 text-xs font-mono uppercase tracking-widest mb-4">8 archetypes • which one are you?</p>
          <div className="flex flex-wrap justify-center gap-3">
            {archetypes.map((a, i) => (
              <motion.div
                key={a.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.06 }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl glass border border-white/5 text-sm"
              >
                <a.icon size={16} className="text-brand-green" />
                <span className="text-white/50 font-body text-xs">{a.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center font-display font-bold text-3xl text-white mb-12"
          >
            What you'll discover
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-6 border border-white/5 card-hover"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-green/10 flex items-center justify-center mb-4 border border-brand-green/20">
                  <f.icon size={18} className="text-brand-green" />
                </div>
                <h3 className="font-display font-bold text-white mb-2">{f.label}</h3>
                <p className="text-white/40 text-sm font-body leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-white/20 text-xs font-mono border-t border-white/5">
        Built with ♥ using Spotify API + Ollama/Llama3 · Not affiliated with Spotify AB
      </footer>
    </div>
  )
}
