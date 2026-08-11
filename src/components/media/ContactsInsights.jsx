import { useMemo, useState } from 'react'
import { Box, Typography, IconButton, Avatar, Tooltip, Divider } from '@mui/material'
import DrillDownPanel from './DrillDownPanel'
import { alpha } from '@mui/material/styles'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt'
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import CachedIcon from '@mui/icons-material/Cached'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'

const TEAL = '#1D9F9F'
const REACH_BAR = '#26C6DA'
const DONUT = ['#3B6FE0', '#F2994A', '#EC407A', '#26A69A', '#66BB6A', '#8D6E63', '#EF5350', '#7E57C2', '#9E9D24', '#1A237E']

const fmt = (n) => n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `${Math.round(n / 1e3)}k` : `${n}`

// ---------- reusable pieces ----------
function Panel({ title, info, action, children, sx, onClick }) {
  return (
    <Box onClick={onClick} sx={{ border: '1px solid #e0e0e0', borderRadius: 1, bgcolor: 'background.paper', p: 2, ...sx }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#212121' }}>{title}</Typography>
          {info && <InfoOutlinedIcon sx={{ fontSize: 15, color: '#9e9e9e' }} />}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {action}
          <IconButton size="small"><MoreVertIcon sx={{ fontSize: 18, color: '#616161' }} /></IconButton>
        </Box>
      </Box>
      {children}
    </Box>
  )
}

const DAYS = ['Jun 26, 2026', 'Jun 27, 2026', 'Jun 28, 2026', 'Jun 29, 2026', 'Jun 30, 2026', 'Jul 1, 2026', 'Jul 2, 2026', 'Jul 3, 2026', 'Jul 4, 2026', 'Jul 5, 2026', 'Jul 6, 2026', 'Jul 7, 2026', 'Jul 8, 2026', 'Jul 9, 2026', 'Jul 10, 2026']

function Sparkline({ vals, color = TEAL, onPick }) {
  const w = 300, h = 48
  const max = Math.max(...vals), min = Math.min(...vals)
  const step = w / (vals.length - 1)
  const pts = vals.map((v, i) => [i * step, h - ((v - min) / (max - min || 1)) * h])
  const line = pts.map(p => p.join(',')).join(' ')
  return (
    <Box sx={{ position: 'relative', height: h }}>
      <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ display: 'block' }}>
        <polyline points={line} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
      {onPick && pts.map((p, i) => (
        <Box key={i} onClick={(e) => { e.stopPropagation(); onPick(DAYS[i] || `Day ${i + 1}`) }}
          sx={{ position: 'absolute', left: `${(p[0] / w) * 100}%`, top: `${(p[1] / h) * 100}%`, transform: 'translate(-50%,-50%)', width: 16, height: 16, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', '&:hover .dot': { transform: 'scale(1)' } }}>
          <Box className="dot" sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: color, border: '2px solid #fff', transform: 'scale(0)', transition: 'transform 0.1s ease' }} />
        </Box>
      ))}
    </Box>
  )
}

function KpiCard({ label, value, delta, up, prev, spark, onOpen }) {
  return (
    <Panel title={label} info sx={{ flex: 1, minWidth: 0, cursor: 'pointer', '&:hover': { boxShadow: '0 2px 10px rgba(0,0,0,0.08)' } }}
      onClick={() => onOpen && onOpen(DAYS[DAYS.length - 1])}>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 0.5 }}>
        <Typography sx={{ fontSize: 34, fontWeight: 800, color: '#212121', lineHeight: 1 }}>{value}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
          {up ? <ArrowUpwardIcon sx={{ fontSize: 14, color: '#43A047' }} /> : <ArrowDownwardIcon sx={{ fontSize: 14, color: '#E53935' }} />}
          <Typography sx={{ fontSize: 13, fontWeight: 700, color: up ? '#43A047' : '#E53935' }}>{delta}</Typography>
          <Typography sx={{ fontSize: 12.5, color: '#9e9e9e', ml: 0.5 }}>Previously {prev}</Typography>
        </Box>
      </Box>
      <Sparkline vals={spark} onPick={onOpen} />
    </Panel>
  )
}

function Donut({ data, size = 150, thickness = 22 }) {
  const total = data.reduce((s, d) => s + d.value, 0)
  const r = (size - thickness) / 2
  const C = 2 * Math.PI * r
  let offset = 0
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
        {data.map((d, i) => {
          const dash = (d.value / total) * C
          const el = <circle key={i} cx={size / 2} cy={size / 2} r={r} fill="none" stroke={d.color} strokeWidth={thickness} strokeDasharray={`${dash} ${C - dash}`} strokeDashoffset={-offset} />
          offset += dash
          return el
        })}
      </g>
    </svg>
  )
}

function DonutPanel({ title, action, items, onItemClick }) {
  return (
    <Panel title={title} info action={action} sx={{ flex: 1, minWidth: 0 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Donut data={items.map((it, i) => ({ value: it.pct, color: DONUT[i % DONUT.length] }))} />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {items.map((it, i) => (
            <Box key={it.label} onClick={() => onItemClick && onItemClick(it.label)}
              sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.35, px: 0.5, mx: -0.5, borderRadius: 1, cursor: 'pointer', '&:hover': { bgcolor: alpha('#000', 0.04) } }}>
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: DONUT[i % DONUT.length], flexShrink: 0 }} />
              <Typography sx={{ flex: 1, fontSize: 13, color: '#212121', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.label}</Typography>
              <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#424242', width: 48, textAlign: 'right' }}>{it.pct}%</Typography>
              {it.count && <Typography sx={{ fontSize: 13, color: '#9e9e9e', width: 34, textAlign: 'right' }}>{it.count}</Typography>}
            </Box>
          ))}
        </Box>
      </Box>
    </Panel>
  )
}

const SENTIMENT_SEGMENTS = [
  { key: 'positive', color: '#43A047' },
  { key: 'neutral', color: '#9e9e9e' },
  { key: 'notRated', color: '#e0e0e0' },
  { key: 'negative', color: '#E53935' },
]

function SentimentChart({ title, rows, total, onBarClick, onNameClick }) {
  const H = 190, MAX = 60
  return (
    <Panel title={title} info action={
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, mr: 0.5, cursor: 'pointer' }}>
        <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#424242' }}>Top Engagement</Typography>
        <ArrowDropDownIcon sx={{ fontSize: 18, color: '#616161' }} />
      </Box>
    } sx={{ flex: 1, minWidth: 0 }}>
      {/* Legend */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 1.5 }}>
        {[['Positive', '#43A047'], ['Negative', '#E53935'], ['Neutral', '#9e9e9e'], ['Not Rated', '#e0e0e0']].map(([l, c]) => (
          <Box key={l} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: c }} />
            <Typography sx={{ fontSize: 12, color: '#424242' }}>{l}</Typography>
          </Box>
        ))}
      </Box>
      {/* Chart */}
      <Box sx={{ display: 'flex', minHeight: 0 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', pr: 1, pb: '20px', height: H }}>
          {[60, 50, 40, 30, 20, 10, 0].map(v => <Typography key={v} sx={{ fontSize: 10, color: '#9e9e9e', lineHeight: 1 }}>{v}%</Typography>)}
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1.5, height: H, borderBottom: '1px solid #e0e0e0' }}>
            {rows.map(row => {
              const tot = SENTIMENT_SEGMENTS.reduce((s, seg) => s + row[seg.key], 0)
              return (
                <Box key={row.name} onClick={() => onBarClick && onBarClick(row.name)}
                  sx={{ flex: 1, minWidth: 0, height: `${(tot / MAX) * 100}%`, display: 'flex', flexDirection: 'column', borderRadius: '3px 3px 0 0', overflow: 'hidden', cursor: 'pointer', transition: 'opacity 0.1s ease', '&:hover': { opacity: 0.8 } }}>
                  {SENTIMENT_SEGMENTS.map(seg => (
                    <Box key={seg.key} sx={{ height: `${(row[seg.key] / tot) * 100}%`, bgcolor: seg.color }} />
                  ))}
                </Box>
              )
            })}
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5, mt: 0.5 }}>
            {rows.map(row => (
              <Tooltip key={row.name} title="View profile" placement="top" arrow enterDelay={400}>
                <Typography onClick={() => onNameClick && onNameClick(row.name)}
                  sx={{ flex: 1, minWidth: 0, fontSize: 10.5, color: '#424242', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', cursor: 'pointer', '&:hover': { color: TEAL, fontWeight: 700, textDecoration: 'underline' } }}>{row.name}</Typography>
              </Tooltip>
            ))}
          </Box>
        </Box>
      </Box>
      <Pagination label={`1 - ${rows.length} of ${total}`} />
    </Panel>
  )
}

function Pagination({ label }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 1.5 }}>
      <Typography sx={{ fontSize: 12.5, color: '#616161' }}>{label}</Typography>
      <IconButton size="small" disabled><NavigateBeforeIcon sx={{ fontSize: 18 }} /></IconButton>
      <IconButton size="small"><NavigateNextIcon sx={{ fontSize: 18, color: '#212121' }} /></IconButton>
    </Box>
  )
}

function ReachTable({ title, rows, total, isOutlet, onRow, onProfile }) {
  const max = Math.max(...rows.map(r => r.reach), 1)
  return (
    <Panel title={title} info sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
      {/* header */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '20px minmax(0,1.5fr) minmax(90px,1fr) 60px 68px', alignItems: 'center', gap: 1, px: 0.5, pb: 0.75, borderBottom: '1px solid #eee' }}>
        <Box />
        <Typography sx={{ fontSize: 12, color: '#9e9e9e' }}>Name</Typography>
        <Typography sx={{ fontSize: 12, color: '#9e9e9e' }}>Reach</Typography>
        <Typography sx={{ fontSize: 12, color: '#9e9e9e', textAlign: 'center' }}>Articles</Typography>
        <Typography sx={{ fontSize: 12, color: '#9e9e9e', textAlign: 'center' }}>Actions</Typography>
      </Box>
      {rows.map((r, i) => (
        <Box key={i} onClick={() => onRow && onRow(r)} sx={{ display: 'grid', gridTemplateColumns: '20px minmax(0,1.5fr) minmax(90px,1fr) 60px 68px', alignItems: 'center', gap: 1, px: 0.5, py: 1, borderBottom: '1px solid #f5f5f5', cursor: 'pointer', borderRadius: 1, '&:hover': { bgcolor: alpha('#000', 0.03) } }}>
          <Typography sx={{ fontSize: 12, color: '#9e9e9e' }}>{i + 1}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
            <Avatar sx={{ width: 30, height: 30, bgcolor: r.color, fontSize: 11, fontWeight: 700, flexShrink: 0, borderRadius: isOutlet ? 1 : '50%' }}>{r.initials}</Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#212121', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name}</Typography>
              <Typography sx={{ fontSize: 11.5, color: '#757575', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.sub}</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: '#212121', width: 38 }}>{fmt(r.reach)}</Typography>
            <Box sx={{ flex: 1, height: 8, borderRadius: 4, bgcolor: '#eee', overflow: 'hidden' }}>
              <Box sx={{ width: `${(r.reach / max) * 100}%`, height: '100%', bgcolor: REACH_BAR, borderRadius: 4 }} />
            </Box>
          </Box>
          <Typography sx={{ fontSize: 12.5, color: '#212121', textAlign: 'center' }}>{r.articles}</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.25 }}>
            <Tooltip title="View profile"><IconButton size="small" onClick={(e) => { e.stopPropagation(); onProfile && onProfile(r) }}><PersonOutlineIcon sx={{ fontSize: 18, color: '#9e9e9e' }} /></IconButton></Tooltip>
            <Tooltip title="Add to list"><IconButton size="small" onClick={(e) => e.stopPropagation()}><PlaylistAddIcon sx={{ fontSize: 18, color: '#9e9e9e' }} /></IconButton></Tooltip>
          </Box>
        </Box>
      ))}
      <Pagination label={`1 - ${rows.length} of ${total}`} />
    </Panel>
  )
}

// ---------- static dummy data ----------
const AI_BULLETS = [
  'Recent trends indicate a notable rise in articles discussing accountability, with a 30% increase in coverage related to regulatory frameworks and environmental sustainability.',
  'Key topics include AI advancements, corporate transparency, and social responsibility.',
  'The overall sentiment remains positive, with 75% of articles reflecting an optimistic view on innovation.',
  'Currently, 12 journalists are actively contributing to this discourse, while 5 have not published any articles in the last month, indicating a potential gap in coverage that could be addressed.',
]

const CLUSTERS = [
  { t: 'Corporate AI and Environmental Responsibility: Discussions about how companies use AI to reduce emissions, optimize energy consumption, and improve sustainability initiatives.', m: 123 },
  { t: 'Greenwashing and ESG Accountability: Coverage questioning whether corporate sustainability commitments are backed by measurable actions and transparent reporting.', m: 100 },
  { t: 'Ethical Technology and Responsible Innovation: Conversations about AI ethics, data privacy, responsible product development, and governance in emerging technologies.', m: 92 },
  { t: 'Circular Economy and Sustainable Operations: Articles focused on waste reduction, recycling programs, sustainable supply chains, and circular business models.', m: 45 },
  { t: 'Climate Regulations and Corporate Compliance: News covering new environmental regulations, ESG reporting requirements, carbon disclosure, and corporate adaptation strategies.', m: 45 },
  { t: 'Clean Energy Investment and Digital Transformation: Discussions around renewable energy adoption, smart infrastructure, electrification, and technology enabling the energy transition.', m: 45 },
  { t: 'Employee Activism and Corporate Social Impact: Coverage highlighting workforce expectations, ethical leadership, diversity initiatives, and employee-driven sustainability efforts.', m: 45 },
]

const ROLES = [
  { label: 'Senior Reporter', pct: 35.8, count: '1.9k' }, { label: 'Editor', pct: 25.5, count: '1.4k' },
  { label: 'Columnist', pct: 20.3, count: '1.1k' }, { label: 'Staff Writer', pct: 20.1, count: '1k' },
  { label: 'Industry Analyst', pct: 20.3, count: '1.1k' }, { label: 'Producer', pct: 20.1, count: '1k' },
  { label: 'Manager', pct: 35.8, count: '1.9k' }, { label: 'Freelancer', pct: 25.5, count: '1.4k' },
  { label: 'Journalist', pct: 20.3, count: '1.1k' }, { label: 'Correspondent', pct: 20.1, count: '1k' },
]

const BEATS = [
  { label: 'Entertainment', pct: 35.8 }, { label: 'Movies', pct: 25.5 }, { label: 'Politics', pct: 20.3 },
  { label: 'Travel', pct: 20.1 }, { label: 'Health', pct: 20.3 }, { label: 'Automobile', pct: 20.1 },
  { label: 'Motivation', pct: 35.8 }, { label: 'Fashion', pct: 25.5 }, { label: 'Basketball', pct: 20.3 },
  { label: 'Fitness', pct: 20.1 },
]

const mkSentiment = (names) => names.map((name, i) => ({
  name,
  positive: [30, 15, 20, 22, 12][i % 5],
  neutral: [12, 30, 20, 10, 8][i % 5],
  notRated: [10, 8, 10, 8, 6][i % 5],
  negative: [5, 5, 8, 15, 28][i % 5],
}))

export default function ContactsInsights({ contacts }) {
  const journalists = useMemo(() => contacts.map(c => ({
    name: c.name, sub: `${c.title} · ${c.outlet}`, initials: c.name.split(' ').map(n => n[0]).join('').slice(0, 2), color: c.color,
    reach: ((c.id * 137) % 130 + 6) * 1000, articles: (c.id * 7) % 20 + 3,
  })).sort((a, b) => b.reach - a.reach), [contacts])

  const newsdesks = useMemo(() => {
    const map = {}
    contacts.forEach(c => {
      const reach = ((c.id * 137) % 130 + 6) * 1000
      if (!map[c.outlet]) map[c.outlet] = { name: c.outlet, reach: 0, articles: 0 }
      map[c.outlet].reach += reach
      map[c.outlet].articles += (c.id * 7) % 20 + 3
    })
    return Object.values(map).map(o => ({
      ...o, sub: `US | ${o.name.toLowerCase().replace(/[^a-z]/g, '')}.com`,
      initials: o.name.split(' ').map(n => n[0]).join('').slice(0, 2), color: DONUT[o.name.length % DONUT.length],
    })).sort((a, b) => b.reach - a.reach)
  }, [contacts])

  const sentJournalists = mkSentiment(journalists.slice(0, 5).map(j => j.name.split(' ')[0] + ' ' + (j.name.split(' ')[1] || '')))
  const sentOutlets = mkSentiment(newsdesks.slice(0, 5).map(o => o.name))

  const [drill, setDrill] = useState(null) // { label, type } | null

  return (
    <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Title + date */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography sx={{ fontSize: 18, fontWeight: 700, color: '#212121' }}>Who are Your Contacts and What Do They Cover?</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, border: '1px solid #e0e0e0', borderRadius: 1, px: 1.5, py: 0.75, cursor: 'pointer', bgcolor: 'background.paper' }}>
          <CalendarTodayOutlinedIcon sx={{ fontSize: 16, color: '#616161' }} />
          <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: '#424242' }}>Last 90 days</Typography>
          <ArrowDropDownIcon sx={{ fontSize: 18, color: '#616161' }} />
        </Box>
      </Box>

      {/* AI Insights */}
      <Box sx={{ p: '1.5px', borderRadius: 2, background: 'linear-gradient(135deg, #9C4DD6 0%, #CF2D8A 40%, #1D9F9F 100%)' }}>
        <Box sx={{ bgcolor: 'background.paper', borderRadius: '7px', p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1 }}>
            <AutoAwesomeIcon sx={{ fontSize: 16, color: '#9C4DD6' }} />
            <Typography sx={{ fontSize: 13, fontWeight: 700, background: 'linear-gradient(90deg, #9C4DD6 0%, #CF2D8A 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI Insights</Typography>
          </Box>
          <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#212121', mb: 1 }}>This list is increasingly focusing on the intersection of technology and ethics in their reporting</Typography>
          <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
            {AI_BULLETS.map((b, i) => <Typography key={i} component="li" sx={{ fontSize: 13.5, lineHeight: 1.5, color: '#424242', mb: 0.5 }}>{b}</Typography>)}
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5, mt: 1 }}>
            <IconButton size="small"><ThumbUpOffAltIcon sx={{ fontSize: 17, color: '#9e9e9e' }} /></IconButton>
            <IconButton size="small"><ThumbDownOffAltIcon sx={{ fontSize: 17, color: '#9e9e9e' }} /></IconButton>
            <IconButton size="small"><ContentCopyIcon sx={{ fontSize: 17, color: '#9e9e9e' }} /></IconButton>
            <IconButton size="small"><CachedIcon sx={{ fontSize: 17, color: '#9e9e9e' }} /></IconButton>
          </Box>
        </Box>
      </Box>

      {/* KPI cards */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <KpiCard label="Published Articles" value="30" delta="18%" up prev="25" spark={[6, 9, 7, 11, 8, 13, 10, 12, 9, 14, 11, 15, 12, 16, 13]}
          onOpen={(day) => setDrill({ label: day, type: 'Published Articles', kind: 'group', tab: 'mentions' })} />
        <KpiCard label="Reach" value="12k" delta="18%" up prev="10k" spark={[8, 10, 9, 12, 11, 9, 13, 12, 14, 11, 15, 13, 16, 14, 17]}
          onOpen={(day) => setDrill({ label: day, type: 'Reach', kind: 'group', tab: 'mentions' })} />
        <KpiCard label="Total Echo" value="5k" delta="3%" up={false} prev="4.5k" spark={[14, 11, 13, 9, 12, 8, 11, 7, 10, 9, 8, 10, 7, 9, 6]}
          onOpen={(day) => setDrill({ label: day, type: 'Total Echo', kind: 'group', tab: 'mentions' })} />
      </Box>

      {/* Reach tables */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <ReachTable title="Journalists by Reach" rows={journalists.slice(0, 6)} total={journalists.length}
          onRow={(r) => setDrill({ label: r.name, type: 'Journalist by Reach', kind: 'person', tab: 'mentions' })}
          onProfile={(r) => setDrill({ label: r.name, type: 'Journalist by Reach', kind: 'profile' })} />
        <ReachTable title="Newsdesks by Reach" rows={newsdesks.slice(0, 6)} total={newsdesks.length} isOutlet
          onRow={(r) => setDrill({ label: r.name, type: 'Newsdesk by Reach', kind: 'person', tab: 'mentions' })}
          onProfile={(r) => setDrill({ label: r.name, type: 'Newsdesk by Reach', kind: 'profile' })} />
      </Box>

      {/* Clusters */}
      <Panel title="AI-Powered Clusters" info>
        <Box sx={{ display: 'grid', gridTemplateColumns: '28px 1fr 80px', px: 0.5, pb: 0.75, borderBottom: '1px solid #eee' }}>
          <Typography sx={{ fontSize: 12, color: '#9e9e9e' }}>Clusters</Typography>
          <Box />
          <Typography sx={{ fontSize: 12, color: '#9e9e9e', textAlign: 'right' }}>Mentions</Typography>
        </Box>
        {CLUSTERS.map((c, i) => (
          <Box key={i} onClick={() => setDrill({ label: c.t.split(':')[0], type: 'Cluster' })}
            sx={{ display: 'grid', gridTemplateColumns: '28px 1fr 80px', alignItems: 'center', px: 0.5, py: 1.25, borderBottom: '1px solid #f5f5f5', cursor: 'pointer', borderRadius: 1, '&:hover': { bgcolor: alpha('#000', 0.03) } }}>
            <Typography sx={{ fontSize: 12.5, color: '#9e9e9e' }}>{i + 1}</Typography>
            <Typography sx={{ fontSize: 13, color: '#424242', pr: 2, lineHeight: 1.4 }}>{c.t}</Typography>
            <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: '#212121', textAlign: 'right' }}>{c.m}</Typography>
          </Box>
        ))}
        <Pagination label="1 - 7 of 10" />
      </Panel>

      {/* Donuts */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <DonutPanel title="Top Journalists Roles" items={ROLES}
          onItemClick={(label) => setDrill({ label, type: 'Occupation' })} />
        <DonutPanel title="Top Journalists and Newsdesks Beats"
          action={<IconButton size="small"><AutoFixHighIcon sx={{ fontSize: 18, color: '#9C4DD6' }} /></IconButton>}
          items={BEATS}
          onItemClick={(label) => setDrill({ label, type: 'Beat' })} />
      </Box>

      {/* Sentiment */}
      <Box sx={{ display: 'flex', gap: 2, pb: 1 }}>
        <SentimentChart title="Sentiment by Journalist" rows={sentJournalists} total={journalists.length}
          onBarClick={(name) => setDrill({ label: name, type: 'Sentiment by Journalist', kind: 'person', tab: 'mentions' })}
          onNameClick={(name) => setDrill({ label: name, type: 'Sentiment by Journalist', kind: 'profile' })} />
        <SentimentChart title="Sentiment by Newsdesks" rows={sentOutlets} total={newsdesks.length}
          onBarClick={(name) => setDrill({ label: name, type: 'Sentiment by Newsdesk', kind: 'person', tab: 'mentions' })}
          onNameClick={(name) => setDrill({ label: name, type: 'Sentiment by Newsdesk', kind: 'profile' })} />
      </Box>

      <DrillDownPanel open={!!drill} onClose={() => setDrill(null)} viewing={drill} />
    </Box>
  )
}
