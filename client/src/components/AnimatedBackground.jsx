export default function AnimatedBackground({ color1 = '#1DB954', color2 = '#7c3aed', color3 = '#0891b2' }) {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Gradient orbs */}
      <div
        className="orb w-96 h-96 -top-20 -left-20"
        style={{ background: color1, animationDelay: '0s' }}
      />
      <div
        className="orb w-80 h-80 top-1/3 -right-20"
        style={{ background: color2, animationDelay: '2s' }}
      />
      <div
        className="orb w-64 h-64 bottom-1/4 left-1/3"
        style={{ background: color3, animationDelay: '4s' }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-brand-dark opacity-70" />
    </div>
  )
}
