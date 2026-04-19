import { TrendingUp, TrendingDown, BarChart2 } from 'lucide-react';
import { ANALYTICS_STATS } from '../../data/mockData';

export default function AnalyticsPanel() {
  return (
    <div className="card p-5 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-surface border border-surface-border flex items-center justify-center">
          <BarChart2 size={15} className="text-accent" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">Analytics</h3>
          <p className="text-xs text-zinc-500">Last 30 days · Updated live</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {ANALYTICS_STATS.map(stat => (
          <div key={stat.label} className="bg-surface rounded-xl p-3.5 border border-surface-border">
            <p className="text-xl font-bold text-white leading-none">{stat.value}</p>
            <p className="text-zinc-500 text-xs mt-1.5">{stat.label}</p>
            <div className={`flex items-center gap-1 mt-1.5 text-xs font-medium ${
              stat.change >= 0 ? 'text-accent' : 'text-red-400'
            }`}>
              {stat.change >= 0
                ? <TrendingUp size={11} />
                : <TrendingDown size={11} />}
              <span>{stat.change >= 0 ? '+' : ''}{stat.change}%</span>
              <span className="text-zinc-600 font-normal ml-0.5">{stat.period}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-surface rounded-xl p-4 border border-surface-border">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-zinc-400">Viewers over time</span>
          <span className="text-xs text-zinc-600">Last 7 streams</span>
        </div>
        <div className="flex items-end gap-2 h-16">
          {[40, 65, 50, 80, 70, 90, 100].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm transition-all duration-300 hover:opacity-80"
              style={{
                height: `${h}%`,
                backgroundColor: i === 6 ? '#00FF7F' : '#2A2A2A',
              }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
            <span key={d} className="text-xs text-zinc-600 flex-1 text-center">{d}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
