import { useState, useEffect, useRef } from 'react'
import { Box, Typography, Button, IconButton, Collapse, Checkbox, FormControlLabel, Divider, Stack } from '@mui/material'
import { alpha } from '@mui/material/styles'
import CloseIcon from '@mui/icons-material/Close'
import EditNoteIcon from '@mui/icons-material/EditNote'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import AddIcon from '@mui/icons-material/Add'
import AddCommentOutlinedIcon from '@mui/icons-material/AddCommentOutlined'
import HistoryIcon from '@mui/icons-material/History'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import SearchIcon from '@mui/icons-material/Search'
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined'
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt'
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt'
import SyncIcon from '@mui/icons-material/Sync'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import LoyaltyIcon from '@mui/icons-material/Loyalty'
import DomainIcon from '@mui/icons-material/Domain'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault'
import MiraAIIcon from './MiraAIIcon'
import SearchVersionCard from '../search/SearchVersionCard'
import { BRAND_STEPS, MIRA_MESSAGES, WIDGET_INSIGHTS } from '../../constants/messages'
import { PANEL_WIDTH, MIRA_HALO_BG } from '../../constants/layout'
import {
  generateAltNames,
  generateRelatedTerms,
  generateMoreRelatedTerms,
  generateKeywordExclusions,
  generateBooleanQuery,
  generateMeltwaterQuery,
} from '../../utils/queryGenerators'

// ── CollapsibleRow ─────────────────────────────────────────────────────────────
function CollapsibleRow({ label, children }) {
  const [open, setOpen] = useState(false)
  return (
    <Box sx={{ mb: 1.5 }}>
      <Box onClick={() => setOpen(o => !o)}
        sx={{ display: 'flex', alignItems: 'center', gap: 0.75, cursor: 'pointer', py: 0.25, userSelect: 'none' }}>
        <KeyboardArrowDownIcon sx={{ fontSize: 18, color: 'text.secondary', transform: open ? 'none' : 'rotate(-90deg)', transition: 'transform 0.2s' }} />
        <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>{label}</Typography>
      </Box>
      <Collapse in={open}>
        <Box sx={{ pl: 3.25, pt: 0.75 }}>
          {children}
        </Box>
      </Collapse>
    </Box>
  )
}

// ── ThinkingDots ───────────────────────────────────────────────────────────────
function ThinkingDots() {
  return (
    <Box sx={{ display: 'flex', gap: 0.75, alignItems: 'center', py: 1, px: 0.5 }}>
      {[0, 1, 2].map(i => (
        <Box key={i} sx={{
          width: 8, height: 8, borderRadius: '50%', bgcolor: '#bdbdbd',
          animation: 'miraPulse 1.4s ease-in-out infinite',
          animationDelay: `${i * 0.16}s`,
          '@keyframes miraPulse': {
            '0%, 60%, 100%': { transform: 'scale(0.65)', opacity: 0.35 },
            '30%': { transform: 'scale(1)', opacity: 1 },
          },
        }} />
      ))}
    </Box>
  )
}

// ── MiraWizardPanel ────────────────────────────────────────────────────────────
function MiraWizardPanel({
  panelOpen,
  onClose,
  panelType,
  setPanelType,
  step,
  setStep,
  brandState,
  setBrandState,
  industryState,
  setIndustryState,
  setBooleanQuery,
  resultsLoading,
  setAppliedQueryVersion,
  widgetInsight,
}) {
  const isGeneral = panelType === 'general' || !panelType
  const isWidgetInsight = panelType === 'widget-insight'

  const [chatHistory, setChatHistory] = useState([])
  const [isThinking, setIsThinking] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  // Reset chat when panel type changes
  useEffect(() => {
    if (!panelType) return
    const initialText = MIRA_MESSAGES[panelType]?.[0] ?? MIRA_MESSAGES.general[0]
    setChatHistory([{ role: 'mira', text: initialText, contentType: isGeneral ? 'general-landing' : `${panelType}-0` }])
    setIsThinking(false)
    setChatInput('')
  }, [panelType]) // eslint-disable-line

  // Reset chat when widget insight changes (same panelType, different widget)
  useEffect(() => {
    if (!widgetInsight) return
    setChatHistory([{ role: 'mira', text: '', contentType: 'widget-insight-0' }])
    setIsThinking(false)
    setChatInput('')
  }, [widgetInsight]) // eslint-disable-line

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatHistory, isThinking])

  const pushMira = (text, contentType, delay = 1200) => {
    setIsThinking(true)
    setTimeout(() => {
      setIsThinking(false)
      setChatHistory(h => [...h, { role: 'mira', text, contentType }])
    }, delay)
  }

  const handleSend = () => {
    if (!chatInput.trim() || isThinking) return
    const userMsg = chatInput.trim()
    setChatInput('')
    setChatHistory(h => [...h, { role: 'user', text: userMsg }])

    if (panelType === 'brand' && step === 0) {
      const name = userMsg
      setBrandState(s => ({ ...s, brandName: name, altNames: generateAltNames(name) }))
      setBooleanQuery(generateMeltwaterQuery(name))
      setAppliedQueryVersion(1)
      setStep(1)
      pushMira('', 'brand-1', 2000)
    } else if (panelType === 'industry' && step === 0) {
      setIndustryState(s => ({ ...s, industry: userMsg }))
      setStep(1)
      pushMira(`Great! I'll set up monitoring for the ${userMsg} industry.`, 'industry-1')
    }
  }

  const handleAltNamesApply = () => {
    const terms = generateRelatedTerms(brandState.brandName)
    setBrandState(s => ({ ...s, relatedTerms: terms.map(label => ({ label, checked: true })) }))
    setBooleanQuery(generateMeltwaterQuery(brandState.brandName, brandState.altNames))
    setAppliedQueryVersion(2)
    setChatHistory(h => [...h, { role: 'user', text: 'Apply to search' }])
    setStep(2)
    pushMira("I've updated your search", 'brand-2', 2000)
  }

  const handleGenerateMore = () => {
    const more = generateMoreRelatedTerms(brandState.brandName)
    const existing = new Set(brandState.relatedTerms.map(t => t.label))
    const added = more.filter(t => !existing.has(t)).map(label => ({ label, checked: true }))
    setBrandState(s => ({ ...s, relatedTerms: [...s.relatedTerms, ...added] }))
  }

  const handleGenerateMoreExclusions = () => {
    const extras = ['Job Listings', 'Wikipedia', 'Reddit', 'Stock Ticker', 'Sponsored Content', 'SEO Content', 'Press Kit', 'Annual Report', 'Earnings Call', 'Investor Relations']
    const existing = new Set(brandState.keywordExclusions.map(e => e.label))
    const added = extras.filter(t => !existing.has(t)).map(label => ({ label, excluded: true }))
    setBrandState(s => ({ ...s, keywordExclusions: [...s.keywordExclusions, ...added] }))
  }

  const handleRelatedTermsApply = () => {
    const exclusions = generateKeywordExclusions(brandState.brandName)
    setBrandState(s => ({ ...s, keywordExclusions: exclusions }))
    setBooleanQuery(generateMeltwaterQuery(brandState.brandName, brandState.altNames, brandState.relatedTerms))
    setAppliedQueryVersion(3)
    setChatHistory(h => [...h, { role: 'user', text: 'Apply to search' }])
    setStep(3)
    pushMira("I've updated your search to include Relevant Terms.", 'brand-3', 2000)
  }

  const handleExcludeFromSearch = () => {
    setBooleanQuery(generateMeltwaterQuery(brandState.brandName, brandState.altNames, brandState.relatedTerms, brandState.keywordExclusions))
    setAppliedQueryVersion(4)
    setChatHistory(h => [...h, { role: 'user', text: 'Exclude from Search' }])
    pushMira('', 'brand-4', 2000)
  }

  const renderContent = (contentType) => {
    if (!contentType) return null

    if (contentType === 'general-landing') {
      const sectionHeaderSx = { fontSize: 11, fontWeight: 700, color: 'text.secondary', letterSpacing: '0.5px', textTransform: 'uppercase', px: 1.5, pt: 2, pb: 0.5 }
      const cardSx = { display: 'flex', alignItems: 'center', gap: 1.5, px: 1.5, py: 1.25, borderRadius: 2, cursor: 'pointer', transition: 'all 0.15s', '&:hover': { bgcolor: alpha('#000', 0.04) } }
      const iconWrapSx = (bg) => ({ width: 36, height: 36, borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 })

      return (
        <Stack spacing={0} sx={{ mt: 1.5 }}>
          {/* SEARCH CREATION */}
          <Typography sx={sectionHeaderSx}>Search Creation</Typography>
          {[
            { type: 'brand', icon: <LoyaltyIcon sx={{ fontSize: 18, color: '#8B49A0' }} />, label: 'Create Brand Search', bg: MIRA_HALO_BG },
            { type: 'industry', icon: <DomainIcon sx={{ fontSize: 18, color: '#8B49A0' }} />, label: 'Create Industry Search', bg: MIRA_HALO_BG },
            { type: null, icon: <DescriptionOutlinedIcon sx={{ fontSize: 18, color: '#8B49A0' }} />, label: 'Brief me on a topic', bg: MIRA_HALO_BG },
          ].map((item, i) => (
            <Box key={i} onClick={() => item.type && (setPanelType(item.type), setStep(0))} sx={cardSx}>
              <Box sx={iconWrapSx(item.bg)}>{item.icon}</Box>
              <Typography sx={{ fontSize: 15, fontWeight: 600, color: '#212121' }}>{item.label}</Typography>
            </Box>
          ))}

          {/* VIEW SUGGESTED SEARCHES */}
          <Typography sx={sectionHeaderSx}>View Suggested Searches</Typography>
          {[
            { label: 'Xbox series s' },
            { label: 'Gaming industry' },
          ].map((item, i) => (
            <Box key={i} sx={cardSx}>
              <Box sx={iconWrapSx('#F0F0F0')}><SearchIcon sx={{ fontSize: 18, color: '#757575' }} /></Box>
              <Typography sx={{ fontSize: 15, fontWeight: 600, color: '#212121' }}>{item.label}</Typography>
            </Box>
          ))}

          {/* INFORMATION */}
          <Typography sx={sectionHeaderSx}>Information</Typography>
          {[
            { label: 'How many searches do I have left?' },
            { label: 'How far can I search in Meltwater' },
          ].map((item, i) => (
            <Box key={i} sx={cardSx}>
              <Box sx={iconWrapSx('#F0F0F0')}><LightbulbOutlinedIcon sx={{ fontSize: 18, color: '#757575' }} /></Box>
              <Typography sx={{ fontSize: 15, fontWeight: 600, color: '#212121' }}>{item.label}</Typography>
            </Box>
          ))}
        </Stack>
      )
    }

    if (contentType === 'brand-0') {
      return (
        <Box sx={{ mt: 1.5 }}>
          <CollapsibleRow label="We'll cover four crucial steps">
            <Box component="ol" sx={{ mt: 0.5, pl: 2.5, mb: 0 }}>
              {BRAND_STEPS.map((s, i) => (
                <Typography key={i} component="li" sx={{ fontSize: 16, lineHeight: '26px' }}>{s}</Typography>
              ))}
            </Box>
          </CollapsibleRow>
          <Box sx={{ mt: 2, border: '1px solid rgba(33,33,33,0.12)', borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ height: 3, background: 'linear-gradient(90deg, #9C4DD6 0%, #1D9F9F 100%)' }} />
            <Box sx={{ px: 2, pt: 1.5, pb: 2 }}>
              <Typography sx={{ fontSize: 13, color: 'text.secondary', mb: 1 }}>Step 1 of 4</Typography>
              <Typography sx={{ fontSize: 16, fontWeight: 700, lineHeight: '22px', mb: 1 }}>Brand Name</Typography>
              <Typography sx={{ fontSize: 16, lineHeight: '22px', color: '#212121' }}>What's the name of the brand you want to track?</Typography>
            </Box>
          </Box>
        </Box>
      )
    }

    if (contentType === 'brand-1') {
      const { brandName, altNames = [] } = brandState
      return (
        <Box sx={{ mt: 0.5 }}>
          <Typography sx={{ fontSize: 16, lineHeight: '22px', color: '#212121', mb: 1.5 }}>
            Great! You want to monitor <strong>{brandName}.</strong>
          </Typography>

          <CollapsibleRow label="Added brand name and excluded common noise">
            <Typography sx={{ fontSize: 14, fontWeight: 700, lineHeight: '20px', color: '#212121', mb: 0.5 }}>Added</Typography>
            <Typography sx={{ fontSize: 14, lineHeight: '20px', color: '#212121', mb: 1 }}>{brandName}</Typography>
            <Typography sx={{ fontSize: 14, fontWeight: 700, lineHeight: '20px', color: '#212121', mb: 0.5 }}>Excluded</Typography>
            <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
              {['Press Releases', 'NSFW Content', 'Market Research Reports', 'News Aggregators', 'Stock Market News'].map(item => (
                <Typography key={item} component="li" sx={{ fontSize: 14, lineHeight: '24px', color: '#212121' }}>{item}</Typography>
              ))}
            </Box>
          </CollapsibleRow>

          <SearchVersionCard brandName={brandName} version={1} query={generateBooleanQuery(1, brandName)}
            onPreview={() => { setBooleanQuery(generateBooleanQuery(1, brandName)); setAppliedQueryVersion(1) }} />

          <Box sx={{ mt: 2, border: '1px solid rgba(33,33,33,0.12)', borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ height: 3, background: 'linear-gradient(90deg, #9C4DD6 0%, #1D9F9F 100%)' }} />
            <Box sx={{ px: 2, pt: 1.5, pb: 0 }}>
              <Typography sx={{ fontSize: 13, color: 'text.secondary', mb: 1 }}>Step 2 of 4</Typography>
              <Typography sx={{ fontSize: 16, fontWeight: 700, lineHeight: '22px', mb: 0.5 }}>Add Alternative Brand Names</Typography>
              <Typography sx={{ fontSize: 16, lineHeight: '22px', color: '#212121', mb: 1.5 }}>
                Your brand can go by many names. Here are a few I recommend to add so you don't miss content.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 1.5 }}>
                <Typography
                  onClick={() => setBrandState(s => ({ ...s, altNames: s.altNames.map(a => ({ ...a, checked: true })) }))}
                  sx={{ fontSize: 14, fontWeight: 600, color: 'primary.main', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                  Select all
                </Typography>
                <Typography
                  onClick={() => setBrandState(s => ({ ...s, altNames: s.altNames.map(a => ({ ...a, checked: false })) }))}
                  sx={{ fontSize: 14, fontWeight: 600, color: 'primary.main', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                  Clear all
                </Typography>
              </Box>
            </Box>
            <Box sx={{ px: 1 }}>
              {altNames.map((alt, i) => (
                <FormControlLabel key={i}
                  control={<Checkbox size="small" checked={alt.checked} color="primary"
                    onChange={() => setBrandState(s => ({ ...s, altNames: s.altNames.map((a, j) => j === i ? { ...a, checked: !a.checked } : a) }))}
                    sx={{ '& .MuiSvgIcon-root': { fontSize: 20 } }} />}
                  label={<Typography sx={{ fontSize: 16, color: '#212121' }}>{alt.label}</Typography>}
                  sx={{ mx: 0, my: 0.5, display: 'flex', width: '100%' }}
                />
              ))}
            </Box>
            <Box sx={{ mx: 2, mt: 1, borderTop: '1px solid rgba(33,33,33,0.12)' }}>
              <Box component="input"
                value={brandState.customAltInput || ''}
                onChange={e => setBrandState(s => ({ ...s, customAltInput: e.target.value }))}
                onKeyDown={e => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    setBrandState(s => ({ ...s, altNames: [...s.altNames, { label: s.customAltInput.trim(), checked: true }], customAltInput: '' }))
                  }
                }}
                placeholder="+ Add a name"
                sx={{ width: '100%', border: 'none', outline: 'none', py: 1.25, fontSize: 15, color: '#212121', bgcolor: 'transparent', fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', '&::placeholder': { color: 'rgba(33,33,33,0.38)' }, boxSizing: 'border-box' }}
              />
            </Box>
            <Box sx={{ px: 2, pt: 1.5, pb: 2 }}>
              <Button variant="outlined" onClick={handleAltNamesApply}
                sx={{ borderRadius: 1.5, fontSize: 15, fontWeight: 700, textTransform: 'none', borderColor: '#212121', color: '#212121', px: 3, py: 1, '&:hover': { borderColor: '#212121', bgcolor: 'rgba(0,0,0,0.04)' } }}>
                Apply to Search
              </Button>
            </Box>
          </Box>

          <Typography sx={{ fontSize: 16, lineHeight: '22px', color: '#212121', mt: 2 }}>
            <strong>Keep what fits, remove what doesn't.</strong> You can add your own by sending me a message.
          </Typography>
        </Box>
      )
    }

    if (contentType === 'brand-2') {
      const { brandName, relatedTerms = [] } = brandState
      return (
        <Box sx={{ mt: 1.5 }}>
          <CollapsibleRow label="Added alternative brand names">
            <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
              {brandState.altNames.filter(a => a.checked).map(a => (
                <Typography key={a.label} component="li" sx={{ fontSize: 14, lineHeight: '24px', color: '#212121' }}>{a.label}</Typography>
              ))}
            </Box>
          </CollapsibleRow>

          <SearchVersionCard brandName={brandName} version={2} query={generateBooleanQuery(2, brandName, brandState.altNames)}
            onPreview={() => { setBooleanQuery(generateBooleanQuery(2, brandName, brandState.altNames)); setAppliedQueryVersion(2) }} />

          <Box sx={{ mt: 2, border: '1px solid rgba(33,33,33,0.12)', borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ height: 3, background: 'linear-gradient(90deg, #9C4DD6 0%, #1D9F9F 100%)' }} />
            <Box sx={{ px: 2, pt: 1.5, pb: 0 }}>
              <Typography sx={{ fontSize: 13, color: 'text.secondary', mb: 1 }}>Step 3 of 4</Typography>
              <Typography sx={{ fontSize: 16, fontWeight: 700, lineHeight: '22px', mb: 0.5 }}>Next, let's add relevant terms</Typography>
              <Typography sx={{ fontSize: 16, lineHeight: '22px', color: '#212121', mb: 1.5 }}>
                Refine your results. Recommendations are based on the top terms for your brand.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 1.5 }}>
                <Typography
                  onClick={() => setBrandState(s => ({ ...s, relatedTerms: s.relatedTerms.map(t => ({ ...t, checked: true })) }))}
                  sx={{ fontSize: 14, fontWeight: 600, color: 'primary.main', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                  Select all
                </Typography>
                <Typography
                  onClick={() => setBrandState(s => ({ ...s, relatedTerms: s.relatedTerms.map(t => ({ ...t, checked: false })) }))}
                  sx={{ fontSize: 14, fontWeight: 600, color: 'primary.main', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                  Clear all
                </Typography>
              </Box>
            </Box>
            <Box sx={{ px: 1 }}>
              {relatedTerms.map((term, i) => (
                <FormControlLabel key={i}
                  control={<Checkbox size="small" checked={term.checked} color="primary"
                    onChange={() => setBrandState(s => ({ ...s, relatedTerms: s.relatedTerms.map((t, j) => j === i ? { ...t, checked: !t.checked } : t) }))}
                    sx={{ '& .MuiSvgIcon-root': { fontSize: 20 } }} />}
                  label={<Typography sx={{ fontSize: 16, color: '#212121' }}>{term.label}</Typography>}
                  sx={{ mx: 0, my: 0.5, display: 'flex', width: '100%' }}
                />
              ))}
            </Box>
            <Box sx={{ mx: 2, mt: 1, borderTop: '1px solid rgba(33,33,33,0.12)' }}>
              <Box component="input"
                value={brandState.customRelatedInput || ''}
                onChange={e => setBrandState(s => ({ ...s, customRelatedInput: e.target.value }))}
                onKeyDown={e => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    setBrandState(s => ({ ...s, relatedTerms: [...s.relatedTerms, { label: s.customRelatedInput.trim(), checked: true }], customRelatedInput: '' }))
                  }
                }}
                placeholder="+ Add a term"
                sx={{ width: '100%', border: 'none', outline: 'none', py: 1.25, fontSize: 15, color: '#212121', bgcolor: 'transparent', fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', '&::placeholder': { color: 'rgba(33,33,33,0.38)' }, boxSizing: 'border-box' }}
              />
            </Box>
            <Box sx={{ px: 2, pt: 1.5, pb: 0.5 }}>
              <Typography onClick={handleGenerateMore}
                sx={{ fontSize: 14, fontWeight: 600, color: 'primary.main', cursor: 'pointer', display: 'inline', textDecoration: 'underline', '&:hover': { opacity: 0.8 } }}>
                Generate 10 more
              </Typography>
            </Box>
            <Box sx={{ px: 2, pt: 1.5, pb: 2 }}>
              <Button variant="outlined" onClick={handleRelatedTermsApply}
                sx={{ borderRadius: 1.5, fontSize: 15, fontWeight: 700, textTransform: 'none', borderColor: '#212121', color: '#212121', px: 3, py: 1, '&:hover': { borderColor: '#212121', bgcolor: 'rgba(0,0,0,0.04)' } }}>
                Apply to Search
              </Button>
            </Box>
          </Box>

          <Typography sx={{ fontSize: 16, lineHeight: '22px', color: '#212121', mt: 2 }}>
            <strong>Keep what fits, remove what doesn't.</strong> Add your own or specify a topic you'd like me to recommend terms about.
          </Typography>
        </Box>
      )
    }

    if (contentType === 'brand-3') {
      const { brandName, relatedTerms = [], keywordExclusions = [] } = brandState
      const checkedTerms = relatedTerms.filter(t => t.checked)
      return (
        <Box sx={{ mt: 1.5 }}>
          <CollapsibleRow label="Added Relevant Terms">
            <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
              {checkedTerms.map(t => (
                <Typography key={t.label} component="li" sx={{ fontSize: 14, lineHeight: '24px', color: '#212121' }}>{t.label}</Typography>
              ))}
            </Box>
          </CollapsibleRow>

          <SearchVersionCard brandName={brandName} version={3} query={generateBooleanQuery(3, brandName, brandState.altNames, relatedTerms, keywordExclusions)}
            onPreview={() => { setBooleanQuery(generateBooleanQuery(3, brandName, brandState.altNames, relatedTerms, keywordExclusions)); setAppliedQueryVersion(3) }} />

          <Box sx={{ mt: 2, border: '1px solid rgba(33,33,33,0.12)', borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ height: 3, background: 'linear-gradient(90deg, #9C4DD6 0%, #1D9F9F 100%)' }} />
            <Box sx={{ px: 2, pt: 1.5, pb: 0 }}>
              <Typography sx={{ fontSize: 13, color: 'text.secondary', mb: 1 }}>Step 4 of 4</Typography>
              <Typography sx={{ fontSize: 16, fontWeight: 700, lineHeight: '22px', mb: 0.5 }}>Lastly, let's remove noise</Typography>
              <Typography sx={{ fontSize: 16, lineHeight: '22px', color: '#212121', mb: 1.5 }}>
                Focus your results on what matters. Here are exclusions I've found to be irrelevant to your brand.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 1.5 }}>
                <Typography
                  onClick={() => setBrandState(s => ({ ...s, keywordExclusions: s.keywordExclusions.map(e => ({ ...e, excluded: true })) }))}
                  sx={{ fontSize: 14, fontWeight: 600, color: 'primary.main', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                  Exclude all
                </Typography>
                <Typography
                  onClick={() => setBrandState(s => ({ ...s, keywordExclusions: s.keywordExclusions.map(e => ({ ...e, excluded: false })) }))}
                  sx={{ fontSize: 14, fontWeight: 600, color: 'primary.main', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                  Clear all
                </Typography>
              </Box>
            </Box>
            <Box sx={{ px: 1 }}>
              {keywordExclusions.map((item, i) => (
                <Box key={i}
                  onClick={() => setBrandState(s => ({ ...s, keywordExclusions: s.keywordExclusions.map((e, j) => j === i ? { ...e, excluded: !e.excluded } : e) }))}
                  sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1, py: 0.75, cursor: 'pointer', borderRadius: 1, '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } }}>
                  {item.excluded
                    ? <DisabledByDefaultIcon sx={{ fontSize: 20, color: '#f44336' }} />
                    : <CheckBoxOutlineBlankIcon sx={{ fontSize: 20, color: '#757575' }} />
                  }
                  <Typography sx={{ fontSize: 16, color: '#212121' }}>{item.label}</Typography>
                </Box>
              ))}
            </Box>
            <Box sx={{ mx: 2, mt: 1, borderTop: '1px solid rgba(33,33,33,0.12)' }}>
              <Box component="input"
                value={brandState.customExclusionInput || ''}
                onChange={e => setBrandState(s => ({ ...s, customExclusionInput: e.target.value }))}
                onKeyDown={e => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    setBrandState(s => ({ ...s, keywordExclusions: [...s.keywordExclusions, { label: s.customExclusionInput.trim(), excluded: true }], customExclusionInput: '' }))
                  }
                }}
                placeholder="+ Add a term"
                sx={{ width: '100%', border: 'none', outline: 'none', py: 1.25, fontSize: 15, color: '#212121', bgcolor: 'transparent', fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', '&::placeholder': { color: 'rgba(33,33,33,0.38)' }, boxSizing: 'border-box' }}
              />
            </Box>
            <Box sx={{ px: 2, pt: 1.5, pb: 2 }}>
              <Button variant="outlined" onClick={handleExcludeFromSearch}
                sx={{ borderRadius: 1.5, fontSize: 15, fontWeight: 700, textTransform: 'none', borderColor: '#212121', color: '#212121', px: 3, py: 1, '&:hover': { borderColor: '#212121', bgcolor: 'rgba(0,0,0,0.04)' } }}>
                Exclude from Search
              </Button>
            </Box>
          </Box>

          <Typography sx={{ fontSize: 16, lineHeight: '22px', color: '#212121', mt: 2 }}>
            <strong>Click any term you want to keep in your results.</strong> You can also add your own. Enter a source, keyword, language or topic to exclude.
          </Typography>
        </Box>
      )
    }

    if (contentType === 'brand-4') {
      const { brandName, relatedTerms = [], keywordExclusions = [] } = brandState
      const excludedTerms = keywordExclusions.filter(e => e.excluded)
      const recommendations = [
        'Capture alternate keyword variations',
        'Add translated terms',
        'Exclude specific content',
        'Expand my search',
      ]
      return (
        <Box sx={{ mt: 0.5 }}>
          <Typography sx={{ fontSize: 16, lineHeight: '22px', color: '#212121', mb: 1.5 }}>
            Your search has been updated.
          </Typography>

          <CollapsibleRow label="Excluded irrelevant terms">
            <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
              {excludedTerms.map(e => (
                <Typography key={e.label} component="li" sx={{ fontSize: 14, lineHeight: '24px', color: '#212121' }}>{e.label}</Typography>
              ))}
            </Box>
          </CollapsibleRow>

          <SearchVersionCard brandName={brandName} version={4} query={generateBooleanQuery(3, brandName, brandState.altNames, relatedTerms, keywordExclusions)}
            onPreview={() => { setBooleanQuery(generateBooleanQuery(3, brandName, brandState.altNames, relatedTerms, keywordExclusions)); setAppliedQueryVersion(4) }} />

          <Typography sx={{ fontSize: 16, lineHeight: '24px', color: '#212121', mb: 2 }}>
            <strong>Want to continue refining?</strong> Here are a few ways to sharpen your search. Or just tell me what to change.
          </Typography>

          <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1.5, overflow: 'hidden' }}>
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#212121' }}>Recommended Follow-Up</Typography>
            </Box>
            <Divider />
            {recommendations.map((label, i) => (
              <Box key={i}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1.5, cursor: 'pointer', '&:hover': { bgcolor: 'rgba(0,0,0,0.03)' } }}>
                  <AutoAwesomeIcon sx={{ fontSize: 18, color: '#7B3FA0', flexShrink: 0 }} />
                  <Typography sx={{ flex: 1, fontSize: 14, color: '#212121' }}>{label}</Typography>
                  <ArrowDownwardIcon sx={{ fontSize: 16, color: 'text.secondary', flexShrink: 0 }} />
                </Box>
                {i < recommendations.length - 1 && <Divider />}
              </Box>
            ))}
          </Box>
        </Box>
      )
    }

    if (contentType === 'widget-insight-0') {
      const insightText = WIDGET_INSIGHTS[widgetInsight] || ''
      const paragraphs = insightText.split('\n\n')
      return (
        <Box sx={{ mt: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <AutoAwesomeIcon sx={{ fontSize: 14, color: '#9C4DD6' }} />
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#9C4DD6' }}>AI insights</Typography>
            <Typography sx={{ fontSize: 13, color: '#9e9e9e' }}>|</Typography>
            <Typography sx={{ fontSize: 13, color: '#9e9e9e' }}>Last 7 Days</Typography>
          </Box>
          {paragraphs.map((p, i) => {
            if (p.startsWith('**') && p.endsWith('**')) {
              return <Typography key={i} sx={{ fontSize: 15, fontWeight: 700, lineHeight: '22px', color: '#212121', mb: 1 }}>{p.replace(/\*\*/g, '')}</Typography>
            }
            if (p.startsWith('- ')) {
              const items = p.split('\n').filter(l => l.startsWith('- '))
              return (
                <Box key={i} component="ul" sx={{ m: 0, pl: 2.5, mb: 1.5 }}>
                  {items.map((item, j) => {
                    const content = item.slice(2)
                    const boldMatch = content.match(/^\*\*(.+?)\*\*(.*)/)
                    return (
                      <Typography key={j} component="li" sx={{ fontSize: 14, lineHeight: '22px', color: '#212121', mb: 0.5 }}>
                        {boldMatch ? <><strong>{boldMatch[1]}</strong>{boldMatch[2]}</> : content}
                      </Typography>
                    )
                  })}
                </Box>
              )
            }
            return <Typography key={i} sx={{ fontSize: 15, lineHeight: '24px', color: '#212121', mb: 1.5 }}>{p}</Typography>
          })}
        </Box>
      )
    }

    return null
  }

  return (
    <Box sx={{ width: panelOpen ? PANEL_WIDTH : 0, flexShrink: 0, overflow: 'hidden', transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)' }}>
      <Box sx={{ width: PANEL_WIDTH, height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper', borderLeft: '3px solid rgba(33,33,33,0.38)' }}>

        {/* Panel Header */}
        <Box sx={{ height: 52, display: 'flex', alignItems: 'center', gap: 1, px: 2, borderBottom: '1px solid #e0e0e0', flexShrink: 0 }}>
          {isGeneral ? (
            <>
              <AddCommentOutlinedIcon sx={{ fontSize: 20, color: '#212121' }} />
              <Typography sx={{ flex: 1, fontSize: 18, fontWeight: 600, color: '#212121', fontFamily: '"Inter", sans-serif' }} noWrap>
                New Mira Chat
              </Typography>
              <IconButton size="small" sx={{ width: 36, height: 36, borderRadius: '50%' }}>
                <HistoryIcon sx={{ fontSize: 20, color: '#212121' }} />
              </IconButton>
            </>
          ) : (
            <>
              <Typography sx={{ flex: 1, fontSize: 18, fontWeight: 600, color: '#212121', fontFamily: '"Inter", sans-serif' }} noWrap>
                Mira Companion
              </Typography>
              <Button size="small" startIcon={<EditNoteIcon sx={{ fontSize: 18 }} />}
                onClick={() => { setPanelType('general'); setStep(0) }}
                sx={{ color: '#212121', fontWeight: 700, fontSize: 14, px: 1 }}>
                New chat
              </Button>
            </>
          )}
          <IconButton size="small" onClick={onClose} sx={{ width: 36, height: 36, borderRadius: '50%' }}>
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>

        {/* Scrollable chat history */}
        <Box sx={{ flex: 1, overflow: 'auto', px: 2, py: 1.5 }}>
          {chatHistory.map((msg, i) =>
            msg.role === 'user' ? (
              <Box key={i} sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Box sx={{ maxWidth: '80%', bgcolor: '#F3E8FF', borderRadius: '12px 12px 2px 12px', px: 2, py: 1 }}>
                  <Typography sx={{ fontSize: 14, lineHeight: '20px', color: '#212121' }}>{msg.text}</Typography>
                </Box>
              </Box>
            ) : (
              <Box key={i} sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
                  <MiraAIIcon size={28} />
                  <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#212121', fontFamily: '"Inter", sans-serif' }}>Mira</Typography>
                </Box>
                <Box sx={{ pl: 0.5 }}>
                  {msg.contentType === 'general-landing' ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, background: 'linear-gradient(135deg, #E8F5F5 0%, #F0FAF5 50%, #E8F5F0 100%)', borderRadius: 2, px: 2, py: 1.5, border: '1px solid rgba(29,159,159,0.15)' }}>
                      <MiraAIIcon size={32} />
                      <Typography sx={{ fontSize: 15, fontWeight: 500, color: '#4A6B6B' }}>{msg.text}</Typography>
                    </Box>
                  ) : (
                    <Typography sx={{ fontSize: 16, lineHeight: '22px', color: '#212121', whiteSpace: 'pre-line' }}>{msg.text}</Typography>
                  )}
                  {renderContent(msg.contentType)}
                  {msg.contentType !== 'general-landing' && (
                    <Box sx={{ display: 'flex', gap: 0.25, mt: 1, pt: 0.5 }}>
                      <IconButton size="small" sx={{ p: 0.5 }}><ThumbUpOffAltIcon sx={{ fontSize: 16 }} /></IconButton>
                      <IconButton size="small" sx={{ p: 0.5 }}><ThumbDownOffAltIcon sx={{ fontSize: 16 }} /></IconButton>
                      <IconButton size="small" sx={{ p: 0.5 }}><SyncIcon sx={{ fontSize: 16 }} /></IconButton>
                    </Box>
                  )}
                </Box>
              </Box>
            )
          )}

          {(isThinking || (resultsLoading && step > 0)) && (
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
                <MiraAIIcon size={28} />
                <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#212121', fontFamily: '"Inter", sans-serif' }}>Mira</Typography>
              </Box>
              <Box sx={{ pl: 0.5 }}>
                {resultsLoading && !isThinking && (
                  <Typography sx={{ fontSize: 14, color: '#212121', mb: 0.5 }}>Updating your results</Typography>
                )}
                <ThinkingDots />
              </Box>
            </Box>
          )}

          <div ref={bottomRef} />
        </Box>

        {/* Chat input */}
        <Box sx={{ flexShrink: 0, borderTop: '1px solid #e0e0e0', p: 2 }}>
          <Box onClick={() => inputRef.current?.focus()} sx={{
            border: isGeneral ? '1px solid #e0e0e0' : '2px solid #B627A1',
            borderRadius: 2, p: 2, minHeight: 80, display: 'flex', alignItems: 'flex-start', gap: 1,
            boxShadow: isGeneral ? '0px 2px 8px rgba(0,0,0,0.06)' : '0px 4px 22px rgba(0,0,0,0.06)',
            bgcolor: 'background.paper', cursor: 'text',
          }}>
            <Box component="input"
              ref={inputRef}
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              disabled={isThinking}
              placeholder={
                isGeneral ? 'Ask me a question...'
                : step === 0 ? (panelType === 'brand' ? 'e.g. Apple, Nike, Tesla…' : 'e.g. Electric Vehicles, Healthcare…')
                : 'Reply…'
              }
              sx={{
                flex: 1, border: 'none', outline: 'none',
                fontSize: 16, lineHeight: '22px', color: '#212121',
                bgcolor: 'transparent', fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                '&::placeholder': { color: 'rgba(33,33,33,0.38)' },
                '&:disabled': { opacity: 0.5 },
              }}
            />
            <Box onClick={handleSend}
              sx={{
                width: 36, height: 36, borderRadius: '50%',
                bgcolor: chatInput.trim() && !isThinking ? (isGeneral ? '#e0e0e0' : 'primary.main') : '#e0e0e0',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, cursor: chatInput.trim() && !isThinking ? 'pointer' : 'default',
                transition: 'background-color 0.2s',
                '&:hover': { bgcolor: chatInput.trim() && !isThinking ? (isGeneral ? '#bdbdbd' : 'primary.dark') : '#e0e0e0' },
              }}>
              {isGeneral
                ? <ArrowForwardIcon sx={{ fontSize: 20, color: '#757575' }} />
                : <ArrowUpwardIcon sx={{ fontSize: 20, color: 'white' }} />
              }
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default MiraWizardPanel
