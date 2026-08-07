import { useState } from 'react'
import { Box, Typography, Tooltip, Button, Divider, Menu, MenuItem } from '@mui/material'
import { alpha } from '@mui/material/styles'
import CleaningServicesIcon from '@mui/icons-material/CleaningServices'
import ReplyIcon from '@mui/icons-material/Reply'
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import AutoCleanupModal from './AutoCleanupModal'

const TEAL = '#1D9F9F'
const TEAL_DARK = '#00827F'
// Active filter styling — same teal used by the table column filters
const ACTIVE_BORDER = TEAL
const ACTIVE_BG = alpha(TEAL, 0.06)

const ENGAGEMENT = [
  { key: 'opened', label: 'Opened', dot: '#2E7D32', countKey: 'opened' },
  { key: 'not-opened', label: 'Not Opened', dot: '#9E9D24', countKey: 'notOpened' },
  { key: 'clicked', label: 'Clicked', dot: '#7CB342', countKey: 'clicked' },
  { key: 'not-clicked', label: 'Not Clicked', dot: '#F9A825', countKey: 'notClicked' },
  { key: 'unsubscribed', label: 'Unsubscribed', dot: '#F57C00', countKey: 'unsubscribed' },
  { key: 'bounced', label: 'Bounced', dot: '#795548', countKey: 'bounced' },
]

const pctOf = (count, total) => (total > 0 ? Math.round((count / total) * 100) : 0)

function SubHeader({ children, sx }) {
  return <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#212121', ...sx }}>{children}</Typography>
}

function VDivider() {
  return <Box sx={{ width: '1px', height: 22, bgcolor: '#e0e0e0', mx: 0.5, flexShrink: 0 }} />
}

// A filter box: colored dot + label + percentage | count. Green when active.
function FilterBox({ dot, label, pct, count, active, onClick }) {
  return (
    <Tooltip title="Filter by" placement="top" arrow enterDelay={300}>
      <Box onClick={onClick}
        sx={{
          display: 'flex', alignItems: 'center', gap: 1, px: 1.5, py: 1.15, borderRadius: 1.5, cursor: 'pointer',
          border: '1px solid', borderColor: active ? ACTIVE_BORDER : '#e0e0e0', bgcolor: active ? ACTIVE_BG : 'background.paper',
          transition: 'all 0.12s ease', '&:hover': { borderColor: active ? ACTIVE_BORDER : '#bdbdbd', bgcolor: active ? ACTIVE_BG : alpha('#000', 0.02) },
        }}>
        <Box sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: dot, flexShrink: 0 }} />
        <Typography sx={{ flex: 1, fontSize: 14, fontWeight: active ? 700 : 500, color: active ? TEAL_DARK : '#212121' }}>{label}</Typography>
        <Typography sx={{ fontSize: 13, color: '#9e9e9e' }}>{pct}%</Typography>
        <VDivider />
        <Typography sx={{ fontSize: 14, fontWeight: 700, color: active ? TEAL_DARK : '#212121', minWidth: 22, textAlign: 'right' }}>{count}</Typography>
      </Box>
    </Tooltip>
  )
}

// Small "N ▾" dropdown that opens a menu of numeric options.
function NumberDropdown({ value, options, onChange }) {
  const [anchorEl, setAnchorEl] = useState(null)
  return (
    <>
      <Box onClick={e => { e.stopPropagation(); setAnchorEl(e.currentTarget) }}
        sx={{ display: 'flex', alignItems: 'center', gap: 0.25, cursor: 'pointer', px: 0.75, py: 0.25, borderRadius: 1, '&:hover': { bgcolor: alpha('#000', 0.04) } }}>
        <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#212121' }}>{value}</Typography>
        <ArrowDropDownIcon sx={{ fontSize: 18, color: '#616161' }} />
      </Box>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={(e) => { setAnchorEl(null) }}
        MenuListProps={{ onClick: (e) => e.stopPropagation() }}>
        {options.map(o => (
          <MenuItem key={o} selected={o === value} onClick={() => { onChange(o); setAnchorEl(null) }} sx={{ fontSize: 14, minWidth: 60 }}>{o}</MenuItem>
        ))}
      </Menu>
    </>
  )
}

// Inactivity card: icon + title on top, then [N ▾] unit label ... pct | count. Teal when active.
function InactivityCard({ icon, label, value, options, onValue, unit, count, pct, active, onToggle }) {
  return (
    <Tooltip title="Filter by" placement="top" arrow enterDelay={300}>
      <Box onClick={onToggle}
        sx={{
          border: '1px solid', borderColor: active ? ACTIVE_BORDER : '#e0e0e0', bgcolor: active ? ACTIVE_BG : 'background.paper', borderRadius: 1.5, px: 1.5, py: 1.25, cursor: 'pointer',
          transition: 'all 0.12s ease', '&:hover': { borderColor: active ? ACTIVE_BORDER : '#bdbdbd', bgcolor: active ? ACTIVE_BG : alpha('#000', 0.02) },
        }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1 }}>
          {icon}
          <Typography sx={{ fontSize: 14, fontWeight: active ? 700 : 500, color: active ? TEAL_DARK : '#212121' }}>{label}</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <NumberDropdown value={value} options={options} onChange={onValue} />
          <Typography sx={{ fontSize: 14, color: '#212121' }}>{unit}</Typography>
          <Box sx={{ flex: 1 }} />
          <Typography sx={{ fontSize: 13, color: '#9e9e9e' }}>{pct}%</Typography>
          <VDivider />
          <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#212121', minWidth: 22, textAlign: 'right' }}>{count}</Typography>
        </Box>
      </Box>
    </Tooltip>
  )
}

export default function ListHealthPanel({
  lastEmailed, engagement, onEngagement, counts, total,
  respInactive, onRespValue, onRespToggle, respCount,
  pubInactive, onPubValue, onPubToggle, pubCount,
}) {
  const [cleanupOpen, setCleanupOpen] = useState(false)
  return (
    <Box sx={{ width: 300, flexShrink: 0, display: 'flex' }}>
      <Box sx={{ flex: 1, minHeight: 0, border: '1px solid #e0e0e0', borderRadius: 1, bgcolor: 'background.paper', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Fixed header: title + Auto Clean-Up */}
        <Box sx={{ flexShrink: 0, px: 2, pt: 1.25, pb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
          <Typography sx={{ fontSize: 15.5, fontWeight: 700, color: '#212121' }}>List Health</Typography>
          <Button variant="text" startIcon={<CleaningServicesIcon />} onClick={() => setCleanupOpen(true)}
            sx={{
              textTransform: 'none', color: TEAL_DARK, fontWeight: 700, fontSize: 13, minWidth: 0, px: 0.5, '&:hover': { bgcolor: alpha(TEAL, 0.06) },
              '& .MuiButton-startIcon': { mr: 0.5 }, '& .MuiButton-startIcon > svg': { fontSize: 13 },
            }}>
            Auto Clean-Up
          </Button>
        </Box>
        <Divider />

        {/* Scrollable content */}
        <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>

          {/* Email Engagement */}
          <SubHeader>Email Engagement</SubHeader>

          {/* Last emailed */}
          <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1.5, px: 1.5, py: 1.25 }}>
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#212121', lineHeight: 1.2 }}>{lastEmailed}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 0.25 }}>
              <Typography sx={{ fontSize: 13, color: '#757575' }}>Last emailed</Typography>
              <Typography component="span" sx={{ fontSize: 13.5, fontWeight: 700, color: TEAL_DARK, cursor: 'pointer', textDecoration: 'underline' }}>View Campaign</Typography>
            </Box>
          </Box>

          {/* Engagement filter boxes */}
          {ENGAGEMENT.map(e => (
            <FilterBox key={e.key} dot={e.dot} label={e.label} count={counts[e.countKey]} pct={pctOf(counts[e.countKey], total)}
              active={engagement === e.key} onClick={() => onEngagement(e.key)} />
          ))}

          {/* Inactivity */}
          <SubHeader sx={{ mt: 1 }}>Inactivity</SubHeader>
          <InactivityCard
            icon={<ReplyIcon sx={{ fontSize: 18, color: '#616161', transform: 'scaleX(-1)' }} />}
            label="Hasn't replied after:" value={respInactive.value} options={[1, 2, 3, 4, 5]} onValue={onRespValue} unit="attempts"
            count={respCount} pct={pctOf(respCount, total)} active={respInactive.active} onToggle={onRespToggle} />
          <InactivityCard
            icon={<ArticleOutlinedIcon sx={{ fontSize: 18, color: '#616161' }} />}
            label="Haven't published in the last:" value={pubInactive.value} options={[1, 2, 3, 6]} onValue={onPubValue} unit={pubInactive.value === 1 ? 'month' : 'months'}
            count={pubCount} pct={pctOf(pubCount, total)} active={pubInactive.active} onToggle={onPubToggle} />
        </Box>
      </Box>

      <AutoCleanupModal open={cleanupOpen} onClose={() => setCleanupOpen(false)} />
    </Box>
  )
}
