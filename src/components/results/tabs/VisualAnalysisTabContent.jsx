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

const TEAL  = '#1D9F9F'
const BLUE  = '#2196F3'
const PINK  = '#CF2D8A'
const YELLOW = '#FFC107'

// ── mock data ─────────────────────────────────────────────────────────────────

const IMAGE_COLORS = [
  '#795548','#9E9E9E','#607D8B','#8D6E63','#78909C',
  '#FF8F00','#E91E63','#5C6BC0','#43A047','#F4511E',
  '#3949AB','#00897B','#D81B60','#8E24AA','#039BE5',
  '#546E7A','#6D4C41','#F57C00','#1E88E5','#7B1FA2',
  '#C62828','#2E7D32','#1565C0','#AD1457','#558B2F',
  '#F9A825','#00695C','#4527A0','#283593','#BF360C',
  '#4E342E','#37474F','#33691E','#827717','#E65100',
  '#880E4F','#1A237E','#004D40','#212121','#3E2723',
]

const AGE_ITEMS = [
  { name: 'Young adults', mentions: '132.4k', pct: 60, delta: '4%',   up: false },
  { name: 'Adults',       mentions: '132.4k', pct: 60, delta: '180%', up: true  },
  { name: 'Teenagers',    mentions: '132.4k', pct: 60, delta: '0%',   up: null  },
  { name: 'Seniors',      mentions: '132.4k', pct: 60, delta: '180%', up: true  },
  { name: 'Children',     mentions: '132.4k', pct: 60, delta: '180%', up: true  },
]

const OBJECT_ITEMS = [
  { name: 'Person',   mentions: '132.4k', pct: 60, delta: '4%',   up: false },
  { name: 'Trousers', mentions: '132.4k', pct: 60, delta: '180%', up: true  },
  { name: 'Buttons',  mentions: '132.4k', pct: 60, delta: '0%',   up: null  },
  { name: 'Shirt',    mentions: '132.4k', pct: 60, delta: '180%', up: true  },
  { name: 'Footwear', mentions: '132.4k', pct: 60, delta: '180%', up: true  },
]

const GENDER_DONUT = [
  { pct: 60.3, color: BLUE },
  { pct: 35.4, color: YELLOW },
  { pct: 4.3,  color: '#E0E0E0' },
]

const TOTAL_MENTIONS_DATA = [35,20,45,30,55,28,40,22,50,35,28,42,30,48,25,38,44,30,52,35,28,40,32,46,28,38,42,30,35,45]

const AUDIENCE_BARS   = [45, 130, 85, 250, 75, 185, 95, 55, 20]
const AUDIENCE_LINE   = [8000, 12000, 15000, 22000, 8000, 18000, 12000, 6000, 2000]
const AUDIENCE_DATES  = ['Apr 1','Apr 2','Apr 3','Apr 4','Apr 5','Apr 6','Apr 7','Apr 8','Apr 9','Apr 10']

const SEARCHES_TABLE = [
  { name: 'Sina Weibo', mentions: '132.4k', pct: 60, barColor: BLUE,   delta: '4%',   up: false },
  { name: 'Sina Weibo', mentions: '132.4k', pct: 60, barColor: YELLOW, delta: '180%', up: true  },
  { name: 'Sina Weibo', mentions: '132.4k', pct: 60, barColor: PINK,   delta: '0%',   up: null  },
  { name: 'Sina Weibo', mentions: '132.4k', pct: 60, barColor: '#4CAF50', delta: '0%', up: null },
  { name: 'Sina Weibo', mentions: '132.4k', pct: 60, barColor: ORANGE, delta: '0%',  up: null  },
]

const TREND_SEARCHES = [
  { label: 'Lisboa',         color: BLUE,   data: [10,20,55,35,25,18,12,8,6,5,8,10,8,6,5] },
  { label: 'Arctic Monkeys', color: YELLOW, data: [8,15,30,20,15,10,8,5,4,4,5,6,5,4,3] },
  { label: 'IGIT',           color: PINK,   data: [5,8,12,10,8,6,5,4,3,4,5,4,3,3,2] },
]

const HASHTAGS = [
  { text: '#Real Estate Ma...', size: 16 }, { text: '#Rugs', size: 18 }, { text: '#Natural landscapes', size: 22 },
  { text: '#Backyards', size: 20 }, { text: '#entire line', size: 15 }, { text: '#value', size: 16 },
  { text: '#Real Estate Ma...', size: 15 }, { text: '#Interiors', size: 18 }, { text: '#Woven Baskets', size: 20 },
  { text: '#Interiors', size: 24 }, { text: '#Desks', size: 22 }, { text: '#Nature', size: 16 },
  { text: '#Trees and leaves', size: 18 }, { text: '#Lego', size: 17 }, { text: '#Real Estate Ma...', size: 14 },
  { text: '#Backyards', size: 20 }, { text: '#Home Interiors', size: 32 }, { text: '#Desks', size: 26 },
  { text: '#entire line', size: 15 }, { text: '#entire line', size: 15 }, { text: '#FilzFelt', size: 16 },
  { text: '#Real Estate Ma...', size: 14 }, { text: '#Desks', size: 22 }, { text: '#Gaming', size: 22 },
  { text: '#Office Sp...', size: 20 }, { text: '#Computers', size: 24 }, { text: '#Woven Baskets', size: 16 },
]

const ORANGE = '#FF9800'

// ── helpers ───────────────────────────────────────────────────────────────────

function WHeader({ title, download, action }) {
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

function DeltaBadge({ delta, up }) {
  if (up === null) return <Box sx={{ fontSize: 11, fontWeight: 700, bgcolor: '#F5F5F5', color: '#757575', px: 0.75, py: 0.2, borderRadius: 1 }}>→ 0%</Box>
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.25, bgcolor: up ? '#E8F5E9' : '#FFEBEE', color: up ? '#2E7D32' : '#C62828', fontSize: 11, fontWeight: 700, px: 0.75, py: 0.2, borderRadius: 1 }}>
      {up ? <ArrowUpwardIcon sx={{ fontSize: 11 }} /> : <ArrowDownwardIcon sx={{ fontSize: 11 }} />}
      {delta}
    </Box>
  )
}

function TableWidget({ title, items }) {
  return (
    <Box sx={{ flex: 1, minWidth: 220, border: '1px solid #e0e0e0', borderRadius: 0.5, bgcolor: 'white', p: 2 }}>
      <WHeader title={title} />
      <Box sx={{ display: 'flex', pb: 0.75, borderBottom: '1px solid #e0e0e0', mb: 0.5 }}>
        <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', width: 20 }}>Age</Typography>
        <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', flex: 1, ml: 1 }}>Name</Typography>
        <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', width: 90 }}>Mentions</Typography>
        <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', width: 56, textAlign: 'right' }}>Trend</Typography>
      </Box>
      {items.map((row, i) => (
        <Box key={i} sx={{ display: 'flex', alignItems: 'center', py: 0.875, borderBottom: i < items.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
          <Typography sx={{ fontSize: 12, color: 'text.secondary', width: 20 }}>{i + 1}</Typography>
          <Typography sx={{ fontSize: 13, flex: 1, color: '#212121', ml: 1 }}>{row.name}</Typography>
          <Box sx={{ width: 90, display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography sx={{ fontSize: 12, color: '#212121' }}>{row.mentions}</Typography>
            <Box sx={{ width: 32, height: 6, bgcolor: '#f0f0f0', borderRadius: 1, overflow: 'hidden' }}>
              <Box sx={{ width: `${row.pct}%`, height: '100%', bgcolor: BLUE, borderRadius: 1 }} />
            </Box>
            <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{row.pct}%</Typography>
          </Box>
          <Box sx={{ width: 56, display: 'flex', justifyContent: 'flex-end' }}>
            <DeltaBadge delta={row.delta} up={row.up} />
          </Box>
        </Box>
      ))}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1, pt: 1, borderTop: '1px solid #f5f5f5' }}>
        <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>1 - 5 of 30</Typography>
        <Typography sx={{ fontSize: 12, color: '#bdbdbd', cursor: 'pointer' }}>{'<'}</Typography>
        <Typography sx={{ fontSize: 12, color: TEAL, cursor: 'pointer' }}>{'>'}</Typography>
      </Box>
    </Box>
  )
}

// ── main export ───────────────────────────────────────────────────────────────

export default function VisualAnalysisTabContent({ loading }) {
  if (loading) return null

  // Donut paths
  const donutSize = 130, cx = 65, cy = 65, r = 52, ir = 30
  let cumAngle = -90
  const donutPaths = GENDER_DONUT.map(seg => {
    const s = (cumAngle * Math.PI) / 180
    const sweep = (seg.pct / 100) * 360
    cumAngle += sweep
    const e = (cumAngle * Math.PI) / 180
    const large = sweep > 180 ? 1 : 0
    return {
      color: seg.color,
      d: `M ${cx + r * Math.cos(s)} ${cy + r * Math.sin(s)} A ${r} ${r} 0 ${large} 1 ${cx + r * Math.cos(e)} ${cy + r * Math.sin(e)} L ${cx + ir * Math.cos(e)} ${cy + ir * Math.sin(e)} A ${ir} ${ir} 0 ${large} 0 ${cx + ir * Math.cos(s)} ${cy + ir * Math.sin(s)} Z`,
    }
  })

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>

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
              'Visual content is dominated by fashion and lifestyle imagery — Male subjects appear in 60.3% of images, with Young Adults as the leading age group showing consistent volume at 132.4k mentions. 1, 2',
              '"Person", "Trousers" and "Shirt" are the top detected objects, suggesting strong apparel-focused visual coverage that aligns with brand category positioning. 3, 4',
              'Mentions Trend by Searches shows Lisboa peaking at 55k around Aug 10-13, while Arctic Monkeys and IGIT show steady lower-volume patterns — indicating event-driven spikes worth correlating with campaigns. 5…',
            ].map((t, i) => (
              <Typography key={i} component="li" sx={{ fontSize: 14, lineHeight: '22px', color: '#212121', mb: 0.75 }}>{t}</Typography>
            ))}
          </Box>
          <Typography sx={{ fontSize: 14, fontWeight: 700, color: TEAL, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>View More Insights</Typography>
        </Box>
      </Box>

      {/* Most Engaged Images and Videos */}
      <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, bgcolor: 'white', p: 2 }}>
        <WHeader title="Most Engaged Images and Videos" download />
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {IMAGE_COLORS.map((color, i) => (
            <Box key={i} sx={{ width: 60, height: 60, bgcolor: color, borderRadius: 0.5, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography sx={{ fontSize: 8, color: 'rgba(255,255,255,0.4)' }}>img</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Gender in Images + Age in Images + Objects */}
      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>

        {/* Gender in Images */}
        <Box sx={{ flex: 1, minWidth: 200, border: '1px solid #e0e0e0', borderRadius: 0.5, bgcolor: 'white', p: 2 }}>
          <WHeader title="Gender in Images" download />
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1.5 }}>
            <svg width={donutSize} height={donutSize}>
              {donutPaths.map((p, i) => <path key={i} d={p.d} fill={p.color} stroke="white" strokeWidth="2" />)}
              <circle cx={cx} cy={cy} r={ir} fill="white" />
              <text x={cx} y={cy + 4} textAnchor="middle" fontSize="13" fontWeight="700" fill="#212121">60.3%</text>
            </svg>
          </Box>
          {[
            { label: 'Male',    color: BLUE,    pct: '60.3%', count: '5.7k', delta: 18,  up: true  },
            { label: 'Female',  color: YELLOW,  pct: '35.4%', count: '5.7k', delta: 18,  up: false },
            { label: 'Unknown', color: '#9E9E9E',pct: '5.3%',  count: '5.7k', delta: 0,   up: null  },
          ].map((r, i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.75 }}>
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: r.color, flexShrink: 0 }} />
              <Typography sx={{ fontSize: 13, flex: 1, color: '#424242' }}>{r.label}</Typography>
              <Typography sx={{ fontSize: 12, color: '#212121' }}>{r.pct}</Typography>
              <Typography sx={{ fontSize: 12, color: '#212121', width: 32, textAlign: 'right' }}>{r.count}</Typography>
              <DeltaBadge delta={`${r.delta}%`} up={r.up} />
            </Box>
          ))}
        </Box>

        {/* Age in Images */}
        <TableWidget title="Age in Images" items={AGE_ITEMS} />

        {/* Objects and Animals in Images */}
        <TableWidget title="Objects and Animals in Images" items={OBJECT_ITEMS} />

      </Box>

      {/* Total Mentions + Share of Potential Audience */}
      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>

        {/* Total Mentions */}
        <Box sx={{ flex: 1, minWidth: 240, border: '1px solid #e0e0e0', borderRadius: 0.5, bgcolor: 'white', p: 2 }}>
          <WHeader title="Total Mentions" />
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75, mb: 0.25 }}>
            <Typography sx={{ fontSize: 36, fontWeight: 700, color: '#212121', lineHeight: 1.1 }}>33.1k</Typography>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.25, bgcolor: '#E8F5E9', color: '#2E7D32', fontSize: 11, fontWeight: 700, px: 0.75, py: 0.25, borderRadius: 1 }}>
              <ArrowUpwardIcon sx={{ fontSize: 11 }} />18%
            </Box>
          </Box>
          <Typography sx={{ fontSize: 11, color: 'text.secondary', mb: 1.5 }}>Previously 2.97M</Typography>
          {(() => {
            const w = 800, h = 120
            const max = Math.max(...TOTAL_MENTIONS_DATA), min = 0, range = max - min || 1
            const pts = TOTAL_MENTIONS_DATA.map((v, i) => `${(i / (TOTAL_MENTIONS_DATA.length - 1)) * w},${h - ((v - min) / range) * (h - 8) - 4}`).join(' ')
            return (
              <svg width="100%" height={120} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ display: 'block' }}>
                <polygon points={`0,${h} ${pts} ${w},${h}`} fill={BLUE} fillOpacity="0.10" />
                <polyline points={pts} fill="none" stroke={BLUE} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
              </svg>
            )
          })()}
        </Box>

        {/* Share of Potential Audience */}
        <Box sx={{ flex: 2, minWidth: 300, border: '1px solid #e0e0e0', borderRadius: 0.5, bgcolor: 'white', p: 2 }}>
          <WHeader title="Share of Potential Audience" />
          <Box sx={{ display: 'flex', gap: 2, mb: 1.5 }}>
            {[{ label: 'Mentions', color: BLUE }, { label: 'Views', color: YELLOW }].map(s => (
              <Box key={s.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: s.color }} />
                <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{s.label}</Typography>
              </Box>
            ))}
          </Box>
          {(() => {
            const w = 600, h = 160, padL = 36, padR = 36, padB = 24, padT = 8
            const cW = w - padL - padR, cH = h - padB - padT
            const maxBar = Math.max(...AUDIENCE_BARS), maxLine = Math.max(...AUDIENCE_LINE)
            const barW = cW / AUDIENCE_BARS.length - 4
            const linePts = AUDIENCE_LINE.map((v, i) =>
              `${padL + (i / (AUDIENCE_LINE.length - 1)) * cW},${padT + (1 - v / maxLine) * cH}`
            ).join(' ')
            return (
              <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid meet" style={{ display: 'block' }}>
                {[0, 60, 120, 180, 240, 300].map(v => {
                  const y = padT + (1 - v / maxBar) * cH
                  return <g key={v}>
                    <line x1={padL} y1={y} x2={w - padR} y2={y} stroke="#f0f0f0" strokeWidth="1" />
                    <text x={padL - 4} y={y + 3} textAnchor="end" fontSize="8" fill="#9E9E9E">{v}</text>
                  </g>
                })}
                {[0, 10000, 20000, 30000].map(v => {
                  const y = padT + (1 - v / maxLine) * cH
                  return <text key={v} x={w - padR + 4} y={y + 3} textAnchor="start" fontSize="8" fill="#9E9E9E">{v === 0 ? '0' : `${v / 1000}k`}</text>
                })}
                {AUDIENCE_BARS.map((v, i) => {
                  const x = padL + i * (barW + 4)
                  const bH = (v / maxBar) * cH
                  return <rect key={i} x={x} y={padT + cH - bH} width={barW} height={bH} fill={BLUE} rx="1" />
                })}
                <polyline points={linePts} fill="none" stroke={YELLOW} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
                {AUDIENCE_DATES.map((d, i) => (
                  <text key={i} x={padL + i * (cW / (AUDIENCE_BARS.length - 1))} y={h - 6} textAnchor="middle" fontSize="8" fill="#9E9E9E">{d}</text>
                ))}
              </svg>
            )
          })()}
        </Box>

      </Box>

      {/* Searches by Mentions + Mentions Trend by Searches */}
      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>

        {/* Searches by Mentions */}
        <Box sx={{ flex: 1, minWidth: 240, border: '1px solid #e0e0e0', borderRadius: 0.5, bgcolor: 'white', p: 2 }}>
          <WHeader title="Searches by Mentions" />
          <Box sx={{ display: 'flex', pb: 0.75, borderBottom: '1px solid #e0e0e0', mb: 0.5 }}>
            <Box sx={{ width: 20 }} />
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', flex: 1 }}>Name</Typography>
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', width: 100 }}>Mentions</Typography>
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', width: 52, textAlign: 'right' }}>Trend</Typography>
          </Box>
          {SEARCHES_TABLE.map((row, i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center', py: 0.875, borderBottom: i < SEARCHES_TABLE.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
              <Typography sx={{ fontSize: 12, color: 'text.secondary', width: 20 }}>{i + 1}</Typography>
              <Typography sx={{ fontSize: 13, flex: 1, color: '#212121' }}>{row.name}</Typography>
              <Box sx={{ width: 100, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography sx={{ fontSize: 12, color: '#212121' }}>{row.mentions}</Typography>
                <Box sx={{ width: 28, height: 6, bgcolor: '#f0f0f0', borderRadius: 1, overflow: 'hidden' }}>
                  <Box sx={{ width: `${row.pct}%`, height: '100%', bgcolor: row.barColor, borderRadius: 1 }} />
                </Box>
                <Typography sx={{ fontSize: 10, color: 'text.secondary' }}>{row.pct}%</Typography>
              </Box>
              <Box sx={{ width: 52, display: 'flex', justifyContent: 'flex-end' }}>
                <DeltaBadge delta={row.delta} up={row.up} />
              </Box>
            </Box>
          ))}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 1, pt: 1, borderTop: '1px solid #f5f5f5' }}>
            <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>1-5 of 10</Typography>
            <Typography sx={{ fontSize: 12, color: '#bdbdbd', cursor: 'pointer' }}>{'<'}</Typography>
            <Typography sx={{ fontSize: 12, color: TEAL, cursor: 'pointer' }}>{'>'}</Typography>
          </Box>
        </Box>

        {/* Mentions Trend by Searches */}
        <Box sx={{ flex: 2, minWidth: 300, border: '1px solid #e0e0e0', borderRadius: 0.5, bgcolor: 'white', p: 2 }}>
          <WHeader title="Mentions Trend by Searches" />
          <Box sx={{ display: 'flex', gap: 2, mb: 1.5 }}>
            {TREND_SEARCHES.map((l, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: l.color }} />
                <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{l.label}</Typography>
              </Box>
            ))}
          </Box>
          {(() => {
            const w = 600, h = 160, padL = 40, padB = 28, padT = 8
            const cW = w - padL - 8, cH = h - padB - padT
            const allVals = TREND_SEARCHES.flatMap(d => d.data)
            const maxVal = Math.max(...allVals)
            const xLabels = ['Aug 1','Aug 4','Aug 7','Aug 10','Aug 13','Aug 16','Aug 19','Aug 21','Aug 24','Aug 27','Aug 31']
            return (
              <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid meet" style={{ display: 'block' }}>
                {[0, 10000, 20000, 30000, 40000, 50000, 60000].map(v => {
                  const y = padT + (1 - v / maxVal) * cH
                  return <g key={v}>
                    <line x1={padL} y1={y} x2={w - 8} y2={y} stroke="#f0f0f0" strokeWidth="1" />
                    <text x={padL - 4} y={y + 3} textAnchor="end" fontSize="8" fill="#9E9E9E">{v === 0 ? '0' : `${v / 1000}k`}</text>
                  </g>
                })}
                {TREND_SEARCHES.map((ds, di) => {
                  const pts = ds.data.map((v, i) => `${padL + (i / (ds.data.length - 1)) * cW},${padT + (1 - v / maxVal) * cH}`).join(' ')
                  return <polyline key={di} points={pts} fill="none" stroke={ds.color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
                })}
                {xLabels.map((d, i) => (
                  <text key={i} x={padL + (i / (xLabels.length - 1)) * cW} y={h - 6} textAnchor="middle" fontSize="8" fill="#9E9E9E">{d}</text>
                ))}
              </svg>
            )
          })()}
        </Box>

      </Box>

      {/* Top Hashtags */}
      <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, bgcolor: 'white', p: 2 }}>
        <WHeader title="Top Hashtags" />
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, lineHeight: 1.8 }}>
          {HASHTAGS.map((h, i) => (
            <Typography key={i} sx={{ fontSize: h.size, fontWeight: h.size >= 26 ? 700 : h.size >= 20 ? 600 : 400, color: PINK, cursor: 'pointer', '&:hover': { opacity: 0.75 } }}>
              {h.text}
            </Typography>
          ))}
        </Box>
      </Box>

    </Box>
  )
}
