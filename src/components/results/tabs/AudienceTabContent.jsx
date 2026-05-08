import { Box, Typography, IconButton, Checkbox } from '@mui/material'
import WidgetCard from './WidgetCard'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt'
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd'
import FilterListIcon from '@mui/icons-material/FilterList'
import SortIcon from '@mui/icons-material/Sort'
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import { useState, useRef, useEffect } from 'react'

// ── constants ─────────────────────────────────────────────────────────────────

const BLUE   = '#2196F3'
const TEAL   = '#1D9F9F'
const PINK   = '#CF2D8A'
const ORANGE = '#FF9800'
const GREEN  = '#4CAF50'
const DARK   = '#212121'
const YELLOW = '#FFC107'

const NAV_TABS = [
  { id: 'authors-list',  label: 'Authors List'  },
  { id: 'journalists',   label: 'Journalists'   },
  { id: 'x-authors',     label: 'X Authors'     },
  { id: 'news-coverage', label: 'News Coverage' },
]

// ── shared ui ─────────────────────────────────────────────────────────────────

function AIInsight({ bullets }) {
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

function WHeader({ title, action, download }) {
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
          : <IconButton size="small"><MoreVertIcon sx={{ fontSize: 18, color: 'text.secondary' }} /></IconButton>
        }
      </Box>
    </Box>
  )
}

function Delta({ v }) {
  const pos = v > 0, zero = v === 0
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.25, bgcolor: zero ? '#F5F5F5' : pos ? '#E8F5E9' : '#FFEBEE', color: zero ? '#757575' : pos ? '#2E7D32' : '#C62828', fontSize: 11, fontWeight: 700, px: 0.75, py: 0.25, borderRadius: 1 }}>
      {!zero && (pos ? <ArrowUpwardIcon sx={{ fontSize: 11 }} /> : <ArrowDownwardIcon sx={{ fontSize: 11 }} />)}
      {zero ? '→ 0%' : `${Math.abs(v)}%`}
    </Box>
  )
}

function Sparkline({ data, color, height = 40 }) {
  const w = 200, h = height
  const max = Math.max(...data), min = Math.min(...data), range = max - min || 1
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 4) - 2}`).join(' ')
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ display: 'block' }}>
      <polygon points={`0,${h} ${pts} ${w},${h}`} fill={color} fillOpacity="0.12" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}

function LineAreaChart({ datasets, height = 140, xLabels }) {
  const w = 800, h = height
  const allVals = datasets.flatMap(d => d.data)
  const max = Math.max(...allVals), min = 0, range = max - min || 1
  return (
    <Box>
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" width="100%" height={height} style={{ display: 'block' }}>
        {datasets.map((ds, i) => {
          const pts = ds.data.map((v, j) => `${(j / (ds.data.length - 1)) * w},${h - ((v - min) / range) * (h - 8) - 4}`).join(' ')
          return (
            <g key={i}>
              {i === 0 && <polygon points={`0,${h} ${pts} ${w},${h}`} fill={ds.color} fillOpacity="0.10" />}
              <polyline points={pts} fill="none" stroke={ds.color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
            </g>
          )
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

function DonutChart({ segments, size = 130, label }) {
  const cx = size / 2, cy = size / 2, r = size * 0.4, ir = size * 0.24
  let cum = -90
  const paths = segments.map(s => {
    const start = (cum * Math.PI) / 180
    const sweep = (s.pct / 100) * 360
    cum += sweep
    const end = (cum * Math.PI) / 180
    const large = sweep > 180 ? 1 : 0
    const x1 = cx + r * Math.cos(start), y1 = cy + r * Math.sin(start)
    const x2 = cx + r * Math.cos(end), y2 = cy + r * Math.sin(end)
    const ix1 = cx + ir * Math.cos(start), iy1 = cy + ir * Math.sin(start)
    const ix2 = cx + ir * Math.cos(end), iy2 = cy + ir * Math.sin(end)
    return { ...s, d: `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${ir} ${ir} 0 ${large} 0 ${ix1} ${iy1} Z` }
  })
  return (
    <svg width={size} height={size} style={{ display: 'block', flexShrink: 0 }}>
      {paths.map((p, i) => <path key={i} d={p.d} fill={p.color} stroke="white" strokeWidth="1.5" />)}
      <circle cx={cx} cy={cy} r={ir} fill="white" />
      {label && <text x={cx} y={cy + 4} textAnchor="middle" fontSize="12" fontWeight="700" fill="#212121">{label}</text>}
    </svg>
  )
}

function Pagination({ text }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1, mt: 1, pt: 1, borderTop: '1px solid #f5f5f5' }}>
      <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>{text}</Typography>
      <Typography sx={{ fontSize: 13, color: '#bdbdbd', cursor: 'pointer' }}>{'<'}</Typography>
      <Typography sx={{ fontSize: 13, color: TEAL, cursor: 'pointer' }}>{'>'}</Typography>
    </Box>
  )
}

function StickySegmentNav({ value, onChange }) {
  const [isScrolling, setIsScrolling] = useState(false)
  const scrollTimerRef = useRef(null)
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
    const onScroll = () => { setIsScrolling(true); clearTimeout(scrollTimerRef.current); scrollTimerRef.current = setTimeout(() => setIsScrolling(false), 200) }
    parent.addEventListener('scroll', onScroll, { passive: true })
    return () => { parent.removeEventListener('scroll', onScroll); clearTimeout(scrollTimerRef.current) }
  }, [])
  return (
    <Box ref={ref} sx={{ position: 'sticky', top: 0, zIndex: 10, bgcolor: 'transparent', pl: 2, py: 1.25 }}>
      <Box sx={{ display: 'inline-flex', gap: 0, boxShadow: isScrolling ? '0 4px 16px rgba(0,0,0,0.10)' : 'none', borderRadius: '4px', transition: 'box-shadow 0.2s' }}>
        {NAV_TABS.map(tab => (
          <Box
            key={tab.id}
            onClick={() => onChange(tab.id)}
            sx={{
              px: 2, py: 0.75, fontSize: 14, cursor: 'pointer', whiteSpace: 'nowrap',
              border: '1px solid', userSelect: 'none',
              borderColor: value === tab.id ? '#00827F' : '#9E9E9E',
              background: value === tab.id ? 'linear-gradient(rgba(29,159,159,0.18),rgba(29,159,159,0.18)) #F0F0F0' : '#F0F0F0',
              color: '#212121',
              '&:first-of-type': { borderRadius: '4px 0 0 4px' },
              '&:last-of-type':  { borderRadius: '0 4px 4px 0' },
              '&:not(:first-of-type)': { borderLeft: 'none' },
              '&:hover': { background: value === tab.id ? 'linear-gradient(rgba(29,159,159,0.25),rgba(29,159,159,0.25)) #E0E0E0' : '#E0E0E0' },
            }}
          >
            {tab.label}
          </Box>
        ))}
      </Box>
    </Box>
  )
}

// ── NEWS COVERAGE ─────────────────────────────────────────────────────────────

const NC_KPIS = [
  { title: 'Mentions Trend',      metric: 'Total Mentions',      value: '35.2k', delta: 37 },
  { title: 'Engagement Trend',    metric: 'Total Engagement',    value: '35.2k', delta: 37 },
  { title: 'Reach Trend',         metric: 'Total Reach',         value: '35.2k', delta: 37 },
  { title: 'Views Trend',         metric: 'Total Views',         value: '35.2k', delta: 37 },
  { title: 'AVE Trend',           metric: 'Total AVE',           value: '52.1k', delta: 37 },
  { title: 'Social Echo Trend',   metric: 'Total Social Echo',   value: '52.1k', delta: 37 },
]
const NC_CHART_DATA = [18, 20, 45, 38, 22, 30, 42, 28, 35, 28, 20, 30, 38, 25, 20, 30]
const NC_PREV_DATA  = [12, 14, 22, 18, 14, 18, 24, 16, 20, 16, 12, 18, 22, 14, 12, 18]
const NC_X_LABELS   = ['Aug 25', 'Aug 27', 'Aug 29', 'Aug 31']
const SECHO_TREND   = [
  { label: 'All', color: PINK, count: '10.7k', data: [28, 30, 55, 45, 18, 22, 30, 32] },
  { label: 'Facebook', color: BLUE, count: '10.7k', data: [22, 24, 30, 32, 16, 20, 26, 28] },
  { label: 'X', color: DARK, count: '10.7k', data: [8, 10, 14, 12, 7, 9, 12, 13] },
]
const SECHO_SOURCES = [
  { name: 'CNN',             fb: 2000, x: 1000 },
  { name: 'USA Today',       fb: 1800, x: 1000 },
  { name: 'New York Times',  fb: 1800, x: 700  },
  { name: 'The Guardian',    fb: 1500, x: 500  },
  { name: 'Mountain Weekly', fb: 1200, x: 300  },
  { name: 'Dallas Mavericks', fb: 700, x: 300  },
  { name: 'Associate Press', fb: 600,  x: 200  },
  { name: 'NPR',             fb: 200,  x: 100  },
]

function NewsCoverageContent() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <AIInsight bullets={[
        'News coverage surged 37% in the Aug 25–31 period, with Mentions, Reach and Engagement trending upward simultaneously — a strong indicator of coordinated media traction. 1, 2',
        'Social Echo reached 52.1k total, driven primarily by Facebook (35.8%) and X (25.5%), suggesting high cross-platform amplification of key articles. 3, 4',
        'CNN and USA Today account for the largest social echo share by source, with combined reach exceeding 5.8k in the period — signaling strong mainstream amplification. 5, 6…',
      ]} />

      {/* 6 KPI cards 2x3 */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
        {NC_KPIS.map((kpi, i) => (
          <Box key={i} sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 240, border: '1px solid #e0e0e0', borderRadius: 0.5, bgcolor: 'white', p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#212121' }}>{kpi.title}</Typography>
                <InfoOutlinedIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              </Box>
              <IconButton size="small"><MoreVertIcon sx={{ fontSize: 16, color: 'text.secondary' }} /></IconButton>
            </Box>
            <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 0.25 }}>{kpi.metric}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 0.25 }}>
              <Typography sx={{ fontSize: 28, fontWeight: 700, color: '#212121', lineHeight: 1.1 }}>{kpi.value}</Typography>
              <Delta v={kpi.delta} />
            </Box>
            <Typography sx={{ fontSize: 11, color: 'text.secondary', mb: 1 }}>Previously 2.97M</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.75 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: BLUE }} />
                <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>All</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#9E9E9E' }} />
                <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>Previous Period</Typography>
              </Box>
            </Box>
            <LineAreaChart
              datasets={[{ data: NC_CHART_DATA, color: BLUE }, { data: NC_PREV_DATA, color: '#9E9E9E' }]}
              height={80}
              xLabels={NC_X_LABELS}
            />
          </Box>
        ))}
      </Box>

      {/* Social Echo Breakdown Trend */}
      <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, bgcolor: 'white', p: 2 }}>
        <WHeader title="Social Echo Breakdown Trend" />
        <Box sx={{ display: 'flex', gap: 2, mb: 1.5 }}>
          {SECHO_TREND.map((l, i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: l.color }} />
              <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{l.label}</Typography>
              <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#212121' }}>{l.count}</Typography>
            </Box>
          ))}
        </Box>
        <LineAreaChart datasets={SECHO_TREND} height={140} xLabels={['Aug 25', 'Aug 27', 'Aug 29', 'Aug 31']} />
      </Box>

      {/* Social Echo by News Source + Social Echo Breakdown */}
      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
        <Box sx={{ flex: 2, minWidth: 280, border: '1px solid #e0e0e0', borderRadius: 0.5, bgcolor: 'white', p: 2 }}>
          <WHeader title="Social Echo by News Source" />
          <Box sx={{ display: 'flex', gap: 2, mb: 1.5 }}>
            {[{ label: 'Facebook', color: BLUE }, { label: 'X', color: DARK }].map(s => (
              <Box key={s.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: s.color }} />
                <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{s.label}</Typography>
              </Box>
            ))}
          </Box>
          {SECHO_SOURCES.map((row, i) => {
            const total = row.fb + row.x, max = 3000
            return (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
                <Typography sx={{ fontSize: 12, color: '#424242', width: 120, flexShrink: 0 }}>{row.name}</Typography>
                <Box sx={{ flex: 1, height: 10, bgcolor: '#f0f0f0', borderRadius: 1, overflow: 'hidden', display: 'flex' }}>
                  <Box sx={{ width: `${(row.fb / max) * 100}%`, bgcolor: BLUE, height: '100%' }} />
                  <Box sx={{ width: `${(row.x / max) * 100}%`, bgcolor: DARK, height: '100%' }} />
                </Box>
                <Typography sx={{ fontSize: 11, color: 'text.secondary', width: 32, textAlign: 'right', flexShrink: 0 }}>{(total / 1000).toFixed(0)}k</Typography>
              </Box>
            )
          })}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
            {['0', '1k', '2k', '3k'].map(l => <Typography key={l} sx={{ fontSize: 10, color: 'text.secondary' }}>{l}</Typography>)}
          </Box>
        </Box>

        <Box sx={{ flex: 1, minWidth: 220, border: '1px solid #e0e0e0', borderRadius: 0.5, bgcolor: 'white', p: 2 }}>
          <WHeader title="Social Echo Breakdown" />
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1.5 }}>
            <DonutChart size={140} segments={[{ pct: 35.8, color: BLUE }, { pct: 25.5, color: DARK }, { pct: 38.7, color: '#E0E0E0' }]} />
          </Box>
          {[{ label: 'Facebook', color: BLUE, pct: '35.8%', count: '1.9k' }, { label: 'X', color: DARK, pct: '25.5%', count: '1.4k' }].map((r, i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.75 }}>
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: r.color, flexShrink: 0 }} />
              <Typography sx={{ fontSize: 13, flex: 1, color: '#424242' }}>{r.label}</Typography>
              <Typography sx={{ fontSize: 13, color: '#212121' }}>{r.pct}</Typography>
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#212121', width: 36, textAlign: 'right' }}>{r.count}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* News Sources by Reach — full table */}
      {(() => {
        const NS_TABLE = [
          { rank: 1,  init: 'CN', color: '#C62828', name: 'CNN',                url: 'US | https://mtnwe...', reach: '134k', reachPct: 100, articles: 23, format: 'Online',  focus: 'International', social: ['X', 'LI'] },
          { rank: 2,  init: 'UT', color: '#1565C0', name: 'USA Today',           url: 'US | https://mtnwe...', reach: '112k', reachPct: 84,  articles: 10, format: 'Print',   focus: 'International', social: ['X', 'LI', 'IG', 'FB'] },
          { rank: 3,  init: 'NY', color: '#212121', name: 'The New York Times',  url: 'US | https://mtnwe...', reach: '98k',  reachPct: 73,  articles: 5,  format: 'Online',  focus: 'Regional',      social: ['X', 'LI', 'YT'] },
          { rank: 4,  init: 'TG', color: '#1B5E20', name: 'The Guardian',        url: 'US | https://mtnwe...', reach: '54k',  reachPct: 40,  articles: 23, format: 'Online',  focus: 'Local',         social: ['X', 'LI', 'IG', 'FB', 'YT'] },
          { rank: 5,  init: 'MN', color: '#E65100', name: 'Mountain News',       url: 'US | https://mtnwe...', reach: '12k',  reachPct: 9,   articles: 8,  format: 'Online',  focus: 'Local',         social: ['X', 'LI', 'IG', 'FB'] },
          { rank: 6,  init: 'MN', color: '#E65100', name: 'Mountain News',       url: 'US | https://mtnwe...', reach: '12k',  reachPct: 9,   articles: 8,  format: 'Online',  focus: 'Local',         social: ['X', 'LI', 'IG', 'FB'] },
          { rank: 7,  init: 'MN', color: '#E65100', name: 'Mountain News',       url: 'US | https://mtnwe...', reach: '12k',  reachPct: 9,   articles: 8,  format: 'Online',  focus: 'Local',         social: ['X', 'LI', 'IG', 'FB'] },
          { rank: 8,  init: 'MN', color: '#E65100', name: 'Mountain News',       url: 'US | https://mtnwe...', reach: '12k',  reachPct: 9,   articles: 8,  format: 'Online',  focus: 'Local',         social: ['X', 'LI', 'IG', 'FB'] },
          { rank: 9,  init: 'MN', color: '#E65100', name: 'Mountain News',       url: 'US | https://mtnwe...', reach: '12k',  reachPct: 9,   articles: 8,  format: 'Online',  focus: 'Local',         social: ['X', 'LI', 'IG', 'FB'] },
          { rank: 10, init: 'MN', color: '#E65100', name: 'Mountain News',       url: 'US | https://mtnwe...', reach: '12k',  reachPct: 9,   articles: 8,  format: 'Online',  focus: 'Local',         social: ['X', 'LI', 'IG', 'FB'] },
        ]
        const SOCIAL_COLOR = { X: '#212121', LI: '#0A66C2', IG: '#E1306C', FB: '#1877F2', YT: '#FF0000' }
        return (
          <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, bgcolor: 'white' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, pt: 1.5, pb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#212121' }}>News Sources by Reach</Typography>
                <InfoOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              </Box>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <IconButton size="small"><FilterListIcon sx={{ fontSize: 18, color: 'text.secondary' }} /></IconButton>
                <IconButton size="small"><SortIcon sx={{ fontSize: 18, color: 'text.secondary' }} /></IconButton>
                <IconButton size="small"><MoreVertIcon sx={{ fontSize: 18, color: 'text.secondary' }} /></IconButton>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', px: 2, py: 0.75, borderTop: '1px solid #e0e0e0', borderBottom: '1px solid #e0e0e0', bgcolor: '#FAFAFA' }}>
              <Box sx={{ width: 28 }} /><Box sx={{ width: 24 }} />
              <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', flex: 1 }}>Name</Typography>
              <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', width: 80 }}>Reach ↓</Typography>
              <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', width: 56, textAlign: 'center' }}>Articles</Typography>
              <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', width: 60 }}>Format</Typography>
              <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', width: 90 }}>Focus</Typography>
              <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', width: 100 }}>Social Profiles</Typography>
              <Box sx={{ width: 60 }} />
            </Box>
            {NS_TABLE.map((row, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1, borderBottom: i < NS_TABLE.length - 1 ? '1px solid #f5f5f5' : 'none', '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' } }}>
                <Checkbox size="small" sx={{ p: 0, mr: 0.5, width: 28 }} />
                <Typography sx={{ fontSize: 12, color: 'text.secondary', width: 24 }}>{row.rank}</Typography>
                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
                  <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: row.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Typography sx={{ fontSize: 9, fontWeight: 700, color: 'white' }}>{row.init}</Typography>
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#212121', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.name}</Typography>
                    <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{row.url}</Typography>
                  </Box>
                </Box>
                <Box sx={{ width: 80, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#212121' }}>{row.reach}</Typography>
                  <Box sx={{ width: 20, height: 6, bgcolor: '#f0f0f0', borderRadius: 1, overflow: 'hidden' }}>
                    <Box sx={{ width: `${row.reachPct}%`, height: '100%', bgcolor: BLUE, borderRadius: 1 }} />
                  </Box>
                </Box>
                <Typography sx={{ fontSize: 13, color: '#424242', width: 56, textAlign: 'center' }}>{row.articles}</Typography>
                <Typography sx={{ fontSize: 12, color: '#424242', width: 60 }}>{row.format}</Typography>
                <Box sx={{ width: 90, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <LocationOnOutlinedIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
                  <Typography sx={{ fontSize: 12, color: '#424242' }}>{row.focus}</Typography>
                </Box>
                <Box sx={{ width: 100, display: 'flex', alignItems: 'center', gap: 0.25 }}>
                  {row.social.slice(0, 4).map((s, si) => (
                    s.startsWith('+')
                      ? <Box key={si} sx={{ fontSize: 9, fontWeight: 700, bgcolor: '#f0f0f0', color: '#424242', px: 0.5, borderRadius: 0.5 }}>{s}</Box>
                      : <Box key={si} sx={{ width: 18, height: 18, borderRadius: '50%', bgcolor: SOCIAL_COLOR[s] || '#9E9E9E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Typography sx={{ fontSize: 7, fontWeight: 700, color: 'white' }}>{s}</Typography>
                        </Box>
                  ))}
                </Box>
                <Box sx={{ width: 60, display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                  <IconButton size="small" sx={{ p: 0.25 }}><PersonOutlineIcon sx={{ fontSize: 15, color: 'text.secondary' }} /></IconButton>
                  <IconButton size="small" sx={{ p: 0.25 }}><PlaylistAddIcon sx={{ fontSize: 15, color: 'text.secondary' }} /></IconButton>
                </Box>
              </Box>
            ))}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1, px: 2, py: 1, borderTop: '1px solid #e0e0e0' }}>
              <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>1 - 7 of 30</Typography>
              <Typography sx={{ fontSize: 12, color: '#bdbdbd', cursor: 'pointer' }}>{'<'}</Typography>
              <Typography sx={{ fontSize: 12, color: TEAL, cursor: 'pointer' }}>{'>'}</Typography>
            </Box>
          </Box>
        )
      })()}

      {/* News Sources Breakdown by Reach + News Sources Reach Trend */}
      {(() => {
        const NS_BREAKDOWN = [
          { name: 'CNN',            v: 52.1, color: BLUE   },
          { name: 'USA Today',      v: 38.3, color: YELLOW },
          { name: 'The New York...', v: 30.9, color: PINK  },
          { name: 'The Guardian',   v: 13.1, color: GREEN  },
          { name: 'Mountain Wee...', v: 13.1, color: ORANGE },
        ]
        const NS_TREND = [
          { label: 'CNN',              color: BLUE,   data: [20, 55, 35, 42, 28, 32, 22] },
          { label: 'USA Today',        color: YELLOW, data: [12, 40, 22, 28, 18, 20, 15] },
          { label: 'The New York Times', color: PINK, data: [8,  18, 12, 15, 10, 12, 8]  },
        ]
        const maxV = 55.1
        return (
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            <Box sx={{ flex: 1, minWidth: 240, border: '1px solid #e0e0e0', borderRadius: 0.5, bgcolor: 'white', p: 2 }}>
              <WHeader title="News Sources Breakdown by Reach" />
              <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, height: 140, pt: 1 }}>
                {NS_BREAKDOWN.map((b, i) => (
                  <Box key={i} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography sx={{ fontSize: 10, fontWeight: 700, color: '#212121', mb: 0.25 }}>{b.v}k</Typography>
                    <Box sx={{ width: '70%', height: `${(b.v / maxV) * 120}px`, bgcolor: b.color, borderRadius: '2px 2px 0 0' }} />
                    <Typography sx={{ fontSize: 9, color: '#616161', mt: 0.25, textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>{b.name}</Typography>
                  </Box>
                ))}
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                {['0', '10k', '20k', '30k', '40k', '50k', '60k'].map(l => <Typography key={l} sx={{ fontSize: 8, color: 'text.secondary' }}>{l}</Typography>)}
              </Box>
            </Box>
            <Box sx={{ flex: 1, minWidth: 240, border: '1px solid #e0e0e0', borderRadius: 0.5, bgcolor: 'white', p: 2 }}>
              <WHeader title="News Sources Reach Trend" action={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, border: '1px solid #e0e0e0', borderRadius: 0.5, px: 1, py: 0.25, cursor: 'pointer' }}>
                  <Typography sx={{ fontSize: 12 }}>+1</Typography>
                  <ArrowDropDownIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                </Box>
              } />
              <Box sx={{ display: 'flex', gap: 1.5, mb: 1, flexWrap: 'wrap' }}>
                {NS_TREND.map((l, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: l.color }} />
                    <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{l.label}</Typography>
                  </Box>
                ))}
              </Box>
              {(() => {
                const w = 600, h = 120, padL = 36, padB = 24, padT = 8, cW = w - padL - 8, cH = h - padB - padT
                const maxVal = 60
                const xL = ['Aug 25', 'Aug 27', 'Aug 29', 'Aug 31']
                return (
                  <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid meet" style={{ display: 'block' }}>
                    {[0, 20000, 40000, 60000].map(v => {
                      const y = padT + (1 - v / 60000) * cH
                      return <g key={v}><line x1={padL} y1={y} x2={w} y2={y} stroke="#f0f0f0" strokeWidth="1" /><text x={padL - 4} y={y + 3} textAnchor="end" fontSize="8" fill="#9E9E9E">{v === 0 ? '0' : `${v / 1000}k`}</text></g>
                    })}
                    {NS_TREND.map((ds, di) => {
                      const pts = ds.data.map((v, i) => `${padL + (i / (ds.data.length - 1)) * cW},${padT + (1 - v / maxVal) * cH}`).join(' ')
                      return <polyline key={di} points={pts} fill="none" stroke={ds.color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
                    })}
                    {xL.map((d, i) => <text key={i} x={padL + (i / (xL.length - 1)) * cW} y={h - 6} textAnchor="middle" fontSize="8" fill="#9E9E9E">{d}</text>)}
                  </svg>
                )
              })()}
            </Box>
          </Box>
        )
      })()}

      {/* Press Release + News Sources Keywords & Entities */}
      {(() => {
        const KW_NC = [
          { text: 'Boston Red Sox', type: 'org', size: 14 }, { text: 'Richland County', type: 'kw', size: 15 },
          { text: 'IKEA', type: 'org', size: 13 }, { text: 'Answer Engine', type: 'kw', size: 13 },
          { text: 'MLB', type: 'org', size: 13 }, { text: 'fans', type: 'kw', size: 12 },
          { text: '#policeprofessionalism', type: 'ht', size: 12 }, { text: 'LLMs', type: 'kw', size: 16 },
          { text: 'Real Estate Agence', type: 'kw', size: 13 }, { text: 'coaching to ensure', type: 'kw', size: 12 },
          { text: 'Facebook', type: 'org', size: 13 }, { text: 'GPT-4', type: 'kw', size: 18 },
          { text: 'Clemson University', type: 'org', size: 14 }, { text: 'Dallas', type: 'kw', size: 13 },
          { text: 'South Carolina', type: 'kw', size: 22 }, { text: 'United States', type: 'kw', size: 14 },
          { text: 'Don White', type: 'people', size: 12 }, { text: 'United States', type: 'kw', size: 13 },
          { text: 'Leon Lott', type: 'people', size: 12 }, { text: '#entirecounty', type: 'ht', size: 12 },
          { text: 'technology', type: 'kw', size: 18 }, { text: 'public safety activities', type: 'kw', size: 13 },
          { text: 'Anthony Tassone', type: 'people', size: 13 }, { text: 'Richland County Sheriff\'s Department', type: 'org', size: 11 },
        ]
        const KW_COLORS = { kw: PINK, ht: ORANGE, org: '#1565C0', people: '#3F51B5' }
        return (
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            <Box sx={{ flex: 1, minWidth: 220, border: '1px solid #e0e0e0', borderRadius: 0.5, bgcolor: 'white', p: 2 }}>
              <WHeader title="Press Release" />
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1.5 }}>
                <DonutChart size={150} segments={[{ pct: 35.8, color: BLUE }, { pct: 25.5, color: YELLOW }, { pct: 38.7, color: '#E0E0E0' }]} />
              </Box>
              {[{ label: 'Press Release', color: BLUE, pct: '35.8%', count: '1.9k' }, { label: 'Other News', color: YELLOW, pct: '25.5%', count: '1.4k' }].map((r, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.75 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: r.color, flexShrink: 0 }} />
                  <Typography sx={{ fontSize: 13, flex: 1, color: '#424242' }}>{r.label}</Typography>
                  <Typography sx={{ fontSize: 13, color: '#212121' }}>{r.pct}</Typography>
                  <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#212121', width: 36, textAlign: 'right' }}>{r.count}</Typography>
                </Box>
              ))}
            </Box>
            <Box sx={{ flex: 2, minWidth: 280, border: '1px solid #e0e0e0', borderRadius: 0.5, bgcolor: 'white', p: 2 }}>
              <WHeader title="News Sources Keywords & Entities" action={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, border: '1px solid #e0e0e0', borderRadius: 0.5, px: 1, py: 0.25, cursor: 'pointer' }}>
                  <Typography sx={{ fontSize: 12 }}>+3</Typography>
                  <ArrowDropDownIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                </Box>
              } />
              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 1.25 }}>
                {[{ label: 'Keyword', color: PINK }, { label: 'Hashtag', color: ORANGE }, { label: 'Organization', color: '#1565C0' }, { label: 'People', color: '#3F51B5' }].map(f => (
                  <Box key={f.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: f.color }} />
                    <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{f.label}</Typography>
                  </Box>
                ))}
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, lineHeight: 2 }}>
                {KW_NC.map((kw, i) => (
                  <Typography key={i} sx={{ fontSize: kw.size, fontWeight: kw.size >= 16 ? 700 : 400, color: KW_COLORS[kw.type], cursor: 'pointer', '&:hover': { opacity: 0.75 } }}>
                    {kw.text}
                  </Typography>
                ))}
              </Box>
            </Box>
          </Box>
        )
      })()}

    </Box>
  )
}

// ── JOURNALISTS ───────────────────────────────────────────────────────────────

const J_KPI = [
  { title: 'Total Journalists', value: '65',    delta: 18, sub: 'Previously 55',    data: [10,12,14,11,13,15,14,12,13,16,14,13,15,12,14,13] },
  { title: 'Total Reach',       value: '33.3k', delta: 18, sub: 'Previously 2.97M', data: [20,22,28,24,26,30,28,24,26,32,28,26,30,24,28,26] },
  { title: 'Average Engagement',value: '33.3k', delta: 18, sub: 'Previously 2.97M', data: [18,20,24,22,24,28,26,22,24,28,26,24,28,22,26,24] },
]

const J_TABLE = [
  { rank: 1, name: 'Jenessa Abrams',      loc: 'New York, New York, USA', mentions: 2, role: 'Featured Writer',    source: 'Tasting Tables',                    social: ['X', '+3'] },
  { rank: 2, name: 'USA Today',           loc: 'Miami, Florida, USA',    mentions: 6, role: 'Contributor',         source: 'Aventura Magazine, Eater Miami...',  social: ['X', '+6'] },
  { rank: 3, name: 'The New York Times',  loc: 'United States',          mentions: 5, role: 'Freelance Trave...',  source: 'AFAR, Food & Wine, Gard...',         social: ['X', 'LI', 'YT'] },
  { rank: 4, name: 'The Guardian',        loc: 'El Segundo, CA, USA',    mentions: 5, role: 'Restaurant Critic',   source: 'Los Angeles Times',                  social: ['X', 'LI', 'IG', 'FB', 'YT'] },
  { rank: 5, name: 'Mountain Weekly News',loc: 'United States',          mentions: 8, role: 'Head of Life',        source: 'Star Tribute',                       social: ['X', 'LI', 'IG', 'FB'] },
  { rank: 6, name: 'Mountain Weekly News',loc: 'United States',          mentions: 8, role: 'Health Writer',       source: 'HuffPost',                           social: ['X', 'LI', 'IG', 'FB'] },
  { rank: 7, name: 'Mountain Weekly News',loc: 'United States',          mentions: 8, role: 'Blogger',             source: 'Associate Press',                    social: ['X', 'LI', 'IG', 'FB'] },
  { rank: 8, name: 'Mountain Weekly News',loc: 'United States',          mentions: 8, role: 'Senior Editor',       source: "Man vs Miles, Men's Fitness...",      social: ['X', 'LI', 'IG', 'FB'] },
  { rank: 9, name: 'Mountain Weekly News',loc: 'United States',          mentions: 8, role: 'Freelance Cocktail...', source: 'Food & Wine Magazine',             social: ['X', 'LI', 'IG', 'FB'] },
  { rank: 10, name: 'Mountain Weekly News',loc: 'United States',         mentions: 8, role: 'Food Blogger',        source: 'The Washington Post',                social: ['X', 'LI', 'IG', 'FB'] },
]

const SOCIAL_COLOR = { X: '#212121', LI: '#0A66C2', IG: '#E1306C', FB: '#1877F2', YT: '#FF0000' }

const NARRATIVE_ROWS = [
  { name: 'Jane Doe', up: true,  vals: [13, 13, 168, 168], pcts: [-2.4, -2.4, -3.1, +2.4] },
  { name: 'Michael Chen', up: false, vals: [90, 168, 98, 168], pcts: [+2.4, +8.9, +2.4, +2.4] },
  { name: 'Sarah Kim',    up: false, vals: [15, 12, 14, 10],  pcts: [-3.1, -3.1, -3.1, -2.4] },
  { name: 'Michael Chen', up: false, vals: [16, 13, 11, 99],  pcts: [-2.4, -2.4, +2.4, +2.4] },
  { name: 'Michael Chen', up: false, vals: [13, 15, 98, 12],  pcts: [-2.4, +2.4, +2.4, +2.4] },
  { name: 'Michael Chen', up: false, vals: [16, 97, 11, 99],  pcts: [-2.4, +2.4, -2.4, +2.4] },
  { name: 'Michael Chen', up: false, vals: [90, 168, 13, 13], pcts: [+2.4, +2.4, -2.4, -2.4] },
]

function matrixColor(v) {
  if (v >= 151) return '#1A3A6B'
  if (v >= 101) return '#2E6EBF'
  if (v >= 51)  return '#7FB3D3'
  return '#C5D9F1'
}

const J_BREAKDOWN = [
  { name: 'Matt Roush',    v: 52.1, color: BLUE   },
  { name: 'Lindsey Barr', v: 38.3, color: YELLOW  },
  { name: 'Alexandra Bird', v: 30.9, color: PINK  },
  { name: 'Alyssa Geller', v: 13.1, color: GREEN  },
  { name: 'Ralph D. Russo', v: 13.1, color: ORANGE },
]

const J_REACH_TREND = [
  { label: 'Matt Roush',    color: BLUE,   data: [12, 14, 55, 42, 20, 18, 22] },
  { label: 'Lindsey Barr', color: YELLOW,  data: [10, 35, 28, 15, 12, 14, 16] },
  { label: 'Alexandra Bird', color: PINK,  data: [8,  12, 18, 22, 14, 12, 14] },
]

function JournalistsContent() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <AIInsight bullets={[
        '65 journalists covered the brand this period — up 18% from 55 — with Mountain Weekly News and major nationals like NYT and The Guardian driving bulk of Relevant Mentions. 1, 2',
        'Total Reach of 33.3k reflects a broad distribution of coverage, with top journalists averaging 8 Relevant Mentions each and strong social presence across X, LinkedIn and Instagram. 3, 4',
        'Matt Roush leads Reach Breakdown at 52.1k, followed by Lindsey Barr at 38.3k — together accounting for over 54% of total journalist-driven reach in the period. 5…',
      ]} />

      {/* 3 KPI sparkline cards */}
      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
        {J_KPI.map((k, i) => (
          <Box key={i} sx={{ flex: 1, minWidth: 180, border: '1px solid #e0e0e0', borderRadius: 0.5, bgcolor: 'white', p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#212121' }}>{k.title}</Typography>
                <InfoOutlinedIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              </Box>
              <IconButton size="small"><MoreVertIcon sx={{ fontSize: 16, color: 'text.secondary' }} /></IconButton>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75, mb: 0.25 }}>
              <Typography sx={{ fontSize: 28, fontWeight: 700, color: '#212121', lineHeight: 1.1 }}>{k.value}</Typography>
              <Delta v={k.delta} />
            </Box>
            <Typography sx={{ fontSize: 11, color: 'text.secondary', mb: 1 }}>{k.sub}</Typography>
            <Sparkline data={k.data} color={TEAL} height={40} />
          </Box>
        ))}
      </Box>

      {/* Journalists by Reach table */}
      <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, bgcolor: 'white' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, pt: 1.5, pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Typography sx={{ fontSize: 16, fontWeight: 700 }}>Journalists by Reach</Typography>
            <InfoOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton size="small"><FilterListIcon sx={{ fontSize: 18, color: 'text.secondary' }} /></IconButton>
            <IconButton size="small"><SortIcon sx={{ fontSize: 18, color: 'text.secondary' }} /></IconButton>
            <IconButton size="small"><MoreVertIcon sx={{ fontSize: 18, color: 'text.secondary' }} /></IconButton>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', px: 2, py: 0.75, borderBottom: '1px solid #e0e0e0', borderTop: '1px solid #e0e0e0' }}>
          <Box sx={{ width: 28 }} />
          <Box sx={{ width: 24 }} />
          <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', flex: 1 }}>Name</Typography>
          <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', width: 56, textAlign: 'center' }}>Relevant Mentions</Typography>
          <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', width: 90 }}>Role</Typography>
          <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', width: 120 }}>Source</Typography>
          <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', width: 80 }}>Social</Typography>
          <Box sx={{ width: 60 }} />
        </Box>
        {J_TABLE.map((row, i) => (
          <Box key={i} sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1, borderBottom: i < J_TABLE.length - 1 ? '1px solid #f5f5f5' : 'none', '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' } }}>
            <Checkbox size="small" sx={{ p: 0, mr: 0.5, width: 28 }} />
            <Typography sx={{ fontSize: 12, color: 'text.secondary', width: 24 }}>{row.rank}</Typography>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#212121', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.name}</Typography>
              <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{row.loc}</Typography>
            </Box>
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#212121', width: 56, textAlign: 'center' }}>{row.mentions}</Typography>
            <Typography sx={{ fontSize: 12, color: '#424242', width: 90, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.role}</Typography>
            <Typography sx={{ fontSize: 12, color: '#424242', width: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.source}</Typography>
            <Box sx={{ width: 80, display: 'flex', alignItems: 'center', gap: 0.25 }}>
              {row.social.slice(0, 3).map((s, si) => (
                s.startsWith('+')
                  ? <Box key={si} sx={{ fontSize: 10, fontWeight: 700, bgcolor: '#f0f0f0', color: '#424242', px: 0.5, borderRadius: 0.5 }}>{s}</Box>
                  : <Box key={si} sx={{ width: 18, height: 18, borderRadius: '50%', bgcolor: SOCIAL_COLOR[s] || '#9E9E9E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography sx={{ fontSize: 8, fontWeight: 700, color: 'white' }}>{s}</Typography>
                    </Box>
              ))}
            </Box>
            <Box sx={{ width: 60, display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
              <IconButton size="small" sx={{ p: 0.25 }}><PersonOutlineIcon sx={{ fontSize: 15, color: 'text.secondary' }} /></IconButton>
              <IconButton size="small" sx={{ p: 0.25 }}><PlaylistAddIcon sx={{ fontSize: 15, color: 'text.secondary' }} /></IconButton>
            </Box>
          </Box>
        ))}
        <Pagination text="1 - 7 of 30" />
      </Box>

      {/* Narrative Coverage matrix */}
      <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, bgcolor: 'white', p: 2 }}>
        <WHeader title="Narrative Coverage" download />
        <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
          {['Matrix', 'Network'].map(v => (
            <Box key={v} sx={{ px: 1.5, py: 0.5, border: '1px solid', borderRadius: 0.5, fontSize: 13, cursor: 'pointer', borderColor: v === 'Matrix' ? TEAL : '#e0e0e0', bgcolor: v === 'Matrix' ? 'rgba(29,159,159,0.06)' : 'transparent', color: '#212121' }}>
              {v}
            </Box>
          ))}
        </Box>
        <Box sx={{ overflowX: 'auto' }}>
          <Box sx={{ minWidth: 500 }}>
            <Box sx={{ display: 'flex', mb: 0.5 }}>
              <Box sx={{ width: 100, flexShrink: 0 }} />
              {['AI Policy', 'Start Ups', 'Regulations', 'Environment'].map(col => (
                <Box key={col} sx={{ flex: 1, textAlign: 'center' }}>
                  <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#212121' }}>{col}</Typography>
                </Box>
              ))}
            </Box>
            {NARRATIVE_ROWS.map((row, ri) => (
              <Box key={ri} sx={{ display: 'flex', mb: 0.5 }}>
                <Box sx={{ width: 100, flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ fontSize: 12, color: '#424242' }}>{row.name}</Typography>
                  {row.up && <ArrowUpwardIcon sx={{ fontSize: 12, color: GREEN, ml: 0.25 }} />}
                </Box>
                {row.vals.map((v, ci) => (
                  <Box key={ci} sx={{ flex: 1, mx: 0.25, borderRadius: 0.5, bgcolor: matrixColor(v), p: 0.75, textAlign: 'center' }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 700, color: 'white' }}>{v}</Typography>
                    <Typography sx={{ fontSize: 10, color: 'rgba(255,255,255,0.85)' }}>{row.pcts[ci] > 0 ? '+' : ''}{row.pcts[ci]}%</Typography>
                  </Box>
                ))}
              </Box>
            ))}
            <Box sx={{ display: 'flex', mt: 1, ml: '100px', gap: 0.5 }}>
              {[['26-50', '#C5D9F1'], ['51-100', '#7FB3D3'], ['101-125', '#2E6EBF'], ['126-150', '#1A3A6B']].map(([label, color]) => (
                <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mr: 1 }}>
                  <Box sx={{ width: 12, height: 12, bgcolor: color, borderRadius: 0.25 }} />
                  <Typography sx={{ fontSize: 10, color: 'text.secondary' }}>{label}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Journalists Breakdown by Reach + Reach Trend */}
      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
        <Box sx={{ flex: 1, minWidth: 240, border: '1px solid #e0e0e0', borderRadius: 0.5, bgcolor: 'white', p: 2 }}>
          <WHeader title="Journalists Breakdown by Reach" />
          <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, height: 130, pt: 1 }}>
            {J_BREAKDOWN.map((b, i) => (
              <Box key={i} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography sx={{ fontSize: 10, fontWeight: 700, color: '#212121', mb: 0.25 }}>{b.v}k</Typography>
                <Box sx={{ width: '80%', height: `${(b.v / 55) * 110}px`, bgcolor: b.color, borderRadius: '2px 2px 0 0' }} />
                <Typography sx={{ fontSize: 9, color: '#616161', mt: 0.25, textAlign: 'center', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>{b.name}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
        <Box sx={{ flex: 1, minWidth: 240, border: '1px solid #e0e0e0', borderRadius: 0.5, bgcolor: 'white', p: 2 }}>
          <WHeader title="Journalists Reach Trend" action={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, border: '1px solid #e0e0e0', borderRadius: 0.5, bgcolor: 'white', px: 1, py: 0.25, cursor: 'pointer' }}>
              <Typography sx={{ fontSize: 12 }}>+1</Typography>
              <ArrowDropDownIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
            </Box>
          } />
          <Box sx={{ display: 'flex', gap: 1.5, mb: 1, flexWrap: 'wrap' }}>
            {J_REACH_TREND.map((l, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: l.color }} />
                <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{l.label}</Typography>
              </Box>
            ))}
          </Box>
          <LineAreaChart datasets={J_REACH_TREND} height={100} xLabels={['Aug 25', 'Aug 27', 'Aug 29', 'Aug 31']} />
        </Box>
      </Box>
    </Box>
  )
}

// ── X AUTHORS ─────────────────────────────────────────────────────────────────

const XA_AGE = [
  { label: '13-17', pct: 11 }, { label: '18-24', pct: 21 }, { label: '25-34', pct: 40 },
  { label: '35-44', pct: 54 }, { label: '45-54', pct: 34 }, { label: '56-64', pct: 22 }, { label: '65+', pct: 12 },
]
const XA_LOCS = [
  { flag: '🇺🇸', name: 'United States',       v: 903 }, { flag: '🇨🇦', name: 'Canada',          v: 823 },
  { flag: '🇨🇮', name: 'Ivory Coast',         v: 522 }, { flag: '🇲🇽', name: 'Mexico',          v: 487 },
  { flag: '🇨🇳', name: 'Mainland China',      v: 333 }, { flag: '🇩🇪', name: 'Germany',         v: 288 },
  { flag: '🇲🇾', name: 'Malaysia',            v: 153 }, { flag: '🇳🇿', name: 'New Zealand',     v: 102 },
  { flag: '🇭🇰', name: 'Hong Kong SAR China', v: 67  }, { flag: '🇬🇧', name: 'United Kingdom',  v: 58  },
]
const XA_INTERESTS = [
  { name: 'Travel', pct: 50 }, { name: 'Science', pct: 50 }, { name: 'Sports', pct: 40 },
  { name: 'Law, govt and politics', pct: 20 }, { name: 'Society', pct: 20 }, { name: 'News', pct: 10 }, { name: 'Movie and TV', pct: 1 },
]
const XA_LANGS = [
  { name: 'English', pct: 50 }, { name: 'Spanish', pct: 50 }, { name: 'Portuguese', pct: 50 },
  { name: 'Japanese', pct: 50 }, { name: 'Irish', pct: 50 }, { name: 'German', pct: 50 }, { name: 'Tamil', pct: 50 },
]
const XA_OCC_SEGMENTS = [
  { pct: 14, color: BLUE }, { pct: 12, color: YELLOW }, { pct: 10, color: PINK }, { pct: 9, color: GREEN },
  { pct: 9, color: ORANGE }, { pct: 8, color: '#78909C' }, { pct: 8, color: '#9C4DD6' }, { pct: 7, color: '#00BCD4' },
  { pct: 6, color: '#FF5722' }, { pct: 6, color: '#8BC34A' }, { pct: 5, color: '#E91E63' }, { pct: 6, color: '#795548' },
]
const XA_OCC_LEGEND = [
  { label: 'Joy', pct: '35.8%' }, { label: 'Fear', pct: '25.5%' }, { label: 'Surprise', pct: '20.3%' }, { label: 'Love', pct: '20.1%' },
  { label: 'Anger', pct: '20.3%' }, { label: 'Sadness', pct: '20.1%' }, { label: 'Joy', pct: '35.8%' }, { label: 'Fear', pct: '25.5%' },
]
const XA_BIO_KW = [
  { text: 'Leather goods', s: 12 }, { text: 'Living rooms', s: 14 }, { text: 'Backyards', s: 16 }, { text: 'Real Estate Ma...', s: 13 },
  { text: 'Chairs', s: 20 }, { text: 'Nationwide Advisory...', s: 12 }, { text: 'Natural landscapes', s: 16 }, { text: 'Interiors', s: 13 },
  { text: 'Microsoft', s: 13 }, { text: 'Real Estate Ma...', s: 12 }, { text: 'Backyards', s: 14 }, { text: 'Chairs', s: 18 },
  { text: 'Hanssem', s: 13 }, { text: 'Tables Desks', s: 20 }, { text: 'Trees and leaves', s: 14 }, { text: 'Lego', s: 13 },
  { text: 'Knoll', s: 12 }, { text: 'Leather goods', s: 12 }, { text: 'PR Newswire', s: 12 }, { text: 'Logitech', s: 12 },
  { text: 'Living rooms', s: 13 }, { text: 'Figma', s: 12 }, { text: 'Home Interiors', s: 22 }, { text: 'PR Newswire', s: 12 },
  { text: 'Figma', s: 12 }, { text: 'entire line', s: 12 }, { text: 'Joshua Slack', s: 13 }, { text: 'Nature', s: 12 },
  { text: 'Woven Baskets', s: 13 }, { text: 'Office spaces', s: 16 }, { text: 'Game rooms', s: 15 }, { text: 'Books stacked', s: 13 },
  { text: 'The Verge', s: 12 }, { text: 'Amazon', s: 13 }, { text: 'Ebay', s: 12 }, { text: 'Desks', s: 18 },
  { text: 'FilzFelt', s: 12 }, { text: 'aesthetic contrast', s: 12 }, { text: 'Computers', s: 20 }, { text: 'Microsoft', s: 16 },
  { text: 'Nationwide Advisory...', s: 12 },
]
const BIO_COLORS = [TEAL, BLUE, '#9C4DD6', '#FF9800', '#CF2D8A']

function XAuthorsContent() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <AIInsight bullets={[
        '33.3k unique X authors engaged with this topic, up 18% — concentrated in the 35–44 age group (54%) which also shows the highest engagement rate per author. 1, 2',
        'United States dominates location with 903 authors, followed by Canada (823) and Ivory Coast (522) — indicating significant international reach beyond North America. 3, 4',
        'Travel and Science are the top interests at 50% each, while English and Spanish are the leading languages — useful for tailoring content strategy across X campaigns. 5…',
      ]} />

      {/* Info banner */}
      <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, bgcolor: 'white', p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: 'rgba(29,159,159,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Typography sx={{ fontSize: 18 }}>✦</Typography>
        </Box>
        <Box>
          <Typography sx={{ fontSize: 13, color: '#424242' }}>Find and understand relevant X communities and authors.</Typography>
          <Typography sx={{ fontSize: 13, fontWeight: 700, color: TEAL, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>Create Author Segment Dashboard</Typography>
        </Box>
      </Box>

      {/* 2 KPI cards */}
      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
        {[
          { title: 'Unique X Authors', value: '33.3k', delta: 18, sub: 'Previously 2.97M' },
          { title: 'X Verification',   value: '33.3k', delta: null },
        ].map((k, i) => (
          <Box key={i} sx={{ flex: 1, minWidth: 200, border: '1px solid #e0e0e0', borderRadius: 0.5, bgcolor: 'white', p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#212121' }}>{k.title}</Typography>
                <InfoOutlinedIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              </Box>
              <IconButton size="small"><DownloadOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} /></IconButton>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75 }}>
              <Typography sx={{ fontSize: 28, fontWeight: 700, color: '#212121', lineHeight: 1.1 }}>{k.value}</Typography>
              {k.delta && <Delta v={k.delta} />}
            </Box>
            {k.sub && <Typography sx={{ fontSize: 11, color: 'text.secondary', mt: 0.25 }}>{k.sub}</Typography>}
          </Box>
        ))}
      </Box>

      {/* Gender Breakdown + Age Breakdown */}
      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
        <Box sx={{ flex: 1, minWidth: 220, border: '1px solid #e0e0e0', borderRadius: 0.5, bgcolor: 'white', p: 2 }}>
          <WHeader title="Gender Breakdown" download />
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <DonutChart size={130} segments={[{ pct: 60.3, color: BLUE }, { pct: 35.4, color: YELLOW }, { pct: 4.3, color: '#E0E0E0' }]} />
            <Box>
              {[{ label: 'Male', color: BLUE, pct: '60.3%' }, { label: 'Female', color: YELLOW, pct: '35.4%' }, { label: 'Unknown', color: '#E0E0E0', pct: '5.3%' }].map((r, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.75 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: r.color }} />
                  <Typography sx={{ fontSize: 13, flex: 1, color: '#424242' }}>{r.label}</Typography>
                  <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#212121' }}>{r.pct}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
        <Box sx={{ flex: 1, minWidth: 220, border: '1px solid #e0e0e0', borderRadius: 0.5, bgcolor: 'white', p: 2 }}>
          <WHeader title="Age Breakdown" download />
          <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 0.5, height: 130 }}>
            {XA_AGE.map((a, i) => (
              <Box key={i} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography sx={{ fontSize: 9, fontWeight: 700, color: '#212121', mb: 0.25 }}>{a.pct}%</Typography>
                <Box sx={{ width: '80%', height: `${(a.pct / 60) * 100}px`, bgcolor: TEAL, borderRadius: '2px 2px 0 0' }} />
                <Typography sx={{ fontSize: 9, color: '#616161', mt: 0.25 }}>{a.label}</Typography>
              </Box>
            ))}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.25 }}>
            {['0', '20%', '40%', '60%'].map(l => <Typography key={l} sx={{ fontSize: 9, color: 'text.secondary' }}>{l}</Typography>)}
          </Box>
        </Box>
      </Box>

      {/* Top Locations */}
      <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, bgcolor: 'white', p: 2 }}>
        <WHeader title="Top Locations" download action={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, border: '1px solid #e0e0e0', borderRadius: 0.5, bgcolor: 'white', px: 1, py: 0.25, cursor: 'pointer' }}>
            <Typography sx={{ fontSize: 12 }}>Country</Typography>
            <ArrowDropDownIcon sx={{ fontSize: 14 }} />
          </Box>
        } />
        {XA_LOCS.map((r, i) => {
          const pct = Math.round((r.v / 903) * 100)
          return (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.75 }}>
              <Typography sx={{ fontSize: 13, color: '#424242', width: 160, flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {r.flag} {r.name}
              </Typography>
              <Box sx={{ flex: 1, height: 8, bgcolor: '#f0f0f0', borderRadius: 1, overflow: 'hidden' }}>
                <Box sx={{ width: `${pct}%`, height: '100%', bgcolor: ORANGE, borderRadius: 1 }} />
              </Box>
              <Typography sx={{ fontSize: 12, color: 'text.secondary', width: 32, textAlign: 'right', flexShrink: 0 }}>{r.v}</Typography>
            </Box>
          )
        })}
        <Pagination text="1 - 10 of 30 Locations" />
      </Box>

      {/* Top Occupations + Top Bio Keywords */}
      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
        <Box sx={{ flex: 1, minWidth: 220, border: '1px solid #e0e0e0', borderRadius: 0.5, bgcolor: 'white', p: 2 }}>
          <WHeader title="Top Occupations" download />
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <DonutChart size={120} segments={XA_OCC_SEGMENTS} />
            <Box sx={{ flex: 1 }}>
              {XA_OCC_LEGEND.map((l, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.25 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: XA_OCC_SEGMENTS[i % XA_OCC_SEGMENTS.length]?.color, flexShrink: 0 }} />
                  <Typography sx={{ fontSize: 11, flex: 1, color: '#424242' }}>{l.label}</Typography>
                  <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#212121' }}>{l.pct}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
        <Box sx={{ flex: 1, minWidth: 220, border: '1px solid #e0e0e0', borderRadius: 0.5, bgcolor: 'white', p: 2 }}>
          <WHeader title="Top Bio Keywords" download />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, lineHeight: 1.8 }}>
            {XA_BIO_KW.map((kw, i) => (
              <Typography key={i} sx={{ fontSize: kw.s, fontWeight: kw.s >= 18 ? 700 : 400, color: BIO_COLORS[i % BIO_COLORS.length], cursor: 'pointer', '&:hover': { opacity: 0.75 } }}>
                {kw.text}
              </Typography>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Top Interests + Top Languages */}
      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
        {[
          { title: 'Top Interests',  col1: 'Interests',  data: XA_INTERESTS },
          { title: 'Top Languages',  col1: 'Language',   data: XA_LANGS     },
        ].map(({ title, col1, data }) => (
          <Box key={title} sx={{ flex: 1, minWidth: 220, border: '1px solid #e0e0e0', borderRadius: 0.5, bgcolor: 'white', p: 2 }}>
            <WHeader title={title} download />
            <Box sx={{ display: 'flex', pb: 0.75, borderBottom: '1px solid #e0e0e0', mb: 0.5 }}>
              <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', flex: 1 }}>{col1}</Typography>
              <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', width: 70, textAlign: 'right' }}>Percentage</Typography>
            </Box>
            {data.map((row, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', py: 0.75, borderBottom: i < data.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                <Typography sx={{ fontSize: 12, color: 'text.secondary', width: 20 }}>{i + 1}</Typography>
                <Box sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: '#f0f0f0', mr: 0.75, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Typography sx={{ fontSize: 8 }}>✦</Typography>
                </Box>
                <Typography sx={{ fontSize: 13, flex: 1, color: '#424242' }}>{row.name}</Typography>
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#212121', width: 36, textAlign: 'right' }}>{row.pct}%</Typography>
                <Box sx={{ width: 32, height: 8, bgcolor: '#f0f0f0', borderRadius: 1, overflow: 'hidden', ml: 1 }}>
                  <Box sx={{ width: `${row.pct}%`, height: '100%', bgcolor: BLUE, borderRadius: 1 }} />
                </Box>
              </Box>
            ))}
            <Pagination text={`1 - 10 of 30 ${col1}`} />
          </Box>
        ))}
      </Box>
    </Box>
  )
}

// ── AUTHORS LIST ──────────────────────────────────────────────────────────────

const AL_GENDER_SEGS = [{ pct: 60.3, color: BLUE }, { pct: 35.4, color: YELLOW }, { pct: 4.3, color: '#E0E0E0' }]
const AL_GENDER_LEGEND = [
  { label: 'Male',    color: BLUE,    pct: '60.3%', count: '5.7k', delta: 18,  up: true  },
  { label: 'Female',  color: YELLOW,  pct: '35.4%', count: '5.7k', delta: 18,  up: false },
  { label: 'Unknown', color: '#9E9E9E',pct: '5.3%',  count: '5.7k', delta: 0,   up: null  },
]
const AL_DEMO_AGE = ['13-17', '18-24', '25-34', '35-44', '45-54', '55-64', '65-121']
const AL_DEMO_F   = [12, 28, 38, 22, 18, 20, 8]
const AL_DEMO_M   = [8,  20, 45, 32, 28, 25, 14]

const AL_LANG = [
  { name: 'Spanish', mentions: '32.4k', pct: 60, delta: '4%',   up: false },
  { name: 'English', mentions: '32.4k', pct: 60, delta: '180%', up: true  },
  { name: 'Arabic',  mentions: '32.4k', pct: 60, delta: '0%',   up: null  },
  { name: 'French',  mentions: '32.4k', pct: 60, delta: '180%', up: true  },
  { name: 'Thai',    mentions: '132.4k',pct: 60, delta: '180%', up: true  },
]

const AL_SOURCES = [
  { rank: 1,  init: 'FX', color: '#1A237E', name: 'KFXV FOX 2',              loc: 'United States of America', subs: 'N/A', mentions: 2,   eng: '→ 0',    reach: '309K → 0' },
  { rank: 2,  init: 'BS', color: '#C62828', name: 'Business Sherbrokercord', loc: 'United States of America', subs: 'N/A', mentions: 143, eng: '→ 0',    reach: '161K → 0' },
  { rank: 3,  init: 'MN', color: '#6A1B9A', name: 'Madame Noire',            loc: 'United States of America', subs: 'N/A', mentions: 2,   eng: '→ 0',    reach: '37.5K → 0' },
  { rank: 4,  init: 'EB', color: '#1565C0', name: 'East Bay Times',          loc: 'United States of America', subs: 'N/A', mentions: 4,   eng: '→ 0',    reach: '37.5K → 0' },
  { rank: 5,  init: 'SP', color: '#1B5E20', name: 'Spotify',                 loc: 'Sweden',                   subs: 'N/A', mentions: 7,   eng: '→ 0',    reach: '37.5K → 0' },
  { rank: 6,  init: 'YC', color: '#E65100', name: "Yahoo! Canada",           loc: 'Canada',                   subs: 'N/A', mentions: 205, eng: '→ 0',    reach: '32.7K → 0' },
  { rank: 7,  init: 'IN', color: '#004D40', name: 'Indonesia Newswire',      loc: 'Indonesia',                subs: 'N/A', mentions: 1,   eng: '→ 0',    reach: '32.7K → 0' },
  { rank: 8,  init: 'NY', color: '#212121', name: 'New York Post',           loc: 'United States of America', subs: 'N/A', mentions: 65,  eng: '↑ 16.7%', reach: '22.5K ↑ 43.7%' },
  { rank: 9,  init: 'RE', color: '#FF5722', name: 'reddit.com/r/apple',      loc: 'Country undetermined',     subs: '6.04K', mentions: 1, eng: '↑ 85.4%', reach: '38.3bn ↑ 85.4%' },
  { rank: 10, init: 'SI', color: '#2E7D32', name: 'Sports Illustrated',      loc: 'United States of America', subs: 'N/A', mentions: 156, eng: '↑ 21.9%', reach: '2.68bn ↑ 21.9%' },
  { rank: 11, init: 'OP', color: '#BF360C', name: 'Orange Pro',              loc: 'France',                   subs: 'N/A', mentions: 4,   eng: '↑ 100%',  reach: '955K → 0' },
  { rank: 12, init: 'YN', color: '#F57F17', name: "Yahoo! News",             loc: 'United States of America', subs: '870', mentions: 10,  eng: '↓ 11.7%', reach: '46.5bn ↓ 11.7%' },
]

const AL_AUTHORS = [
  { rank: 1,  handle: '@hanshewtabor',         name: 'Wanda Hanshew-Tabor',    country: 'Country undetermined', subs: 'N/A', mentions: 16, eng: '↓ 100%', reach: '572K ↓ 73.5%' },
  { rank: 2,  handle: '@booyenselizma',         name: 'Elizma Booyens',         country: 'Country undetermined', subs: 'N/A', mentions: 3,  eng: '↓ 100%', reach: '465K ↓ 78.5%' },
  { rank: 3,  handle: '@blacnes2015',           name: 'Blan',                   country: 'Country undetermined', subs: 'N/A', mentions: 2,  eng: '↓ 100%', reach: '464K ↓ 78.5%' },
  { rank: 4,  handle: '@callmening',            name: 'Ning Neeranuch',         country: 'Country undetermined', subs: 'N/A', mentions: 1,  eng: '↓ 100%', reach: '464K ↓ 78.5%' },
  { rank: 5,  handle: '@olgapavik76',           name: "O***n",                  country: 'Country undetermined', subs: 'N/A', mentions: 1,  eng: '↓ 100%', reach: '464K ↓ 78.5%' },
  { rank: 6,  handle: '@paulanajraceballos321', name: 'Paula',                  country: 'Country undetermined', subs: 'N/A', mentions: 1,  eng: '↓ 100%', reach: '464K ↓ 78.5%' },
  { rank: 7,  handle: '@meredesolopesandrade', name: 'Mercedes Maria',          country: 'Country undetermined', subs: 'N/A', mentions: 1,  eng: '↓ 100%', reach: '464K ↓ 78.5%' },
  { rank: 8,  handle: '@jevaughnmoeste',        name: 'Jevaughn modeste',       country: 'Country undetermined', subs: 'N/A', mentions: 1,  eng: '↓ 100%', reach: '464K ↓ 78.5%' },
  { rank: 9,  handle: '@liliana1312',           name: 'Liliana Piñero',         country: 'Country undetermined', subs: 'N/A', mentions: 1,  eng: '↓ 100%', reach: '337 ↓ 100%' },
  { rank: 10, handle: '@3humes',                name: 'Candice Humes',          country: 'Country undetermined', subs: 'N/A', mentions: 1,  eng: '↓ 100%', reach: '433 ↓ 100%' },
  { rank: 11, handle: '@dlanney93',             name: 'Lanney E',               country: 'Country undetermined', subs: 'N/A', mentions: 1,  eng: '↓ 100%', reach: '372K ↓ 62.8%' },
  { rank: 12, handle: '@vividongmaw',           name: 'Vivi DM',                country: 'Country undetermined', subs: 'N/A', mentions: 1,  eng: '↓ 100%', reach: '372K ↓ 62.8%' },
  { rank: 13, handle: '@veraaramos',            name: 'SANTO GESSO ATELIER',    country: 'Country undetermined', subs: 'N/A', mentions: 1,  eng: '↓ 100%', reach: '372K ↓ 62.8%' },
]

const AL_OCC_KW = [
  { text: 'Living rooms', s: 18 }, { text: 'Backyards', s: 14 }, { text: 'Real Estate', s: 14 },
  { text: 'Microsoft', s: 13 }, { text: 'Rugs', s: 13 }, { text: 'Natural landscapes', s: 20 },
  { text: 'Nationwide Advisory...', s: 12 }, { text: 'Real Estate Ma...', s: 13 }, { text: 'Rugs', s: 12 },
  { text: 'value', s: 13 }, { text: 'Chairs', s: 24 }, { text: 'Interiors', s: 13 },
  { text: 'Nature', s: 13 }, { text: 'Joshua Slack', s: 13 }, { text: 'Tables Desks', s: 22 },
  { text: 'Trees and leaves', s: 14 }, { text: 'Lego', s: 12 }, { text: 'Knoll', s: 12 },
  { text: 'Logitech', s: 12 }, { text: 'Figma', s: 12 }, { text: 'Home Interiors', s: 26 },
  { text: 'PR Newswire', s: 12 }, { text: 'aesthetic contrast', s: 12 }, { text: 'entire line', s: 12 },
  { text: 'FilzFelt', s: 13 }, { text: 'Hanssem', s: 13 }, { text: 'Office spaces', s: 18 },
  { text: 'Game rooms', s: 16 }, { text: 'Woven Baskets', s: 13 }, { text: 'Books stacked', s: 13 },
  { text: 'Amazon Ebay', s: 13 }, { text: 'The Verge', s: 12 }, { text: 'Wood finishes', s: 13 },
  { text: 'Leather goods', s: 13 }, { text: 'Computers', s: 24 }, { text: 'Microsoft', s: 18 },
  { text: 'Nationwide', s: 14 },
]

function SentimentBar({ positive = 70, negative = 10, neutral = 20 }) {
  return (
    <Box sx={{ display: 'flex', height: 8, borderRadius: 1, overflow: 'hidden', width: 80 }}>
      <Box sx={{ width: `${positive}%`, bgcolor: GREEN }} />
      <Box sx={{ width: `${neutral}%`, bgcolor: '#9E9E9E' }} />
      <Box sx={{ width: `${negative}%`, bgcolor: '#F44336' }} />
    </Box>
  )
}

function AuthorsListContent() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <AIInsight bullets={[
        'Male authors represent 60.3% of the total pool (5.7k) with an 18% increase, while Female authors declined 18% — a notable gender shift worth monitoring for diversity KPIs. 1, 2',
        'Spanish and English are the leading languages, each at 60% share, suggesting strong bilingual reach. French and Arabic represent growth opportunities in underserved markets. 3, 4',
        'Reddit.com/r/apple and Sports Illustrated show the highest engagement growth at +85.4% and +21.9% respectively — signaling high-value communities for targeted amplification. 5…',
      ]} />

      {/* Author Gender + Author Demographic */}
      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
        <Box sx={{ flex: 1, minWidth: 220, border: '1px solid #e0e0e0', borderRadius: 0.5, bgcolor: 'white', p: 2 }}>
          <WHeader title="Author Gender" download />
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Box sx={{ position: 'relative', flexShrink: 0 }}>
              <DonutChart size={130} segments={AL_GENDER_SEGS} label="60.3%" />
            </Box>
            <Box sx={{ flex: 1 }}>
              {AL_GENDER_LEGEND.map((r, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.75 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: r.color, flexShrink: 0 }} />
                  <Typography sx={{ fontSize: 13, flex: 1, color: '#424242' }}>{r.label}</Typography>
                  <Typography sx={{ fontSize: 12, color: '#212121' }}>{r.pct}</Typography>
                  <Typography sx={{ fontSize: 12, color: '#212121', width: 36, textAlign: 'right' }}>{r.count}</Typography>
                  {r.up !== null
                    ? <Delta v={r.up ? r.delta : -r.delta} />
                    : <Box sx={{ fontSize: 11, fontWeight: 700, bgcolor: '#F5F5F5', color: '#757575', px: 0.75, py: 0.25, borderRadius: 1 }}>→ 0%</Box>
                  }
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
        <Box sx={{ flex: 1, minWidth: 220, border: '1px solid #e0e0e0', borderRadius: 0.5, bgcolor: 'white', p: 2 }}>
          <WHeader title="Author Demographic" />
          {(() => {
            const maxVal = Math.max(...AL_DEMO_F, ...AL_DEMO_M)
            const halfH = 80, barW = 26, gap = 6, padL = 6
            const w = padL + AL_DEMO_AGE.length * (barW + gap)
            const totalH = halfH * 2 + 16
            return (
              <svg width="100%" height={totalH} viewBox={`0 0 ${w} ${totalH}`} preserveAspectRatio="xMidYMid meet" style={{ display: 'block' }}>
                <line x1={padL} y1={halfH} x2={w} y2={halfH} stroke="#e0e0e0" strokeWidth="1" />
                {AL_DEMO_AGE.map((age, i) => {
                  const x = padL + i * (barW + gap)
                  const fH = (AL_DEMO_F[i] / maxVal) * (halfH - 6)
                  const mH = (AL_DEMO_M[i] / maxVal) * (halfH - 6)
                  return (
                    <g key={i}>
                      <rect x={x} y={halfH - fH} width={barW} height={fH} fill={YELLOW} rx="2" />
                      <rect x={x} y={halfH} width={barW} height={mH} fill={BLUE} rx="2" />
                      <text x={x + barW / 2} y={totalH - 2} textAnchor="middle" fontSize="7" fill="#9E9E9E">{age}</text>
                    </g>
                  )
                })}
              </svg>
            )
          })()}
          <Box sx={{ display: 'flex', gap: 1.5, mt: 0.75 }}>
            {[{ label: 'Female', color: YELLOW }, { label: 'Male', color: BLUE }].map(s => (
              <Box key={s.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: s.color }} />
                <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{s.label}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Author Occupation + Top Language */}
      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
        <Box sx={{ flex: 1, minWidth: 220, border: '1px solid #e0e0e0', borderRadius: 0.5, bgcolor: 'white', p: 2 }}>
          <WHeader title="Author Occupation" />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, lineHeight: 1.8 }}>
            {AL_OCC_KW.map((kw, i) => (
              <Typography key={i} sx={{ fontSize: kw.s, fontWeight: kw.s >= 20 ? 700 : 400, color: BIO_COLORS[i % BIO_COLORS.length], cursor: 'pointer' }}>{kw.text}</Typography>
            ))}
          </Box>
        </Box>
        <Box sx={{ flex: 1, minWidth: 220, border: '1px solid #e0e0e0', borderRadius: 0.5, bgcolor: 'white', p: 2 }}>
          <WHeader title="Top Language" />
          <Box sx={{ display: 'flex', pb: 0.75, borderBottom: '1px solid #e0e0e0', mb: 0.5 }}>
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', width: 20 }}>Na me</Typography>
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', flex: 1, ml: 1 }}>Mentions</Typography>
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', width: 60, textAlign: 'right' }}>Trend</Typography>
          </Box>
          {AL_LANG.map((r, i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center', py: 0.875, borderBottom: i < AL_LANG.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
              <Typography sx={{ fontSize: 12, color: 'text.secondary', width: 20 }}>{i + 1}</Typography>
              <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 0.75, ml: 1 }}>
                <Typography sx={{ fontSize: 13, color: '#212121' }}>{r.name}</Typography>
                <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{r.mentions}</Typography>
                <Box sx={{ flex: 1, height: 6, bgcolor: TEAL, borderRadius: 1, maxWidth: 80, opacity: r.pct / 100 }} />
                <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{r.pct}%</Typography>
              </Box>
              <Box sx={{ width: 60, display: 'flex', justifyContent: 'flex-end' }}>
                {r.up === null
                  ? <Box sx={{ fontSize: 11, fontWeight: 700, bgcolor: '#F5F5F5', color: '#757575', px: 0.75, py: 0.25, borderRadius: 1 }}>→ 0%</Box>
                  : <Box sx={{ fontSize: 11, fontWeight: 700, bgcolor: r.up ? '#E8F5E9' : '#FFEBEE', color: r.up ? '#2E7D32' : '#C62828', px: 0.75, py: 0.25, borderRadius: 1 }}>
                      {r.up ? '↑' : '↓'} {r.delta}
                    </Box>
                }
              </Box>
            </Box>
          ))}
          <Pagination text="1 - 5 of 30" />
        </Box>
      </Box>

      {/* Sources (Top 1000) table */}
      <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, bgcolor: 'white' }}>
        <Box sx={{ display: 'flex', px: 2, py: 1, borderBottom: '1px solid #e0e0e0' }}>
          <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#212121' }}>Sources (Top 1000)</Typography>
        </Box>
        <Box sx={{ display: 'flex', px: 2, py: 0.75, borderBottom: '1px solid #e0e0e0', bgcolor: '#FAFAFA' }}>
          <Box sx={{ width: 28 }} />
          <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', flex: 1 }}>Name</Typography>
          <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', width: 70, textAlign: 'right' }}>Subscribers</Typography>
          <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', width: 70, textAlign: 'right' }}>Mentions</Typography>
          <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', width: 100, textAlign: 'right' }}>Engagement ↓</Typography>
          <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', width: 100, textAlign: 'right' }}>Est. reach</Typography>
          <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', width: 60, textAlign: 'center' }}>Sentiment</Typography>
        </Box>
        {AL_SOURCES.map((row, i) => (
          <Box key={i} sx={{ display: 'flex', alignItems: 'center', px: 2, py: 0.875, borderBottom: i < AL_SOURCES.length - 1 ? '1px solid #f5f5f5' : 'none', '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' } }}>
            <Box sx={{ width: 28, display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>#{row.rank}</Typography>
            </Box>
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 0.75, minWidth: 0 }}>
              <Box sx={{ width: 28, height: 28, borderRadius: '50%', bgcolor: row.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Typography sx={{ fontSize: 8, fontWeight: 700, color: 'white' }}>{row.init}</Typography>
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#212121', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.name}</Typography>
                <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{row.loc}</Typography>
              </Box>
            </Box>
            <Typography sx={{ fontSize: 12, color: '#424242', width: 70, textAlign: 'right' }}>{row.subs}</Typography>
            <Typography sx={{ fontSize: 12, color: '#424242', width: 70, textAlign: 'right' }}>{row.mentions}</Typography>
            <Typography sx={{ fontSize: 11, color: '#424242', width: 100, textAlign: 'right' }}>{row.eng}</Typography>
            <Typography sx={{ fontSize: 11, color: '#424242', width: 100, textAlign: 'right' }}>{row.reach}</Typography>
            <Box sx={{ width: 60, display: 'flex', justifyContent: 'center' }}><SentimentBar /></Box>
          </Box>
        ))}
      </Box>

      {/* Authors (Top 1000) table */}
      <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, bgcolor: 'white' }}>
        <Box sx={{ display: 'flex', px: 2, py: 1, borderBottom: '1px solid #e0e0e0' }}>
          <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#212121' }}>Authors (Top 1000)</Typography>
        </Box>
        <Box sx={{ display: 'flex', px: 2, py: 0.75, borderBottom: '1px solid #e0e0e0', bgcolor: '#FAFAFA' }}>
          <Box sx={{ width: 28 }} />
          <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', flex: 1 }}>Name</Typography>
          <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', width: 70, textAlign: 'right' }}>Subscribers</Typography>
          <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', width: 70, textAlign: 'right' }}>Mentions</Typography>
          <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', width: 100, textAlign: 'right' }}>Engagement ↓</Typography>
          <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', width: 100, textAlign: 'right' }}>Est. reach</Typography>
          <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', width: 60, textAlign: 'center' }}>Sentiment</Typography>
        </Box>
        {AL_AUTHORS.map((row, i) => (
          <Box key={i} sx={{ display: 'flex', alignItems: 'center', px: 2, py: 0.875, borderBottom: i < AL_AUTHORS.length - 1 ? '1px solid #f5f5f5' : 'none', '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' } }}>
            <Typography sx={{ fontSize: 11, color: 'text.secondary', width: 28 }}>#{row.rank}</Typography>
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 0.75, minWidth: 0 }}>
              <Box sx={{ width: 28, height: 28, borderRadius: '50%', bgcolor: BLUE, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Typography sx={{ fontSize: 9, fontWeight: 700, color: 'white' }}>{row.name[0]}</Typography>
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#212121', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.name} {row.handle}</Typography>
                <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{row.country}</Typography>
              </Box>
            </Box>
            <Typography sx={{ fontSize: 12, color: '#424242', width: 70, textAlign: 'right' }}>{row.subs}</Typography>
            <Typography sx={{ fontSize: 12, color: '#424242', width: 70, textAlign: 'right' }}>{row.mentions}</Typography>
            <Typography sx={{ fontSize: 11, color: '#C62828', width: 100, textAlign: 'right' }}>{row.eng}</Typography>
            <Typography sx={{ fontSize: 11, color: '#424242', width: 100, textAlign: 'right' }}>{row.reach}</Typography>
            <Box sx={{ width: 60, display: 'flex', justifyContent: 'center' }}><SentimentBar positive={80} negative={5} neutral={15} /></Box>
          </Box>
        ))}
      </Box>

    </Box>
  )
}

// ── main export ───────────────────────────────────────────────────────────────

export default function AudienceTabContent({ loading, targetSubTab, subTabTrigger }) {
  const [activeTab, setActiveTab] = useState('authors-list')
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
    <Box ref={boxRef} sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, flexShrink: 0 }}>
      <StickySegmentNav value={activeTab} onChange={(val) => { setActiveTab(val); scrollToTop() }} />
      {activeTab === 'authors-list'  && <AuthorsListContent />}
      {activeTab === 'journalists'   && <JournalistsContent />}
      {activeTab === 'x-authors'     && <XAuthorsContent />}
      {activeTab === 'news-coverage' && <NewsCoverageContent />}
    </Box>
  )
}
