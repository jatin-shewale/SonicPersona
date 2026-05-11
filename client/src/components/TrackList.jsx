import { motion } from 'framer-motion'
import { ExternalLink, Music } from 'lucide-react'

export function ArtistGrid({ artists }) {
  if (!artists?.length) return null

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {artists.slice(0, 10).map((artist, i) => (
        <motion.a
          key={artist.id}
          href={artist.external_url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05 }}
          className="group flex flex-col items-center gap-2 p-3 rounded-xl glass border border-white/5 hover:border-brand-green/30 transition-all card-hover"
        >
          {artist.images?.[0]?.url ? (
            <img
              src={artist.images[0].url}
              alt={artist.name}
              className="w-14 h-14 rounded-full object-cover border border-white/10 group-hover:border-brand-green/40 transition-all"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
              <Music size={20} className="text-white/30" />
            </div>
          )}
          <div className="text-center min-w-0 w-full">
            <p className="text-white text-xs font-display font-semibold truncate">{artist.name}</p>
            <p className="text-white/30 text-[10px] font-mono">#{i + 1}</p>
          </div>
        </motion.a>
      ))}
    </div>
  )
}

export function TrackList({ tracks }) {
  if (!tracks?.length) return null

  return (
    <div className="space-y-2">
      {tracks.slice(0, 15).map((track, i) => (
        <motion.div
          key={track.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.04 }}
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/3 transition-all group"
        >
          <span className="text-white/20 text-xs font-mono w-5 shrink-0 text-right">{i + 1}</span>

          {track.album_image ? (
            <img
              src={track.album_image}
              alt={track.album}
              className="w-10 h-10 rounded-lg object-cover shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
              <Music size={14} className="text-white/20" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-display font-medium truncate">{track.name}</p>
            <p className="text-white/40 text-xs font-body truncate">{track.artists?.join(', ')}</p>
          </div>

          {track.external_url && (
            <a
              href={track.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-white/5"
            >
              <ExternalLink size={12} className="text-white/40" />
            </a>
          )}
        </motion.div>
      ))}
    </div>
  )
}
