import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { LogOut, Music2 } from 'lucide-react'

export default function Navbar() {
  const { user, authenticated, login, logout } = useAuth()

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 glass"
    >
      <a href="/" className="flex items-center gap-2 group">
        <div className="w-8 h-8 rounded-lg bg-brand-green flex items-center justify-center group-hover:scale-110 transition-transform">
          <Music2 size={16} className="text-black" />
        </div>
        <span className="font-display font-bold text-white text-lg tracking-tight">
          Sonic<span className="text-brand-green">Persona</span>
        </span>
      </a>

      <div className="flex items-center gap-3">
        {authenticated && user ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {user.images?.[0]?.url ? (
                <img
                  src={user.images[0].url}
                  alt={user.display_name}
                  className="w-8 h-8 rounded-full border border-white/10"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-brand-green/20 border border-brand-green/30 flex items-center justify-center">
                  <span className="text-brand-green text-xs font-bold font-display">
                    {user.display_name?.[0]?.toUpperCase()}
                  </span>
                </div>
              )}
              <span className="text-sm text-white/70 font-body hidden sm:block">
                {user.display_name}
              </span>
            </div>
            <button
              onClick={logout}
              className="p-2 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/5 transition-all"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <button
            onClick={login}
            className="px-4 py-2 rounded-full bg-brand-green text-black text-sm font-display font-bold hover:bg-green-400 transition-colors"
          >
            Connect Spotify
          </button>
        )}
      </div>
    </motion.nav>
  )
}
