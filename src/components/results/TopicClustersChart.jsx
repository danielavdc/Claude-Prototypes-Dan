import { Box, Typography, IconButton, Button, Divider } from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import WidgetMenu from './WidgetMenu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

const CLUSTERS = [
  {
    rank: 1,
    color: '#1D9F9F',
    title: 'Sustainability and Packaging',
    desc: "Growing cluster around Pepsi's sustainability commitments: recyclable bottles, reduced plastic, and climate pledges. Often compared to Coke's initiatives, signaling risk of lagging behind in eco-conscious narratives.",
    mentions: '1.5k',
  },
  {
    rank: 2,
    color: '#F9A825',
    title: 'Brand Trust Gap: Sugar vs. Health',
    desc: 'Negative discussion focuses on sugar content, artificial sweeteners, and perceived lack of healthier alternatives. This tension risks eroding trust among health-conscious consumers, especially Gen Z and millennial parents.\u2026',
    mentions: '1.5k',
  },
  {
    rank: 3,
    color: '#EF5350',
    title: 'Competitive Heat with Coca-Cola',
    desc: 'Conversation clusters highlight head-to-head comparisons with Coke\u2014on taste, marketing campaigns, and sponsorships (sports, music events). Pepsi often trends when Coca-Cola dominates a global spotlight (e.g., Olympics, FIFA).\u2026',
    mentions: '1.5k',
  },
  {
    rank: 4,
    color: '#42A5F5',
    title: 'Enterprise 5G: Low Volume, High Value',
    desc: "Coverage on 5G security, private networks, smart antennas, and industrial WAN implies a strategic B2B runway. While it won't spike volume today, it is critical for long-term ARPU expansion.",
    mentions: '1.5k',
  },
  {
    rank: 5,
    color: '#AB47BC',
    title: 'Geography Bifurcation',
    desc: 'India dominates mid-range 5G handset coverage (Realme/Vivo/iQOO), the U.S. conversation centers on FWA and plan competition, while Canada skews corporate/financial\u2014suggesting different GTM levers by region.',
    mentions: '1.5k',
  },
]

function TopicClustersChart({ onDashboardSave, onDataPointClick, onWidgetInsight }) {
  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#212121' }}>Topic Clusters</Typography>
          <InfoOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
        </Box>
        <WidgetMenu onDashboardSave={onDashboardSave} widgetName="Topic Clusters" onWidgetInsight={onWidgetInsight} />
      </Box>

      {/* Table header */}
      <Box sx={{ display: 'flex', alignItems: 'center', px: 1, pb: 1 }}>
        <Typography sx={{ fontSize: 12, color: 'text.secondary', width: 50 }}>Rank</Typography>
        <Typography sx={{ fontSize: 12, color: 'text.secondary', flex: 1 }}>Clusters</Typography>
        <Typography sx={{ fontSize: 12, color: 'text.secondary', textAlign: 'right' }}>Mentions</Typography>
      </Box>

      {/* Rows */}
      {CLUSTERS.map((cluster, i) => (
        <Box key={i}>
          <Divider />
          <Box onClick={() => onDataPointClick && onDataPointClick({ type: 'topic', label: cluster.title })} sx={{ display: 'flex', alignItems: 'flex-start', px: 1, py: 1.5, gap: 1.5, borderLeft: `3px solid ${cluster.color}`, cursor: 'pointer', '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' } }}>
            <Box sx={{
              width: 32, height: 32, borderRadius: '50%', border: `2px solid ${cluster.color}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Typography sx={{ fontSize: 14, fontWeight: 700, color: cluster.color }}>{cluster.rank}</Typography>
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#212121', mb: 0.25 }}>{cluster.title}</Typography>
              <Typography sx={{ fontSize: 13, color: '#616161', lineHeight: '20px' }}>{cluster.desc}</Typography>
            </Box>
            <Typography sx={{ fontSize: 14, fontWeight: 400, color: '#212121', flexShrink: 0, pt: 0.5 }}>{cluster.mentions}</Typography>
          </Box>
        </Box>
      ))}
      <Divider />

      {/* Pagination */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, pt: 1.5 }}>
        <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>1 - 10 of 30</Typography>
        <IconButton size="small" disabled><ChevronLeftIcon sx={{ fontSize: 20 }} /></IconButton>
        <IconButton size="small"><ChevronRightIcon sx={{ fontSize: 20, color: '#212121' }} /></IconButton>
      </Box>
    </Box>
  )
}

export default TopicClustersChart
