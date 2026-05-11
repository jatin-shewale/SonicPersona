import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { genre, percentage, color } = payload[0].payload
    return (
      <div className="glass px-3 py-2 rounded-xl border border-white/10 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: color }} />
          <span className="text-white capitalize font-display font-medium">{genre}</span>
          <span className="text-brand-green font-mono font-bold ml-1">{percentage}%</span>
        </div>
      </div>
    )
  }
  return null
}

export default function GenreChart({ data }) {
  if (!data || data.length === 0) {
    return <p className="text-center text-white/30 py-8 font-body">No genre data available</p>
  }

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={85}
            innerRadius={45}
            paddingAngle={3}
            dataKey="percentage"
            nameKey="genre"
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} stroke="rgba(0,0,0,0.3)" strokeWidth={1} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {data.slice(0, 6).map((g) => (
          <div key={g.genre} className="flex items-center gap-2 min-w-0">
            <div className="w-2 h-2 rounded-full shrink-0" style={{ background: g.color }} />
            <span className="text-xs text-white/60 capitalize truncate font-body">{g.genre}</span>
            <span className="text-xs text-white/30 font-mono ml-auto">{g.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
