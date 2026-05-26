import { useState, useMemo } from 'react'
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Typography, Button, TextField, Box, IconButton,
  Divider, Chip, Checkbox, InputAdornment,
  Collapse, Switch,
} from '@mui/material'
import CancelIcon from '@mui/icons-material/Cancel'
import SearchIcon from '@mui/icons-material/Search'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import NotificationAddOutlinedIcon from '@mui/icons-material/NotificationAddOutlined'
import ForwardToInboxOutlinedIcon from '@mui/icons-material/ForwardToInboxOutlined'

const MOCK_LABELS = [
  'Soda Brands',
  'The Choice Campaign',
  'Brand Monitoring',
  'Competitor Watch',
  'Social Listening',
]

function SaveSearchModal({ open, onClose, onSave }) {
  const [name, setName] = useState('')
  const [selectedLabels, setSelectedLabels] = useState([])
  const [showError, setShowError] = useState(false)
  const [smartAlertsOpen, setSmartAlertsOpen] = useState(false)
  const [emailDigestOpen, setEmailDigestOpen] = useState(false)
  const [emailDigestEnabled, setEmailDigestEnabled] = useState(false)
  const [enabledAlerts, setEnabledAlerts] = useState({})
  const [labelDropdownOpen, setLabelDropdownOpen] = useState(false)
  const [labelSearch, setLabelSearch] = useState('')

  const filteredLabels = useMemo(() => {
    if (!labelSearch) return MOCK_LABELS
    const q = labelSearch.toLowerCase()
    return MOCK_LABELS.filter(l => l.toLowerCase().includes(q))
  }, [labelSearch])

  const toggleLabel = (label) => {
    setSelectedLabels(prev =>
      prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
    )
  }

  const toggleAlert = (title) => {
    setEnabledAlerts(prev => ({ ...prev, [title]: !prev[title] }))
  }

  const activeAlertNames = ['Spike Detection', 'Sentiment Shift', 'Every Mention'].filter(a => enabledAlerts[a])

  const handleClose = () => {
    setName('')
    setSelectedLabels([])
    setShowError(false)
    setSmartAlertsOpen(false)
    setEmailDigestOpen(false)
    setEmailDigestEnabled(false)
    setEnabledAlerts({})
    setLabelDropdownOpen(false)
    setLabelSearch('')
    onClose()
  }

  const handleSave = () => {
    if (!name.trim()) {
      setShowError(true)
      return
    }
    const extras = []
    if (activeAlertNames.length > 0) extras.push('Alert Created')
    if (emailDigestEnabled) extras.push('Email Digest Created')
    const message = extras.length > 0
      ? `Search Saved. ${extras.join(' and ')}`
      : 'Search Saved.'
    if (onSave) onSave(name.trim(), message)
    handleClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth
      PaperProps={{ sx: { borderRadius: 1 } }}
    >
      <DialogTitle sx={{ pb: 0.5, pt: 2.5, px: 3 }}>
        <Typography sx={{ fontSize: 18, fontWeight: 700, color: '#212121' }}>Save Search</Typography>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pt: '16px !important', pb: 2 }}>
        {/* Name input */}
        <Box sx={{ position: 'relative', mb: 0.5 }}>
          <TextField
            fullWidth
            label="Name"
            placeholder=""
            value={name}
            onChange={(e) => {
              if (e.target.value.length <= 100) {
                setName(e.target.value)
                setShowError(false)
              }
            }}
            error={showError && !name.trim()}
            helperText={showError && !name.trim() ? 'Please enter a search name' : ''}
            InputProps={{
              endAdornment: name ? (
                <IconButton size="small" onClick={() => setName('')} sx={{ p: 0.25 }}>
                  <CancelIcon sx={{ fontSize: 20, color: '#9e9e9e' }} />
                </IconButton>
              ) : null,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 0.5,
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#00827F' },
              },
              '& .MuiInputLabel-root.Mui-focused': { color: '#00827F' },
            }}
          />
          <Typography sx={{ fontSize: 12, color: 'text.secondary', textAlign: 'right', mt: 0.5 }}>
            {name.length}/100
          </Typography>
        </Box>

        {/* Labels dropdown */}
        <Box sx={{ position: 'relative', mb: 3 }}>
          <Box
            onClick={() => setLabelDropdownOpen(!labelDropdownOpen)}
            sx={{
              border: '1px solid', borderColor: labelDropdownOpen ? '#00827F' : 'rgba(0,0,0,0.23)',
              borderRadius: 0.5, px: 1.75, height: 56, cursor: 'pointer', position: 'relative',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              '&:hover': { borderColor: labelDropdownOpen ? '#00827F' : 'rgba(0,0,0,0.87)' },
            }}
          >
            <Typography
              sx={{ position: 'absolute', top: -9, left: 10, bgcolor: 'white', px: 0.5, fontSize: 12, color: labelDropdownOpen ? '#00827F' : 'rgba(0,0,0,0.6)' }}
            >
              Add Labels
            </Typography>
            <Typography sx={{ fontSize: 14, color: selectedLabels.length > 0 ? '#212121' : '#9e9e9e', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', pr: 1 }}>
              {selectedLabels.length > 0 ? selectedLabels.join(', ') : 'Select Labels'}
            </Typography>
            <ArrowDropDownIcon sx={{ fontSize: 20, color: 'rgba(0,0,0,0.54)' }} />
          </Box>

          {labelDropdownOpen && (
            <Box sx={{
              position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10,
              bgcolor: 'white', border: '1px solid #e0e0e0', borderRadius: 1,
              boxShadow: '0px 4px 8px rgba(0,0,0,0.15)', mt: 0.5, maxHeight: 300, overflow: 'auto',
            }}>
              <Box sx={{ px: 1.5, pt: 1.5, pb: 1, position: 'sticky', top: 0, bgcolor: 'white', zIndex: 1, borderBottom: '1px solid #e0e0e0' }}>
                <TextField
                  fullWidth size="small" autoFocus
                  placeholder="Find or create a label"
                  value={labelSearch}
                  onChange={(e) => setLabelSearch(e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 20, color: '#9e9e9e' }} /></InputAdornment>,
                    endAdornment: labelSearch ? (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setLabelSearch('')}>
                          <CancelIcon sx={{ fontSize: 18, color: '#9e9e9e' }} />
                        </IconButton>
                      </InputAdornment>
                    ) : null,
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0, '& fieldset': { border: 'none' } } }}
                />
              </Box>
              {filteredLabels.map((label) => (
                <Box
                  key={label}
                  onClick={() => toggleLabel(label)}
                  sx={{ px: 1, height: 36, display: 'flex', alignItems: 'center', cursor: 'pointer', '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } }}
                >
                  <Checkbox
                    checked={selectedLabels.includes(label)}
                    size="small"
                    sx={{ p: 0.5, color: '#9e9e9e', '&.Mui-checked': { color: '#00827F' } }}
                  />
                  <Typography sx={{ fontSize: 14, color: '#212121', ml: 0.5 }}>{label}</Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>

        <Divider sx={{ mb: 2.5, mx: -3 }} />

        {/* Email Subscription section */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#212121', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Email Subscription
          </Typography>
          <Chip label="Recommended" size="small" variant="outlined" sx={{
            bgcolor: '#ECEEF8', color: '#3F51B5', borderColor: '#9FA8DA', fontSize: 12, fontWeight: 700,
            height: 28, borderRadius: 5,
          }} />
        </Box>

        {/* Smart Alerts */}
        <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 2, mb: 1.5, overflow: 'hidden' }}>
          <Box onClick={() => setSmartAlertsOpen(!smartAlertsOpen)}
            sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: '#ECEEF8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <NotificationAddOutlinedIcon sx={{ fontSize: 20, color: '#3F51B5' }} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#212121' }}>Smart Alerts</Typography>
                <Typography sx={{ fontSize: 13, color: activeAlertNames.length > 0 ? '#689F38' : '#757575' }}>
                  {activeAlertNames.length > 0 ? activeAlertNames.join(', ') : 'Enable trial alerts'}
                </Typography>
              </Box>
            </Box>
            {smartAlertsOpen
              ? <KeyboardArrowUpIcon sx={{ fontSize: 24, color: '#616161' }} />
              : <KeyboardArrowDownIcon sx={{ fontSize: 24, color: '#616161' }} />
            }
          </Box>
          <Collapse in={smartAlertsOpen}>
            <Box sx={{ bgcolor: '#E8EAF6', mx: 1.5, mb: 1.5, borderRadius: 1, p: 2 }}>
              <Typography sx={{ fontSize: 13, color: '#212121', mb: 2 }}>
                Send me email alerts for <strong>7 days.</strong> Extend anytime.
              </Typography>
              {[
                { title: 'Spike Detection', desc: 'Alert me when volume suddenly increases' },
                { title: 'Sentiment Shift', desc: 'Alert me when conversation tone changes' },
                { title: 'Every Mention', desc: 'Receive an alert for every new mention' },
              ].map((alert) => (
                <Box key={alert.title} sx={{
                  bgcolor: 'white', borderRadius: 1, px: 2, py: 1.5, mb: 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  '&:last-child': { mb: 0 },
                }}>
                  <Box>
                    <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#212121' }}>{alert.title}</Typography>
                    <Typography sx={{ fontSize: 13, color: '#757575' }}>{alert.desc}</Typography>
                  </Box>
                  <Switch size="small" checked={!!enabledAlerts[alert.title]} onChange={() => toggleAlert(alert.title)} sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': { color: '#00827F' },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#00827F' },
                  }} />
                </Box>
              ))}
            </Box>
          </Collapse>
        </Box>

        {/* Email Digest */}
        <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 2, overflow: 'hidden' }}>
          <Box onClick={() => setEmailDigestOpen(!emailDigestOpen)}
            sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: '#ECEEF8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ForwardToInboxOutlinedIcon sx={{ fontSize: 20, color: '#3F51B5' }} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#212121' }}>Email Digest</Typography>
                <Typography sx={{ fontSize: 13, color: emailDigestEnabled ? '#689F38' : '#757575' }}>
                  {emailDigestEnabled ? 'Daily at 8:00AM, Mon-Fri' : 'Schedule directly to your email'}
                </Typography>
              </Box>
            </Box>
            {emailDigestOpen
              ? <KeyboardArrowUpIcon sx={{ fontSize: 24, color: '#616161' }} />
              : <KeyboardArrowDownIcon sx={{ fontSize: 24, color: '#616161' }} />
            }
          </Box>
          <Collapse in={emailDigestOpen}>
            <Box sx={{ bgcolor: '#E8EAF6', mx: 1.5, mb: 1.5, borderRadius: 1, p: 2 }}>
              <Typography sx={{ fontSize: 13, color: '#212121', mb: 2, lineHeight: 1.6 }}>
                Receive a scheduled email with the latest results from this search for <strong>7 days</strong>. We&rsquo;ll email you before it ends so you can choose to continue or stop.
              </Typography>
              <Box sx={{ bgcolor: 'white', borderRadius: 1, overflow: 'hidden' }}>
                <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#212121' }}>Schedule to my email</Typography>
                    <Typography sx={{ fontSize: 13, color: '#757575' }}>angelica.gutierrez@meltwater.com</Typography>
                  </Box>
                  <Switch size="small" checked={emailDigestEnabled} onChange={() => setEmailDigestEnabled(!emailDigestEnabled)} sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': { color: '#00827F' },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#00827F' },
                  }} />
                </Box>
                <Divider />
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography sx={{ fontSize: 14, color: '#212121' }}>Email Daily at 8:00 AM PST</Typography>
                </Box>
              </Box>
            </Box>
          </Collapse>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={handleClose} sx={{ color: '#00827F', fontWeight: 600, textTransform: 'none', fontSize: 14 }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          sx={{
            bgcolor: '#00827F', color: 'white', fontWeight: 600, textTransform: 'none', fontSize: 14,
            '&:hover': { bgcolor: '#00726E' },
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default SaveSearchModal
