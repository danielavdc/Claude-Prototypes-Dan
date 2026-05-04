import { Box, Typography } from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import WidgetMenu from './WidgetMenu'

const LEGEND = [
  { label: 'Keyword', color: '#E91E90' },
  { label: 'Hashtag', color: '#F9A825' },
  { label: 'Organization', color: '#1A237E' },
  { label: 'People', color: '#42A5F5' },
  { label: 'Location', color: '#66BB6A' },
  { label: 'Product', color: '#7B1FA2' },
  { label: 'Emoji', color: '#FF9800' },
]

const WORDS = [
  { text: 'Coca cola', size: 28, color: '#1A237E', x: 34, y: 8 },
  { text: 'artificial sweetener', size: 22, color: '#42A5F5', x: 55, y: 5 },
  { text: 'coaching to ensure', size: 14, color: '#E91E90', x: 18, y: 15 },
  { text: 'IKEA', size: 16, color: '#1A237E', x: 38, y: 18 },
  { text: 'Mountain Dew', size: 18, color: '#7B1FA2', x: 44, y: 17 },
  { text: 'MLB', size: 16, color: '#1A237E', x: 64, y: 18 },
  { text: 'fans', size: 14, color: '#FF9800', x: 72, y: 19 },
  { text: 'patients', size: 24, color: '#E91E90', x: 14, y: 26 },
  { text: '#policeprofessionalism', size: 13, color: '#F9A825', x: 28, y: 28 },
  { text: 'LLMs', size: 22, color: '#42A5F5', x: 50, y: 28 },
  { text: 'Real Estate Agence', size: 15, color: '#1A237E', x: 64, y: 25 },
  { text: 'coaching to ensure', size: 14, color: '#E91E90', x: 30, y: 35 },
  { text: 'Oscar Fernandez', size: 14, color: '#42A5F5', x: 66, y: 32 },
  { text: 'Facebook', size: 16, color: '#1A237E', x: 22, y: 40 },
  { text: 'GPT-4', size: 22, color: '#7B1FA2', x: 36, y: 42 },
  { text: 'Clemson University', size: 15, color: '#1A237E', x: 50, y: 41 },
  { text: 'Dallas', size: 13, color: '#66BB6A', x: 66, y: 43 },
  { text: 'Diet Pepsi', size: 32, color: '#7B1FA2', x: 18, y: 53 },
  { text: 'Pepsi Zero Sugar', size: 34, color: '#7B1FA2', x: 44, y: 55 },
  { text: 'Super Bowl', size: 36, color: '#E91E90', x: 72, y: 56 },
  { text: 'United States', size: 14, color: '#66BB6A', x: 22, y: 65 },
  { text: 'Dallas', size: 15, color: '#66BB6A', x: 36, y: 64 },
  { text: 'Don White', size: 14, color: '#42A5F5', x: 46, y: 64 },
  { text: 'United States', size: 13, color: '#66BB6A', x: 60, y: 62 },
  { text: 'technology', size: 26, color: '#E91E90', x: 52, y: 72 },
  { text: 'Sustainability', size: 28, color: '#42A5F5', x: 72, y: 70 },
  { text: 'Leon Lott', size: 14, color: '#42A5F5', x: 26, y: 74 },
  { text: '#entirecountry', size: 14, color: '#F9A825', x: 38, y: 75 },
  { text: 'public safety activities', size: 13, color: '#E91E90', x: 22, y: 82 },
  { text: 'Anthony Tassone', size: 15, color: '#42A5F5', x: 48, y: 80 },
  { text: 'Dr. Ian Adams', size: 14, color: '#42A5F5', x: 66, y: 78 },
  { text: "Richland County Sheriff's Department", size: 14, color: '#1A237E', x: 38, y: 88 },
  { text: 'South Carolina', size: 24, color: '#66BB6A', x: 38, y: 95 },
]

function TopKeywordsChart({ onDashboardSave, onDataPointClick, onWidgetInsight }) {
  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#212121' }}>Top Keywords and Entities</Typography>
          <InfoOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
        </Box>
        <WidgetMenu onDashboardSave={onDashboardSave} widgetName="Top Keywords" onWidgetInsight={onWidgetInsight} />
      </Box>

      {/* Legend */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
        {LEGEND.map(item => (
          <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: item.color }} />
            <Typography sx={{ fontSize: 12, color: '#212121' }}>{item.label}</Typography>
          </Box>
        ))}
      </Box>

      {/* Word cloud */}
      <Box sx={{ position: 'relative', height: 340, overflow: 'hidden' }}>
        {WORDS.map((word, i) => (
          <Typography key={i} onClick={() => onDataPointClick && onDataPointClick({ type: 'keyword', label: word.text })} sx={{
            position: 'absolute',
            left: `${word.x}%`,
            top: `${word.y}%`,
            transform: 'translate(-50%, -50%)',
            fontSize: word.size,
            fontWeight: word.size >= 28 ? 700 : word.size >= 20 ? 600 : 400,
            color: word.color,
            whiteSpace: 'nowrap',
            cursor: 'pointer',
            transition: 'opacity 0.15s',
            '&:hover': { opacity: 0.7 },
          }}>
            {word.text}
          </Typography>
        ))}
      </Box>
    </Box>
  )
}

export default TopKeywordsChart
