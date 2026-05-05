import { Box, Typography, Chip, IconButton } from '@mui/material'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt'
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import WidgetCard, { HBar } from './WidgetCard'

// ── mock data ─────────────────────────────────────────────────────────────────

const CLUSTERS = [
  { label: 'Success of South Carolina Seven 2023 far exceeding all expectations', mentions: '1.5k' },
  { label: 'Doctors say more cases like these are coming to light as the popularity of these drugs soared. The drugs work by mimicking a hormone that\'s naturally made by the body, GLP-1.', mentions: '1.5k' },
  { label: 'Doctors created a primary care clinic as their former hospital struggled', mentions: '1.5k' },
  { label: 'First look at Nyck Harbor, South Carolina football freshmen in their Gamecock jerseys', mentions: '1.5k' },
  { label: "Elon Musk slammed for pushing anti-vax conspiracy in response to LeBron James' son Bronny suffering cardiac arrest", mentions: '1.5k' },
  { label: "Allison Seymour, a prominent journalist and TV personality, has become a well-respected figure in the world of journalism. Here's everything you need to know about Mac's prime.", mentions: '1.5k' },
  { label: 'Familiar, notable names seek to be appointed judges in SC, including chief justice candidate', mentions: '1.5k' },
]

const TOP_TOPICS = [
  { rank: 1, name: 'Interior Design',  mentions: '134k', trend: 0,    isNew: false },
  { rank: 2, name: 'Office Furniture', mentions: '134k', trend: 18,   isNew: false },
  { rank: 3, name: 'Furniture',        mentions: '134k', trend: null, isNew: true  },
  { rank: 4, name: 'Office Chair',     mentions: '134k', trend: 222,  isNew: false },
  { rank: 5, name: 'Ergonomics',       mentions: '134k', trend: -40,  isNew: false },
  { rank: 6, name: 'Workstation',      mentions: '134k', trend: 33,   isNew: false },
  { rank: 7, name: 'Home Office',      mentions: '134k', trend: 24,   isNew: false },
]

const KEYWORDS = [
  { text: 'Boston Red Sox',                     type: 'org',     size: 14 },
  { text: 'Richland County',                    type: 'keyword', size: 16 },
  { text: 'patients',                           type: 'keyword', size: 12 },
  { text: 'IKEA',                               type: 'org',     size: 13 },
  { text: 'Answer Engine',                      type: 'keyword', size: 14 },
  { text: 'MLB fans',                           type: 'org',     size: 12 },
  { text: '#policeprosecukin...',               type: 'hashtag', size: 12 },
  { text: 'LLMs',                               type: 'keyword', size: 15 },
  { text: 'Real Estate Agence',                 type: 'keyword', size: 13 },
  { text: 'coaching to ensure',                 type: 'keyword', size: 12 },
  { text: 'Facebook',                           type: 'org',     size: 13 },
  { text: 'GPT-4',                              type: 'keyword', size: 14 },
  { text: 'Clemson University',                 type: 'org',     size: 14 },
  { text: 'Oscar Fernandez',                    type: 'people',  size: 13 },
  { text: 'University of South Carolina',       type: 'org',     size: 20 },
  { text: 'United States',                      type: 'keyword', size: 14 },
  { text: 'Dallas',                             type: 'keyword', size: 12 },
  { text: 'Don White',                          type: 'people',  size: 13 },
  { text: 'Colombia',                           type: 'keyword', size: 12 },
  { text: 'Brian Shield',                       type: 'people',  size: 12 },
  { text: 'Leon Loft',                          type: 'people',  size: 12 },
  { text: '#entirecounty',                      type: 'hashtag', size: 13 },
  { text: 'technology',                         type: 'keyword', size: 18 },
  { text: 'public safety activities',           type: 'keyword', size: 13 },
  { text: 'Anthony Tassone',                    type: 'people',  size: 13 },
  { text: 'Dr. Ian Adams',                      type: 'people',  size: 13 },
  { text: "Richland County Sheriff's Department", type: 'org',   size: 12 },
  { text: 'South Carolina',                     type: 'keyword', size: 16 },
]

const TYPE_COLORS = {
  keyword: '#CF2D8A',
  hashtag: '#FF9800',
  org:     '#1565C0',
  people:  '#3F51B5',
}

const EMERGING_KW = [
  { text: 'Living rooms', size: 18 }, { text: 'Backyards', size: 16 },
  { text: 'Rug', size: 13 }, { text: 'Natural landscapes', size: 20 },
  { text: 'Real Estate Ma...', size: 12 }, { text: 'Nationwide Advisory...', size: 12 },
  { text: 'Furniture', size: 15 }, { text: 'Tables', size: 14 }, { text: 'Desks', size: 14 },
  { text: 'Trees and leaves', size: 13 }, { text: 'Lago', size: 12 }, { text: 'Knoll', size: 12 },
  { text: 'Logitech', size: 12 }, { text: 'aesthetic contrast', size: 13 },
  { text: 'PR Newswire', size: 12 }, { text: 'FitzFelt', size: 12 },
  { text: 'Hansem', size: 12 }, { text: 'Joshua Slack', size: 12 },
  { text: 'value', size: 14 }, { text: 'Chairs', size: 17 }, { text: 'Interiors', size: 13 },
  { text: 'Nature', size: 13 }, { text: 'Home Interiors', size: 22 },
  { text: 'Office spaces', size: 14 }, { text: 'Game rooms', size: 16 },
  { text: 'Woven Baskets', size: 13 }, { text: 'Books stacking', size: 12 },
  { text: 'The Verge', size: 12 }, { text: 'Amazon Ebay', size: 12 },
  { text: 'Leather goods', size: 12 }, { text: 'Computers', size: 16 },
  { text: 'Microsoft', size: 15 }, { text: 'entire line', size: 12 },
  { text: 'Figma', size: 12 }, { text: 'Lego', size: 12 },
]

const EMERGING_HT = [
  { text: '#Livingroom', size: 14 }, { text: '#Backyards', size: 18 },
  { text: '#Trees and leaves', size: 14 }, { text: '#Backyards', size: 16 },
  { text: '#MindHome', size: 12 }, { text: '#Real Estate Ma...', size: 12 },
  { text: '#BackYards', size: 13 }, { text: '#Furniture', size: 14 },
  { text: '#Desks', size: 20 }, { text: '#Trees and lawn', size: 13 },
  { text: '#Rugs', size: 13 }, { text: '#Real Estate Ma...', size: 12 },
  { text: '#Home Interiors', size: 22 }, { text: '#Natural landscapes', size: 13 },
  { text: '#Nature', size: 14 }, { text: '#Interiors', size: 13 },
  { text: '#Desks', size: 16 }, { text: '#Computers', size: 18 },
  { text: '#Gaming', size: 17 }, { text: '#Woven Baskets', size: 13 },
  { text: '#FitzFelt', size: 12 }, { text: '#Real Estate Ma...', size: 12 },
  { text: '#Lego', size: 12 }, { text: '#Wood finishes', size: 14 },
  { text: '#Office Sp...', size: 14 }, { text: '#Natural landscapes', size: 14 },
  { text: '#Computers', size: 20 }, { text: '#Microsoft', size: 16 },
  { text: '#entire line', size: 12 }, { text: '#value', size: 13 },
]

const SCENES = [
  { label: 'teslaradar',      value: 903 },
  { label: 'model3',          value: 823 },
  { label: 'bestinclass',     value: 522 },
  { label: 'forsafercards',   value: 467 },
  { label: 'teslamodels',     value: 333 },
  { label: 'electricar',      value: 288 },
  { label: 'elonmusk',        value: 153 },
  { label: 'executivecar',    value: 102 },
  { label: 'electricvehicles', value: 67 },
  { label: '#ev',             value: 58  },
]

// ── sunburst chart ────────────────────────────────────────────────────────────

const SUNBURST_INNER = [
  { label: 'Sports New...', pct: 14, color: '#2196F3' },
  { label: 'Computer...', pct: 12, color: '#1D9F9F' },
  { label: 'Tech', pct: 11, color: '#9C4DD6' },
  { label: 'Health', pct: 10, color: '#CF2D8A' },
  { label: 'Med...', pct: 8, color: '#F44336' },
  { label: 'Law', pct: 7, color: '#FF5722' },
  { label: 'Politics', pct: 9, color: '#FF9800' },
  { label: 'Soft...', pct: 7, color: '#FFC107' },
  { label: 'Jobs &...', pct: 6, color: '#8BC34A' },
  { label: 'Education', pct: 5, color: '#4CAF50' },
  { label: 'Colleges And...', pct: 4, color: '#00BCD4' },
  { label: 'Crim...', pct: 4, color: '#E91E63' },
  { label: 'Publ...', pct: 3, color: '#795548' },
]

function sunburstSlice(cx, cy, r1, r2, startDeg, endDeg) {
  const toRad = d => (d * Math.PI) / 180
  const s = toRad(startDeg), e = toRad(endDeg)
  const large = endDeg - startDeg > 180 ? 1 : 0
  const x1 = cx + r1 * Math.cos(s), y1 = cy + r1 * Math.sin(s)
  const x2 = cx + r2 * Math.cos(s), y2 = cy + r2 * Math.sin(s)
  const x3 = cx + r2 * Math.cos(e), y3 = cy + r2 * Math.sin(e)
  const x4 = cx + r1 * Math.cos(e), y4 = cy + r1 * Math.sin(e)
  return `M ${x2} ${y2} A ${r2} ${r2} 0 ${large} 1 ${x3} ${y3} L ${x4} ${y4} A ${r1} ${r1} 0 ${large} 0 ${x1} ${y1} Z`
}

function SunburstChart() {
  const size = 300, cx = 150, cy = 150
  const outerR = 130, midR = 85, innerR = 42

  let angle = -90
  const innerSlices = SUNBURST_INNER.map(seg => {
    const sweep = (seg.pct / 100) * 360
    const start = angle, end = angle + sweep
    const mid = ((start + end) / 2 * Math.PI) / 180
    const labelR = outerR + 16
    angle = end
    return { ...seg, start, end, mid, labelR }
  })

  const outerSlices = innerSlices.map(seg => {
    const subSweep = (seg.pct / 100) * 360
    const sub1 = seg.start, sub2 = seg.start + subSweep * 0.45, sub3 = seg.end
    return [
      { start: sub1, end: sub2, color: seg.color, opacity: 0.75 },
      { start: sub2, end: sub3, color: seg.color, opacity: 0.45 },
    ]
  }).flat()

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <svg width={size} height={size} style={{ overflow: 'visible' }}>
        {/* Outer ring (sub-categories) */}
        {outerSlices.map((s, i) => (
          <path key={`o${i}`} d={sunburstSlice(cx, cy, midR, outerR, s.start, s.end)}
            fill={s.color} fillOpacity={s.opacity} stroke="white" strokeWidth="1" />
        ))}
        {/* Inner ring (main categories) */}
        {innerSlices.map((s, i) => (
          <path key={`i${i}`} d={sunburstSlice(cx, cy, innerR, midR, s.start, s.end)}
            fill={s.color} stroke="white" strokeWidth="1.5" />
        ))}
        {/* Center */}
        <circle cx={cx} cy={cy} r={innerR} fill="white" />
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize="11" fill="#212121" fontWeight="600">Topics</text>
        {/* Labels on outer edge */}
        {innerSlices.filter((_, i) => i % 2 === 0).map((s, i) => {
          const lx = cx + (outerR + 22) * Math.cos(s.mid)
          const ly = cy + (outerR + 22) * Math.sin(s.mid)
          const anchor = Math.cos(s.mid) > 0 ? 'start' : 'end'
          return (
            <text key={`l${i}`} x={lx} y={ly} textAnchor={anchor} fontSize="9" fill="#424242">
              {s.label}
            </text>
          )
        })}
      </svg>
    </Box>
  )
}

// ── cluster icon ──────────────────────────────────────────────────────────────

function ClusterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" style={{ flexShrink: 0, marginTop: 2 }}>
      <circle cx="8" cy="8" r="2.5" fill="#9C4DD6" />
      <circle cx="3" cy="4" r="1.5" fill="#9C4DD6" opacity="0.6" />
      <circle cx="13" cy="4" r="1.5" fill="#9C4DD6" opacity="0.6" />
      <circle cx="3" cy="12" r="1.5" fill="#9C4DD6" opacity="0.6" />
      <circle cx="13" cy="12" r="1.5" fill="#9C4DD6" opacity="0.6" />
      <line x1="8" y1="8" x2="3" y2="4" stroke="#9C4DD6" strokeWidth="1" opacity="0.5" />
      <line x1="8" y1="8" x2="13" y2="4" stroke="#9C4DD6" strokeWidth="1" opacity="0.5" />
      <line x1="8" y1="8" x2="3" y2="12" stroke="#9C4DD6" strokeWidth="1" opacity="0.5" />
      <line x1="8" y1="8" x2="13" y2="12" stroke="#9C4DD6" strokeWidth="1" opacity="0.5" />
    </svg>
  )
}

// ── topic icon ────────────────────────────────────────────────────────────────

function TopicIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" style={{ flexShrink: 0 }}>
      {[0,1,2,3].map(r => [0,1,2,3].map(c => (
        <rect key={`${r}${c}`} x={c * 4 + 0.5} y={r * 4 + 0.5} width="3" height="3" rx="0.5"
          fill="#9E9E9E" opacity={r === 1 && c === 1 ? 1 : 0.4} />
      )))}
    </svg>
  )
}

// ── pagination ────────────────────────────────────────────────────────────────

function Pagination({ text }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 1.5, pt: 1, borderTop: '1px solid #f5f5f5' }}>
      <Typography sx={{ fontSize: 13, color: '#bdbdbd', cursor: 'pointer', userSelect: 'none' }}>{'<'}</Typography>
      <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>{text}</Typography>
      <Typography sx={{ fontSize: 13, color: '#1D9F9F', cursor: 'pointer', userSelect: 'none' }}>{'>'}</Typography>
    </Box>
  )
}

// ── main export ───────────────────────────────────────────────────────────────

export default function NarrativeTabContent({ loading }) {
  if (loading) return null
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
          <Typography sx={{ fontSize: 15, fontWeight: 700, lineHeight: '22px', color: '#212121', mb: 1 }}>
            Digital health and healthcare innovation
          </Typography>
          <Typography sx={{ fontSize: 14, lineHeight: '22px', color: '#212121', mb: 1.5 }}>
            The posts discuss various topics related to digital health and healthcare innovation, such as digital health standards, rural healthcare challenges, AI in healthcare, patient engagement, and remote pharmacy services. There is a focus on partnerships and collaborations in the healthcare industry, with mentions of collaborations in mental healthcare, AI-driven vocal biomarker technology, and healthcare startups.
          </Typography>
          <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#1D9F9F', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
            View More Insights
          </Typography>
        </Box>
      </Box>

      {/* AI-Powered Clusters */}
      <WidgetCard
        title="AI-Powered Clusters"
        action={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, border: '1px solid #e0e0e0', borderRadius: 0.5, px: 1, py: 0.25, cursor: 'pointer' }}>
            <Typography sx={{ fontSize: 12, color: '#424242' }}>Table</Typography>
            <ArrowDropDownIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          </Box>
        }
      >
        <Box sx={{ display: 'flex', pb: 0.75, borderBottom: '1px solid #e0e0e0', mb: 0.5 }}>
          <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary', flex: 1 }}>Clusters</Typography>
          <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary' }}>Mentions</Typography>
        </Box>
        {CLUSTERS.map((c, i) => (
          <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, py: 0.875, borderBottom: i < CLUSTERS.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
            <ClusterIcon />
            <Typography sx={{ fontSize: 13, flex: 1, color: '#424242', lineHeight: 1.4 }}>{c.label}</Typography>
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#212121', flexShrink: 0, ml: 1 }}>{c.mentions}</Typography>
          </Box>
        ))}
        <Pagination text="1 - 7 of 30 Clusters" />
      </WidgetCard>

      {/* Topic Analysis */}
      <WidgetCard title="Topic Analysis">
        <SunburstChart />
      </WidgetCard>

      {/* Top Topics */}
      <WidgetCard title="Top Topics">
        <Box sx={{ display: 'flex', pb: 0.75, borderBottom: '1px solid #e0e0e0', mb: 0.25 }}>
          <Box sx={{ width: 28 }} />
          <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary', flex: 1 }}>Topics</Typography>
          <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary', width: 56, textAlign: 'right' }}>Mentions</Typography>
          <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary', width: 72, textAlign: 'right' }}>Trend</Typography>
          <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary', width: 72, textAlign: 'right' }}>Sentiment</Typography>
        </Box>
        {TOP_TOPICS.map((t) => (
          <Box key={t.rank} sx={{ display: 'flex', alignItems: 'center', py: 0.875, borderBottom: '1px solid #f5f5f5' }}>
            <Typography sx={{ fontSize: 13, color: 'text.secondary', width: 16, mr: 0.5 }}>{t.rank}</Typography>
            <Box sx={{ mr: 0.75 }}><TopicIcon /></Box>
            <Typography sx={{ fontSize: 13, flex: 1, color: '#424242' }}>{t.name}</Typography>
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#212121', width: 56, textAlign: 'right' }}>{t.mentions}</Typography>
            <Box sx={{ width: 72, display: 'flex', justifyContent: 'flex-end' }}>
              {t.isNew ? (
                <Chip size="small" label="New"
                  sx={{ height: 20, fontSize: 11, bgcolor: '#FFF3E0', color: '#E65100', fontWeight: 700 }} />
              ) : t.trend === 0 ? (
                <Chip size="small" label="↑ 0%"
                  sx={{ height: 20, fontSize: 11, bgcolor: '#F5F5F5', color: '#757575', fontWeight: 700 }} />
              ) : (
                <Chip size="small"
                  label={`${t.trend > 0 ? '↑' : '↓'} ${Math.abs(t.trend)}%`}
                  sx={{ height: 20, fontSize: 11, bgcolor: t.trend > 0 ? '#E8F5E9' : '#FFEBEE', color: t.trend > 0 ? '#2E7D32' : '#C62828', fontWeight: 700 }} />
              )}
            </Box>
            <Box sx={{ width: 72, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#4CAF50', flexShrink: 0 }} />
              <Typography sx={{ fontSize: 12, color: '#424242' }}>Positive</Typography>
            </Box>
          </Box>
        ))}
        <Pagination text="1 - 10 of 30 Topics" />
      </WidgetCard>

      {/* Top Keywords and Entities */}
      <WidgetCard title="Top Keywords and Entities">
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 1.25 }}>
          {[
            { label: 'Keyword',      color: TYPE_COLORS.keyword },
            { label: 'Hashtag',      color: TYPE_COLORS.hashtag },
            { label: 'Organization', color: TYPE_COLORS.org     },
            { label: 'People',       color: TYPE_COLORS.people  },
          ].map(f => (
            <Box key={f.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: f.color }} />
              <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{f.label}</Typography>
            </Box>
          ))}
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, lineHeight: 2 }}>
          {KEYWORDS.map((kw, i) => (
            <Typography key={i} sx={{ fontSize: kw.size, fontWeight: kw.size >= 16 ? 700 : 400, color: TYPE_COLORS[kw.type], cursor: 'pointer', '&:hover': { opacity: 0.75 } }}>
              {kw.text}
            </Typography>
          ))}
        </Box>
      </WidgetCard>

      {/* Emerging Keywords + Emerging Hashtags */}
      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
        <WidgetCard title="Emerging Keywords">
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, lineHeight: 2 }}>
            {EMERGING_KW.map((kw, i) => (
              <Typography key={i} sx={{ fontSize: kw.size, color: ['#1D9F9F', '#2196F3', '#9C4DD6', '#CF2D8A'][i % 4], cursor: 'pointer', fontWeight: kw.size >= 18 ? 700 : 400 }}>
                {kw.text}
              </Typography>
            ))}
          </Box>
        </WidgetCard>
        <WidgetCard title="Emerging Hashtags">
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, lineHeight: 2 }}>
            {EMERGING_HT.map((ht, i) => (
              <Typography key={i} sx={{ fontSize: ht.size, fontWeight: ht.size >= 18 ? 700 : 400, color: ['#CF2D8A', '#FF9800', '#9C4DD6', '#1D9F9F'][i % 4], cursor: 'pointer' }}>
                {ht.text}
              </Typography>
            ))}
          </Box>
        </WidgetCard>
      </Box>

      {/* Top Scenes and Objects */}
      <WidgetCard title="Top Scenes and Objects">
        {SCENES.map((s, i) => <HBar key={i} label={s.label} value={s.value} max={903} color="#1D9F9F" />)}
        <Pagination text="1 - 10 of 30" />
      </WidgetCard>

    </Box>
  )
}
