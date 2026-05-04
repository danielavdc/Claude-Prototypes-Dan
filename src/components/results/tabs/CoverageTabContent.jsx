import { Box, Typography, Paper, Divider } from '@mui/material'
import WidgetCard, { SectionHeader, MetricBlock, MiniLineChart, HBar } from './WidgetCard'

const MULTI_COLORS = ['#1D9F9F', '#9C4DD6', '#CF2D8A', '#FF9800', '#2196F3', '#4CAF50']

function MultiLineChart({ datasets, height = 140 }) {
  const w = 400, h = height
  const allVals = datasets.flatMap(d => d.data)
  const max = Math.max(...allVals), min = Math.min(...allVals)
  const range = max - min || 1
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ width: '100%', height }}>
      {datasets.map((ds, di) => {
        const pts = ds.data.map((v, i) => `${(i / (ds.data.length - 1)) * w},${h - ((v - min) / range) * (h - 4) - 2}`).join(' ')
        return <polyline key={di} points={pts} fill="none" stroke={MULTI_COLORS[di % MULTI_COLORS.length]} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      })}
    </svg>
  )
}

function StackedBar({ categories, data, height = 180 }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 0.5, height, pt: 1 }}>
      {data.map((col, ci) => {
        const total = col.reduce((a, b) => a + b, 0)
        return (
          <Box key={ci} sx={{ flex: 1, display: 'flex', flexDirection: 'column-reverse', height: '100%', justifyContent: 'flex-start' }}>
            {col.map((v, vi) => (
              <Box key={vi} sx={{ width: '100%', height: `${(v / total) * 100}%`, bgcolor: MULTI_COLORS[vi], opacity: 0.85 }} />
            ))}
            <Typography sx={{ fontSize: 10, color: 'text.secondary', textAlign: 'center', mt: 0.5, transform: 'rotate(-30deg)', transformOrigin: 'center', whiteSpace: 'nowrap' }}>{categories[ci]}</Typography>
          </Box>
        )
      })}
    </Box>
  )
}

const MENTION_DATA = [12, 18, 14, 22, 19, 28, 17, 24, 20, 32, 25, 18, 30, 22, 35, 28, 20, 26, 18, 24, 30, 22, 28, 35, 20, 25, 30, 22, 18, 26]
const REACH_DATA   = [20, 28, 22, 35, 30, 42, 28, 36, 32, 48, 38, 28, 45, 34, 52, 42, 32, 40, 28, 38, 45, 34, 42, 52, 32, 38, 45, 34, 28, 40]

const MULTI_DATASETS = [
  { label: 'Online News', data: [8,12,9,15,11,18,12,16,14,20,16,11,19,14,22,18,14,17,11,16,19,14,18,22,14,16,19,14,11,17] },
  { label: 'Twitter/X', data: [3,5,4,6,5,8,4,7,5,9,7,4,8,6,10,8,5,7,4,6,8,6,7,10,5,7,8,6,4,7] },
  { label: 'Blogs', data: [1,2,1,2,2,3,2,2,2,3,2,2,3,2,3,2,2,2,2,2,3,2,2,3,2,2,3,2,2,2] },
]

const ENGAGEMENT_DATA  = [5,8,6,10,8,14,9,11,10,16,12,8,14,10,18,14,10,12,8,11,14,10,13,18,10,12,14,10,8,12]
const ENGAGEMENT_MULTI = [
  { label: 'Likes',    data: [30,45,35,55,48,70,40,52,46,75,58,42,68,50,82,65,48,57,42,53,67,50,62,82,48,57,67,50,42,57] },
  { label: 'Shares',   data: [12,18,14,22,19,28,17,21,18,30,23,17,27,20,33,26,19,23,17,21,27,20,25,33,19,23,27,20,17,23] },
  { label: 'Comments', data: [5,8,6,10,8,12,7,9,8,13,10,7,12,9,14,11,8,10,7,9,12,9,11,14,8,10,12,9,7,10] },
]

const HASHTAGS = [
  { label: '#PepsiCo', value: 4200 }, { label: '#Pepsi', value: 3800 }, { label: '#SuperBowl', value: 3100 },
  { label: '#SodaWars', value: 2400 }, { label: '#ZeroSugar', value: 1900 }, { label: '#DrinkPepsi', value: 1400 },
]

const COUNTRIES = [
  { flag: '🇺🇸', label: 'United States', value: 42800, pct: 100 },
  { flag: '🇬🇧', label: 'United Kingdom', value: 12300, pct: 29 },
  { flag: '🇨🇦', label: 'Canada', value: 8700, pct: 20 },
  { flag: '🇦🇺', label: 'Australia', value: 6200, pct: 14 },
  { flag: '🇩🇪', label: 'Germany', value: 3100, pct: 7 },
  { flag: '🇫🇷', label: 'France', value: 2800, pct: 6 },
]

const TOP_SOURCES = [
  { name: 'CNN', reach: '2.4M' }, { name: 'USA Today', reach: '1.9M' },
  { name: 'The New York Times', reach: '1.7M' }, { name: 'The Guardian', reach: '1.2M' },
  { name: 'Business Insider', reach: '980k' },
]

const EMERGING_KEYWORDS = ['artificial intelligence', 'sustainability', 'brand loyalty', 'Gen Z', 'healthier options', 'zero sugar', 'esports', 'metaverse', 'streaming', 'influencer marketing']
const EMERGING_HASHTAGS = ['#ZeroSugar', '#HealthyDrinks', '#PepsiMoment', '#GenZChoice', '#DrinkSmart', '#Refresh', '#PepsiXGaming', '#SustainableSips']

const HEATMAP_DATA = Array.from({ length: 7 }, (_, r) => Array.from({ length: 24 }, (_, c) => {
  const base = c >= 9 && c <= 21 ? Math.random() * 80 + 20 : Math.random() * 20
  return Math.round(base * (r === 2 || r === 4 ? 1.4 : 1))
}))
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function CoverageTabContent({ onDashboardSave, loading }) {
  if (loading) return null
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>

      {/* MENTIONS */}
      <SectionHeader>Mentions</SectionHeader>

      <WidgetCard title="Mentions Trend">
        <Box sx={{ display: 'flex', gap: 3, mb: 1.5 }}>
          <MetricBlock label="Total Mentions" value="3.93k" delta={37} deltaLabel="vs prev period" />
          <MetricBlock label="Daily Average" value="561" delta={-8} deltaLabel="vs prev period" />
        </Box>
        <MiniLineChart data={MENTION_DATA} height={100} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
          {['Weekly', 'Monthly'].map(l => <Typography key={l} sx={{ fontSize: 12, color: '#1D9F9F', cursor: 'pointer', mr: 1 }}>{l}</Typography>)}
        </Box>
      </WidgetCard>

      <WidgetCard title="Mentions by Source">
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 1 }}>
          {MULTI_DATASETS.map((ds, i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: MULTI_COLORS[i] }} />
              <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{ds.label}</Typography>
            </Box>
          ))}
        </Box>
        <MultiLineChart datasets={MULTI_DATASETS} height={120} />
      </WidgetCard>

      {/* ENGAGEMENT */}
      <SectionHeader>Engagement</SectionHeader>

      <WidgetCard title="Engagement Trend">
        <Box sx={{ display: 'flex', gap: 3, mb: 1.5 }}>
          <MetricBlock label="Total Engagement" value="17.6k" delta={12} deltaLabel="vs prev period" />
          <MetricBlock label="Daily Average" value="2.52k" delta={5} deltaLabel="vs prev period" />
        </Box>
        <MiniLineChart data={ENGAGEMENT_DATA} color="#9C4DD6" height={100} />
      </WidgetCard>

      <WidgetCard title="Engagement Sharing Across Type">
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 1 }}>
          {ENGAGEMENT_MULTI.map((ds, i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: MULTI_COLORS[i] }} />
              <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{ds.label}</Typography>
            </Box>
          ))}
        </Box>
        <MultiLineChart datasets={ENGAGEMENT_MULTI} height={120} />
      </WidgetCard>

      {/* LOCATIONS */}
      <SectionHeader>Locations</SectionHeader>

      <Box sx={{ display: 'flex', gap: 1.5 }}>
        <WidgetCard title="Locations by Reach" height="auto">
          <Box sx={{ flex: 1 }}>
            {COUNTRIES.map((c, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
                <Typography sx={{ fontSize: 16 }}>{c.flag}</Typography>
                <Typography sx={{ fontSize: 13, flex: 1 }}>{c.label}</Typography>
                <Box sx={{ width: 80, height: 6, bgcolor: '#f0f0f0', borderRadius: 1 }}>
                  <Box sx={{ width: `${c.pct}%`, height: '100%', bgcolor: '#1D9F9F', borderRadius: 1 }} />
                </Box>
                <Typography sx={{ fontSize: 12, color: 'text.secondary', width: 42, textAlign: 'right' }}>{(c.value / 1000).toFixed(0)}k</Typography>
              </Box>
            ))}
          </Box>
        </WidgetCard>

        <WidgetCard title="Top Hashtags">
          {HASHTAGS.map((h, i) => <HBar key={i} label={h.label} value={h.value} max={4200} color="#CF2D8A" />)}
        </WidgetCard>
      </Box>

      {/* SOURCES */}
      <SectionHeader>Sources</SectionHeader>

      <WidgetCard title="Top Sources by Reach">
        <Box>
          {TOP_SOURCES.map((s, i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center', py: 0.75, borderBottom: i < TOP_SOURCES.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
              <Typography sx={{ fontSize: 13, color: 'text.secondary', width: 24 }}>{i + 1}</Typography>
              <Box sx={{ width: 28, height: 28, borderRadius: '50%', bgcolor: '#e3f2fd', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 1, flexShrink: 0 }}>
                <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#1565C0' }}>{s.name[0]}</Typography>
              </Box>
              <Typography sx={{ fontSize: 14, flex: 1 }}>{s.name}</Typography>
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#212121' }}>{s.reach}</Typography>
            </Box>
          ))}
        </Box>
      </WidgetCard>

      {/* EMERGING */}
      <SectionHeader>Emerging</SectionHeader>

      <Box sx={{ display: 'flex', gap: 1.5 }}>
        <WidgetCard title="Emerging Keywords">
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mt: 0.5 }}>
            {EMERGING_KEYWORDS.map((kw, i) => (
              <Typography key={i} sx={{ fontSize: 11 + (i % 3) * 2, fontWeight: i < 3 ? 700 : 400, color: MULTI_COLORS[i % MULTI_COLORS.length], cursor: 'pointer' }}>{kw}</Typography>
            ))}
          </Box>
        </WidgetCard>
        <WidgetCard title="Emerging Hashtags">
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mt: 0.5 }}>
            {EMERGING_HASHTAGS.map((ht, i) => (
              <Typography key={i} sx={{ fontSize: 11 + (i % 3) * 2, fontWeight: i < 3 ? 700 : 400, color: MULTI_COLORS[(i + 2) % MULTI_COLORS.length], cursor: 'pointer' }}>{ht}</Typography>
            ))}
          </Box>
        </WidgetCard>
      </Box>

      <WidgetCard title="Mentions Heatmap" noPad>
        <Box sx={{ px: 2, pb: 2 }}>
          <Box sx={{ display: 'flex', gap: 0, mt: 1 }}>
            <Box sx={{ width: 32, flexShrink: 0 }} />
            {Array.from({ length: 24 }, (_, h) => (
              <Box key={h} sx={{ flex: 1, textAlign: 'center' }}>
                {h % 6 === 0 && <Typography sx={{ fontSize: 9, color: 'text.secondary' }}>{h}h</Typography>}
              </Box>
            ))}
          </Box>
          {HEATMAP_DATA.map((row, ri) => (
            <Box key={ri} sx={{ display: 'flex', alignItems: 'center', gap: 0, mb: 0.25 }}>
              <Typography sx={{ fontSize: 10, color: 'text.secondary', width: 32, flexShrink: 0 }}>{DAYS[ri]}</Typography>
              {row.map((val, ci) => (
                <Box key={ci} sx={{ flex: 1, height: 14, bgcolor: `rgba(29,159,159,${val / 100})`, borderRadius: '2px', mx: '1px' }} />
              ))}
            </Box>
          ))}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, justifyContent: 'flex-end' }}>
            <Typography sx={{ fontSize: 10, color: 'text.secondary' }}>Low</Typography>
            {[0.1, 0.3, 0.5, 0.7, 0.9].map(o => <Box key={o} sx={{ width: 14, height: 14, bgcolor: `rgba(29,159,159,${o})`, borderRadius: '2px' }} />)}
            <Typography sx={{ fontSize: 10, color: 'text.secondary' }}>High</Typography>
          </Box>
        </Box>
      </WidgetCard>

    </Box>
  )
}
