import { useState } from 'react'
import { Box, Typography, Button, Avatar, InputBase, IconButton, Paper, ClickAwayListener } from '@mui/material'
import { alpha } from '@mui/material/styles'
import SearchIcon from '@mui/icons-material/Search'
import CancelIcon from '@mui/icons-material/Cancel'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { SEARCHABLE_JOURNALISTS } from '../../constants/mediaContacts'

const TEAL = '#1D9F9F'
const TEAL_DARK = '#00827F'
const MAX_RESULTS = 4

function initials(name) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

export default function AddJournalistSearch({ onAdd }) {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)

  const q = query.trim().toLowerCase()
  const matches = q
    ? SEARCHABLE_JOURNALISTS.filter(j => j.name.toLowerCase().includes(q) || j.email.toLowerCase().includes(q)).slice(0, MAX_RESULTS)
    : []
  const open = focused && q.length > 0

  return (
    <ClickAwayListener onClickAway={() => setFocused(false)}>
      <Box sx={{ position: 'relative' }}>
        {/* Input with floating label */}
        <Box sx={{
          position: 'relative', display: 'flex', alignItems: 'center', gap: 1, px: 1.5, py: 1.4, borderRadius: 1, bgcolor: 'background.paper',
          border: '1px solid', borderColor: focused ? TEAL : '#bdbdbd', boxShadow: focused ? `0 0 0 1px ${TEAL}` : 'none', transition: 'all 0.12s ease',
        }}>
          <Typography sx={{ position: 'absolute', top: -9, left: 12, px: 0.75, bgcolor: 'background.paper', fontSize: 12, color: focused ? TEAL_DARK : '#757575' }}>Add a Journalist</Typography>
          <SearchIcon sx={{ fontSize: 20, color: '#9e9e9e' }} />
          <InputBase value={query} onChange={e => setQuery(e.target.value)} onFocus={() => setFocused(true)}
            placeholder="Search journalists by name (e.g. John Doe)" sx={{ flex: 1, fontSize: 15, color: '#212121' }} />
          {query && (
            <IconButton size="small" onClick={() => setQuery('')}><CancelIcon sx={{ fontSize: 20, color: '#9e9e9e' }} /></IconButton>
          )}
        </Box>

        {/* Dropdown */}
        {open && (
          <Paper elevation={0} sx={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 20, border: '1px solid #e0e0e0', borderRadius: 1, overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.16)' }}>
            {/* Header — only when there are matches */}
            {matches.length > 0 && (
              <Box sx={{ px: 2, py: 1.25, bgcolor: '#fafafa', borderBottom: '1px solid #eee' }}>
                <Typography sx={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.6, color: '#9e9e9e', textTransform: 'uppercase' }}>Top Contact Matches</Typography>
              </Box>
            )}

            {/* Matches */}
            {matches.length === 0 ? (
              <Box sx={{ px: 2, py: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#616161', textAlign: 'center' }}>No matching email found</Typography>
                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', justifyContent: 'center' }}>
                  <Button variant="outlined" size="small"
                    sx={{ textTransform: 'none', borderColor: '#bdbdbd', color: '#212121', fontWeight: 600, fontSize: 14, borderRadius: 1, px: 2, py: 0.75, '&:hover': { borderColor: TEAL, bgcolor: alpha(TEAL, 0.04) } }}>
                    Report Missing Contact
                  </Button>
                  <Button variant="outlined" size="small"
                    sx={{ textTransform: 'none', borderColor: '#bdbdbd', color: '#212121', fontWeight: 600, fontSize: 14, borderRadius: 1, px: 2, py: 0.75, '&:hover': { borderColor: TEAL, bgcolor: alpha(TEAL, 0.04) } }}>
                    Create Private Contact
                  </Button>
                </Box>
              </Box>
            ) : matches.map((j, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1.5, borderBottom: '1px solid #f0f0f0', '&:hover': { bgcolor: '#f5f5f5' } }}>
                <Avatar sx={{ width: 44, height: 44, bgcolor: j.color, fontSize: 15, fontWeight: 700, flexShrink: 0 }}>{initials(j.name)}</Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#212121' }}>{j.name}</Typography>
                    <Typography sx={{ fontSize: 14, color: TEAL_DARK, textDecoration: 'underline', cursor: 'pointer' }}>{j.email}</Typography>
                    <IconButton size="small" sx={{ p: 0.25 }}><ContentCopyIcon sx={{ fontSize: 15, color: TEAL_DARK }} /></IconButton>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap', mt: 0.25 }}>
                    <Typography sx={{ fontSize: 13.5, color: '#757575' }}>{j.city} • {j.country} | {j.outlet}</Typography>
                    {j.lists && (
                      <>
                        <Typography sx={{ fontSize: 13.5, color: '#bdbdbd' }}>•</Typography>
                        <FormatListBulletedIcon sx={{ fontSize: 15, color: '#9e9e9e' }} />
                        <Typography sx={{ fontSize: 13.5, color: '#757575' }}>{j.lists.join(', ')}</Typography>
                      </>
                    )}
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
                  <Button variant="outlined" size="small" onClick={() => onAdd(j)}
                    sx={{ textTransform: 'none', borderColor: '#bdbdbd', color: '#212121', fontWeight: 600, fontSize: 13.5, borderRadius: 1, px: 1.5, whiteSpace: 'nowrap', '&:hover': { borderColor: TEAL, bgcolor: alpha(TEAL, 0.04) } }}>
                    Add to This List
                  </Button>
                  <Button variant="outlined" size="small"
                    sx={{ textTransform: 'none', borderColor: '#bdbdbd', color: '#212121', fontWeight: 600, fontSize: 13.5, borderRadius: 1, px: 1.5, '&:hover': { borderColor: TEAL, bgcolor: alpha(TEAL, 0.04) } }}>
                    Email
                  </Button>
                </Box>
              </Box>
            ))}

            {/* Footer — full search */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, px: 2, py: 1.75, cursor: 'pointer', '&:hover': { bgcolor: '#fafafa' } }}>
              <Typography sx={{ fontSize: 15, color: '#212121' }}>
                Didn't find who you're looking for? <Box component="span" sx={{ fontWeight: 700 }}>Open full search for “{query.trim()}”</Box>
              </Typography>
              <OpenInNewIcon sx={{ fontSize: 20, color: '#616161', flexShrink: 0 }} />
            </Box>
          </Paper>
        )}
      </Box>
    </ClickAwayListener>
  )
}
