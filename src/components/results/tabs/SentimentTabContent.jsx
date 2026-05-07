import { Box, Typography, Chip, IconButton } from '@mui/material'
import WidgetCard from './WidgetCard'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt'
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'

// ── constants ─────────────────────────────────────────────────────────────────

const POS_COLOR  = '#4CAF50'
const NEG_COLOR  = '#F44336'
const NEU_COLOR  = '#9E9E9E'
const NRAT_COLOR = '#E0E0E0'

// ── mock data ─────────────────────────────────────────────────────────────────

const DONUT_SEGMENTS = [
  { label: 'Positive',  pct: 30.0, count: '1.2k', color: POS_COLOR  },
  { label: 'Negative',  pct: 10.5, count: '414',  color: NEG_COLOR  },
  { label: 'Neutral',   pct: 59.2, count: '2.3k', color: NEU_COLOR  },
  { label: 'Not Rated', pct:  0.3, count: '10',   color: NRAT_COLOR },
]

const TREND_DATES = ['Jul 20', 'Jul 21', 'Jul 22', 'Jul 23', 'Jul 24', 'Jul 25', 'Jul 26']
const TREND_LINES = [
  { label: 'Positive',  color: POS_COLOR,  count: '1.2k', data: [10, 12, 22, 18, 12, 10, 12] },
  { label: 'Negative',  color: NEG_COLOR,  count: '414',  data: [12, 15, 18, 14, 8,  7,  8]  },
  { label: 'Neutral',   color: NEU_COLOR,  count: '2.3k', data: [18, 20, 52, 42, 28, 22, 25] },
  { label: 'Not Rated', color: NRAT_COLOR, count: '10',   data: [2,  2,  3,  2,  1,  2,  2]  },
]

const SOURCE_TYPES = [
  { label: 'Facebook', neg: 10, neu: 20, notRated: 20, pos: 50 },
  { label: 'Twitter',  neg: 10, neu: 25, notRated: 10, pos: 55 },
  { label: 'Blog',     neg: 5,  neu: 20, notRated: 15, pos: 60 },
  { label: 'Reddit',   neg: 15, neu: 25, notRated: 10, pos: 50 },
  { label: 'Forum',    neg: 20, neu: 20, notRated: 10, pos: 50 },
  { label: 'Comments', neg: 10, neu: 40, notRated: 5,  pos: 45 },
  { label: 'Reviews',  neg: 10, neu: 20, notRated: 15, pos: 55 },
  { label: 'TikTok',   neg: 5,  neu: 25, notRated: 10, pos: 60 },
  { label: 'News',     neg: 10, neu: 20, notRated: 15, pos: 55 },
]

const EMOTIONS = [
  { label: 'Joy',      emoji: '😊', value: 52.1, color: '#2196F3'  },
  { label: 'Fear',     emoji: '😨', value: 38.3, color: '#FF9800'  },
  { label: 'Surprise', emoji: '😲', value: 30.9, color: '#CF2D8A'  },
  { label: 'Love',     emoji: '❤️', value: 13.1, color: '#4CAF50'  },
  { label: 'Anger',    emoji: '😠', value: 13.1, color: '#FF5722'  },
  { label: 'Sadness',  emoji: '😢', value: 13.1, color: '#616161'  },
]

const KW_SENTIMENT = [
  { text: 'Surgery pains',          size: 16, pos: true  },
  { text: 'Back aches',             size: 18, pos: true  },
  { text: 'Gizmodo',                size: 14, pos: false },
  { text: 'Microsoft',              size: 15, pos: false },
  { text: 'IKEA',                   size: 16, pos: false },
  { text: 'Kimball Internation...',  size: 14, pos: true  },
  { text: 'Real Estate Ma...',       size: 14, pos: true  },
  { text: 'Nationwide Advisory...',  size: 13, pos: false },
  { text: 'value',                   size: 14, pos: false },
  { text: 'Cheap',                   size: 22, pos: true  },
  { text: 'Real Estate Ma...',       size: 14, pos: true  },
  { text: 'entire line',             size: 13, pos: false },
  { text: 'Best chair',              size: 20, pos: true  },
  { text: 'Craigslist',              size: 15, pos: true  },
  { text: 'Gizmodo',                 size: 14, pos: true  },
  { text: 'Joshua Slack',            size: 13, pos: true  },
  { text: 'Lego',                    size: 16, pos: true  },
  { text: 'PR Newswire',             size: 14, pos: false },
  { text: 'Logitech',                size: 14, pos: false },
  { text: 'Back aches',              size: 15, pos: false },
  { text: 'Lego Knoll',              size: 14, pos: true  },
  { text: 'Gizmodo',                 size: 14, pos: true  },
  { text: 'Free shipping',           size: 26, pos: true  },
  { text: 'PR Newswire',             size: 13, pos: false },
  { text: 'aesthetic contrast',      size: 12, pos: false },
  { text: 'entire line',             size: 13, pos: false },
  { text: 'FilzFelt',                size: 13, pos: false },
  { text: 'Hanssem',                 size: 14, pos: false },
  { text: 'Hanssem',                 size: 13, pos: false },
  { text: 'herman miller chair',     size: 20, pos: true  },
  { text: 'game edition',            size: 18, pos: true  },
  { text: 'INC',                     size: 14, pos: true  },
  { text: 'Aeron Technologies',      size: 14, pos: false },
  { text: 'Amazon Ebay',             size: 13, pos: false },
  { text: 'The Verge',               size: 13, pos: false },
  { text: 'CNet Technologies',       size: 14, pos: false },
  { text: 'designer things',         size: 16, pos: true  },
  { text: 'Best chair',              size: 22, pos: true  },
  { text: 'Allison Johnson',         size: 13, pos: false },
]

const CNN_ARTICLE = {
  source: 'CNN.com',
  author: 'Marlon Bradford',
  meta: 'News | US | 1 hr. ago',
  title: 'Fearing battery fires after recalls, people are selling their Chevy Bolt EVs back',
  snippet: 'For now, some Bolt owners said they are looking at other electric cars. Both Schoenfeld...',
  reach: '151M Reach',
  sentiment: 'Negative',
}

// ── sub-components ────────────────────────────────────────────────────────────

function SentimentDonut() {
  const size = 150, cx = 75, cy = 75, r = 56, ir = 32
  let cumAngle = -90
  const paths = DONUT_SEGMENTS.map(seg => {
    const startAngle = (cumAngle * Math.PI) / 180
    const sweep = (seg.pct / 100) * 360
    cumAngle += sweep
    const endAngle = (cumAngle * Math.PI) / 180
    const x1 = cx + r * Math.cos(startAngle), y1 = cy + r * Math.sin(startAngle)
    const x2 = cx + r * Math.cos(endAngle), y2 = cy + r * Math.sin(endAngle)
    const ix1 = cx + ir * Math.cos(startAngle), iy1 = cy + ir * Math.sin(startAngle)
    const ix2 = cx + ir * Math.cos(endAngle), iy2 = cy + ir * Math.sin(endAngle)
    const large = sweep > 180 ? 1 : 0
    return { path: `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${ir} ${ir} 0 ${large} 0 ${ix1} ${iy1} Z`, color: seg.color }
  })
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg width={size} height={size}>
        {paths.map((p, i) => <path key={i} d={p.path} fill={p.color} stroke="white" strokeWidth="2" />)}
        <circle cx={cx} cy={cy} r={ir} fill="white" />
      </svg>
      <Box sx={{ mt: 1, width: '100%' }}>
        {DONUT_SEGMENTS.map((s, i) => (
          <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: s.color, flexShrink: 0 }} />
            <Typography sx={{ fontSize: 13, flex: 1, color: '#424242' }}>{s.label}</Typography>
            <Typography sx={{ fontSize: 13, color: '#212121' }}>{s.pct}%</Typography>
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#212121', width: 36, textAlign: 'right' }}>{s.count}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

function SentimentTrendChart() {
  const w = 400, h = 160
  const maxVal = 60, labels = [0, 10, 20, 30, 40, 50, 60]
  const padL = 36, padB = 20, padT = 8, chartW = w - padL - 16, chartH = h - padB - padT

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid meet" style={{ display: 'block', flex: 1 }}>
        {/* Y-axis labels + grid */}
        {labels.map(v => {
          const y = padT + (1 - v / maxVal) * chartH
          return (
            <g key={v}>
              <line x1={padL} y1={y} x2={w - 16} y2={y} stroke="#f0f0f0" strokeWidth="1" />
              <text x={padL - 4} y={y + 4} textAnchor="end" fontSize="9" fill="#9E9E9E">{v ? `${v}k` : '0'}</text>
            </g>
          )
        })}
        {/* Lines */}
        {TREND_LINES.map((line, li) => {
          const pts = line.data.map((v, i) => `${padL + (i / (line.data.length - 1)) * chartW},${padT + (1 - v / maxVal) * chartH}`).join(' ')
          return <polyline key={li} points={pts} fill="none" stroke={line.color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
        })}
        {/* X-axis labels */}
        {TREND_DATES.filter((_, i) => i % 2 === 0).map((d, i) => {
          const x = padL + (i * 2 / (TREND_DATES.length - 1)) * chartW
          return <text key={i} x={x} y={h - 4} textAnchor="middle" fontSize="9" fill="#9E9E9E">{d}</text>
        })}
      </svg>
      {/* Legend */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mt: 0.5 }}>
        {TREND_LINES.map((line, i) => (
          <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: line.color, flexShrink: 0 }} />
            <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{line.label}</Typography>
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#212121' }}>{line.count}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

function StackedBarChart() {
  const barW = 32, gap = 8, padL = 28, padB = 48, padT = 8, h = 220
  const chartH = h - padB - padT
  const w = padL + SOURCE_TYPES.length * (barW + gap) + 8
  const yLabels = [0, 10, 20, 30, 40, 50, 60]

  return (
    <Box>
      <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid meet" style={{ display: 'block' }}>
        {/* Y-axis grid + labels */}
        {yLabels.map(v => {
          const y = padT + (1 - v / 60) * chartH
          return (
            <g key={v}>
              <line x1={padL} y1={y} x2={w} y2={y} stroke="#f0f0f0" strokeWidth="1" />
              <text x={padL - 4} y={y + 3} textAnchor="end" fontSize="9" fill="#9E9E9E">{v}%</text>
            </g>
          )
        })}
        {/* Bars */}
        {SOURCE_TYPES.map((src, i) => {
          const x = padL + i * (barW + gap)
          const segments = [
            { pct: src.neg,      color: NEG_COLOR  },
            { pct: src.neu,      color: NEU_COLOR  },
            { pct: src.notRated, color: NRAT_COLOR },
            { pct: src.pos,      color: POS_COLOR  },
          ]
          let cumPct = 0
          return (
            <g key={i}>
              {segments.map((seg, si) => {
                const barH = (seg.pct / 60) * chartH
                const y = padT + chartH - (cumPct / 60) * chartH - barH
                cumPct += seg.pct
                return <rect key={si} x={x} y={y} width={barW} height={barH} fill={seg.color} />
              })}
              <text x={x + barW / 2} y={h - padB + 14} textAnchor="middle" fontSize="9" fill="#9E9E9E">{src.label}</text>
            </g>
          )
        })}
      </svg>
      {/* Legend */}
      <Box sx={{ display: 'flex', gap: 2, mt: 0.5, justifyContent: 'center', flexWrap: 'wrap' }}>
        {[{ label: 'Positive', color: POS_COLOR }, { label: 'Negative', color: NEG_COLOR }, { label: 'Neutral', color: NEU_COLOR }, { label: 'Not Rated', color: NRAT_COLOR }].map(s => (
          <Box key={s.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: s.color }} />
            <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{s.label}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

function EmotionalBarChart() {
  const maxVal = 55, h = 200, padB = 40, padT = 24, barW = 52, gap = 16, padL = 40
  const chartH = h - padB - padT
  const w = padL + EMOTIONS.length * (barW + gap)
  const yLabels = [0, 10, 20, 30, 40, 50, 60]

  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid meet" style={{ display: 'block' }}>
      {/* Y-axis grid + labels */}
      {yLabels.map(v => {
        const y = padT + (1 - v / 60) * chartH
        return (
          <g key={v}>
            <line x1={padL} y1={y} x2={w} y2={y} stroke="#f0f0f0" strokeWidth="1" />
            <text x={padL - 4} y={y + 3} textAnchor="end" fontSize="9" fill="#9E9E9E">{v ? `${v}k` : '0'}</text>
          </g>
        )
      })}
      {/* Bars */}
      {EMOTIONS.map((e, i) => {
        const x = padL + i * (barW + gap)
        const barH = (e.value / 60) * chartH
        const y = padT + chartH - barH
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={barH} fill={e.color} rx="2" />
            {/* Value label */}
            <text x={x + barW / 2} y={y - 12} textAnchor="middle" fontSize="10" fill="#212121" fontWeight="600">{e.value}k</text>
            {/* Emoji */}
            <text x={x + barW / 2} y={y - 2} textAnchor="middle" fontSize="13">{e.emoji}</text>
            {/* X label */}
            <text x={x + barW / 2} y={h - padB + 14} textAnchor="middle" fontSize="10" fill="#9E9E9E">{e.label}</text>
          </g>
        )
      })}
    </svg>
  )
}

function MentionCard({ article }) {
  return (
    <Box sx={{ flex: 1, minWidth: 0, border: '1px solid #e0e0e0', borderRadius: 1, p: 1.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.75 }}>
        <Box sx={{ width: 28, height: 28, borderRadius: '50%', bgcolor: '#C62828', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Typography sx={{ fontSize: 8, fontWeight: 900, color: 'white', letterSpacing: '-0.5px' }}>CNN</Typography>
        </Box>
        <Box>
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#212121' }}>{article.source} • {article.author}</Typography>
          <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{article.meta}</Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#212121', lineHeight: 1.4, mb: 0.5 }}>
            {article.title}
          </Typography>
          <Typography sx={{ fontSize: 12, color: '#616161', lineHeight: 1.4 }}>{article.snippet}</Typography>
        </Box>
        <Box sx={{ width: 60, height: 60, bgcolor: '#E3F2FD', borderRadius: 0.5, flexShrink: 0 }} />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1, pt: 1, borderTop: '1px solid #f5f5f5' }}>
        <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{article.reach}</Typography>
        <Box sx={{ bgcolor: '#FFEBEE', color: '#C62828', fontSize: 11, fontWeight: 700, px: 0.75, py: 0.25, borderRadius: 1 }}>
          {article.sentiment}
        </Box>
      </Box>
    </Box>
  )
}

// ── main export ───────────────────────────────────────────────────────────────

export default function SentimentTabContent({ loading }) {
  if (loading) return null
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, flexShrink: 0 }}>

      {/* AI Insight */}
      <Box sx={{ p: '1.5px', borderRadius: 2, background: 'linear-gradient(135deg, #9C4DD6 0%, #CF2D8A 40%, #1D9F9F 100%)', mt: 2 }}>
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
              'Overall sentiment is predominantly neutral (59.2%), with positive mentions at 30% — driven largely by product quality and pricing discussions. 1, 2',
              'Negative sentiment spikes correlate with battery recall coverage on Aug 28, led by News and Twitter sources with 18% negative share. 3, 4',
              'Joy is the dominant emotion at 52.1k mentions, while Fear and Surprise together account for over 69k — suggesting high engagement from concern-driven content. 5, 6…',
            ].map((t, i) => (
              <Typography key={i} component="li" sx={{ fontSize: 14, lineHeight: '22px', color: '#212121', mb: 0.75 }}>{t}</Typography>
            ))}
          </Box>
          <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#1D9F9F', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>View More Insights</Typography>
        </Box>
      </Box>

      {/* Sentiment + Sentiment Trend side by side */}
      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <WidgetCard title="Sentiment">
            <SentimentDonut />
          </WidgetCard>
        </Box>
        <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <WidgetCard title="Sentiment Trend" height="100%">
            <SentimentTrendChart />
          </WidgetCard>
        </Box>
      </Box>

      {/* Sentiment by Source Type */}
      <WidgetCard title="Sentiment by Source Type">
        <StackedBarChart />
      </WidgetCard>

      {/* Emotional Comparison */}
      <WidgetCard title="Emotional Comparison">
        <EmotionalBarChart />
      </WidgetCard>

      {/* Keyword Sentiment */}
      <WidgetCard title="Keyword Sentiment">
        <Box sx={{ display: 'flex', gap: 2, mb: 1.25 }}>
          {[{ label: 'Positive', color: POS_COLOR }, { label: 'Negative', color: NEG_COLOR }].map(s => (
            <Box key={s.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: s.color }} />
              <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{s.label}</Typography>
            </Box>
          ))}
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, lineHeight: 2 }}>
          {KW_SENTIMENT.map((kw, i) => (
            <Typography key={i} sx={{ fontSize: kw.size, fontWeight: kw.size >= 20 ? 700 : 400, color: kw.pos ? '#2E7D32' : '#C62828', cursor: 'pointer', '&:hover': { opacity: 0.75 } }}>
              {kw.text}
            </Typography>
          ))}
        </Box>
      </WidgetCard>

      {/* Top Mentions by Sentiment */}
      <WidgetCard
        title="Top Mentions by Sentiment"
        action={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, border: '1px solid #e0e0e0', borderRadius: 0.5, px: 1, py: 0.25, cursor: 'pointer' }}>
            <Typography sx={{ fontSize: 12, color: '#C62828', fontWeight: 600 }}>Negative</Typography>
            <ArrowDropDownIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          </Box>
        }
      >
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          {[CNN_ARTICLE, CNN_ARTICLE, CNN_ARTICLE].map((article, i) => (
            <MentionCard key={i} article={article} />
          ))}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1, mt: 1.5, pt: 1, borderTop: '1px solid #f5f5f5' }}>
          <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>1 - 10 of 30</Typography>
          <Typography sx={{ fontSize: 13, color: '#bdbdbd', cursor: 'pointer', userSelect: 'none' }}>{'<'}</Typography>
          <Typography sx={{ fontSize: 13, color: '#1D9F9F', cursor: 'pointer', userSelect: 'none' }}>{'>'}</Typography>
        </Box>
      </WidgetCard>

    </Box>
  )
}
