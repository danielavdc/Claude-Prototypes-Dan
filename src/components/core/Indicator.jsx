import { Box, Typography } from '@mui/material'

const INDICATOR_COLORS = {
  purple: { border: '#9333EA', text: '#9333EA', bg: '#FAF5FF' },
  green: { border: '#16A34A', text: '#16A34A', bg: '#F0FDF4' },
  red: { border: '#DC2626', text: '#DC2626', bg: '#FEF2F2' },
  blue: { border: '#5E35B1', text: '#5E35B1', bg: '#EDE7F6' },
  yellow: { border: '#CA8A04', text: '#CA8A04', bg: '#FEFCE8' },
  pink: { border: '#DB2777', text: '#DB2777', bg: '#FDF2F8' },
  lime: { border: '#65A30D', text: '#65A30D', bg: '#F7FEE7' },
  orange: { border: '#EA580C', text: '#EA580C', bg: '#FFF7ED' },
  cyan: { border: '#0891B2', text: '#0891B2', bg: '#ECFEFF' },
  brown: { border: '#92400E', text: '#92400E', bg: '#FEF3C7' },
  indigo: { border: '#4F46E5', text: '#4F46E5', bg: '#EEF2FF' },
  gray: { border: '#6B7280', text: '#6B7280', bg: '#F9FAFB' },
}

const STATUS_MAP = {
  active: 'green',
  pending: 'yellow',
  inactive: 'gray',
  error: 'red',
  warning: 'orange',
  success: 'green',
  info: 'blue',
  new: 'purple',
  beta: 'indigo',
}

function Indicator({ label, color, status, size = 'medium', startIcon }) {
  const colorKey = status ? STATUS_MAP[status.toLowerCase()] || 'gray' : color || 'gray'
  const colors = INDICATOR_COLORS[colorKey] || INDICATOR_COLORS.gray

  const sizeStyles = {
    small: { fontSize: '0.75rem', px: 1, py: 0.25, borderRadius: '4px', iconSize: 14 },
    medium: { fontSize: '0.875rem', px: 1.5, py: 0.5, borderRadius: '4px', iconSize: 16 },
  }

  const currentSize = sizeStyles[size] || sizeStyles.medium

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        border: `1px solid ${colors.border}`,
        backgroundColor: colors.bg,
        color: colors.text,
        fontWeight: 600,
        ...currentSize,
        whiteSpace: 'nowrap',
      }}
    >
      {startIcon && (
        <Box sx={{ display: 'flex', alignItems: 'center', fontSize: currentSize.iconSize }}>
          {startIcon}
        </Box>
      )}
      <Typography variant="caption" sx={{ fontSize: currentSize.fontSize, fontWeight: 600 }}>
        {label}
      </Typography>
    </Box>
  )
}

export default Indicator
