import { Box, Typography, Paper, Divider, IconButton, Tooltip } from '@mui/material'
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
import ShowChartIcon from '@mui/icons-material/ShowChart'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined'
import { useState, useRef, useEffect } from 'react'

const TEAL   = '#1D9F9F'
const PURPLE = '#9C4DD6'
const PINK   = '#CF2D8A'
const ORANGE = '#FF9800'
const BLUE   = '#2196F3'
const GREEN  = '#4CAF50'
const RED    = '#F44336'

const NAV_SECTIONS = [
  { id: 'cov-mentions',   label: 'Mentions',         Icon: ShowChartIcon },
  { id: 'cov-engagement', label: 'Engagement',       Icon: FavoriteBorderIcon },
  { id: 'cov-locations',  label: 'Locations',        Icon: LocationOnOutlinedIcon },
  { id: 'cov-sources',    label: 'Trending sources', Icon: ArticleOutlinedIcon },
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
  { city: 'Barcelona', flag: '🇪🇸', mentions: '132.4k', delta: '-5.3%', down: true },
  { city: 'Bangkok',   flag: '🇹🇭', mentions: '132.4k', delta: '-5.3%', down: true },
  { city: 'London',    flag: '🇬🇧', mentions: '132.4k', delta: '-5.3%', down: true },
  { city: 'Paris',     flag: '🇫🇷', mentions: '132.4k', delta: '-5.3%', down: true },
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
]

const TOP_STATES = [
  { city: 'Singapore',    region: 'Singapore', mentions: '132.4k', pct: 60, delta: -5, trend: [3,2,4,3,5,4,2] },
  { city: 'Hong Kong',    region: 'Hong Kong', mentions: '132.4k', pct: 60, delta:  3, trend: [2,3,3,4,5,6,5] },
  { city: 'Cape Town',    region: 'S Africa',  mentions: '132.4k', pct: 60, delta:  0, trend: [4,4,4,4,4,4,4] },
  { city: 'Kuala Lumpur', region: 'Malaysia',  mentions: '132.4k', pct: 60, delta:  5, trend: [3,4,4,5,5,6,6] },
  { city: 'London',       region: 'England',   mentions: '132.4k', pct: 60, delta: -2, trend: [6,5,5,4,4,5,4] },
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

// ── anchor nav ────────────────────────────────────────────────────────────────

function AnchorNav({ items }) {
  const [active, setActive] = useState(items[0]?.id || '')
  const [compact, setCompact] = useState(false)
  const navRef = useRef(null)

  useEffect(() => {
    const el = navRef.current
    if (!el) return
    let scrollEl = el.parentElement
    while (scrollEl && scrollEl !== document.body) {
      const s = window.getComputedStyle(scrollEl)
      if (s.overflow === 'auto' || s.overflowY === 'auto' || s.overflow === 'scroll' || s.overflowY === 'scroll') break
      scrollEl = scrollEl.parentElement
    }
    if (!scrollEl || scrollEl === document.body) return

    const onScroll = () => {
      const containerTop = scrollEl.getBoundingClientRect().top
      let current = items[0]?.id
      for (const { id } of items) {
        const sEl = document.getElementById(id)
        if (!sEl) continue
        if (sEl.getBoundingClientRect().top - containerTop < 80) current = id
      }
      setActive(current)
    }
    scrollEl.addEventListener('scroll', onScroll, { passive: true })

    const ro = new ResizeObserver(([entry]) => setCompact(entry.contentRect.width < 620))
    ro.observe(scrollEl)

    return () => {
      scrollEl.removeEventListener('scroll', onScroll)
      ro.disconnect()
    }
  }, [items])

  return (
    <Box ref={navRef} sx={{ position: 'sticky', top: 0, alignSelf: 'flex-start', flexShrink: 0, pt: 0.5 }}>
      {items.map(({ id, label, Icon }) => {
        const isActive = active === id
        return (
          <Tooltip key={id} title={compact ? label : ''} placement="left" arrow>
            <Box
              onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              sx={{
                display: 'flex', alignItems: 'center',
                gap: compact ? 0 : 1.25,
                pl: 1.5, pr: compact ? 1 : 2, py: 0.875,
                cursor: 'pointer',
                borderLeft: `3px solid ${isActive ? TEAL : 'transparent'}`,
                bgcolor: isActive ? 'rgba(29,159,159,0.08)' : 'transparent',
                borderRadius: '0 4px 4px 0',
                transition: 'background-color 0.15s ease',
                userSelect: 'none',
                width: compact ? 44 : 'auto',
                '&:hover': { bgcolor: isActive ? 'rgba(29,159,159,0.12)' : 'rgba(0,0,0,0.04)' },
              }}
            >
              <Icon sx={{ fontSize: 18, color: isActive ? TEAL : '#757575', flexShrink: 0 }} />
              {!compact && (
                <Typography sx={{ fontSize: 14, fontWeight: isActive ? 700 : 400, color: isActive ? '#212121' : '#424242', whiteSpace: 'nowrap' }}>
                  {label}
                </Typography>
              )}
            </Box>
          </Tooltip>
        )
      })}
    </Box>
  )
}

// ── main export ───────────────────────────────────────────────────────────────

export default function CoverageTabContent({ onDashboardSave, loading }) {
  if (loading) return null
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>

      {/* ── Content column ───────────────────────────────────────────────── */}
      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>

        {/* ── MENTIONS ─────────────────────────────────────────────────── */}
        <Box id="cov-mentions" sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>

          {/* AI Insight */}
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

          {/* Mentions Trend */}
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

          {/* Mentions Trend by Source Type */}
          <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, p: 2 }}>
            <WidgetHeader title="Mentions Trend by Source Type" />
            <Box sx={{ display: 'flex', gap: 4, mb: 2 }}>
              <MetricKpi label="Total Mentions" value="358.2k" delta={5.6} />
              <Divider orientation="vertical" flexItem />
              <MetricKpi label="Daily Average" value="1.46k" delta={7.8} />
            </Box>
            <ChartLegend datasets={MENTION_SOURCES} />
            <MultiLineChart datasets={MENTION_SOURCES} height={160} />
            <XLabels />
          </Paper>

        </Box>

        {/* ── ENGAGEMENT ───────────────────────────────────────────────── */}
        <Box id="cov-engagement" sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>

          {/* Engagement Trend */}
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

          {/* Engagement Trend by Source Type */}
          <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, p: 2 }}>
            <WidgetHeader title="Engagement Trend by Source Type" />
            <ChartLegend datasets={ENGAGEMENT_SOURCES} />
            <MultiLineChart datasets={ENGAGEMENT_SOURCES} height={160} />
            <XLabels />
          </Paper>

          {/* Most Engaged Content */}
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
                    <Typography sx={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Image</Typography>
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

        {/* ── LOCATIONS ────────────────────────────────────────────────── */}
        <Box id="cov-locations" sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>

          {/* Countries by Mentions */}
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

          {/* Top Locations */}
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

          {/* Countries Trend */}
          <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, p: 2 }}>
            <WidgetHeader title="Countries Trend" />
            <ChartLegend datasets={COUNTRIES_TREND} />
            <MultiLineChart datasets={COUNTRIES_TREND} height={160} />
            <XLabels />
          </Paper>

          {/* Top Regions + Top States */}
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

        {/* ── TRENDING SOURCES ─────────────────────────────────────────── */}
        <Box id="cov-sources" sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>

          {/* Top News Sources */}
          <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, p: 2 }}>
            <WidgetHeader title="Top News Sources" />
            {NEWS_SOURCES.map((row, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', py: 1, borderBottom: i < NEWS_SOURCES.length - 1 ? '1px solid #f5f5f5' : 'none', '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' } }}>
                <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: row.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, mr: 1.25 }}>
                  <Typography sx={{ fontSize: 9, fontWeight: 700, color: 'white' }}>{row.initials}</Typography>
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#212121', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.name}</Typography>
                  <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{row.domain}</Typography>
                </Box>
                <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#212121', flexShrink: 0 }}>{row.mentions}</Typography>
              </Box>
            ))}
            <Box sx={{ pt: 1, borderTop: '1px solid #e0e0e0', mt: 0.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>1-10 of 50 Sources</Typography>
              <Typography sx={{ fontSize: 13, fontWeight: 600, color: TEAL, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>View all</Typography>
            </Box>
          </Paper>

          {/* Top Shared Links + Top Blogs */}
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            {[
              { title: 'Top Shared Links', data: SHARED_LINKS, color: BLUE, getLabel: r => r.url },
              { title: 'Top Blogs',        data: TOP_BLOGS,    color: ORANGE, getLabel: r => r.domain },
            ].map(({ title, data, color, getLabel }) => (
              <Paper key={title} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, p: 2, flex: 1, minWidth: 220 }}>
                <WidgetHeader title={title} />
                <Box sx={{ display: 'flex', pb: 0.75, borderBottom: '1px solid #e0e0e0', mb: 0.5 }}>
                  <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', flex: 1 }}>Sources</Typography>
                  <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', width: 48, textAlign: 'right' }}>Mentions</Typography>
                </Box>
                {data.map((row, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', py: 0.875, borderBottom: i < data.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                    <Box sx={{ flex: 1, minWidth: 0, mr: 1 }}>
                      <Typography sx={{ fontSize: 12, color: color, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{getLabel(row)}</Typography>
                      <Box sx={{ height: 4, bgcolor: '#f0f0f0', borderRadius: 1, mt: 0.5, overflow: 'hidden' }}>
                        <Box sx={{ width: `${row.pct}%`, height: '100%', bgcolor: color, borderRadius: 1 }} />
                      </Box>
                    </Box>
                    <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#212121', width: 32, textAlign: 'right', flexShrink: 0 }}>{row.mentions}</Typography>
                  </Box>
                ))}
                <Typography sx={{ fontSize: 11, color: 'text.secondary', textAlign: 'center', mt: 0.75 }}>1-5 of 50</Typography>
              </Paper>
            ))}
          </Box>

          {/* Top Subreddits + Top Forums */}
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

          {/* Emerging Mentioned Accounts */}
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

          {/* Top Mentioned Accounts */}
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

          {/* Mentions Average Activity */}
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

      </Box>{/* end content column */}

      {/* ── Anchor nav ───────────────────────────────────────────────────── */}
      <AnchorNav items={NAV_SECTIONS} />

    </Box>
  )
}
