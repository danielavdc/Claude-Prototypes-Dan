import { Box } from '@mui/material'
import { AIInsightWidget, EngagementContent } from './CoverageTabContent'

export default function EngagementTabContent({ loading }) {
  if (loading) return null
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <Box sx={{ pt: 2 }}><AIInsightWidget /></Box>
      <EngagementContent />
    </Box>
  )
}
