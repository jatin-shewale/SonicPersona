import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Download, Loader2 } from 'lucide-react'

export default function ShareCard({ result }) {
  const cardRef = useRef(null)
  const [downloading, setDownloading] = useState(false)

  const handleDownload = async () => {
    if (!cardRef.current || downloading) return
    setDownloading(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      await new Promise(r => setTimeout(r, 100))
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#0a0a0f',
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
      })
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `sonic-persona-${result?.archetype?.name?.toLowerCase().replace(/\s+/g, '-') ?? 'card'}.png`
          a.click()
          URL.revokeObjectURL(url)
        }
        setDownloading(false)
      })
    } catch (err) {
      console.error('Download error:', err)
      setDownloading(false)
    }
  }

  if (!result) return null

  const { archetype, genre_dna, stats, ai_insights } = result

  return (
    <div>
      {/* Downloadable card */}
      <div
        ref={cardRef}
        className="relative overflow-hidden rounded-3xl p-8"
        style={{ background: 'linear-gradient(135deg, #0a0a0f 0%, #111118 50%, #0a0a14 100%)', border: '1px solid rgba(255,255,255,0.06)', maxWidth: 480, margin: '0 auto' }}
      >
        {/* Glow */}
        <div
          className="absolute top-0 left-0 w-72 h-72 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: archetype?.color ?? '#1DB954' }}
        />
        <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full opacity-10 blur-2xl pointer-events-none" style={{ background: '#7c3aed' }} />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-brand-green flex items-center justify-center">
                <span className="text-black text-xs font-bold">S</span>
              </div>
              <span className="font-display font-bold text-white text-sm tracking-tight">SonicPersona</span>
            </div>
            <span className="text-white/20 text-xs font-mono">sounddna.app</span>
          </div>

          {/* Archetype */}
          <div className="text-center mb-8">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4"
              style={{ background: `${archetype?.color}25`, border: `1px solid ${archetype?.color}50` }}
            >
              {archetype?.emoji}
            </div>
            <p className="text-white/40 text-xs font-mono uppercase tracking-widest mb-1">I am</p>
            <h2 className="font-display font-extrabold text-3xl text-white mb-2">{archetype?.name}</h2>
            <p className="text-white/50 text-sm font-body italic max-w-xs mx-auto leading-relaxed">
              "{ai_insights?.archetype_story?.split('.')[0]}."
            </p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { label: 'Artists', value: stats?.unique_artists ?? 0 },
              { label: 'Genres', value: stats?.unique_genres ?? 0 },
              { label: 'Minutes', value: stats?.total_minutes ?? 0 },
            ].map((s) => (
              <div key={s.label} className="text-center p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
                <p className="font-display font-extrabold text-xl" style={{ color: archetype?.color ?? '#1DB954' }}>
                  {s.value.toLocaleString()}
                </p>
                <p className="text-white/30 text-xs font-mono mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Top genres */}
          <div className="flex flex-wrap gap-2 justify-center">
            {genre_dna?.slice(0, 4).map((g) => (
              <span
                key={g.genre}
                className="px-3 py-1 rounded-full text-xs font-display font-bold capitalize"
                style={{ background: `${g.color}20`, color: g.color, border: `1px solid ${g.color}40` }}
              >
                {g.genre}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Download button */}
      <div className="flex justify-center mt-6">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleDownload}
          disabled={downloading}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:border-white/20 transition-all font-display font-medium text-sm"
        >
          {downloading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Download size={16} />
          )}
          {downloading ? 'Generating...' : 'Download PNG'}
        </motion.button>
      </div>
    </div>
  )
}
