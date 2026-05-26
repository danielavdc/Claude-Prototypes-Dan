import { useState } from 'react'
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Typography, Divider, Box, Tooltip } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import DashboardCustomizeOutlinedIcon from '@mui/icons-material/DashboardCustomizeOutlined'
import OpenInFullIcon from '@mui/icons-material/OpenInFull'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import RefreshIcon from '@mui/icons-material/Refresh'
import AddToDashboardModal from '../core/AddToDashboardModal'

function WidgetMenu({ onDashboardSave, showRegenerate, widgetName, onWidgetInsight, showViewFullAnalysis, onViewFullAnalysis }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const [dashboardModalOpen, setDashboardModalOpen] = useState(false)

  const close = () => setAnchorEl(null)

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
        {showViewFullAnalysis && (
          <Typography onClick={onViewFullAnalysis} sx={{ fontSize: 13, fontWeight: 600, color: '#1D9F9F', cursor: 'pointer', whiteSpace: 'nowrap', '&:hover': { textDecoration: 'underline' } }}>
            View Full Analysis
          </Typography>
        )}
        {!showRegenerate && (
          <Tooltip title="Generate widget insight with Mira" arrow>
            <IconButton size="small" onClick={() => onWidgetInsight?.(widgetName)}>
              <AutoFixHighIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
            </IconButton>
          </Tooltip>
        )}
        <IconButton size="small" onClick={(e) => setAnchorEl(e.currentTarget)}>
          <MoreVertIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
        </IconButton>
      </Box>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={close}
        PaperProps={{ elevation: 4, sx: { width: 232, borderRadius: 1, mt: 0.5 } }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {showRegenerate && (
          <MenuItem onClick={close} sx={{ height: 36, px: 2 }}>
            <ListItemIcon sx={{ minWidth: 36 }}><RefreshIcon sx={{ fontSize: 20, color: '#616161' }} /></ListItemIcon>
            <ListItemText>
              <Typography sx={{ fontSize: 15, fontWeight: 400, color: '#212121', fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>Regenerate AI Summary</Typography>
            </ListItemText>
          </MenuItem>
        )}
        {showRegenerate && <Divider />}

        {[
          { icon: <Box component="img" src="/csv.png" alt="" sx={{ width: 20, height: 20, objectFit: 'contain' }} />, label: 'CSV Export' },
          { icon: <ImageOutlinedIcon sx={{ fontSize: 20, color: '#616161' }} />, label: 'PNG Export' },
        ].map((item, i) => (
          <MenuItem key={i} onClick={close} sx={{ height: 36, px: 2 }}>
            <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
            <ListItemText>
              <Typography sx={{ fontSize: 15, fontWeight: 400, color: '#212121', fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>{item.label}</Typography>
            </ListItemText>
          </MenuItem>
        ))}

        <Divider />

        <MenuItem onClick={() => { close(); setDashboardModalOpen(true) }} sx={{ height: 36, px: 2 }}>
          <ListItemIcon sx={{ minWidth: 36 }}><DashboardCustomizeOutlinedIcon sx={{ fontSize: 20, color: '#616161' }} /></ListItemIcon>
          <ListItemText>
            <Typography sx={{ fontSize: 15, fontWeight: 400, color: '#212121', fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>Add to Dashboard</Typography>
          </ListItemText>
        </MenuItem>

        <Divider />

        {[
          { icon: <OpenInFullIcon sx={{ fontSize: 20, color: '#616161' }} />, label: 'View Fullscreen' },
          { icon: <VisibilityOffOutlinedIcon sx={{ fontSize: 20, color: '#616161' }} />, label: 'Hide Widget' },
        ].map((item, i) => (
          <MenuItem key={i} onClick={close} sx={{ height: 36, px: 2 }}>
            <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
            <ListItemText>
              <Typography sx={{ fontSize: 15, fontWeight: 400, color: '#212121', fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>{item.label}</Typography>
            </ListItemText>
          </MenuItem>
        ))}
      </Menu>

      <AddToDashboardModal open={dashboardModalOpen} onClose={() => setDashboardModalOpen(false)} onSave={(name) => onDashboardSave({ name, message: <>Widget successfully added to the &ldquo;{name}&rdquo; Dashboard.</> })} />
    </>
  )
}

export default WidgetMenu
