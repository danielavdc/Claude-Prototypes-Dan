import { Box, Typography, Paper, Divider, IconButton, ToggleButton, ToggleButtonGroup } from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd'
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt'
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined'
import { useState, useRef, useEffect } from 'react'

const TEAL   = '#1D9F9F'
const PURPLE = '#9C4DD6'
const PINK   = '#CF2D8A'
const ORANGE = '#FF9800'
const BLUE   = '#2196F3'
const GREEN  = '#4CAF50'
const RED    = '#F44336'

const NAV_SECTIONS = [
  { id: 'volume',    label: 'Volume'    },
  { id: 'locations', label: 'Locations' },
  { id: 'sources',   label: 'Sources'   },
]

const X_LABELS = ['Aug 25', 'Aug 26', 'Aug 27', 'Aug 28', 'Aug 29', 'Aug 30', 'Aug 31']

const MENTION_TREND   = [0, 0, 150, 2000, 1200, 480, 100]
const MENTION_SOURCES = [
  { label: 'News',    color: BLUE,      data: [0, 0, 90, 1200, 720, 290, 60] },
  { label: 'X',       color: '#212121', data: [0, 0, 35, 480,  290, 115, 24] },
  { label: 'Blogs',   color: ORANGE,    data: [0, 0, 15, 190,  115, 46,  9]  },
  { label: 'Reddit',  color: RED,       data: [0, 0,  8, 90,   55,  22,  5]  },
  { label: 'Music',   color: PURPLE,    data: [0, 0,  2, 25,   15,  6,   2]  },
  { label: 'TikTok',  color: '#00BCD4', data: [0, 0,  0, 10,   5,   2,   0]  },
  { label: 'Podcast', color: GREEN,     data: [0, 0,  0, 5,    3,   1,   0]  },
  { label: 'Twitch',  color: '#6441A4', data: [0, 0,  0, 5,    2,   1,   0]  },
]

const ENGAGEMENT_TREND   = [12, 20, 45, 180, 320, 250, 85]
const ENGAGEMENT_SOURCES = [
  { label: 'All',       color: BLUE,      data: [12, 20, 45, 180, 320, 250, 85] },
  { label: 'News',      color: TEAL,      data: [7,  12, 27, 108, 192, 150, 51] },
  { label: 'Twitter',   color: '#29B6F6', data: [3,  5,  12, 48,  85,  66,  22] },
  { label: 'Facebook',  color: '#3F51B5', data: [1,  2,  5,  18,  32,  25,  8]  },
  { label: 'Pinterest', color: PINK,      data: [0,  0,  1,  6,   11,  8,   3]  },
  { label: 'Podcast',   color: GREEN,     data: [0,  0,  0,  2,   4,   3,   1]  },
  { label: 'Bing',      color: ORANGE,    data: [0,  0,  0,  1,   2,   1,   0]  },
]

const ENGAGED_CONTENT = [
  { bg: '#1565C0', title: 'Architecture: 49 photos that prove Moscow is paradise for architecture lovers around the world.', source: 'ArchDaily', time: '2 hours ago', engagement: '2.3k' },
  { bg: '#2E7D32', title: 'The Future of Urban Design: How AI is Reshaping City Planning and Communities', source: 'CityLab', time: '4 hours ago', engagement: '1.8k' },
  { bg: '#6A1B9A', title: 'Sustainable Architecture Trends Gaining Momentum in Global Markets', source: 'Dezeen', time: '6 hours ago', engagement: '1.5k' },
]

const TOP_CITIES = [
  { city: 'Barcelona', flag: '🇪🇸', mentions: '132.4k', pct: 60, delta: '-5.3%', down: true },
  { city: 'Bangkok',   flag: '🇹🇭', mentions: '132.4k', pct: 60, delta: '-5.3%', down: true },
  { city: 'London',    flag: '🇬🇧', mentions: '132.4k', pct: 60, delta: '-5.3%', down: true },
  { city: 'Paris',     flag: '🇫🇷', mentions: '132.4k', pct: 60, delta: '-5.3%', down: true },
]

const TOP_LOCATIONS = [
  { flag: '🇺🇸', label: 'United States', value: 459 },
  { flag: '🇨🇦', label: 'Canada',         value: 243 },
  { flag: '🇫🇷', label: 'France',         value: 198 },
  { flag: '🇲🇽', label: 'Mexico',         value: 152 },
  { flag: '🇸🇪', label: 'Sweden',         value: 98  },
  { flag: '🇩🇪', label: 'Germany',        value: 94  },
  { flag: '🇳🇿', label: 'New Zealand',    value: 52  },
  { flag: '🇦🇺', label: 'Australia',      value: 48  },
  { flag: '🇬🇧', label: 'United Kingdom', value: 31  },
]

const COUNTRIES_TREND = [
  { label: 'United States', color: BLUE,   data: [120, 180, 150, 220, 190, 280, 170] },
  { label: 'Canada',        color: RED,    data: [40,  60,  50,  75,  65,  95,  58]  },
  { label: 'France',        color: PURPLE, data: [25,  38,  31,  47,  40,  59,  36]  },
  { label: 'Mexico',        color: ORANGE, data: [18,  27,  22,  34,  29,  43,  26]  },
  { label: 'Germany',       color: GREEN,  data: [12,  18,  15,  23,  19,  29,  17]  },
  { label: 'Iran',          color: TEAL,   data: [8,   12,  10,  15,  13,  19,  11]  },
]

const TOP_REGIONS = [
  { city: 'Singapore',    region: 'Singapore',    mentions: '132.4k', pct: 60, delta: -5, trend: [3,2,4,3,5,4,2] },
  { city: 'Hong Kong',    region: 'Hong Kong',    mentions: '132.4k', pct: 60, delta:  3, trend: [2,3,3,4,5,6,5] },
  { city: 'Cape Town',    region: 'South Africa', mentions: '132.4k', pct: 60, delta:  0, trend: [4,4,4,4,4,4,4] },
  { city: 'Delhi',        region: 'India',        mentions: '132.4k', pct: 60, delta:  8, trend: [2,3,4,5,6,7,8] },
  { city: 'Kuala Lumpur', region: 'Malaysia',     mentions: '132.4k', pct: 60, delta:  5, trend: [3,4,4,5,5,6,6] },
  { city: 'London',       region: 'England',      mentions: '132.4k', pct: 60, delta: -2, trend: [6,5,5,4,4,5,4] },
  { city: 'Sydney',       region: 'Australia',    mentions: '132.4k', pct: 60, delta: -4, trend: [5,4,4,3,3,2,3] },
]

const TOP_STATES = [
  { city: 'Singapore',    region: 'Singapore', mentions: '132.4k', pct: 60, delta: -5, trend: [3,2,4,3,5,4,2] },
  { city: 'Hong Kong',    region: 'Hong Kong', mentions: '132.4k', pct: 60, delta:  3, trend: [2,3,3,4,5,6,5] },
  { city: 'Cape Town',    region: 'S Africa',  mentions: '132.4k', pct: 60, delta:  0, trend: [4,4,4,4,4,4,4] },
  { city: 'Kuala Lumpur', region: 'Malaysia',  mentions: '132.4k', pct: 60, delta:  5, trend: [3,4,4,5,5,6,6] },
  { city: 'London',       region: 'England',   mentions: '132.4k', pct: 60, delta: -2, trend: [6,5,5,4,4,5,4] },
  { city: 'Sydney',       region: 'Australia', mentions: '132.4k', pct: 60, delta: -4, trend: [5,4,4,3,3,2,3] },
]

const NEWS_SOURCES = [
  { initials: 'CN', color: '#C62828', name: 'CNN',                  domain: 'cnn.com',            mentions: '724k' },
  { initials: 'TG', color: '#1B5E20', name: 'The Guardian',         domain: 'theguardian.com',    mentions: '723k' },
  { initials: 'NY', color: '#212121', name: 'The New York Times',   domain: 'nytimes.com',        mentions: '723k' },
  { initials: 'MW', color: '#1565C0', name: 'Mountain Weekly News', domain: 'mountainweekly.com', mentions: '723k' },
  { initials: 'TI', color: '#6A1B9A', name: 'Tech Insider',         domain: 'techinsider.com',    mentions: '723k' },
  { initials: 'FL', color: '#BF360C', name: 'Flink',                domain: 'flink.com',          mentions: '723k' },
  { initials: 'PN', color: '#0277BD', name: 'Press Now',            domain: 'pressnow.net',       mentions: '722k' },
]

const SHARED_LINKS = [
  { url: 'http://www.klinkdialer.site/arch...', mentions: 133, pct: 100 },
  { url: 'http://www.nytimes.com/2024/...',     mentions: 102, pct: 77  },
  { url: 'http://www.businessinsider.com/...',  mentions: 98,  pct: 74  },
  { url: 'http://www.theguardian.com/...',      mentions: 87,  pct: 65  },
  { url: 'http://www.inhabitat.com/...',        mentions: 76,  pct: 57  },
]

const TOP_BLOGS = [
  { domain: 'klinkdialer.site',      mentions: 104, pct: 100 },
  { domain: 'blogs.microsoft.com',   mentions: 87,  pct: 84  },
  { domain: 'forums.meltingpot.edu', mentions: 76,  pct: 73  },
  { domain: 'payamy.arcindo.com',    mentions: 65,  pct: 63  },
  { domain: 'substack.com',         mentions: 54,  pct: 52  },
]

const SUBREDDITS = [
  { color: '#FF5722', name: 'r/architecture',  mentions: '1.4k' },
  { color: '#E64A19', name: 'r/urbanplanning', mentions: '1.2k' },
  { color: '#D84315', name: 'r/designporn',    mentions: '987'  },
  { color: '#BF360C', name: 'r/minimalism',    mentions: '876'  },
  { color: '#FF5722', name: 'r/sustainability', mentions: '743' },
]

const FORUMS = [
  { initials: 'AR', color: '#1565C0', name: 'Archinect Forums', mentions: '543' },
  { initials: 'DE', color: '#2E7D32', name: 'Design Forum',     mentions: '432' },
  { initials: 'TF', color: '#6A1B9A', name: 'Tech Forum',       mentions: '321' },
  { initials: 'UF', color: '#E65100', name: 'Urban Forum',      mentions: '287' },
  { initials: 'GF', color: '#0277BD', name: 'Green Forum',      mentions: '234' },
]

const EMERGING_ACCOUNTS = [
  { handle: '@Lingtree', size: 16, color: TEAL },
  { handle: '#NaturalLandscape', size: 20, color: BLUE },
  { handle: '@HomeInteriors', size: 18, color: PURPLE },
  { handle: '#Chars', size: 13, color: PINK },
  { handle: '@theNaturallandscape', size: 22, color: ORANGE },
  { handle: '#HomeInteriors', size: 17, color: TEAL },
  { handle: '@Computers', size: 14, color: BLUE },
  { handle: '#LingtreeNaturallandscape', size: 24, color: PURPLE },
  { handle: '@theNaturalLandscape', size: 15, color: GREEN },
  { handle: '#Computers', size: 13, color: RED },
]

const TOP_ACCOUNTS = [
  { handle: '@Lingtree', size: 20, color: TEAL },
  { handle: '#NaturalLandscape', size: 18, color: BLUE },
  { handle: '@HomeInteriors', size: 22, color: PURPLE },
  { handle: '@theNatural landscape', size: 24, color: PINK },
  { handle: '#Chars', size: 15, color: ORANGE },
  { handle: '@Computers', size: 16, color: TEAL },
  { handle: '#HomeInteriors', size: 19, color: BLUE },
  { handle: '@LingtreeNatural', size: 14, color: GREEN },
]

const HEATMAP_DATA = Array.from({ length: 7 }, (_, r) =>
  Array.from({ length: 24 }, (_, c) => {
    const base = c >= 9 && c <= 21 ? Math.random() * 80 + 20 : Math.random() * 20
    return Math.round(base * (r === 2 || r === 4 ? 1.4 : 1))
  })
)
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

// ── helpers ───────────────────────────────────────────────────────────────────

function WidgetHeader({ title, action }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
        <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#212121' }}>{title}</Typography>
        <InfoOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {action}
        <IconButton size="small"><MoreVertIcon sx={{ fontSize: 18, color: 'text.secondary' }} /></IconButton>
      </Box>
    </Box>
  )
}

function MetricKpi({ label, value, delta, sub }) {
  const pos = delta >= 0
  return (
    <Box>
      <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 0.25 }}>{label}</Typography>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75, flexWrap: 'wrap' }}>
        <Typography sx={{ fontSize: 28, fontWeight: 700, color: '#212121', lineHeight: 1.1 }}>{value}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, bgcolor: pos ? '#E8F5E9' : '#FFEBEE', color: pos ? '#2E7D32' : '#C62828', fontSize: 11, fontWeight: 700, px: 0.75, py: 0.25, borderRadius: 1 }}>
          {pos ? <ArrowUpwardIcon sx={{ fontSize: 11 }} /> : <ArrowDownwardIcon sx={{ fontSize: 11 }} />}
          {Math.abs(delta)}%
        </Box>
      </Box>
      {sub && <Typography sx={{ fontSize: 11, color: 'text.secondary', mt: 0.25 }}>{sub}</Typography>}
    </Box>
  )
}

function LineChart({ data, color = TEAL, height = 160 }) {
  const w = 800, h = height
  const max = Math.max(...data) || 1
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * (h - 8) - 4}`).join(' ')
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" width="100%" height={height} style={{ display: 'block' }}>
      <polygon points={`0,${h} ${pts} ${w},${h}`} fill={color} fillOpacity="0.08" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}

function MultiLineChart({ datasets, height = 140 }) {
  const w = 800, h = height
  const max = Math.max(...datasets.flatMap(d => d.data)) || 1
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" width="100%" height={height} style={{ display: 'block' }}>
      {datasets.map((ds, di) => {
        const pts = ds.data.map((v, i) => `${(i / (ds.data.length - 1)) * w},${h - (v / max) * (h - 4) - 2}`).join(' ')
        return <polyline key={di} points={pts} fill="none" stroke={ds.color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      })}
    </svg>
  )
}

function XLabels() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
      {X_LABELS.map(l => <Typography key={l} sx={{ fontSize: 11, color: 'text.secondary' }}>{l}</Typography>)}
    </Box>
  )
}

function ChartLegend({ datasets }) {
  return (
    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 1.25 }}>
      {datasets.map((ds, i) => (
        <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: ds.color, flexShrink: 0 }} />
          <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{ds.label}</Typography>
        </Box>
      ))}
    </Box>
  )
}

function MiniSparkline({ data, up }) {
  const w = 44, h = 14
  const max = Math.max(...data), min = Math.min(...data), range = max - min || 1
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 2) - 1}`).join(' ')
  return (
    <svg width={w} height={h} style={{ display: 'block', flexShrink: 0 }}>
      <polyline points={pts} fill="none" stroke={up ? TEAL : RED} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

// ── sticky segment nav ────────────────────────────────────────────────────────

function StickySegmentNav({ items, value, onChange }) {
  const [isScrolling, setIsScrolling] = useState(false)
  const scrollTimerRef = useRef(null)
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let parent = el.parentElement
    while (parent && parent !== document.body) {
      const s = window.getComputedStyle(parent)
      if (s.overflow === 'auto' || s.overflowY === 'auto' || s.overflow === 'scroll' || s.overflowY === 'scroll') break
      parent = parent.parentElement
    }
    if (!parent || parent === document.body) return
    const onScroll = () => {
      setIsScrolling(true)
      clearTimeout(scrollTimerRef.current)
      scrollTimerRef.current = setTimeout(() => setIsScrolling(false), 200)
    }
    parent.addEventListener('scroll', onScroll, { passive: true })
    return () => { parent.removeEventListener('scroll', onScroll); clearTimeout(scrollTimerRef.current) }
  }, [])

  return (
    <Box ref={ref} sx={{ position: 'sticky', top: 0, zIndex: 10, bgcolor: 'transparent', py: 1.25, pl: 2 }}>
      <Box sx={{ display: 'inline-flex', boxShadow: isScrolling ? '0 4px 16px rgba(0,0,0,0.10)' : 'none', borderRadius: '4px', transition: 'box-shadow 0.2s ease' }}>
      <ToggleButtonGroup
        value={value} exclusive
        onChange={(_, val) => { if (val) onChange(val) }}
        sx={{
          '& .MuiToggleButton-root': {
            py: 0.75, px: 2, fontSize: 14, fontWeight: 400,
            textTransform: 'none', letterSpacing: 0,
            color: '#212121', bgcolor: '#F0F0F0', borderColor: '#9E9E9E', borderRadius: 0,
            whiteSpace: 'nowrap',
            '&:first-of-type': { borderRadius: '4px 0 0 4px' },
            '&:last-of-type':  { borderRadius: '0 4px 4px 0' },
            '&.Mui-selected': {
              background: 'linear-gradient(rgba(29,159,159,0.18),rgba(29,159,159,0.18)) #F0F0F0',
              color: '#212121', borderColor: '#00827F',
              '&:hover': { background: 'linear-gradient(rgba(29,159,159,0.25),rgba(29,159,159,0.25)) #F0F0F0' },
            },
            '&:hover': { bgcolor: '#E0E0E0' },
          },
        }}
      >
        {items.map(item => (
          <ToggleButton key={item.id} value={item.id} disableRipple={false}>
            {item.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      </Box>
    </Box>
  )
}

// ── shared ai insight ─────────────────────────────────────────────────────────

function AIInsightWidget() {
  return (
    <Box sx={{ p: '1.5px', borderRadius: 2, background: 'linear-gradient(135deg, #9C4DD6 0%, #CF2D8A 40%, #1D9F9F 100%)' }}>
      <Box sx={{ bgcolor: 'background.paper', borderRadius: '6px', p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <AutoAwesomeIcon sx={{ fontSize: 16, color: '#9C4DD6' }} />
            <Typography sx={{ fontSize: 13, fontWeight: 700, background: 'linear-gradient(90deg, #9C4DD6 0%, #CF2D8A 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              AI-Powered Insight
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton size="small" sx={{ p: 0.5 }}><ThumbUpOffAltIcon sx={{ fontSize: 18, color: 'text.secondary' }} /></IconButton>
            <IconButton size="small" sx={{ p: 0.5 }}><ThumbDownOffAltIcon sx={{ fontSize: 18, color: 'text.secondary' }} /></IconButton>
            <IconButton size="small" sx={{ p: 0.5 }}><ContentCopyIcon sx={{ fontSize: 18, color: 'text.secondary' }} /></IconButton>
          </Box>
        </Box>
        <Box component="ul" sx={{ m: 0, pl: 2.5, mb: 1.5 }}>
          {[
            'Mention volume surged 37% on Aug 28 — driven primarily by Online News (45%) and X (28%), coinciding with the new product announcement. 1, 2, 3',
            'Tier 1 premium outlets account for 92% of reach, with The Washington Post, CNN and NYT leading coverage, indicating strong mainstream media traction. 4, 5',
            'Sustainability and zero-sugar keywords are gaining momentum week-over-week, suggesting an emerging narrative shift worth tracking. 6, 7, 8…',
          ].map((t, i) => (
            <Typography key={i} component="li" sx={{ fontSize: 14, lineHeight: '22px', color: '#212121', mb: 0.75 }}>{t}</Typography>
          ))}
        </Box>
        <Typography sx={{ fontSize: 14, fontWeight: 700, color: TEAL, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>View More Insights</Typography>
      </Box>
    </Box>
  )
}

// ── heatmap data ──────────────────────────────────────────────────────────────

const ACTIVITY_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const ACTIVITY_HOURS = Array.from({ length: 24 }, (_, i) => {
  if (i === 0) return '12am'
  if (i < 12) return `${i}am`
  if (i === 12) return '12pm'
  return `${i - 12}pm`
})
const ACTIVITY_DATA = Array.from({ length: 7 }, (_, d) =>
  Array.from({ length: 24 }, (_, h) => {
    const peak = h >= 6 && h <= 10 ? Math.random() * 90 + 60 : Math.random() * 60 + 10
    return Math.round(peak * (d === 2 || d === 3 || d === 4 ? 1.3 : 0.85))
  })
)
const HEAT_RANGES = [
  { label: '26–50',   color: '#BBDEFB' },
  { label: '51–100',  color: '#90CAF9' },
  { label: '101–125', color: '#64B5F6' },
  { label: '126–150', color: '#2196F3' },
  { label: '151+',    color: '#1565C0' },
]
function heatColor(v) {
  if (v <= 50)  return '#BBDEFB'
  if (v <= 100) return '#90CAF9'
  if (v <= 125) return '#64B5F6'
  if (v <= 150) return '#2196F3'
  return '#1565C0'
}

// ── mentions tab ──────────────────────────────────────────────────────────────

function MentionsContent() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>

      <AIInsightWidget />

      <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, p: 2 }}>
        <WidgetHeader title="Mentions Trend" />
        <Box sx={{ display: 'flex', gap: 4, mb: 2 }}>
          <MetricKpi label="Total Mentions" value="3.93k" delta={7.8} sub="Premium: 0/1k" />
          <Divider orientation="vertical" flexItem />
          <MetricKpi label="Daily Average" value="561" delta={7.8} sub="Premium: 0/1k" />
        </Box>
        <LineChart data={MENTION_TREND} color={BLUE} height={160} />
        <XLabels />
      </Paper>

      <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, p: 2 }}>
        <WidgetHeader title="Mentions Trend by Source Type" />
        <ChartLegend datasets={MENTION_SOURCES} />
        <MultiLineChart datasets={MENTION_SOURCES} height={160} />
        <XLabels />
      </Paper>

      {/* Mentions Average Activity heatmap */}
      <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, p: 2 }}>
        <WidgetHeader title="Mentions Average Activity" />
        <Box sx={{ overflowX: 'auto' }}>
          <Box sx={{ minWidth: 600 }}>
            {/* Hour labels */}
            <Box sx={{ display: 'flex', ml: '40px', mb: 0.5 }}>
              {ACTIVITY_HOURS.map((h, i) => (
                <Box key={i} sx={{ flex: 1, textAlign: 'center' }}>
                  <Typography sx={{ fontSize: 10, color: 'text.secondary', whiteSpace: 'nowrap' }}>{h}</Typography>
                </Box>
              ))}
            </Box>
            {/* Grid rows */}
            {ACTIVITY_DATA.map((row, ri) => (
              <Box key={ri} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <Typography sx={{ fontSize: 12, color: 'text.secondary', width: 40, flexShrink: 0 }}>{ACTIVITY_DAYS[ri]}</Typography>
                {row.map((val, ci) => (
                  <Box key={ci} sx={{ flex: 1, mx: '2px', height: 28, bgcolor: heatColor(val), borderRadius: '6px' }} />
                ))}
              </Box>
            ))}
            {/* Legend */}
            <Box sx={{ display: 'flex', gap: 2, mt: 2, ml: '40px' }}>
              {HEAT_RANGES.map((r, i) => (
                <Box key={i} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: '100%', height: 16, bgcolor: r.color, borderRadius: '4px' }} />
                  <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{r.label}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Paper>

    </Box>
  )
}

// ── engagement tab ────────────────────────────────────────────────────────────

function EngagementContent() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>

      <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, p: 2 }}>
        <WidgetHeader
          title="Engagement Trend"
          action={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, border: '1px solid #e0e0e0', borderRadius: 0.5, px: 1, py: 0.5, cursor: 'pointer' }}>
              <Typography sx={{ fontSize: 12, color: '#424242' }}>Engagement type</Typography>
              <ArrowDownwardIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
            </Box>
          }
        />
        <Box sx={{ display: 'flex', gap: 4, mb: 2 }}>
          <MetricKpi label="Total Engagement" value="17.6k" delta={7.8} />
          <Divider orientation="vertical" flexItem />
          <MetricKpi label="Daily Average" value="2.52k" delta={7.8} />
        </Box>
        <LineChart data={ENGAGEMENT_TREND} color={TEAL} height={160} />
        <XLabels />
      </Paper>

      <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, p: 2 }}>
        <WidgetHeader title="Engagement Trend by Source Type" />
        <ChartLegend datasets={ENGAGEMENT_SOURCES} />
        <MultiLineChart datasets={ENGAGEMENT_SOURCES} height={160} />
        <XLabels />
      </Paper>

      <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#212121' }}>Most Engaged Content</Typography>
            <InfoOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          </Box>
          <Typography sx={{ fontSize: 13, fontWeight: 600, color: TEAL, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>View Full Analysis</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          {ENGAGED_CONTENT.map((item, i) => (
            <Box key={i} sx={{ flex: 1, minWidth: 180, border: '1px solid #e0e0e0', borderRadius: 1, overflow: 'hidden' }}>
              <Box sx={{ height: 110, bgcolor: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography sx={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>Image</Typography>
              </Box>
              <Box sx={{ p: 1.5 }}>
                <Typography sx={{ fontSize: 11, color: 'text.secondary', mb: 0.5 }}>{item.source} · {item.time}</Typography>
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#212121', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {item.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                  <FavoriteBorderIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
                  <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{item.engagement}</Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
        <Typography sx={{ fontSize: 12, color: 'text.secondary', textAlign: 'center', mt: 1.5 }}>1 - 3 of 20</Typography>
      </Paper>

    </Box>
  )
}

// ── locations tab ─────────────────────────────────────────────────────────────

function LocationsContent() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>

      <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, p: 2 }}>
        <WidgetHeader title="Countries by Mentions" />
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Box sx={{ flex: 2, minWidth: 200, height: 190, bgcolor: '#E3F2FD', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <Box sx={{ width: '75%', height: '65%', background: 'radial-gradient(ellipse at 38% 52%, rgba(29,159,159,0.45) 0%, rgba(29,159,159,0.12) 60%, transparent 80%)', borderRadius: '40%' }} />
            <Typography sx={{ position: 'absolute', fontSize: 10, color: '#90A4AE', bottom: 8, right: 10 }}>Map visualization</Typography>
          </Box>
          <Box sx={{ flex: 1, minWidth: 190 }}>
            <Box sx={{ display: 'flex', pb: 0.75, borderBottom: '1px solid #e0e0e0', mb: 0.5 }}>
              <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', flex: 1 }}>Top Cities</Typography>
              <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', width: 60 }}>Mentions</Typography>
              <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', width: 44, textAlign: 'right' }}>Trend</Typography>
            </Box>
            {TOP_CITIES.map((row, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', py: 0.75, borderBottom: i < TOP_CITIES.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontSize: 14 }}>{row.flag}</Typography>
                  <Typography sx={{ fontSize: 13, color: '#212121', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.city}</Typography>
                </Box>
                <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#212121', width: 60 }}>{row.mentions}</Typography>
                <Box sx={{ width: 44, display: 'flex', justifyContent: 'flex-end' }}>
                  <Box sx={{ bgcolor: row.down ? '#FFEBEE' : '#E8F5E9', color: row.down ? '#C62828' : '#2E7D32', fontSize: 10, fontWeight: 700, px: 0.5, py: 0.2, borderRadius: 0.5 }}>
                    {row.delta}
                  </Box>
                </Box>
              </Box>
            ))}
            <Typography sx={{ fontSize: 11, color: 'text.secondary', mt: 0.5, textAlign: 'center' }}>1-4 of 40</Typography>
          </Box>
        </Box>
      </Paper>

      <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, p: 2 }}>
        <WidgetHeader
          title="Top Locations"
          action={
            <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, px: 1, py: 0.5, display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }}>
              <Typography sx={{ fontSize: 12, color: '#424242' }}>Country</Typography>
              <ArrowDownwardIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
            </Box>
          }
        />
        {TOP_LOCATIONS.map((row, i) => {
          const pct = Math.round((row.value / TOP_LOCATIONS[0].value) * 100)
          return (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
              <Typography sx={{ fontSize: 16 }}>{row.flag}</Typography>
              <Typography sx={{ fontSize: 13, color: '#424242', width: 110, flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.label}</Typography>
              <Box sx={{ flex: 1, height: 8, bgcolor: '#f0f0f0', borderRadius: 1, overflow: 'hidden' }}>
                <Box sx={{ width: `${pct}%`, height: '100%', bgcolor: ORANGE, borderRadius: 1 }} />
              </Box>
              <Typography sx={{ fontSize: 12, color: 'text.secondary', width: 32, textAlign: 'right', flexShrink: 0 }}>{row.value}</Typography>
            </Box>
          )
        })}
        <Typography sx={{ fontSize: 11, color: 'text.secondary', textAlign: 'center', mt: 0.5 }}>1 - 10 of Locations</Typography>
      </Paper>

      {/* Top Language */}
      {(() => {
        const LANGS = [
          { name: 'Spanish',  mentions: '132.4k', pct: 60, barColor: '#1D9F9F', delta: '4%',   up: false, zero: false },
          { name: 'English',  mentions: '132.4k', pct: 60, barColor: '#80CBC4', delta: '180%', up: true,  zero: false },
          { name: 'Arabic',   mentions: '132.4k', pct: 60, barColor: '#FFC107', delta: '0%',   up: false, zero: true  },
          { name: 'French',   mentions: '132.4k', pct: 60, barColor: '#FF9800', delta: '180%', up: true,  zero: false },
          { name: 'Thai',     mentions: '132.4k', pct: 60, barColor: '#CF2D8A', delta: '180%', up: true,  zero: false },
          { name: 'Japanese', mentions: '150.2k', pct: 70, barColor: '#CF2D8A', delta: '200%', up: true,  zero: false },
          { name: 'Italian',  mentions: '98.3k',  pct: 50, barColor: '#CF2D8A', delta: '175%', up: true,  zero: false },
        ]
        return (
          <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, p: 2 }}>
            <WidgetHeader title="Top Language" />
            <Box sx={{ display: 'flex', pb: 0.75, borderBottom: '1px solid #e0e0e0', mb: 0.5 }}>
              <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary', flex: 1 }}>Name</Typography>
              <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary', width: 120 }}>Mentions</Typography>
              <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary', width: 80, textAlign: 'right' }}>Trend</Typography>
            </Box>
            {LANGS.map((row, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', py: 1, borderBottom: i < LANGS.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#212121', flex: 1 }}>{row.name}</Typography>
                <Box sx={{ width: 120, display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <Typography sx={{ fontSize: 12, color: '#424242' }}>{row.mentions} ({row.pct}%)</Typography>
                  <Box sx={{ flex: 1, height: 6, bgcolor: '#f0f0f0', borderRadius: 1, overflow: 'hidden', minWidth: 28 }}>
                    <Box sx={{ width: `${row.pct}%`, height: '100%', bgcolor: row.barColor, borderRadius: 1 }} />
                  </Box>
                </Box>
                <Box sx={{ width: 80, display: 'flex', justifyContent: 'flex-end' }}>
                  {row.zero
                    ? <Box sx={{ bgcolor: '#F5F5F5', color: '#757575', fontSize: 11, fontWeight: 700, px: 0.75, py: 0.25, borderRadius: 1 }}>→ 0%</Box>
                    : <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.25, bgcolor: row.up ? '#E8F5E9' : '#FFEBEE', color: row.up ? '#2E7D32' : '#C62828', fontSize: 11, fontWeight: 700, px: 0.75, py: 0.25, borderRadius: 1 }}>
                        {row.up ? '↑' : '↓'} {row.delta}
                      </Box>
                  }
                </Box>
              </Box>
            ))}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 1, pt: 1, borderTop: '1px solid #f5f5f5' }}>
              <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>1 - 5 of 30</Typography>
              <Typography sx={{ fontSize: 12, color: '#bdbdbd', cursor: 'pointer' }}>{'<'}</Typography>
              <Typography sx={{ fontSize: 12, color: TEAL, cursor: 'pointer' }}>{'>'}</Typography>
            </Box>
          </Paper>
        )
      })()}

      <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, p: 2 }}>
        <WidgetHeader title="Countries Trend" />
        <ChartLegend datasets={COUNTRIES_TREND} />
        <MultiLineChart datasets={COUNTRIES_TREND} height={160} />
        <XLabels />
      </Paper>

      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>

        {[{ title: 'Top Regions', data: TOP_REGIONS, barColor: TEAL }, { title: 'Top States', data: TOP_STATES, barColor: BLUE }].map(({ title, data, barColor }) => (
          <Paper key={title} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, p: 2, flex: 1, minWidth: 240 }}>
            <WidgetHeader title={title} />
            <Box sx={{ display: 'flex', pb: 0.75, borderBottom: '1px solid #e0e0e0', mb: 0.25 }}>
              <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', flex: 1 }}>Top Cities</Typography>
              <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', width: 60, textAlign: 'right' }}>Mentions</Typography>
              <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', width: 44, textAlign: 'center' }}>Trend</Typography>
            </Box>
            {data.map((row, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', py: 0.75, borderBottom: i < data.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#212121' }}>{row.city}</Typography>
                  <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{row.region}</Typography>
                </Box>
                <Box sx={{ width: 60, pr: 0.5 }}>
                  <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#212121', textAlign: 'right' }}>{row.mentions}</Typography>
                  <Box sx={{ height: 4, bgcolor: '#f0f0f0', borderRadius: 1, mt: 0.25, overflow: 'hidden' }}>
                    <Box sx={{ width: `${row.pct}%`, height: '100%', bgcolor: barColor, borderRadius: 1 }} />
                  </Box>
                </Box>
                <Box sx={{ width: 44, display: 'flex', justifyContent: 'flex-end' }}>
                  <MiniSparkline data={row.trend} up={row.delta >= 0} />
                </Box>
              </Box>
            ))}
            <Typography sx={{ fontSize: 11, color: 'text.secondary', textAlign: 'center', mt: 0.75 }}>1-{data.length} of 41</Typography>
          </Paper>
        ))}

      </Box>

    </Box>
  )
}

// ── trending sources tab ──────────────────────────────────────────────────────

function TrendingContent() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>

      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>

        {/* Source Type Breakdown */}
        {(() => {
          const STB = [
            { label: 'X',           pct: 52.1, count: '9.7k', color: BLUE   },
            { label: 'Online News', pct: 40.5, count: '5.7k', color: '#FFC107' },
            { label: 'Blogs',       pct: 20.1, count: '1.2k', color: PINK   },
            { label: 'WeChat',      pct: 12.0, count: '125',  color: TEAL   },
          ]
          const total = STB.reduce((s, r) => s + r.pct, 0)
          const size = 180, cx = 90, cy = 90, r = 68, ir = 40
          let cum = -90
          const paths = STB.map(seg => {
            const start = (cum * Math.PI) / 180
            const sweep = (seg.pct / total) * 360; cum += sweep
            const end = (cum * Math.PI) / 180, large = sweep > 180 ? 1 : 0
            const d = `M ${cx + r * Math.cos(start)} ${cy + r * Math.sin(start)} A ${r} ${r} 0 ${large} 1 ${cx + r * Math.cos(end)} ${cy + r * Math.sin(end)} L ${cx + ir * Math.cos(end)} ${cy + ir * Math.sin(end)} A ${ir} ${ir} 0 ${large} 0 ${cx + ir * Math.cos(start)} ${cy + ir * Math.sin(start)} Z`
            return { ...seg, d }
          })
          return (
            <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, p: 2, flex: 1, minWidth: 240 }}>
              <WidgetHeader title="Source Type Breakdown" />
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <svg width={size} height={size} style={{ display: 'block' }}>
                  {paths.map((p, i) => <path key={i} d={p.d} fill={p.color} stroke="white" strokeWidth="2" />)}
                  <circle cx={cx} cy={cy} r={ir} fill="white" />
                </svg>
              </Box>
              {STB.map((r, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.875 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: r.color, flexShrink: 0 }} />
                  <Typography sx={{ fontSize: 13, flex: 1, color: '#212121' }}>{r.label}</Typography>
                  <Typography sx={{ fontSize: 13, color: '#424242', width: 44, textAlign: 'right' }}>{r.pct}%</Typography>
                  <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#212121', width: 36, textAlign: 'right' }}>{r.count}</Typography>
                </Box>
              ))}
              <Box sx={{ mt: 1.5 }}>
                <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, border: '1px solid #e0e0e0', borderRadius: 0.75, px: 1.25, py: 0.5, cursor: 'pointer', '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#212121' }}>+4</Typography>
                  <ArrowDropDownIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                </Box>
              </Box>
            </Paper>
          )
        })()}

        {/* Top News Sources */}
        <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, p: 2, flex: 2, minWidth: 300 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#212121' }}>Top News Sources</Typography>
              <InfoOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            </Box>
            <DownloadOutlinedIcon sx={{ fontSize: 18, color: 'text.secondary', cursor: 'pointer' }} />
          </Box>
          <Box sx={{ display: 'flex', pb: 0.75, borderBottom: '1px solid #e0e0e0', mb: 0.5 }}>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary', flex: 1 }}>Publications</Typography>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary', width: 64, textAlign: 'right' }}>Mentions</Typography>
          </Box>
          {NEWS_SOURCES.map((row, i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center', py: 1, borderBottom: i < NEWS_SOURCES.length - 1 ? '1px solid #f5f5f5' : 'none', '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' } }}>
              <Typography sx={{ fontSize: 12, color: 'text.secondary', width: 20, flexShrink: 0 }}>{i + 1}</Typography>
              <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: row.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, mr: 1.25 }}>
                <Typography sx={{ fontSize: 9, fontWeight: 700, color: 'white' }}>{row.initials}</Typography>
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#212121', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.name}</Typography>
                <Typography sx={{ fontSize: 11, color: TEAL }}>News | US | https://mtnweekly.com</Typography>
              </Box>
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#212121', width: 48, textAlign: 'right', flexShrink: 0 }}>{row.mentions}</Typography>
            </Box>
          ))}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 1, pt: 1, borderTop: '1px solid #e0e0e0' }}>
            <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>1 - 10 of 30 Sources</Typography>
            <Typography sx={{ fontSize: 12, color: '#bdbdbd', cursor: 'pointer' }}>{'<'}</Typography>
            <Typography sx={{ fontSize: 12, color: TEAL, cursor: 'pointer' }}>{'>'}</Typography>
          </Box>
        </Paper>

      </Box>

      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
        {[
          { title: 'Top Shared Links', data: SHARED_LINKS, renderRow: (row, i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center', py: 0.875, borderBottom: i < SHARED_LINKS.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
              <Box sx={{ flex: 1, minWidth: 0, mr: 1 }}>
                <Typography sx={{ fontSize: 12, color: BLUE, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.url}</Typography>
                <Box sx={{ height: 4, bgcolor: '#f0f0f0', borderRadius: 1, mt: 0.5, overflow: 'hidden' }}>
                  <Box sx={{ width: `${row.pct}%`, height: '100%', bgcolor: BLUE, borderRadius: 1 }} />
                </Box>
              </Box>
              <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#212121', width: 32, textAlign: 'right', flexShrink: 0 }}>{row.mentions}</Typography>
            </Box>
          )},
          { title: 'Top Blogs', data: TOP_BLOGS, renderRow: (row, i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center', py: 0.875, borderBottom: i < TOP_BLOGS.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
              <Box sx={{ flex: 1, minWidth: 0, mr: 1 }}>
                <Typography sx={{ fontSize: 12, color: '#212121', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.domain}</Typography>
                <Box sx={{ height: 4, bgcolor: '#f0f0f0', borderRadius: 1, mt: 0.5, overflow: 'hidden' }}>
                  <Box sx={{ width: `${row.pct}%`, height: '100%', bgcolor: ORANGE, borderRadius: 1 }} />
                </Box>
              </Box>
              <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#212121', width: 32, textAlign: 'right', flexShrink: 0 }}>{row.mentions}</Typography>
            </Box>
          )},
        ].map(({ title, data, renderRow }) => (
          <Paper key={title} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, p: 2, flex: 1, minWidth: 220 }}>
            <WidgetHeader title={title} />
            <Box sx={{ display: 'flex', pb: 0.75, borderBottom: '1px solid #e0e0e0', mb: 0.5 }}>
              <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', flex: 1 }}>Sources</Typography>
              <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', width: 48, textAlign: 'right' }}>Mentions</Typography>
            </Box>
            {data.map(renderRow)}
            <Typography sx={{ fontSize: 11, color: 'text.secondary', textAlign: 'center', mt: 0.75 }}>1-5 of 50</Typography>
          </Paper>
        ))}
      </Box>

      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
        <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, p: 2, flex: 1, minWidth: 180 }}>
          <WidgetHeader title="Top Subreddits" />
          {SUBREDDITS.map((row, i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center', py: 0.875, borderBottom: i < SUBREDDITS.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
              <Box sx={{ width: 28, height: 28, borderRadius: '50%', bgcolor: row.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, mr: 1 }}>
                <Typography sx={{ fontSize: 8, fontWeight: 700, color: 'white' }}>r/</Typography>
              </Box>
              <Typography sx={{ fontSize: 13, color: '#212121', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.name}</Typography>
              <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#212121', flexShrink: 0 }}>{row.mentions}</Typography>
            </Box>
          ))}
          <Typography sx={{ fontSize: 11, color: 'text.secondary', textAlign: 'center', mt: 0.75 }}>1-5 of 40</Typography>
        </Paper>
        <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, p: 2, flex: 1, minWidth: 180 }}>
          <WidgetHeader title="Top Forums" />
          {FORUMS.map((row, i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center', py: 0.875, borderBottom: i < FORUMS.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
              <Box sx={{ width: 28, height: 28, borderRadius: '50%', bgcolor: row.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, mr: 1 }}>
                <Typography sx={{ fontSize: 8, fontWeight: 700, color: 'white' }}>{row.initials}</Typography>
              </Box>
              <Typography sx={{ fontSize: 13, color: '#212121', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.name}</Typography>
              <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#212121', flexShrink: 0 }}>{row.mentions}</Typography>
            </Box>
          ))}
          <Typography sx={{ fontSize: 11, color: 'text.secondary', textAlign: 'center', mt: 0.75 }}>1-5 of 30</Typography>
        </Paper>
      </Box>

      <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, p: 2 }}>
        <WidgetHeader title="Emerging Mentioned Accounts" />
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 0.5, minHeight: 80 }}>
          {EMERGING_ACCOUNTS.map((a, i) => (
            <Typography key={i} sx={{ fontSize: a.size, fontWeight: a.size >= 18 ? 700 : 500, color: a.color, cursor: 'pointer', lineHeight: 1.4, '&:hover': { opacity: 0.75 } }}>
              {a.handle}
            </Typography>
          ))}
        </Box>
      </Paper>

      <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, p: 2 }}>
        <WidgetHeader title="Top Mentioned Accounts" />
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 0.5, minHeight: 80 }}>
          {TOP_ACCOUNTS.map((a, i) => (
            <Typography key={i} sx={{ fontSize: a.size, fontWeight: a.size >= 18 ? 700 : 500, color: a.color, cursor: 'pointer', lineHeight: 1.4, '&:hover': { opacity: 0.75 } }}>
              {a.handle}
            </Typography>
          ))}
        </Box>
      </Paper>

      <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, pt: 1.5, pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#212121' }}>Mentions Average Activity</Typography>
            <InfoOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          </Box>
          <IconButton size="small"><MoreVertIcon sx={{ fontSize: 18, color: 'text.secondary' }} /></IconButton>
        </Box>
        <Box sx={{ px: 2, pb: 2 }}>
          <Box sx={{ display: 'flex', mt: 0.5 }}>
            <Box sx={{ width: 32, flexShrink: 0 }} />
            {Array.from({ length: 24 }, (_, h) => (
              <Box key={h} sx={{ flex: 1, textAlign: 'center' }}>
                {h % 6 === 0 && <Typography sx={{ fontSize: 9, color: 'text.secondary' }}>{h}h</Typography>}
              </Box>
            ))}
          </Box>
          {HEATMAP_DATA.map((row, ri) => (
            <Box key={ri} sx={{ display: 'flex', alignItems: 'center', mb: 0.25 }}>
              <Typography sx={{ fontSize: 10, color: 'text.secondary', width: 32, flexShrink: 0 }}>{DAYS[ri]}</Typography>
              {row.map((val, ci) => (
                <Box key={ci} sx={{ flex: 1, height: 16, bgcolor: `rgba(29,159,159,${val / 100})`, borderRadius: '2px', mx: '1px' }} />
              ))}
            </Box>
          ))}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, justifyContent: 'flex-end' }}>
            <Typography sx={{ fontSize: 10, color: 'text.secondary' }}>Low</Typography>
            {[0.1, 0.3, 0.5, 0.7, 0.9].map(o => <Box key={o} sx={{ width: 14, height: 14, bgcolor: `rgba(29,159,159,${o})`, borderRadius: '2px' }} />)}
            <Typography sx={{ fontSize: 10, color: 'text.secondary' }}>High</Typography>
          </Box>
        </Box>
      </Paper>

    </Box>
  )
}

// ── main export ───────────────────────────────────────────────────────────────

export default function CoverageTabContent({ onDashboardSave, loading, targetSubTab, subTabTrigger }) {
  const [activeTab, setActiveTab] = useState('volume')
  const boxRef = useRef(null)
  useEffect(() => { if (subTabTrigger > 0 && targetSubTab) setActiveTab(targetSubTab) }, [subTabTrigger])

  const scrollToTop = () => {
    let el = boxRef.current?.parentElement
    while (el && el !== document.body) {
      const s = window.getComputedStyle(el)
      if (s.overflow === 'auto' || s.overflowY === 'auto') { el.scrollTo({ top: 0, behavior: 'smooth' }); break }
      el = el?.parentElement
    }
  }

  if (loading) return null
  return (
    <Box ref={boxRef} sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <StickySegmentNav items={NAV_SECTIONS} value={activeTab} onChange={(val) => { setActiveTab(val); scrollToTop() }} />
      {activeTab === 'volume' && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <MentionsContent />
          <EngagementContent />
        </Box>
      )}
      {activeTab === 'locations' && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <AIInsightWidget />
          <LocationsContent />
        </Box>
      )}
      {activeTab === 'sources' && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <AIInsightWidget />
          <TrendingContent />
        </Box>
      )}
    </Box>
  )
}
