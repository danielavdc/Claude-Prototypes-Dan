import { useState, useMemo, useRef } from 'react'
import { Box, Typography, Button, InputBase, IconButton, Checkbox, Tabs, Tab, Divider } from '@mui/material'
import CreateMenu from './CreateMenu'
import { alpha } from '@mui/material/styles'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import SearchIcon from '@mui/icons-material/Search'
import CodeIcon from '@mui/icons-material/Code'
import TuneIcon from '@mui/icons-material/Tune'
import ManageSearchIcon from '@mui/icons-material/ManageSearch'
import FilterListIcon from '@mui/icons-material/FilterList'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import AddIcon from '@mui/icons-material/Add'
import FolderIcon from '@mui/icons-material/Folder'
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import CloseIcon from '@mui/icons-material/Close'
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

const TEAL = '#1D9F9F'
const MAGENTA = '#B627A1'
const BLUE = '#3B6FE0'
const USER_NAME = 'Daniela'

const FOLDERS = [
  { name: 'Brands 2025', count: 3 },
  { name: 'Competitors', count: 3 },
  { name: 'Industry', count: 3 },
  { name: 'Other searches', count: 3, icon: 'doc' },
]

const RECENT_SEARCHES = [
  { name: 'Apple02', type: 'Advanced Search', time: '3d ago', query: '("Apple" OR "AAPL") AND ("iPhone" OR "Mac" OR "Vision Pro")' },
  { name: 'Cars in Germany', type: 'Keyword Search', time: '3d ago', query: '"cars" AND "Germany"' },
  { name: 'BMW Search', type: 'Keyword Search', time: '3d ago', query: '"BMW" OR "Bayerische Motoren Werke"' },
  { name: 'Electric Cars', type: 'Combined Search', time: '5d ago', query: '("EV" OR "electric vehicle") AND ("Tesla" OR "Rivian" OR "BYD")' },
  { name: 'Summer Campaign', type: 'Advanced Search', time: '10d ago', query: '("summer" OR "seasonal") AND ("campaign" OR "promo" OR "launch")' },
  { name: 'Tesla Brand Sentiment', type: 'Advanced Search', time: '12d ago', query: '("Tesla" OR "TSLA") AND ("brand" OR "sentiment" OR "reputation")' },
  { name: 'Cybertruck Coverage', type: 'Keyword Search', time: '14d ago', query: '"Cybertruck" AND ("launch" OR "review")' },
  { name: 'Competitor Watch', type: 'Combined Search', time: '18d ago', query: '("Ford" OR "GM" OR "Rivian") AND "electric"' },
  { name: 'Nike Launch', type: 'Advanced Search', time: '20d ago', query: '"Nike" AND ("launch" OR "drop" OR "collab")' },
  { name: 'Coffee Trends', type: 'Keyword Search', time: '22d ago', query: '"specialty coffee" OR "third wave"' },
  { name: 'Crisis Monitor', type: 'Advanced Search', time: '25d ago', query: '"recall" OR "lawsuit" OR "data breach"' },
  { name: 'Retail Q3', type: 'Combined Search', time: '28d ago', query: '("retail" OR "ecommerce") AND ("Q3" OR "earnings")' },
  { name: 'Fashion Week', type: 'Keyword Search', time: '30d ago', query: '"fashion week" OR "runway"' },
  { name: 'AI Regulation', type: 'Advanced Search', time: '33d ago', query: '("AI" OR "artificial intelligence") AND ("regulation" OR "policy")' },
  { name: 'Gaming News', type: 'Keyword Search', time: '40d ago', query: '"gaming" OR "esports" OR "console"' },
  { name: 'Sustainability', type: 'Advanced Search', time: '45d ago', query: '("sustainability" OR "ESG") AND ("brand" OR "report")' },
]

const SEARCHES = [
  { name: '2test', usedIn: '3 Places', createdBy: 'Angelica G.', lastEdited: 'Jun 23 • 9:31 AM', query: '"2test" OR "test search"' },
  { name: 'Tesla Brand Sentiment', usedIn: '0 Places', createdBy: 'Angelica G.', lastEdited: 'Jun 23 • 9:31 AM', query: '("Tesla" OR "TSLA") AND ("brand" OR "sentiment" OR "perception" OR "reputation")' },
  { name: 'Tesla Product Quality Mentions', usedIn: '0 Places', createdBy: 'Angelica G.', lastEdited: 'Jun 23 • 9:31 AM', query: '"Tesla" AND ("quality" OR "defect" OR "recall")' },
  { name: 'EV Market Share Analysis', usedIn: '1 Places', createdBy: 'Angelica G.', lastEdited: 'Jun 23 • 9:31 AM', query: '("EV" OR "electric vehicle" OR "BEV") AND ("market share" OR "sales")' },
  { name: 'Comparative Coverage: Tesla & Ford', usedIn: '1 Places', createdBy: 'Angelica G.', lastEdited: 'Jun 23 • 9:31 AM', query: '("Tesla" OR "TSLA") AND ("Ford" OR "F-150 Lightning")' },
  { name: 'Cybertruck Launch Coverage', usedIn: '5 Places', createdBy: 'Angelica G.', lastEdited: 'Jun 23 • 9:31 AM', query: '"Cybertruck" AND ("launch" OR "delivery" OR "release")' },
  { name: 'Recall Mentions and Updates', usedIn: '3 Places', createdBy: 'Angelica G.', lastEdited: 'Jun 23 • 9:31 AM', sub: 'Crisis Tracking', query: '"Tesla" AND ("recall" OR "NHTSA" OR "safety issue")' },
]

const TABS = ['Searches', 'Custom Categories', 'Author Lists', 'Filter Sets']
const FIND_PLACEHOLDER = ['Find a saved search by name…', 'Find a custom category…', 'Find an author list…', 'Find a filter set…']

const BUILDERS = [
  { key: 'advanced', name: 'Advanced Search', description: 'Use Boolean queries for powerful and precise searches.', icon: CodeIcon, iconColor: '#E5397E', iconBg: '#FCE4EC' },
  { key: 'keyword', name: 'Simple Search Builder', description: 'Add keywords, saved searches, categories, and authors with simple, guided inputs.', icon: TuneIcon, iconColor: '#7B5AD6', iconBg: '#EFEAFB' },
]

// Recent assets combining all types (Proposal 3)
const ASSET_KINDS = {
  search: { icon: ManageSearchIcon, color: BLUE, bg: alpha(BLUE, 0.1) },
  category: { icon: AccountTreeOutlinedIcon, color: '#F2994A', bg: '#FFF3E6' },
  author: { icon: PeopleAltOutlinedIcon, color: TEAL, bg: alpha(TEAL, 0.1) },
  filter: { icon: FilterAltOutlinedIcon, color: '#7B5AD6', bg: '#EFEAFB' },
}
const RECENT_ASSETS = [
  { name: 'Apple02', kind: 'search', type: 'Advanced Search', time: '3d ago', query: '("Apple" OR "AAPL") AND ("iPhone" OR "Mac")' },
  { name: 'Tech Competitors', kind: 'category', type: 'Custom Category', time: '4d ago' },
  { name: 'Auto Journalists', kind: 'author', type: 'Author List', time: '5d ago' },
  { name: 'EU News Only', kind: 'filter', type: 'Filter Set', time: '6d ago' },
  { name: 'Cars in Germany', kind: 'search', type: 'Keyword Search', time: '3d ago', query: '"cars" AND "Germany"' },
  { name: 'Crisis Keywords', kind: 'category', type: 'Custom Category', time: '8d ago' },
  { name: 'Tier 1 Press', kind: 'author', type: 'Author List', time: '10d ago' },
  { name: 'Positive Sentiment', kind: 'filter', type: 'Filter Set', time: '12d ago' },
]

const ASSISTANT_SUGGESTIONS = ['Create a crisis search', 'Create a campaign search', 'Create a filter set', 'Create a custom category', 'Create a rule']
const P3_SUGGESTIONS = ['Create a crisis search', 'Create a campaign search', 'Refine an existing search']
// Prebuilt prompts shown inside the Search Assistant side panel (Proposal 1)
const PANEL_PROMPTS = ['Create a crisis search', 'Create a Boolean search', 'Create a campaign search', 'Refine an existing search', 'Create a filter set']

export default function SearchesListPage({ variant = 'classic', onOpenSearch, onCreateSearch }) {
  const [assistantInput, setAssistantInput] = useState('')
  const [assistantOpen, setAssistantOpen] = useState(false)
  const [panelInput, setPanelInput] = useState('')
  const [assistantPanelOpen, setAssistantPanelOpen] = useState(true)
  const [assetsView, setAssetsView] = useState('landing') // Proposal 3: 'landing' | 'all'
  const [recentTab, setRecentTab] = useState('searches') // Proposal 3: 'searches' | 'assets'
  const [assetSearch, setAssetSearch] = useState('')
  const [assetSearchOpen, setAssetSearchOpen] = useState(false)
  const [tab, setTab] = useState(0)
  const [findQuery, setFindQuery] = useState('')
  const [selectedAll, setSelectedAll] = useState(false)
  const [selected, setSelected] = useState([])
  const [createAnchor, setCreateAnchor] = useState(null)
  const blurTimer = useRef(null)

  const askAssistant = () => onCreateSearch?.('ai-assistant')
  const toggleRow = (i) => setSelected(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i])

  const filteredSearches = useMemo(() => {
    const q = findQuery.trim().toLowerCase()
    const rows = SEARCHES.map((row, i) => ({ row, i }))
    if (!q) return rows
    return rows.filter(({ row }) => row.name.toLowerCase().includes(q) || (row.sub && row.sub.toLowerCase().includes(q)))
  }, [findQuery])

  // Proposal 3 asset finder — categorized matches
  const q3 = assetSearch.trim().toLowerCase()
  const matchSearches = q3 ? SEARCHES.filter(s => s.name.toLowerCase().includes(q3)) : []
  const matchAssets = q3 ? RECENT_ASSETS.filter(a => a.kind !== 'search' && a.name.toLowerCase().includes(q3)) : []

  const openAssistant = () => { if (blurTimer.current) clearTimeout(blurTimer.current); setAssistantOpen(true) }
  const closeAssistantSoon = () => { blurTimer.current = setTimeout(() => setAssistantOpen(false), 150) }

  const assistantAvatar = (size = 30) => (
    <Box sx={{ width: size, height: size, borderRadius: '50%', background: 'linear-gradient(135deg, #9C4DD6 0%, #1D9F9F 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <AutoFixHighIcon sx={{ fontSize: size * 0.55, color: 'white' }} />
    </Box>
  )

  const createButton = (
    <>
      <Button variant="contained" endIcon={<ArrowDropDownIcon />}
        onClick={(e) => setCreateAnchor(e.currentTarget)}
        sx={{ bgcolor: MAGENTA, color: 'white', fontWeight: 700, fontSize: 14, height: 40, borderRadius: 0.5, px: 2.5, flexShrink: 0, '&:hover': { bgcolor: '#9C1F8A' } }}>
        Create
      </Button>
      <CreateMenu anchorEl={createAnchor} onClose={() => setCreateAnchor(null)} onSelect={(key) => onCreateSearch?.(key)} />
    </>
  )

  // ---- Shared blocks ----
  const builderCards = (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      {BUILDERS.map(t => {
        const Icon = t.icon
        return (
          <Box key={t.key} onClick={() => onCreateSearch?.(t.key)}
            sx={{ flex: '1 1 300px', minWidth: 260, bgcolor: 'background.paper', border: '1px solid #e0e0e0', borderRadius: 2.5, px: 2, py: 1.25, display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.04)', transition: 'all 0.12s ease', '&:hover': { borderColor: t.iconColor, transform: 'translateY(-1px)', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' } }}>
            <Box sx={{ width: 40, height: 40, borderRadius: 1, bgcolor: t.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon sx={{ fontSize: 22, color: t.iconColor }} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#212121', lineHeight: 1.3 }}>{t.name}</Typography>
              <Typography sx={{ fontSize: 12.5, color: 'text.secondary', lineHeight: 1.35, mt: 0.25 }}>{t.description}</Typography>
            </Box>
          </Box>
        )
      })}
    </Box>
  )

  const recentSection = (
    <Box sx={{ px: 3, pt: 3 }}>
      <Box sx={{ bgcolor: 'background.paper', border: '1px solid #e0e0e0', borderRadius: 1.5, p: 2.5 }}>
        <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#212121', mb: 2 }}>Recent Searches</Typography>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'nowrap', overflowX: 'auto', pb: 1 }}>
          {RECENT_SEARCHES.slice(0, 10).map(s => (
            <Box key={s.name} onClick={() => onOpenSearch?.(s.query)}
              sx={{ flex: '0 0 240px', width: 240, border: '1px solid #e0e0e0', borderRadius: 1.5, px: 1.75, py: 1.5, display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer', transition: 'all 0.12s ease', '&:hover': { borderColor: TEAL, bgcolor: alpha(TEAL, 0.03) } }}>
              <Box sx={{ width: 36, height: 36, borderRadius: 1, bgcolor: alpha(BLUE, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ManageSearchIcon sx={{ fontSize: 20, color: BLUE }} />
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography noWrap sx={{ fontSize: 14, fontWeight: 700, color: '#212121' }}>{s.name}</Typography>
                <Typography noWrap sx={{ fontSize: 12.5, color: 'text.secondary' }}>{s.type} · {s.time}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )

  const tableSection = (
    <Box sx={{ p: 3 }}>
      <Box sx={{ bgcolor: 'background.paper', border: '1px solid #e0e0e0', borderRadius: 1.5, overflow: 'hidden' }}>
        <Box sx={{ px: 2, pt: 1.5, borderBottom: '1px solid #e0e0e0' }}>
          <Tabs value={tab} onChange={(_, v) => { setTab(v); setFindQuery('') }} sx={{ minHeight: 40, '& .MuiTabs-indicator': { bgcolor: TEAL, height: 3 } }}>
            {TABS.map((label, i) => (
              <Tab key={label} label={label} sx={{ minHeight: 36, fontSize: 14, fontWeight: tab === i ? 700 : 400, color: '#212121 !important', textTransform: 'none', px: 2, borderRadius: '4px 4px 0 0', bgcolor: tab === i ? alpha(TEAL, 0.1) : 'transparent', mr: 0.5 }} />
            ))}
          </Tabs>
        </Box>
        <Box sx={{ display: 'flex', minHeight: 460 }}>
          <Box sx={{ width: 260, flexShrink: 0, borderRight: '1px solid #e0e0e0', display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1.5, bgcolor: alpha(TEAL, 0.08), borderLeft: `3px solid ${TEAL}`, cursor: 'pointer' }}>
              <Typography sx={{ fontSize: 14, fontWeight: 700, color: TEAL }}>All Searches</Typography>
              <Typography sx={{ fontSize: 13, color: TEAL, fontWeight: 600 }}>10</Typography>
            </Box>
            <Divider />
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, pt: 1.5, pb: 1 }}>
              <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#9e9e9e', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Folders</Typography>
              <IconButton size="small"><AddIcon sx={{ fontSize: 16, color: '#9e9e9e' }} /></IconButton>
            </Box>
            {FOLDERS.map((f, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 1, cursor: 'pointer', '&:hover': { bgcolor: alpha('#000', 0.04) } }}>
                {f.icon === 'doc'
                  ? <InsertDriveFileOutlinedIcon sx={{ fontSize: 20, color: '#616161' }} />
                  : <><ChevronRightIcon sx={{ fontSize: 16, color: '#9e9e9e' }} /><FolderIcon sx={{ fontSize: 20, color: '#616161' }} /></>}
                <Typography sx={{ fontSize: 14, color: '#424242', flex: 1 }}>{f.name}</Typography>
                <Typography sx={{ fontSize: 13, color: '#9e9e9e' }}>{f.count}</Typography>
              </Box>
            ))}
          </Box>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1.25, borderBottom: '1px solid #f0f0f0', gap: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, border: '1px solid #e0e0e0', borderRadius: 1, px: 1.5, height: 38, flex: 1, maxWidth: 420, bgcolor: '#fafafa', '&:focus-within': { borderColor: TEAL, bgcolor: 'background.paper' } }}>
                <SearchIcon sx={{ fontSize: 19, color: '#9e9e9e' }} />
                <InputBase placeholder={FIND_PLACEHOLDER[tab]} value={findQuery} onChange={e => setFindQuery(e.target.value)} sx={{ flex: 1, fontSize: 14, color: '#212121' }} />
              </Box>
              <Button startIcon={<FilterListIcon sx={{ fontSize: 18 }} />} sx={{ color: '#616161', textTransform: 'none', fontSize: 14, fontWeight: 500, height: 38, borderRadius: 1 }}>Filter</Button>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: '44px 1fr 120px 140px 160px 44px', borderBottom: '1px solid #e0e0e0', bgcolor: '#fafafa' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 1 }}>
                <Checkbox size="small" checked={selectedAll} onChange={e => { setSelectedAll(e.target.checked); setSelected(e.target.checked ? SEARCHES.map((_, i) => i) : []) }} />
              </Box>
              {['Name', 'Used in', 'Created by', 'Last edited'].map(h => (
                <Box key={h} sx={{ display: 'flex', alignItems: 'center', py: 1, px: 1.5 }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#424242' }}>{h}</Typography>
                </Box>
              ))}
              <Box />
            </Box>
            {filteredSearches.map(({ row, i }) => (
              <Box key={i} sx={{ display: 'grid', gridTemplateColumns: '44px 1fr 120px 140px 160px 44px', borderBottom: '1px solid #f0f0f0', cursor: 'pointer', '&:hover': { bgcolor: alpha(TEAL, 0.04) } }} onClick={() => onOpenSearch?.(row.query)}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={e => e.stopPropagation()}>
                  <Checkbox size="small" checked={selected.includes(i)} onChange={() => toggleRow(i)} />
                </Box>
                <Box sx={{ py: 1.5, px: 1.5 }}>
                  <Typography sx={{ fontSize: 14, color: '#212121' }}>{row.name}</Typography>
                  {row.sub && <Typography sx={{ fontSize: 12, color: '#9e9e9e' }}>{row.sub}</Typography>}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', px: 1.5 }}><Typography sx={{ fontSize: 14, color: '#424242' }}>{row.usedIn}</Typography></Box>
                <Box sx={{ display: 'flex', alignItems: 'center', px: 1.5 }}><Typography sx={{ fontSize: 14, color: '#424242' }}>{row.createdBy}</Typography></Box>
                <Box sx={{ display: 'flex', alignItems: 'center', px: 1.5 }}><Typography sx={{ fontSize: 14, color: '#424242' }}>{row.lastEdited}</Typography></Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={e => e.stopPropagation()}>
                  <IconButton size="small"><MoreVertIcon sx={{ fontSize: 18, color: '#9e9e9e' }} /></IconButton>
                </Box>
              </Box>
            ))}
            {filteredSearches.length === 0 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 6, gap: 0.5 }}>
                <SearchIcon sx={{ fontSize: 32, color: '#e0e0e0' }} />
                <Typography sx={{ fontSize: 14, color: '#9e9e9e' }}>No searches match "{findQuery}"</Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  )

  // ==================== PROPOSAL 2 (formerly "chat") — unchanged assistant-first hero ====================
  if (variant === 'chat') {
    return (
      <Box sx={{ flex: 1, overflow: 'auto', bgcolor: '#f5f5f5' }}>
        <Box sx={{ position: 'relative', overflow: 'hidden', bgcolor: 'background.paper', borderBottom: '1px solid #e0e0e0', px: 4, pt: 3.5, pb: 3 }}>
          <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
            <Box sx={{ position: 'absolute', top: -70, left: -30, width: 180, height: 180, borderRadius: '50%', bgcolor: alpha(TEAL, 0.05) }} />
            <Box sx={{ position: 'absolute', bottom: -90, right: 180, width: 200, height: 200, borderRadius: '50%', bgcolor: alpha(MAGENTA, 0.04) }} />
          </Box>
          <Box sx={{ position: 'relative', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
            <Box>
              <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#212121', lineHeight: 1.25 }}>Create Your Searches and Reusable Assets</Typography>
              <Typography sx={{ fontSize: 14, color: 'text.secondary', mt: 0.5, maxWidth: 760 }}>
                Build searches, filters, and categories once, then reuse them across dashboards, alerts, and newsletters.
              </Typography>
            </Box>
            {createButton}
          </Box>
        </Box>

        <Box sx={{ px: 4, pt: 5, pb: 5, background: `linear-gradient(110deg, ${alpha(MAGENTA, 0.07)} 0%, #ffffff 45%, ${alpha(TEAL, 0.08)} 100%)` }}>
          <Typography sx={{ textAlign: 'center', fontSize: 16, fontWeight: 600, color: MAGENTA, mb: 2 }}>Hi {USER_NAME} 👋</Typography>
          <Typography sx={{ textAlign: 'center', fontSize: 26, fontWeight: 800, color: '#212121' }}>What Do You Want to Track Today?</Typography>
          <Typography sx={{ textAlign: 'center', fontSize: 15, color: 'text.secondary', mt: 1.25 }}>Ask your AI Search Assistant</Typography>

          <Box sx={{ maxWidth: 760, mx: 'auto', mt: 2.5 }}>
            <Box sx={{ position: 'relative' }}>
              <Box sx={{ p: '1.5px', borderRadius: 1.5, background: `linear-gradient(90deg, ${MAGENTA} 0%, ${BLUE} 55%, ${TEAL} 100%)` }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: 'background.paper', borderRadius: '5px', pl: 2, pr: 1, py: 1 }}>
                  <InputBase placeholder="Help me build a search to track my brand across news and social…"
                    value={assistantInput} onChange={e => setAssistantInput(e.target.value)}
                    onFocus={openAssistant} onBlur={closeAssistantSoon}
                    onKeyDown={e => { if (e.key === 'Enter' && assistantInput.trim()) askAssistant() }}
                    sx={{ flex: 1, fontSize: 16, color: '#212121', '& input::placeholder': { color: '#9e9e9e', opacity: 1 } }} />
                  <IconButton onClick={askAssistant} sx={{ bgcolor: TEAL, width: 38, height: 38, '&:hover': { bgcolor: '#178888' } }}>
                    <ArrowForwardIcon sx={{ fontSize: 19, color: 'white' }} />
                  </IconButton>
                </Box>
              </Box>
              {assistantOpen && (
                <Box onMouseDown={e => e.preventDefault()}
                  sx={{ position: 'absolute', top: '100%', left: 0, right: 0, mt: 0.75, bgcolor: 'background.paper', border: '1px solid #e0e0e0', borderRadius: 1.5, boxShadow: '0 8px 28px rgba(0,0,0,0.14)', p: 2, zIndex: 30 }}>
                  <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#9e9e9e', letterSpacing: '0.08em', textTransform: 'uppercase', mb: 1 }}>Suggestions</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {ASSISTANT_SUGGESTIONS.map(s => (
                      <Box key={s} onClick={askAssistant} sx={{ border: '1px solid #e0e0e0', borderRadius: 1, px: 1.5, py: 0.75, cursor: 'pointer', '&:hover': { borderColor: MAGENTA, bgcolor: alpha(MAGENTA, 0.03) } }}>
                        <Typography sx={{ fontSize: 13.5, color: '#212121' }}>{s}</Typography>
                      </Box>
                    ))}
                  </Box>
                  <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#9e9e9e', letterSpacing: '0.08em', textTransform: 'uppercase', mb: 1 }}>Refine a saved search</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {RECENT_SEARCHES.slice(0, 4).map(s => (
                      <Box key={s.name} onClick={() => onOpenSearch?.(s.query)} sx={{ border: '1px solid #e0e0e0', borderRadius: 1, px: 1.5, py: 0.75, cursor: 'pointer', '&:hover': { borderColor: TEAL, bgcolor: alpha(TEAL, 0.04) } }}>
                        <Typography sx={{ fontSize: 13.5, color: '#212121' }}>{s.name}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          </Box>

          <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4 }}>
            <Typography sx={{ textAlign: 'center', fontSize: 15, color: 'text.secondary', mb: 1.5 }}>Prefer to build the search yourself?</Typography>
            {builderCards}
          </Box>
        </Box>

        {recentSection}
        {tableSection}
      </Box>
    )
  }

  // ==================== PROPOSAL 3 — minimalist, AI-first ====================
  if (variant === 'proposal3') {
    const headerBanner = (
      <Box sx={{ position: 'relative', overflow: 'hidden', px: 4, pt: 3.5, pb: 3 }}>
        <Box sx={{ position: 'relative', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
          <Box>
            <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#212121', lineHeight: 1.25 }}>Create Your Searches and Reusable Assets</Typography>
            <Typography sx={{ fontSize: 14, color: 'text.secondary', mt: 0.5, maxWidth: 760 }}>
              Build searches, filters, and categories once, then reuse them across dashboards, alerts, and newsletters.
            </Typography>
          </Box>
          {createButton}
        </Box>
      </Box>
    )

    // --- "See all" opens the CRUD table as its own page (with a back arrow) ---
    if (assetsView === 'all') {
      return (
        <Box sx={{ flex: 1, overflow: 'auto', bgcolor: '#f5f5f5' }}>
          {headerBanner}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 3, pt: 3 }}>
            <IconButton size="small" onClick={() => setAssetsView('landing')} sx={{ border: '1px solid #e0e0e0', bgcolor: 'background.paper' }}>
              <ArrowBackIcon sx={{ fontSize: 18, color: '#424242' }} />
            </IconButton>
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#212121' }}>All assets</Typography>
          </Box>
          {tableSection}
        </Box>
      )
    }

    // --- Minimalist AI-first landing ---
    return (
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: `linear-gradient(155deg, ${alpha(MAGENTA, 0.07)} 0%, #ffffff 48%, ${alpha(TEAL, 0.08)} 100%)` }}>
        {headerBanner}

        {/* AI-first hero — flexes to fill remaining space (no page scroll) */}
        <Box sx={{ px: 4, py: 2, flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography sx={{ textAlign: 'center', fontSize: 28, fontWeight: 700, color: '#212121', mb: 4 }}>
            Hey {USER_NAME}, what do you want to track?
          </Typography>
          <Box sx={{ maxWidth: 680, mx: 'auto', width: '100%' }}>
            <Box sx={{ p: '1.5px', borderRadius: 2, background: `linear-gradient(90deg, ${MAGENTA} 0%, ${BLUE} 55%, ${TEAL} 100%)` }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: 'background.paper', borderRadius: '7px', pl: 2, pr: 1, py: 1.5 }}>
                <InputBase autoFocus placeholder="Help me build a search to track my brand across news and social…"
                  value={assistantInput} onChange={e => setAssistantInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && assistantInput.trim()) askAssistant() }}
                  sx={{ flex: 1, fontSize: 16, color: '#212121', '& input::placeholder': { color: '#9e9e9e', opacity: 1 } }} />
                <IconButton onClick={askAssistant} sx={{ bgcolor: TEAL, width: 38, height: 38, '&:hover': { bgcolor: '#178888' } }}>
                  <ArrowForwardIcon sx={{ fontSize: 19, color: 'white' }} />
                </IconButton>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1, mt: 2 }}>
              {P3_SUGGESTIONS.map(s => (
                <Box key={s} onClick={askAssistant}
                  sx={{ border: '1px solid #e0e0e0', borderRadius: 5, px: 1.75, py: 0.75, cursor: 'pointer', bgcolor: 'background.paper', '&:hover': { borderColor: MAGENTA, bgcolor: alpha(MAGENTA, 0.03) } }}>
                  <Typography sx={{ fontSize: 13, color: '#424242' }}>{s}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* Recent — tabbed (Searches / Assets), floating white frame over the gradient */}
        <Box sx={{ px: 3, pb: 3, flexShrink: 0 }}>
          <Box sx={{ maxWidth: 1100, mx: 'auto', bgcolor: 'background.paper', borderRadius: 2.5, boxShadow: '0 2px 14px rgba(0,0,0,0.06)', px: 2.5, pt: 1, pb: 2.5 }}>
            {/* Tab row */}
            <Box sx={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #eee', mb: 2 }}>
              {[{ k: 'searches', l: 'Recent Searches' }, { k: 'assets', l: 'Recent Assets' }].map(t => {
                const active = recentTab === t.k
                return (
                  <Box key={t.k} onClick={() => setRecentTab(t.k)}
                    sx={{ px: 1.5, py: 1.25, cursor: 'pointer', borderBottom: active ? `2px solid ${TEAL}` : '2px solid transparent', mb: '-1px' }}>
                    <Typography sx={{ fontSize: 14, fontWeight: active ? 700 : 500, color: active ? TEAL : '#616161' }}>{t.l}</Typography>
                  </Box>
                )
              })}
              <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 2 }}>
                {/* Asset finder with categorized dropdown */}
                <Box sx={{ position: 'relative' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, border: '1px solid #e0e0e0', borderRadius: 5, px: 1.5, height: 34, width: 220, bgcolor: '#fafafa', '&:focus-within': { borderColor: TEAL, bgcolor: 'background.paper' } }}>
                    <SearchIcon sx={{ fontSize: 17, color: '#9e9e9e' }} />
                    <InputBase placeholder="Find an asset" value={assetSearch}
                      onChange={e => { setAssetSearch(e.target.value); setAssetSearchOpen(true) }}
                      onFocus={() => setAssetSearchOpen(true)}
                      onBlur={() => setTimeout(() => setAssetSearchOpen(false), 150)}
                      sx={{ flex: 1, fontSize: 13.5, color: '#212121' }} />
                  </Box>
                  {assetSearchOpen && q3 && (
                    <Box onMouseDown={e => e.preventDefault()}
                      sx={{ position: 'absolute', top: '100%', right: 0, mt: 0.75, width: 320, bgcolor: 'background.paper', border: '1px solid #e0e0e0', borderRadius: 1.5, boxShadow: '0 8px 28px rgba(0,0,0,0.14)', p: 1, zIndex: 40, maxHeight: 360, overflow: 'auto' }}>
                      {matchSearches.length > 0 && (
                        <Box>
                          <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#9e9e9e', letterSpacing: '0.08em', textTransform: 'uppercase', px: 1, py: 0.75 }}>Searches</Typography>
                          {matchSearches.map(s => (
                            <Box key={s.name} onClick={() => onOpenSearch?.(s.query)}
                              sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1, py: 0.75, borderRadius: 1, cursor: 'pointer', '&:hover': { bgcolor: alpha(TEAL, 0.06) } }}>
                              <ManageSearchIcon sx={{ fontSize: 18, color: BLUE, flexShrink: 0 }} />
                              <Typography noWrap sx={{ fontSize: 13.5, color: '#212121' }}>{s.name}</Typography>
                            </Box>
                          ))}
                        </Box>
                      )}
                      {matchAssets.length > 0 && (
                        <Box sx={{ mt: matchSearches.length ? 0.5 : 0 }}>
                          <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#9e9e9e', letterSpacing: '0.08em', textTransform: 'uppercase', px: 1, py: 0.75 }}>Assets</Typography>
                          {matchAssets.map(a => {
                            const k = ASSET_KINDS[a.kind]
                            const Icon = k.icon
                            return (
                              <Box key={a.name} onClick={() => setAssetsView('all')}
                                sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1, py: 0.75, borderRadius: 1, cursor: 'pointer', '&:hover': { bgcolor: alpha(TEAL, 0.06) } }}>
                                <Icon sx={{ fontSize: 18, color: k.color, flexShrink: 0 }} />
                                <Box sx={{ minWidth: 0 }}>
                                  <Typography noWrap sx={{ fontSize: 13.5, color: '#212121' }}>{a.name}</Typography>
                                  <Typography noWrap sx={{ fontSize: 11.5, color: 'text.secondary' }}>{a.type}</Typography>
                                </Box>
                              </Box>
                            )
                          })}
                        </Box>
                      )}
                      {matchSearches.length === 0 && matchAssets.length === 0 && (
                        <Typography sx={{ fontSize: 13, color: '#9e9e9e', px: 1, py: 1 }}>No matches for "{assetSearch}"</Typography>
                      )}
                    </Box>
                  )}
                </Box>
                <Typography onClick={() => setAssetsView('all')}
                  sx={{ fontSize: 13.5, fontWeight: 600, color: TEAL, cursor: 'pointer', whiteSpace: 'nowrap', '&:hover': { textDecoration: 'underline' } }}>
                  View All Assets →
                </Typography>
              </Box>
            </Box>

            {/* Cards for the active tab */}
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              {recentTab === 'searches'
                ? RECENT_SEARCHES.slice(0, 8).map(s => (
                    <Box key={s.name} onClick={() => onOpenSearch?.(s.query)}
                      sx={{ flex: '1 1 230px', minWidth: 220, maxWidth: 'calc(25% - 12px)', border: '1px solid #e0e0e0', borderRadius: 1.5, px: 1.75, py: 1.5, display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer', transition: 'all 0.12s ease', '&:hover': { borderColor: TEAL, transform: 'translateY(-1px)', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' } }}>
                      <Box sx={{ width: 36, height: 36, borderRadius: 1, bgcolor: alpha(BLUE, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <ManageSearchIcon sx={{ fontSize: 20, color: BLUE }} />
                      </Box>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography noWrap sx={{ fontSize: 14, fontWeight: 700, color: '#212121' }}>{s.name}</Typography>
                        <Typography noWrap sx={{ fontSize: 12.5, color: 'text.secondary' }}>{s.type} · {s.time}</Typography>
                      </Box>
                    </Box>
                  ))
                : RECENT_ASSETS.map(a => {
                    const k = ASSET_KINDS[a.kind]
                    const Icon = k.icon
                    return (
                      <Box key={a.name} onClick={() => a.query && onOpenSearch?.(a.query)}
                        sx={{ flex: '1 1 230px', minWidth: 220, maxWidth: 'calc(25% - 12px)', border: '1px solid #e0e0e0', borderRadius: 1.5, px: 1.75, py: 1.5, display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer', transition: 'all 0.12s ease', '&:hover': { borderColor: k.color, transform: 'translateY(-1px)', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' } }}>
                        <Box sx={{ width: 36, height: 36, borderRadius: 1, bgcolor: k.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Icon sx={{ fontSize: 20, color: k.color }} />
                        </Box>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography noWrap sx={{ fontSize: 14, fontWeight: 700, color: '#212121' }}>{a.name}</Typography>
                          <Typography noWrap sx={{ fontSize: 12.5, color: 'text.secondary' }}>{a.type} · {a.time}</Typography>
                        </Box>
                      </Box>
                    )
                  })
              }
            </Box>
          </Box>
        </Box>
      </Box>
    )
  }

  // ==================== PROPOSAL 1 (formerly "list") — Search Assistant as a side panel ====================
  return (
    <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
      {/* Main content */}
      <Box sx={{ flex: 1, minWidth: 0, overflow: 'auto', bgcolor: '#f5f5f5' }}>
        {/* Header */}
        <Box sx={{ position: 'relative', overflow: 'hidden', bgcolor: 'background.paper', borderBottom: '1px solid #e0e0e0', px: 4, pt: 3.5, pb: 3 }}>
          <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
            <Box sx={{ position: 'absolute', top: -70, left: -30, width: 180, height: 180, borderRadius: '50%', bgcolor: alpha(TEAL, 0.05) }} />
            <Box sx={{ position: 'absolute', bottom: -90, right: 180, width: 200, height: 200, borderRadius: '50%', bgcolor: alpha(MAGENTA, 0.04) }} />
          </Box>
          <Box sx={{ position: 'relative', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
            <Box>
              <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#212121', lineHeight: 1.25 }}>Create Your Searches and Reusable Assets</Typography>
              <Typography sx={{ fontSize: 14, color: 'text.secondary', mt: 0.5, maxWidth: 760 }}>
                Build searches, filters, and categories once, then reuse them across dashboards, alerts, and newsletters.
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
              {!assistantPanelOpen && (
                <Button variant="outlined" startIcon={<AutoFixHighIcon sx={{ fontSize: 18, color: MAGENTA }} />}
                  onClick={() => setAssistantPanelOpen(true)}
                  sx={{ borderColor: alpha(MAGENTA, 0.4), color: MAGENTA, fontWeight: 700, fontSize: 14, height: 40, borderRadius: 0.5, px: 2, textTransform: 'none', '&:hover': { borderColor: MAGENTA, bgcolor: alpha(MAGENTA, 0.04) } }}>
                  Search Assistant
                </Button>
              )}
              {createButton}
            </Box>
          </Box>
        </Box>

        {/* Start a new search — manual builders */}
        <Box sx={{ px: 4, pt: 3, pb: 3.5, background: `linear-gradient(110deg, ${alpha(MAGENTA, 0.05)} 0%, #ffffff 55%, ${alpha(TEAL, 0.06)} 100%)` }}>
          <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#212121', mb: 1.5 }}>Start a New Search</Typography>
          {builderCards}
        </Box>

        {recentSection}
        {tableSection}
      </Box>

      {/* Search Assistant side panel */}
      {assistantPanelOpen && (
        <Box sx={{ width: 380, flexShrink: 0, borderLeft: '1px solid #e0e0e0', bgcolor: 'background.paper', display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Panel header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 1.5, borderBottom: '1px solid #e0e0e0' }}>
            {assistantAvatar(30)}
            <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#212121', flex: 1 }}>Search Assistant</Typography>
            <IconButton size="small" title="Open in new tab"><OpenInNewIcon sx={{ fontSize: 18, color: '#757575' }} /></IconButton>
            <IconButton size="small" title="Close" onClick={() => setAssistantPanelOpen(false)}><CloseIcon sx={{ fontSize: 19, color: '#757575' }} /></IconButton>
          </Box>

          {/* Panel body */}
          <Box sx={{ flex: 1, overflow: 'auto', px: 2, py: 2.5 }}>
            <Box sx={{ display: 'flex', gap: 1.25, mb: 2.5 }}>
              {assistantAvatar(28)}
              <Box sx={{ bgcolor: alpha(MAGENTA, 0.05), border: `1px solid ${alpha(MAGENTA, 0.15)}`, borderRadius: 1.5, px: 1.75, py: 1.25 }}>
                <Typography sx={{ fontSize: 14, color: '#212121', lineHeight: 1.5 }}>
                  Hi {USER_NAME} 👋 Tell me what you want to track and I'll build or refine a search for you. Try one of these:
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {PANEL_PROMPTS.map(p => (
                <Box key={p} onClick={askAssistant}
                  sx={{ display: 'flex', alignItems: 'center', gap: 1, border: '1px solid #e0e0e0', borderRadius: 1.5, px: 1.75, py: 1.25, cursor: 'pointer', transition: 'all 0.12s ease', '&:hover': { borderColor: MAGENTA, bgcolor: alpha(MAGENTA, 0.03) } }}>
                  <AutoFixHighIcon sx={{ fontSize: 16, color: MAGENTA }} />
                  <Typography sx={{ fontSize: 13.5, color: '#212121' }}>{p}</Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Panel chat input */}
          <Box sx={{ p: 1.5, borderTop: '1px solid #e0e0e0' }}>
            <Box sx={{ p: '1.5px', borderRadius: 1.5, background: `linear-gradient(90deg, ${MAGENTA} 0%, ${BLUE} 55%, ${TEAL} 100%)` }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: 'background.paper', borderRadius: '5px', pl: 1.5, pr: 0.75, py: 0.75 }}>
                <InputBase placeholder="Ask me to create or refine a search…"
                  value={panelInput} onChange={e => setPanelInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && panelInput.trim()) askAssistant() }}
                  sx={{ flex: 1, fontSize: 14, color: '#212121', '& input::placeholder': { color: '#9e9e9e', opacity: 1 } }} />
                <IconButton onClick={askAssistant} sx={{ bgcolor: TEAL, width: 32, height: 32, '&:hover': { bgcolor: '#178888' } }}>
                  <ArrowForwardIcon sx={{ fontSize: 17, color: 'white' }} />
                </IconButton>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  )
}
