import { useState } from 'react'
import { Box, Typography, Button, Checkbox, IconButton, Divider, Dialog, TextField, MenuItem, Switch, Menu } from '@mui/material'
import { alpha } from '@mui/material/styles'
import CloseIcon from '@mui/icons-material/Close'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'

const TEAL_DARK = '#00827F'
const INDIGO = '#5B4FC4'
const INDIGO_BG = alpha(INDIGO, 0.08)

const RULES = [
  { key: 'unsubscribe', label: 'Contact Unsubscribes' },
  { key: 'noReply', label: 'Hasn’t replied recently', criteria: 'noReply' },
  { key: 'lowActivity', label: 'Has low publication activity', criteria: 'lowActivity' },
  { key: 'bounced', label: 'Email has bounced' },
]

const checkboxSx = { p: 0, mr: 1.5, '&.Mui-checked': { color: TEAL_DARK } }

// Small "N Unit(s) ▾" control that opens a menu of numeric options.
function ComboDropdown({ value, unit, options, onChange }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const label = `${value} ${unit}${value === 1 ? '' : 's'}`
  return (
    <>
      <Box onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.25, px: 1, py: 0.5, border: '1px solid #bdbdbd', borderRadius: 1, cursor: 'pointer', bgcolor: 'background.paper', '&:hover': { borderColor: '#9e9e9e' } }}>
        <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#212121' }}>{label}</Typography>
        <ArrowDropDownIcon sx={{ fontSize: 20, color: '#616161' }} />
      </Box>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        {options.map(o => (
          <MenuItem key={o} onClick={() => { onChange(o); setAnchorEl(null) }} sx={{ fontSize: 14 }}>{o} {unit}{o === 1 ? '' : 's'}</MenuItem>
        ))}
      </Menu>
    </>
  )
}

function CriteriaBox({ children }) {
  return (
    <Box sx={{ bgcolor: INDIGO_BG, borderRadius: 1.5, p: 2, mt: 1, ml: 4.5 }}>
      <Typography sx={{ fontSize: 14, fontWeight: 700, color: INDIGO, mb: 1 }}>What’s the criteria?</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>{children}</Box>
    </Box>
  )
}

export default function AutoCleanupModal({ open, onClose }) {
  const [rules, setRules] = useState({})
  const [noReplyEmails, setNoReplyEmails] = useState(3)
  const [lowActivityMonths, setLowActivityMonths] = useState(2)
  const [frequency, setFrequency] = useState('Weekly')
  const [requireApproval, setRequireApproval] = useState(false)

  const toggleRule = (key) => setRules(prev => ({ ...prev, [key]: !prev[key] }))

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
        <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#212121', mb: 1.5 }}>Remove contacts when:</Typography>
        {RULES.map((r, i) => (
          <Box key={r.key} sx={{ mb: i === RULES.length - 1 ? 0 : 2 }}>
            <Box onClick={() => toggleRule(r.key)} sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <Checkbox checked={!!rules[r.key]} sx={checkboxSx} disableRipple />
              <Typography sx={{ fontSize: 16, color: '#212121' }}>{r.label}</Typography>
            </Box>
            {r.criteria === 'noReply' && rules.noReply && (
              <CriteriaBox>
                <Typography sx={{ fontSize: 15, color: '#212121' }}>Remove contact after</Typography>
                <ComboDropdown value={noReplyEmails} unit="Email" options={[1, 2, 3, 4, 5]} onChange={setNoReplyEmails} />
                <Typography sx={{ fontSize: 15, color: '#212121' }}>without reply</Typography>
              </CriteriaBox>
            )}
            {r.criteria === 'lowActivity' && rules.lowActivity && (
              <CriteriaBox>
                <Typography sx={{ fontSize: 15, color: '#212121' }}>Hasn’t published in the last</Typography>
                <ComboDropdown value={lowActivityMonths} unit="Month" options={[1, 2, 3, 6]} onChange={setLowActivityMonths} />
              </CriteriaBox>
            )}
          </Box>
        ))}
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
      <Box sx={{ px: 3, py: 1.75, bgcolor: '#F5F7F6', display: 'flex', alignItems: 'center', gap: 1.5 }}>
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
