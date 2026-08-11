import { useState, useEffect } from 'react'
import { Box, Typography, Button, Checkbox, InputBase, Popover } from '@mui/material'
import { alpha } from '@mui/material/styles'
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import SearchIcon from '@mui/icons-material/Search'
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined'

const TEAL = '#1D9F9F'
const TEAL_DARK = '#00827F'

// A filter pill + popover with a search box, checkbox options (optionally shown
// as folders with counts) and Cancel / Apply actions. Selection is committed on Apply.
export default function FilterDropdown({ label, options, selected, onApply, useFolder = false }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const [draft, setDraft] = useState(selected)
  const [query, setQuery] = useState('')

  const open = Boolean(anchorEl)
  const active = selected.length > 0

  // Keep the draft in sync with committed selection whenever the popover opens
  useEffect(() => { if (open) { setDraft(selected); setQuery('') } }, [open]) // eslint-disable-line

  const handleOpen = (e) => setAnchorEl(e.currentTarget)
  const handleClose = () => setAnchorEl(null)
  const toggle = (value) => setDraft(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value])
  const apply = () => { onApply(draft); handleClose() }

  const filtered = options.filter(o => o.value.toLowerCase().includes(query.trim().toLowerCase()))
  const pillText = active ? `${label}: ${selected.length === 1 ? selected[0] : `${selected.length} selected`}` : label

  return (
    <>
      <Box onClick={handleOpen}
        sx={{
          display: 'flex', alignItems: 'center', gap: 0.5, height: 32, px: 1.25, borderRadius: 5, cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap',
          border: '1px solid', borderColor: active ? TEAL : '#e0e0e0', bgcolor: active ? alpha(TEAL, 0.06) : 'background.paper',
          '&:hover': { bgcolor: active ? alpha(TEAL, 0.1) : alpha('#000', 0.02) },
        }}>
        <FilterAltOutlinedIcon sx={{ fontSize: 15, color: active ? TEAL_DARK : '#757575' }} />
        <Typography sx={{ fontSize: 13, fontWeight: active ? 700 : 400, color: active ? TEAL_DARK : '#424242' }}>{pillText}</Typography>
        <ArrowDropDownIcon sx={{ fontSize: 18, color: active ? TEAL_DARK : '#757575' }} />
      </Box>

      <Popover open={open} anchorEl={anchorEl} onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{ paper: { sx: { mt: 0.5, width: 340, borderRadius: 2, boxShadow: '0 8px 24px rgba(0,0,0,0.16)', overflow: 'hidden' } } }}>
        {/* Search */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 1.5, borderBottom: '1px solid #eee' }}>
          <SearchIcon sx={{ fontSize: 20, color: '#9e9e9e' }} />
          <InputBase autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder="Find" sx={{ flex: 1, fontSize: 15 }} />
        </Box>
        {/* Options */}
        <Box sx={{ maxHeight: 280, overflow: 'auto', py: 0.5 }}>
          {filtered.length === 0 ? (
            <Typography sx={{ px: 2, py: 2, fontSize: 14, color: '#9e9e9e', textAlign: 'center' }}>No matches</Typography>
          ) : filtered.map(o => (
            <Box key={o.value} onClick={() => toggle(o.value)}
              sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.5, py: 0.75, cursor: 'pointer', '&:hover': { bgcolor: alpha('#000', 0.03) } }}>
              <Checkbox size="small" checked={draft.includes(o.value)} sx={{ p: 0.5, '&.Mui-checked': { color: TEAL_DARK } }} />
              {useFolder && <FolderOutlinedIcon sx={{ fontSize: 20, color: '#616161', flexShrink: 0 }} />}
              <Typography sx={{ flex: 1, fontSize: 14, color: '#212121', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.value}</Typography>
              <Typography sx={{ fontSize: 14, color: '#9e9e9e', flexShrink: 0 }}>{o.count}</Typography>
            </Box>
          ))}
        </Box>
        {/* Footer */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1, px: 2, py: 1.25, borderTop: '1px solid #eee' }}>
          <Button onClick={handleClose} sx={{ textTransform: 'none', color: TEAL_DARK, fontWeight: 700 }}>Cancel</Button>
          <Button onClick={apply} variant="contained" disableElevation sx={{ textTransform: 'none', bgcolor: TEAL_DARK, '&:hover': { bgcolor: '#006B68' }, fontWeight: 700, px: 2.5 }}>Apply</Button>
        </Box>
      </Popover>
    </>
  )
}
