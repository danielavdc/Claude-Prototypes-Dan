import { Box, Typography, Button, IconButton } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CloseIcon from '@mui/icons-material/Close'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'

function DashboardConfirmBanner({ dashboardName, message, onClose }) {
  if (!dashboardName) return null

  const displayMessage = message || <>Insight added to your new Analyze Dashboard, &ldquo;{dashboardName}&rdquo;.</>

  return (
    <Box sx={{
      position: 'fixed', top: 16, right: 16, zIndex: 1400,
      bgcolor: '#e8f5e9', borderRadius: 1, px: 2.5, py: 2,
      boxShadow: '0px 4px 12px rgba(0,0,0,0.15)',
      display: 'flex', alignItems: 'flex-start', gap: 1.5,
      maxWidth: 420, borderLeft: '4px solid #4caf50', border: '1px solid #4caf50',
    }}>
      <CheckCircleIcon sx={{ fontSize: 28, color: '#4caf50', mt: 0.25, flexShrink: 0 }} />
      <Box sx={{ flex: 1 }}>
        <Typography sx={{ fontSize: 15, color: '#212121', fontWeight: 400, mb: 1.5, lineHeight: 1.5 }}>
          {displayMessage}
        </Typography>
        <Button
          variant="contained" size="small"
          endIcon={<OpenInNewIcon sx={{ fontSize: 16 }} />}
          sx={{
            bgcolor: '#4caf50', color: 'white', fontWeight: 600, textTransform: 'none', fontSize: 14,
            borderRadius: 0.5, px: 2, py: 0.75,
            '&:hover': { bgcolor: '#43a047' },
          }}
        >
          View Dashboard
        </Button>
      </Box>
      <IconButton size="small" onClick={onClose} sx={{ mt: -0.5, mr: -0.5 }}>
        <CloseIcon sx={{ fontSize: 20, color: '#757575' }} />
      </IconButton>
    </Box>
  )
}

export default DashboardConfirmBanner
