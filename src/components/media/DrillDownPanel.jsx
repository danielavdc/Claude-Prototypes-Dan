import { useState, useEffect, useMemo } from 'react'
import { Box, Typography, Button, Avatar, IconButton, Checkbox, Drawer, InputBase, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Tooltip } from '@mui/material'
import { alpha } from '@mui/material/styles'
import CloseIcon from '@mui/icons-material/Close'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VerifiedIcon from '@mui/icons-material/Verified'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import PodcastsIcon from '@mui/icons-material/Podcasts'
import FormatQuoteIcon from '@mui/icons-material/FormatQuote'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import SortIcon from '@mui/icons-material/Sort'
import SearchIcon from '@mui/icons-material/Search'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt'
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt'
import CachedIcon from '@mui/icons-material/Cached'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
import TrackChangesIcon from '@mui/icons-material/TrackChanges'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'

const TEAL = '#1D9F9F'
const TEAL_DARK = '#00827F'

const CONTACTS = [
  { id: 0, color: '#C0873F', title: 'Senior Editor', source: 'USA Today', extraIcons: ['print', 'lock', 'mute', 'podcast', 'quote'] },
  { id: 1, color: '#5C6BC0', title: 'Cultural Critic', source: 'CNN', extraIcons: ['lock'] },
  { id: 2, color: '#B76BA3', title: 'Columnist', source: 'The New York Times', extraIcons: ['lock'] },
  { id: 3, color: '#4FA0A0', title: 'Investigative Journalist', source: 'The Guardian', extraIcons: ['lock', 'quote'] },
  { id: 4, color: '#E0736F', title: 'Political Analyst', source: 'Capitol Watch', extraIcons: [] },
]

const MENTIONS = [
  { outlet: 'Yahoo! Sports', author: 'Kevin John', meta: 'News | US | Jul 7, 2026 • 9:49 PM', title: "Student's vision leads to women's flag football club at Sacramento State", reach: '32M', views: '940', ave: '296.1k', color: '#7E57C2' },
  { outlet: 'Yahoo! Sports', author: 'Kevin John', meta: 'News | US | Jun 18, 2026 • 11:12 PM', title: 'Elk Grove sprinter Cy Lugo captures State Gold in record-breaking 200-meter…', reach: '18M', views: '612', ave: '148.2k', color: '#7E57C2' },
  { outlet: 'Yahoo! Sports', author: 'Kevin John', meta: 'News | US | Jun 2, 2026 • 4:03 PM', title: 'Local athletes shine at regional championships across Northern California', reach: '9M', views: '388', ave: '92.7k', color: '#7E57C2' },
]

function TinyIcon({ type }) {
  const sx = { fontSize: 15, color: '#9e9e9e' }
  if (type === 'lock') return <LockOutlinedIcon sx={sx} />
  if (type === 'podcast') return <PodcastsIcon sx={sx} />
  if (type === 'quote') return <FormatQuoteIcon sx={sx} />
  if (type === 'mute') return <RemoveCircleOutlineIcon sx={sx} />
  return <Box sx={{ width: 14, height: 14, borderRadius: 0.5, border: '1.5px solid #9e9e9e' }} />
}

function SmallBtn({ children }) {
  return (
    <Button variant="outlined" size="small" sx={{ textTransform: 'none', borderColor: '#bdbdbd', color: '#212121', fontWeight: 700, fontSize: 13, borderRadius: 1, px: 1.5, '&:hover': { borderColor: TEAL, bgcolor: alpha(TEAL, 0.04) } }}>{children}</Button>
  )
}

function SpikeChart() {
  const vals = [10, 9, 11, 10, 13, 13, 11, 10, 12, 14, 4, 12, 3, 30]
  const w = 300, h = 90
  const max = Math.max(...vals), min = 0
  const step = w / (vals.length - 1)
  const pts = vals.map((v, i) => [i * step, h - ((v - min) / (max - min)) * (h - 8)])
  const line = pts.map(p => p.join(',')).join(' ')
  const last = pts[pts.length - 1]
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ display: 'block' }}>
      <line x1="0" y1={h - 30} x2={w} y2={h - 30} stroke="#bdbdbd" strokeWidth="1" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
      <polyline points={line} fill="none" stroke="#2196F3" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r="5" fill="#2196F3" stroke="#fff" strokeWidth="2" />
    </svg>
  )
}

export default function DrillDownPanel({ open, onClose, viewing }) {
  const isPerson = viewing?.kind === 'person'
  const isProfileOnly = viewing?.kind === 'profile' // View Profile icon / chart name click — profile alone, no tab bar
  const [tab, setTab] = useState('contacts')
  // Open on the tab requested by the trigger (row → mentions, profile icon → profile, group → contacts)
  useEffect(() => { if (open) setTab(isProfileOnly ? 'profile' : viewing?.tab || (isPerson ? 'mentions' : 'contacts')) }, [open, viewing?.label]) // eslint-disable-line

  const TABS = isProfileOnly
    ? []
    : isPerson
      ? [{ key: 'mentions', label: 'Mentions' }, { key: 'analytics', label: 'Analytics' }] // no Profile Card tab here — reached only via the dedicated entry points below
      : [{ key: 'mentions', label: 'Mentions' }, { key: 'analytics', label: 'Analytics' }, { key: 'contacts', label: 'Contacts' }]
  const title = isProfileOnly ? 'Profile Card' : (isPerson || tab === 'mentions') ? 'Filtered Mentions' : 'Filtered'

  return (
    <Drawer anchor="right" open={open} onClose={onClose} slotProps={{ paper: { sx: { width: 440, maxWidth: '92vw' } } }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <Box sx={{ flexShrink: 0, px: 2.5, pt: 2, pb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={{ fontSize: 22, fontWeight: 700, color: '#212121' }}>{title}</Typography>
          <IconButton size="small" onClick={onClose}><CloseIcon sx={{ fontSize: 22, color: '#616161' }} /></IconButton>
        </Box>

        {/* Tabs — omitted entirely for the profile-only entry point */}
        {!isProfileOnly && (
          <Box sx={{ flexShrink: 0, display: 'flex', borderBottom: '1px solid #e0e0e0', px: 1 }}>
            {TABS.map(t => {
              const active = tab === t.key
              return (
                <Box key={t.key} onClick={() => setTab(t.key)} sx={{ flex: 1, textAlign: 'center', py: 1.25, cursor: 'pointer', borderBottom: active ? `2px solid ${TEAL}` : '2px solid transparent', bgcolor: active ? alpha(TEAL, 0.06) : 'transparent', mb: '-1px' }}>
                  <Typography sx={{ fontSize: 15, fontWeight: active ? 700 : 500, color: active ? '#212121' : '#757575' }}>{t.label}</Typography>
                </Box>
              )
            })}
          </Box>
        )}

        {/* Viewing bar — omitted for the profile-only entry point */}
        {!isProfileOnly && (
          <Box sx={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 1.25, px: 2.5, py: 1.5, bgcolor: '#eef2f7' }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: '#e0e0e0' }}><VisibilityOutlinedIcon sx={{ fontSize: 18, color: '#616161' }} /></Avatar>
            <Typography sx={{ fontSize: 14.5, color: '#212121' }}>
              <b>Viewing:</b> {viewing?.label} <Box component="span" sx={{ color: '#616161' }}>({viewing?.type})</Box>
            </Typography>
          </Box>
        )}

        {/* Body */}
        <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
          {tab === 'contacts' && <ContactsTab />}
          {tab === 'mentions' && <MentionsTab />}
          {tab === 'analytics' && <AnalyticsTab />}
          {tab === 'profile' && <ProfileCardTab name={viewing?.label} />}
        </Box>
      </Box>
    </Drawer>
  )
}

function ContactsTab() {
  const [selected, setSelected] = useState([])
  const [removeAnchor, setRemoveAnchor] = useState(null)
  const [confirm, setConfirm] = useState(null) // 'this' | 'all' | null

  const allSelected = selected.length === CONTACTS.length
  const someSelected = selected.length > 0
  const toggleAll = () => setSelected(allSelected ? [] : CONTACTS.map(c => c.id))
  const toggle = (id) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  const clearSelection = () => setSelected([])

  const openRemoveMenu = (e) => setRemoveAnchor(e.currentTarget)
  const closeRemoveMenu = () => setRemoveAnchor(null)
  const chooseRemove = (scope) => { setRemoveAnchor(null); setConfirm(scope) }
  const confirmRemove = () => { setSelected([]); setConfirm(null) }

  const selCount = selected.length

  return (
    <>
      {/* Selection action bar — replaces nothing, sits above the count row */}
      {someSelected && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2.5, py: 1.25, bgcolor: alpha(TEAL, 0.12), flexWrap: 'wrap' }}>
          <IconButton size="small" onClick={clearSelection} sx={{ color: TEAL_DARK }}><CloseIcon sx={{ fontSize: 20 }} /></IconButton>
          <Typography sx={{ fontSize: 15, fontWeight: 700, color: TEAL_DARK, mr: 0.5 }}>{selCount} Selected</Typography>
          <Tooltip title="Add to list"><IconButton size="small" sx={{ color: TEAL_DARK }}><PlaylistAddIcon sx={{ fontSize: 21 }} /></IconButton></Tooltip>
          <Tooltip title="Remove"><IconButton size="small" onClick={openRemoveMenu} sx={{ color: TEAL_DARK }}><DeleteOutlineIcon sx={{ fontSize: 20 }} /></IconButton></Tooltip>
          <Box sx={{ flex: 1 }} />
          <Button variant="contained" disableElevation startIcon={<MailOutlineIcon sx={{ fontSize: 17 }} />}
            sx={{ textTransform: 'none', bgcolor: TEAL_DARK, '&:hover': { bgcolor: '#006B68' }, fontWeight: 700, fontSize: 13.5, borderRadius: 1, px: 1.75 }}>
            Send Email
          </Button>
        </Box>
      )}

      {/* Remove dropdown */}
      <Menu anchorEl={removeAnchor} open={Boolean(removeAnchor)} onClose={closeRemoveMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} transformOrigin={{ vertical: 'top', horizontal: 'left' }}>
        <MenuItem onClick={() => chooseRemove('this')} sx={{ fontSize: 14 }}>Remove from this list</MenuItem>
        <MenuItem onClick={() => chooseRemove('all')} sx={{ fontSize: 14 }}>Remove from all lists</MenuItem>
      </Menu>

      {/* Count row */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2.5, py: 2, borderBottom: '1px solid #eee' }}>
        <Checkbox size="small" checked={allSelected} indeterminate={someSelected && !allSelected} onChange={toggleAll}
          sx={{ p: 0, '&.Mui-checked': { color: TEAL_DARK }, '&.MuiCheckbox-indeterminate': { color: TEAL_DARK } }} />
        <Typography sx={{ fontSize: 18, fontWeight: 700, color: '#212121' }}>47 Contacts</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2.5, py: 1.25, borderBottom: '1px solid #eee' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SortIcon sx={{ fontSize: 18, color: '#616161' }} />
          <Typography sx={{ fontSize: 14, color: '#616161' }}>Sorted by: <Box component="span" sx={{ fontWeight: 700, color: '#212121' }}>Default</Box></Typography>
          <ArrowDropDownIcon sx={{ fontSize: 18, color: '#616161' }} />
        </Box>
        <SearchIcon sx={{ fontSize: 20, color: '#616161' }} />
      </Box>

      {CONTACTS.map((c) => (
        <Box key={c.id} sx={{ px: 2.5, py: 2, borderBottom: '1px solid #eee', bgcolor: selected.includes(c.id) ? alpha(TEAL, 0.06) : 'transparent' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
            <Checkbox size="small" checked={selected.includes(c.id)} onChange={() => toggle(c.id)} sx={{ p: 0, mt: 0.5, '&.Mui-checked': { color: TEAL_DARK } }} />
            <Avatar sx={{ width: 44, height: 44, bgcolor: c.color, fontSize: 14, fontWeight: 700, flexShrink: 0 }}>FL</Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
                <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#212121' }}>First Last</Typography>
                <VerifiedIcon sx={{ fontSize: 15, color: '#616161' }} />
                {c.extraIcons.map((ic, k) => <TinyIcon key={k} type={ic} />)}
              </Box>
              <Typography sx={{ fontSize: 13.5, fontWeight: 700, color: '#616161', mt: 0.25 }}>{c.title} | {c.source} <Box component="span" sx={{ fontWeight: 400, color: '#9e9e9e' }}>• 3 more</Box></Typography>
            </Box>
          </Box>
          <Typography sx={{ fontSize: 14, color: '#212121', lineHeight: 1.45, mt: 1 }}>Based in San Francisco, California with a national focus. Her recent coverage includes gaming and technology topics, particularly as they impact the United States.</Typography>
          <Typography sx={{ fontSize: 13.5, color: '#9e9e9e', mt: 1.5 }}><Box component="span" sx={{ fontWeight: 700, color: '#616161' }}>On list:</Box> Media List name 1, Media List name 2, Media List…</Typography>
          <Box sx={{ display: 'flex', gap: 1, mt: 1.5 }}>
            <SmallBtn>Add to List</SmallBtn>
            <SmallBtn>Email</SmallBtn>
            <SmallBtn>View Profile</SmallBtn>
          </Box>
        </Box>
      ))}

      {/* Remove confirmation modal */}
      <Dialog open={Boolean(confirm)} onClose={() => setConfirm(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontSize: 18, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
          <DeleteOutlineIcon sx={{ color: '#E53935' }} />
          Remove {selCount} {selCount === 1 ? 'contact' : 'contacts'}?
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: 14, color: '#424242' }}>
            {confirm === 'all'
              ? `You're about to remove ${selCount} ${selCount === 1 ? 'contact' : 'contacts'} from all lists. This action can't be undone.`
              : `You're about to remove ${selCount} ${selCount === 1 ? 'contact' : 'contacts'} from this list. This action can't be undone.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setConfirm(null)} sx={{ textTransform: 'none', color: '#616161', fontWeight: 600 }}>Cancel</Button>
          <Button onClick={confirmRemove} variant="contained" disableElevation
            sx={{ textTransform: 'none', bgcolor: '#E53935', '&:hover': { bgcolor: '#C62828' }, fontWeight: 700 }}>
            {confirm === 'all' ? 'Remove from all lists' : 'Remove from this list'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

function MentionsTab() {
  return (
    <>
      {/* Total mentions + chart */}
      <Box sx={{ px: 2.5, pt: 2 }}>
        <Typography sx={{ fontSize: 15, color: '#616161' }}>Total Mentions</Typography>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Box sx={{ flexShrink: 0 }}>
            <Typography sx={{ fontSize: 40, fontWeight: 800, color: '#212121', lineHeight: 1.1 }}>299</Typography>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.25, bgcolor: alpha('#43A047', 0.12), borderRadius: 1, px: 1, py: 0.25 }}>
              <ArrowUpwardIcon sx={{ fontSize: 14, color: '#43A047' }} />
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#2E7D32' }}>2,900%</Typography>
            </Box>
          </Box>
          <Box sx={{ flex: 1, minWidth: 0, mt: 1 }}><SpikeChart /></Box>
        </Box>
      </Box>

      {/* AI insight */}
      <Box sx={{ px: 2.5, py: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1 }}>
          <AutoAwesomeIcon sx={{ fontSize: 18, color: '#9C4DD6' }} />
          <Typography sx={{ fontSize: 16, fontWeight: 700, background: 'linear-gradient(90deg, #9C4DD6 0%, #CF2D8A 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI-Powered Insight</Typography>
        </Box>
        <Typography sx={{ fontSize: 15, lineHeight: 1.55, color: '#212121' }}>
          The posts discuss various topics related to digital health and healthcare innovation, such as digital health standards, rural healthcare challenges, AI in healthcare, patient engagement, and remote pharmacy services. There is a focus on partnerships and collaborations in the healthcare industry, with mentions of collaborations in mental healthcare, AI-driven vocal biomarker technology, and healthcare startups
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.5, mt: 1.5 }}>
          <IconButton size="small"><ThumbUpOffAltIcon sx={{ fontSize: 18, color: '#9e9e9e' }} /></IconButton>
          <IconButton size="small"><ThumbDownOffAltIcon sx={{ fontSize: 18, color: '#9e9e9e' }} /></IconButton>
          <IconButton size="small"><CachedIcon sx={{ fontSize: 18, color: '#9e9e9e' }} /></IconButton>
          <IconButton size="small"><ContentCopyIcon sx={{ fontSize: 18, color: '#9e9e9e' }} /></IconButton>
        </Box>
      </Box>

      {/* Results toolbar */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2.5, py: 1, borderTop: '1px solid #eee' }}>
        <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#212121' }}>3 results</Typography>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton size="small"><AutoFixHighIcon sx={{ fontSize: 18, color: '#9C4DD6' }} /></IconButton>
          <IconButton size="small"><FileDownloadOutlinedIcon sx={{ fontSize: 18, color: '#616161' }} /></IconButton>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2.5, py: 1, borderTop: '1px solid #eee', borderBottom: '1px solid #eee' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SortIcon sx={{ fontSize: 18, color: '#616161' }} />
          <Typography sx={{ fontSize: 14, color: '#616161' }}>Sort by: <Box component="span" sx={{ fontWeight: 700, color: '#212121' }}>Date</Box></Typography>
          <ArrowDropDownIcon sx={{ fontSize: 18, color: '#616161' }} />
          <ArrowUpwardIcon sx={{ fontSize: 16, color: '#616161' }} />
          <ArrowDropDownIcon sx={{ fontSize: 18, color: '#616161' }} />
        </Box>
        <SearchIcon sx={{ fontSize: 20, color: '#616161' }} />
      </Box>

      {/* Mention cards */}
      {MENTIONS.map((m, i) => (
        <Box key={i} sx={{ px: 2.5, py: 2, borderBottom: '1px solid #eee' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Avatar sx={{ width: 26, height: 26, bgcolor: m.color, fontSize: 10, fontWeight: 700 }}>YS</Avatar>
            <Typography sx={{ fontSize: 14, fontWeight: 700, color: TEAL_DARK }}>{m.outlet} <Box component="span" sx={{ color: '#616161', fontWeight: 400 }}>•</Box> {m.author}</Typography>
          </Box>
          <Typography sx={{ fontSize: 12.5, color: '#757575', mb: 0.75 }}>{m.meta}</Typography>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Typography sx={{ flex: 1, fontSize: 16, fontWeight: 700, color: TEAL_DARK, lineHeight: 1.3, cursor: 'pointer' }}>{m.title}</Typography>
            <Box sx={{ width: 72, height: 60, borderRadius: 1, bgcolor: m.color, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography sx={{ fontSize: 10, fontWeight: 700, color: '#fff' }}>image</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 0.75, mt: 1.25, flexWrap: 'wrap' }}>
            <Chip icon={<TrackChangesIcon sx={{ fontSize: 15 }} />} label={m.reach} />
            <Chip icon={<VisibilityOutlinedIcon sx={{ fontSize: 15 }} />} label={m.views} />
            <Chip icon={<AttachMoneyIcon sx={{ fontSize: 15 }} />} label={m.ave} />
            <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #e0e0e0', borderRadius: 1, px: 0.75, py: 0.4 }}>
              <Typography sx={{ fontSize: 14 }}>🙂</Typography>
            </Box>
          </Box>
        </Box>
      ))}
    </>
  )
}

function Chip({ icon, label }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, border: '1px solid #e0e0e0', borderRadius: 1, px: 0.9, py: 0.4 }}>
      <Box sx={{ color: '#616161', display: 'flex' }}>{icon}</Box>
      <Typography sx={{ fontSize: 13, color: '#424242' }}>{label}</Typography>
    </Box>
  )
}

function AnalyticsTab() {
  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1, height: '100%', textAlign: 'center' }}>
      <AutoFixHighIcon sx={{ fontSize: 40, color: '#bdbdbd' }} />
      <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#616161' }}>Analytics</Typography>
      <Typography sx={{ fontSize: 14, color: '#9e9e9e' }}>Breakdown charts for this selection — coming soon.</Typography>
    </Box>
  )
}

const SOCIALS = [
  { l: '𝕏', bg: '#000' }, { l: 'in', bg: '#0077B5' }, { l: 'f', bg: '#1877F2' }, { l: '◉', bg: '#E1306C' }, { l: '▶', bg: '#FF0000' },
]
function SocialBadge({ l, bg }) {
  return <Box sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: bg, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Typography sx={{ fontSize: 10, fontWeight: 700, color: '#fff', lineHeight: 1 }}>{l}</Typography></Box>
}

function ProfileBtn({ icon, children, endIcon }) {
  return (
    <Button variant="outlined" size="small" startIcon={icon} endIcon={endIcon}
      sx={{ textTransform: 'none', borderColor: '#bdbdbd', color: TEAL_DARK, fontWeight: 700, fontSize: 13, borderRadius: 1, px: 1.25, '&:hover': { borderColor: TEAL, bgcolor: alpha(TEAL, 0.04) } }}>{children}</Button>
  )
}

function InsightCard({ title, badge, text }) {
  return (
    <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1.5, p: 1.75, mb: 1.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1 }}>
        <AutoAwesomeIcon sx={{ fontSize: 16, color: '#9C4DD6' }} />
        <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#7B3FA0' }}>{title}</Typography>
        <InfoOutlinedIcon sx={{ fontSize: 15, color: '#9e9e9e' }} />
        {badge && <Box sx={{ ml: 'auto', border: '1px solid #F2994A', borderRadius: 1, px: 0.9, py: 0.15 }}><Typography sx={{ fontSize: 12, fontWeight: 700, color: '#E67E22' }}>{badge}</Typography></Box>}
      </Box>
      <Typography sx={{ fontSize: 14, lineHeight: 1.5, color: '#212121' }}>{text} <Box component="span" sx={{ color: '#9e9e9e' }}>…</Box></Typography>
      <Typography sx={{ fontSize: 13.5, fontWeight: 700, color: TEAL_DARK, cursor: 'pointer', mt: 0.5 }}>Show more</Typography>
      <Box sx={{ display: 'flex', gap: 0.5, mt: 1 }}>
        <IconButton size="small" sx={{ p: 0.5 }}><ThumbUpOffAltIcon sx={{ fontSize: 16, color: '#9e9e9e' }} /></IconButton>
        <IconButton size="small" sx={{ p: 0.5 }}><ThumbDownOffAltIcon sx={{ fontSize: 16, color: '#9e9e9e' }} /></IconButton>
      </Box>
    </Box>
  )
}

function ProfileCardTab({ name = 'Kevin John' }) {
  const [sub, setSub] = useState('overview')
  const SUBS = [{ key: 'overview', label: 'Overview' }, { key: 'social', label: 'Social' }, { key: 'content', label: 'Content (833)' }]
  return (
    <>
      {/* Identity */}
      <Box sx={{ px: 2.5, py: 2, display: 'flex', gap: 1.5 }}>
        <Avatar sx={{ width: 56, height: 56, bgcolor: '#5C6BC0', fontSize: 18, fontWeight: 700, flexShrink: 0 }}>{name.split(' ').map(n => n[0]).join('').slice(0, 2)}</Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
            <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#212121' }}>{name}</Typography>
            {SOCIALS.map((s, i) => <SocialBadge key={i} {...s} />)}
          </Box>
          <Typography sx={{ fontSize: 14, color: '#616161', mt: 0.25 }}>Sacramento, California • United States</Typography>
          <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#212121', mt: 0.25 }}>Multi-Skilled Journalist</Typography>
        </Box>
      </Box>

      {/* Actions */}
      <Box sx={{ display: 'flex', gap: 1, px: 2.5, pb: 2, flexWrap: 'wrap' }}>
        <ProfileBtn icon={<PersonAddAltOutlinedIcon sx={{ fontSize: 17 }} />} endIcon={<ArrowDropDownIcon sx={{ fontSize: 18 }} />}>Manage lists</ProfileBtn>
        <ProfileBtn icon={<MailOutlineIcon sx={{ fontSize: 17 }} />}>Send email</ProfileBtn>
        <ProfileBtn icon={<OpenInNewIcon sx={{ fontSize: 16 }} />}>Full profile</ProfileBtn>
      </Box>

      {/* Sub-tabs */}
      <Box sx={{ display: 'flex', borderBottom: '1px solid #e0e0e0' }}>
        {SUBS.map(s => {
          const active = sub === s.key
          return (
            <Box key={s.key} onClick={() => setSub(s.key)} sx={{ flex: 1, textAlign: 'center', py: 1.15, cursor: 'pointer', borderBottom: active ? `2px solid ${TEAL}` : '2px solid transparent', bgcolor: active ? alpha(TEAL, 0.06) : 'transparent', mb: '-1px' }}>
              <Typography sx={{ fontSize: 14.5, fontWeight: active ? 700 : 500, color: active ? '#212121' : '#757575' }}>{s.label}</Typography>
            </Box>
          )
        })}
      </Box>

      {sub !== 'overview' ? (
        <Box sx={{ p: 4, textAlign: 'center' }}><Typography sx={{ fontSize: 14, color: '#9e9e9e' }}>{sub === 'social' ? 'Social profiles & activity' : '833 content items'} — coming soon.</Typography></Box>
      ) : (
        <>
          {/* AI Insights */}
          <Box sx={{ px: 2.5, pt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography sx={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.6, color: '#9e9e9e' }}>AI INSIGHTS</Typography>
              <Typography sx={{ fontSize: 13.5, fontWeight: 700, color: '#212121', cursor: 'pointer' }}>Hide</Typography>
            </Box>
            <InsightCard title="Author Bio" text={`${name} is a Host and Multi-Skilled Journalist at ABC10 (KXTV) in Sacramento, covering local and national sports and hosting Toyota Sports Extra`} />
            <InsightCard title="Relevance Assessment" badge="Mismatch" text={`${name} focuses on Sacramento-area sports stories and athlete profiles, while your outreach content does not indicate any clear sports, local`} />
          </Box>

          {/* Media lists */}
          <Box sx={{ px: 2.5, py: 2, borderTop: '1px solid #eee' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
              <Typography sx={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.6, color: '#9e9e9e' }}>MEDIA LISTS</Typography>
              <InfoOutlinedIcon sx={{ fontSize: 14, color: '#9e9e9e' }} />
            </Box>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, bgcolor: '#f0f0f0', borderRadius: 5, pl: 1.5, pr: 0.5, py: 0.4 }}>
              <Typography sx={{ fontSize: 13.5, color: '#424242' }}>test</Typography>
              <CloseIcon sx={{ fontSize: 16, color: '#9e9e9e', cursor: 'pointer' }} />
            </Box>
          </Box>

          {/* Affiliations */}
          <Box sx={{ px: 2.5, py: 2, borderTop: '1px solid #eee' }}>
            <Typography sx={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.6, color: '#9e9e9e', mb: 1.25 }}>AFFILIATIONS</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
              <Avatar sx={{ width: 38, height: 38, bgcolor: '#0A5AA0', fontSize: 10, fontWeight: 700 }}>ABC</Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontSize: 14.5, fontWeight: 600, color: '#212121' }}>KXTV-TV - ABC10</Typography>
                <Typography sx={{ fontSize: 13, color: '#757575' }}>Sacramento, California • United States</Typography>
              </Box>
              <OpenInNewIcon sx={{ fontSize: 18, color: '#616161' }} />
            </Box>
            <Typography sx={{ fontSize: 13.5, color: '#616161', mt: 1.5 }}><b>Also seen in</b> 1 Source</Typography>
          </Box>

          {/* Beats */}
          <Box sx={{ px: 2.5, py: 2, borderTop: '1px solid #eee' }}>
            <Typography sx={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.6, color: '#9e9e9e', mb: 1 }}>BEATS</Typography>
            <Typography sx={{ fontSize: 14.5, color: '#212121' }}>Sporting news & events</Typography>
          </Box>
        </>
      )}
    </>
  )
}
