import { useState } from 'react'
import { Box, Typography, Button, Checkbox, IconButton, Divider, Dialog, TextField, MenuItem, Switch, Menu } from '@mui/material'
import { alpha } from '@mui/material/styles'
import CloseIcon from '@mui/icons-material/Close'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'

const TEAL = '#1D9F9F'
const TEAL_DARK = '#00827F'

const checkboxSx = { p: 0, mr: 1.5, '&.Mui-checked': { color: TEAL_DARK } }

// Small teal "N Unit(s) ▾" control, inline within a rule's sentence, opens a menu of numeric options.
function ComboDropdown({ value, unit, options, onChange }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const label = `${value} ${unit}${value === 1 ? '' : 's'}`
  return (
    <>
      <Box onClick={(e) => { e.stopPropagation(); setAnchorEl(e.currentTarget) }}
        sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.25, px: 1, py: 0.4, border: '1px solid', borderColor: TEAL, borderRadius: 1, cursor: 'pointer', bgcolor: 'background.paper', '&:hover': { bgcolor: alpha(TEAL, 0.06) } }}>
        <Typography sx={{ fontSize: 15, fontWeight: 700, color: TEAL_DARK }}>{label}</Typography>
        <ArrowDropDownIcon sx={{ fontSize: 20, color: TEAL_DARK }} />
      </Box>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        {options.map(o => (
          <MenuItem key={o} onClick={() => { onChange(o); setAnchorEl(null) }} sx={{ fontSize: 14 }}>{o} {unit}{o === 1 ? '' : 's'}</MenuItem>
        ))}
      </Menu>
    </>
  )
}

export default function AutoCleanupModal({ open, onClose }) {
  const [rules, setRules] = useState({})
  const [noReplyEmails, setNoReplyEmails] = useState(3)
  const [lowActivityMonths, setLowActivityMonths] = useState(2)
  const [frequency, setFrequency] = useState('Weekly')
  const [requireApproval, setRequireApproval] = useState(false)

  const toggleRule = (key) => setRules(prev => ({ ...prev, [key]: !prev[key] }))

  const rowSx = { display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, py: 1.25, cursor: 'pointer' }
  const textSx = { fontSize: 16, color: '#212121' }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: 2 } } }}>
      {/* Header */}
      <Box sx={{ px: 3, pt: 2.5, pb: 2, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Typography sx={{ fontSize: 19, fontWeight: 700, color: '#212121' }}>Auto Clean-Up Rules for “Eco Media List”</Typography>
        <IconButton size="small" onClick={onClose} sx={{ mt: -0.5, mr: -1, flexShrink: 0 }}><CloseIcon sx={{ fontSize: 22, color: '#616161' }} /></IconButton>
      </Box>
      <Divider />

      {/* Rules */}
      <Box sx={{ px: 3, py: 2 }}>
        <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#212121', mb: 0.5 }}>Remove When Contact:</Typography>

        <Box onClick={() => toggleRule('unsubscribe')} sx={rowSx}>
          <Checkbox checked={!!rules.unsubscribe} sx={checkboxSx} disableRipple />
          <Typography sx={textSx}>Unsubscribes</Typography>
        </Box>

        <Box onClick={() => toggleRule('noReply')} sx={rowSx}>
          <Checkbox checked={!!rules.noReply} sx={checkboxSx} disableRipple />
          <Typography sx={textSx}>Hasn’t reply after</Typography>
          <ComboDropdown value={noReplyEmails} unit="Email" options={[1, 2, 3, 4, 5]} onChange={setNoReplyEmails} />
          <Typography sx={textSx}>attempts</Typography>
        </Box>

        <Box onClick={() => toggleRule('lowActivity')} sx={rowSx}>
          <Checkbox checked={!!rules.lowActivity} sx={checkboxSx} disableRipple />
          <Typography sx={textSx}>Hasn't published in the last</Typography>
          <ComboDropdown value={lowActivityMonths} unit="Month" options={[1, 2, 3, 6]} onChange={setLowActivityMonths} />
        </Box>

        <Box onClick={() => toggleRule('bounced')} sx={{ ...rowSx, pb: 0 }}>
          <Checkbox checked={!!rules.bounced} sx={checkboxSx} disableRipple />
          <Typography sx={textSx}>Email has bounced</Typography>
        </Box>
      </Box>
      <Divider />

      {/* Review frequency */}
      <Box sx={{ px: 3, py: 2 }}>
        <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#212121', mb: 1.5 }}>Review Frequency</Typography>
        <TextField select fullWidth size="small" label="Check media lists" value={frequency} onChange={e => setFrequency(e.target.value)}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 }, '& label.Mui-focused': { color: TEAL_DARK }, '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: TEAL_DARK } }}>
          {['Daily', 'Weekly', 'Biweekly', 'Monthly'].map(o => <MenuItem key={o} value={o} sx={{ fontSize: 15 }}>{o}</MenuItem>)}
        </TextField>
      </Box>
      <Divider />

      {/* Require approval toggle */}
      <Box sx={{ px: 3, py: 1.75, bgcolor: alpha(TEAL, 0.06), display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Switch checked={requireApproval} onChange={(e) => setRequireApproval(e.target.checked)}
          sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: TEAL_DARK }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: TEAL_DARK } }} />
        <Typography sx={{ fontSize: 15.5, color: '#212121' }}>Require approval by email before removing contacts</Typography>
      </Box>
      <Divider />

      {/* Footer */}
      <Box sx={{ px: 3, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1.5 }}>
        <Button onClick={onClose} sx={{ textTransform: 'none', color: TEAL_DARK, fontWeight: 700, fontSize: 15 }}>Cancel</Button>
        <Button onClick={onClose} variant="contained" disableElevation
          sx={{ textTransform: 'none', bgcolor: TEAL_DARK, '&:hover': { bgcolor: '#006B68' }, fontWeight: 700, fontSize: 15, px: 2.5, py: 1, borderRadius: 1.5 }}>
          Save Rules
        </Button>
      </Box>
    </Dialog>
  )
}
