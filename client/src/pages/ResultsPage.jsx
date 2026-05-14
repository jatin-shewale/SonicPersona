import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { RefreshCw, BarChart3, Music2, Users, Clock, TrendingUp, Brain, Share2, AlertTriangle, Star } from 'lucide-react'
import AnimatedBackground from '../components/AnimatedBackground'
import PersonalityCard from '../components/PersonalityCard'
import MoodSpectrum from '../components/MoodSpectrum'
import GenreChart from '../components/GenreChart'
import InsightCards from '../components/InsightCards'
import { AlterEgoCard, AuraCard } from '../components/AuraCard'
import { ArtistGrid, TrackList } from '../components/TrackList'
import ShareCard from '../components/ShareCard'
import PlaylistButton from '../components/PlaylistButton'

function StatBadge({ icon: Icon, value, label, color }) {
  return (
    <div className="flex flex-col items-center p-4 rounded-2xl glass border border-white/5">
      <Icon size={16} className="mb-2" style={{ color }} />
      <span className="font-display font-extrabold text-2xl text-white">{value?.toLocaleString()}</span>
      <span className="text-white/30 text-xs font-mono mt-0.5">{label}</span>
    </div>
  )
}

function Section({ title, children, className = '' }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6 }}
      className={`mb-12 ${className}`}
    >
      <h2 className="font-display font-bold text-xl text-white mb-5 flex items-center gap-2">
        {title}
      </h2>
      {children}
    </motion.section>
  )
}

export default function ResultsPage() {
  const navigate = useNavigate()
  const [result, setResult] = useState(null)
  const [isDemo, setIsDemo] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    const stored = sessionStorage.getItem('sonic_persona_result')
    if (!stored) {
      navigate('/loading')
      return
    }
    try {
      setResult(JSON.parse(stored))
      setIsDemo(sessionStorage.getItem('is_demo') === 'true')
    } catch {
      navigate('/')
    }
  }, [navigate])

  if (!result) return null

  const { archetype, genre_dna, mood_spectrum, alter_ego, top_artists, top_tracks, stats, listening_era, ai_insights } = result

  const archetypeColor = archetype?.color ?? '#1DB954'
  const tabs = ['overview', 'music', 'share']

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground
        color1={archetypeColor}
        color2="#7c3aed"
        color3="#0891b2"
      />

      {/* Demo banner */}
      {isDemo && (
        <div className="fixed top-16 left-0 right-0 z-40 flex justify-center">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono">
            <AlertTriangle size={14} /> Demo Mode — Connect Spotify for real results
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-20">

        {/* Hero header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <p className="text-white/30 text-xs font-mono uppercase tracking-widest mb-3">Your Sonic Identity</p>
          <h1 className="font-display font-extrabold text-4xl sm:text-6xl text-white mb-2">
            {archetype?.emoji} {archetype?.name}
          </h1>
          <p className="text-white/40 font-body text-base sm:text-lg max-w-xl mx-auto">
            {archetype?.description}
          </p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10"
        >
          <StatBadge icon={Users} value={stats?.unique_artists} label="Top Artists" color="#1DB954" />
          <StatBadge icon={Music2} value={stats?.total_tracks_analyzed} label="Tracks Analyzed" color="#8b5cf6" />
          <StatBadge icon={BarChart3} value={stats?.unique_genres} label="Genres" color="#06b6d4" />
          <StatBadge icon={Clock} value={stats?.total_minutes} label="Minutes" color="#f59e0b" />
        </motion.div>

        {/* Tab nav */}
        <div className="flex gap-1 p-1 rounded-2xl glass border border-white/5 mb-10 w-fit mx-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-xl font-display font-bold text-sm capitalize transition-all ${
                activeTab === tab
                  ? 'bg-white/10 text-white'
                  : 'text-white/30 hover:text-white/60'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <Section title={<> <Star size={18} /> Your Archetype & Music Alter Ego</>}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PersonalityCard archetype={archetype} aiInsights={ai_insights} />
              <div className="space-y-4">
                <AlterEgoCard alterEgo={alter_ego} aiInsights={ai_insights} />
                <AuraCard aiInsights={ai_insights} />
              </div>
            </div>
          </Section>

            {/* Insights */}
            <Section title={<> <Brain size={18} /> AI Personality Readings</>}>
              <InsightCards aiInsights={ai_insights} />
            </Section>

            {/* Mood + Genre side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Section title={<> <Music2 size={18} /> Mood Spectrum</>}>
                <div className="glass rounded-2xl p-6 border border-white/5">
                  <MoodSpectrum data={mood_spectrum} />
                </div>
              </Section>

              <Section title={<> <BarChart3 size={18} /> Genre DNA</>}>
                <div className="glass rounded-2xl p-6 border border-white/5">
                  <GenreChart data={genre_dna} />
                </div>
              </Section>
            </div>

            {/* Listening Era */}
            {listening_era && (
              <Section title="📡 Listening Era">
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass rounded-2xl p-6 border border-white/5"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                      <TrendingUp size={24} className="text-amber-400" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-xl text-white mb-1">
                        {listening_era.dominant_era}
                      </h3>
                      <p className="text-white/50 font-body text-sm leading-relaxed mb-3">
                        {listening_era.era_description}
                      </p>
                      {listening_era.avg_year && (
                        <div className="flex items-center gap-2">
                          <span className="text-white/30 text-xs font-mono">Avg. release year:</span>
                          <span className="text-amber-400 font-mono font-bold text-sm">{listening_era.avg_year}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </Section>
            )}

            {/* Create playlist */}
            <Section title={<> <Music2 size={18} /> Create Your Playlist</>}>
              <div className="glass rounded-2xl p-8 border border-white/5 text-center">
                <p className="text-white/50 font-body text-sm mb-6 max-w-sm mx-auto">
                  Automatically generate a "My Musical DNA 🧬" playlist in your Spotify account with your top tracks.
                </p>
                <PlaylistButton tracks={top_tracks} archetypeName={archetype?.name} />
              </div>
            </Section>
          </div>
        )}

        {/* MUSIC TAB */}
        {activeTab === 'music' && (
          <div className="space-y-10">
            <Section title={<> <Users size={18} /> Your Top Artists</>}>
              <ArtistGrid artists={top_artists} />
            </Section>
            <Section title={<> <Music2 size={18} /> Your Top Tracks</>}>
              <div className="glass rounded-2xl border border-white/5 overflow-hidden">
                <TrackList tracks={top_tracks} />
              </div>
            </Section>
          </div>
        )}

        {/* SHARE TAB */}
        {activeTab === 'share' && (
          <div className="max-w-lg mx-auto">
            <Section title={<> <Share2 size={18} /> Share Your Sonic Identity</>}>
              <p className="text-white/40 text-sm font-body mb-6 text-center">
                Download a beautiful card to share your music personality on social media.
              </p>
              <ShareCard result={result} />
            </Section>
          </div>
        )}

        {/* Re-analyze */}
        <div className="flex justify-center mt-16">
          <button
            onClick={() => {
              sessionStorage.removeItem('sonic_persona_result')
              sessionStorage.removeItem('is_demo')
              navigate('/loading')
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass border border-white/10 text-white/40 hover:text-white/70 hover:border-white/20 transition-all font-display text-sm"
          >
            <RefreshCw size={14} /> Re-analyze
          </button>
        </div>
      </div>
    </div>
  )
}
