import { useState, useMemo } from 'react'
import { Box, Typography, Button, IconButton, Checkbox, Avatar, InputBase, Tooltip, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Snackbar } from '@mui/material'
import { alpha } from '@mui/material/styles'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import LinkIcon from '@mui/icons-material/Link'
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined'
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined'
import SearchIcon from '@mui/icons-material/Search'
import ContactMailOutlinedIcon from '@mui/icons-material/ContactMailOutlined'
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import ViewColumnOutlinedIcon from '@mui/icons-material/ViewColumnOutlined'
import SortIcon from '@mui/icons-material/Sort'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import StickyNote2OutlinedIcon from '@mui/icons-material/StickyNote2Outlined'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import CloseIcon from '@mui/icons-material/Close'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import { MEDIA_CONTACTS, TITLES, BEAT_CATEGORIES, LOCATIONS, OUTLETS, LAST_EMAILED } from '../../constants/mediaContacts'
import FilterDropdown from './FilterDropdown'
import ListHealthPanel from './ListHealthPanel'
import AddJournalistSearch from './AddJournalistSearch'
import ContactsInsights from './ContactsInsights'

const TEAL = '#1D9F9F'
const MAGENTA = '#B627A1'

const SUB_TABS = [
  { key: 'journalists', label: 'Journalists', icon: ContactMailOutlinedIcon },
  { key: 'newsdesks', label: 'Newsdesks', icon: ApartmentOutlinedIcon },
  { key: 'private', label: 'Private Contacts', icon: LockOutlinedIcon },
]

// Filter config: key on the contact object, display label, option pool, folder style
const FILTER_DEFS = [
  { key: 'title', field: 'title', label: 'Title', pool: TITLES, useFolder: false },
  { key: 'beat', field: 'beatCategory', label: 'Beats', pool: BEAT_CATEGORIES, useFolder: true },
  { key: 'location', field: 'location', label: 'Location', pool: LOCATIONS, useFolder: true },
  { key: 'outlet', field: 'outlet', label: 'Media Outlet', pool: OUTLETS, useFolder: false },
]

const ROWS_PER_PAGE = 25

const GRID = '40px minmax(180px,1.5fr) minmax(150px,1.3fr) minmax(130px,1.1fr) 110px 96px 120px 44px'

// X (Twitter) black circular logo badge
function XBadge() {
  return (
    <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#fff', lineHeight: 1 }}>𝕏</Typography>
    </Box>
  )
}

function HeaderCell({ label, info, sortActive }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#616161' }}>{label}</Typography>
      {sortActive && <ArrowUpwardIcon sx={{ fontSize: 14, color: '#616161' }} />}
      {info && <InfoOutlinedIcon sx={{ fontSize: 14, color: '#9e9e9e' }} />}
    </Box>
  )
}


export default function MediaListPage() {
  const [tab, setTab] = useState('media-list')
  const [subTab, setSubTab] = useState('journalists')
  const [contacts, setContacts] = useState(MEDIA_CONTACTS)
  const [selected, setSelected] = useState([]) // array of contact ids
  const [page, setPage] = useState(0)
  const [removeAnchor, setRemoveAnchor] = useState(null)
  const [confirm, setConfirm] = useState(null) // 'this' | 'all' | null
  const [filters, setFilters] = useState({ title: [], beat: [], location: [], outlet: [] })
  const [snackOpen, setSnackOpen] = useState(false)

  // Add a searched journalist to the table (kept alphabetical) and confirm via snackbar
  const addJournalist = (j) => {
    const nextId = contacts.reduce((m, c) => Math.max(m, c.id), 0) + 1
    const newContact = {
      id: nextId, name: j.name, color: j.color, private: false,
      onList: 'Eco Media List', beats: '---', notes: 0, openRate: '—', last: 'Just now',
      title: j.title, beatCategory: j.beatCategory, location: j.country, outlet: j.outlet,
      opened: false, clicked: false, unsubscribed: false, bounced: false,
      lastResponseDays: 0, lastPublishedDays: 0,
    }
    const next = [...contacts, newContact]
    setContacts(next)
    // Jump to the page where the contact lands alphabetically so it's visible
    const sortedIdx = [...next].sort((a, b) => a.name.localeCompare(b.name)).findIndex(c => c.id === nextId)
    setPage(Math.floor(sortedIdx / ROWS_PER_PAGE))
    setSnackOpen(true)
  }
  // List Health filters — engagement is single-select; inactivity combines with it
  const [engagement, setEngagement] = useState(null) // 'opened' | 'not-opened' | 'clicked' | 'not-clicked' | 'unsubscribed' | 'bounced' | null
  const [respInactive, setRespInactive] = useState({ active: false, value: 3 }) // value = no-reply outreach attempts
  const [pubInactive, setPubInactive] = useState({ active: false, value: 3 }) // value = months since last published

  // --- Column filters ---
  const matchesExcept = (c, skipKey) => FILTER_DEFS.every(def =>
    def.key === skipKey || filters[def.key].length === 0 || filters[def.key].includes(c[def.field]))
  const columnFiltered = useMemo(
    () => contacts.filter(c => matchesExcept(c, null)),
    [contacts, filters], // eslint-disable-line
  )
  const optionsFor = (def) => def.pool.map(value => ({
    value,
    count: contacts.filter(c => c[def.field] === value && matchesExcept(c, def.key)).length,
  }))

  // --- Health filter predicates ---
  const engagementPred = {
    'opened': c => c.opened, 'not-opened': c => !c.opened,
    'clicked': c => c.clicked, 'not-clicked': c => !c.clicked,
    'unsubscribed': c => c.unsubscribed, 'bounced': c => c.bounced,
  }
  const matchesHealth = (c, { eng = engagement, resp = respInactive, pub = pubInactive } = {}) => {
    if (eng && !engagementPred[eng](c)) return false
    if (resp.active && !(c.noReplyAttempts >= resp.value)) return false
    if (pub.active && !(c.lastPublishedDays > pub.value * 30)) return false
    return true
  }

  const filteredContacts = useMemo(
    () => columnFiltered.filter(c => matchesHealth(c)).sort((a, b) => a.name.localeCompare(b.name)),
    [columnFiltered, engagement, respInactive, pubInactive], // eslint-disable-line
  )

  // Health counts — computed over the column-filtered set (stable; each box always shows
  // its own total regardless of which health filter is active, matching the reference).
  const healthTotal = columnFiltered.length
  const healthCounts = {
    opened: columnFiltered.filter(c => c.opened).length,
    notOpened: columnFiltered.filter(c => !c.opened).length,
    clicked: columnFiltered.filter(c => c.clicked).length,
    notClicked: columnFiltered.filter(c => !c.clicked).length,
    unsubscribed: columnFiltered.filter(c => c.unsubscribed).length,
    bounced: columnFiltered.filter(c => c.bounced).length,
  }
  const respCount = columnFiltered.filter(c => c.noReplyAttempts >= respInactive.value).length
  const pubCount = columnFiltered.filter(c => c.lastPublishedDays > pubInactive.value * 30).length

  const anyFilter = Object.values(filters).some(a => a.length > 0) || !!engagement || respInactive.active || pubInactive.active

  // Table header: generic "N Contacts Filtered" whenever a List Health filter (engagement
  // or inactivity) is active, so it stays accurate when combining several at once.
  const healthActive = !!engagement || respInactive.active || pubInactive.active
  const headerText = healthActive
    ? `${filteredContacts.length} Contacts Filtered`
    : anyFilter ? `${filteredContacts.length} Results` : `${filteredContacts.length} Contacts`

  const afterFilterChange = () => { setPage(0); setSelected([]) }
  const applyFilter = (key, values) => { setFilters(prev => ({ ...prev, [key]: values })); afterFilterChange() }
  const toggleEngagement = (key) => { setEngagement(prev => prev === key ? null : key); afterFilterChange() }
  const setRespValue = (v) => { setRespInactive(p => ({ ...p, value: v })); afterFilterChange() }
  const toggleResp = () => { setRespInactive(p => ({ ...p, active: !p.active })); afterFilterChange() }
  const setPubValue = (v) => { setPubInactive(p => ({ ...p, value: v })); afterFilterChange() }
  const togglePub = () => { setPubInactive(p => ({ ...p, active: !p.active })); afterFilterChange() }

  const pageCount = Math.max(1, Math.ceil(filteredContacts.length / ROWS_PER_PAGE))
  const pageStart = page * ROWS_PER_PAGE
  const pageRows = useMemo(() => filteredContacts.slice(pageStart, pageStart + ROWS_PER_PAGE), [filteredContacts, pageStart])

  const pageIds = pageRows.map(c => c.id)
  const allPageSelected = pageIds.length > 0 && pageIds.every(id => selected.includes(id))
  const toggleAll = () => setSelected(allPageSelected ? selected.filter(id => !pageIds.includes(id)) : [...new Set([...selected, ...pageIds])])
  const toggle = (id) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  const clearSelection = () => setSelected([])

  const goPage = (delta) => {
    setPage(p => Math.min(pageCount - 1, Math.max(0, p + delta)))
  }

  const openRemoveMenu = (e) => setRemoveAnchor(e.currentTarget)
  const closeRemoveMenu = () => setRemoveAnchor(null)
  const chooseRemove = (scope) => { setRemoveAnchor(null); setConfirm(scope) }
  const confirmRemove = () => {
    setContacts(prev => prev.filter(c => !selected.includes(c.id)))
    setSelected([])
    setConfirm(null)
  }

  const selCount = selected.length

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', bgcolor: '#f5f5f5' }}>

      {/* Breadcrumb / action bar */}
      <Box sx={{ flexShrink: 0, bgcolor: 'background.paper', borderBottom: '1px solid #e0e0e0', px: 2, py: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
          <IconButton size="small"><ArrowBackIcon sx={{ fontSize: 20, color: '#424242' }} /></IconButton>
          <Typography sx={{ fontSize: 14, color: '#757575', whiteSpace: 'nowrap', cursor: 'pointer', '&:hover': { color: '#424242' } }}>All Lists and Connections</Typography>
          <ChevronRightIcon sx={{ fontSize: 18, color: '#bdbdbd' }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, cursor: 'pointer' }}>
            <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#212121', whiteSpace: 'nowrap' }}>Eco Media List</Typography>
            <ArrowDropDownIcon sx={{ fontSize: 20, color: '#616161' }} />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Tooltip title="Export"><IconButton size="small"><FileDownloadOutlinedIcon sx={{ fontSize: 20, color: '#616161' }} /></IconButton></Tooltip>
          <Tooltip title="Match private and public contacts"><IconButton size="small"><LinkIcon sx={{ fontSize: 20, color: '#616161' }} /></IconButton></Tooltip>
          <Tooltip title="Import"><IconButton size="small"><CloudUploadOutlinedIcon sx={{ fontSize: 20, color: '#616161' }} /></IconButton></Tooltip>
          <Tooltip title="Add contact"><IconButton size="small"><PersonAddAltOutlinedIcon sx={{ fontSize: 20, color: '#616161' }} /></IconButton></Tooltip>
          <Button variant="contained" disableElevation sx={{ ml: 0.5, textTransform: 'none', bgcolor: MAGENTA, '&:hover': { bgcolor: '#9C1F8A' }, fontWeight: 700, fontSize: 14, height: 36, borderRadius: 0.75, px: 2 }}>
            Email This List
          </Button>
        </Box>
      </Box>

      {/* Top white band — full width: tabs + Add a Journalist */}
      <Box sx={{ flexShrink: 0, bgcolor: 'background.paper', borderBottom: '1px solid #e0e0e0', px: 2, pt: 0.5, pb: 2 }}>
        {/* Page tabs */}
        <Box sx={{ display: 'flex', gap: 3, borderBottom: '1px solid #e0e0e0', mb: 2.5 }}>
          {[
            { key: 'media-list', label: 'Media List' },
            { key: 'analytics', label: 'Contacts Insights' },
          ].map(t => {
            const active = tab === t.key
            return (
              <Box key={t.key} onClick={() => setTab(t.key)} sx={{ py: 1.25, cursor: 'pointer', borderBottom: active ? `2px solid ${TEAL}` : '2px solid transparent', mb: '-1px' }}>
                <Typography sx={{ fontSize: 15, fontWeight: active ? 700 : 500, color: active ? '#212121' : '#757575' }}>{t.label}</Typography>
              </Box>
            )
          })}
        </Box>

        {/* Add a Journalist — interactive search */}
        <AddJournalistSearch onAdd={addJournalist} />
      </Box>

      {/* Content — fills remaining width & height, edge to edge */}
      <Box sx={{ flex: 1, minHeight: 0, overflow: 'hidden', px: 2, py: 2, display: 'flex' }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>

        {tab === 'analytics' ? (
          <ContactsInsights contacts={contacts} />
        ) : (
          /* Split: List Health panel (left) + contacts table (right) */
          <Box sx={{ flex: 1, minHeight: 0, display: 'flex', gap: 2 }}>

          <ListHealthPanel
            lastEmailed={LAST_EMAILED}
            engagement={engagement}
            onEngagement={toggleEngagement}
            counts={healthCounts}
            total={healthTotal}
            respInactive={respInactive}
            onRespValue={setRespValue}
            onRespToggle={toggleResp}
            respCount={respCount}
            pubInactive={pubInactive}
            onPubValue={setPubValue}
            onPubToggle={togglePub}
            pubCount={pubCount}
          />

          {/* Contacts panel — grows to fill remaining width & height */}
          <Box sx={{ flex: 1, minWidth: 0, minHeight: 0, border: '1px solid #e0e0e0', borderRadius: 1, bgcolor: 'background.paper', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

            {/* Sub-tabs */}
            <Box sx={{ display: 'flex', gap: 0.5, px: 1.5, pt: 1.25, borderBottom: '1px solid #e0e0e0', flexShrink: 0 }}>
              {SUB_TABS.map(st => {
                const active = subTab === st.key
                const Icon = st.icon
                return (
                  <Box key={st.key} onClick={() => setSubTab(st.key)} sx={{ display: 'flex', alignItems: 'center', gap: 0.75, px: 1.5, py: 1, cursor: 'pointer', borderRadius: '6px 6px 0 0', borderBottom: active ? `2px solid ${TEAL}` : '2px solid transparent', bgcolor: active ? alpha(TEAL, 0.08) : 'transparent', mb: '-1px' }}>
                    <Icon sx={{ fontSize: 18, color: active ? TEAL : '#757575' }} />
                    <Typography sx={{ fontSize: 14, fontWeight: active ? 700 : 500, color: active ? '#212121' : '#757575' }}>{st.label}</Typography>
                  </Box>
                )
              })}
            </Box>

            {/* Toolbar — swaps to a selection action bar when contacts are selected */}
            {selCount > 0 ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 1.25, flexShrink: 0, bgcolor: alpha(TEAL, 0.12), flexWrap: 'wrap' }}>
                <IconButton size="small" onClick={clearSelection} sx={{ color: '#00827F' }}><CloseIcon sx={{ fontSize: 20 }} /></IconButton>
                <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#00827F', mr: 1 }}>
                  {selCount} {selCount === 1 ? 'Journalist' : 'Journalists'} selected
                </Typography>
                <Button size="small" startIcon={<PersonAddAltOutlinedIcon sx={{ fontSize: 18 }} />}
                  sx={{ textTransform: 'none', bgcolor: 'transparent', color: '#00827F', border: '1px solid', borderColor: alpha('#00827F', 0.4), fontWeight: 700, fontSize: 13, borderRadius: 1, px: 1.5, '&:hover': { bgcolor: alpha('#00827F', 0.06) } }}>
                  Add to list
                </Button>
                <Button size="small" onClick={openRemoveMenu} startIcon={<DeleteOutlineIcon sx={{ fontSize: 18 }} />} endIcon={<ArrowDropDownIcon sx={{ fontSize: 18 }} />}
                  sx={{ textTransform: 'none', bgcolor: 'transparent', color: '#00827F', border: '1px solid', borderColor: alpha('#00827F', 0.4), fontWeight: 700, fontSize: 13, borderRadius: 1, px: 1.5, '&:hover': { bgcolor: alpha('#00827F', 0.06) } }}>
                  Remove
                </Button>
                <Tooltip title="Email this selection"><IconButton size="small" sx={{ color: '#00827F' }}><MailOutlineIcon sx={{ fontSize: 20 }} /></IconButton></Tooltip>
                <Tooltip title="Export this selection"><IconButton size="small" sx={{ color: '#00827F' }}><FileDownloadOutlinedIcon sx={{ fontSize: 20 }} /></IconButton></Tooltip>
                <Tooltip title="Add to Author List"><IconButton size="small"><XBadge /></IconButton></Tooltip>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1.5, flexShrink: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexShrink: 0 }}>
                  <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#212121', whiteSpace: 'nowrap' }}>
                    {headerText}
                  </Typography>
                  <InfoOutlinedIcon sx={{ fontSize: 16, color: '#9e9e9e' }} />
                </Box>
                {/* Filters — horizontal scroll when they grow, never wrap/collapse */}
                <Box sx={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 1, overflowX: 'auto', py: 0.5, '&::-webkit-scrollbar': { height: 6 }, '&::-webkit-scrollbar-thumb': { bgcolor: '#e0e0e0', borderRadius: 3 } }}>
                  {FILTER_DEFS.map(def => (
                    <FilterDropdown key={def.key} label={def.label} options={optionsFor(def)} selected={filters[def.key]} onApply={(v) => applyFilter(def.key, v)} useFolder={def.useFolder} />
                  ))}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
                  <Tooltip title="Columns"><IconButton size="small"><ViewColumnOutlinedIcon sx={{ fontSize: 20, color: '#616161' }} /></IconButton></Tooltip>
                  <Tooltip title="Sort"><IconButton size="small"><SortIcon sx={{ fontSize: 20, color: '#616161' }} /></IconButton></Tooltip>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, height: 34, px: 1.5, border: '1px solid #e0e0e0', borderRadius: 5, minWidth: 160 }}>
                    <SearchIcon sx={{ fontSize: 18, color: '#9e9e9e' }} />
                    <InputBase placeholder="Find" sx={{ flex: 1, fontSize: 14 }} />
                  </Box>
                </Box>
              </Box>
            )}

            {/* Remove dropdown */}
            <Menu anchorEl={removeAnchor} open={Boolean(removeAnchor)} onClose={closeRemoveMenu}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} transformOrigin={{ vertical: 'top', horizontal: 'left' }}>
              <MenuItem onClick={() => chooseRemove('this')} sx={{ fontSize: 14 }}>From this list</MenuItem>
              <MenuItem onClick={() => chooseRemove('all')} sx={{ fontSize: 14 }}>From all list</MenuItem>
            </Menu>

            {/* Column headers */}
            <Box sx={{ display: 'grid', gridTemplateColumns: GRID, alignItems: 'center', px: 2, py: 1, borderTop: '1px solid #f0f0f0', borderBottom: '1px solid #e0e0e0', bgcolor: '#fafafa', flexShrink: 0 }}>
              <Checkbox size="small" checked={allPageSelected} indeterminate={!allPageSelected && pageIds.some(id => selected.includes(id))} onChange={toggleAll} sx={{ p: 0.25, '&.Mui-checked': { color: '#00827F' }, '&.MuiCheckbox-indeterminate': { color: '#00827F' } }} />
              <HeaderCell label="Name" sortActive />
              <HeaderCell label="On media list" info />
              <HeaderCell label="Beats" />
              <HeaderCell label="Notes" info />
              <HeaderCell label="Open rate" info />
              <HeaderCell label="Last contacted" />
              <Box />
            </Box>

            {/* Rows — scroll within the panel */}
            <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
            {pageRows.map((c) => (
              <Box key={c.id} sx={{ display: 'grid', gridTemplateColumns: GRID, alignItems: 'center', px: 2, py: 1.25, borderBottom: '1px solid #f0f0f0', bgcolor: selected.includes(c.id) ? alpha(TEAL, 0.06) : 'transparent', '&:hover': { bgcolor: selected.includes(c.id) ? alpha(TEAL, 0.1) : '#fafafa' } }}>
                <Checkbox size="small" checked={selected.includes(c.id)} onChange={() => toggle(c.id)} sx={{ p: 0.25, '&.Mui-checked': { color: '#00827F' } }} />
                {/* Name */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0, pr: 1 }}>
                  <Box sx={{ position: 'relative', flexShrink: 0 }}>
                    {c.private ? (
                      <Avatar sx={{ width: 32, height: 32, bgcolor: '#eeeeee' }}><LockOutlinedIcon sx={{ fontSize: 16, color: '#9e9e9e' }} /></Avatar>
                    ) : (
                      <Avatar sx={{ width: 32, height: 32, bgcolor: c.color, fontSize: 13, fontWeight: 700 }}>{c.name.split(' ').map(n => n[0]).join('')}</Avatar>
                    )}
                    {(c.unsubscribed || c.bounced) && (
                      <Box sx={{ position: 'absolute', bottom: -3, right: -3, width: 15, height: 15, bgcolor: '#E53935', borderRadius: '3px', transform: 'rotate(45deg)', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography sx={{ transform: 'rotate(-45deg)', color: 'white', fontSize: 10, fontWeight: 900, lineHeight: 1 }}>!</Typography>
                      </Box>
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, minWidth: 0 }}>
                    <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#212121', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</Typography>
                    {c.unsubscribed ? (
                      <Typography sx={{ fontSize: 12, color: '#E53935', flexShrink: 0 }}>Unsubscribed</Typography>
                    ) : c.bounced ? (
                      <Typography sx={{ fontSize: 12, color: '#E53935', flexShrink: 0 }}>Bounced</Typography>
                    ) : c.private ? (
                      <Typography sx={{ fontSize: 12, color: '#9e9e9e', flexShrink: 0 }}>Private</Typography>
                    ) : null}
                  </Box>
                </Box>
                {/* On media list */}
                <Typography sx={{ fontSize: 13, color: '#424242', pr: 1, lineHeight: 1.35, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{c.onList}</Typography>
                {/* Beats */}
                <Typography sx={{ fontSize: 13, color: c.beats === '---' ? '#bdbdbd' : '#424242', pr: 1, lineHeight: 1.35, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{c.beats}</Typography>
                {/* Notes */}
                {c.notes > 0 ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer', width: 'fit-content' }}>
                    <StickyNote2OutlinedIcon sx={{ fontSize: 16, color: TEAL }} />
                    <Typography sx={{ fontSize: 13, fontWeight: 600, color: TEAL }}>{c.notes} {c.notes === 1 ? 'Note' : 'Notes'}</Typography>
                    <ArrowDropDownIcon sx={{ fontSize: 18, color: TEAL }} />
                  </Box>
                ) : (
                  <Typography sx={{ fontSize: 13, color: '#bdbdbd' }}>---</Typography>
                )}
                {/* Open rate */}
                <Typography sx={{ fontSize: 13, color: '#212121' }}>{c.openRate}</Typography>
                {/* Last contacted */}
                <Typography sx={{ fontSize: 13, color: '#424242' }}>{c.last}</Typography>
                {/* Actions */}
                <IconButton size="small"><MoreVertIcon sx={{ fontSize: 18, color: '#9e9e9e' }} /></IconButton>
              </Box>
            ))}
            </Box>

            {/* Pagination */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1.5, px: 2, py: 1.25, flexShrink: 0, borderTop: '1px solid #f0f0f0' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography sx={{ fontSize: 13, color: '#616161' }}>Rows per page:</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <Typography sx={{ fontSize: 13, color: '#212121' }}>25</Typography>
                  <ArrowDropDownIcon sx={{ fontSize: 18, color: '#616161' }} />
                </Box>
              </Box>
              <Typography sx={{ fontSize: 13, color: '#616161' }}>
                {filteredContacts.length === 0 ? '0 of 0' : `${pageStart + 1} - ${Math.min(pageStart + ROWS_PER_PAGE, filteredContacts.length)} of ${filteredContacts.length}`}
              </Typography>
              <Box sx={{ display: 'flex' }}>
                <IconButton size="small" disabled={page === 0} onClick={() => goPage(-1)}><NavigateBeforeIcon sx={{ fontSize: 20 }} /></IconButton>
                <IconButton size="small" disabled={page >= pageCount - 1} onClick={() => goPage(1)}><NavigateNextIcon sx={{ fontSize: 20 }} /></IconButton>
              </Box>
            </Box>
          </Box>
          </Box>
        )}
        </Box>
      </Box>

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
              : `You're about to remove ${selCount} ${selCount === 1 ? 'contact' : 'contacts'} from this list (Eco Media List). This action can't be undone.`}
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

      {/* Confirmation snackbar (bottom-left) */}
      <Snackbar open={snackOpen} onClose={(e, reason) => { if (reason !== 'clickaway') setSnackOpen(false) }} autoHideDuration={4000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, bgcolor: '#212121', color: '#fff', borderRadius: 1, pl: 2, pr: 1, py: 1, boxShadow: '0 4px 12px rgba(0,0,0,0.3)', minWidth: 320 }}>
          <Typography sx={{ fontSize: 14.5, flex: 1 }}>The selected media lists have been updated</Typography>
          <IconButton size="small" onClick={() => setSnackOpen(false)}><CloseIcon sx={{ fontSize: 20, color: '#fff' }} /></IconButton>
        </Box>
      </Snackbar>
    </Box>
  )
}
