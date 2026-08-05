import { useState } from 'react'
import { Box, Typography, IconButton, Paper } from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'

export default function WidgetCard({ title, children, height, action, noPad }) {
  const fillHeight = height === '100%'
  return (
    <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, p: noPad ? 0 : 2, height, flexShrink: 0, ...(fillHeight && { display: 'flex', flexDirection: 'column' }) }}>
      {title && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5, px: noPad ? 2 : 0, pt: noPad ? 2 : 0, flexShrink: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#212121' }}>{title}</Typography>
            <InfoOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {action}
            <IconButton size="small"><MoreVertIcon sx={{ fontSize: 18, color: 'text.secondary' }} /></IconButton>
          </Box>
        </Box>
      )}
      <Box sx={{ ...(fillHeight && { flex: 1, display: 'flex', flexDirection: 'column' }) }}>
        {children}
      </Box>
    </Paper>
  )
}

export function SectionHeader({ children }) {
  return (
    <Box sx={{ mt: 0.5, pb: 0.5, borderBottom: '2px solid #e0e0e0' }}>
      <Typography sx={{ fontSize: 17, fontWeight: 700, color: '#212121', pb: 0.5 }}>{children}</Typography>
    </Box>
  )
}

export function SegmentNav({ items }) {
  const [active, setActive] = useState(items[0]?.id || '')
  const handleClick = (id) => {
    setActive(id)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  return (
    <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', pb: 1.5, borderBottom: '1px solid #e0e0e0', mb: 0.5 }}>
      {items.map((item) => (
        <Box key={item.id} onClick={() => handleClick(item.id)} sx={{
          px: 2, py: 0.75, border: '1px solid',
          borderColor: active === item.id ? '#1D9F9F' : '#e0e0e0',
          borderRadius: 0.5, cursor: 'pointer',
          bgcolor: active === item.id ? 'rgba(29,159,159,0.06)' : 'white',
          color: active === item.id ? '#1D9F9F' : '#424242',
          fontSize: 14, fontWeight: active === item.id ? 700 : 400,
          userSelect: 'none', transition: 'all 0.15s ease',
          '&:hover': { borderColor: '#1D9F9F', color: '#1D9F9F' },
        }}>
          {item.label}
        </Box>
      ))}
    </Box>
  )
}

export function MetricBlock({ label, value, delta, deltaLabel }) {
  const isPositive = delta > 0
  return (
    <Box>
      <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 0.25 }}>{label}</Typography>
      <Typography sx={{ fontSize: 22, fontWeight: 700, color: '#212121', lineHeight: 1.1 }}>{value}</Typography>
      {delta !== undefined && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
          <Box sx={{ bgcolor: isPositive ? '#E8F5E9' : '#FFEBEE', color: isPositive ? '#2E7D32' : '#C62828', fontSize: 11, fontWeight: 700, px: 0.75, py: 0.25, borderRadius: 1 }}>
            {isPositive ? '↑' : '↓'} {Math.abs(delta)}%
          </Box>
          {deltaLabel && <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{deltaLabel}</Typography>}
        </Box>
      )}
    </Box>
  )
}

export function MiniLineChart({ data, color = '#1D9F9F', height = 60 }) {
  const w = 300, h = height
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 4) - 2}`).join(' ')
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ width: '100%', height }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}

export function HBar({ label, value, max, color = '#1D9F9F', suffix = '' }) {
  const pct = Math.round((value / max) * 100)
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
      <Typography sx={{ fontSize: 13, color: '#424242', width: 120, flexShrink: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</Typography>
      <Box sx={{ flex: 1, height: 8, bgcolor: '#f0f0f0', borderRadius: 1, overflow: 'hidden' }}>
        <Box sx={{ width: `${pct}%`, height: '100%', bgcolor: color, borderRadius: 1 }} />
      </Box>
      <Typography sx={{ fontSize: 12, color: 'text.secondary', width: 40, textAlign: 'right' }}>{value}{suffix}</Typography>
    </Box>
  )
}
