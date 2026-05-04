import { useState, useRef } from 'react'
import { Box, Typography, Button, IconButton, Divider } from '@mui/material'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import WidgetMenu from './WidgetMenu'
import SpikePopover from './SpikePopover'

function MentionsTrendChart({ brandName, resultCount = 107, onDashboardSave, onDataPointClick, onViewMoreInsights, onWidgetInsight }) {
  // Weekly data matching screenshot pattern (Aug 25–31, hourly-ish granularity)
  const baseData = [
    18,20,15,25,30,22,12,15,20,28,18,10,8,15,22,18,
    12,8,5,10,18,25,15,10,8,15,20,30,50,20,12,8,
    5,3,8,12,18,15,10,8,12,15,20,25,18,12,8,10,
    15,22,18,12,8,5,10,15,20,18,12,8,10,15,25,20,
    15,10,8,12,18,25,35,55,45,30,20,15,12,10,18,25,
    42,30,20,15,10,8,15,20,28,35,25,18,12,8,15,20,
    30,25,18,12,15,20,28,22,15,10,18,25,35,45,30,20,
  ]
  const scale = resultCount / 107
  const data = baseData.map(v => Math.round(v * scale))
  const maxY = 60
  const yTicks = [0, 20, 40, 60]
  const xLabels = [
    { i: 0, label: 'Aug 25' },
    { i: 16, label: 'Aug 26' },
    { i: 32, label: 'Aug 27' },
    { i: 48, label: 'Aug 28' },
    { i: 64, label: 'Aug 29' },
    { i: 80, label: 'Aug 30' },
    { i: 96, label: 'Aug 31' },
  ]
  // Spike detection points — indices of prominent peaks in the data
  const spikeIndices = [28, 71, 80, 103]
  const primarySpikeIndex = 71 // largest spike gets a glow effect

  const [activeSpike, setActiveSpike] = useState(null)
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const chartAreaRef = useRef(null)

  const getDateLabel = (idx) => {
    for (let j = xLabels.length - 1; j >= 0; j--) {
      if (idx >= xLabels[j].i) return xLabels[j].label.toUpperCase()
    }
    return xLabels[0].label.toUpperCase()
  }

  const handleChartMouseMove = (e) => {
    if (!chartAreaRef.current) return
    const rect = chartAreaRef.current.getBoundingClientRect()
    const relX = (e.clientX - rect.left) / rect.width
    const idx = Math.round(relX * (data.length - 1))
    setHoveredIndex(Math.max(0, Math.min(data.length - 1, idx)))
  }

  const handleChartClick = () => {
    if (hoveredIndex !== null && onDataPointClick) {
      onDataPointClick({ type: 'date', label: getDateLabel(hoveredIndex) })
    }
  }

  const W = 760, H = 220, pad = { t: 15, r: 15, b: 30, l: 40 }
  const chartW = W - pad.l - pad.r
  const chartH = H - pad.t - pad.b
  const toX = i => pad.l + (i / (data.length - 1)) * chartW
  const toY = v => pad.t + (1 - Math.min(v, maxY) / maxY) * chartH
  const points = data.map((v, i) => `${toX(i)},${toY(v)}`).join(' ')
  const areaPoints = `${toX(0)},${H - pad.b} ${points} ${toX(data.length - 1)},${H - pad.b}`

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Spike popover */}
      {activeSpike !== null && (
        <SpikePopover spikeIndex={activeSpike} onClose={() => setActiveSpike(null)} onDashboardSave={onDashboardSave} onDataPointClick={onDataPointClick} onViewMoreInsights={onViewMoreInsights} />
      )}

      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#212121' }}>Mentions Trend</Typography>
          <InfoOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Button variant="outlined" size="small" startIcon={<AutoAwesomeIcon sx={{ fontSize: 12 }} />}
            sx={{ borderRadius: 5, fontSize: 12, borderColor: '#212121', color: '#212121', height: 28, textTransform: 'none', fontWeight: 400 }}>
            Predication
          </Button>
          <Button size="small" endIcon={<ArrowDropDownIcon sx={{ fontSize: 14 }} />}
            sx={{ fontSize: 13, fontWeight: 700, color: '#212121', textTransform: 'none' }}>
            Weekly
          </Button>
          <WidgetMenu onDashboardSave={onDashboardSave} widgetName="Mentions Trend" onWidgetInsight={onWidgetInsight} />
        </Box>
      </Box>

      {/* Stats row */}
      <Box sx={{ display: 'flex', gap: 0, mb: 2 }}>
        <Box sx={{ pr: 4, borderRight: '1px solid #e0e0e0' }}>
          <Typography sx={{ fontSize: 13, color: '#212121', mb: 0.5 }}>Total Mentions</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
            <Typography sx={{ fontSize: 36, fontWeight: 700, lineHeight: 1, color: '#212121' }}>35.2k</Typography>
            <Box>
              <Box sx={{ bgcolor: '#E8F5E9', borderRadius: 0.5, px: 0.75, py: 0.25, display: 'flex', alignItems: 'center', gap: 0.25 }}>
                <ArrowUpwardIcon sx={{ fontSize: 12, color: '#2E7D32' }} />
                <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#2E7D32' }}>37%</Typography>
              </Box>
              <Typography sx={{ fontSize: 12, color: 'text.secondary', mt: 0.25 }}>Previously <strong>2.97M</strong></Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={{ pl: 4 }}>
          <Typography sx={{ fontSize: 13, color: '#212121', mb: 0.5 }}>Daily Average</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
            <Typography sx={{ fontSize: 36, fontWeight: 700, lineHeight: 1, color: '#212121' }}>1.46k</Typography>
            <Box>
              <Box sx={{ bgcolor: '#E8F5E9', borderRadius: 0.5, px: 0.75, py: 0.25, display: 'flex', alignItems: 'center', gap: 0.25 }}>
                <ArrowUpwardIcon sx={{ fontSize: 12, color: '#2E7D32' }} />
                <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#2E7D32' }}>37%</Typography>
              </Box>
              <Typography sx={{ fontSize: 12, color: 'text.secondary', mt: 0.25 }}>Previously <strong>2.97M</strong></Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Chart */}
      <Box sx={{ position: 'relative', pl: '36px', pb: '24px' }}>
        {/* Y-axis labels (HTML, fixed size) */}
        {yTicks.map(v => (
          <Typography key={v} sx={{
            position: 'absolute',
            left: 0,
            top: `${((maxY - v) / maxY) * 240}px`,
            transform: 'translateY(-50%)',
            fontSize: 12,
            fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
            fontWeight: 400,
            color: '#212121',
            lineHeight: 1,
          }}>
            {v === 0 ? '0' : `${v}k`}
          </Typography>
        ))}
        {/* SVG chart area with spike icons */}
        <Box ref={chartAreaRef} onMouseMove={handleChartMouseMove} onMouseLeave={() => setHoveredIndex(null)} onClick={handleChartClick} sx={{ position: 'relative', cursor: 'pointer' }}>
          <svg viewBox={`0 0 ${chartW} ${chartH}`} preserveAspectRatio="none" style={{ width: '100%', height: 240, display: 'block' }}>
            <defs>
              <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2196F3" stopOpacity="0.30" />
                <stop offset="100%" stopColor="#2196F3" stopOpacity="0.04" />
              </linearGradient>
            </defs>
            {/* Grid lines */}
            {yTicks.map(v => (
              <line key={v} x1={0} y1={(1 - v / maxY) * chartH} x2={chartW} y2={(1 - v / maxY) * chartH}
                stroke="#e0e0e0" strokeWidth="1" vectorEffect="non-scaling-stroke"
                strokeDasharray={v === 0 ? 'none' : '4,3'} />
            ))}
            {/* Area fill */}
            <polygon points={`0,${chartH} ${data.map((v, i) => `${(i / (data.length - 1)) * chartW},${(1 - Math.min(v, maxY) / maxY) * chartH}`).join(' ')} ${chartW},${chartH}`} fill="url(#areaFill)" />
            {/* Line */}
            <polyline points={data.map((v, i) => `${(i / (data.length - 1)) * chartW},${(1 - Math.min(v, maxY) / maxY) * chartH}`).join(' ')}
              fill="none" stroke="#2196F3" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          </svg>

          {/* Vertical reference line for active spike */}
          {activeSpike !== null && (
            <Box sx={{
              position: 'absolute',
              left: `${(activeSpike / (data.length - 1)) * 100}%`,
              top: 0,
              bottom: 0,
              width: '1px',
              bgcolor: '#bdbdbd',
              zIndex: 5,
              transform: 'translateX(-0.5px)',
            }} />
          )}

          {/* Hover: vertical line + dot + tooltip */}
          {hoveredIndex !== null && (() => {
            const xPct = (hoveredIndex / (data.length - 1)) * 100
            const yPx = (1 - Math.min(data[hoveredIndex], maxY) / maxY) * 240
            const val = (data[hoveredIndex] * 1000).toLocaleString()
            const isNearSpike = spikeIndices.some(si => Math.abs(hoveredIndex - si) <= 2)
            const tooltipTop = isNearSpike ? `${yPx + 16}px` : `${yPx - 16}px`
            const tooltipTransform = isNearSpike ? 'translate(-50%, 0%)' : 'translate(-50%, -100%)'
            return (
              <>
                <Box sx={{ position: 'absolute', left: `${xPct}%`, top: 0, bottom: 0, width: '1px', bgcolor: '#bdbdbd', zIndex: 4, transform: 'translateX(-0.5px)', pointerEvents: 'none' }} />
                <Box sx={{ position: 'absolute', left: `${xPct}%`, top: `${yPx}px`, width: 10, height: 10, borderRadius: '50%', bgcolor: 'white', border: '2px solid #2196F3', transform: 'translate(-50%, -50%)', zIndex: 8, pointerEvents: 'none' }} />
                <Box sx={{ position: 'absolute', left: `${xPct}%`, top: tooltipTop, transform: tooltipTransform, bgcolor: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', borderRadius: 1, px: 1.5, py: 1, zIndex: 9, pointerEvents: 'none', whiteSpace: 'nowrap' }}>
                  <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#757575', mb: 0.25 }}>{getDateLabel(hoveredIndex)}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#2196F3' }} />
                    <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#212121' }}>{val}</Typography>
                  </Box>
                </Box>
              </>
            )
          })()}

          {/* Spike detection icons */}
          {spikeIndices.map((idx) => {
            const xPct = (idx / (data.length - 1)) * 100
            const yPct = (1 - Math.min(data[idx], maxY) / maxY) * 100
            const isPrimary = idx === primarySpikeIndex
            const iconSize = isPrimary ? 32 : 24
            return (
              <Box
                key={idx}
                onClick={(e) => { e.stopPropagation(); setActiveSpike(activeSpike === idx ? null : idx) }}
                sx={{
                  position: 'absolute',
                  left: `${xPct}%`,
                  top: `${(yPct / 100) * 240 - iconSize - 6}px`,
                  transform: 'translateX(-50%)',
                  width: iconSize,
                  height: iconSize,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 6,
                  transition: 'transform 0.15s ease',
                  '&:hover': { transform: 'translateX(-50%) scale(1.15)' },
                  ...(isPrimary && {
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      inset: -4,
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, rgba(33,150,243,0.25) 0%, rgba(33,150,243,0) 70%)',
                    },
                  }),
                }}
              >
                <Box
                  component="img"
                  src="/spike.png"
                  alt="Spike detected"
                  sx={{ width: iconSize, height: iconSize }}
                />
              </Box>
            )
          })}
        </Box>
        {/* X-axis labels (HTML, fixed size) */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
          {xLabels.map(({ i, label }) => (
            <Typography key={i} onClick={() => onDataPointClick && onDataPointClick({ type: 'date', label })} sx={{
              fontSize: 12,
              fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
              fontWeight: 400,
              color: '#212121',
              cursor: 'pointer',
              borderRadius: 0.5,
              px: 0.5,
              mx: -0.5,
              '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' },
            }}>
              {label}
            </Typography>
          ))}
        </Box>
      </Box>
    </Box>
  )
}

export default MentionsTrendChart
