import { useState, useEffect } from 'react'
import { Box, Typography, Button, IconButton, Divider, Paper, Chip } from '@mui/material'
import { alpha } from '@mui/material/styles'
import HomeIcon from '@mui/icons-material/Home'
import TravelExploreIcon from '@mui/icons-material/TravelExplore'
import BarChartIcon from '@mui/icons-material/BarChart'
import PeopleIcon from '@mui/icons-material/People'
import ChatIcon from '@mui/icons-material/Chat'
import ShareIcon from '@mui/icons-material/Share'
import AssessmentIcon from '@mui/icons-material/Assessment'
import SettingsIcon from '@mui/icons-material/Settings'
import SearchIcon from '@mui/icons-material/Search'
import AppsIcon from '@mui/icons-material/Apps'
import NotificationsIcon from '@mui/icons-material/Notifications'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
import PersonIcon from '@mui/icons-material/Person'
import LoyaltyIcon from '@mui/icons-material/Loyalty'
import DomainIcon from '@mui/icons-material/Domain'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import CodeIcon from '@mui/icons-material/Code'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import GroupIcon from '@mui/icons-material/Group'
import HubIcon from '@mui/icons-material/Hub'
import ArticleIcon from '@mui/icons-material/Article'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import TuneIcon from '@mui/icons-material/Tune'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import TaskAltIcon from '@mui/icons-material/TaskAlt'
import SearchPanel from './components/search/SearchPanel'
import ResultsView from './components/results/ResultsView'
import MiraWizardPanel from './components/mira/MiraWizardPanel'
import MiraStudioPage from './components/mira/MiraStudioPage'
import ComparePage from './components/compare/ComparePage'
import ExploreLandingPage from './components/explore/ExploreLandingPage'
import SearchesListPage from './components/explore/SearchesListPage'
import DashboardConfirmBanner from './components/core/DashboardConfirmBanner'
import { EMPTY_STATE_ILLUSTRATION } from './constants/mockData'
import { MIRA_HALO_BG, MIRA_AI_BG } from './constants/layout'
import { generateMeltwaterQuery } from './utils/queryGenerators'

const INITIAL_BRAND_STATE = {
  brandName: '', brandTerms: [], brandTermInput: '', brandLanguages: ['English'],
  generatedQuery: '', altNames: [], relatedTerms: [], keywordExclusions: [],
  customAltInput: '', customRelatedInput: '', customExclusionInput: '',
}

const INITIAL_INDUSTRY_STATE = {
  industry: '', topics: [], topicInput: '', sources: ['Online News'], generatedQuery: '',
}

export default function App() {
  const [page, setPage] = useState('explore')
  const [panelOpen, setPanelOpen] = useState(false)
  const [panelType, setPanelType] = useState(null)
  const [step, setStep] = useState(0)
  const [booleanQuery, setBooleanQuery] = useState('alibaba')
  const [activeTab, setActiveTab] = useState(0)
  const [editorExpanded, setEditorExpanded] = useState(true)
  const [resultsLoading, setResultsLoading] = useState(false)
  const [appliedQueryVersion, setAppliedQueryVersion] = useState(0)
  const [brandState, setBrandState] = useState(INITIAL_BRAND_STATE)
  const [industryState, setIndustryState] = useState(INITIAL_INDUSTRY_STATE)
  const [dashboardBanner, setDashboardBanner] = useState(null)
  const [widgetInsight, setWidgetInsight] = useState(null)
  const [searchMode, setSearchMode] = useState('boolean')
  const [initialSearchMode, setInitialSearchMode] = useState('boolean')

  // Derive result count from query state
  const resultCount = (() => {
    if (!booleanQuery) return 0
    const checkedAlts = appliedQueryVersion >= 2 ? brandState.altNames.filter(a => a.checked).length : 0
    const checkedTerms = appliedQueryVersion >= 3 ? brandState.relatedTerms.filter(t => t.checked).length : 0
    const excludedKw = appliedQueryVersion >= 4 ? brandState.keywordExclusions.filter(e => e.excluded).length : 0
    return Math.max(12, 107 + checkedAlts * 58 - checkedTerms * 18 - excludedKw * 12)
  })()

  // Show loading state whenever the query changes
  useEffect(() => {
    if (!booleanQuery) return
    setResultsLoading(true)
    const t = setTimeout(() => setResultsLoading(false), 2000)
    return () => clearTimeout(t)
  }, [booleanQuery])

  // Reactively update query when items are toggled after step 1
  useEffect(() => {
    if (!brandState.brandName || step === 0) return
    const altNames = step >= 2 ? brandState.altNames : []
    const relatedTerms = step >= 3 ? brandState.relatedTerms : []
    const keywordExclusions = step >= 4 ? brandState.keywordExclusions : []
    setBooleanQuery(generateMeltwaterQuery(brandState.brandName, altNames, relatedTerms, keywordExclusions))
  }, [brandState.altNames, brandState.relatedTerms, brandState.keywordExclusions, step]) // eslint-disable-line

  const openPanel = (type) => {
    setPanelType(type)
    setStep(0)
    if (type === 'brand') setBrandState(INITIAL_BRAND_STATE)
    else if (type === 'industry') setIndustryState(INITIAL_INDUSTRY_STATE)
    setPanelOpen(true)
  }

  const openWidgetInsight = (widgetName) => {
    setWidgetInsight(widgetName)
    setPanelType('widget-insight')
    setPanelOpen(true)
  }

  const handleSearch = (overrideQuery) => {
    const q = (overrideQuery || booleanQuery).trim()
    if (!q) {
      setStep(0)
      setAppliedQueryVersion(0)
      setBrandState(INITIAL_BRAND_STATE)
      setPanelOpen(false)
    } else {
      setBooleanQuery('')
      setTimeout(() => setBooleanQuery(q), 50)
    }
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', overflow: 'hidden' }}>

      <DashboardConfirmBanner
        dashboardName={typeof dashboardBanner === 'object' ? dashboardBanner?.name : dashboardBanner}
        message={typeof dashboardBanner === 'object' ? dashboardBanner?.message : undefined}
        onClose={() => setDashboardBanner(null)}
      />

      {/* LEFT COLUMN */}
      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* TOP HEADER */}
        <Box component="header" sx={{ height: 60, flexShrink: 0, bgcolor: 'background.paper', display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 1, boxShadow: '0px 1px 3px rgba(0,0,0,0.2), 0px 1px 1px rgba(0,0,0,0.14), 0px 2px 1px rgba(0,0,0,0.12)', zIndex: 10, position: 'relative' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pl: 1 }}>
            {page === 'mira-studio' && (
              <Box sx={{ width: 28, height: 28, borderRadius: '50%', background: MIRA_AI_BG, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box component="img" src="/fjord_ai.png" alt="Mira" sx={{ width: 18, height: 18, objectFit: 'contain', filter: 'brightness(0) invert(1)' }} onError={e => { e.target.style.display = 'none' }} />
              </Box>
            )}
            <Typography sx={{ fontSize: 20, fontWeight: 500, color: 'rgba(0,0,0,0.87)' }}>
              {page === 'mira-studio' ? 'Mira Studio' : 'Explore'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #e0e0e0', borderRadius: 5, px: 1.5, py: 0.5, gap: 1 }}>
              <SearchIcon sx={{ fontSize: 18, color: '#9e9e9e' }} />
              <Typography sx={{ fontSize: 14, color: '#9e9e9e', width: 80 }}>Find</Typography>
            </Box>
            <Button variant="outlined" size="small" startIcon={<AutoFixHighIcon sx={{ fontSize: 16, color: '#8B49A0' }} />}
              onClick={() => openPanel('general')}
              sx={{ borderRadius: 0.5, borderColor: '#e0e0e0', color: '#595959', fontSize: 14, fontWeight: 700, height: 36, px: 1.5 }}>Mira companion</Button>
            <IconButton size="small" sx={{ border: '1px solid #bdbdbd', borderRadius: '50%', width: 36, height: 36 }}><AppsIcon sx={{ fontSize: 20, color: 'text.secondary' }} /></IconButton>
            <IconButton size="small" sx={{ border: '1px solid #bdbdbd', borderRadius: '50%', width: 36, height: 36 }}><NotificationsIcon sx={{ fontSize: 20, color: 'text.secondary' }} /></IconButton>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, border: '1px solid #e0e0e0', borderRadius: '0 18px 18px 0', pl: 1.5, height: 36 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#595959' }}>Company name</Typography>
              <Box sx={{ width: 36, height: 36, bgcolor: '#f0f0f0', border: '1px solid #e0e0e0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PersonIcon sx={{ fontSize: 16, color: '#9e9e9e' }} />
              </Box>
            </Box>
          </Box>
        </Box>

        {/* BODY: side nav + main content */}
        <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

          {/* Side Nav */}
          <Box sx={{ width: 220, flexShrink: 0, bgcolor: 'background.paper', borderRight: '1px solid #e0e0e0', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '2px 0 4px rgba(0,0,0,0.06)' }}>
            <Divider />

            {/* Nav items */}
            <Box sx={{ flex: 1, overflow: 'auto', py: 1 }}>
              {/* Home */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1, cursor: 'pointer', '&:hover': { bgcolor: alpha('#000', 0.04) } }}>
                <HomeIcon sx={{ fontSize: 20, color: '#616161' }} />
                <Typography sx={{ fontSize: 14, color: '#424242' }}>Home</Typography>
              </Box>

              {/* Explore (expanded) */}
              <Box sx={{ mx: 1, borderRadius: 1.5 }}>
                <Box onClick={() => setPage('explore-landing')} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 1.5, py: 1, cursor: 'pointer', borderRadius: 1.5 }}>
                  <TravelExploreIcon sx={{ fontSize: 20, color: '#1D9F9F' }} />
                  <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#212121', flex: 1 }}>Explore</Typography>
                  <ExpandLessIcon sx={{ fontSize: 18, color: '#616161' }} />
                </Box>
                {/* Submenu */}
                <Box sx={{ borderLeft: '2px solid #e0e0e0', ml: 3.25, mb: 0.5 }}>
                  {[
                    { label: 'Searches & Filters', target: 'searches-list' },
                    { label: 'Compare', target: 'compare' },
                  ].map(({ label, target }) => {
                    const isActive = (page === target || (target === 'searches-list' && page === 'explore')) && page !== 'explore-landing'
                    return (
                      <Box key={label} onClick={() => setPage(target)} sx={{ px: 2, py: 0.75, cursor: 'pointer', borderRadius: 1, bgcolor: isActive ? alpha('#28BBBB', 0.1) : 'transparent', '&:hover': { bgcolor: isActive ? alpha('#28BBBB', 0.14) : alpha('#000', 0.04) } }}>
                        <Typography sx={{ fontSize: 14, color: isActive ? '#1D9F9F' : '#757575', fontWeight: isActive ? 600 : 400 }}>{label}</Typography>
                      </Box>
                    )
                  })}
                </Box>
              </Box>

              {/* Collapsible items */}
              {[
                { icon: <ShowChartIcon sx={{ fontSize: 20, color: '#616161' }} />, label: 'Monitor', hasChevron: true },
                { icon: <BarChartIcon sx={{ fontSize: 20, color: '#616161' }} />, label: 'Analyze', hasChevron: false },
                { icon: <GroupIcon sx={{ fontSize: 20, color: '#616161' }} />, label: 'Media Relations', hasChevron: true },
                { icon: <ChatIcon sx={{ fontSize: 20, color: '#616161' }} />, label: 'Engage', hasChevron: true },
                { icon: <HubIcon sx={{ fontSize: 20, color: '#616161' }} />, label: 'Author Segments', hasChevron: false },
                { icon: <ArticleIcon sx={{ fontSize: 20, color: '#616161' }} />, label: 'Newsletters', hasChevron: false },
                { icon: <AssessmentIcon sx={{ fontSize: 20, color: '#616161' }} />, label: 'Report', hasChevron: true },
                { icon: <NotificationsNoneIcon sx={{ fontSize: 20, color: '#616161' }} />, label: 'Alerts', hasChevron: false },
              ].map(item => (
                <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1, cursor: 'pointer', '&:hover': { bgcolor: alpha('#000', 0.04) } }}>
                  {item.icon}
                  <Typography sx={{ fontSize: 14, color: '#424242', flex: 1 }}>{item.label}</Typography>
                  {item.hasChevron && <ExpandMoreIcon sx={{ fontSize: 18, color: '#9e9e9e' }} />}
                </Box>
              ))}

              <Divider sx={{ my: 1 }} />

              {/* Bottom section */}
              {[
                { icon: <TuneIcon sx={{ fontSize: 20, color: '#616161' }} />, label: 'Content', hasChevron: true },
                { icon: <ManageAccountsIcon sx={{ fontSize: 20, color: '#616161' }} />, label: 'Account', hasChevron: true },
              ].map(item => (
                <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1, cursor: 'pointer', '&:hover': { bgcolor: alpha('#000', 0.04) } }}>
                  {item.icon}
                  <Typography sx={{ fontSize: 14, color: '#424242', flex: 1 }}>{item.label}</Typography>
                  {item.hasChevron && <ExpandMoreIcon sx={{ fontSize: 18, color: '#9e9e9e' }} />}
                </Box>
              ))}

              {/* Mira Studio */}
              <Box onClick={() => setPage('mira-studio')} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1, cursor: 'pointer', bgcolor: page === 'mira-studio' ? alpha('#9C4DD6', 0.08) : 'transparent', '&:hover': { bgcolor: alpha('#9C4DD6', 0.08) } }}>
                <Box sx={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #9C4DD6 0%, #1D9F9F 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Box component="img" src="/fjord_ai.png" alt="Mira" sx={{ width: 18, height: 18, objectFit: 'contain', filter: 'brightness(0) invert(1)' }} onError={e => { e.target.style.display = 'none' }} />
                </Box>
                <Typography sx={{ fontSize: 14, color: '#212121', flex: 1 }}>Mira Studio</Typography>
                <Chip label="New" size="small" variant="outlined" sx={{ height: 22, fontSize: 11, fontWeight: 700, borderColor: '#B627A1', color: '#B627A1', borderRadius: 1 }} />
              </Box>
            </Box>
          </Box>

          {/* Main Content */}
          <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {page === 'mira-studio' ? (
              <MiraStudioPage />
            ) : page === 'explore-landing' ? (
              <ExploreLandingPage onNavigate={(target) => setPage(target)} onOpenSearch={(q) => { setBooleanQuery(q); setPage('explore') }} onCreateSearch={(key) => { setInitialSearchMode(key === 'combined' ? 'combined' : key === 'keyword' ? 'keyword' : 'boolean'); setBooleanQuery(''); setPage('explore') }} />
            ) : page === 'searches-list' ? (
              <SearchesListPage onOpenSearch={(q) => { setBooleanQuery(q); setPage('explore') }} onCreateSearch={(key) => { setInitialSearchMode(key === 'combined' ? 'combined' : key === 'keyword' ? 'keyword' : 'boolean'); setBooleanQuery(''); setPage('explore') }} />
            ) : page === 'compare' ? (
              <ComparePage onBack={() => setPage('explore')} />
            ) : (
              <>
                <SearchPanel
                  booleanQuery={booleanQuery}
                  setBooleanQuery={setBooleanQuery}
                  editorExpanded={editorExpanded}
                  setEditorExpanded={setEditorExpanded}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  onSearch={(q) => handleSearch(q)}
                  onOpenPanel={openPanel}
                  onDashboardSave={(name) => setDashboardBanner(name)}
                  onSearchModeChange={setSearchMode}
                  initialSearchMode={initialSearchMode}
                />

                {/* Content area */}
                <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'stretch', pt: 0, px: 2, pb: 2 }}>
                  {!booleanQuery ? (
                    <Box sx={{ width: '100%', overflow: 'auto', display: 'flex', justifyContent: 'center' }}>
                    {searchMode === 'combined' ? (
                      <Paper elevation={1} sx={{ width: '100%', maxWidth: 792, height: 500, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, borderRadius: 0.5, px: 4 }}>
                        <Box sx={{ width: 160, height: 160, borderRadius: '50%', bgcolor: alpha('#28BBBB', 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <TaskAltIcon sx={{ fontSize: 72, color: '#28BBBB' }} />
                        </Box>
                        <Box sx={{ textAlign: 'center', maxWidth: 560 }}>
                          <Typography sx={{ fontSize: 24, fontWeight: 700, color: 'rgba(0,0,0,0.87)', mb: 1.5 }}>Build searches from what you've already saved</Typography>
                          <Typography sx={{ fontSize: 16, lineHeight: '24px', color: 'text.secondary' }}>Add saved searches, filter sets, and more to the boxes above to find the coverage you need.</Typography>
                        </Box>
                        <Divider sx={{ width: '100%', maxWidth: 560 }} />
                        <Typography sx={{ fontSize: 15, color: 'text.secondary' }}>
                          Learn more: <Box component="span" sx={{ color: '#1D9F9F', cursor: 'pointer', textDecoration: 'underline' }}>Getting Started with Combined Searches</Box>
                        </Typography>
                      </Paper>
                    ) : (
                      <Paper elevation={1} sx={{ width: '100%', maxWidth: 792, height: 500, py: 6, px: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, borderRadius: 0.5 }}>
                        <Box sx={{ width: 192, height: 192, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <img src={EMPTY_STATE_ILLUSTRATION} alt="" style={{ width: 175, height: 175, objectFit: 'contain' }} onError={e => { e.target.style.display = 'none' }} />
                        </Box>
                        <Box sx={{ textAlign: 'center', px: 2 }}>
                          <Typography sx={{ fontSize: 24, fontWeight: 500, lineHeight: '32px', color: 'rgba(0,0,0,0.87)', mb: 1 }}>Let's build your search together</Typography>
                          <Typography sx={{ fontSize: 16, lineHeight: '22px', color: 'text.primary' }}>Answer a few questions and review the search before results load.</Typography>
                          <Typography sx={{ fontSize: 16, lineHeight: '22px', color: 'text.primary' }}>Prefer to build it yourself? Use Boolean operators to search above.</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2, width: '100%', maxWidth: 587, px: 2 }}>
                          {[
                            { type: 'brand', label: 'Create a Brand Search', icon: <LoyaltyIcon sx={{ fontSize: 20, color: '#8B49A0' }} /> },
                            { type: 'industry', label: 'Create an Industry Search', icon: <DomainIcon sx={{ fontSize: 20, color: '#8B49A0' }} /> },
                          ].map(card => (
                            <Box key={card.type} onClick={() => openPanel(card.type)}
                              sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1.5, p: 1, height: 52, border: '1px solid rgba(33,33,33,0.12)', borderRadius: 2, cursor: 'pointer', bgcolor: 'background.paper', transition: 'all 0.15s', '&:hover': { border: '1px solid #1D9F9F', boxShadow: `0 0 0 1px ${alpha('#1D9F9F', 0.25)}`, bgcolor: alpha('#1D9F9F', 0.02) } }}>
                              <Box sx={{ width: 36, height: 36, borderRadius: '50%', background: MIRA_HALO_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{card.icon}</Box>
                              <Typography variant="body1" fontWeight={700} color="text.primary">{card.label}</Typography>
                            </Box>
                          ))}
                        </Box>
                      </Paper>
                    )}
                    </Box>
                  ) : (
                    <ResultsView query={booleanQuery} brandName={brandState.brandName} loading={resultsLoading} resultCount={resultCount} onDashboardSave={(name) => setDashboardBanner(name)} onWidgetInsight={openWidgetInsight} activeTab={activeTab} />
                  )}
                </Box>
              </>
            )}
          </Box>
        </Box>
      </Box>

      {/* RIGHT COLUMN: Mira Companion panel (pushes content) */}
      <MiraWizardPanel
        panelOpen={panelOpen}
        onClose={() => setPanelOpen(false)}
        panelType={panelType}
        setPanelType={setPanelType}
        step={step}
        setStep={setStep}
        brandState={brandState}
        setBrandState={setBrandState}
        industryState={industryState}
        setIndustryState={setIndustryState}
        setBooleanQuery={setBooleanQuery}
        resultsLoading={resultsLoading}
        setAppliedQueryVersion={setAppliedQueryVersion}
        widgetInsight={widgetInsight}
      />
    </Box>
  )
}
