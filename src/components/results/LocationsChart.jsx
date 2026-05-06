import { Box, Typography, IconButton } from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import WidgetMenu from './WidgetMenu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

const LOCATIONS = [
  { name: 'United States', flag: '🇺🇸', count: 903 },
  { name: 'Canada', flag: '🇨🇦', count: 823 },
  { name: 'Ivory Coast', flag: '🇨🇮', count: 522 },
  { name: 'Mexico', flag: '🇲🇽', count: 487 },
  { name: 'Mainland China', flag: '🇨🇳', count: 333 },
  { name: 'Germany', flag: '🇩🇪', count: 288 },
  { name: 'Malaysia', flag: '🇲🇾', count: 153 },
  { name: 'New Zealand', flag: '🇳🇿', count: 102 },
  { name: 'Hong Kong SAR China', flag: '🇭🇰', count: 67 },
  { name: 'United Kingdom', flag: '🇬🇧', count: 58 },
]

const MAX_COUNT = 903

function LocationsChart({ onDashboardSave, onDataPointClick, onWidgetInsight, showViewFullAnalysis, onViewFullAnalysis }) {
  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#212121' }}>Locations</Typography>
          <InfoOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
        </Box>
        <WidgetMenu showViewFullAnalysis={showViewFullAnalysis} onViewFullAnalysis={onViewFullAnalysis} onDashboardSave={onDashboardSave} widgetName="Locations" onWidgetInsight={onWidgetInsight} />
      </Box>

      {/* Bars */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {LOCATIONS.map((loc, i) => (
          <Box key={i} onClick={() => onDataPointClick && onDataPointClick({ type: 'location', label: `${loc.name} ${loc.flag}` })} sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', borderRadius: 0.5, mx: -0.5, px: 0.5, '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' } }}>
            <Typography sx={{ fontSize: 13, color: '#212121', textAlign: 'right', minWidth: 130, flexShrink: 0 }}>{loc.name}</Typography>
            <Typography sx={{ fontSize: 16, flexShrink: 0 }}>{loc.flag}</Typography>
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 0.75, minWidth: 0, overflow: 'hidden' }}>
              <Box sx={{ width: `${(loc.count / MAX_COUNT) * 85}%`, minWidth: 16, height: 20, bgcolor: '#F9A825', borderRadius: 0.5, flexShrink: 0 }} />
              <Typography sx={{ fontSize: 13, color: '#212121', flexShrink: 0 }}>{loc.count}</Typography>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Pagination */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, pt: 2 }}>
        <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>1 - 10 of 30</Typography>
        <IconButton size="small" disabled><ChevronLeftIcon sx={{ fontSize: 20 }} /></IconButton>
        <IconButton size="small"><ChevronRightIcon sx={{ fontSize: 20, color: '#212121' }} /></IconButton>
      </Box>
    </Box>
  )
}

export default LocationsChart
