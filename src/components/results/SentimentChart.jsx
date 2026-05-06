import { Box, Typography } from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import WidgetMenu from './WidgetMenu'

const SEGMENTS = [
  { label: 'Positive', color: '#4CAF50', pct: 35.8, count: '1.9k' },
  { label: 'Negative', color: '#EF5350', pct: 25.5, count: '1.4k' },
  { label: 'Neutral', color: '#BDBDBD', pct: 20.3, count: '1.1k' },
  { label: 'Not Rated', color: '#E0E0E0', pct: 20.1, count: '1k' },
]

function SentimentChart({ onDashboardSave, onDataPointClick, onWidgetInsight, showViewFullAnalysis, onViewFullAnalysis }) {
  // Build donut chart with SVG
  const size = 180
  const stroke = 36
  const radius = (size - stroke) / 2
  const cx = size / 2
  const cy = size / 2
  const circumference = 2 * Math.PI * radius

  let cumulativeOffset = 0
  const arcs = SEGMENTS.map(seg => {
    const dashLength = (seg.pct / 100) * circumference
    const gap = circumference - dashLength
    const offset = -cumulativeOffset
    cumulativeOffset += dashLength
    return { ...seg, dashLength, gap, offset }
  })

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#212121' }}>Sentiment</Typography>
          <InfoOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
        </Box>
        <WidgetMenu showViewFullAnalysis={showViewFullAnalysis} onViewFullAnalysis={onViewFullAnalysis} onDashboardSave={onDashboardSave} widgetName="Sentiment" onWidgetInsight={onWidgetInsight} />
      </Box>

      {/* Donut + Legend */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
        {/* Donut */}
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {arcs.map((arc, i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke={arc.color}
              strokeWidth={stroke}
              strokeDasharray={`${arc.dashLength} ${arc.gap}`}
              strokeDashoffset={arc.offset}
              transform={`rotate(-90 ${cx} ${cy})`}
              style={{ cursor: 'pointer' }}
              onClick={() => onDataPointClick && onDataPointClick({ type: 'sentiment', label: arc.label })}
            />
          ))}
        </svg>

        {/* Legend */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, alignSelf: 'center' }}>
          {SEGMENTS.map((seg, i) => (
            <Box key={i} onClick={() => onDataPointClick && onDataPointClick({ type: 'sentiment', label: seg.label })} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer', borderRadius: 0.5, mx: -1, px: 1, py: 0.25, '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' } }}>
              <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: seg.color, flexShrink: 0 }} />
              <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#212121', minWidth: 80 }}>{seg.label}</Typography>
              <Typography sx={{ fontSize: 14, color: '#212121', minWidth: 48 }}>{seg.pct}%</Typography>
              <Typography sx={{ fontSize: 14, color: '#212121' }}>{seg.count}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}

export default SentimentChart
