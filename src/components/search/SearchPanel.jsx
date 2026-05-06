import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { Box, Typography, Button, IconButton, Chip, Divider, Collapse, Menu, MenuItem, ListItemIcon, ListItemText, Tooltip, Snackbar, Alert, CircularProgress, TextField, InputAdornment, Checkbox, Dialog, DialogTitle, DialogContent, DialogActions, Select } from '@mui/material'
import { alpha } from '@mui/material/styles'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import LanguageIcon from '@mui/icons-material/Language'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import TuneIcon from '@mui/icons-material/Tune'
import FilterListIcon from '@mui/icons-material/FilterAltOutlined'
import LoyaltyIcon from '@mui/icons-material/Loyalty'
import DomainIcon from '@mui/icons-material/Domain'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import BarChartIcon from '@mui/icons-material/BarChart'
import CompareArrowsIcon from '@mui/icons-material/CompareArrows'
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
import SaveIcon from '@mui/icons-material/Save'
import SaveAsIcon from '@mui/icons-material/SaveAs'
import ReplyIcon from '@mui/icons-material/Reply'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import InsertLinkIcon from '@mui/icons-material/InsertLink'
import LinkIcon from '@mui/icons-material/Link'
import GridOnIcon from '@mui/icons-material/GridOn'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import SlideshowIcon from '@mui/icons-material/Slideshow'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import DashboardCustomizeOutlinedIcon from '@mui/icons-material/DashboardCustomizeOutlined'
import CloseIcon from '@mui/icons-material/Close'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import EditIcon from '@mui/icons-material/Edit'
import LabelOutlinedIcon from '@mui/icons-material/LabelOutlined'
import SearchIcon from '@mui/icons-material/Search'
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd'
import AccountTreeIcon from '@mui/icons-material/AccountTree'
import TranslateIcon from '@mui/icons-material/Translate'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import CancelIcon from '@mui/icons-material/Cancel'
import CodeIcon from '@mui/icons-material/Code'
import CallMergeIcon from '@mui/icons-material/CallMerge'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import FilterCenterFocusIcon from '@mui/icons-material/FilterCenterFocus'
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutline'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import ManageSearchIcon from '@mui/icons-material/ManageSearch'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { TABS } from '../../constants/messages'
import { AI_GRADIENT } from '../../constants/layout'
import AddToDashboardModal from '../core/AddToDashboardModal'
import CreateDashboardModal from '../core/CreateDashboardModal'
import SaveSearchModal from '../core/SaveSearchModal'

function SearchWithAIButton({ onClick, open, hasQuery }) {
  return (
    <Button onClick={onClick} variant="outlined" size="small"
      sx={{
        height: 24, px: 0.75, py: 0, borderRadius: 0.5,
        border: '1px solid #8B49A0', minWidth: 0, gap: 0.25,
        '&:hover': { border: '1px solid #8B49A0', bgcolor: alpha('#8B49A0', 0.04) },
        '& .MuiButton-startIcon': { mr: 0.25, ml: 0 },
        '& .MuiButton-endIcon': { ml: 0.25, mr: 0 },
      }}
      startIcon={<AutoFixHighIcon sx={{ fontSize: '14px !important', color: '#8B49A0' }} />}
      endIcon={open
        ? <ArrowDropUpIcon sx={{ fontSize: '16px !important', color: 'rgba(0,0,0,0.54)' }} />
        : <ArrowDropDownIcon sx={{ fontSize: '16px !important', color: 'rgba(0,0,0,0.54)' }} />}
    >
      <Typography component="span" sx={{ fontSize: 12, fontWeight: 700, lineHeight: '16px', background: AI_GRADIENT, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
        {hasQuery ? 'Refine with AI' : 'Create with AI'}
      </Typography>
    </Button>
  )
}

function SearchPanel({
  booleanQuery,
  setBooleanQuery,
  editorExpanded,
  setEditorExpanded,
  activeTab,
  setActiveTab,
  onTabLabelChange,
  onSearch,
  onOpenPanel,
  onDashboardSave,
  onSearchModeChange,
  initialSearchMode,
}) {
  const [dropdownAnchor, setDropdownAnchor] = useState(null)
  const [dashboardAnchor, setDashboardAnchor] = useState(null)
  const [saveAnchor, setSaveAnchor] = useState(null)
  const [downloadAnchor, setDownloadAnchor] = useState(null)
  const [shareableLinkView, setShareableLinkView] = useState(false)
  const [advancedSettingsOpen, setAdvancedSettingsOpen] = useState(false)
  const [expireAfter, setExpireAfter] = useState('30 days')
  const [refreshContent, setRefreshContent] = useState('Never')
  const [tabMenuAnchor, setTabMenuAnchor] = useState(null)
  const [pinTabAnchor, setPinTabAnchor] = useState(null)
  const [tabMenuTabIndex, setTabMenuTabIndex] = useState(null)
  const [tabSetMode, setTabSetMode] = useState('focus')
  const CLASSIC_TABS = [
    { label: 'Overview',        description: '' },
    { label: 'Analytics',       description: '' },
    { label: 'Topic Analytics', description: '' },
    { label: 'X Insight',       description: '' },
    { label: 'Authors',         description: '' },
    { label: 'Media Relations', description: '' },
  ]
  const [tabs, setTabs] = useState(() =>
    TABS.map(t => ({ label: t.label, description: t.description }))
  )
  const [removedTabs, setRemovedTabs] = useState([])

  useEffect(() => {
    const tab = tabs[activeTab]
    const label = typeof tab === 'string' ? tab : tab?.label ?? ''
    onTabLabelChange?.(label)
  }, [activeTab, tabs])

  const [renameModalOpen, setRenameModalOpen] = useState(false)
  const [renameLabel, setRenameLabel] = useState('')
  const [renameDescription, setRenameDescription] = useState('')
  const dragIndexRef = useRef(null)
  const [dragOverIndex, setDragOverIndex] = useState(null)
  const [tabSetMenuAnchor, setTabSetMenuAnchor] = useState(null)
  const tabsScrollRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const checkTabsOverflow = useCallback(() => {
    const el = tabsScrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 2)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2)
  }, [])

  useEffect(() => {
    checkTabsOverflow()
    const el = tabsScrollRef.current
    if (!el) return
    const ro = new ResizeObserver(checkTabsOverflow)
    ro.observe(el)
    return () => ro.disconnect()
  }, [tabs, checkTabsOverflow])
  const [savingView, setSavingView] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const savingTimerRef = useRef(null)
  const triggerSave = useCallback(() => {
    setSavingView(true)
    setSavedSuccess(false)
    clearTimeout(savingTimerRef.current)
    savingTimerRef.current = setTimeout(() => {
      setSavingView(false)
      setSavedSuccess(true)
    }, 2000)
  }, [])
  const [dashboardModalOpen, setDashboardModalOpen] = useState(false)
  const [dashboardModalFromTab, setDashboardModalFromTab] = useState(false)
  const [createDashboardWizardOpen, setCreateDashboardWizardOpen] = useState(false)
  const [saveSearchModalOpen, setSaveSearchModalOpen] = useState(false)
  const [saveSearchSnackbar, setSaveSearchSnackbar] = useState(null)
  const [savedSearchName, setSavedSearchName] = useState(null)
  const [searchNameAnchor, setSearchNameAnchor] = useState(null)
  const [searchNameView, setSearchNameView] = useState('main')
  const [searchMode, setSearchMode] = useState(initialSearchMode || 'boolean')
  useEffect(() => { onSearchModeChange?.(searchMode) }, [searchMode]) // eslint-disable-line
  const [editorHeight, setEditorHeight] = useState(58)
  const dragStartY = useRef(null)
  const dragStartHeight = useRef(null)
  const onDragStart = useCallback((e) => {
    dragStartY.current = e.clientY
    dragStartHeight.current = editorHeight
    const onMove = (ev) => {
      const delta = ev.clientY - dragStartY.current
      setEditorHeight(Math.max(58, Math.min(300, dragStartHeight.current + delta)))
    }
    const onUp = () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [editorHeight])
  const [keywordAll, setKeywordAll] = useState('')
  const [keywordAny, setKeywordAny] = useState('')
  const [keywordNone, setKeywordNone] = useState('')
  const [keywordAllChips, setKeywordAllChips] = useState([])
  const [keywordAnyChips, setKeywordAnyChips] = useState([])
  const [keywordNoneChips, setKeywordNoneChips] = useState([])
  useEffect(() => {
    if (searchMode === 'combined' && keywordAllChips.length === 0 && keywordAnyChips.length === 0 && keywordNoneChips.length === 0) {
      setBooleanQuery('')
    }
  }, [searchMode, keywordAllChips, keywordAnyChips, keywordNoneChips]) // eslint-disable-line
  const [focusedKeywordBox, setFocusedKeywordBox] = useState(null)
  const [assetsAnchor, setAssetsAnchor] = useState(null)
  const [assetsBoxIdx, setAssetsBoxIdx] = useState(null)
  const [assetsModalType, setAssetsModalType] = useState(null)
  const [assetsModalSearch, setAssetsModalSearch] = useState('')
  const [assetsModalSelected, setAssetsModalSelected] = useState([])
  const [assetsModalError, setAssetsModalError] = useState(false)
  const [chipMenuAnchor, setChipMenuAnchor] = useState(null)
  const [chipMenuBoxIdx, setChipMenuBoxIdx] = useState(null)
  const [chipMenuChipIdx, setChipMenuChipIdx] = useState(null)
  const [mediaListAnchor, setMediaListAnchor] = useState(null)
  const [mediaListSearch, setMediaListSearch] = useState('')
  const [selectedMediaLists, setSelectedMediaLists] = useState([])

  const MOCK_MEDIA_LISTS = [
    { name: 'Business reporters', contacts: 355 },
    { name: 'Entertainment reporters', contacts: 101 },
    { name: 'Local news contacts', contacts: 200 },
    { name: 'Political reporters', contacts: 64 },
    { name: 'Science journalists', contacts: 99 },
    { name: 'Media list 07', contacts: 42 },
  ]

  const filteredMediaLists = useMemo(() => {
    if (!mediaListSearch) return MOCK_MEDIA_LISTS
    const q = mediaListSearch.toLowerCase()
    return MOCK_MEDIA_LISTS.filter(m => m.name.toLowerCase().includes(q))
  }, [mediaListSearch])

  const toggleMediaList = (name) => {
    setSelectedMediaLists(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    )
  }

  const MOCK_COMPANIES = [
    { name: 'Anthropic', domain: 'anthropic.com', country: 'USA', logo: 'A', bgColor: '#F3E5F5' },
    { name: 'Apple Inc.', domain: 'apple.com', country: 'USA', logo: '🍎', bgColor: '#F5F5F5' },
    { name: 'Amazon', domain: 'amazon.com', country: 'USA', logo: 'A', bgColor: '#FFF3E0' },
    { name: 'Adobe Inc.', domain: 'adobe.com', country: 'USA', logo: 'A', bgColor: '#FFEBEE' },
    { name: 'Coca-Cola Company', domain: 'coca-cola.com', country: 'USA', logo: 'C', bgColor: '#FFEBEE' },
    { name: 'Google', domain: 'google.com', country: 'USA', logo: 'G', bgColor: '#E3F2FD' },
    { name: 'Goldman Sachs', domain: 'goldmansachs.com', country: 'USA', logo: 'G', bgColor: '#E8EAF6' },
    { name: 'Meta Platforms', domain: 'meta.com', country: 'USA', logo: 'M', bgColor: '#E3F2FD' },
    { name: 'Meltwater', domain: 'meltwater.com', country: 'Norway', logo: 'M', bgColor: '#E0F2F1' },
    { name: 'Microsoft', domain: 'microsoft.com', country: 'USA', logo: 'M', bgColor: '#E3F2FD' },
    { name: 'Netflix', domain: 'netflix.com', country: 'USA', logo: 'N', bgColor: '#FFEBEE' },
    { name: 'Nike Inc.', domain: 'nike.com', country: 'USA', logo: 'N', bgColor: '#F5F5F5' },
    { name: 'NVIDIA', domain: 'nvidia.com', country: 'USA', logo: 'N', bgColor: '#E8F5E9' },
    { name: 'OpenAI', domain: 'openai.com', country: 'USA', logo: 'O', bgColor: '#F5F5F5' },
    { name: 'Oracle', domain: 'oracle.com', country: 'USA', logo: 'O', bgColor: '#FFEBEE' },
    { name: 'PepsiCo', domain: 'pepsico.com', country: 'USA', logo: 'P', bgColor: '#E3F2FD' },
    { name: 'Red Bull', domain: 'redbull.com', country: 'Austria', logo: 'R', bgColor: '#FFF3E0' },
    { name: 'Salesforce', domain: 'salesforce.com', country: 'USA', logo: 'S', bgColor: '#E3F2FD' },
    { name: 'Samsung', domain: 'samsung.com', country: 'South Korea', logo: 'S', bgColor: '#E8EAF6' },
    { name: 'Saint Frank Coffee', domain: 'saintfrankcoffee.com', country: 'USA', logo: 'S', bgColor: '#F5E6D3' },
    { name: 'Spotify', domain: 'spotify.com', country: 'Sweden', logo: 'S', bgColor: '#E8F5E9' },
    { name: 'Tesla', domain: 'tesla.com', country: 'USA', logo: 'T', bgColor: '#FFEBEE' },
    { name: 'TikTok', domain: 'tiktok.com', country: 'China', logo: 'T', bgColor: '#F5F5F5' },
    { name: 'Uber', domain: 'uber.com', country: 'USA', logo: 'U', bgColor: '#F5F5F5' },
    { name: 'Walt Disney Company', domain: 'disney.com', country: 'USA', logo: 'D', bgColor: '#E3F2FD' },
  ]

  const getKeywordValue = (idx) => [keywordAll, keywordAny, keywordNone][idx]

  const filteredCompanies = useMemo(() => {
    if (focusedKeywordBox === null) return []
    const val = getKeywordValue(focusedKeywordBox).trim()
    if (!val || val.length < 2) return []
    const q = val.toLowerCase()
    return MOCK_COMPANIES.filter(c => c.name.toLowerCase().includes(q)).slice(0, 3)
  }, [focusedKeywordBox, keywordAll, keywordAny, keywordNone])

  const currentTypedText = focusedKeywordBox !== null ? getKeywordValue(focusedKeywordBox).trim() : ''

  const keywordSetters = [setKeywordAll, setKeywordAny, setKeywordNone]
  const chipSetters = [setKeywordAllChips, setKeywordAnyChips, setKeywordNoneChips]

  const handleKeywordKeyDown = (e, idx) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const val = getKeywordValue(idx).trim()
      if (val) {
        chipSetters[idx](prev => [...prev, { type: 'keyword', name: val }])
        keywordSetters[idx]('')
      }
    }
  }

  const MOCK_ASSETS = {
    'Saved Searches': [
      'Battery Innovation', 'EV Market Landscape', 'Brand Monitoring – Coca-Cola',
      'Competitor Watch – PepsiCo', 'Social Listening – AI', 'Tech Earnings Q4',
      'Sustainability Coverage', 'IPO Tracker 2026', 'Healthcare Policy',
    ],
    'Custom Categories': [
      'Product Launch', 'Crisis Management', 'Executive Mentions',
      'Earnings & Financials', 'ESG & Sustainability', 'M&A Activity',
      'Regulatory News', 'Consumer Sentiment', 'Thought Leadership',
    ],
    'Author Lists': [
      'Top Tech Journalists', 'Business Editors – US', 'Political Correspondents',
      'Science & Health Writers', 'EU Policy Reporters', 'Automotive Press',
      'Entertainment Beat', 'Finance Columnists', 'Startup & VC Writers',
    ],
    'Custom categories': [
      'Top Tier US Print', 'Broadcast National', 'Tech Trade Publications',
      'EMEA Tier 1', 'Financial Analysts', 'Healthcare Beat Reporters',
      'Sustainability & ESG', 'Podcast Hosts – Business', 'AP & Wire Services',
    ],
    'Filter Sets': [
      'English – US & UK Sources', 'EMEA Broadcast', 'Social Only – X & Reddit',
      'Top-Tier Print', 'Industry Blogs', 'Spanish Language Sources',
      'APAC News Outlets', 'Podcasts & Audio', 'Government Sources',
    ],
  }

  const filteredAssets = useMemo(() => {
    if (!assetsModalType) return []
    const items = MOCK_ASSETS[assetsModalType] || []
    if (!assetsModalSearch) return items
    const q = assetsModalSearch.toLowerCase()
    return items.filter(i => i.toLowerCase().includes(q))
  }, [assetsModalType, assetsModalSearch])

  const toggleAssetItem = (item) => {
    setAssetsModalSelected(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    )
    setAssetsModalError(false)
  }

  const handleAssetsModalClose = () => {
    setAssetsModalType(null)
    setAssetsModalSearch('')
    setAssetsModalSelected([])
    setAssetsModalError(false)
  }

  const handleAssetsModalApply = () => {
    if (assetsModalSelected.length === 0) {
      setAssetsModalError(true)
      return
    }
    if (searchMode === 'combined' && assetsBoxIdx !== null) {
      const setters = [setKeywordAllChips, setKeywordAnyChips, setKeywordNoneChips]
      const setter = setters[assetsBoxIdx]
      if (setter) {
        setter(prev => [
          ...prev,
          ...assetsModalSelected
            .filter(name => !prev.some(c => c.name === name))
            .map(name => ({ name, type: assetsModalType }))
        ])
      }
    }
    handleAssetsModalClose()
    if (searchMode === 'combined') {
      const allChips = [...keywordAllChips, ...keywordAnyChips, ...keywordNoneChips,
        ...assetsModalSelected.map(name => ({ name }))]
      const query = allChips.map(c => c.name).join(' OR ')
      onSearch(query || 'combined search')
    }
  }

  return (
    <Box sx={{ bgcolor: 'background.paper', flexShrink: 0 }}>
      {/* Toolbar */}
      <Box sx={{ height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton size="small" sx={{ width: 36, height: 36, borderRadius: '50%' }}><ArrowBackIcon sx={{ fontSize: 20 }} /></IconButton>
          <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 36, alignSelf: 'center' }} />
          <Box sx={{ borderRight: '1px solid #e0e0e0' }}>
            <Tooltip title="View & create searches" arrow>
              <Button size="small" onClick={(e) => setSearchNameAnchor(e.currentTarget)} endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 16 }} />}
                sx={{ fontSize: 14, fontStyle: savedSearchName ? 'normal' : 'italic', color: 'rgba(0,0,0,0.87)', height: 36, px: 1, fontWeight: savedSearchName ? 700 : 400, borderRadius: 0 }}>
                {savedSearchName || 'Untitled Search'}
              </Button>
            </Tooltip>
          </Box>
          <Button size="small" startIcon={<CalendarTodayIcon sx={{ fontSize: 14 }} />} endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 14 }} />}
            sx={{ fontSize: 14, fontWeight: 700, color: 'rgba(0,0,0,0.87)', height: 36, px: 1, borderRadius: 0 }}>
            Last 7 days
          </Button>
          <Button size="small" endIcon={<ArrowDropDownIcon sx={{ fontSize: 16 }} />} sx={{ color: 'text.secondary', fontWeight: 700, fontSize: 14, textTransform: 'none', minWidth: 0, px: 1, borderRadius: 0.5, '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } }}>Aa</Button>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ display: 'flex' }}>
            {[
              { src: '/smart_alerts.png', tooltip: 'Create Alert' },
              { src: '/digest_email.png', tooltip: 'Create Email Digest' },
              { src: '/Dashboard.png', tooltip: 'Create Dashboards & Reports' },
            ].map((item, i) => (
              <Tooltip key={i} title={item.tooltip} arrow>
                <IconButton size="small"
                  onClick={i === 2 ? (e) => setDashboardAnchor(e.currentTarget) : undefined}
                  sx={{ width: 36, height: 36, borderRadius: '50%', '&:hover': { bgcolor: 'rgba(0,0,0,0.08)' } }}>
                  <Box component="img" src={item.src} alt="" sx={{ width: 20, height: 20, objectFit: 'contain', filter: 'brightness(0) saturate(100%) invert(13%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(13%) contrast(100%)' }} />
                </IconButton>
              </Tooltip>
            ))}
            <Tooltip title="Export and Share" arrow>
              <IconButton size="small" onClick={(e) => setDownloadAnchor(e.currentTarget)} sx={{ width: 36, height: 36, borderRadius: '50%', '&:hover': { bgcolor: 'rgba(0,0,0,0.08)' } }}>
                <FileDownloadOutlinedIcon sx={{ fontSize: 20, color: '#212121' }} />
              </IconButton>
            </Tooltip>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Tooltip title={!booleanQuery ? 'Add search terms to save' : ''} arrow>
              <span>
                <Button variant="contained" size="small" endIcon={<ArrowDropDownIcon sx={{ fontSize: 16 }} />}
                  onClick={booleanQuery ? (e) => setSaveAnchor(e.currentTarget) : undefined}
                  disabled={!booleanQuery}
                  sx={{ bgcolor: booleanQuery ? '#B627A1' : undefined, color: 'white', fontWeight: 700, height: 36, borderRadius: 0.5, '&:hover': { bgcolor: booleanQuery ? '#9C1F8A' : undefined }, '&.Mui-disabled': { bgcolor: '#bdbdbd', color: 'white' } }}>
                  Save
                </Button>
              </span>
            </Tooltip>
            <IconButton size="small" onClick={() => setEditorExpanded(e => !e)} sx={{ width: 36, height: 36, borderRadius: '50%', '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } }}>
              <KeyboardArrowDownIcon sx={{ fontSize: 20, color: '#595959', transform: editorExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Editor */}
      <Collapse in={editorExpanded}>
        <Box sx={{ px: 2, pb: 1, pt: searchMode === 'keyword' || searchMode === 'combined' ? 1 : 0 }}>
          {searchMode === 'combined' ? (
            /* Combined search mode — same boxes, larger left-aligned Add button, no placeholder */
            <Box sx={{ display: 'flex', alignItems: 'stretch', mb: 1, gap: 1.5 }}>
              {[
                { label: 'All of These', chips: keywordAllChips, setChips: setKeywordAllChips, value: keywordAll, onChange: setKeywordAll, tip: 'Items in this box are tied together with an AND operator.' },
                { label: 'At Least One', chips: keywordAnyChips, setChips: setKeywordAnyChips, value: keywordAny, onChange: setKeywordAny, tip: 'Items in this box are tied together with an OR operator.' },
                { label: 'None of These', chips: keywordNoneChips, setChips: setKeywordNoneChips, value: keywordNone, onChange: setKeywordNone, tip: 'Items in this box are tied together with an OR operator.' },
              ].map((field, idx) => (
                <Box key={field.label} sx={{ flex: 1, minWidth: 0, position: 'relative', display: 'flex', flexDirection: 'column', mt: 1 }}>
                  {/* Sticky floating label — outside scroll area */}
                  <Box sx={{ position: 'absolute', top: -10, left: 10, bgcolor: 'white', px: 0.5, zIndex: 1, display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography component="span" sx={{ fontSize: 13, fontWeight: 700, color: focusedKeywordBox === idx ? '#00827F' : 'text.primary' }}>
                      {field.label}
                    </Typography>
                    <Tooltip title={field.tip} arrow placement="top">
                      <InfoOutlinedIcon sx={{ fontSize: 18, color: 'text.secondary', cursor: 'default' }} />
                    </Tooltip>
                  </Box>
                  <Box sx={{
                    border: '1px solid', borderColor: focusedKeywordBox === idx ? '#00827F' : 'rgba(0,0,0,0.23)',
                    borderRadius: 1, p: 1.5, flex: 1, maxHeight: 175, overflowY: 'auto',
                    display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0.75,
                    '&:hover': { borderColor: focusedKeywordBox === idx ? '#00827F' : 'rgba(0,0,0,0.87)' },
                  }}>
                    {/* Chips + Add button inline */}
                    {(() => {
                      const assetIconMap = {
                        'Saved Searches': <ManageSearchIcon sx={{ fontSize: '14px !important', color: '#616161' }} />,
                        'Custom Categories': <CategoryOutlinedIcon sx={{ fontSize: '14px !important', color: '#616161' }} />,
                        'Author Lists': <PeopleOutlineIcon sx={{ fontSize: '14px !important', color: '#616161' }} />,
                        'Custom categories': <FormatListBulletedIcon sx={{ fontSize: '14px !important', color: '#616161' }} />,
                        'Filter Sets': <FilterListIcon sx={{ fontSize: '14px !important', color: '#616161' }} />,
                      }
                      return (
                    <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 0.75, alignItems: 'center' }}>
                      {field.chips.map((chip, ci) => (
                        <Tooltip key={ci} title={chip.type || ''} placement="top" arrow>
                          <Chip
                            label={chip.name}
                            icon={assetIconMap[chip.type] || undefined}
                            onClick={(e) => { setChipMenuAnchor(e.currentTarget); setChipMenuBoxIdx(idx); setChipMenuChipIdx(ci) }}
                            onDelete={(e) => { setChipMenuAnchor(e.currentTarget); setChipMenuBoxIdx(idx); setChipMenuChipIdx(ci) }}
                            deleteIcon={<ArrowDropDownIcon sx={{ fontSize: '18px !important', color: '#616161' }} />}
                            size="small"
                            variant="outlined"
                            sx={{ height: 24, borderRadius: '100px', borderColor: '#bdbdbd', bgcolor: '#f0f0f0', cursor: 'pointer', '& .MuiChip-label': { fontSize: 12, fontWeight: 700, px: 1.25 }, '& .MuiChip-deleteIcon': { mr: 0.75 }, '& .MuiChip-icon': { ml: 1 } }}
                          />
                        </Tooltip>
                      ))}
                      <Button size="medium" onClick={(e) => { setAssetsAnchor(e.currentTarget); setAssetsBoxIdx(idx) }}
                        sx={{ color: '#00827F', fontSize: 14, fontWeight: 700, textTransform: 'none', minWidth: 0, px: 1, py: 0.5, borderRadius: 0.5, '&:hover': { bgcolor: 'rgba(0,130,127,0.08)' } }}>
                        + Add
                      </Button>
                    </Box>
                      )
                    })()}
                  </Box>
                </Box>
              ))}
            </Box>
          ) : searchMode === 'keyword' ? (
            /* Keyword search mode — three input boxes */
            <Box sx={{ display: 'flex', alignItems: 'stretch', mb: 1, gap: 1.5 }}>
              {[
                { label: 'All of These', chips: keywordAllChips, setChips: setKeywordAllChips, value: keywordAll, onChange: setKeywordAll, tip: 'Items in this box are tied together with an AND operator.' },
                { label: 'At Least One', chips: keywordAnyChips, setChips: setKeywordAnyChips, value: keywordAny, onChange: setKeywordAny, tip: 'Items in this box are tied together with an OR operator.' },
                { label: 'None of These', chips: keywordNoneChips, setChips: setKeywordNoneChips, value: keywordNone, onChange: setKeywordNone, tip: 'Items in this box are tied together with an OR operator.' },
              ].map((field, idx) => (
                <Box key={field.label} sx={{ flex: 1, minWidth: 0, position: 'relative' }}>
                  {/* Custom chip input container */}
                  <Box sx={{
                    border: '1px solid', borderColor: focusedKeywordBox === idx ? '#00827F' : 'rgba(0,0,0,0.23)',
                    borderRadius: 1, p: 1.5, minHeight: 90, position: 'relative',
                    display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', alignContent: 'flex-start', gap: 0.75,
                    '&:hover': { borderColor: focusedKeywordBox === idx ? '#00827F' : 'rgba(0,0,0,0.87)' },
                  }}>
                    {/* Floating label on border */}
                    <Box sx={{
                      position: 'absolute', top: -10, left: 10, bgcolor: 'white', px: 0.5,
                      display: 'inline-flex', alignItems: 'center', gap: 0.5,
                    }}>
                      <Typography component="span" sx={{ fontSize: 13, fontWeight: 700, color: focusedKeywordBox === idx ? '#00827F' : 'text.primary' }}>
                        {field.label}
                      </Typography>
                      <Tooltip title={field.tip} arrow placement="top">
                        <InfoOutlinedIcon sx={{ fontSize: 18, color: 'text.secondary', cursor: 'default' }} />
                      </Tooltip>
                    </Box>

                    {/* Chips */}
                    {field.chips.map((chip, ci) => (
                      <Chip
                        key={ci}
                        label={chip.name}
                        icon={chip.type === 'company' ? <DomainIcon sx={{ fontSize: '16px !important', color: '#616161' }} /> : undefined}
                        onDelete={() => field.setChips(prev => prev.filter((_, i) => i !== ci))}
                        deleteIcon={<CancelIcon sx={{ fontSize: '16px !important', color: '#9e9e9e' }} />}
                        size="small"
                        variant="outlined"
                        sx={{ height: 28, borderRadius: 14, borderColor: '#bdbdbd', bgcolor: '#f5f5f5', '& .MuiChip-label': { fontSize: 13, fontWeight: 500 } }}
                      />
                    ))}

                    {/* Inline input */}
                    <Box
                      component="input"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      onFocus={() => setFocusedKeywordBox(idx)}
                      onBlur={() => setTimeout(() => setFocusedKeywordBox(null), 200)}
                      onKeyDown={(e) => handleKeywordKeyDown(e, idx)}
                      placeholder={field.chips.length === 0 ? 'Add keywords and companies' : ''}
                      sx={{
                        border: 'none', outline: 'none', flex: 1, minWidth: 120, fontSize: 14,
                        color: '#212121', bgcolor: 'transparent', p: 0, fontFamily: 'inherit',
                        lineHeight: '28px',
                        '&::placeholder': { color: '#9e9e9e' },
                      }}
                    />
                  </Box>

                  {/* Typeahead dropdown */}
                  {focusedKeywordBox === idx && (idx > 0 || currentTypedText.length >= 2) && (
                    <Box sx={{
                      position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 20,
                      bgcolor: 'white', border: '1px solid #e0e0e0', borderRadius: 1,
                      boxShadow: '0px 4px 8px rgba(0,0,0,0.15)', mt: 0.5, overflow: 'hidden',
                    }}>
                      {/* AI Workflows section — shown for At Least One and None of These */}
                      {idx > 0 && (
                        <>
                          <Box sx={{ px: 2, pt: 1.5, pb: 0.5 }}>
                            <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', letterSpacing: '0.08em', textTransform: 'uppercase' }}>AI Workflows</Typography>
                          </Box>
                          {[
                            { icon: <PlaylistAddIcon sx={{ fontSize: 20, color: '#616161' }} />, label: 'Add Related Keywords' },
                            { icon: <TranslateIcon sx={{ fontSize: 20, color: '#616161' }} />, label: 'Add Translated Keywords' },
                            { icon: <AccountTreeIcon sx={{ fontSize: 20, color: '#616161' }} />, label: 'Add Spelling & Name Variations' },
                            { icon: <AutoFixHighIcon sx={{ fontSize: 20, color: '#616161' }} />, label: 'Open AI Search Assistant', endIcon: <OpenInNewIcon sx={{ fontSize: 16, color: '#9e9e9e' }} /> },
                          ].map((item) => (
                            <Box
                              key={item.label}
                              onMouseDown={(e) => e.preventDefault()}
                              sx={{ px: 2, py: 1, display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer', '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } }}
                            >
                              {item.icon}
                              <Typography sx={{ fontSize: 14, fontWeight: 500, color: '#212121', flex: 1 }}>{item.label}</Typography>
                              {item.endIcon && item.endIcon}
                            </Box>
                          ))}
                          {currentTypedText.length >= 2 && <Divider sx={{ my: 0.5 }} />}
                        </>
                      )}

                      {/* Keyword + Companies — shown when typing */}
                      {currentTypedText.length >= 2 && (
                        <>
                          {/* Keyword section */}
                          <Box sx={{ px: 2, pt: 1.5, pb: 0.5 }}>
                            <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Keyword</Typography>
                          </Box>
                          <Box
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => { field.setChips(prev => [...prev, { type: 'keyword', name: currentTypedText }]); field.onChange(''); setFocusedKeywordBox(null) }}
                            sx={{ px: 2, py: 1, display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer', '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } }}
                          >
                            <SearchIcon sx={{ fontSize: 20, color: '#616161' }} />
                            <Typography sx={{ fontSize: 15, fontWeight: 600, color: '#212121' }}>{currentTypedText}</Typography>
                          </Box>

                          {/* Companies section */}
                          {filteredCompanies.length > 0 && (
                            <>
                              <Box sx={{ px: 2, pt: 1.5, pb: 0.5 }}>
                                <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Companies</Typography>
                              </Box>
                              {filteredCompanies.map((company) => (
                                <Box
                                  key={company.name}
                                  onMouseDown={(e) => e.preventDefault()}
                                  onClick={() => { field.setChips(prev => [...prev, { type: 'company', name: company.name }]); field.onChange(''); setFocusedKeywordBox(null) }}
                                  sx={{ px: 2, py: 1, display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer', '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } }}
                                >
                                  <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: company.bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <Typography sx={{ fontSize: 16 }}>{company.logo}</Typography>
                                  </Box>
                                  <Box>
                                    <Typography sx={{ fontSize: 15, fontWeight: 500, color: '#212121' }}>{company.name}</Typography>
                                    <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
                                      {company.domain}{company.country ? ` · ${company.country}` : ''}
                                    </Typography>
                                  </Box>
                                </Box>
                              ))}
                            </>
                          )}

                          {/* Footer */}
                          <Divider />
                          <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>Can't find what you are looking for?</Typography>
                            <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#00827F', cursor: 'pointer' }}>Provide feedback</Typography>
                          </Box>
                        </>
                      )}
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
          ) : (
            /* Boolean editor mode */
            <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, overflow: 'hidden' }}>
              <Box sx={{ height: editorHeight, display: 'flex', alignItems: 'flex-start', px: 1.5, pt: 1.25, bgcolor: 'white', borderBottom: '1px solid #e0e0e0' }}>
                <Box
                  component="textarea"
                  value={booleanQuery}
                  onChange={e => setBooleanQuery(e.target.value)}
                  placeholder="Enter Boolean Operators"
                  rows={2}
                  sx={{
                    flex: 1, border: 'none', outline: 'none', resize: 'none',
                    fontSize: 13, lineHeight: '20px', fontFamily: 'monospace',
                    color: booleanQuery ? '#1565C0' : 'rgba(33,33,33,0.38)',
                    bgcolor: 'transparent',
                    '&::placeholder': { color: 'rgba(33,33,33,0.38)', fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontSize: 14 },
                  }}
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 1, py: 0.5, bgcolor: 'white', borderBottom: '1px solid rgba(33,33,33,0.12)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <SearchWithAIButton onClick={e => setDropdownAnchor(e.currentTarget)} open={Boolean(dropdownAnchor)} hasQuery={Boolean(booleanQuery)} />
                  <Button size="small" sx={{ color: '#1D9F9F', fontWeight: 700, fontSize: 13, textTransform: 'none', px: 0.5 }}>
                    Supported Operators
                  </Button>
                </Box>
                <Typography sx={{ fontSize: 14, color: 'rgba(0,0,0,0.87)' }}>Ctrl + Enter to update results</Typography>
              </Box>
            </Box>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 0.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button size="small" startIcon={<FilterListIcon sx={{ fontSize: 18 }} />} sx={{ color: '#1D9F9F', fontWeight: 700, fontSize: 14, pl: 1 }}>All Filters</Button>
              {['Saved Filter Set', 'Source Type', 'Language', 'Location'].map(f => (
                <Chip key={f}
                  icon={f === 'Saved Filter Set' ? <SaveIcon sx={{ fontSize: '14px !important' }} /> : undefined}
                  label={f} size="small" variant="outlined"
                  deleteIcon={<KeyboardArrowDownIcon sx={{ fontSize: '14px !important' }} />}
                  onDelete={() => {}}
                  sx={{ bgcolor: '#f0f0f0', borderColor: '#bdbdbd', fontWeight: 700, fontSize: 12, height: 24 }}
                />
              ))}
              <Chip
                label={selectedMediaLists.length > 0 ? `Custom categories: ${selectedMediaLists[0]}${selectedMediaLists.length > 1 ? ` +${selectedMediaLists.length - 1}` : ''}` : 'Custom categories'}
                size="small" variant="outlined"
                deleteIcon={<KeyboardArrowDownIcon sx={{ fontSize: '14px !important' }} />}
                onDelete={() => {}}
                onClick={(e) => setMediaListAnchor(e.currentTarget)}
                sx={{ bgcolor: selectedMediaLists.length > 0 ? 'rgba(0,130,127,0.08)' : '#f0f0f0', borderColor: selectedMediaLists.length > 0 ? '#00827F' : '#bdbdbd', fontWeight: 700, fontSize: 12, height: 24, color: selectedMediaLists.length > 0 ? '#00827F' : undefined }}
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {savingView && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={16} thickness={3} sx={{ color: '#1D9F9F' }} />
                  <Typography sx={{ fontSize: 13, color: '#212121', fontWeight: 700, whiteSpace: 'nowrap' }}>Saving view</Typography>
                </Box>
              )}
              <Button variant="contained" size="small" onClick={onSearch}
                sx={{ borderRadius: 0.5, fontWeight: 700, boxShadow: 'none', bgcolor: '#1D9F9F', color: 'white', '&:hover': { bgcolor: '#006B68' } }}>
                Search
              </Button>
            </Box>
          </Box>
        </Box>
      </Collapse>

      {/* Resize handle */}
      <Box
        onMouseDown={onDragStart}
        sx={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          height: 18, bgcolor: 'white', borderTop: '1px solid #e0e0e0',
          cursor: 'ns-resize', userSelect: 'none',
          '&:hover': { bgcolor: '#eeeeee' },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <Box sx={{ width: 28, height: 1.5, borderRadius: 2, bgcolor: '#bdbdbd' }} />
          <Box sx={{ width: 28, height: 1.5, borderRadius: 2, bgcolor: '#bdbdbd' }} />
        </Box>
      </Box>

      {/* Tabs */}
      <Box sx={{ bgcolor: 'background.default', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 52 }}>

        {/* Scrollable tabs area */}
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'stretch', overflow: 'hidden', position: 'relative', height: '100%' }}>
          {canScrollLeft && (
            <Box onClick={() => { tabsScrollRef.current.scrollBy({ left: -180, behavior: 'smooth' }); setTimeout(checkTabsOverflow, 300) }}
              sx={{ display: 'flex', alignItems: 'center', px: 0.5, cursor: 'pointer', bgcolor: 'background.default', borderRight: '1px solid #e0e0e0', zIndex: 1, flexShrink: 0, '&:hover': { bgcolor: alpha('#000', 0.04) } }}>
              <ChevronLeftIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
            </Box>
          )}
          <Box ref={tabsScrollRef} onScroll={checkTabsOverflow} sx={{ display: 'flex', height: '100%', alignItems: 'stretch', overflowX: 'auto', scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
          {tabs.map((tab, i) => {
            const label = typeof tab === 'string' ? tab : tab.label
            const baseDescription = TABS.find(t => t.label === label)?.description
            const tabDescription = typeof tab === 'string' ? undefined : tab.description
            const description = tabDescription !== undefined ? tabDescription : baseDescription
            const isActive = activeTab === i
            const isDragOver = dragOverIndex === i
            return (
              <Box key={label} sx={{ display: 'flex', alignItems: 'stretch' }}
                draggable
                onDragStart={() => { dragIndexRef.current = i }}
                onDragOver={(e) => { e.preventDefault(); setDragOverIndex(i) }}
                onDragLeave={() => setDragOverIndex(null)}
                onDrop={() => {
                  const from = dragIndexRef.current
                  if (from === null || from === i) { setDragOverIndex(null); return }
                  setTabs(prev => {
                    const next = [...prev]
                    const [moved] = next.splice(from, 1)
                    next.splice(i, 0, moved)
                    return next
                  })
                  if (activeTab === from) setActiveTab(i)
                  else if (activeTab > from && activeTab <= i) setActiveTab(activeTab - 1)
                  else if (activeTab < from && activeTab >= i) setActiveTab(activeTab + 1)
                  dragIndexRef.current = null
                  setDragOverIndex(null)
                  triggerSave()
                }}
                onDragEnd={() => { dragIndexRef.current = null; setDragOverIndex(null) }}
              >
                <Box
                  onClick={(e) => { if (isActive) { setTabMenuAnchor(e.currentTarget); setTabMenuTabIndex(i) } else { setActiveTab(i) } }}
                  sx={{
                    display: 'flex', alignItems: 'center', gap: 0.5, px: 1.5, cursor: 'grab', position: 'relative',
                    borderBottom: isActive ? '2px solid #1D9F9F' : '2px solid transparent',
                    borderLeft: isDragOver ? '2px solid #1D9F9F' : '2px solid transparent',
                    bgcolor: isActive ? alpha('#1D9F9F', 0.12) : isDragOver ? alpha('#1D9F9F', 0.06) : 'transparent',
                    '&:hover': { bgcolor: isActive ? alpha('#1D9F9F', 0.12) : alpha('#000', 0.03) },
                    transition: 'border-left 0.1s, bgcolor 0.1s',
                  }}
                >
                  <Box>
                    <Typography sx={{ fontSize: 13, fontWeight: 700, color: 'text.primary', lineHeight: 1.3, whiteSpace: 'nowrap' }}>{label}</Typography>
                    {description && <Typography sx={{ fontSize: 11, color: 'text.secondary', lineHeight: 1.3, whiteSpace: 'nowrap' }}>{description}</Typography>}
                  </Box>
                  <ArrowDropDownIcon sx={{ fontSize: 16, color: 'text.secondary', flexShrink: 0 }} />
                </Box>
                {i < tabs.length - 1 && <Divider orientation="vertical" flexItem sx={{ my: 1 }} />}
              </Box>
            )
          })}
          <Divider orientation="vertical" flexItem sx={{ my: 1 }} />
          <Box
            onClick={(e) => setPinTabAnchor(e.currentTarget)}
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', px: 1.5, cursor: 'pointer', color: 'text.secondary', fontSize: 20, bgcolor: pinTabAnchor ? alpha('#000', 0.06) : 'transparent', '&:hover': { bgcolor: alpha('#000', 0.05) } }}
          >+</Box>
          <Menu
            anchorEl={pinTabAnchor}
            open={Boolean(pinTabAnchor)}
            onClose={() => setPinTabAnchor(null)}
            PaperProps={{ elevation: 4, sx: { width: 240, borderRadius: 1, mt: 0.5 } }}
            transformOrigin={{ horizontal: 'left', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          >
            <Box sx={{ px: 2, pt: 1.5, pb: 0.5 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 700, color: 'text.primary' }}>Pin a New Tab</Typography>
            </Box>
            {(() => {
              const available = ['Visual Analysis', 'Social Media Insights']
                .filter(item => !tabs.some(t => (typeof t === 'string' ? t : t.label) === item))
              if (available.length === 0) return (
                <Box sx={{ px: 2, py: 2, textAlign: 'center' }}>
                  <Typography sx={{ fontSize: 13, color: 'text.disabled', lineHeight: 1.5 }}>
                    All available tabs are already in your set.
                  </Typography>
                </Box>
              )
              return available.map(item => (
                <MenuItem key={item} onClick={() => {
                  const ON_DEMAND_DESC = { 'Visual Analysis': "What's the Visual Story?", 'Social Media Insights': "What's Trending?" }
                  setTabs(prev => [...prev, { label: item, description: ON_DEMAND_DESC[item] || '' }])
                  setPinTabAnchor(null)
                  triggerSave()
                }} sx={{ px: 2, py: 1.25, fontSize: 15, color: 'text.primary' }}>
                  {item}
                </MenuItem>
              ))
            })()}
            <Divider sx={{ my: 0.5 }} />
            {[
              { label: 'Create tab with AI',  Icon: AutoAwesomeIcon },
              { label: 'Create custom tab',   Icon: TuneIcon        },
            ].map(({ label, Icon }) => (
              <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1.25, cursor: 'default' }}>
                <Icon sx={{ fontSize: 18, color: '#616161', flexShrink: 0 }} />
                <Typography sx={{ fontSize: 15, color: '#212121' }}>{label}</Typography>
              </Box>
            ))}
            {removedTabs.length > 0 && <Divider />}
            {removedTabs.map((tab, i) => {
              const label = typeof tab === 'string' ? tab : tab.label
              return (
                <MenuItem key={label + i} onClick={() => {
                  setTabs(prev => [...prev, tab])
                  setRemovedTabs(prev => prev.filter((_, j) => j !== i))
                  setPinTabAnchor(null)
                  triggerSave()
                }} sx={{ px: 2, py: 1.25, fontSize: 15, color: 'text.primary' }}>
                  {label}
                </MenuItem>
              )
            })}
          </Menu>
          </Box>{/* end tabsScrollRef */}
          {canScrollRight && (
            <Box onClick={() => { tabsScrollRef.current.scrollBy({ left: 180, behavior: 'smooth' }); setTimeout(checkTabsOverflow, 300) }}
              sx={{ display: 'flex', alignItems: 'center', px: 0.5, cursor: 'pointer', bgcolor: 'background.default', borderLeft: '1px solid #e0e0e0', zIndex: 1, flexShrink: 0, '&:hover': { bgcolor: alpha('#000', 0.04) } }}>
              <ChevronRightIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
            </Box>
          )}
        </Box>{/* end scrollable tabs area */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, pr: 1.5, flexShrink: 0 }}>
          {/* Focus / Tab Set dropdown */}
          <Box
            onClick={(e) => setTabSetMenuAnchor(e.currentTarget)}
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: 1.25, py: 0.5, borderRadius: 0.75, cursor: 'pointer', bgcolor: tabSetMenuAnchor ? alpha('#000', 0.04) : 'transparent', '&:hover': { bgcolor: alpha('#000', 0.04) } }}
          >
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: 'text.primary', whiteSpace: 'nowrap' }}>{tabSetMode === 'classic' ? 'Classic' : 'Focus'}</Typography>
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M11 6.25V3.73C11 3.52 11.07 3.35 11.21 3.21C11.35 3.07 11.52 3 11.73 3H16.26C16.48 3 16.65 3.07 16.79 3.21C16.93 3.35 17 3.52 17 3.73V6.25C17 6.46 16.93 6.64 16.79 6.78C16.65 6.93 16.48 7 16.27 7H11.74C11.52 7 11.35 6.93 11.21 6.78C11.07 6.64 11 6.46 11 6.25ZM3 10.27V3.73C3 3.52 3.07 3.35 3.22 3.21C3.36 3.07 3.54 3 3.75 3H8.27C8.47 3 8.64 3.07 8.78 3.21C8.93 3.35 9 3.52 9 3.73V10.27C9 10.47 8.93 10.64 8.78 10.78C8.64 10.93 8.47 11 8.27 11H3.75C3.54 11 3.36 10.93 3.22 10.78C3.07 10.64 3 10.47 3 10.27ZM11 16.25V9.75C11 9.54 11.07 9.36 11.21 9.22C11.35 9.07 11.52 9 11.73 9H16.26C16.48 9 16.65 9.07 16.79 9.22C16.93 9.36 17 9.54 17 9.75V16.25C17 16.46 16.93 16.64 16.79 16.78C16.65 16.93 16.48 17 16.27 17H11.74C11.52 17 11.35 16.93 11.21 16.78C11.07 16.64 11 16.46 11 16.25ZM3 16.25V13.71C3 13.5 3.07 13.33 3.22 13.19C3.36 13.05 3.54 12.98 3.75 12.98H8.27C8.47 12.98 8.64 13.05 8.78 13.19C8.93 13.33 9 13.5 9 13.71V16.25C9 16.46 8.93 16.64 8.78 16.78C8.64 16.93 8.47 17 8.27 17H3.75C3.54 17 3.36 16.93 3.22 16.78C3.07 16.64 3 16.46 3 16.25ZM4.5 9.5H7.5V4.5H4.5V9.5ZM12.5 15.5H15.5V10.5H12.5V15.5ZM12.5 5.52H15.5V4.5H12.5V5.52ZM4.5 15.5H7.5V14.48H4.5V15.5Z" fill="#616161"/></svg>
            <ArrowDropDownIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          </Box>
          <Menu
            anchorEl={tabSetMenuAnchor}
            open={Boolean(tabSetMenuAnchor)}
            onClose={() => setTabSetMenuAnchor(null)}
            PaperProps={{ elevation: 4, sx: { width: 350, borderRadius: 1, mt: 0.5 } }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Box sx={{ px: 2.5, pt: 2, pb: 1 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 700, color: 'text.primary' }}>Tab Set</Typography>
            </Box>
            {[
              { mode: 'focus',   label: 'Focus',   desc: 'Tabs for targeted insights and specific questions' },
              { mode: 'classic', label: 'Classic', desc: 'General analytic tabs that range in use cases'      },
            ].map(opt => {
              const isActive = tabSetMode === opt.mode
              return (
              <Box key={opt.mode} onClick={() => {
                if (isActive) { setTabSetMenuAnchor(null); return }
                setTabSetMode(opt.mode)
                setActiveTab(0)
                setRemovedTabs([])
                if (opt.mode === 'classic') {
                  setTabs(CLASSIC_TABS)
                } else {
                  setTabs(TABS.map(t => ({ label: t.label, description: t.description })))
                }
                setTabSetMenuAnchor(null)
                triggerSave()
              }}
                sx={{ px: 2.5, py: 1.5, cursor: 'pointer', bgcolor: isActive ? '#E5F7F7' : 'transparent', '&:hover': { bgcolor: isActive ? '#D6F0F0' : alpha('#000', 0.03) } }}>
                <Typography sx={{ fontSize: 14, fontWeight: isActive ? 700 : 400, color: 'text.primary' }}>{opt.label}</Typography>
                <Typography sx={{ fontSize: 14, color: 'text.secondary', mt: 0.25 }}>{opt.desc}</Typography>
              </Box>
              )
            })}
          </Menu>
          <IconButton size="small">
            <Box component="img" src="/add-tab.svg" alt="Add Tab" sx={{ width: 36, height: 36 }} />
          </IconButton>
        </Box>
      </Box>

      {/* Search with AI dropdown */}
      <Menu anchorEl={dropdownAnchor} open={Boolean(dropdownAnchor)} onClose={() => setDropdownAnchor(null)}
        PaperProps={{ elevation: 4, sx: { width: 407, borderRadius: 0.5, mt: 0.5, boxShadow: '0px 4px 5px rgba(0,0,0,0.14), 0px 2px 4px rgba(0,0,0,0.12), 0px 1px 10px rgba(0,0,0,0.2)' } }}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      >
        <Box sx={{ px: 3, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {booleanQuery ? 'Workflows' : 'AI Workflows'}
          </Typography>
          <Tooltip title="AI-guided workflows help you build searches step by step"><InfoOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} /></Tooltip>
        </Box>
        {booleanQuery ? (
          <>
            {[
              { icon: <PlaylistAddIcon sx={{ fontSize: 20, color: '#212121' }} />, label: 'Add Related Keywords' },
              { icon: <AccountTreeIcon sx={{ fontSize: 20, color: '#212121' }} />, label: 'Add Alternate Keyword Variations' },
            ].map((item, i) => (
              <MenuItem key={i} onClick={() => setDropdownAnchor(null)} sx={{ py: 0.75, px: 2, height: 48 }}>
                <ListItemIcon sx={{ minWidth: 44 }}><Box sx={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.icon}</Box></ListItemIcon>
                <ListItemText><Typography sx={{ fontSize: 16, color: '#212121' }}>{item.label}</Typography></ListItemText>
                <InfoOutlinedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
              </MenuItem>
            ))}
            <MenuItem onClick={() => setDropdownAnchor(null)} sx={{ py: 0.75, px: 2, height: 48 }}>
              <ListItemIcon sx={{ minWidth: 44 }}><Box sx={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><TranslateIcon sx={{ fontSize: 20, color: '#212121' }} /></Box></ListItemIcon>
              <ListItemText><Typography sx={{ fontSize: 16, color: '#212121' }}>Add Translated Keywords</Typography></ListItemText>
              <ChevronRightIcon sx={{ fontSize: 20, color: '#9e9e9e' }} />
            </MenuItem>
          </>
        ) : (
          <>
            {[
              { type: 'brand', icon: <LoyaltyIcon sx={{ fontSize: 20, color: '#212121' }} />, label: 'Create a Brand Search' },
              { type: 'industry', icon: <DomainIcon sx={{ fontSize: 20, color: '#212121' }} />, label: 'Create an Industry Search' },
            ].map(item => (
              <MenuItem key={item.type} onClick={() => { onOpenPanel(item.type); setDropdownAnchor(null) }} sx={{ py: 0.75, px: 2, height: 48 }}>
                <ListItemIcon sx={{ minWidth: 44 }}><Box sx={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.icon}</Box></ListItemIcon>
                <ListItemText><Typography sx={{ fontSize: 16, color: '#212121' }}>{item.label}</Typography></ListItemText>
              </MenuItem>
            ))}
          </>
        )}
        <Divider />
        <MenuItem onClick={() => { onOpenPanel('general'); setDropdownAnchor(null) }} sx={{ py: 0.75, px: 2, height: 48, mb: 0.5 }}>
          <ListItemIcon sx={{ minWidth: 44 }}><Box sx={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><AutoFixHighIcon sx={{ fontSize: 20, color: '#212121' }} /></Box></ListItemIcon>
          <ListItemText><Typography sx={{ fontSize: 16, color: '#212121' }}>Open Mira Companion</Typography></ListItemText>
        </MenuItem>
      </Menu>

      {/* Search name dropdown */}
      <Menu anchorEl={searchNameAnchor} open={Boolean(searchNameAnchor)} onClose={() => { setSearchNameAnchor(null); setSearchNameView('main') }}
        PaperProps={{ elevation: 4, sx: { width: 300, borderRadius: 1, mt: 0.5, maxHeight: '75vh', boxShadow: '0px 4px 5px rgba(0,0,0,0.14), 0px 2px 4px rgba(0,0,0,0.12), 0px 1px 10px rgba(0,0,0,0.2)' } }}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      >
        {searchNameView === 'newSearch' ? (
          <>
            {/* New search sub-view */}
            <Box onClick={() => setSearchNameView('main')} sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } }}>
              <ArrowBackIcon sx={{ fontSize: 20, color: '#212121' }} />
              <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#212121' }}>New search</Typography>
            </Box>
            <Divider />
            <MenuItem onClick={() => { setSearchMode('keyword'); setSearchNameAnchor(null); setSearchNameView('main'); setEditorExpanded(true) }} sx={{ height: 36, px: 2 }}>
              <ListItemIcon sx={{ minWidth: 36 }}><SearchIcon sx={{ fontSize: 20, color: '#616161' }} /></ListItemIcon>
              <ListItemText><Typography sx={{ fontSize: 14, color: '#212121' }}>Keyword search</Typography></ListItemText>
            </MenuItem>
            <MenuItem onClick={() => { setSearchMode('boolean'); setSearchNameAnchor(null); setSearchNameView('main') }} sx={{ height: 36, px: 2 }}>
              <ListItemIcon sx={{ minWidth: 36 }}><CodeIcon sx={{ fontSize: 20, color: '#616161' }} /></ListItemIcon>
              <ListItemText><Typography sx={{ fontSize: 14, color: '#212121' }}>Advanced search</Typography></ListItemText>
            </MenuItem>
            <MenuItem onClick={() => { setSearchMode('combined'); setBooleanQuery(''); setKeywordAllChips([]); setKeywordAnyChips([]); setKeywordNoneChips([]); setSearchNameAnchor(null); setSearchNameView('main'); setEditorExpanded(true) }} sx={{ height: 36, px: 2 }}>
              <ListItemIcon sx={{ minWidth: 36 }}><CallMergeIcon sx={{ fontSize: 20, color: '#616161' }} /></ListItemIcon>
              <ListItemText><Typography sx={{ fontSize: 14, color: '#212121' }}>Combined search</Typography></ListItemText>
            </MenuItem>

          </>
        ) : (
          <>
            {/* Main view */}
            {/* Find */}
            <Box sx={{ px: 2, py: 1.25, display: 'flex', alignItems: 'center', gap: 1 }}>
              <SearchIcon sx={{ fontSize: 20, color: '#9e9e9e' }} />
              <Typography sx={{ fontSize: 14, color: '#9e9e9e' }}>Find</Typography>
            </Box>
            <Divider />

            {/* Actions */}
            <Box sx={{ px: 2, pt: 1.5, pb: 0.5 }}>
              <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Actions</Typography>
            </Box>
            <MenuItem onClick={() => setSearchNameView('newSearch')} sx={{ height: 36, px: 2 }}>
              <ListItemIcon sx={{ minWidth: 36 }}><AddCircleOutlineIcon sx={{ fontSize: 20, color: '#616161' }} /></ListItemIcon>
              <ListItemText><Typography sx={{ fontSize: 14, color: '#212121' }}>New search</Typography></ListItemText>
              <ChevronRightIcon sx={{ fontSize: 18, color: '#9e9e9e' }} />
            </MenuItem>
            <MenuItem onClick={() => setSearchNameAnchor(null)} sx={{ height: 36, px: 2 }}>
              <ListItemIcon sx={{ minWidth: 36 }}><LabelOutlinedIcon sx={{ fontSize: 20, color: '#616161' }} /></ListItemIcon>
              <ListItemText><Typography sx={{ fontSize: 14, color: '#212121' }}>Label search</Typography></ListItemText>
            </MenuItem>
            <MenuItem onClick={() => setSearchNameAnchor(null)} sx={{ height: 36, px: 2 }}>
              <ListItemIcon sx={{ minWidth: 36 }}><EditIcon sx={{ fontSize: 20, color: '#616161' }} /></ListItemIcon>
              <ListItemText><Typography sx={{ fontSize: 14, color: '#212121' }}>Edit name</Typography></ListItemText>
            </MenuItem>
            <Divider />

            {/* Searches */}
            <Box sx={{ px: 2, pt: 1.5, pb: 0.5 }}>
              <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Searches</Typography>
            </Box>
            {[
              { name: 'Battery Innovation', isLabel: true },
              { name: 'EV Market Landscape', isLabel: true },
            ].map((item) => (
              <MenuItem key={item.name} onClick={() => setSearchNameAnchor(null)} sx={{ height: 36, px: 2 }}>
                <ListItemIcon sx={{ minWidth: 24 }}><ChevronRightIcon sx={{ fontSize: 18, color: '#616161' }} /></ListItemIcon>
                <ListItemIcon sx={{ minWidth: 36 }}><LabelOutlinedIcon sx={{ fontSize: 20, color: '#616161' }} /></ListItemIcon>
                <ListItemText><Typography sx={{ fontSize: 14, color: '#212121' }}>{item.name}</Typography></ListItemText>
              </MenuItem>
            ))}
            {[
              savedSearchName || 'Search name',
              'Search name', 'Search name', 'Search name',
              'Search name', 'Search name', 'Search name', 'Search name',
            ].map((search, i) => {
              const isActive = i === 0 && savedSearchName
              return (
                <MenuItem key={`${search}-${i}`} onClick={() => setSearchNameAnchor(null)}
                  sx={{
                    height: 36, px: 2, pl: `${16 + 24 + 16}px`,
                    bgcolor: isActive ? 'rgba(0,206,209,0.12)' : 'transparent',
                    borderLeft: isActive ? '3px solid #00BCD4' : '3px solid transparent',
                  }}>
                  <Typography sx={{ fontSize: 14, fontWeight: isActive ? 700 : 400, color: '#212121' }}>{search}</Typography>
                </MenuItem>
              )
            })}
          </>
        )}
      </Menu>

      {/* Save dropdown */}
      <Menu anchorEl={saveAnchor} open={Boolean(saveAnchor)} onClose={() => setSaveAnchor(null)}
        PaperProps={{ elevation: 4, sx: { width: 220, borderRadius: 1, mt: 0.5, boxShadow: '0px 4px 5px rgba(0,0,0,0.14), 0px 2px 4px rgba(0,0,0,0.12), 0px 1px 10px rgba(0,0,0,0.2)' } }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {[
          { icon: <SaveIcon sx={{ fontSize: 22, color: '#212121' }} />, label: 'Save' },
          { icon: <SaveAsIcon sx={{ fontSize: 22, color: '#212121' }} />, label: 'Save as...' },
        ].map((item, i) => (
          <MenuItem key={i} onClick={() => { setSaveAnchor(null); setSaveSearchModalOpen(true) }} sx={{ py: 1.25, px: 2, height: 48 }}>
            <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText>
              <Typography sx={{ fontSize: 15, fontWeight: 400, color: '#212121', fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>{item.label}</Typography>
            </ListItemText>
          </MenuItem>
        ))}
      </Menu>

      {/* Dashboard & Reports dropdown */}
      <Menu anchorEl={dashboardAnchor} open={Boolean(dashboardAnchor)} onClose={() => setDashboardAnchor(null)}
        PaperProps={{ elevation: 4, sx: { width: 320, borderRadius: 1, mt: 0.5, boxShadow: '0px 4px 5px rgba(0,0,0,0.14), 0px 2px 4px rgba(0,0,0,0.12), 0px 1px 10px rgba(0,0,0,0.2)' } }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Dashboards & Reports</Typography>
        </Box>
        {[
          { icon: <Box component="img" src="/Analyze.png" alt="" sx={{ width: 36, height: 36, objectFit: 'contain', filter: 'brightness(0) saturate(100%) invert(13%)' }} />, label: 'Create Dashboard', desc: 'Build a dashboard based on this search' },
          { icon: <Box component="img" src="/compare.png" alt="" sx={{ width: 36, height: 36, objectFit: 'contain', filter: 'brightness(0) saturate(100%) invert(13%)' }} />, label: 'Compare Searches', desc: 'Compare results for up to 10 searches' },
          { icon: <Box sx={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><AutoFixHighIcon sx={{ fontSize: 20, color: '#616161' }} /></Box>, label: 'Generate Executive Report', desc: 'A presentation-ready report of this tab' },
          { icon: <Box component="img" src="/Audiense.png" alt="" sx={{ width: 36, height: 36, objectFit: 'contain', filter: 'brightness(0) saturate(100%) invert(13%)' }} />, label: 'Create Audiense Report', desc: 'Deep-dive into audience demographics' },
        ].map((item, i) => (
          <MenuItem key={i} onClick={() => { setDashboardAnchor(null); if (item.label === 'Create Dashboard') setCreateDashboardWizardOpen(true) }} sx={{ py: 1.5, px: 2 }}>
            <ListItemIcon sx={{ minWidth: 48 }}>{item.icon}</ListItemIcon>
            <ListItemText>
              <Typography sx={{ fontSize: 15, fontWeight: 500, color: '#212121', fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>{item.label}</Typography>
              <Typography sx={{ fontSize: 13, color: '#616161' }}>{item.desc}</Typography>
            </ListItemText>
          </MenuItem>
        ))}
      </Menu>

      {/* Download & Share dropdown */}
      <Menu anchorEl={downloadAnchor} open={Boolean(downloadAnchor)}
        onClose={() => { setDownloadAnchor(null); setShareableLinkView(false); setAdvancedSettingsOpen(false) }}
        PaperProps={{ elevation: 4, sx: { width: shareableLinkView ? 380 : 320, borderRadius: 1, mt: 0.5, boxShadow: '0px 4px 5px rgba(0,0,0,0.14), 0px 2px 4px rgba(0,0,0,0.12), 0px 1px 10px rgba(0,0,0,0.2)' } }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {shareableLinkView ? (
          /* Shareable Link drill-in panel */
          <>
          <Box sx={{ p: 2.5 }}>
            {/* Header with back button */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <IconButton size="small" onClick={() => { setShareableLinkView(false); setAdvancedSettingsOpen(false) }} sx={{ ml: -0.5 }}>
                <ArrowBackIcon sx={{ fontSize: 20, color: '#212121' }} />
              </IconButton>
              <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#212121' }}>Shareable Link</Typography>
            </Box>
            <Typography sx={{ fontSize: 14, color: '#616161', mb: 2 }}>Anyone with the link and password can view</Typography>

            {/* Open Link button */}
            <Button fullWidth variant="contained" startIcon={<OpenInNewIcon sx={{ fontSize: 18 }} />}
              sx={{ bgcolor: '#00827F', color: 'white', fontWeight: 700, fontSize: 15, height: 44, borderRadius: 1, mb: 2.5, textTransform: 'none', '&:hover': { bgcolor: '#006B68' } }}>
              Open Link
            </Button>

            {/* Password row */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <LockOutlinedIcon sx={{ fontSize: 22, color: '#616161', flexShrink: 0 }} />
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#212121' }}>Password</Typography>
                    <EditIcon sx={{ fontSize: 14, color: '#616161' }} />
                  </Box>
                  <Typography sx={{ fontSize: 13, color: '#616161', letterSpacing: '0.1em' }}>••••••••</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer', '&:hover': { opacity: 0.8 } }}>
                <ContentCopyIcon sx={{ fontSize: 16, color: '#00827F' }} />
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#00827F' }}>Copy Password</Typography>
              </Box>
            </Box>

            {/* Share details row */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <MailOutlineIcon sx={{ fontSize: 22, color: '#616161', flexShrink: 0 }} />
                <Box>
                  <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#212121' }}>Share details</Typography>
                  <Typography sx={{ fontSize: 13, color: '#616161' }}>Copy link and password</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer', '&:hover': { opacity: 0.8 } }}>
                <ContentCopyIcon sx={{ fontSize: 16, color: '#00827F' }} />
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#00827F' }}>Copy Invitation</Typography>
              </Box>
            </Box>

          </Box>

          {/* Advanced Settings — collapsible accordion, gray background */}
          <Box sx={{ bgcolor: '#f5f5f5', borderTop: '1px solid #e0e0e0' }}>
            <Box
              onClick={() => setAdvancedSettingsOpen(prev => !prev)}
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2.5, pt: 2, pb: advancedSettingsOpen ? 1.5 : 2, cursor: 'pointer' }}
            >
              <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#616161', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Advanced Settings</Typography>
              <KeyboardArrowDownIcon sx={{ fontSize: 18, color: '#616161', transform: advancedSettingsOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </Box>
            <Collapse in={advancedSettingsOpen}>
            <Box sx={{ display: 'flex', gap: 2, px: 2.5, pb: 2.5 }}>
              <TextField
                select label="Expire Link After" value={expireAfter}
                onChange={e => setExpireAfter(e.target.value)}
                size="small" fullWidth
                sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: '#bdbdbd' } }}
              >
                {['7 days', '14 days', '30 days', '60 days', '90 days', 'Never'].map(v => (
                  <MenuItem key={v} value={v}>{v}</MenuItem>
                ))}
              </TextField>
              <TextField
                select label="Refresh Content" value={refreshContent}
                onChange={e => setRefreshContent(e.target.value)}
                size="small" fullWidth
                sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: '#bdbdbd' } }}
              >
                {['Never', 'Daily', 'Weekly', 'Monthly'].map(v => (
                  <MenuItem key={v} value={v}>{v}</MenuItem>
                ))}
              </TextField>
            </Box>
            </Collapse>
          </Box>
          </>
        ) : (
          /* Default list view */
          <>
            {/* Share section */}
            <Box sx={{ px: 2, pt: 1.5, pb: 0.5 }}>
              <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#616161', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Share</Typography>
            </Box>
            <MenuItem onClick={() => setShareableLinkView(true)} sx={{ py: 1.5, px: 2 }}>
              <ListItemIcon sx={{ minWidth: 40 }}><InsertLinkIcon sx={{ fontSize: 22, color: '#616161' }} /></ListItemIcon>
              <ListItemText>
                <Typography sx={{ fontSize: 15, fontWeight: 500, color: '#212121', fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>Shareable Link</Typography>
                <Typography sx={{ fontSize: 13, color: '#616161' }}>Includes all tabs</Typography>
              </ListItemText>
              <ChevronRightIcon sx={{ fontSize: 20, color: '#9e9e9e' }} />
            </MenuItem>

            <Divider sx={{ my: 0.5 }} />

            {/* Export section */}
            <Box sx={{ px: 2, pt: 1.5, pb: 0.5 }}>
              <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#616161', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Export Current Tab</Typography>
            </Box>
            {[
              { icon: <Box component="img" src="/excel.png" alt="" sx={{ width: 22, height: 22, objectFit: 'contain' }} />, label: 'Excel', hasArrow: false },
              { icon: <Box component="img" src="/pdf.png" alt="" sx={{ width: 22, height: 22, objectFit: 'contain' }} />, label: 'PDF', hasArrow: true },
              { icon: <Box component="img" src="/powerpoint.png" alt="" sx={{ width: 22, height: 22, objectFit: 'contain' }} />, label: 'PowerPoint', hasArrow: true },
              { icon: <Box component="img" src="/googleslides.png" alt="" sx={{ width: 22, height: 22, objectFit: 'contain' }} />, label: 'Google Slides', hasArrow: true },
            ].map((item, i) => (
              <MenuItem key={i} onClick={() => setDownloadAnchor(null)} sx={{ py: 1.5, px: 2 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText>
                  <Typography sx={{ fontSize: 15, fontWeight: 500, color: '#212121', fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>{item.label}</Typography>
                </ListItemText>
                {item.hasArrow && <ChevronRightIcon sx={{ fontSize: 20, color: '#9e9e9e' }} />}
              </MenuItem>
            ))}
          </>
        )}
      </Menu>

      {/* Tab dropdown menu */}
      <Menu anchorEl={tabMenuAnchor} open={Boolean(tabMenuAnchor)} onClose={() => setTabMenuAnchor(null)}
        PaperProps={{ elevation: 4, sx: { width: 200, borderRadius: 1, mt: 0.5, boxShadow: '0px 4px 5px rgba(0,0,0,0.14), 0px 2px 4px rgba(0,0,0,0.12), 0px 1px 10px rgba(0,0,0,0.2)' } }}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => {
          const tab = tabs[tabMenuTabIndex]
          setRenameLabel(typeof tab === 'string' ? tab : tab.label)
          setRenameDescription(typeof tab === 'string' ? '' : tab.description)
          setTabMenuAnchor(null)
          setRenameModalOpen(true)
        }} sx={{ height: 48, px: 2, gap: 1.5 }}>
          <EditOutlinedIcon sx={{ fontSize: 20, color: '#616161' }} />
          <Typography sx={{ fontSize: 15, color: '#212121' }}>Rename</Typography>
        </MenuItem>
        <Tooltip title={tabs.length <= 1 ? 'At least one tab must remain pinned' : ''} placement="bottom" arrow>
          <span>
            <MenuItem disabled={tabs.length <= 1} onClick={() => {
              const idx = tabMenuTabIndex
              const removed = tabs[idx]
              setTabMenuAnchor(null)
              setRemovedTabs(prev => [...prev, removed])
              setTabs(prev => prev.filter((_, i) => i !== idx))
              if (activeTab >= idx) setActiveTab(Math.max(0, activeTab - 1))
              triggerSave()
            }} sx={{ height: 48, px: 2, gap: 1.5, '&.Mui-disabled': { opacity: 1 } }}>
              <VisibilityOffOutlinedIcon sx={{ fontSize: 20, color: tabs.length <= 1 ? '#bdbdbd' : '#616161' }} />
              <Typography sx={{ fontSize: 15, color: tabs.length <= 1 ? '#bdbdbd' : '#212121' }}>Remove</Typography>
            </MenuItem>
          </span>
        </Tooltip>
      </Menu>

      {/* Rename Tab modal */}
      <Dialog open={renameModalOpen} onClose={() => setRenameModalOpen(false)} PaperProps={{ sx: { width: 400, borderRadius: 1 } }}>
        <DialogTitle sx={{ fontSize: 16, fontWeight: 700, pb: 1 }}>Rename Tab</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '8px !important' }}>
          <TextField
            label="Name" fullWidth size="small" value={renameLabel}
            onChange={e => setRenameLabel(e.target.value)}
            inputProps={{ maxLength: 40 }}
          />
          <TextField
            label="Description" fullWidth size="small" value={renameDescription}
            onChange={e => setRenameDescription(e.target.value)}
            inputProps={{ maxLength: 60 }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={() => setRenameModalOpen(false)} sx={{ textTransform: 'none', color: 'text.secondary' }}>Cancel</Button>
          <Button variant="contained" onClick={() => {
            setTabs(prev => prev.map((t, i) => i === tabMenuTabIndex ? { label: renameLabel, description: renameDescription } : t))
            setRenameModalOpen(false)
            triggerSave()
          }} sx={{ textTransform: 'none', bgcolor: '#00827F', '&:hover': { bgcolor: '#006B68' } }}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Media Lists dropdown */}
      <Menu anchorEl={mediaListAnchor} open={Boolean(mediaListAnchor)} onClose={() => { setMediaListAnchor(null); setMediaListSearch('') }}
        PaperProps={{ elevation: 4, sx: { width: 340, borderRadius: 1, mt: 0.5, maxHeight: 420, boxShadow: '0px 4px 5px rgba(0,0,0,0.14), 0px 2px 4px rgba(0,0,0,0.12), 0px 1px 10px rgba(0,0,0,0.2)' } }}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      >
        {/* Search field */}
        <Box sx={{ px: 1.5, pt: 1, pb: 0.5, borderBottom: '1px solid #e0e0e0' }}>
          <TextField
            fullWidth size="small" autoFocus
            placeholder="Find"
            value={mediaListSearch}
            onChange={(e) => setMediaListSearch(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 20, color: '#9e9e9e' }} /></InputAdornment>,
              endAdornment: mediaListSearch ? (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setMediaListSearch('')}>
                    <CancelIcon sx={{ fontSize: 18, color: '#9e9e9e' }} />
                  </IconButton>
                </InputAdornment>
              ) : null,
            }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0, '& fieldset': { border: 'none' } } }}
          />
        </Box>

        {/* Selected header */}
        {selectedMediaLists.length > 0 && (
          <Box sx={{ px: 2, py: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#212121', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Selected({selectedMediaLists.length})
            </Typography>
            <Typography onClick={() => setSelectedMediaLists([])} sx={{ fontSize: 13, fontWeight: 600, color: '#00827F', cursor: 'pointer' }}>
              Clear
            </Typography>
          </Box>
        )}

        {/* Manage Media Lists link */}
        <Box sx={{ px: 2, py: 1, display: 'flex', alignItems: 'center', gap: 0.75, cursor: 'pointer', '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } }}>
          <OpenInNewIcon sx={{ fontSize: 18, color: '#00827F' }} />
          <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#00827F' }}>Manage Custom categories</Typography>
        </Box>

        {/* List items */}
        {filteredMediaLists.map((list) => (
          <Box
            key={list.name}
            onClick={() => toggleMediaList(list.name)}
            sx={{ px: 1, py: 0.75, display: 'flex', alignItems: 'center', cursor: 'pointer', '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } }}
          >
            <Checkbox
              checked={selectedMediaLists.includes(list.name)}
              size="small"
              sx={{ p: 0.5, color: '#9e9e9e', '&.Mui-checked': { color: '#00827F' } }}
            />
            <Box sx={{ flex: 1, ml: 0.5 }}>
              <Typography sx={{ fontSize: 14, color: '#212121' }}>{list.name}</Typography>
              <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{list.contacts} contacts</Typography>
            </Box>
            <IconButton size="small" sx={{ p: 0.5 }} onClick={(e) => e.stopPropagation()}>
              <OpenInNewIcon sx={{ fontSize: 18, color: '#9e9e9e' }} />
            </IconButton>
          </Box>
        ))}
      </Menu>

      {/* Chip context menu */}
      <Menu anchorEl={chipMenuAnchor} open={Boolean(chipMenuAnchor)} onClose={() => setChipMenuAnchor(null)}
        PaperProps={{ elevation: 3, sx: { borderRadius: 1, minWidth: 160, mt: 0.5 } }}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => setChipMenuAnchor(null)} sx={{ height: 44, px: 2, gap: 1.5 }}>
          <EditIcon sx={{ fontSize: 20, color: '#616161' }} />
          <Typography sx={{ fontSize: 14 }}>Edit</Typography>
        </MenuItem>
        <MenuItem onClick={() => {
          if (chipMenuBoxIdx !== null && chipMenuChipIdx !== null) {
            const setters = [setKeywordAllChips, setKeywordAnyChips, setKeywordNoneChips]
            const getter = [keywordAllChips, keywordAnyChips, keywordNoneChips]
            const chips = getter[chipMenuBoxIdx]
            const chip = chips[chipMenuChipIdx]
            if (chip) setters[chipMenuBoxIdx](prev => [...prev, { ...chip }])
          }
          setChipMenuAnchor(null)
        }} sx={{ height: 44, px: 2, gap: 1.5 }}>
          <ContentCopyIcon sx={{ fontSize: 20, color: '#616161' }} />
          <Typography sx={{ fontSize: 14 }}>Duplicate</Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => {
          if (chipMenuBoxIdx !== null && chipMenuChipIdx !== null) {
            const setters = [setKeywordAllChips, setKeywordAnyChips, setKeywordNoneChips]
            setters[chipMenuBoxIdx](prev => prev.filter((_, i) => i !== chipMenuChipIdx))
          }
          setChipMenuAnchor(null)
        }} sx={{ height: 44, px: 2, gap: 1.5 }}>
          <DeleteOutlineIcon sx={{ fontSize: 20, color: '#616161' }} />
          <Typography sx={{ fontSize: 14 }}>Remove</Typography>
        </MenuItem>
      </Menu>

      {/* Add Saved Assets dropdown */}
      <Menu anchorEl={assetsAnchor} open={Boolean(assetsAnchor)} onClose={() => setAssetsAnchor(null)}
        PaperProps={{ elevation: 4, sx: { width: 300, borderRadius: 1, mt: 0.5 } }}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Add Saved Assets</Typography>
        </Box>
        {[
          { icon: <ManageSearchIcon sx={{ fontSize: 20, color: '#616161' }} />, label: 'Saved Searches' },
          { icon: <CategoryOutlinedIcon sx={{ fontSize: 20, color: '#616161' }} />, label: 'Custom Categories' },
          { icon: <PeopleOutlineIcon sx={{ fontSize: 20, color: '#616161' }} />, label: 'Author Lists' },
          { icon: <FormatListBulletedIcon sx={{ fontSize: 20, color: '#616161' }} />, label: 'Custom categories' },
          { icon: <FilterListIcon sx={{ fontSize: 20, color: '#616161' }} />, label: 'Filter Sets' },
        ].map((item) => (
          <MenuItem key={item.label} onClick={() => { setAssetsAnchor(null); setAssetsModalType(item.label) }} sx={{ height: 36, px: 2 }}>
            <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
            <ListItemText><Typography sx={{ fontSize: 14, fontWeight: 500, color: '#212121' }}>{item.label}</Typography></ListItemText>
          </MenuItem>
        ))}

        {assetsBoxIdx !== null && assetsBoxIdx > 0 && (
          <>
            <Divider sx={{ my: 0.5 }} />
            <Box sx={{ px: 2, py: 1 }}>
              <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', letterSpacing: '0.08em', textTransform: 'uppercase' }}>AI Workflows</Typography>
            </Box>
            {[
              { icon: <PlaylistAddIcon sx={{ fontSize: 20, color: '#616161' }} />, label: 'Add Related Keywords' },
              { icon: <TranslateIcon sx={{ fontSize: 20, color: '#616161' }} />, label: 'Add Translated Keywords' },
              { icon: <AccountTreeIcon sx={{ fontSize: 20, color: '#616161' }} />, label: 'Add Spelling & Name Variations' },
            ].map((item) => (
              <MenuItem key={item.label} onClick={() => setAssetsAnchor(null)} sx={{ height: 36, px: 2 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
                <ListItemText><Typography sx={{ fontSize: 14, fontWeight: 500, color: '#212121' }}>{item.label}</Typography></ListItemText>
              </MenuItem>
            ))}
          </>
        )}
      </Menu>

      <AddToDashboardModal open={dashboardModalOpen} onClose={() => { setDashboardModalOpen(false); setDashboardModalFromTab(false) }} onSave={(name) => { if (dashboardModalFromTab) { onDashboardSave({ name, message: <>Tab was successfully added to dashboard &ldquo;{name}&rdquo;.</> }) } else { onDashboardSave(name) } }} hideTabSelect={dashboardModalFromTab} subtext={dashboardModalFromTab ? "Add this tab's layout and charts to a dashboard." : undefined} />

      <CreateDashboardModal open={createDashboardWizardOpen} onClose={() => setCreateDashboardWizardOpen(false)} onSave={(name) => onDashboardSave({ name, message: <>Your Dashboard was successfully created.</> })} />

      <SaveSearchModal open={saveSearchModalOpen} onClose={() => setSaveSearchModalOpen(false)} onSave={(name, message) => { setSavedSearchName(name); setSaveSearchSnackbar(message) }} />

      <Snackbar
        open={savedSuccess}
        autoHideDuration={5000}
        onClose={() => setSavedSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSavedSuccess(false)}
          severity="success"
          variant="outlined"
          sx={{ bgcolor: '#f0faf0', borderColor: '#4caf50', minWidth: 320 }}
        >
          <Typography sx={{ fontWeight: 700, fontSize: 14, color: '#212121' }}>Tab View Saved</Typography>
          <Typography sx={{ fontSize: 13, color: '#424242', mt: 0.25 }}>
            Your tab layout has been saved and is only visible to you.
          </Typography>
        </Alert>
      </Snackbar>

      <Snackbar
        open={Boolean(saveSearchSnackbar)}
        autoHideDuration={6000}
        onClose={() => setSaveSearchSnackbar(null)}
        message={saveSearchSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        action={
          <IconButton size="small" onClick={() => setSaveSearchSnackbar(null)} sx={{ color: 'white' }}>
            <CloseIcon sx={{ fontSize: 20 }} />
          </IconButton>
        }
      />

      {/* Add Saved Assets modal */}
      <Dialog open={Boolean(assetsModalType)} onClose={handleAssetsModalClose} maxWidth="xs" fullWidth
        PaperProps={{ sx: { borderRadius: 1 } }}
      >
        <DialogTitle sx={{ pb: 0.5, pt: 2.5, px: 3 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 700, color: '#212121' }}>{assetsModalType}</Typography>
        </DialogTitle>
        <DialogContent sx={{ px: 3, pt: '0 !important', pb: 1 }}>
          {/* Find field */}
          <TextField
            fullWidth size="small" autoFocus
            placeholder="Find"
            value={assetsModalSearch}
            onChange={(e) => setAssetsModalSearch(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 20, color: '#9e9e9e' }} /></InputAdornment>,
              endAdornment: assetsModalSearch ? (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setAssetsModalSearch('')}>
                    <CancelIcon sx={{ fontSize: 18, color: '#9e9e9e' }} />
                  </IconButton>
                </InputAdornment>
              ) : null,
            }}
            sx={{
              mx: -3, width: 'calc(100% + 48px)',
              '& .MuiOutlinedInput-root': {
                borderRadius: 0,
                '& .MuiOutlinedInput-notchedOutline': { border: 'none', borderBottom: '1px solid #e0e0e0' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none', borderBottom: '2px solid #00827F' },
              },
            }}
          />

          {/* Selected count */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 0.75 }}>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#212121', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Selected ({assetsModalSelected.length})
            </Typography>
            {assetsModalSelected.length > 0 && (
              <Typography onClick={() => setAssetsModalSelected([])} sx={{ fontSize: 13, fontWeight: 600, color: '#00827F', cursor: 'pointer' }}>
                Clear
              </Typography>
            )}
          </Box>

          {/* List items */}
          <Box sx={{ maxHeight: 320, overflow: 'auto', mx: -1 }}>
            {filteredAssets.map((item) => (
              <Box
                key={item}
                onClick={() => toggleAssetItem(item)}
                sx={{ px: 1, height: 40, display: 'flex', alignItems: 'center', cursor: 'pointer', borderRadius: 0.5, '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } }}
              >
                <Checkbox
                  checked={assetsModalSelected.includes(item)}
                  size="small"
                  sx={{ p: 0.5, color: '#9e9e9e', '&.Mui-checked': { color: '#00827F' } }}
                />
                <Typography sx={{ fontSize: 14, color: '#212121', ml: 0.5 }}>{item}</Typography>
              </Box>
            ))}
            {filteredAssets.length === 0 && (
              <Typography sx={{ px: 2, py: 2, fontSize: 14, color: 'text.secondary', textAlign: 'center' }}>No results found</Typography>
            )}
          </Box>
        </DialogContent>
        {assetsModalError && (
          <Typography sx={{ px: 3, pb: 0.5, fontSize: 13, color: '#d32f2f' }}>
            Please select at least one item
          </Typography>
        )}
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={handleAssetsModalClose} sx={{ color: '#00827F', fontWeight: 600, textTransform: 'none', fontSize: 14 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAssetsModalApply}
            sx={{
              bgcolor: '#00827F', color: 'white', fontWeight: 600, textTransform: 'none', fontSize: 14,
              '&:hover': { bgcolor: '#00726E' },
            }}
          >
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default SearchPanel
