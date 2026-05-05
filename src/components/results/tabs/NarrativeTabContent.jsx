import { Box, Typography, Chip } from '@mui/material'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import WidgetCard, { SegmentNav, HBar } from './WidgetCard'

const SECTIONS = [
  { id: 'nar-topics', label: 'Topic Analysis' },
  { id: 'nar-keywords', label: 'Keywords' },
]

const CLUSTERS = [
  { label: 'Business & Packaging — Discussing containers and business impacts, the press actively discusses and evaluates their economic outcomes and industry consequences.', mentions: '1.5k' },
  { label: 'Doctors can more appear like these are coming to light on the popularity of these drugs noted. The things work by minimizing...', mentions: '1.5k' },
  { label: 'Doctors assailed a primary care clinic as their former hospital struggled.', mentions: '1.5k' },
  { label: 'First look at Pepsi Harbor, South Carolina football freshmen in their Gatorade-soaked jerseys.', mentions: '1.5k' },
  { label: "Ron Pepsi appeared for pushing anti-vax conspiracy in response to LeBron James' son Bronny suffering cardiac arrest.", mentions: '1.5k' },
  { label: "Allison Seymour, a prominent journalist and TV personality, has become a well-respected figure in the world of journalism. Here's everything you need to know about Mac's prime.", mentions: '1.5k' },
  { label: 'Positive: valuable stories seem to be appointed judges in DC, including chief justice candidate.', mentions: '1.5k' },
]

const TOP_TOPICS = [
  { rank: 1, name: 'Interior Design', mentions: '150k', trend: 12, sentiment: 'Positive' },
  { rank: 2, name: 'Office Furniture', mentions: '134k', trend: 18, sentiment: 'Positive' },
  { rank: 3, name: 'Furniture', mentions: '104k', trend: null, sentiment: 'Positive' },
  { rank: 4, name: 'Office Chair', mentions: '134k', trend: -20, sentiment: 'Positive' },
  { rank: 5, name: 'Ergonomics', mentions: '123k', trend: -30, sentiment: 'Positive' },
  { rank: 6, name: 'Workstation', mentions: '155k', trend: 38, sentiment: 'Positive' },
  { rank: 7, name: 'Home Office', mentions: '134k', trend: 34, sentiment: 'Positive' },
]

const KEYWORDS = ['Boston Red Sox', 'Richland County', 'parents', 'MFA', 'Klazart Engine', 'HUB Tan', 'Real Estate Agency', 'GPT-4', 'Clemson University', 'technology', 'Facebook', 'Lane Lin', 'public school activities', 'Anthony Symons', 'St. Al Adpha', "Richland County Sheriff's Department", 'South Carolina', 'LLMs', 'University of South Carolina']

const EMERGING_KW = ['Living rooms', 'Backyards', 'Rug', 'Natural landscapes', 'Real Estate Mb...', 'Nationwide Advisory', 'Furniture', 'Tables', 'Desks', 'Trees and lawn', 'Lago', 'Knut', 'Logitech', 'aesthetic contrast', 'PR Newswire', 'Fake Furniture', 'Office spaces', 'Game rooms', 'Woven Baskets', 'Books stacking', 'The Verge', 'Amazon Ebay', 'Leather goods', 'Computers', 'Microsoft']
const EMERGING_HT = ['#Livingroom', '#Backyards', '#Trees and leaves', '#Backyards', '#MindHome', '#Real Estate Mb...', '#BackYards', '#Furniture', '#Desks', '#Times and lawn', '#Rugs', '#Real Estate Mb...', '#Home Interiors', '#Times and lawn', '#Lago', '#Rugs', '#Desks', '#Computers', '#Home Interiors', '#Gaming', '#Computers', '#Office Sp...', '#Natural landscapes', '#Wood finishes', '#Computers', '#Microsoft']

const SCENES = [
  { label: 'television', value: 860 }, { label: 'outdoor', value: 720 }, { label: 'bathroom', value: 630 },
  { label: 'kitchen/pantry', value: 580 }, { label: 'electronics', value: 470 }, { label: 'home office', value: 380 },
  { label: 'bedroom', value: 290 }, { label: 'deco', value: 210 },
]

const DONUT_SEGMENTS = [
  { label: 'Interior Design', pct: 28, color: '#1D9F9F' },
  { label: 'Office Furniture', pct: 22, color: '#9C4DD6' },
  { label: 'Furniture', pct: 18, color: '#CF2D8A' },
  { label: 'Office Chair', pct: 12, color: '#FF9800' },
  { label: 'Ergonomics', pct: 10, color: '#2196F3' },
  { label: 'Other', pct: 10, color: '#E0E0E0' },
]

function DonutChart({ segments, size = 140 }) {
  const cx = size / 2, cy = size / 2, r = size * 0.38, ir = size * 0.22
  let cumAngle = -90
  const paths = segments.map((seg) => {
    const startAngle = (cumAngle * Math.PI) / 180
    const sweep = (seg.pct / 100) * 360
    cumAngle += sweep
    const endAngle = (cumAngle * Math.PI) / 180
    const x1 = cx + r * Math.cos(startAngle), y1 = cy + r * Math.sin(startAngle)
    const x2 = cx + r * Math.cos(endAngle), y2 = cy + r * Math.sin(endAngle)
    const ix1 = cx + ir * Math.cos(startAngle), iy1 = cy + ir * Math.sin(startAngle)
    const ix2 = cx + ir * Math.cos(endAngle), iy2 = cy + ir * Math.sin(endAngle)
    const large = sweep > 180 ? 1 : 0
    return { path: `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${ir} ${ir} 0 ${large} 0 ${ix1} ${iy1} Z`, color: seg.color, label: seg.label, pct: seg.pct }
  })
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <svg width={size} height={size} style={{ flexShrink: 0 }}>
        {paths.map((p, i) => <path key={i} d={p.path} fill={p.color} stroke="white" strokeWidth="1.5" />)}
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize="12" fill="#212121" fontWeight="600">Topics</text>
      </svg>
      <Box sx={{ flex: 1 }}>
        {segments.map((s, i) => (
          <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: s.color, flexShrink: 0 }} />
            <Typography sx={{ fontSize: 12, flex: 1, color: '#424242' }}>{s.label}</Typography>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#212121' }}>{s.pct}%</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default function NarrativeTabContent({ loading }) {
  if (loading) return null
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>

      <SegmentNav items={SECTIONS} />

      <Box id="nar-topics" sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <WidgetCard title="AI-Powered Clusters">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
          <AutoAwesomeIcon sx={{ fontSize: 14, color: '#9C4DD6' }} />
          <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#9C4DD6' }}>AI-Powered</Typography>
        </Box>
        <Box sx={{ display: 'flex', mb: 0.5, px: 0.5 }}>
          <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary', flex: 1 }}>Cluster</Typography>
          <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary' }}>Mentions</Typography>
        </Box>
        {CLUSTERS.map((c, i) => (
          <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, py: 0.75, borderBottom: '1px solid #f5f5f5' }}>
            <AutoAwesomeIcon sx={{ fontSize: 14, color: '#CF2D8A', flexShrink: 0, mt: 0.25 }} />
            <Typography sx={{ fontSize: 13, flex: 1, color: '#424242', lineHeight: 1.4 }}>{c.label}</Typography>
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#212121', flexShrink: 0 }}>{c.mentions}</Typography>
          </Box>
        ))}
        <Typography sx={{ fontSize: 13, color: '#1D9F9F', cursor: 'pointer', mt: 1 }}>1 – 7 of 50 Clusters &gt;</Typography>
      </WidgetCard>

      <WidgetCard title="Topic Analysis">
        <DonutChart segments={DONUT_SEGMENTS} size={160} />
      </WidgetCard>

      <WidgetCard title="Top Topics">
        <Box sx={{ display: 'flex', mb: 0.5 }}>
          <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary', width: 24 }}>#</Typography>
          <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary', flex: 1 }}>Topics</Typography>
          <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary', width: 60, textAlign: 'right' }}>Mentions</Typography>
          <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary', width: 60, textAlign: 'right' }}>Trend</Typography>
          <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary', width: 70, textAlign: 'right' }}>Sentiment</Typography>
        </Box>
        {TOP_TOPICS.map((t) => (
          <Box key={t.rank} sx={{ display: 'flex', alignItems: 'center', py: 0.75, borderBottom: '1px solid #f5f5f5' }}>
            <Typography sx={{ fontSize: 13, color: 'text.secondary', width: 24 }}>{t.rank}</Typography>
            <Typography sx={{ fontSize: 13, flex: 1, color: '#424242' }}>{t.name}</Typography>
            <Typography sx={{ fontSize: 13, fontWeight: 700, width: 60, textAlign: 'right' }}>{t.mentions}</Typography>
            <Box sx={{ width: 60, display: 'flex', justifyContent: 'flex-end' }}>
              {t.trend !== null ? (
                <Chip size="small" label={`${t.trend > 0 ? '↑' : '↓'} ${Math.abs(t.trend)}%`}
                  sx={{ height: 20, fontSize: 11, bgcolor: t.trend > 0 ? '#E8F5E9' : '#FFEBEE', color: t.trend > 0 ? '#2E7D32' : '#C62828', fontWeight: 700 }} />
              ) : <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>New</Typography>}
            </Box>
            <Box sx={{ width: 70, display: 'flex', justifyContent: 'flex-end' }}>
              <Chip size="small" label={t.sentiment}
                sx={{ height: 20, fontSize: 11, bgcolor: '#E8F5E9', color: '#2E7D32', fontWeight: 700 }} />
            </Box>
          </Box>
        ))}
        <Typography sx={{ fontSize: 13, color: '#1D9F9F', cursor: 'pointer', mt: 1 }}>1 – 10 of 30 Topics &gt;</Typography>
      </WidgetCard>

      </Box>

      <Box id="nar-keywords" sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <WidgetCard title="Top Keywords and Entities">
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
          {['Keywords', 'Hashtag', 'Organisation', 'People'].map(f => (
            <Box key={f} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#1D9F9F' }} />
              <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{f}</Typography>
            </Box>
          ))}
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, lineHeight: 2 }}>
          {KEYWORDS.map((kw, i) => (
            <Typography key={i} sx={{ fontSize: 11 + (i % 4) * 2, fontWeight: i < 4 ? 700 : 400, color: ['#1D9F9F', '#9C4DD6', '#CF2D8A', '#2196F3', '#FF9800', '#424242'][i % 6], cursor: 'pointer' }}>{kw}</Typography>
          ))}
        </Box>
      </WidgetCard>

      <Box sx={{ display: 'flex', gap: 1.5 }}>
        <WidgetCard title="Emerging Keywords">
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, lineHeight: 2 }}>
            {EMERGING_KW.map((kw, i) => (
              <Typography key={i} sx={{ fontSize: 10 + (i % 3) * 2, color: ['#1D9F9F', '#2196F3', '#9C4DD6'][i % 3], cursor: 'pointer' }}>{kw}</Typography>
            ))}
          </Box>
        </WidgetCard>
        <WidgetCard title="Emerging Hashtags">
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, lineHeight: 2 }}>
            {EMERGING_HT.map((ht, i) => (
              <Typography key={i} sx={{ fontSize: 10 + (i % 3) * 2, fontWeight: i < 5 ? 700 : 400, color: ['#CF2D8A', '#FF9800', '#1D9F9F'][i % 3], cursor: 'pointer' }}>{ht}</Typography>
            ))}
          </Box>
        </WidgetCard>
      </Box>

      <WidgetCard title="Top Scenes and Objects">
        <Box>
          {SCENES.map((s, i) => <HBar key={i} label={s.label} value={s.value} max={860} color="#1D9F9F" />)}
        </Box>
        <Typography sx={{ fontSize: 13, color: '#1D9F9F', cursor: 'pointer', mt: 1 }}>1 – 10 of 38 &gt;</Typography>
      </WidgetCard>
      </Box>

    </Box>
  )
}
