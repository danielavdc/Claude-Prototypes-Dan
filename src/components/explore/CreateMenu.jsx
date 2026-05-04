import { Menu, MenuItem, Typography, ListItemIcon, Divider, Box } from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import ManageSearchIcon from '@mui/icons-material/ManageSearch'
import CodeIcon from '@mui/icons-material/Code'
import CallMergeIcon from '@mui/icons-material/CallMerge'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined'
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined'

const SEARCH_ITEMS = [
  { key: 'keyword', label: 'Keyword Search', icon: <ManageSearchIcon sx={{ fontSize: 20, color: '#616161' }} />, info: true },
  { key: 'advanced', label: 'Advanced Search', icon: <CodeIcon sx={{ fontSize: 20, color: '#616161' }} />, info: true },
  { key: 'combined', label: 'Combined Search', icon: <CallMergeIcon sx={{ fontSize: 20, color: '#616161' }} />, info: true },
]

const FILTER_ITEMS = [
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
        <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#9e9e9e', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Search</Typography>
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
        <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#9e9e9e', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Filters</Typography>
      </Box>
      {FILTER_ITEMS.map(item => (
        <MenuItem key={item.key} onClick={() => { onClose(); onSelect?.(item.key) }} sx={{ px: 2, py: 1 }}>
          <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
          <Typography sx={{ fontSize: 15, color: '#212121' }}>{item.label}</Typography>
        </MenuItem>
      ))}
    </Menu>
  )
}
