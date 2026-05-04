import { useState, useMemo } from 'react'
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Typography, Button, TextField, Box,
  InputAdornment, List, ListItemButton, ListItemIcon, ListItemText,
  Collapse, IconButton, Radio, RadioGroup, FormControlLabel,
  FormControl, InputLabel, Select, MenuItem,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import FolderIcon from '@mui/icons-material/Folder'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import CloseIcon from '@mui/icons-material/Close'
import CancelIcon from '@mui/icons-material/Cancel'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'

const MOCK_FOLDERS = [
  {
    name: 'Brand Reputation',
    dashboards: ['Brand 5', 'B Dashboard Name', 'Brand monitor for Meltwater'],
  },
  {
    name: 'Campaign Monitoring',
    dashboards: ['Dashboard Name', 'Brand monitor for Meltwater', 'Dashboard Name'],
  },
  {
    name: 'Competitive Analysis',
    dashboards: ['Competitor Tracker', 'Market Share'],
  },
  {
    name: 'North America',
    dashboards: ['NA Overview', 'Regional Trends'],
  },
  {
    name: 'Media Analytics',
    dashboards: ['Media Coverage', 'Sentiment Report'],
  },
  {
    name: 'EMEA',
    dashboards: ['EMEA Overview', 'UK Focus'],
  },
]

function AddToDashboardModal({ open, onClose, onSave, hideTabSelect, subtext = 'Add this chart to a dashboard to track it alongside your other insights.' }) {
  const [dashboardSearch, setDashboardSearch] = useState('')
  const [selectedDashboard, setSelectedDashboard] = useState('')
  const [dashboardDropdownOpen, setDashboardDropdownOpen] = useState(false)
  const [expandedFolders, setExpandedFolders] = useState({})
  const [selectedTab, setSelectedTab] = useState('Overview')
  const [tabDropdownOpen, setTabDropdownOpen] = useState(false)
  const [showError, setShowError] = useState(false)
  const [dashboardMode, setDashboardMode] = useState('existing')
  const [newDashboardName, setNewDashboardName] = useState('')
  const [newDashboardFolder, setNewDashboardFolder] = useState('')

  const handleClose = () => {
    setDashboardSearch('')
    setSelectedDashboard('')
    setShowError(false)
    setDashboardDropdownOpen(false)
    setExpandedFolders({})
    setSelectedTab('Overview')
    setTabDropdownOpen(false)
    setDashboardMode('existing')
    setNewDashboardName('')
    setNewDashboardFolder('')
    onClose()
  }

  const toggleFolder = (folderName) => {
    setExpandedFolders(prev => ({ ...prev, [folderName]: !prev[folderName] }))
  }

  const selectDashboard = (name) => {
    setSelectedDashboard(name)
    setDashboardDropdownOpen(false)
    setDashboardSearch('')
    setShowError(false)
  }

  const selectTab = (name) => {
    setSelectedTab(name)
    setTabDropdownOpen(false)
  }

  const MOCK_TABS = ['Overview', 'Analytics', 'Topic Analysis', 'Twitter Insight', 'Authors', 'Media Contacts']

  const filteredFolders = useMemo(() => {
    if (!dashboardSearch) return MOCK_FOLDERS
    const q = dashboardSearch.toLowerCase()
    return MOCK_FOLDERS.filter(f =>
      f.name.toLowerCase().includes(q) ||
      f.dashboards.some(d => d.toLowerCase().includes(q))
    )
  }, [dashboardSearch])

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth
      PaperProps={{ sx: { borderRadius: 1, overflow: 'visible', height: 400, maxWidth: 468, width: '100%' } }}
    >
      <DialogTitle sx={{ pb: 0.5, pt: 2.5, px: 3 }}>
        <Typography sx={{ fontSize: 18, fontWeight: 700, color: '#212121' }}>{hideTabSelect ? 'Add Tab to Dashboard' : 'Add to Dashboard'}</Typography>
        <Typography sx={{ fontSize: 14, color: '#212121', mt: 1 }}>{subtext}</Typography>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pt: '8px !important', pb: 2, overflow: 'visible' }}>
        <RadioGroup row value={dashboardMode} onChange={(e) => { setDashboardMode(e.target.value); setSelectedDashboard(''); setDashboardSearch(''); setDashboardDropdownOpen(false); setExpandedFolders({}); setSelectedTab('Overview'); setTabDropdownOpen(false); setShowError(false); setNewDashboardName(''); setNewDashboardFolder('') }} sx={{ mb: 2.5 }}>
          <FormControlLabel value="existing" control={<Radio sx={{ color: '#9e9e9e', '&.Mui-checked': { color: '#00827F' } }} />} label={<Typography sx={{ fontSize: 15 }}>Add to Existing</Typography>} />
          <FormControlLabel value="new" control={<Radio sx={{ color: '#9e9e9e', '&.Mui-checked': { color: '#00827F' } }} />} label={<Typography sx={{ fontSize: 15 }}>Create New</Typography>} />
        </RadioGroup>

        {/* New dashboard fields */}
        {dashboardMode === 'new' && (
          <>
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="Dashboard Name"
                value={newDashboardName}
                onChange={(e) => { if (e.target.value.length <= 50) setNewDashboardName(e.target.value) }}
                error={showError && !newDashboardName.trim()}
                helperText={showError && !newDashboardName.trim() ? 'Please enter a dashboard name' : ''}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 0.5,
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#00827F' },
                  },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#00827F' },
                }}
              />
              <Typography sx={{ fontSize: 12, color: 'text.secondary', textAlign: 'right', mt: 0.5 }}>
                {newDashboardName.length}/50
              </Typography>
            </Box>
            <FormControl fullWidth>
              <InputLabel sx={{ '&.Mui-focused': { color: '#00827F' } }}>Select Folder</InputLabel>
              <Select
                value={newDashboardFolder}
                onChange={(e) => setNewDashboardFolder(e.target.value)}
                label="Select Folder"
                sx={{
                  borderRadius: 0.5, height: 56,
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#00827F' },
                }}
              >
                {MOCK_FOLDERS.map((f) => (
                  <MenuItem key={f.name} value={f.name}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FolderIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                      <Typography sx={{ fontSize: 14 }}>{f.name}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        )}

        {/* Dashboard field (existing mode) */}
        {dashboardMode === 'existing' && <Box sx={{ position: 'relative', mb: selectedDashboard ? 2.5 : 0 }}>
          <Box
            onClick={() => setDashboardDropdownOpen(!dashboardDropdownOpen)}
            sx={{
              border: '1px solid', borderColor: showError && !selectedDashboard ? '#d32f2f' : dashboardDropdownOpen ? '#00827F' : 'rgba(0,0,0,0.23)',
              borderRadius: 0.5, px: 1.75, height: 56, cursor: 'pointer', position: 'relative',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              '&:hover': { borderColor: showError && !selectedDashboard ? '#d32f2f' : dashboardDropdownOpen ? '#00827F' : 'rgba(0,0,0,0.87)' },
            }}
          >
            <Typography
              sx={{ position: 'absolute', top: -9, left: 10, bgcolor: 'white', px: 0.5, fontSize: 12, color: showError && !selectedDashboard ? '#d32f2f' : dashboardDropdownOpen ? '#00827F' : 'rgba(0,0,0,0.6)' }}
            >
              Dashboard
            </Typography>
            <Typography sx={{ fontSize: 14, color: selectedDashboard ? '#212121' : '#9e9e9e' }}>
              {selectedDashboard || 'Select Dashboard'}
            </Typography>
            <ArrowDropDownIcon sx={{ fontSize: 20, color: 'rgba(0,0,0,0.54)' }} />
          </Box>
          {showError && !selectedDashboard && (
            <Typography sx={{ fontSize: 12, color: '#d32f2f', mt: 0.5 }}>Please select or create a dashboard</Typography>
          )}

          {/* Dashboard dropdown */}
          {dashboardDropdownOpen && (
            <Box sx={{
              position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10,
              bgcolor: 'white', border: '1px solid #e0e0e0', borderRadius: 1,
              boxShadow: '0px 4px 8px rgba(0,0,0,0.15)', mt: 0.5, maxHeight: 300, overflow: 'auto',
            }}>
              <Box sx={{ px: 1.5, pt: 1.5, pb: 1, position: 'sticky', top: 0, bgcolor: 'white', zIndex: 1, borderBottom: '1px solid #e0e0e0' }}>
                <TextField
                  fullWidth size="small" autoFocus
                  placeholder="Find"
                  value={dashboardSearch}
                  onChange={(e) => setDashboardSearch(e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 20, color: '#9e9e9e' }} /></InputAdornment>,
                    endAdornment: dashboardSearch ? (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setDashboardSearch('')}>
                          <CancelIcon sx={{ fontSize: 18, color: '#9e9e9e' }} />
                        </IconButton>
                      </InputAdornment>
                    ) : null,
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0, '& fieldset': { border: 'none' } } }}
                />
              </Box>

              {dashboardSearch && (
                <ListItemButton onClick={() => selectDashboard(dashboardSearch)} sx={{ px: 2, height: 36 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <AddCircleOutlineIcon sx={{ fontSize: 20, color: '#00827F' }} />
                  </ListItemIcon>
                  <ListItemText>
                    <Typography sx={{ fontSize: 14, color: '#00827F', fontWeight: 500 }}>
                      Create Dashboard "{dashboardSearch}"
                    </Typography>
                  </ListItemText>
                </ListItemButton>
              )}

              <List disablePadding>
                {filteredFolders.map((folder) => (
                  <Box key={folder.name}>
                    <ListItemButton onClick={() => toggleFolder(folder.name)} sx={{ px: 2, height: 36 }}>
                      {expandedFolders[folder.name]
                        ? <ExpandMoreIcon sx={{ fontSize: 18, color: 'rgba(0,0,0,0.87)', mr: 0.5 }} />
                        : <ChevronRightIcon sx={{ fontSize: 18, color: 'rgba(0,0,0,0.87)', mr: 0.5 }} />
                      }
                      <FolderIcon sx={{ fontSize: 18, color: 'text.secondary', mr: 1 }} />
                      <Typography sx={{ fontSize: 14, color: '#212121' }}>{folder.name}</Typography>
                    </ListItemButton>
                    <Collapse in={expandedFolders[folder.name]}>
                      {folder.dashboards.map((db, i) => (
                        <ListItemButton key={i} onClick={() => selectDashboard(db)} selected={selectedDashboard === db} sx={{ pl: 7, height: 36, '&.Mui-selected': { bgcolor: 'rgba(0,130,127,0.08)' }, '&.Mui-selected:hover': { bgcolor: 'rgba(0,130,127,0.12)' } }}>
                          <Typography sx={{ fontSize: 14, color: '#424242', fontWeight: selectedDashboard === db ? 600 : 400 }}>{db}</Typography>
                        </ListItemButton>
                      ))}
                    </Collapse>
                  </Box>
                ))}
              </List>
            </Box>
          )}
        </Box>}

        {/* Tab field — shown after dashboard is selected */}
        {selectedDashboard && !hideTabSelect && (
          <Box sx={{ position: 'relative' }}>
            <Box
              onClick={() => setTabDropdownOpen(!tabDropdownOpen)}
              sx={{
                border: '1px solid', borderColor: tabDropdownOpen ? '#00827F' : 'rgba(0,0,0,0.23)',
                borderRadius: 0.5, px: 1.75, height: 56, cursor: 'pointer', position: 'relative',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                '&:hover': { borderColor: tabDropdownOpen ? '#00827F' : 'rgba(0,0,0,0.87)' },
              }}
            >
              <Typography
                sx={{ position: 'absolute', top: -9, left: 10, bgcolor: 'white', px: 0.5, fontSize: 12, color: tabDropdownOpen ? '#00827F' : 'rgba(0,0,0,0.6)' }}
              >
                Tab
              </Typography>
              <Typography sx={{ fontSize: 14, color: '#212121' }}>
                {selectedTab}
              </Typography>
              <ArrowDropDownIcon sx={{ fontSize: 20, color: 'rgba(0,0,0,0.54)' }} />
            </Box>

            <Typography sx={{ fontSize: 13, color: 'text.secondary', fontStyle: 'italic', mt: 0.75 }}>
              Added to the bottom of the tab
            </Typography>

            {/* Tab dropdown */}
            {tabDropdownOpen && (
              <Box sx={{
                position: 'absolute', top: 44, left: 0, right: 0, zIndex: 10,
                bgcolor: 'white', border: '1px solid #e0e0e0', borderRadius: 1,
                boxShadow: '0px 4px 8px rgba(0,0,0,0.15)', maxHeight: 220, overflow: 'auto',
              }}>
                <List disablePadding>
                  {MOCK_TABS.map((tab) => (
                    <ListItemButton
                      key={tab}
                      selected={selectedTab === tab}
                      onClick={() => selectTab(tab)}
                      sx={{
                        px: 2, height: 36,
                        '&.Mui-selected': { bgcolor: 'rgba(0,130,127,0.08)' },
                        '&.Mui-selected:hover': { bgcolor: 'rgba(0,130,127,0.12)' },
                      }}
                    >
                      <Typography sx={{ fontSize: 14, color: '#212121' }}>{tab}</Typography>
                    </ListItemButton>
                  ))}
                </List>
              </Box>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={handleClose} sx={{ color: '#00827F', fontWeight: 600, textTransform: 'none', fontSize: 14 }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            if (dashboardMode === 'new') {
              if (!newDashboardName.trim()) { setShowError(true); return }
              if (onSave) onSave(newDashboardName.trim())
              handleClose()
            } else {
              if (!selectedDashboard) { setShowError(true); return }
              if (onSave) onSave(selectedDashboard)
              handleClose()
            }
          }}
          sx={{
            bgcolor: '#00827F', color: 'white', fontWeight: 600, textTransform: 'none', fontSize: 14,
            '&:hover': { bgcolor: '#00726E' },
          }}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddToDashboardModal
