import { Box, Typography, Paper, Divider, IconButton, Tooltip } from '@mui/material'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined'
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
import { useState, useRef, useEffect } from 'react'

// ── constants ────────────────────────────────────────────────────────────────

const TEAL   = '#1D9F9F'
const PURPLE = '#9C4DD6'
const PINK   = '#CF2D8A'
const ORANGE = '#FF9800'
const BLUE   = '#2196F3'
const GREEN  = '#4CAF50'
const COLORS = [TEAL, PURPLE, PINK, ORANGE, BLUE, GREEN]

const NAV_SECTIONS = [
  { id: 'cov-mentions',   label: 'Mentions',         Icon: ShowChartIcon },
  { id: 'cov-engagement', label: 'Engagement',       Icon: FavoriteBorderIcon },
  { id: 'cov-locations',  label: 'Locations',        Icon: LocationOnOutlinedIcon },
  { id: 'cov-sources',    label: 'Trending sources', Icon: ArticleOutlinedIcon },
]

// ── mock data ────────────────────────────────────────────────────────────────

const MENTION_DATA  = [12,18,14,22,19,28,17,24,20,32,25,18,30,22,35,28,20,26,18,24,30,22,28,35,20,25,30,22,18,26]
const VOLUME_DATA   = [20,28,22,35,30,42,28,36,32,48,38,28,45,34,52,42,32,40,28,38,45,34,42,52,32,38,45,34,28,40]
const TREND_DATA    = [8,12,9,16,13,20,14,18,15,24,19,12,22,16,28,20,14,18,12,16,22,15,19,26,13,17,22,16,12,18]

const ENG_DATASETS = [
  { label: 'Likes',    color: TEAL,   data: [30,45,35,55,48,70,40,52,46,75,58,42,68,50,82,65,48,57,42,53,67,50,62,82,48,57,67,50,42,57] },
  { label: 'Shares',   color: PURPLE, data: [12,18,14,22,19,28,17,21,18,30,23,17,27,20,33,26,19,23,17,21,27,20,25,33,19,23,27,20,17,23] },
  { label: 'Comments', color: PINK,   data: [5,8,6,10,8,12,7,9,8,13,10,7,12,9,14,11,8,10,7,9,12,9,11,14,8,10,12,9,7,10] },
]

const PLATFORM_DATASETS = [
  { label: 'Online News', color: TEAL,   data: [8,12,9,15,11,18,12,16,14,20,16,11,19,14,22,18,14,17,11,16,19,14,18,22,14,16,19,14,11,17] },
  { label: 'Twitter / X', color: BLUE,   data: [3,5,4,6,5,8,4,7,5,9,7,4,8,6,10,8,5,7,4,6,8,6,7,10,5,7,8,6,4,7] },
  { label: 'Broadcast',   color: ORANGE, data: [2,3,2,4,3,5,3,4,3,6,4,3,5,3,6,5,3,4,3,4,5,3,4,6,3,4,5,3,2,4] },
  { label: 'Print',       color: PURPLE, data: [1,2,1,2,2,3,2,2,2,3,2,2,3,2,3,2,2,2,2,2,3,2,2,3,2,2,3,2,2,2] },
]

const KEYWORDS = [
  { label: 'brand awareness', size: 22, color: TEAL },
  { label: 'media coverage',  size: 18, color: PURPLE },
  { label: 'press release',   size: 16, color: PINK },
  { label: 'sustainability',  size: 20, color: ORANGE },
  { label: 'Gen Z',           size: 15, color: BLUE },
  { label: 'influencer',      size: 14, color: GREEN },
  { label: 'zero sugar',      size: 13, color: TEAL },
  { label: 'esports',         size: 12, color: PURPLE },
  { label: 'healthier',       size: 12, color: PINK },
  { label: 'streaming',       size: 11, color: BLUE },
  { label: 'metaverse',       size: 11, color: ORANGE },
  { label: 'loyalty',         size: 13, color: GREEN },
]

const TOP_DOMAINS = [
  { name: 'The Washington Post', domain: 'washingtonpost.com', reach: '2.4M', bar: 100, initials: 'WP', color: '#1A237E' },
  { name: 'CNN',                 domain: 'cnn.com',            reach: '1.9M', bar: 79,  initials: 'CN', color: '#B71C1C' },
  { name: 'The New York Times',  domain: 'nytimes.com',        reach: '1.7M', bar: 71,  initials: 'NY', color: '#212121' },
  { name: 'The Guardian',        domain: 'theguardian.com',    reach: '1.2M', bar: 50,  initials: 'TG', color: '#2E7D32' },
  { name: 'Business Insider',    domain: 'businessinsider.com',reach: '980k', bar: 41,  initials: 'BI', color: '#E65100' },
]

const QUALITY_TIERS = [
  { label: 'Tier 1 – Premium',   value: 9200, max: 10000, color: TEAL   },
  { label: 'Tier 2 – Quality',   value: 8800, max: 10000, color: BLUE   },
  { label: 'Tier 3 – Standard',  value: 5400, max: 10000, color: PURPLE },
  { label: 'Tier 4 – Low',       value: 2100, max: 10000, color: ORANGE },
]

const MEDIA_TYPES = [
  { label: 'Online News', pct: 45, color: TEAL   },
  { label: 'Social Media',pct: 28, color: PURPLE },
  { label: 'Broadcast',   pct: 14, color: PINK   },
  { label: 'Print',       pct: 8,  color: ORANGE },
  { label: 'Blogs',       pct: 5,  color: BLUE   },
]

const OUTLETS = [
  { initials: 'WP', color: '#1A237E', name: 'The Washington Post', mentions: '3.1k', pct: 100, delta: 12 },
  { initials: 'CN', color: '#B71C1C', name: 'CNN',                 mentions: '2.4k', pct: 77,  delta: -3 },
  { initials: 'BB', color: '#1565C0', name: 'Bloomberg',           mentions: '2.1k', pct: 68,  delta: 8  },
  { initials: 'NY', color: '#212121', name: 'The New York Times',  mentions: '1.8k', pct: 58,  delta: 2  },
  { initials: 'RE', color: '#B71C1C', name: 'Reuters',             mentions: '1.5k', pct: 48,  delta: -5 },
]

const COUNTRIES = [
  { flag: '🇺🇸', label: 'United States',  value: 42800, pct: 100 },
  { flag: '🇬🇧', label: 'United Kingdom', value: 12300, pct: 29  },
  { flag: '🇨🇦', label: 'Canada',         value: 8700,  pct: 20  },
  { flag: '🇦🇺', label: 'Australia',      value: 6200,  pct: 14  },
  { flag: '🇩🇪', label: 'Germany',        value: 3100,  pct: 7   },
  { flag: '🇫🇷', label: 'France',         value: 2800,  pct: 6   },
]

const TIMELINE = [
  { date: 'Aug 31', mentions: '35.2k', reach: '1.27T', engagement: '11.7B', sentiment: 'Positive' },
  { date: 'Aug 30', mentions: '30.8k', reach: '1.12T', engagement: '9.4B',  sentiment: 'Neutral'  },
  { date: 'Aug 29', mentions: '28.1k', reach: '998B',  engagement: '8.8B',  sentiment: 'Positive' },
  { date: 'Aug 28', mentions: '22.4k', reach: '812B',  engagement: '7.1B',  sentiment: 'Negative' },
  { date: 'Aug 27', mentions: '18.9k', reach: '680B',  engagement: '5.9B',  sentiment: 'Neutral'  },
]

const HEATMAP_DATA = Array.from({ length: 7 }, (_, r) =>
  Array.from({ length: 24 }, (_, c) => {
    const base = c >= 9 && c <= 21 ? Math.random() * 80 + 20 : Math.random() * 20
    return Math.round(base * (r === 2 || r === 4 ? 1.4 : 1))
  })
)
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

// ── helpers ──────────────────────────────────────────────────────────────────

function AnchorNav({ items }) {
  const [active, setActive] = useState(items[0]?.id || '')
  const [compact, setCompact] = useState(false)
  const navRef = useRef(null)

  useEffect(() => {
    const el = navRef.current
    if (!el) return
    // Find the scrollable ancestor (the right panel)
    let scrollEl = el.parentElement
    while (scrollEl && scrollEl !== document.body) {
      const s = window.getComputedStyle(scrollEl)
      if (s.overflow === 'auto' || s.overflowY === 'auto' || s.overflow === 'scroll' || s.overflowY === 'scroll') break
      scrollEl = scrollEl.parentElement
    }
    if (!scrollEl || scrollEl === document.body) return

    // Highlight the section currently in view
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

    // Switch between full/compact based on scroll container width
    const ro = new ResizeObserver(([entry]) => {
      setCompact(entry.contentRect.width < 620)
    })
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
                display: 'flex',
                alignItems: 'center',
                gap: compact ? 0 : 1.25,
                pl: 1.5,
                pr: compact ? 1 : 2,
                py: 0.875,
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
                <Typography sx={{
                  fontSize: 14,
                  fontWeight: isActive ? 700 : 400,
                  color: isActive ? '#212121' : '#424242',
                  whiteSpace: 'nowrap',
                }}>
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

function WidgetHeader({ title, info = true, action }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
        <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#212121' }}>{title}</Typography>
        {info && <InfoOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {action}
        <IconButton size="small"><MoreVertIcon sx={{ fontSize: 18, color: 'text.secondary' }} /></IconButton>
      </Box>
    </Box>
  )
}

function MetricKpi({ label, value, delta }) {
  const pos = delta >= 0
  return (
    <Box>
      <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 0.25 }}>{label}</Typography>
      <Typography sx={{ fontSize: 28, fontWeight: 700, color: '#212121', lineHeight: 1.1 }}>{value}</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, bgcolor: pos ? '#E8F5E9' : '#FFEBEE', color: pos ? '#2E7D32' : '#C62828', fontSize: 11, fontWeight: 700, px: 0.75, py: 0.25, borderRadius: 1 }}>
          {pos ? <ArrowUpwardIcon sx={{ fontSize: 11 }} /> : <ArrowDownwardIcon sx={{ fontSize: 11 }} />}
          {Math.abs(delta)}%
        </Box>
        <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>vs prev period</Typography>
      </Box>
    </Box>
  )
}

function LineChart({ data, color = TEAL, height = 160 }) {
  const w = 800, h = height
  const max = Math.max(...data), min = Math.min(...data), range = max - min || 1
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 8) - 4}`).join(' ')
  const fill = `0,${h} ${pts} ${w},${h}`
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" width="100%" height={height} style={{ display: 'block' }}>
      <polygon points={fill} fill={color} fillOpacity="0.10" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}

function MultiLineChart({ datasets, height = 140 }) {
  const w = 800, h = height
  const allVals = datasets.flatMap(d => d.data)
  const max = Math.max(...allVals), min = Math.min(...allVals), range = max - min || 1
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" width="100%" height={height} style={{ display: 'block' }}>
      {datasets.map((ds, di) => {
        const pts = ds.data.map((v, i) => `${(i / (ds.data.length - 1)) * w},${h - ((v - min) / range) * (h - 4) - 2}`).join(' ')
        return <polyline key={di} points={pts} fill="none" stroke={ds.color || COLORS[di % COLORS.length]} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      })}
    </svg>
  )
}

function XLabels({ labels }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5, px: 0.5 }}>
      {labels.map(l => <Typography key={l} sx={{ fontSize: 11, color: 'text.secondary' }}>{l}</Typography>)}
    </Box>
  )
}

function ChartLegend({ datasets }) {
  return (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 1.5 }}>
      {datasets.map((ds, i) => (
        <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: ds.color || COLORS[i % COLORS.length], flexShrink: 0 }} />
          <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{ds.label}</Typography>
        </Box>
      ))}
    </Box>
  )
}

function HBar({ label, value, max, color = TEAL }) {
  const pct = Math.round((value / max) * 100)
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
      <Typography sx={{ fontSize: 13, color: '#424242', width: 130, flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</Typography>
      <Box sx={{ flex: 1, height: 8, bgcolor: '#f0f0f0', borderRadius: 1, overflow: 'hidden' }}>
        <Box sx={{ width: `${pct}%`, height: '100%', bgcolor: color, borderRadius: 1 }} />
      </Box>
      <Typography sx={{ fontSize: 12, color: 'text.secondary', width: 36, textAlign: 'right', flexShrink: 0 }}>{pct}%</Typography>
    </Box>
  )
}

function DonutChart({ data, size = 160 }) {
  const cx = size / 2, cy = size / 2, r = size * 0.42, inner = size * 0.25
  let angle = -Math.PI / 2
  const slices = data.map(s => {
    const sweep = (s.pct / 100) * 2 * Math.PI
    const x1 = cx + r * Math.cos(angle), y1 = cy + r * Math.sin(angle)
    angle += sweep
    const x2 = cx + r * Math.cos(angle), y2 = cy + r * Math.sin(angle)
    const xi1 = cx + inner * Math.cos(angle - sweep), yi1 = cy + inner * Math.sin(angle - sweep)
    const xi2 = cx + inner * Math.cos(angle), yi2 = cy + inner * Math.sin(angle)
    const large = sweep > Math.PI ? 1 : 0
    return { ...s, d: `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${xi2} ${yi2} A ${inner} ${inner} 0 ${large} 0 ${xi1} ${yi1} Z` }
  })
  return (
    <svg width={size} height={size} style={{ flexShrink: 0, display: 'block' }}>
      {slices.map((s, i) => <path key={i} d={s.d} fill={s.color} opacity={0.9} />)}
      <circle cx={cx} cy={cy} r={inner} fill="white" />
      <text x={cx} y={cy - 6} textAnchor="middle" fontSize="13" fontWeight="700" fill="#212121">234k</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fontSize="11" fill="#757575">articles</text>
    </svg>
  )
}

const X_LABELS_DAILY = ['Aug 25', 'Aug 26', 'Aug 27', 'Aug 28', 'Aug 29', 'Aug 30', 'Aug 31']

// ── main component ───────────────────────────────────────────────────────────

export default function CoverageTabContent({ onDashboardSave, loading }) {
  if (loading) return null
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>

      {/* ── Content column ───────────────────────────────────────────────── */}
      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1.5 }}>

      {/* ── AI Insights ──────────────────────────────────────────────────── */}
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
          <Typography sx={{ fontSize: 15, fontWeight: 700, lineHeight: '22px', color: '#212121', mb: 1 }}>
            Coverage Spike Driven by Product Launch & Sustainability Narrative
          </Typography>
          <Box component="ul" sx={{ m: 0, pl: 2.5, mb: 1.5 }}>
            {[
              'Mention volume surged 37% on Aug 31 — driven primarily by Online News (45%) and Twitter/X (28%), coinciding with the new product announcement. 1, 2, 3',
              'Tier 1 premium outlets account for 92% of reach, with The Washington Post, CNN and NYT leading coverage, indicating strong mainstream media traction. 4, 5',
              'Sustainability and zero-sugar keywords are gaining momentum week-over-week, suggesting an emerging narrative shift worth tracking for proactive PR opportunities. 6, 7, 8…',
            ].map((text, i) => (
              <Typography key={i} component="li" sx={{ fontSize: 14, lineHeight: '22px', color: '#212121', mb: 0.75 }}>{text}</Typography>
            ))}
          </Box>
          <Typography sx={{ fontSize: 14, fontWeight: 700, color: TEAL, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
            View More Insights
          </Typography>
        </Box>
      </Box>

      {/* ── MENTIONS ─────────────────────────────────────────────────────── */}
      <Box id="cov-mentions" sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>

        {/* Mentions over Time */}
        <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, p: 2 }}>
          <WidgetHeader title="Mentions over Time" />
          <Box sx={{ display: 'flex', gap: 4, mb: 2 }}>
            <MetricKpi label="Total Mentions" value="35.2k" delta={37} />
            <Divider orientation="vertical" flexItem />
            <MetricKpi label="Daily Average" value="5.03k" delta={12} />
          </Box>
          <LineChart data={MENTION_DATA} color={TEAL} height={140} />
          <XLabels labels={X_LABELS_DAILY} />
        </Paper>

        {/* Volume over Time */}
        <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, p: 2 }}>
          <WidgetHeader title="Volume over Time" />
          <Box sx={{ display: 'flex', gap: 4, mb: 2 }}>
            <MetricKpi label="Total Volume" value="1.27T" delta={8} />
            <Divider orientation="vertical" flexItem />
            <MetricKpi label="Avg. Reach per Article" value="36.1M" delta={5} />
          </Box>
          <LineChart data={VOLUME_DATA} color={BLUE} height={140} />
          <XLabels labels={X_LABELS_DAILY} />
        </Paper>

      </Box>

      {/* ── ENGAGEMENT ───────────────────────────────────────────────────── */}
      <Box id="cov-engagement" sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>

        {/* Engagement over Time */}
        <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, p: 2 }}>
          <WidgetHeader title="Engagement over Time" />
          <Box sx={{ display: 'flex', gap: 4, mb: 2 }}>
            <MetricKpi label="Total Engagement" value="11.7B" delta={14} />
            <Divider orientation="vertical" flexItem />
            <MetricKpi label="Avg. per Article" value="49.8k" delta={6} />
          </Box>
          <ChartLegend datasets={ENG_DATASETS} />
          <MultiLineChart datasets={ENG_DATASETS} height={140} />
          <XLabels labels={X_LABELS_DAILY} />
        </Paper>

        {/* Keyword Volume Distribution */}
        <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, p: 2 }}>
          <WidgetHeader title="Keyword Volume Distribution" />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 0.5, minHeight: 100 }}>
            {KEYWORDS.map((kw, i) => (
              <Typography key={i} sx={{ fontSize: kw.size, fontWeight: kw.size >= 18 ? 700 : 500, color: kw.color, cursor: 'pointer', lineHeight: 1.4, '&:hover': { opacity: 0.75 } }}>
                {kw.label}
              </Typography>
            ))}
          </Box>
        </Paper>

        {/* Reach Potential */}
        <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, pt: 1.5, pb: 1 }}>
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#212121' }}>Reach Potential</Typography>
            <IconButton size="small"><MoreVertIcon sx={{ fontSize: 18, color: 'text.secondary' }} /></IconButton>
          </Box>
          <Divider />
          <Box sx={{ display: 'flex', width: '100%' }}>
            {[
              { label: 'Total Reach',  value: '1.27T', delta: 8  },
              { label: 'Avg. Reach',   value: '36.1M', delta: 5  },
              { label: 'Peak Reach',   value: '212B',  delta: 22 },
            ].map((kpi, i, arr) => (
              <Box key={i} sx={{ flex: 1, minWidth: 0, p: 2, borderRight: i < arr.length - 1 ? '1px solid #e0e0e0' : 'none' }}>
                <MetricKpi label={kpi.label} value={kpi.value} delta={kpi.delta} />
              </Box>
            ))}
          </Box>
        </Paper>

      </Box>

      {/* ── SOURCES & REACH ──────────────────────────────────────────────── */}
      <Box id="cov-sources" sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>

        {/* Top Domains */}
        <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, p: 2 }}>
          <WidgetHeader title="Top Domains" />
          <Box sx={{ display: 'flex', px: 0, pb: 1, borderBottom: '1px solid #e0e0e0', mb: 0.5 }}>
            <Box sx={{ flex: 1 }}><Typography sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary' }}>Source</Typography></Box>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary', width: 80, textAlign: 'right' }}>Reach</Typography>
            <Box sx={{ width: 64 }} />
          </Box>
          {TOP_DOMAINS.map((row, i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center', py: 1.25, borderBottom: i < TOP_DOMAINS.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flex: 1, minWidth: 0 }}>
                <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: row.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'white' }}>{row.initials}</Typography>
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#212121', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.name}</Typography>
                  <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{row.domain}</Typography>
                </Box>
              </Box>
              <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#212121', width: 80, textAlign: 'right', flexShrink: 0 }}>{row.reach}</Typography>
              <Box sx={{ width: 64, display: 'flex', justifyContent: 'flex-end', gap: 0.25, flexShrink: 0 }}>
                <IconButton size="small"><OpenInNewIcon sx={{ fontSize: 15, color: 'text.secondary' }} /></IconButton>
                <IconButton size="small"><PlaylistAddIcon sx={{ fontSize: 15, color: 'text.secondary' }} /></IconButton>
              </Box>
            </Box>
          ))}
          <Box sx={{ pt: 1, borderTop: '1px solid #e0e0e0', mt: 0.5 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: TEAL, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>View all</Typography>
          </Box>
        </Paper>

        {/* Platform Coverage */}
        <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, p: 2 }}>
          <WidgetHeader title="Platform Coverage" />
          <ChartLegend datasets={PLATFORM_DATASETS} />
          <MultiLineChart datasets={PLATFORM_DATASETS} height={140} />
          <XLabels labels={X_LABELS_DAILY} />
        </Paper>

        {/* Source Quality Distribution + Media Type Distribution */}
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>

          <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, p: 2, flex: 1, minWidth: 260 }}>
            <WidgetHeader title="Source Quality Distribution" />
            {QUALITY_TIERS.map((t, i) => (
              <HBar key={i} label={t.label} value={t.value} max={t.max} color={t.color} />
            ))}
          </Paper>

          <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, p: 2, flex: 1, minWidth: 260 }}>
            <WidgetHeader title="Media Type Distribution" />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
              <DonutChart data={MEDIA_TYPES} size={150} />
              <Box sx={{ flex: 1 }}>
                {MEDIA_TYPES.map((t, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: t.color, flexShrink: 0 }} />
                    <Typography sx={{ fontSize: 13, color: '#424242', flex: 1 }}>{t.label}</Typography>
                    <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#212121' }}>{t.pct}%</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Paper>

        </Box>

        {/* Outlet Distribution */}
        <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, p: 2 }}>
          <WidgetHeader title="Outlet Distribution" />
          <Box sx={{ display: 'flex', pb: 1, borderBottom: '1px solid #e0e0e0', mb: 0.5 }}>
            <Box sx={{ flex: 1 }}><Typography sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary' }}>Outlet</Typography></Box>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary', width: 60, textAlign: 'right', flexShrink: 0 }}>Mentions</Typography>
            <Box sx={{ width: 120, flexShrink: 0, ml: 1 }}><Typography sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary' }}>Share</Typography></Box>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary', width: 48, textAlign: 'center', flexShrink: 0 }}>Trend</Typography>
          </Box>
          {OUTLETS.map((row, i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center', py: 1.25, borderBottom: i < OUTLETS.length - 1 ? '1px solid #f5f5f5' : 'none', '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flex: 1, minWidth: 0 }}>
                <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: row.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'white' }}>{row.initials}</Typography>
                </Box>
                <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#212121', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.name}</Typography>
              </Box>
              <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#212121', width: 60, textAlign: 'right', flexShrink: 0 }}>{row.mentions}</Typography>
              <Box sx={{ width: 120, flexShrink: 0, ml: 1 }}>
                <Box sx={{ height: 8, bgcolor: '#f0f0f0', borderRadius: 1, overflow: 'hidden' }}>
                  <Box sx={{ width: `${row.pct}%`, height: '100%', bgcolor: TEAL, borderRadius: 1 }} />
                </Box>
              </Box>
              <Box sx={{ width: 48, flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
                <Box sx={{ bgcolor: row.delta >= 0 ? '#E8F5E9' : '#FFEBEE', color: row.delta >= 0 ? '#2E7D32' : '#C62828', fontSize: 11, fontWeight: 700, px: 0.75, py: 0.25, borderRadius: 1 }}>
                  {row.delta >= 0 ? '+' : ''}{row.delta}%
                </Box>
              </Box>
            </Box>
          ))}
          <Box sx={{ pt: 1, borderTop: '1px solid #e0e0e0', mt: 0.5 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: TEAL, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>View all</Typography>
          </Box>
        </Paper>

      </Box>

      {/* ── LOCATIONS ────────────────────────────────────────────────────── */}
      <Box id="cov-locations" sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>

        {/* Coverage by Country */}
        <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, p: 2 }}>
          <WidgetHeader title="Coverage by Country" />
          <Box sx={{ display: 'flex', pb: 1, borderBottom: '1px solid #e0e0e0', mb: 0.5 }}>
            <Box sx={{ flex: 1 }}><Typography sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary' }}>Country</Typography></Box>
            <Box sx={{ width: 140, flexShrink: 0 }}><Typography sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary' }}>Reach</Typography></Box>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary', width: 52, textAlign: 'right', flexShrink: 0 }}>Articles</Typography>
          </Box>
          {COUNTRIES.map((c, i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center', py: 1.25, borderBottom: i < COUNTRIES.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                <Typography sx={{ fontSize: 20 }}>{c.flag}</Typography>
                <Typography sx={{ fontSize: 14, color: '#212121' }}>{c.label}</Typography>
              </Box>
              <Box sx={{ width: 140, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ flex: 1, height: 8, bgcolor: '#f0f0f0', borderRadius: 1, overflow: 'hidden' }}>
                  <Box sx={{ width: `${c.pct}%`, height: '100%', bgcolor: TEAL, borderRadius: 1 }} />
                </Box>
              </Box>
              <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#212121', width: 52, textAlign: 'right', flexShrink: 0 }}>
                {(c.value / 1000).toFixed(0)}k
              </Typography>
            </Box>
          ))}
        </Paper>

      </Box>

      {/* ── TIMELINE ─────────────────────────────────────────────────────── */}
      <Box id="cov-timeline" sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>

        {/* Coverage Timeline */}
        <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, p: 2 }}>
          <WidgetHeader title="Coverage Timeline" />
          <Box sx={{ display: 'flex', pb: 1, borderBottom: '1px solid #e0e0e0', mb: 0.5 }}>
            {['Date', 'Mentions', 'Reach', 'Engagement', 'Sentiment'].map((h, i) => (
              <Typography key={i} sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary', flex: i === 0 ? '0 0 80px' : 1, textAlign: i > 0 ? 'right' : 'left' }}>{h}</Typography>
            ))}
          </Box>
          {TIMELINE.map((row, i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center', py: 1.25, borderBottom: i < TIMELINE.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
              <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#212121', flex: '0 0 80px' }}>{row.date}</Typography>
              <Typography sx={{ fontSize: 13, color: '#424242', flex: 1, textAlign: 'right' }}>{row.mentions}</Typography>
              <Typography sx={{ fontSize: 13, color: '#424242', flex: 1, textAlign: 'right' }}>{row.reach}</Typography>
              <Typography sx={{ fontSize: 13, color: '#424242', flex: 1, textAlign: 'right' }}>{row.engagement}</Typography>
              <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                <Box sx={{ bgcolor: row.sentiment === 'Positive' ? '#E8F5E9' : row.sentiment === 'Negative' ? '#FFEBEE' : '#F5F5F5', color: row.sentiment === 'Positive' ? '#2E7D32' : row.sentiment === 'Negative' ? '#C62828' : '#616161', fontSize: 11, fontWeight: 700, px: 0.75, py: 0.25, borderRadius: 1 }}>
                  {row.sentiment}
                </Box>
              </Box>
            </Box>
          ))}
          <Box sx={{ pt: 1, borderTop: '1px solid #e0e0e0', mt: 0.5 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: TEAL, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>View all</Typography>
          </Box>
        </Paper>

        {/* Geographic Heatmap */}
        <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, overflow: 'hidden' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, pt: 1.5, pb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#212121' }}>Geographic Heatmap</Typography>
              <InfoOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            </Box>
            <IconButton size="small"><MoreVertIcon sx={{ fontSize: 18, color: 'text.secondary' }} /></IconButton>
          </Box>
          <Box sx={{ px: 2, pb: 2 }}>
            <Box sx={{ display: 'flex', gap: 0, mt: 0.5 }}>
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

        {/* Coverage Trends */}
        <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, p: 2 }}>
          <WidgetHeader title="Coverage Trends" />
          <Box sx={{ display: 'flex', gap: 4, mb: 2 }}>
            <MetricKpi label="Weekly Growth" value="+18%" delta={18} />
            <Divider orientation="vertical" flexItem />
            <MetricKpi label="MoM Change" value="+37%" delta={37} />
          </Box>
          <LineChart data={TREND_DATA} color={PURPLE} height={140} />
          <XLabels labels={X_LABELS_DAILY} />
        </Paper>

      </Box>

      </Box>{/* end content column */}

      {/* ── Anchor nav ───────────────────────────────────────────────────── */}
      <AnchorNav items={NAV_SECTIONS} />

    </Box>
  )
}
