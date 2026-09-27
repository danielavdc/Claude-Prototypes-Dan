import { Menu, MenuItem, Typography, ListItemIcon, Divider, Box } from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
import TuneIcon from '@mui/icons-material/Tune'
import CodeIcon from '@mui/icons-material/Code'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined'
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined'

// The 3 core search experiences (terminology kept consistent with the landing entry points)
const SEARCH_ITEMS = [
  { key: 'ai-assistant', label: 'Search Assistant', icon: <AutoFixHighIcon sx={{ fontSize: 20, color: '#8B49A0' }} />, info: true },
  { key: 'keyword', label: 'Simple Search Builder', icon: <TuneIcon sx={{ fontSize: 20, color: '#616161' }} />, info: true },
  { key: 'advanced', label: 'Advanced Search', icon: <CodeIcon sx={{ fontSize: 20, color: '#616161' }} />, info: true },
]

const ASSET_ITEMS = [
  { key: 'author-list', label: 'Author List', icon: <PeopleAltOutlinedIcon sx={{ fontSize: 20, color: '#616161' }} /> },
  { key: 'custom-category', label: 'Custom Category', icon: <AccountTreeOutlinedIcon sx={{ fontSize: 20, color: '#616161' }} /> },
  { key: 'filter-set', label: 'Filter Set', icon: <FilterAltOutlinedIcon sx={{ fontSize: 20, color: '#616161' }} /> },
]

export default function CreateMenu({ anchorEl, onClose, onSelect }) {
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      PaperProps={{ elevation: 4, sx: { width: 280, borderRadius: 1, mt: 0.5 } }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <Box sx={{ px: 2, pt: 1.5, pb: 0.5 }}>
        <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#9e9e9e', letterSpacing: '0.08em', textTransform: 'uppercase' }}>New search</Typography>
      </Box>
      {SEARCH_ITEMS.map(item => (
        <MenuItem key={item.key} onClick={() => { onClose(); onSelect?.(item.key) }} sx={{ px: 2, py: 1, display: 'flex', alignItems: 'center' }}>
          <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
          <Typography sx={{ fontSize: 15, color: '#212121', flex: 1 }}>{item.label}</Typography>
          {item.info && <InfoOutlinedIcon sx={{ fontSize: 16, color: '#9e9e9e' }} />}
        </MenuItem>
      ))}

      <Divider sx={{ my: 1 }} />

      <Box sx={{ px: 2, pb: 0.5 }}>
        <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#9e9e9e', letterSpacing: '0.08em', textTransform: 'uppercase' }}>New asset</Typography>
      </Box>
      {ASSET_ITEMS.map(item => (
        <MenuItem key={item.key} onClick={() => { onClose(); onSelect?.(item.key) }} sx={{ px: 2, py: 1 }}>
          <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
          <Typography sx={{ fontSize: 15, color: '#212121' }}>{item.label}</Typography>
        </MenuItem>
      ))}
    </Menu>
  )
}
