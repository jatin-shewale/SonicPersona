import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Download, Loader2, Instagram, MessageSquare, Copy } from 'lucide-react'

export default function ShareCard({ result }) {
  const cardRef = useRef(null)
  const [downloading, setDownloading] = useState(false)
  const [copied, setCopied] = useState(false)

  const shareText = `My SonicPersona archetype is ${result?.archetype?.name}. Download the card and share your music personality on Instagram or WhatsApp!`

  const handleDownload = async () => {
    if (!cardRef.current || downloading) return
    setDownloading(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      await new Promise((r) => setTimeout(r, 100))
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

  const handleShareWhatsApp = () => {
    const message = encodeURIComponent(`${shareText} #SonicPersona`)
    window.open(`https://api.whatsapp.com/send?text=${message}`, '_blank')
  }

  const handleShareInstagram = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My SonicPersona Card',
          text: shareText,
        })
        return
      } catch {
        // fallback to Instagram web if native share is unavailable
      }
    }
    const fallbackText = `${shareText} Download the PNG and post it to Instagram.`
    await navigator.clipboard.writeText(fallbackText)
    setCopied(true)
    window.open('https://www.instagram.com/', '_blank')
  }

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(shareText)
      setCopied(true)
    } catch (err) {
      console.error('Copy failed:', err)
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
              <div className="w-8 h-8 rounded-2xl bg-brand-green/10 border border-brand-green/20 flex items-center justify-center">
                <span className="text-brand-green text-base font-black">S</span>
              </div>
              <div>
                <p className="text-white text-sm font-display font-bold tracking-tight">SonicPersona</p>
                <p className="text-white/30 text-xs font-mono">Music identity studio</p>
              </div>
            </div>
            <span className="text-white/20 text-xs font-mono">sonicpersona.app</span>
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
      <div className="flex flex-col gap-4 items-center mt-6">
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

        <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
          <button
            onClick={handleShareInstagram}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#E1306C]/10 border border-[#E1306C]/20 text-[#E1306C] hover:bg-[#E1306C]/15 transition-all font-display text-sm"
          >
            <Instagram size={16} /> Instagram
          </button>
          <button
            onClick={handleShareWhatsApp}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] hover:bg-[#25D366]/15 transition-all font-display text-sm"
          >
            <MessageSquare size={16} /> WhatsApp
          </button>
          <button
            onClick={handleCopyText}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:border-white/20 transition-all font-display text-sm"
          >
            <Copy size={16} /> {copied ? 'Copied!' : 'Copy Text'}
          </button>
        </div>
      </div>
    </div>
  )
}
