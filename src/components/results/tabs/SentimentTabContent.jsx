import { Box, Typography, Chip } from '@mui/material'
import WidgetCard, { SectionHeader, MetricBlock, MiniLineChart, HBar } from './WidgetCard'

const SENTIMENT_DONUT = [
  { label: 'Positive', pct: 58, color: '#4CAF50' },
  { label: 'Neutral', pct: 24, color: '#9E9E9E' },
  { label: 'Negative', pct: 18, color: '#F44336' },
]

const SENTIMENT_TREND = [42, 48, 44, 55, 51, 60, 52, 58, 54, 65, 59, 50, 62, 55, 68, 60, 52, 57, 48, 55, 62, 55, 60, 68, 52, 58, 62, 55, 48, 57]

const BY_SOURCE = [
  { label: 'Online News', pos: 62, neu: 22, neg: 16 },
  { label: 'Twitter/X', pos: 48, neu: 30, neg: 22 },
  { label: 'Blogs', pos: 70, neu: 18, neg: 12 },
  { label: 'Forums', pos: 40, neu: 35, neg: 25 },
  { label: 'Instagram', pos: 75, neu: 16, neg: 9 },
]

const EMOTIONS = [
  { label: 'Joy', value: 38, color: '#4CAF50' },
  { label: 'Trust', value: 28, color: '#2196F3' },
  { label: 'Surprise', value: 14, color: '#FF9800' },
  { label: 'Anticipation', value: 10, color: '#9C4DD6' },
  { label: 'Sadness', value: 6, color: '#78909C' },
  { label: 'Anger', value: 4, color: '#F44336' },
]

const KW_SENTIMENT = [
  { label: 'quality', sentiment: 'positive' },
  { label: 'local', sentiment: 'positive' },
  { label: 'fresh', sentiment: 'positive' },
  { label: 'great service', sentiment: 'positive' },
  { label: 'cozy', sentiment: 'positive' },
  { label: 'overpriced', sentiment: 'negative' },
  { label: 'long wait', sentiment: 'negative' },
  { label: 'crowded', sentiment: 'negative' },
  { label: 'new location', sentiment: 'neutral' },
  { label: 'sustainability', sentiment: 'positive' },
  { label: 'fair trade', sentiment: 'positive' },
  { label: 'noisy', sentiment: 'negative' },
  { label: 'artisan', sentiment: 'positive' },
  { label: 'innovative', sentiment: 'positive' },
  { label: 'pricey', sentiment: 'negative' },
  { label: 'eco-friendly', sentiment: 'positive' },
  { label: 'trendy', sentiment: 'neutral' },
  { label: 'inconsistent', sentiment: 'negative' },
]

const TOP_MENTIONS = [
  { source: 'CNN', snippet: 'The brand continues to impress critics with its commitment to sustainable sourcing and exceptional quality...', sentiment: 'Positive', reach: '2.4M' },
  { source: 'Yelp', snippet: 'Absolutely love this place! Best coffee in the neighborhood, great staff and atmosphere...', sentiment: 'Positive', reach: '980k' },
  { source: 'Reddit', snippet: 'Prices have gone up again. $7 for a latte is just too much, even if the quality is good...', sentiment: 'Negative', reach: '450k' },
  { source: 'Twitter/X', snippet: 'New location opening next month in Hayes Valley — really excited to have one closer to home!', sentiment: 'Neutral', reach: '320k' },
]

const SENTIMENT_COLOR = { Positive: { bg: '#E8F5E9', color: '#2E7D32' }, Neutral: { bg: '#F5F5F5', color: '#616161' }, Negative: { bg: '#FFEBEE', color: '#C62828' } }

function SentimentDonut({ segments, size = 130 }) {
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
    <svg width={size} height={size} style={{ flexShrink: 0 }}>
      {paths.map((p, i) => <path key={i} d={p.path} fill={p.color} stroke="white" strokeWidth="1.5" />)}
      <text x={cx} y={cy - 5} textAnchor="middle" fontSize="11" fill="#212121" fontWeight="600">Overall</text>
      <text x={cx} y={cy + 8} textAnchor="middle" fontSize="11" fill="#212121" fontWeight="600">Sentiment</text>
    </svg>
  )
}

function StackedHBar({ pos, neu, neg, height = 10 }) {
  return (
    <Box sx={{ display: 'flex', height, borderRadius: 1, overflow: 'hidden', flex: 1 }}>
      <Box sx={{ width: `${pos}%`, bgcolor: '#4CAF50' }} />
      <Box sx={{ width: `${neu}%`, bgcolor: '#9E9E9E' }} />
      <Box sx={{ width: `${neg}%`, bgcolor: '#F44336' }} />
    </Box>
  )
}

export default function SentimentTabContent({ loading }) {
  if (loading) return null
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>

      {/* OVERVIEW */}
      <SectionHeader>Sentiment Overview</SectionHeader>

      <WidgetCard title="Sentiment Distribution">
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <SentimentDonut segments={SENTIMENT_DONUT} size={140} />
            <Box>
              {SENTIMENT_DONUT.map((s, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.75 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: s.color, flexShrink: 0 }} />
                  <Typography sx={{ fontSize: 13, flex: 1, color: '#424242' }}>{s.label}</Typography>
                  <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#212121', ml: 1 }}>{s.pct}%</Typography>
                </Box>
              ))}
            </Box>
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 1.5 }}>
              <MetricBlock label="Positive" value="58%" delta={4} deltaLabel="vs prev period" />
              <MetricBlock label="Negative" value="18%" delta={-2} deltaLabel="vs prev period" />
            </Box>
            <MiniLineChart data={SENTIMENT_TREND} color="#4CAF50" height={90} />
          </Box>
        </Box>
      </WidgetCard>

      {/* BY SOURCE */}
      <SectionHeader>Sentiment by Source</SectionHeader>

      <WidgetCard title="Sentiment by Source Type">
        <Box sx={{ display: 'flex', gap: 2, mb: 1.5 }}>
          {[{ label: 'Positive', color: '#4CAF50' }, { label: 'Neutral', color: '#9E9E9E' }, { label: 'Negative', color: '#F44336' }].map(s => (
            <Box key={s.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: s.color }} />
              <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{s.label}</Typography>
            </Box>
          ))}
        </Box>
        {BY_SOURCE.map((row, i) => (
          <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.75 }}>
            <Typography sx={{ fontSize: 13, color: '#424242', width: 100, flexShrink: 0 }}>{row.label}</Typography>
            <StackedHBar pos={row.pos} neu={row.neu} neg={row.neg} />
            <Typography sx={{ fontSize: 12, color: 'text.secondary', width: 36, textAlign: 'right' }}>{row.pos}%</Typography>
          </Box>
        ))}
      </WidgetCard>

      {/* EMOTIONS */}
      <SectionHeader>Emotional Analysis</SectionHeader>

      <WidgetCard title="Emotional Comparison">
        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1.5, height: 160, pt: 1 }}>
          {EMOTIONS.map((e, i) => (
            <Box key={i} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
              <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#212121' }}>{e.value}%</Typography>
              <Box sx={{ width: '100%', height: `${(e.value / 38) * 110}px`, bgcolor: e.color, borderRadius: '2px 2px 0 0', opacity: 0.85 }} />
              <Typography sx={{ fontSize: 10, color: '#616161', textAlign: 'center', lineHeight: 1.2 }}>{e.label}</Typography>
            </Box>
          ))}
        </Box>
      </WidgetCard>

      {/* KEYWORDS */}
      <SectionHeader>Sentiment by Keywords</SectionHeader>

      <WidgetCard title="Keyword Sentiment">
        <Box sx={{ display: 'flex', gap: 2, mb: 1.5 }}>
          {[{ label: 'Positive', color: '#4CAF50' }, { label: 'Neutral', color: '#9E9E9E' }, { label: 'Negative', color: '#F44336' }].map(s => (
            <Box key={s.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: s.color }} />
              <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{s.label}</Typography>
            </Box>
          ))}
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, lineHeight: 2 }}>
          {KW_SENTIMENT.map((kw, i) => (
            <Typography key={i} sx={{ fontSize: 11 + (i % 3) * 2, fontWeight: i < 5 ? 700 : 400, color: kw.sentiment === 'positive' ? '#2E7D32' : kw.sentiment === 'negative' ? '#C62828' : '#616161', cursor: 'pointer' }}>
              {kw.label}
            </Typography>
          ))}
        </Box>
      </WidgetCard>

      {/* TOP MENTIONS */}
      <SectionHeader>Top Mentions</SectionHeader>

      <WidgetCard title="Top Mentions by Sentiment">
        {TOP_MENTIONS.map((m, i) => (
          <Box key={i} sx={{ py: 1, borderBottom: i < TOP_MENTIONS.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Box sx={{ width: 28, height: 28, borderRadius: '50%', bgcolor: '#e3f2fd', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#1565C0' }}>{m.source[0]}</Typography>
              </Box>
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#212121', flex: 1 }}>{m.source}</Typography>
              <Chip size="small" label={m.sentiment} sx={{ height: 20, fontSize: 11, fontWeight: 700, bgcolor: SENTIMENT_COLOR[m.sentiment]?.bg, color: SENTIMENT_COLOR[m.sentiment]?.color }} />
            </Box>
            <Typography sx={{ fontSize: 13, color: '#424242', lineHeight: 1.4, mb: 0.5 }}>{m.snippet}</Typography>
            <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>Reach: {m.reach}</Typography>
          </Box>
        ))}
        <Typography sx={{ fontSize: 13, color: '#1D9F9F', cursor: 'pointer', mt: 1 }}>1 – 4 of 30 Mentions &gt;</Typography>
      </WidgetCard>

    </Box>
  )
}
