import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ListMusic, Loader2, CheckCircle, ExternalLink } from 'lucide-react'
import axios from 'axios'

export default function PlaylistButton({ tracks, archetypeName }) {
  const [state, setState] = useState('idle') // idle | loading | success | error
  const [playlistUrl, setPlaylistUrl] = useState(null)

  const handleCreate = async () => {
    if (state !== 'idle') return
    setState('loading')
    try {
      const trackIds = tracks?.slice(0, 50).map(t => t.id).filter(Boolean) ?? []
      if (!trackIds.length) {
        setState('error')
        return
      }
      const { data } = await axios.post(
        '/playlist/create-dna',
        { track_ids: trackIds, archetype_name: archetypeName },
        { withCredentials: true }
      )
      setPlaylistUrl(data.playlist_url)
      setState('success')
    } catch {
      setState('error')
      setTimeout(() => setState('idle'), 3000)
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <motion.button
        whileHover={state === 'idle' ? { scale: 1.03 } : {}}
        whileTap={state === 'idle' ? { scale: 0.97 } : {}}
        onClick={handleCreate}
        disabled={state !== 'idle'}
        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-display font-bold text-sm transition-all
          ${state === 'idle' ? 'bg-brand-green text-black hover:bg-green-400' : ''}
          ${state === 'loading' ? 'bg-brand-green/50 text-black cursor-not-allowed' : ''}
          ${state === 'success' ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 cursor-not-allowed' : ''}
          ${state === 'error' ? 'bg-red-900/20 text-red-400 border border-red-500/30' : ''}
        `}
      >
        <AnimatePresence mode="wait">
          {state === 'idle' && <motion.span key="idle" className="flex items-center gap-2"><ListMusic size={16} /> Create "My Musical DNA" Playlist</motion.span>}
          {state === 'loading' && <motion.span key="loading" className="flex items-center gap-2"><Loader2 size={16} className="animate-spin" /> Creating playlist...</motion.span>}
          {state === 'success' && <motion.span key="success" className="flex items-center gap-2"><CheckCircle size={16} /> Playlist Created!</motion.span>}
          {state === 'error' && <motion.span key="error">Failed — try again</motion.span>}
        </AnimatePresence>
      </motion.button>

      {state === 'success' && playlistUrl && (
        <motion.a
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          href={playlistUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-brand-green text-sm hover:underline font-body"
        >
          <ExternalLink size={14} /> Open in Spotify
        </motion.a>
      )}
    </div>
  )
}
