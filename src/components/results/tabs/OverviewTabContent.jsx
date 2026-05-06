import { Box, Typography, Paper, Avatar, IconButton, Divider } from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd'
import MentionsTrendChart from '../MentionsTrendChart'
import TopKeywordsChart from '../TopKeywordsChart'
import LocationsChart from '../LocationsChart'
import SentimentChart from '../SentimentChart'

// ── shared helpers ──────────────────────────────────────────────────────────

const VFA = ({ onClick }) => (
  <Typography onClick={onClick} sx={{ fontSize: 13, fontWeight: 600, color: '#1D9F9F', cursor: 'pointer', whiteSpace: 'nowrap', '&:hover': { textDecoration: 'underline' } }}>
    View Full Analysis
  </Typography>
)

function WidgetHeader({ title, info = true, onVFA }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
        <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#212121' }}>{title}</Typography>
        {info && <InfoOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <VFA onClick={onVFA} />
        <IconButton size="small"><MoreVertIcon sx={{ fontSize: 18, color: 'text.secondary' }} /></IconButton>
      </Box>
    </Box>
  )
}

function Sparkline({ data, color = '#1D9F9F', height = 80 }) {
  const w = 300, h = height
  const max = Math.max(...data), min = Math.min(...data)
  const range = max - min || 1
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 4) - 2}`).join(' ')
  const fillPts = `0,${h} ${pts} ${w},${h}`
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" width="100%" height={height} style={{ display: 'block' }}>
      <polygon points={fillPts} fill={color} fillOpacity="0.12" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}

function Delta({ value, label = 'vs previous period' }) {
  const pos = value >= 0
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
      <Box sx={{
        display: 'flex', alignItems: 'center', gap: 0.25,
        bgcolor: pos ? '#E8F5E9' : '#FFEBEE',
        color: pos ? '#2E7D32' : '#C62828',
        fontSize: 11, fontWeight: 700, px: 0.75, py: 0.25, borderRadius: 1,
      }}>
        {pos ? <ArrowUpwardIcon sx={{ fontSize: 11 }} /> : <ArrowDownwardIcon sx={{ fontSize: 11 }} />}
        {Math.abs(value)}%
      </Box>
      <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{label}</Typography>
    </Box>
  )
}

function MiniTrend({ data, color = '#1D9F9F' }) {
  const w = 44, h = 16
  const max = Math.max(...data), min = Math.min(...data)
  const range = max - min || 1
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 2) - 1}`).join(' ')
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ width: w, height: h, flexShrink: 0 }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}

function ReachBar({ value, max }) {
  const pct = Math.round((value / max) * 100)
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography sx={{ fontSize: 13, color: '#424242', width: 48, textAlign: 'right', flexShrink: 0 }}>{pct}%</Typography>
      <Box sx={{ flex: 1, height: 8, bgcolor: '#f0f0f0', borderRadius: 1, overflow: 'hidden', minWidth: 80 }}>
        <Box sx={{ width: `${pct}%`, height: '100%', bgcolor: '#1D9F9F', borderRadius: 1 }} />
      </Box>
    </Box>
  )
}

// ── mock data ────────────────────────────────────────────────────────────────

const SPARKLINE_REACH = [20,28,22,35,30,42,28,36,32,48,38,28,45,34,52,42,32,40,28,38,45,34,42,52,32,38]
const SPARKLINE_NEWS  = [12,18,14,22,19,28,17,24,20,32,25,18,30,22,35,28,20,26,18,24,30,22,28,35,20,25]
const SPARKLINE_ENG   = [8,12,9,16,13,20,14,18,15,24,19,12,22,16,28,20,14,18,12,16,22,15,19,26,13,17]

const ENGAGEMENT_DATA = [5,8,6,10,8,14,9,12,10,16,12,8,15,10,18,14,10,12,8,11,14,10,13,18,10,12,14,10,8,12,16,12,8,14,10,18,14,10,12,8,15,22,18,12,9,8,12,18,14,10,16,20,15,10,8,12,18,22,16,12,8,10,16,12,9,14,20,28,18,14,12,8,10,14,18,22,16,12,9,12,18,14,10,8,12,18,24,16,12,9,14,18,14,12,8,10,16,12,10,14,18,24,16,12,8,10,16,12]

const NEWS_BY_SEARCHES = [
  { initials: 'SB', color: '#7B1FA2', name: 'Sarah Bennett', outlet: 'The Washington Post', mentions: '1.5k' },
  { initials: 'MR', color: '#1565C0', name: 'Michael Roberts', outlet: 'Reuters', mentions: '1.3k' },
  { initials: 'AK', color: '#2E7D32', name: 'Amanda Kim', outlet: 'Bloomberg', mentions: '1.1k' },
  { initials: 'DL', color: '#E65100', name: 'David Larson', outlet: 'The New York Times', mentions: '980' },
  { initials: 'PW', color: '#AD1457', name: 'Patricia Wu', outlet: 'Associated Press', mentions: '870' },
]

const SOURCE_TYPES = [
  { label: 'Online News', pct: 45, color: '#1D9F9F' },
  { label: 'Social Media', pct: 28, color: '#9C4DD6' },
  { label: 'Broadcast', pct: 14, color: '#CF2D8A' },
  { label: 'Print', pct: 8, color: '#FF9800' },
  { label: 'Other', pct: 5, color: '#bdbdbd' },
]

const LANGUAGES = [
  { lang: 'English',    mentions: '132.4k', pct: 60, trend: [10,14,12,18,14,22,18,16,12,14,18], up: true,  delta: '+5%' },
  { lang: 'Spanish',    mentions: '34.1k',  pct: 15, trend: [6,9,7,11,9,14,10,8,7,9,12],       up: false, delta: '-2%' },
  { lang: 'German',     mentions: '18.2k',  pct: 8,  trend: [4,6,5,8,6,9,7,6,5,7,8],           up: true,  delta: '+8%' },
  { lang: 'French',     mentions: '15.9k',  pct: 7,  trend: [3,5,4,7,5,8,6,5,4,6,7],           up: true,  delta: '+3%' },
  { lang: 'Portuguese', mentions: '11.3k',  pct: 5,  trend: [2,4,3,5,4,6,4,4,3,4,5],           up: false, delta: '-1%' },
]

const NEWS_SOURCES_REACH = [
  { initials: 'WP', color: '#212121', name: 'The Washington Post', reach: 9200, max: 10000 },
  { initials: 'BB', color: '#1565C0', name: 'Bloomberg',           reach: 8400, max: 10000 },
  { initials: 'RE', color: '#B71C1C', name: 'Reuters',             reach: 7800, max: 10000 },
  { initials: 'NY', color: '#1A237E', name: 'The New York Times',  reach: 6200, max: 10000 },
  { initials: 'AP', color: '#1B5E20', name: 'Associated Press',    reach: 4500, max: 10000 },
]

const JOURNALISTS_REACH = [
  { initials: 'SB', color: '#7B1FA2', name: 'Sarah Bennett',   outlet: 'Washington Post', reach: 8800, max: 10000, delta: 5 },
  { initials: 'MR', color: '#1565C0', name: 'Michael Roberts', outlet: 'Reuters',          reach: 7200, max: 10000, delta: -2 },
  { initials: 'AK', color: '#2E7D32', name: 'Amanda Kim',      outlet: 'Bloomberg',        reach: 6600, max: 10000, delta: 8 },
  { initials: 'DL', color: '#E65100', name: 'David Larson',    outlet: 'NYT',              reach: 5400, max: 10000, delta: 1 },
  { initials: 'PW', color: '#AD1457', name: 'Patricia Wu',     outlet: 'AP',               reach: 3900, max: 10000, delta: -4 },
]

// ── sub-components ───────────────────────────────────────────────────────────

function NewsKpiCards({ onVFA }) {
  const cards = [
    { title: 'Total Reach',  value: '1.27T', delta: 12, data: SPARKLINE_REACH, color: '#1D9F9F' },
    { title: 'News Volume',  value: '234k',  delta: -3, data: SPARKLINE_NEWS,  color: '#9C4DD6' },
    { title: 'Engagement',   value: '11.7B', delta: 8,  data: SPARKLINE_ENG,   color: '#CF2D8A' },
  ]
  return (
    <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, pt: 1.5, pb: 1 }}>
        <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#212121' }}>News KPIs</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <VFA onClick={onVFA} />
          <IconButton size="small"><MoreVertIcon sx={{ fontSize: 18, color: 'text.secondary' }} /></IconButton>
        </Box>
      </Box>
      <Divider />
      <Box sx={{ display: 'flex', width: '100%' }}>
        {cards.map((card, i) => (
          <Box key={i} sx={{ flex: 1, minWidth: 0, p: 2, borderRight: i < cards.length - 1 ? '1px solid #e0e0e0' : 'none' }}>
            <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 0.5, fontWeight: 500 }}>{card.title}</Typography>
            <Typography sx={{ fontSize: 28, fontWeight: 700, color: '#212121', lineHeight: 1.1 }}>{card.value}</Typography>
            <Delta value={card.delta} />
            <Box sx={{ mt: 1.5, width: '100%' }}>
              <Sparkline data={card.data} color={card.color} height={72} />
            </Box>
          </Box>
        ))}
      </Box>
    </Paper>
  )
}

function EngagementTrendChart({ onVFA }) {
  const data = ENGAGEMENT_DATA
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const w = 800, h = 200
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 16) - 8}`).join(' ')
  const fillPts = `0,${h} ${pts} ${w},${h}`

  return (
    <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, p: 2 }}>
      <WidgetHeader title="Engagement Trend" onVFA={onVFA} />
      <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
        <Box>
          <Typography sx={{ fontSize: 11, color: 'text.secondary', mb: 0.25 }}>Total Engagement</Typography>
          <Typography sx={{ fontSize: 22, fontWeight: 700, color: '#212121' }}>11.7B</Typography>
          <Delta value={8} />
        </Box>
        <Divider orientation="vertical" flexItem />
        <Box>
          <Typography sx={{ fontSize: 11, color: 'text.secondary', mb: 0.25 }}>Avg. per Article</Typography>
          <Typography sx={{ fontSize: 22, fontWeight: 700, color: '#212121' }}>49.8k</Typography>
          <Delta value={3} />
        </Box>
      </Box>
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ width: '100%', height: 160 }}>
        <defs>
          <linearGradient id="eng-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#CF2D8A" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#CF2D8A" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={fillPts} fill="url(#eng-grad)" />
        <polyline points={pts} fill="none" stroke="#CF2D8A" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
        {['Aug 25','Aug 26','Aug 27','Aug 28','Aug 29','Aug 30','Aug 31'].map(l => (
          <Typography key={l} sx={{ fontSize: 11, color: 'text.secondary' }}>{l}</Typography>
        ))}
      </Box>
    </Paper>
  )
}

function NewsBySearchesTable({ onVFA }) {
  return (
    <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, overflow: 'hidden' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, pt: 1.5, pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#212121' }}>News Sources by Searches</Typography>
          <InfoOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <VFA onClick={onVFA} />
          <IconButton size="small"><MoreVertIcon sx={{ fontSize: 18, color: 'text.secondary' }} /></IconButton>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', px: 2, py: 1, borderBottom: '1px solid #e0e0e0', borderTop: '1px solid #e0e0e0' }}>
        <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary', width: 36 }}>Rank</Typography>
        <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary', flex: 1 }}>Journalist / Source</Typography>
        <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary', width: 72, textAlign: 'right' }}>Mentions</Typography>
      </Box>
      {NEWS_BY_SEARCHES.map((row, i) => (
        <Box key={i} sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1.25, borderBottom: i < NEWS_BY_SEARCHES.length - 1 ? '1px solid #f5f5f5' : 'none', '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' } }}>
          <Typography sx={{ fontSize: 13, color: 'text.secondary', width: 36, fontWeight: 500 }}>#{i + 1}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flex: 1 }}>
            <Avatar sx={{ width: 36, height: 36, bgcolor: row.color, fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{row.initials}</Avatar>
            <Box>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#212121', lineHeight: 1.2 }}>{row.name}</Typography>
              <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{row.outlet}</Typography>
            </Box>
          </Box>
          <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#212121', width: 72, textAlign: 'right' }}>{row.mentions}</Typography>
        </Box>
      ))}
      <Box sx={{ px: 2, py: 1, borderTop: '1px solid #e0e0e0' }}>
        <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#1D9F9F', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>View all</Typography>
      </Box>
    </Paper>
  )
}

function SourceTypeDonut({ onVFA }) {
  const cx = 84, cy = 84, r = 64, inner = 40
  let angle = -Math.PI / 2
  const slices = SOURCE_TYPES.map(s => {
    const sweep = (s.pct / 100) * 2 * Math.PI
    const x1 = cx + r * Math.cos(angle)
    const y1 = cy + r * Math.sin(angle)
    angle += sweep
    const x2 = cx + r * Math.cos(angle)
    const y2 = cy + r * Math.sin(angle)
    const xi1 = cx + inner * Math.cos(angle - sweep)
    const yi1 = cy + inner * Math.sin(angle - sweep)
    const xi2 = cx + inner * Math.cos(angle)
    const yi2 = cy + inner * Math.sin(angle)
    const large = sweep > Math.PI ? 1 : 0
    return { ...s, d: `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${xi2} ${yi2} A ${inner} ${inner} 0 ${large} 0 ${xi1} ${yi1} Z` }
  })

  return (
    <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, p: 2, flex: 1 }}>
      <WidgetHeader title="Source Type Breakdown" onVFA={onVFA} />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <svg width={168} height={168} style={{ flexShrink: 0 }}>
          {slices.map((s, i) => (
            <path key={i} d={s.d} fill={s.color} opacity={0.9} />
          ))}
          <circle cx={cx} cy={cy} r={inner} fill="white" />
          <text x={cx} y={cy - 6} textAnchor="middle" fontSize="13" fontWeight="700" fill="#212121">234k</text>
          <text x={cx} y={cy + 10} textAnchor="middle" fontSize="11" fill="#757575">News</text>
        </svg>
        <Box sx={{ flex: 1 }}>
          {SOURCE_TYPES.map((s, i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: s.color, flexShrink: 0 }} />
              <Typography sx={{ fontSize: 13, color: '#424242', flex: 1 }}>{s.label}</Typography>
              <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#212121' }}>{s.pct}%</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Paper>
  )
}

function TopLanguageTable({ onVFA }) {
  return (
    <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, p: 2, flex: 1 }}>
      <WidgetHeader title="Top Language" onVFA={onVFA} />
      <Box sx={{ display: 'flex', pb: 1, borderBottom: '1px solid #e0e0e0', mb: 0.5 }}>
        <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary', flex: 1 }}>Language</Typography>
        <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary', width: 80, textAlign: 'right' }}>Mentions</Typography>
        <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary', width: 60, textAlign: 'center' }}>Trend</Typography>
        <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary', width: 48, textAlign: 'right' }}>Δ</Typography>
      </Box>
      {LANGUAGES.map((row, i) => (
        <Box key={i} sx={{ display: 'flex', alignItems: 'center', py: 1, borderBottom: i < LANGUAGES.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
          <Typography sx={{ fontSize: 14, color: '#212121', flex: 1 }}>{row.lang}</Typography>
          <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#212121', width: 80, textAlign: 'right' }}>{row.mentions}</Typography>
          <Box sx={{ width: 60, display: 'flex', justifyContent: 'center' }}>
            <MiniTrend data={row.trend} color={row.up ? '#1D9F9F' : '#E53935'} />
          </Box>
          <Box sx={{ width: 48, display: 'flex', justifyContent: 'flex-end' }}>
            <Box sx={{ bgcolor: row.up ? '#E8F5E9' : '#FFEBEE', color: row.up ? '#2E7D32' : '#C62828', fontSize: 11, fontWeight: 700, px: 0.75, py: 0.25, borderRadius: 1 }}>
              {row.delta}
            </Box>
          </Box>
        </Box>
      ))}
      <Box sx={{ mt: 1 }}>
        <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#1D9F9F', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>View all</Typography>
      </Box>
    </Paper>
  )
}

function ReachTable({ title, rows, onVFA }) {
  const hasDelta = rows[0]?.delta !== undefined
  return (
    <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, pt: 1.5, pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#212121' }}>{title}</Typography>
          <InfoOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <VFA onClick={onVFA} />
          <IconButton size="small"><MoreVertIcon sx={{ fontSize: 18, color: 'text.secondary' }} /></IconButton>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', px: 2, py: 1, borderBottom: '1px solid #e0e0e0', borderTop: '1px solid #e0e0e0' }}>
        <Box sx={{ flex: 1, minWidth: 0 }}><Typography sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary' }}>Name</Typography></Box>
        <Box sx={{ width: 160, flexShrink: 0 }}><Typography sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary' }}>Reach</Typography></Box>
        {hasDelta && <Box sx={{ width: 56, flexShrink: 0 }}><Typography sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary', textAlign: 'center' }}>Trend</Typography></Box>}
        <Box sx={{ width: 72, flexShrink: 0 }} />
      </Box>
      {rows.map((row, i) => (
        <Box key={i} sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1.25, borderBottom: i < rows.length - 1 ? '1px solid #f5f5f5' : 'none', '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flex: 1, minWidth: 0 }}>
            <Avatar sx={{ width: 36, height: 36, bgcolor: row.color, fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{row.initials}</Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#212121', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.name}</Typography>
              {row.outlet && <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{row.outlet}</Typography>}
            </Box>
          </Box>
          <Box sx={{ width: 160, flexShrink: 0 }}>
            <ReachBar value={row.reach} max={row.max} />
          </Box>
          {hasDelta && (
            <Box sx={{ width: 56, flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
              <Box sx={{ bgcolor: row.delta >= 0 ? '#E8F5E9' : '#FFEBEE', color: row.delta >= 0 ? '#2E7D32' : '#C62828', fontSize: 11, fontWeight: 700, px: 0.75, py: 0.25, borderRadius: 1 }}>
                {row.delta >= 0 ? '+' : ''}{row.delta}%
              </Box>
            </Box>
          )}
          <Box sx={{ width: 72, flexShrink: 0, display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
            <IconButton size="small"><OpenInNewIcon sx={{ fontSize: 16, color: 'text.secondary' }} /></IconButton>
            <IconButton size="small"><PlaylistAddIcon sx={{ fontSize: 16, color: 'text.secondary' }} /></IconButton>
          </Box>
        </Box>
      ))}
      <Box sx={{ px: 2, py: 1, borderTop: '1px solid #e0e0e0' }}>
        <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#1D9F9F', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>View all</Typography>
      </Box>
    </Paper>
  )
}

// ── main export ──────────────────────────────────────────────────────────────

export default function OverviewTabContent({ loading, onDashboardSave, onWidgetInsight, onFilteredMentions, onSpikeAnalysis, navigateToTab }) {
  const nav = (tab, sub = null) => navigateToTab?.(tab, sub)
  return (
    <>
      <NewsKpiCards         onVFA={() => nav(4, 'news-coverage')} />
      <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, p: 2, height: 429 }}>
        <MentionsTrendChart
          showViewFullAnalysis
          onViewFullAnalysis={() => nav(1, 'volume')}
          loading={loading}
          onDashboardSave={onDashboardSave}
          onDataPointClick={onFilteredMentions}
          onViewMoreInsights={onSpikeAnalysis}
          onWidgetInsight={onWidgetInsight}
        />
      </Paper>
      <EngagementTrendChart  onVFA={() => nav(1, 'volume')} />
      <NewsBySearchesTable   onVFA={() => nav(4, 'news-coverage')} />
      <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, p: 2 }}>
        <TopKeywordsChart showViewFullAnalysis onViewFullAnalysis={() => nav(2)} onDashboardSave={onDashboardSave} onDataPointClick={onFilteredMentions} onWidgetInsight={onWidgetInsight} />
      </Paper>
      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
        <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, p: 2, flex: 1, minWidth: 280 }}>
          <LocationsChart showViewFullAnalysis onViewFullAnalysis={() => nav(1, 'locations')} onDashboardSave={onDashboardSave} onDataPointClick={onFilteredMentions} onWidgetInsight={onWidgetInsight} />
        </Paper>
        <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, p: 2, flex: 1, minWidth: 280 }}>
          <SentimentChart showViewFullAnalysis onViewFullAnalysis={() => nav(3)} onDashboardSave={onDashboardSave} onDataPointClick={onFilteredMentions} onWidgetInsight={onWidgetInsight} />
        </Paper>
      </Box>
      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
        <SourceTypeDonut  onVFA={() => nav(1, 'sources')} />
        <TopLanguageTable onVFA={() => nav(1, 'locations')} />
      </Box>
      <ReachTable title="News Sources by Reach" rows={NEWS_SOURCES_REACH} onVFA={() => nav(4, 'news-coverage')} />
      <ReachTable title="Journalists by Reach"  rows={JOURNALISTS_REACH}  onVFA={() => nav(4, 'journalists')} />
    </>
  )
}
