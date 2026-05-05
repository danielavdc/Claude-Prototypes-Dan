import { Box, Typography, IconButton } from '@mui/material'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt'
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { useState, useRef, useEffect } from 'react'

// ── constants ─────────────────────────────────────────────────────────────────

const TEAL   = '#1D9F9F'
const BLUE   = '#2196F3'
const GREEN  = '#4CAF50'
const RED    = '#F44336'
const YELLOW = '#FFC107'
const ORANGE = '#FF9800'
const GRAY   = '#9E9E9E'
const DARK   = '#424242'
const PINK   = '#CF2D8A'
const PURPLE = '#9C4DD6'

const SOCIAL_TABS = [
  { id: 'x',       label: 'X' },
  { id: 'youtube', label: 'Youtube' },
  { id: 'weibo',   label: 'Weibo' },
]

const SPARKLINE_DATA = [10,12,14,11,13,15,14,12,13,16,14,13,15,12,14,13,16,14,12,15,13,14,16,12,14,15]
const X_LABELS_AUG   = ['Aug 25','Aug 26','Aug 27','Aug 28','Aug 29','Aug 30','Aug 31']
const X_LABELS_APR   = ['Apr 2','Apr 3','Apr 4','Apr 5','Apr 6','Apr 7','Apr 8','Apr 9','Apr 10']

// X data
const X_POST_TYPE_TREND = [
  { label: 'Retweets',      color: BLUE,   data: [28,35,32,55,38,30,28] },
  { label: 'Replies',       color: YELLOW, data: [18,22,20,35,25,20,18] },
  { label: 'Quoted',        color: PINK,   data: [12,15,14,24,17,14,12] },
  { label: 'Original Posts', color: GREEN, data: [8,10,9,16,11,9,8] },
]
const X_SENTIMENT_TREND = [
  { label: 'Positive',  color: GREEN, data: [22,28,35,55,40,32,25] },
  { label: 'Negative',  color: RED,   data: [15,18,22,35,25,20,16] },
  { label: 'Neutral',   color: GRAY,  data: [12,14,17,28,20,16,13] },
  { label: 'Not Rated', color: DARK,  data: [8,10,12,18,13,10,8] },
]
const X_TOP_POS_KW = [
  { text: 'green apple#a', size: 13, }, { text: 'great blessings', size: 16 }, { text: 'holy bible', size: 15 },
  { text: 'songs', size: 12 }, { text: 'bills', size: 13 }, { text: 'news', size: 13 }, { text: 'strategy', size: 18 },
  { text: 'money', size: 20 }, { text: 'apple', size: 16 }, { text: 'cash app', size: 22 }, { text: 'blessings', size: 14 },
  { text: 'パフォーマンス', size: 12 }, { text: 'apple music', size: 14 }, { text: 'cash app tag', size: 15 },
]
const X_TOP_NEG_KW = [
  { text: 'security concerns', size: 14 }, { text: 'bans', size: 18 }, { text: '19th wave', size: 22 },
  { text: 'ordinary evening', size: 20 }, { text: 'money', size: 15 }, { text: 'cash app', size: 16 },
  { text: 'anti-union', size: 14 }, { text: 'apple store', size: 16 }, { text: 'scandal', size: 15 },
  { text: 'sanctions', size: 18 }, { text: 'cold apple juice', size: 14 }, { text: 'apple', size: 20 },
  { text: 'samsung phones', size: 14 }, { text: 'apple devices', size: 15 },
]
const X_KEYWORDS = [
  { text: 'Boston Red Sox', type: 'org', size: 14 }, { text: 'fans', type: 'keyword', size: 12 },
  { text: 'patients', type: 'keyword', size: 12 }, { text: 'IKEA', type: 'org', size: 13 },
  { text: 'Answer Engine', type: 'keyword', size: 14 }, { text: 'MLB', type: 'org', size: 13 },
  { text: '#policeprofessi', type: 'hashtag', size: 12 }, { text: 'LLMs', type: 'keyword', size: 15 },
  { text: 'Real Estate Agence', type: 'keyword', size: 13 }, { text: 'coaching to ensure', type: 'keyword', size: 12 },
  { text: 'GPT-4', type: 'keyword', size: 14 }, { text: 'Clemson University', type: 'org', size: 14 },
  { text: 'University of SC', type: 'org', size: 22 }, { text: 'Dallas', type: 'keyword', size: 13 },
  { text: 'Don White', type: 'people', size: 12 }, { text: 'Colombia', type: 'keyword', size: 12 },
  { text: 'Leon Lott', type: 'people', size: 12 }, { text: '#entirecounty', type: 'hashtag', size: 13 },
  { text: 'technology', type: 'keyword', size: 18 }, { text: 'Anthony', type: 'people', size: 13 },
  { text: 'South Carolina', type: 'keyword', size: 16 }, { text: 'Richland County Sheriff\'s Department', type: 'org', size: 11 },
]
const KW_COLORS = { keyword: PINK, hashtag: ORANGE, org: '#1565C0', people: '#3F51B5' }
const X_HASHTAGS = [
  { label: '#teslaradar', v: 903 }, { label: '#model3', v: 823 }, { label: '#bestinclass', v: 522 },
  { label: '#forsafercards', v: 467 }, { label: '#teslamodels', v: 333 }, { label: '#electricar', v: 288 },
  { label: '#elonmusk', v: 153 }, { label: '#executivecar', v: 102 }, { label: '#electricvehicles', v: 67 }, { label: '#ev', v: 58 },
]
const X_AUTHORS = [
  { initials: 'CN', color: RED,    name: 'CNN',        handle: '@cnn',      tweets: '134k', followers: '134k' },
  { initials: 'SK', color: PINK,   name: 'Shakira',    handle: '@shakira',  tweets: '134k', followers: '134k' },
  { initials: 'BB', color: '#C62828', name: 'BBCWorld', handle: '@bbcworld', tweets: '134k', followers: '134k' },
  { initials: 'BL', color: '#1565C0', name: 'BillBoards', handle: '@bino',  tweets: '134k', followers: '134k' },
  { initials: 'HP', color: '#4A148C', name: 'Huffpost',  handle: '@bno',    tweets: '134k', followers: '134k' },
]
const X_LOCATIONS = [
  { flag: '🇺🇸', name: 'United States', v: 903 }, { flag: '🇨🇦', name: 'Canada', v: 823 },
  { flag: '🇨🇮', name: 'Ivory Coast', v: 522 }, { flag: '🇲🇽', name: 'Mexico', v: 487 },
  { flag: '🇨🇳', name: 'Mainland China', v: 303 }, { flag: '🇩🇪', name: 'Germany', v: 288 },
  { flag: '🇲🇾', name: 'Malaysia', v: 153 }, { flag: '🇳🇿', name: 'New Zealand', v: 102 },
  { flag: '🇨🇳', name: 'China', v: 67 }, { flag: '🇬🇧', name: 'United Kingdom', v: 58 },
]

// Youtube data
const YT_TOTAL_DATA   = [35,20,45,30,55,28,40,22,50,35,28,42,30,48,25,38,44,30,52,35,28,40,32,46,28,38]
const YT_AUDIENCE_BARS = [45, 130, 85, 250, 75, 185, 95, 55, 20]
const YT_AUDIENCE_LINE = [8000,12000,15000,22000,8000,18000,12000,6000,2000]
const YT_SEARCHES = [
  { name: 'Sina Weibo', mentions: '132.4k', pct: 60, barColor: BLUE,   delta: '4%',   up: false },
  { name: 'Sina Weibo', mentions: '132.4k', pct: 60, barColor: YELLOW, delta: '180%', up: true  },
  { name: 'Sina Weibo', mentions: '132.4k', pct: 60, barColor: PINK,   delta: '0%',   up: null  },
  { name: 'Sina Weibo', mentions: '132.4k', pct: 60, barColor: GREEN,  delta: '0%',   up: null  },
  { name: 'Sina Weibo', mentions: '132.4k', pct: 60, barColor: ORANGE, delta: '0%',   up: null  },
]
const YT_TREND_SEARCHES = [
  { label: 'Lisboa',          color: BLUE,   data: [30,10,55,35,10,20,10,8,30,10,8,5,25,8,5] },
  { label: 'Arctic Monkeys',  color: YELLOW, data: [12,8,28,18,5,10,8,5,10,5,5,3,8,5,3] },
  { label: 'IGIT',            color: PINK,   data: [8,20,12,8,20,6,5,8,5,8,5,3,5,8,7] },
]
const YT_HASHTAGS = [
  { text: '#Real Estate Ma...', size: 16 }, { text: '#Rugs', size: 18 }, { text: '#Natural landscapes', size: 22 },
  { text: '#Backyards', size: 20 }, { text: '#entire line', size: 15 }, { text: '#Interiors', size: 24 },
  { text: '#value', size: 16 }, { text: '#Woven Baskets', size: 20 }, { text: '#Desks', size: 22 },
  { text: '#Nature', size: 16 }, { text: '#Trees and leaves', size: 18 }, { text: '#Lego', size: 17 },
  { text: '#Backyards', size: 20 }, { text: '#Home Interiors', size: 32 }, { text: '#Desks', size: 26 },
  { text: '#entire line', size: 15 }, { text: '#FilzFelt', size: 16 }, { text: '#Gaming', size: 22 },
  { text: '#Office Sp...', size: 20 }, { text: '#Computers', size: 24 }, { text: '#Woven Baskets', size: 16 },
]

// Weibo data
const WB_MENTIONS_TREND = [
  { label: 'All',            color: BLUE,    data: [25,30,55,42,28,32,25] },
  { label: 'Original Posts', color: '#212121', data: [12,14,25,20,13,15,12] },
  { label: 'Reposts',        color: ORANGE,  data: [8,9,16,12,8,10,8] },
  { label: 'Replies',        color: GRAY,    data: [5,7,14,10,7,7,5] },
]
const WB_ENGAGEMENT_TREND = [
  { label: 'All',      color: BLUE,   data: [22,28,50,38,24,30,22] },
  { label: 'Reposts',  color: '#212121', data: [10,13,24,18,11,14,10] },
  { label: 'Comments', color: ORANGE, data: [7,9,16,12,8,9,7] },
  { label: 'Likes',    color: YELLOW, data: [5,6,10,8,5,7,5] },
]
const WB_CONTENT_TYPES = [
  { label: 'Link', v: 55.1, color: '#303F9F' }, { label: 'Status', v: 40, color: '#303F9F' },
  { label: 'Album', v: 38.1, color: '#303F9F' }, { label: 'Photo', v: 21.3, color: '#303F9F' }, { label: 'Video', v: 11.5, color: '#303F9F' },
]
const WB_POST_TYPES = [
  { label: 'Original Posts', v: 52.1, color: '#303F9F' },
  { label: 'Reposts', v: 38.3, color: '#303F9F' },
  { label: 'Replies', v: 30.9, color: '#7986CB' },
]
const WB_ONLINE_ACTIVITY = [
  { day: 'Thu', time: '8:00 - 9:00 AM',  count: '134k' },
  { day: 'Mon', time: '7:00 - 8:00 AM',  count: '134k' },
  { day: 'Wed', time: '8:00 - 9:00 PM',  count: '134k' },
  { day: 'Thu', time: '10:00 - 11:00 AM', count: '134k' },
  { day: 'Fri', time: '8:00 - 9:00 AM',  count: '134k' },
  { day: 'Fri', time: '4:00 - 5:00 PM',  count: '134k' },
  { day: 'Thu', time: '11:00 AM - 12:00 PM', count: '134k' },
]
const WB_FAN_COUNT = [
  { label: '0-49',    v: 11.5 }, { label: '50-199',   v: 21.3 },
  { label: '200-499', v: 40   }, { label: '500-799',  v: 55.1 },
  { label: '800-999', v: 38.1 }, { label: '1000-1599', v: 22.3 }, { label: '2000+', v: 11.1 },
]
const WB_HEATMAP = Array.from({ length: 7 }, (_, r) =>
  Array.from({ length: 24 }, (_, c) => {
    const base = c >= 7 && c <= 22 ? Math.random() * 70 + 20 : Math.random() * 15
    return Math.round(base * (r === 1 || r === 3 ? 1.5 : 1))
  })
)
const WB_DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
const WB_SENTIMENT_TREND = [
  { label: 'Positive',  color: GREEN, data: [20,28,55,40,25,32,20] },
  { label: 'Negative',  color: RED,   data: [14,18,35,26,16,20,14] },
  { label: 'Neutral',   color: GRAY,  data: [10,13,25,18,11,14,10] },
  { label: 'Not Rated', color: DARK,  data: [6,8,15,11,7,9,6] },
]

// ── shared helpers ────────────────────────────────────────────────────────────

function WH({ title, download, action }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
        <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#212121' }}>{title}</Typography>
        <InfoOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {action}
        {download
          ? <IconButton size="small"><DownloadOutlinedIcon sx={{ fontSize: 18, color: 'text.secondary' }} /></IconButton>
          : <IconButton size="small"><MoreVertIcon sx={{ fontSize: 18, color: 'text.secondary' }} /></IconButton>}
      </Box>
    </Box>
  )
}

function Sparkline({ data, color }) {
  const w = 200, h = 40, max = Math.max(...data), min = Math.min(...data), range = max - min || 1
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 4) - 2}`).join(' ')
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ display: 'block' }}>
      <polygon points={`0,${h} ${pts} ${w},${h}`} fill={color} fillOpacity="0.12" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}

function MultiLine({ datasets, height = 160, xLabels }) {
  const w = 800, h = height, allVals = datasets.flatMap(d => d.data)
  const max = Math.max(...allVals) || 1
  return (
    <Box>
      <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ display: 'block' }}>
        {[0, 0.25, 0.5, 0.75, 1].map((f, i) => {
          const y = h - f * (h - 8) - 4
          const v = Math.round(f * max)
          return <g key={i}>
            <line x1={0} y1={y} x2={w} y2={y} stroke="#f0f0f0" strokeWidth="1" />
            <text x={-4} y={y + 3} textAnchor="end" fontSize="9" fill="#9E9E9E">{v >= 1000 ? `${Math.round(v / 1000)}k` : v}</text>
          </g>
        })}
        {datasets.map((ds, di) => {
          const pts = ds.data.map((v, i) => `${(i / (ds.data.length - 1)) * w},${h - (v / max) * (h - 8) - 4}`).join(' ')
          return <polyline key={di} points={pts} fill="none" stroke={ds.color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        })}
      </svg>
      {xLabels && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
          {xLabels.map(l => <Typography key={l} sx={{ fontSize: 10, color: 'text.secondary' }}>{l}</Typography>)}
        </Box>
      )}
    </Box>
  )
}

function Legend({ datasets }) {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 1.25 }}>
      {datasets.map((ds, i) => (
        <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: ds.color }} />
          <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{ds.label}</Typography>
          {ds.count && <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#212121' }}>{ds.count}</Typography>}
        </Box>
      ))}
    </Box>
  )
}

function Donut({ segments, size = 130 }) {
  const cx = size / 2, cy = size / 2, r = size * 0.4, ir = size * 0.24
  let cum = -90
  const paths = segments.map(s => {
    const start = (cum * Math.PI) / 180
    const sweep = (s.pct / 100) * 360; cum += sweep
    const end = (cum * Math.PI) / 180, large = sweep > 180 ? 1 : 0
    return { ...s, d: `M ${cx + r * Math.cos(start)} ${cy + r * Math.sin(start)} A ${r} ${r} 0 ${large} 1 ${cx + r * Math.cos(end)} ${cy + r * Math.sin(end)} L ${cx + ir * Math.cos(end)} ${cy + ir * Math.sin(end)} A ${ir} ${ir} 0 ${large} 0 ${cx + ir * Math.cos(start)} ${cy + ir * Math.sin(start)} Z` }
  })
  return (
    <svg width={size} height={size} style={{ display: 'block', flexShrink: 0 }}>
      {paths.map((p, i) => <path key={i} d={p.d} fill={p.color} stroke="white" strokeWidth="1.5" />)}
      <circle cx={cx} cy={cy} r={ir} fill="white" />
    </svg>
  )
}

function KpiCard({ title, value, delta, sub, data, color }) {
  return (
    <Box sx={{ flex: 1, minWidth: 160, border: '1px solid #e0e0e0', borderRadius: 0.5, bgcolor: 'white', p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#212121' }}>{title}</Typography>
          <InfoOutlinedIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
        </Box>
        <IconButton size="small"><MoreVertIcon sx={{ fontSize: 16, color: 'text.secondary' }} /></IconButton>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75, mb: 0.25 }}>
        <Typography sx={{ fontSize: 28, fontWeight: 700, color: '#212121', lineHeight: 1.1 }}>{value}</Typography>
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.25, bgcolor: '#E8F5E9', color: '#2E7D32', fontSize: 11, fontWeight: 700, px: 0.75, py: 0.2, borderRadius: 1 }}>
          <ArrowUpwardIcon sx={{ fontSize: 11 }} />{delta}
        </Box>
      </Box>
      {sub && <Typography sx={{ fontSize: 11, color: 'text.secondary', mb: 1 }}>{sub}</Typography>}
      <Sparkline data={data} color={color || TEAL} />
    </Box>
  )
}

function AIWidget({ bullets }) {
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
          {bullets.map((t, i) => (
            <Typography key={i} component="li" sx={{ fontSize: 14, lineHeight: '22px', color: '#212121', mb: 0.75 }}>{t}</Typography>
          ))}
        </Box>
        <Typography sx={{ fontSize: 14, fontWeight: 700, color: TEAL, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>View More Insights</Typography>
      </Box>
    </Box>
  )
}

function StickySegmentNav({ value, onChange }) {
  const [isSticky, setIsSticky] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let parent = el.parentElement
    while (parent && parent !== document.body) {
      const s = window.getComputedStyle(parent)
      if (s.overflow === 'auto' || s.overflowY === 'auto') break
      parent = parent.parentElement
    }
    if (!parent) return
    const check = () => setIsSticky(el.getBoundingClientRect().top <= parent.getBoundingClientRect().top + 1)
    parent.addEventListener('scroll', check, { passive: true })
    return () => parent.removeEventListener('scroll', check)
  }, [])
  return (
    <Box ref={ref} sx={{ position: 'sticky', top: 0, zIndex: 10, bgcolor: '#F5F5F5', py: 1.25, boxShadow: isSticky ? '0 2px 8px rgba(0,0,0,0.10)' : 'none', transition: 'box-shadow 0.2s' }}>
      <Box sx={{ display: 'flex' }}>
        {SOCIAL_TABS.map(tab => (
          <Box key={tab.id} onClick={() => onChange(tab.id)} sx={{
            px: 2, py: 0.75, fontSize: 14, cursor: 'pointer', whiteSpace: 'nowrap', userSelect: 'none',
            border: '1px solid', borderColor: value === tab.id ? '#00827F' : '#9E9E9E',
            bgcolor: value === tab.id ? 'rgba(29,159,159,0.12)' : 'transparent', color: '#212121',
            '&:first-of-type': { borderRadius: '4px 0 0 4px' },
            '&:last-of-type': { borderRadius: '0 4px 4px 0' },
            '&:not(:first-of-type)': { borderLeft: 'none' },
            '&:hover': { bgcolor: value === tab.id ? 'rgba(29,159,159,0.18)' : 'rgba(0,0,0,0.04)' },
          }}>
            {tab.label}
          </Box>
        ))}
      </Box>
    </Box>
  )
}

// ── X tab ─────────────────────────────────────────────────────────────────────

function XContent() {
  const donutPostType = [
    { pct: 35.8, color: BLUE, label: 'Retweets',      count: '1.9k' },
    { pct: 25.5, color: YELLOW, label: 'Replies',     count: '1.4k' },
    { pct: 20.3, color: PINK, label: 'Quoted',        count: '1.1k' },
    { pct: 18.4, color: GREEN, label: 'Original Posts', count: '1k' },
  ]
  const donutSentiment = [
    { pct: 35.8, color: GREEN, label: 'Positive', count: '1.9k' },
    { pct: 25.5, color: RED,   label: 'Negative', count: '1.4k' },
    { pct: 20.3, color: GRAY,  label: 'Neutral',  count: '1.1k' },
    { pct: 18.4, color: DARK,  label: 'Not Rated', count: '1k' },
  ]
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <AIWidget bullets={[
        'Retweets dominate post type at 35.8% — 1.9k mentions — indicating strong content amplification on X with the spike on Aug 27-28 driven by product-related viral posts. 1, 2',
        'Positive sentiment leads at 35.8% (1.9k) but Negative at 25.5% warrants monitoring — primarily concentrated around "apple store", "sanctions" and "samsung phones" keywords. 3, 4',
        'University of SC, technology and South Carolina are the top entities, suggesting strong regional and brand authority across X conversations during this period. 5…',
      ]} />

      {/* Row 1: Mentions + Authors */}
      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
        <KpiCard title="Mentions"  value="33.3k" delta="18%" sub="Previously 2.97M" data={SPARKLINE_DATA} color={TEAL} />
        <KpiCard title="Authors"   value="33.3k" delta="18%" sub="Previously 2.97M" data={SPARKLINE_DATA} color={BLUE} />
      </Box>

      {/* Row 2: Views + Est Reach + Est. Impressions */}
      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
        <KpiCard title="Views"            value="33.3k" delta="18%" sub="Previously 2.97M" data={SPARKLINE_DATA} color={PINK} />
        <KpiCard title="Est Reach"        value="33.3k" delta="18%" sub="Previously 2.97M" data={SPARKLINE_DATA} color={ORANGE} />
        <KpiCard title="Est. Impressions" value="33.3k" delta="18%" sub="Previously 2.97M" data={SPARKLINE_DATA} color={GREEN} />
      </Box>

      {/* Post Type + Post Type Trend */}
      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
        <Box sx={{ flex: 1, minWidth: 200, border: '1px solid #e0e0e0', borderRadius: 0.5, bgcolor: 'white', p: 2 }}>
          <WH title="Post Type" />
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Donut segments={donutPostType} size={130} />
            <Box sx={{ flex: 1 }}>
              {donutPostType.map((r, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.75 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: r.color }} />
                  <Typography sx={{ fontSize: 13, flex: 1, color: '#424242' }}>{r.label}</Typography>
                  <Typography sx={{ fontSize: 12, color: '#212121' }}>{r.pct}%</Typography>
                  <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#212121', width: 32, textAlign: 'right' }}>{r.count}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
        <Box sx={{ flex: 2, minWidth: 260, border: '1px solid #e0e0e0', borderRadius: 0.5, bgcolor: 'white', p: 2 }}>
          <WH title="Post Type Trend" />
          <Legend datasets={X_POST_TYPE_TREND.map(d => ({ ...d, count: '10.7k' }))} />
          <MultiLine datasets={X_POST_TYPE_TREND} height={140} xLabels={X_LABELS_AUG} />
        </Box>
      </Box>

      {/* X Sentiment + X Sentiment Trend */}
      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
        <Box sx={{ flex: 1, minWidth: 200, border: '1px solid #e0e0e0', borderRadius: 0.5, bgcolor: 'white', p: 2 }}>
          <WH title="X Sentiment" />
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Donut segments={donutSentiment} size={130} />
            <Box sx={{ flex: 1 }}>
              {donutSentiment.map((r, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.75 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: r.color }} />
                  <Typography sx={{ fontSize: 13, flex: 1, color: '#424242' }}>{r.label}</Typography>
                  <Typography sx={{ fontSize: 12, color: '#212121' }}>{r.pct}%</Typography>
                  <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#212121', width: 32, textAlign: 'right' }}>{r.count}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
        <Box sx={{ flex: 2, minWidth: 260, border: '1px solid #e0e0e0', borderRadius: 0.5, bgcolor: 'white', p: 2 }}>
          <WH title="X Sentiment Trend" />
          <Legend datasets={X_SENTIMENT_TREND.map(d => ({ ...d, count: '10.7k' }))} />
          <MultiLine datasets={X_SENTIMENT_TREND} height={140} xLabels={X_LABELS_AUG} />
        </Box>
      </Box>

      {/* Top Positive + Top Negative Sentiment */}
      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
        {[
          { title: 'Top Positive Sentiment', words: X_TOP_POS_KW, color: GREEN },
          { title: 'Top Negative Sentiment', words: X_TOP_NEG_KW, color: RED },
        ].map(({ title, words, color }) => (
          <Box key={title} sx={{ flex: 1, minWidth: 220, border: '1px solid #e0e0e0', borderRadius: 0.5, bgcolor: 'white', p: 2 }}>
            <WH title={title} />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, lineHeight: 1.8 }}>
              {words.map((kw, i) => (
                <Typography key={i} sx={{ fontSize: kw.size, fontWeight: kw.size >= 18 ? 700 : 400, color, cursor: 'pointer', '&:hover': { opacity: 0.75 } }}>
                  {kw.text}
                </Typography>
              ))}
            </Box>
          </Box>
        ))}
      </Box>

      {/* Top X Keywords and Entities */}
      <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, bgcolor: 'white', p: 2 }}>
        <WH title="Top X Keywords and Entities" />
        <Legend datasets={[{ label: 'Keyword', color: PINK }, { label: 'Hashtag', color: ORANGE }, { label: 'Organization', color: '#1565C0' }, { label: 'People', color: '#3F51B5' }]} />
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, lineHeight: 2 }}>
          {X_KEYWORDS.map((kw, i) => (
            <Typography key={i} sx={{ fontSize: kw.size, fontWeight: kw.size >= 18 ? 700 : 400, color: KW_COLORS[kw.type], cursor: 'pointer', '&:hover': { opacity: 0.75 } }}>
              {kw.text}
            </Typography>
          ))}
        </Box>
      </Box>

      {/* Authors By Authority Level */}
      <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, bgcolor: 'white', p: 2 }}>
        <WH title="Authors By Authority Level" />
        {(() => {
          const bars = [{ label: 'Low (0-3)', v: 52.1, color: BLUE }, { label: 'Medium (4-6)', v: 38.3, color: YELLOW }, { label: 'High (7-9)', v: 30.9, color: PINK }]
          return (
            <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 130, pt: 1 }}>
              {bars.map((b, i) => (
                <Box key={i} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#212121', mb: 0.25 }}>{b.v}k</Typography>
                  <Box sx={{ width: '60%', height: `${(b.v / 55) * 100}px`, bgcolor: b.color, borderRadius: '2px 2px 0 0' }} />
                  <Typography sx={{ fontSize: 11, color: '#616161', mt: 0.25, textAlign: 'center' }}>{b.label}</Typography>
                </Box>
              ))}
            </Box>
          )
        })()}
      </Box>

      {/* Most Reposted Content */}
      <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, bgcolor: 'white', p: 2 }}>
        <WH title="Most Reposted Content" />
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          {[0,1,2].map(i => (
            <Box key={i} sx={{ flex: 1, minWidth: 160, border: '1px solid #e0e0e0', borderRadius: 1, overflow: 'hidden' }}>
              <Box sx={{ height: 100, bgcolor: '#212121', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography sx={{ fontSize: 10, fontWeight: 900 }}>🍎</Typography>
                </Box>
                <Typography sx={{ fontSize: 10, color: 'white', fontWeight: 700 }}>Ø Grok</Typography>
              </Box>
              <Box sx={{ p: 1.25 }}>
                <Typography sx={{ fontSize: 11, color: 'text.secondary', mb: 0.5 }}>Elon Musk @elonmusk · Nov 17, 9:21 PM</Typography>
                <Typography sx={{ fontSize: 12, color: '#212121', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  [OT]: I'm down https://t.co/AYl2NATs: it's time for Apple to team up with alA and actually fix Siri. Replace that outdated, painfully dumb
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1.5, pt: 1, borderTop: '1px solid #f5f5f5' }}>
          <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>1 - 10 of 30</Typography>
          <Typography sx={{ fontSize: 12, color: '#bdbdbd', cursor: 'pointer', ml: 1 }}>{'<'}</Typography>
          <Typography sx={{ fontSize: 12, color: TEAL, cursor: 'pointer', ml: 0.5 }}>{'>'}</Typography>
        </Box>
      </Box>

      {/* Top Hashtags + Top X Authors */}
      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
        <Box sx={{ flex: 1, minWidth: 220, border: '1px solid #e0e0e0', borderRadius: 0.5, bgcolor: 'white', p: 2 }}>
          <WH title="Top Hashtags" />
          {X_HASHTAGS.map((row, i) => {
            const pct = Math.round((row.v / 903) * 100)
            return (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
                <Typography sx={{ fontSize: 12, color: '#424242', width: 120, flexShrink: 0 }}>{row.label}</Typography>
                <Box sx={{ flex: 1, height: 8, bgcolor: '#f0f0f0', borderRadius: 1, overflow: 'hidden' }}>
                  <Box sx={{ width: `${pct}%`, height: '100%', bgcolor: TEAL, borderRadius: 1 }} />
                </Box>
                <Typography sx={{ fontSize: 11, color: 'text.secondary', width: 32, textAlign: 'right', flexShrink: 0 }}>{row.v}</Typography>
              </Box>
            )
          })}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1, pt: 1, borderTop: '1px solid #f5f5f5' }}>
            <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>1 - 10 of 30</Typography>
            <Typography sx={{ fontSize: 12, color: '#bdbdbd', cursor: 'pointer' }}>{'<'}</Typography>
            <Typography sx={{ fontSize: 12, color: TEAL, cursor: 'pointer' }}>{'>'}</Typography>
          </Box>
        </Box>
        <Box sx={{ flex: 1, minWidth: 220, border: '1px solid #e0e0e0', borderRadius: 0.5, bgcolor: 'white', p: 2 }}>
          <WH title="Top X Authors" />
          <Box sx={{ display: 'flex', pb: 0.75, borderBottom: '1px solid #e0e0e0', mb: 0.5 }}>
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', flex: 1 }}>Authors</Typography>
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', width: 48, textAlign: 'right' }}>Tweets</Typography>
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', width: 56, textAlign: 'right' }}>Followers</Typography>
          </Box>
          {X_AUTHORS.map((row, i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center', py: 0.875, borderBottom: i < X_AUTHORS.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
              <Typography sx={{ fontSize: 12, color: 'text.secondary', width: 20 }}>{i + 1}</Typography>
              <Box sx={{ width: 28, height: 28, borderRadius: '50%', bgcolor: row.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, mr: 0.75 }}>
                <Typography sx={{ fontSize: 9, fontWeight: 700, color: 'white' }}>{row.initials}</Typography>
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#212121' }}>{row.name}</Typography>
                <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{row.handle}</Typography>
              </Box>
              <Typography sx={{ fontSize: 12, color: '#212121', width: 48, textAlign: 'right' }}>{row.tweets}</Typography>
              <Typography sx={{ fontSize: 12, color: '#212121', width: 56, textAlign: 'right' }}>{row.followers}</Typography>
            </Box>
          ))}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1, pt: 1, borderTop: '1px solid #f5f5f5' }}>
            <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>1 - 10 of 30</Typography>
            <Typography sx={{ fontSize: 12, color: '#bdbdbd', cursor: 'pointer' }}>{'<'}</Typography>
            <Typography sx={{ fontSize: 12, color: TEAL, cursor: 'pointer' }}>{'>'}</Typography>
          </Box>
        </Box>
      </Box>

      {/* Top Locations + Gender Breakdown */}
      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
        <Box sx={{ flex: 2, minWidth: 260, border: '1px solid #e0e0e0', borderRadius: 0.5, bgcolor: 'white', p: 2 }}>
          <WH title="Top Locations" action={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, border: '1px solid #e0e0e0', borderRadius: 0.5, px: 1, py: 0.25, cursor: 'pointer' }}>
              <Typography sx={{ fontSize: 12 }}>Country</Typography>
              <ArrowDropDownIcon sx={{ fontSize: 14 }} />
            </Box>
          } download />
          {X_LOCATIONS.map((r, i) => {
            const pct = Math.round((r.v / 903) * 100)
            return (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
                <Typography sx={{ fontSize: 16 }}>{r.flag}</Typography>
                <Typography sx={{ fontSize: 12, color: '#424242', width: 120, flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name}</Typography>
                <Box sx={{ flex: 1, height: 8, bgcolor: '#f0f0f0', borderRadius: 1, overflow: 'hidden' }}>
                  <Box sx={{ width: `${pct}%`, height: '100%', bgcolor: ORANGE, borderRadius: 1 }} />
                </Box>
                <Typography sx={{ fontSize: 11, color: 'text.secondary', width: 32, textAlign: 'right', flexShrink: 0 }}>{r.v}</Typography>
              </Box>
            )
          })}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1, pt: 1, borderTop: '1px solid #f5f5f5' }}>
            <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>1 - 10 of 30</Typography>
          </Box>
        </Box>
        <Box sx={{ flex: 1, minWidth: 200, border: '1px solid #e0e0e0', borderRadius: 0.5, bgcolor: 'white', p: 2 }}>
          <WH title="Gender Breakdown" download />
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Donut size={120} segments={[{ pct: 52.3, color: BLUE }, { pct: 21.4, color: YELLOW }, { pct: 26.3, color: '#E0E0E0' }]} />
            <Box sx={{ flex: 1 }}>
              {[{ label: 'Male', color: BLUE, pct: '52.3%' }, { label: 'Female', color: YELLOW, pct: '21.4%' }, { label: 'Unknown', color: '#9E9E9E', pct: '12.3%' }].map((r, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.75 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: r.color }} />
                  <Typography sx={{ fontSize: 13, flex: 1 }}>{r.label}</Typography>
                  <Typography sx={{ fontSize: 13, fontWeight: 700 }}>{r.pct}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

// ── Youtube tab ───────────────────────────────────────────────────────────────

function YoutubeContent() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <AIWidget bullets={[
        'Total Mentions reached 33.1k ↑18% — the Apr 4-6 window shows the highest concentration with over 250 mentions on Apr 5, coinciding with a major product release window. 1, 2',
        'Lisboa leads Mentions Trend by Searches at 55k peak (Aug 10-13), significantly outpacing Arctic Monkeys and IGIT — suggesting event-driven discovery moments worth targeting. 3, 4',
        'Share of Potential Audience shows Views correlating strongly with Mention spikes, particularly Apr 4-6 and Apr 6-7, indicating content virality and secondary amplification. 5…',
      ]} />

      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
        {/* Total Mentions */}
        <Box sx={{ flex: 1, minWidth: 240, border: '1px solid #e0e0e0', borderRadius: 0.5, bgcolor: 'white', p: 2 }}>
          <WH title="Total Mentions" />
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75, mb: 0.25 }}>
            <Typography sx={{ fontSize: 36, fontWeight: 700, color: '#212121', lineHeight: 1.1 }}>33.1k</Typography>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.25, bgcolor: '#E8F5E9', color: '#2E7D32', fontSize: 11, fontWeight: 700, px: 0.75, py: 0.25, borderRadius: 1 }}>
              <ArrowUpwardIcon sx={{ fontSize: 11 }} />18%
            </Box>
          </Box>
          <Typography sx={{ fontSize: 11, color: 'text.secondary', mb: 1.5 }}>Previously 2.97M</Typography>
          {(() => {
            const w = 800, h = 120, max = Math.max(...YT_TOTAL_DATA), min = 0
            const pts = YT_TOTAL_DATA.map((v, i) => `${(i / (YT_TOTAL_DATA.length - 1)) * w},${h - ((v - min) / (max - min)) * (h - 8) - 4}`).join(' ')
            return (
              <svg width="100%" height={120} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ display: 'block' }}>
                <polygon points={`0,${h} ${pts} ${w},${h}`} fill={BLUE} fillOpacity="0.10" />
                <polyline points={pts} fill="none" stroke={BLUE} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
              </svg>
            )
          })()}
          <Typography sx={{ fontSize: 10, color: 'text.secondary', mt: 0.5, textAlign: 'right' }}>Apr 1</Typography>
        </Box>

        {/* Share of Potential Audience */}
        <Box sx={{ flex: 2, minWidth: 300, border: '1px solid #e0e0e0', borderRadius: 0.5, bgcolor: 'white', p: 2 }}>
          <WH title="Share of Potential Audience" />
          <Legend datasets={[{ label: 'Mentions', color: BLUE }, { label: 'Views', color: YELLOW }]} />
          {(() => {
            const w = 600, h = 160, padL = 40, padR = 40, padB = 24, padT = 8
            const cW = w - padL - padR, cH = h - padB - padT
            const maxBar = Math.max(...YT_AUDIENCE_BARS), maxLine = Math.max(...YT_AUDIENCE_LINE)
            const barW = cW / YT_AUDIENCE_BARS.length - 4
            const linePts = YT_AUDIENCE_LINE.map((v, i) => `${padL + (i / (YT_AUDIENCE_LINE.length - 1)) * cW},${padT + (1 - v / maxLine) * cH}`).join(' ')
            return (
              <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid meet" style={{ display: 'block' }}>
                {[0, 60, 120, 180, 240, 300].map(v => {
                  const y = padT + (1 - v / maxBar) * cH
                  return <g key={v}><line x1={padL} y1={y} x2={w - padR} y2={y} stroke="#f0f0f0" strokeWidth="1" /><text x={padL - 4} y={y + 3} textAnchor="end" fontSize="8" fill="#9E9E9E">{v}</text></g>
                })}
                {[0, 10000, 20000, 30000].map(v => {
                  const y = padT + (1 - v / maxLine) * cH
                  return <text key={v} x={w - padR + 4} y={y + 3} textAnchor="start" fontSize="8" fill="#9E9E9E">{v === 0 ? '0' : `${v / 1000}k`}</text>
                })}
                {YT_AUDIENCE_BARS.map((v, i) => {
                  const x = padL + i * (barW + 4), bH = (v / maxBar) * cH
                  return <rect key={i} x={x} y={padT + cH - bH} width={barW} height={bH} fill={BLUE} rx="1" />
                })}
                <polyline points={linePts} fill="none" stroke={YELLOW} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
                {X_LABELS_APR.map((d, i) => (
                  <text key={i} x={padL + i * (cW / (X_LABELS_APR.length - 1))} y={h - 6} textAnchor="middle" fontSize="8" fill="#9E9E9E">{d}</text>
                ))}
              </svg>
            )
          })()}
        </Box>
      </Box>

      {/* Searches by Mentions + Mentions Trend by Searches */}
      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
        <Box sx={{ flex: 1, minWidth: 240, border: '1px solid #e0e0e0', borderRadius: 0.5, bgcolor: 'white', p: 2 }}>
          <WH title="Searches by Mentions" />
          <Box sx={{ display: 'flex', pb: 0.75, borderBottom: '1px solid #e0e0e0', mb: 0.5 }}>
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', width: 20 }}>  </Typography>
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', flex: 1 }}>Name</Typography>
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', width: 100 }}>Mentions</Typography>
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', width: 52, textAlign: 'right' }}>Trend</Typography>
          </Box>
          {YT_SEARCHES.map((row, i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center', py: 0.875, borderBottom: i < YT_SEARCHES.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
              <Typography sx={{ fontSize: 12, color: 'text.secondary', width: 20 }}>{i + 1}</Typography>
              <Typography sx={{ fontSize: 13, flex: 1, color: '#212121', fontWeight: 600 }}>{row.name}</Typography>
              <Box sx={{ width: 100, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography sx={{ fontSize: 12 }}>{row.mentions}</Typography>
                <Box sx={{ width: 24, height: 6, bgcolor: '#f0f0f0', borderRadius: 1, overflow: 'hidden' }}>
                  <Box sx={{ width: `${row.pct}%`, height: '100%', bgcolor: row.barColor }} />
                </Box>
              </Box>
              <Box sx={{ width: 52, display: 'flex', justifyContent: 'flex-end' }}>
                {row.up === null
                  ? <Box sx={{ fontSize: 11, fontWeight: 700, bgcolor: '#F5F5F5', color: '#757575', px: 0.75, py: 0.2, borderRadius: 1 }}>→ 0%</Box>
                  : <Box sx={{ fontSize: 11, fontWeight: 700, bgcolor: row.up ? '#E8F5E9' : '#FFEBEE', color: row.up ? '#2E7D32' : '#C62828', px: 0.75, py: 0.2, borderRadius: 1 }}>
                      {row.up ? '↑' : '↓'} {row.delta}
                    </Box>
                }
              </Box>
            </Box>
          ))}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 1, pt: 1, borderTop: '1px solid #f5f5f5' }}>
            <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>1-5 of 10</Typography>
            <Typography sx={{ fontSize: 12, color: '#bdbdbd', cursor: 'pointer' }}>{'<'}</Typography>
            <Typography sx={{ fontSize: 12, color: TEAL, cursor: 'pointer' }}>{'>'}</Typography>
          </Box>
        </Box>
        <Box sx={{ flex: 2, minWidth: 300, border: '1px solid #e0e0e0', borderRadius: 0.5, bgcolor: 'white', p: 2 }}>
          <WH title="Mentions Trend by Searches" />
          <Legend datasets={YT_TREND_SEARCHES} />
          {(() => {
            const w = 600, h = 160, padL = 40, padB = 28, padT = 8, cW = w - padL - 8, cH = h - padB - padT
            const allVals = YT_TREND_SEARCHES.flatMap(d => d.data), maxVal = Math.max(...allVals)
            const xL = ['Aug 1','Aug 4','Aug 7','Aug 10','Aug 13','Aug 16','Aug 19','Aug 21','Aug 24','Aug 27','Aug 31']
            return (
              <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid meet" style={{ display: 'block' }}>
                {[0, 10000, 20000, 30000, 40000, 50000, 60000].map(v => {
                  const y = padT + (1 - v / maxVal) * cH
                  return <g key={v}><line x1={padL} y1={y} x2={w - 8} y2={y} stroke="#f0f0f0" strokeWidth="1" /><text x={padL - 4} y={y + 3} textAnchor="end" fontSize="8" fill="#9E9E9E">{v === 0 ? '0' : `${v / 1000}k`}</text></g>
                })}
                {YT_TREND_SEARCHES.map((ds, di) => {
                  const pts = ds.data.map((v, i) => `${padL + (i / (ds.data.length - 1)) * cW},${padT + (1 - v / maxVal) * cH}`).join(' ')
                  return <polyline key={di} points={pts} fill="none" stroke={ds.color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
                })}
                {xL.map((d, i) => <text key={i} x={padL + (i / (xL.length - 1)) * cW} y={h - 6} textAnchor="middle" fontSize="8" fill="#9E9E9E">{d}</text>)}
              </svg>
            )
          })()}
        </Box>
      </Box>

      {/* Top Hashtags */}
      <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, bgcolor: 'white', p: 2 }}>
        <WH title="Top Hashtags" />
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, lineHeight: 1.8 }}>
          {YT_HASHTAGS.map((h, i) => (
            <Typography key={i} sx={{ fontSize: h.size, fontWeight: h.size >= 26 ? 700 : h.size >= 20 ? 600 : 400, color: PINK, cursor: 'pointer', '&:hover': { opacity: 0.75 } }}>
              {h.text}
            </Typography>
          ))}
        </Box>
      </Box>
    </Box>
  )
}

// ── Weibo tab ─────────────────────────────────────────────────────────────────

function WeiboContent() {
  const wbSentimentDonut = [
    { pct: 25.8, color: GREEN, label: 'Positive', count: '1.5k' },
    { pct: 25.5, color: RED,   label: 'Negative', count: '1.4k' },
    { pct: 20.3, color: GRAY,  label: 'Neutral',  count: '1.1k' },
    { pct: 28.4, color: DARK,  label: 'Not Rated', count: '–' },
  ]
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <AIWidget bullets={[
        'Mentions Trend peaks on Aug 27-28 across all post types, with Original Posts driving 52.1k — the highest single post-type volume, signaling strong organic content creation around that date. 1, 2',
        'Verification Type shows Blue accounts (52.1%, 9.7k) dominating coverage — indicating mainstream media and verified public figures are the primary Weibo amplifiers for this topic. 3, 4',
        'Audience is most active Thursday 8–9 AM and Monday 7–8 AM — optimal windows for publishing content targeting maximum organic reach on Weibo. 5…',
      ]} />

      {/* Mentions Trend by Post Type */}
      <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, bgcolor: 'white', p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
              <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#212121' }}>Mentions Trend by Post Type</Typography>
              <InfoOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            </Box>
            <Box sx={{ display: 'flex', gap: 4 }}>
              <Box>
                <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>Total Mentions</Typography>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75 }}>
                  <Typography sx={{ fontSize: 28, fontWeight: 700, color: '#212121' }}>35.2k</Typography>
                  <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.25, bgcolor: '#E8F5E9', color: '#2E7D32', fontSize: 11, fontWeight: 700, px: 0.75, py: 0.2, borderRadius: 1 }}>
                    <ArrowUpwardIcon sx={{ fontSize: 11 }} />31%
                  </Box>
                </Box>
                <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>Previously 2.97M</Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>Daily Average</Typography>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75 }}>
                  <Typography sx={{ fontSize: 28, fontWeight: 700, color: '#212121' }}>1.46k</Typography>
                  <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.25, bgcolor: '#E8F5E9', color: '#2E7D32', fontSize: 11, fontWeight: 700, px: 0.75, py: 0.2, borderRadius: 1 }}>
                    <ArrowUpwardIcon sx={{ fontSize: 11 }} />31%
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
          <IconButton size="small"><DownloadOutlinedIcon sx={{ fontSize: 18, color: 'text.secondary' }} /></IconButton>
        </Box>
        <Legend datasets={WB_MENTIONS_TREND} />
        <MultiLine datasets={WB_MENTIONS_TREND} height={140} xLabels={X_LABELS_AUG} />
      </Box>

      {/* Engagement Trend */}
      <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, bgcolor: 'white', p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
              <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#212121' }}>Engagement Trend by Engagement Type</Typography>
              <InfoOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            </Box>
            <Box sx={{ display: 'flex', gap: 4 }}>
              <Box>
                <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>Total Mentions</Typography>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75 }}>
                  <Typography sx={{ fontSize: 28, fontWeight: 700, color: '#212121' }}>35.2k</Typography>
                  <Box sx={{ bgcolor: '#E8F5E9', color: '#2E7D32', fontSize: 11, fontWeight: 700, px: 0.75, py: 0.2, borderRadius: 1 }}>↑ 31%</Box>
                </Box>
                <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>Previously 2.97M</Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>Daily Average</Typography>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75 }}>
                  <Typography sx={{ fontSize: 28, fontWeight: 700, color: '#212121' }}>1.46k</Typography>
                  <Box sx={{ bgcolor: '#E8F5E9', color: '#2E7D32', fontSize: 11, fontWeight: 700, px: 0.75, py: 0.2, borderRadius: 1 }}>↑ 31%</Box>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, px: 1, py: 0.5, display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }}>
              <Typography sx={{ fontSize: 12 }}>All post types</Typography>
              <ArrowDropDownIcon sx={{ fontSize: 14 }} />
            </Box>
            <IconButton size="small"><DownloadOutlinedIcon sx={{ fontSize: 18, color: 'text.secondary' }} /></IconButton>
          </Box>
        </Box>
        <Legend datasets={WB_ENGAGEMENT_TREND} />
        <MultiLine datasets={WB_ENGAGEMENT_TREND} height={140} xLabels={X_LABELS_AUG} />
      </Box>

      {/* Post Type Breakdown + Verification Type Breakdown */}
      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
        <Box sx={{ flex: 1, minWidth: 220, border: '1px solid #e0e0e0', borderRadius: 0.5, bgcolor: 'white', p: 2 }}>
          <WH title="Post Type Breakdown" download />
          <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1.5, height: 120, pt: 1 }}>
            {WB_POST_TYPES.map((b, i) => (
              <Box key={i} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#212121', mb: 0.25 }}>{b.v}k</Typography>
                <Box sx={{ width: '60%', height: `${(b.v / 55) * 100}px`, bgcolor: b.color, borderRadius: '2px 2px 0 0' }} />
                <Typography sx={{ fontSize: 10, color: '#616161', mt: 0.25, textAlign: 'center' }}>{b.label}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
        <Box sx={{ flex: 1, minWidth: 220, border: '1px solid #e0e0e0', borderRadius: 0.5, bgcolor: 'white', p: 2 }}>
          <WH title="Verification Type Breakdown" download />
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Donut size={120} segments={[{ pct: 52.1, color: BLUE }, { pct: 40.5, color: YELLOW }, { pct: 7.4, color: ORANGE }]} />
            <Box>
              {[{ label: 'Blue', color: BLUE, pct: '52.1%', count: '9.7k' }, { label: 'Gold', color: YELLOW, pct: '40.5%', count: '5.7k' }, { label: 'Orange', color: ORANGE, pct: '10.3%', count: '83' }].map((r, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.75 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: r.color }} />
                  <Typography sx={{ fontSize: 13, flex: 1 }}>{r.label}</Typography>
                  <Typography sx={{ fontSize: 12 }}>{r.pct}</Typography>
                  <Typography sx={{ fontSize: 12, fontWeight: 700, width: 36, textAlign: 'right' }}>{r.count}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Content Type Breakdown */}
      <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, bgcolor: 'white', p: 2 }}>
        <WH title="Content Type Breakdown" download />
        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 130, pt: 1 }}>
          {WB_CONTENT_TYPES.map((b, i) => (
            <Box key={i} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#212121', mb: 0.25 }}>{b.v}k</Typography>
              <Box sx={{ width: '60%', height: `${(b.v / 60) * 110}px`, bgcolor: b.color, borderRadius: '2px 2px 0 0' }} />
              <Typography sx={{ fontSize: 11, color: '#616161', mt: 0.25 }}>{b.label}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Distribution Map + Gender Breakdown */}
      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
        <Box sx={{ flex: 2, minWidth: 220, border: '1px solid #e0e0e0', borderRadius: 0.5, bgcolor: 'white', p: 2 }}>
          <WH title="Distribution Map" download />
          <Box sx={{ bgcolor: '#E3F2FD', borderRadius: 1, height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <Box sx={{ width: '60%', height: '70%', background: 'radial-gradient(ellipse at 55% 50%, rgba(30,60,120,0.7) 0%, rgba(30,60,120,0.3) 50%, transparent 80%)', borderRadius: '35% 45% 40% 50%' }} />
            <Typography sx={{ position: 'absolute', fontSize: 10, color: '#546E7A', bottom: 8, left: 12 }}>Geographical distribution of mentions.</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            {[0,'2k','4k','6k'].map(l => <Typography key={l} sx={{ fontSize: 10, color: 'text.secondary' }}>{l}</Typography>)}
          </Box>
        </Box>
        <Box sx={{ flex: 1, minWidth: 200, border: '1px solid #e0e0e0', borderRadius: 0.5, bgcolor: 'white', p: 2 }}>
          <WH title="Gender Breakdown" download />
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Donut size={120} segments={[{ pct: 60.3, color: BLUE }, { pct: 35.4, color: YELLOW }, { pct: 4.3, color: '#E0E0E0' }]} />
            <Box>
              {[{ label: 'Male', color: BLUE, pct: '60.3%' }, { label: 'Female', color: YELLOW, pct: '35.4%' }, { label: 'Unknown', color: '#9E9E9E', pct: '5.3%' }].map((r, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.75 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: r.color }} />
                  <Typography sx={{ fontSize: 13, flex: 1 }}>{r.label}</Typography>
                  <Typography sx={{ fontSize: 13, fontWeight: 700 }}>{r.pct}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Audience Online + Top Weibo Online Activity */}
      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
        <Box sx={{ flex: 2, minWidth: 260, border: '1px solid #e0e0e0', borderRadius: 0.5, bgcolor: 'white', p: 2 }}>
          <WH title="Audience online" download />
          <Typography sx={{ fontSize: 11, color: 'text.secondary', mb: 1 }}>Online activity by hourly time slots, based on the timestamp of posts.</Typography>
          <Box sx={{ display: 'flex' }}>
            <Box sx={{ width: 28, flexShrink: 0 }} />
            {Array.from({ length: 24 }, (_, h) => (
              <Box key={h} sx={{ flex: 1, textAlign: 'center' }}>
                {h % 6 === 0 && <Typography sx={{ fontSize: 8, color: 'text.secondary' }}>{h}h</Typography>}
              </Box>
            ))}
          </Box>
          {WB_HEATMAP.map((row, ri) => (
            <Box key={ri} sx={{ display: 'flex', alignItems: 'center', mb: 0.25 }}>
              <Typography sx={{ fontSize: 9, color: 'text.secondary', width: 28, flexShrink: 0 }}>{WB_DAYS[ri]}</Typography>
              {row.map((val, ci) => (
                <Box key={ci} sx={{ flex: 1, height: 14, bgcolor: `rgba(29,100,200,${val / 100})`, borderRadius: '1px', mx: '0.5px' }} />
              ))}
            </Box>
          ))}
          <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
            {[25,50,75,100,125,150].map(v => (
              <Box key={v} sx={{ fontSize: 9, bgcolor: '#f0f0f0', px: 0.75, py: 0.25, borderRadius: 0.5, color: 'text.secondary' }}>{v}</Box>
            ))}
          </Box>
        </Box>
        <Box sx={{ flex: 1, minWidth: 220, border: '1px solid #e0e0e0', borderRadius: 0.5, bgcolor: 'white', p: 2 }}>
          <WH title="Top Weibo Online Activity" download />
          <Box sx={{ display: 'flex', pb: 0.75, borderBottom: '1px solid #e0e0e0', mb: 0.5 }}>
            <Box sx={{ width: 20 }} />
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', width: 36 }}>Day</Typography>
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', flex: 1 }}>Time</Typography>
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', width: 40, textAlign: 'right' }}>Count</Typography>
          </Box>
          {WB_ONLINE_ACTIVITY.map((row, i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center', py: 0.75, borderBottom: i < WB_ONLINE_ACTIVITY.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
              <Typography sx={{ fontSize: 11, color: 'text.secondary', width: 20 }}>{i + 1}</Typography>
              <Box sx={{ width: 28, height: 20, bgcolor: '#E3F2FD', borderRadius: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 0.5, flexShrink: 0 }}>
                <Typography sx={{ fontSize: 8, color: BLUE }}>📅</Typography>
              </Box>
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#212121', width: 36, flexShrink: 0 }}>{row.day}</Typography>
              <Typography sx={{ fontSize: 11, color: '#424242', flex: 1 }}>{row.time}</Typography>
              <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#212121', width: 40, textAlign: 'right' }}>{row.count}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Fan Count Breakdown */}
      <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, bgcolor: 'white', p: 2 }}>
        <WH title="Fan Count Breakdown" download />
        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1.5, height: 130, pt: 1 }}>
          {WB_FAN_COUNT.map((b, i) => {
            const maxV = 55.1
            return (
              <Box key={i} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography sx={{ fontSize: 10, fontWeight: 700, color: '#212121', mb: 0.25 }}>{b.v}k</Typography>
                <Box sx={{ width: '70%', height: `${(b.v / maxV) * 100}px`, bgcolor: PINK, borderRadius: '2px 2px 0 0' }} />
                <Typography sx={{ fontSize: 8, color: '#616161', mt: 0.25, textAlign: 'center' }}>{b.label}</Typography>
              </Box>
            )
          })}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
          {['0','10k','20k','30k','40k','50k','60k'].map(l => <Typography key={l} sx={{ fontSize: 9, color: 'text.secondary' }}>{l}</Typography>)}
        </Box>
        <Typography sx={{ fontSize: 11, color: 'text.secondary', mt: 0.5 }}>Follower Count</Typography>
      </Box>

      {/* Sentiment + Sentiment Trend */}
      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
        <Box sx={{ flex: 1, minWidth: 200, border: '1px solid #e0e0e0', borderRadius: 0.5, bgcolor: 'white', p: 2 }}>
          <WH title="Sentiment" download />
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Donut size={130} segments={wbSentimentDonut} />
            <Box>
              {wbSentimentDonut.map((r, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.75 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: r.color }} />
                  <Typography sx={{ fontSize: 13, flex: 1 }}>{r.label}</Typography>
                  <Typography sx={{ fontSize: 12 }}>{r.pct}%</Typography>
                  <Typography sx={{ fontSize: 12, fontWeight: 700, width: 32, textAlign: 'right' }}>{r.count}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
        <Box sx={{ flex: 2, minWidth: 260, border: '1px solid #e0e0e0', borderRadius: 0.5, bgcolor: 'white', p: 2 }}>
          <WH title="Sentiment Trend" download />
          <Legend datasets={WB_SENTIMENT_TREND} />
          <MultiLine datasets={WB_SENTIMENT_TREND} height={140} xLabels={X_LABELS_AUG} />
        </Box>
      </Box>
    </Box>
  )
}

// ── main export ───────────────────────────────────────────────────────────────

export default function SocialMediaInsightsTabContent({ loading }) {
  const [activeTab, setActiveTab] = useState('x')
  if (loading) return null
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <StickySegmentNav value={activeTab} onChange={setActiveTab} />
      {activeTab === 'x'       && <XContent />}
      {activeTab === 'youtube' && <YoutubeContent />}
      {activeTab === 'weibo'   && <WeiboContent />}
    </Box>
  )
}
