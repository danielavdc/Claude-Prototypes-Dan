import { useState, useEffect, useRef } from 'react'
import { Box, Typography, IconButton, Button, Checkbox, FormControlLabel, Collapse, Tooltip } from '@mui/material'
import { alpha } from '@mui/material/styles'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ViewWeekIcon from '@mui/icons-material/ViewWeek'
import GridViewIcon from '@mui/icons-material/GridView'
import EditNoteIcon from '@mui/icons-material/EditNote'
import HistoryIcon from '@mui/icons-material/History'
import SendIcon from '@mui/icons-material/Send'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import FindInPageIcon from '@mui/icons-material/FindInPage'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import AddIcon from '@mui/icons-material/Add'
import XIcon from '@mui/icons-material/X'
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt'
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt'
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt'
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt'

// ── ThinkingDots ──────────────────────────────────────────────────────────────
function ThinkingDots() {
  return (
    <Box sx={{ display: 'flex', gap: 0.75, alignItems: 'center', py: 0.5 }}>
      {[0, 1, 2].map(i => (
        <Box key={i} sx={{
          width: 8, height: 8, borderRadius: '50%', bgcolor: '#bdbdbd',
          animation: 'studioPulse 1.4s ease-in-out infinite',
          animationDelay: `${i * 0.16}s`,
          '@keyframes studioPulse': {
            '0%, 60%, 100%': { transform: 'scale(0.65)', opacity: 0.35 },
            '30%': { transform: 'scale(1)', opacity: 1 },
          },
        }} />
      ))}
    </Box>
  )
}

// ── SkeletonLine ──────────────────────────────────────────────────────────────
function SkeletonLine({ width = '100%', height = 12, sx = {} }) {
  return (
    <Box sx={{
      width, height, borderRadius: 1, bgcolor: '#e8e8e8',
      animation: 'shimmer 1.5s ease-in-out infinite',
      '@keyframes shimmer': { '0%, 100%': { opacity: 1 }, '50%': { opacity: 0.5 } },
      ...sx,
    }} />
  )
}

function CanvasSkeletonCard() {
  return (
    <Box sx={{ px: 3, py: 2.5, borderBottom: '1px solid #f0f0f0' }}>
      <Box sx={{ display: 'flex', gap: 1.5 }}>
        <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: '#e8e8e8', flexShrink: 0,
          animation: 'shimmer 1.5s ease-in-out infinite',
          '@keyframes shimmer': { '0%, 100%': { opacity: 1 }, '50%': { opacity: 0.5 } },
        }} />
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1, pt: 0.5 }}>
          <SkeletonLine width="60%" />
          <SkeletonLine width="100%" />
          <SkeletonLine width="85%" />
          <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
            <SkeletonLine width={60} height={20} sx={{ borderRadius: 2 }} />
            <SkeletonLine width={60} height={20} sx={{ borderRadius: 2 }} />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

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
        <Box sx={{ pl: 2.5, pt: 0.5 }}>{children}</Box>
      </Collapse>
    </Box>
  )
}

// ── Sparkline ─────────────────────────────────────────────────────────────────
function Sparkline({ color = '#1D9F9F', points = [3,5,2,8,4,7,6,9,5,8] }) {
  const w = 60, h = 24
  const min = Math.min(...points), max = Math.max(...points)
  const norm = points.map(p => h - ((p - min) / (max - min || 1)) * (h - 4) - 2)
  const d = norm.map((y, i) => `${i === 0 ? 'M' : 'L'} ${(i / (points.length - 1)) * w} ${y}`).join(' ')
  return (
    <svg width={w} height={h} style={{ display: 'block' }}>
      <path d={d} fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}

// ── TotalMentionsChart ────────────────────────────────────────────────────────
function TotalMentionsChart() {
  const points = [4,3,5,2,4,3,2,4,5,3,4,6,5,7,6,8,7,9,8,10]
  const w = 120, h = 48
  const min = Math.min(...points), max = Math.max(...points)
  const norm = points.map(p => h - ((p - min) / (max - min)) * (h - 6) - 3)
  const d = norm.map((y, i) => `${i === 0 ? 'M' : 'L'} ${(i / (points.length - 1)) * w} ${y}`).join(' ')
  return (
    <svg width={w} height={h} style={{ display: 'block' }}>
      <path d={d} fill="none" stroke="#1D9F9F" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}

// ── SentimentBar ──────────────────────────────────────────────────────────────
function SentimentBar({ pct, color }) {
  return (
    <Box sx={{ flex: 1, height: 8, borderRadius: 1, bgcolor: '#f0f0f0', overflow: 'hidden' }}>
      <Box sx={{ width: `${pct}%`, height: '100%', bgcolor: color, borderRadius: 1 }} />
    </Box>
  )
}

// ── FeedCard ──────────────────────────────────────────────────────────────────
function FeedCard({ publisher, type, country, lang, sentiment, excerpt, tag, reach, isTwitter, onInclude, onExclude, thumbed }) {
  return (
    <Box sx={{ px: 2, py: 2, borderBottom: '1px solid #f0f0f0' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
        <Box sx={{ width: 22, height: 22, borderRadius: '50%', bgcolor: isTwitter ? '#000' : '#e8e8e8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {isTwitter
            ? <XIcon sx={{ fontSize: 12, color: 'white' }} />
            : <Typography sx={{ fontSize: 9, fontWeight: 700, color: '#555' }}>{publisher[0]}</Typography>
          }
        </Box>
        <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#212121' }}>{publisher}</Typography>
      </Box>
      <Typography sx={{ fontSize: 11, color: 'text.secondary', mb: 0.75 }}>
        {type} | {country} | {lang} | <Box component="span" sx={{ color: sentiment === 'Positive' ? '#2e7d32' : '#c62828' }}>{sentiment}</Box> | Feb 02 · 12:45 PM
      </Typography>
      <Typography sx={{ fontSize: 13, lineHeight: '18px', color: '#212121', mb: 1 }}>
        {excerpt}
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#212121' }}>{tag}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography sx={{ fontSize: 12, color: 'text.secondary', mr: 1 }}>{reach} reach</Typography>
          <Tooltip title="Include similar content" placement="top">
            <IconButton size="small" onClick={onInclude} sx={{ p: 0.5, color: thumbed === 'up' ? '#2e7d32' : 'text.secondary', '&:hover': { color: '#2e7d32' } }}>
              {thumbed === 'up'
                ? <ThumbUpAltIcon sx={{ fontSize: 16 }} />
                : <ThumbUpOffAltIcon sx={{ fontSize: 16 }} />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Exclude similar content" placement="top">
            <IconButton size="small" onClick={onExclude} sx={{ p: 0.5, color: thumbed === 'down' ? '#c62828' : 'text.secondary', '&:hover': { color: '#c62828' } }}>
              {thumbed === 'down'
                ? <ThumbDownAltIcon sx={{ fontSize: 16 }} />
                : <ThumbDownOffAltIcon sx={{ fontSize: 16 }} />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  )
}

const FEED_CARDS = [
  { publisher: 'Flipr', type: 'News', country: 'US', lang: 'Spanish', sentiment: 'Positive', excerpt: 'La compañía lleva más de 40 años liderando el mercado de especialidad. De la tecnología a la experiencia del consumidor, los cambios en la industria son notables...', tag: 'Brand, Coffee', reach: '2k' },
  { publisher: 'Moderbord', type: 'News', country: 'US', lang: 'Spanish', sentiment: 'Positive', excerpt: 'Specialty coffee brands are expanding their reach through digital channels. Saint Frank Coffee is among the brands pioneering direct-to-consumer models...', tag: 'Brand, Coffee', reach: '2k' },
  { publisher: 'Blankfrak @blan', type: 'X', country: 'US', lang: 'English', sentiment: 'Positive', excerpt: '@TheVResistance It may be that the brand has partnerships with major tech companies providing the coffee for events, only…', tag: 'Brand, Coffee', reach: '2k', isTwitter: true },
]

const SOURCE_TYPES = [
  { label: 'X (Twitter)', count: '230k', color: '#1D9F9F', points: [4,6,3,7,5,8,4,9,6,8] },
  { label: 'Reddit',      count: '56.2k', color: '#f44336', points: [6,4,7,3,5,4,6,3,5,4] },
  { label: 'News',        count: '53.3k', color: '#42a5f5', points: [3,5,4,6,5,7,4,6,5,7] },
]
const LOCATIONS = [
  { label: 'Unknown',        count: '183k', points: [5,4,6,3,5,4,6,5,7,6] },
  { label: 'United States',  count: '84.1k', points: [3,5,4,7,5,6,4,5,6,5] },
  { label: 'Japan',          count: '47.2k', points: [4,6,5,4,6,5,7,4,6,5] },
]
const LANGUAGES = [
  { label: 'English',  count: '280k', points: [5,6,4,7,5,8,6,7,5,8] },
  { label: 'Japanese', count: '48.4k', points: [3,4,5,3,4,5,3,4,5,4] },
  { label: 'Spanish',  count: '13.6k', points: [2,3,2,4,3,2,3,4,3,4] },
]
const SENTIMENTS = [
  { label: 'Positive',   pct: 65.0, color: '#2e7d32' },
  { label: 'Negative',   pct: 25.6, color: '#c62828' },
  { label: 'Neutral',    pct: 20.3, color: '#9e9e9e' },
  { label: 'Not Rated',  pct: 0.2,  color: '#42a5f5' },
]

// ── StatRow ───────────────────────────────────────────────────────────────────
function StatRow({ i, label, count, color, points }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', py: 1, borderBottom: i < 2 ? '1px solid #f0f0f0' : 'none' }}>
      <Typography sx={{ fontSize: 12, color: 'text.secondary', width: 14, flexShrink: 0 }}>{i + 1}</Typography>
      <Typography sx={{ flex: 1, fontSize: 13, color: '#212121', ml: 0.5 }}>{label}</Typography>
      <Typography sx={{ fontSize: 13, color: '#212121', mr: 1 }}>{count}</Typography>
      <Sparkline color={color || '#1D9F9F'} points={points} />
    </Box>
  )
}

// ── AltNamesStep ──────────────────────────────────────────────────────────────
function AltNamesStep({ brandName }) {
  const defaultAlts = ['Saint Frank', 'Saint Franks', '@saintfrankcoffee', 'St Frank Coffee', 'Saint Frank Coffee Beans']
  const [alts, setAlts] = useState(defaultAlts.map(l => ({ label: l, checked: true })))
  const [customInput, setCustomInput] = useState('')

  return (
    <Box sx={{ border: '1px solid rgba(33,33,33,0.12)', borderRadius: 2, overflow: 'hidden', mb: 2 }}>
      <Box sx={{ height: 3, background: 'linear-gradient(90deg, #9C4DD6 0%, #1D9F9F 100%)' }} />
      <Box sx={{ px: 2, pt: 1.5, pb: 0 }}>
        <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 1 }}>Step 2 of 4</Typography>
        <Typography sx={{ fontSize: 15, fontWeight: 700, mb: 0.5 }}>Add Alternative Brand Names</Typography>
        <Typography sx={{ fontSize: 14, color: '#212121', mb: 1.5, lineHeight: '20px' }}>
          Your brand can go by many names. Here are a few I recommend to add so you don't miss content.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
          {['Select all', 'Clear all'].map((lbl, i) => (
            <Typography key={lbl} onClick={() => setAlts(a => a.map(x => ({ ...x, checked: i === 0 })))}
              sx={{ fontSize: 13, fontWeight: 600, color: 'primary.main', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
              {lbl}
            </Typography>
          ))}
        </Box>
      </Box>
      <Box sx={{ px: 1 }}>
        {alts.map((alt, i) => (
          <FormControlLabel key={i}
            control={<Checkbox size="small" checked={alt.checked} color="primary"
              onChange={() => setAlts(a => a.map((x, j) => j === i ? { ...x, checked: !x.checked } : x))}
              sx={{ '& .MuiSvgIcon-root': { fontSize: 20 } }} />}
            label={<Typography sx={{ fontSize: 15, color: '#212121' }}>{alt.label}</Typography>}
            sx={{ mx: 0, my: 0.5, display: 'flex', width: '100%' }}
          />
        ))}
      </Box>
      <Box sx={{ mx: 2, mt: 0.5, borderTop: '1px solid rgba(33,33,33,0.12)' }}>
        <Box component="input" value={customInput} onChange={e => setCustomInput(e.target.value)}
          placeholder="+ Add a name"
          sx={{ width: '100%', border: 'none', outline: 'none', py: 1, fontSize: 14, color: '#212121', bgcolor: 'transparent', fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', '&::placeholder': { color: 'rgba(33,33,33,0.38)' }, boxSizing: 'border-box' }} />
      </Box>
      <Box sx={{ px: 2, pt: 1.5, pb: 2 }}>
        <Button variant="outlined"
          sx={{ borderRadius: 1.5, fontSize: 14, fontWeight: 700, textTransform: 'none', borderColor: '#212121', color: '#212121', px: 3, py: 1, '&:hover': { borderColor: '#212121', bgcolor: 'rgba(0,0,0,0.04)' } }}>
          Apply to Search
        </Button>
      </Box>
    </Box>
  )
}

// ── MiraStudioChat ────────────────────────────────────────────────────────────
function MiraStudioChat({ prompt, onBack }) {
  const [isLoading, setIsLoading] = useState(true)
  const [activeView, setActiveView] = useState('canvas')
  const [replyValue, setReplyValue] = useState('')
  const [cardThumbs, setCardThumbs] = useState({})   // { [publisher]: 'up'|'down' }
  const [hiddenCards, setHiddenCards] = useState({}) // { [publisher]: true }
  const [chatAddons, setChatAddons] = useState([])   // { id, status, action, card, version }
  const [version, setVersion] = useState(1)
  const chatBottomRef = useRef(null)

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 3000)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [chatAddons])

  const handleCardAction = (card, action) => {
    const newVersion = version + 1
    const id = Date.now()
    setVersion(newVersion)
    setCardThumbs(prev => ({ ...prev, [card.publisher]: action === 'exclude' ? 'down' : 'up' }))
    if (action === 'exclude') {
      setHiddenCards(prev => ({ ...prev, [card.publisher]: true }))
    }
    setChatAddons(prev => [...prev, { id, status: 'thinking', action, card, version: newVersion }])
    setTimeout(() => {
      setChatAddons(prev => prev.map(m => m.id === id ? { ...m, status: 'done' } : m))
    }, 1500)
  }

  const brandMatch = prompt.match(/for (.+)$/i)
  const brandName = brandMatch ? brandMatch[1].replace(/[\[\]]/g, '').trim() : 'your brand'

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Sticky toolbar */}
      <Box sx={{ flexShrink: 0, height: 52, display: 'flex', alignItems: 'center', px: 2, gap: 1.5, borderBottom: '1px solid #e0e0e0', bgcolor: 'background.paper', zIndex: 10 }}>
        <IconButton size="small" onClick={onBack} sx={{ color: '#212121' }}>
          <ArrowBackIcon sx={{ fontSize: 20 }} />
        </IconButton>
        <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#212121', flex: 1 }}>Search Assistant</Typography>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {[
            { key: 'thread', icon: <ViewWeekIcon sx={{ fontSize: 16 }} />, label: 'Thread' },
            { key: 'canvas', icon: <GridViewIcon sx={{ fontSize: 16 }} />, label: 'Canvas' },
          ].map(v => (
            <Button key={v.key} size="small" startIcon={v.icon} onClick={() => setActiveView(v.key)}
              variant="outlined"
              sx={{ borderRadius: 1, textTransform: 'none', fontSize: 13, fontWeight: 600, px: 1.5,
                borderColor: activeView === v.key ? 'primary.main' : '#e0e0e0',
                color: activeView === v.key ? 'primary.main' : 'text.secondary',
                bgcolor: activeView === v.key ? alpha('#1D9F9F', 0.06) : 'transparent',
              }}>
              {v.label}
            </Button>
          ))}
        </Box>
        <Button size="small" startIcon={<EditNoteIcon sx={{ fontSize: 16 }} />}
          sx={{ color: '#212121', fontWeight: 600, fontSize: 13, textTransform: 'none' }}>
          New Chat
        </Button>
        <Button size="small" startIcon={<HistoryIcon sx={{ fontSize: 16 }} />}
          sx={{ color: '#212121', fontWeight: 600, fontSize: 13, textTransform: 'none' }}>
          View History
        </Button>
      </Box>

      {/* Body */}
      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* ── Left chat panel ── */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', borderRight: '1px solid #e0e0e0', overflow: 'hidden', bgcolor: 'white' }}>

          {/* Scrollable chat content */}
          <Box sx={{ flex: 1, overflow: 'auto', px: 2.5, pt: 2.5 }}>
            <Box sx={{ display: 'flex', gap: 1.5, mb: 2.5 }}>
              <Box component="img" src="/fjord_ai.png" alt="Mira"
                sx={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#212121', mb: 0.75 }}>Mira</Typography>
                <Typography sx={{ fontSize: 14, lineHeight: '21px', color: '#212121', mb: 1.5 }}>
                  <strong>I will help you set up a search to monitor {brandName}.</strong> I'll walk you through 3 more steps. You'll review and adjust everything before applying.
                </Typography>
                <CollapsibleRow label="Steps that we'll cover">
                  <Box component="ol" sx={{ m: 0, pl: 2, mb: 0 }}>
                    {['Add Alternative Brand Names', 'Add Relevant Terms', 'Remove Noise'].map((s, i) => (
                      <Typography key={i} component="li" sx={{ fontSize: 13, lineHeight: '22px', color: '#212121' }}>{s}</Typography>
                    ))}
                  </Box>
                </CollapsibleRow>

                {isLoading ? (
                  <Box sx={{ mt: 1 }}>
                    <Typography sx={{ fontSize: 14, color: '#212121', mb: 0.75 }}>Generating search terms</Typography>
                    <ThinkingDots />
                  </Box>
                ) : (
                  <>
                    <Typography sx={{ fontSize: 14, lineHeight: '21px', color: '#212121', mb: 1.5 }}>
                      Here's a first version of your search. Let's continue refining for better results.
                    </Typography>
                    <CollapsibleRow label="Added brand name and excluded common noise">
                      <Typography sx={{ fontSize: 13, color: '#212121' }}>Added: {brandName}</Typography>
                    </CollapsibleRow>

                    {/* Version card */}
                    <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1.5, overflow: 'hidden', mb: 2 }}>
                      <Box sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 32, height: 32, borderRadius: 1.5, bgcolor: '#EEF0FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <FindInPageIcon sx={{ color: '#5C6BC0', fontSize: 18 }} />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#212121' }}>{brandName} Brand</Typography>
                          <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>Version 1</Typography>
                        </Box>
                        <Button variant="outlined" size="small"
                          sx={{ borderRadius: 1, fontSize: 12, textTransform: 'none', borderColor: 'rgba(0,0,0,0.23)', color: '#212121' }}>
                          Preview
                        </Button>
                      </Box>
                    </Box>

                    <AltNamesStep brandName={brandName} />

                    <Typography sx={{ fontSize: 14, lineHeight: '21px', color: '#212121', mb: 2.5 }}>
                      <strong>Keep what fits, remove what doesn't.</strong> You can add your own by sending me a message.
                    </Typography>
                  </>
                )}

              </Box>
            </Box>

            {/* Chat addons — separate top-level messages from card thumbs */}
            {chatAddons.map(addon => (
              <Box key={addon.id} sx={{ display: 'flex', gap: 1.5, mb: 2.5 }}>
                <Box component="img" src="/fjord_ai.png" alt="Mira"
                  sx={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#212121', mb: 0.75 }}>Mira</Typography>
                  {addon.status === 'thinking' ? (
                    <ThinkingDots />
                  ) : (
                    <>
                      {addon.action === 'exclude' ? (
                        <Typography sx={{ fontSize: 14, lineHeight: '21px', color: '#212121', mb: 1.5 }}>
                          I've updated your search to <strong>exclude similar content</strong> from {addon.card.publisher}. Posts matching topics like "{addon.card.tag}" from {addon.card.type} sources will be filtered out going forward.
                        </Typography>
                      ) : (
                        <Typography sx={{ fontSize: 14, lineHeight: '21px', color: '#212121', mb: 1.5 }}>
                          I've updated your search to <strong>include more content</strong> similar to {addon.card.publisher}. I'll prioritize "{addon.card.tag}" topics from {addon.card.type} sources.
                        </Typography>
                      )}
                      <CollapsibleRow label={addon.action === 'exclude' ? `Excluded content similar to ${addon.card.publisher}` : `Included content similar to ${addon.card.publisher}`}>
                        <Typography sx={{ fontSize: 13, color: '#212121' }}>
                          {addon.action === 'exclude' ? 'Excluded' : 'Included'}: {addon.card.tag} · {addon.card.type}
                        </Typography>
                      </CollapsibleRow>
                      <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1.5, overflow: 'hidden' }}>
                        <Box sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ width: 32, height: 32, borderRadius: 1.5, bgcolor: '#EEF0FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <FindInPageIcon sx={{ color: '#5C6BC0', fontSize: 18 }} />
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#212121' }}>{brandName} Brand</Typography>
                            <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>Version {addon.version}</Typography>
                          </Box>
                          <Button variant="outlined" size="small"
                            sx={{ borderRadius: 1, fontSize: 12, textTransform: 'none', borderColor: 'rgba(0,0,0,0.23)', color: '#212121' }}>
                            Preview
                          </Button>
                        </Box>
                      </Box>
                    </>
                  )}
                </Box>
              </Box>
            ))}
            <div ref={chatBottomRef} />
          </Box>

          {/* Sticky reply input */}
          <Box sx={{ flexShrink: 0, px: 2.5, pb: 1.5, pt: 1, borderTop: '1px solid #e0e0e0' }}>
            <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 2, display: 'flex', alignItems: 'center', px: 2, py: 1.25, gap: 1 }}>
              <Box component="input" value={replyValue} onChange={e => setReplyValue(e.target.value)}
                placeholder="Reply"
                sx={{ flex: 1, border: 'none', outline: 'none', fontSize: 14, color: '#212121', bgcolor: 'transparent', fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', '&::placeholder': { color: 'rgba(33,33,33,0.38)' } }} />
              <SendIcon sx={{ fontSize: 17, color: replyValue.trim() ? '#212121' : '#bdbdbd', cursor: replyValue.trim() ? 'pointer' : 'default' }} />
            </Box>
            <Typography sx={{ fontSize: 11, color: 'text.secondary', textAlign: 'center', mt: 0.75, lineHeight: '15px' }}>
              The AI Search Assistant can make mistakes. Please let us know when it does.{' '}
              <Box component="span" sx={{ color: 'primary.main', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                Provide feedback
              </Box>
            </Typography>
          </Box>
        </Box>

        {/* ── Canvas area (right of chat) ── */}
        {!isLoading && (
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

            {/* Sticky canvas header */}
            <Box sx={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 1.5, px: 2.5, py: 1.5, borderBottom: '1px solid #e0e0e0', bgcolor: 'background.paper', zIndex: 5 }}>
              <Box sx={{ width: 32, height: 32, borderRadius: 1.5, bgcolor: '#EEF0FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <FindInPageIcon sx={{ color: '#5C6BC0', fontSize: 18 }} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#212121' }}>{brandName} Brand Search</Typography>
                <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>Version {version}</Typography>
              </Box>
              <Button variant="contained"
                sx={{ borderRadius: 1.5, textTransform: 'none', fontSize: 13, fontWeight: 700, bgcolor: '#8B49A0', px: 3, '&:hover': { bgcolor: '#7a3d8e' } }}>
                Save
              </Button>
            </Box>

            {/* Two-column scrollable body */}
            <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

              {/* Content stream */}
              <Box sx={{ flex: 1, overflow: 'auto', borderRight: '1px solid #e0e0e0', bgcolor: 'white' }}>
                {/* Date range */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 1.5, borderBottom: '1px solid #f0f0f0' }}>
                  <CalendarMonthIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#212121' }}>Feb 12 – 19, 2026</Typography>
                </Box>

                {/* AI insight */}
                <Box sx={{ px: 2, py: 2, borderBottom: '1px solid #f0f0f0' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1 }}>
                    <AutoAwesomeIcon sx={{ fontSize: 14, color: '#7B3FA0' }} />
                    <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#7B3FA0' }}>AI-Powered Insight</Typography>
                  </Box>
                  <Typography sx={{ fontSize: 13, lineHeight: '19px', color: '#212121' }}>
                    The posts discuss various topics related to specialty coffee, brand identity, and consumer engagement. There is focus on partnerships and collaborations in the coffee industry, with mentions of single-origin sourcing, barista culture, and retail expansion.{' '}
                    <Box component="span" sx={{ color: 'primary.main', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>See more</Box>
                  </Typography>
                </Box>

                {/* Feed */}
                <Box sx={{ px: 2, pt: 1.5, pb: 0.5, borderBottom: '1px solid #f0f0f0' }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#212121' }}>100 Sample Results</Typography>
                </Box>
                {FEED_CARDS.filter(card => !hiddenCards[card.publisher]).map((card, i) => (
                  <FeedCard key={i} {...card}
                    thumbed={cardThumbs[card.publisher]}
                    onInclude={() => handleCardAction(card, 'include')}
                    onExclude={() => handleCardAction(card, 'exclude')}
                  />
                ))}
              </Box>

              {/* Analytics panel */}
              <Box sx={{ flex: 1, overflow: 'auto', px: 2.5, py: 2, bgcolor: 'white' }}>
                {/* Total mentions */}
                <Box sx={{ mb: 2.5 }}>
                  <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 0.5 }}>Total Mentions</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography sx={{ fontSize: 32, fontWeight: 700, color: '#212121', lineHeight: 1 }}>299</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                        <Typography sx={{ fontSize: 12, color: '#2e7d32', fontWeight: 600 }}>↑ 290%</Typography>
                      </Box>
                    </Box>
                    <TotalMentionsChart />
                  </Box>
                </Box>

                {/* Source Type */}
                <Box sx={{ mb: 2.5 }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#212121', mb: 0.5 }}>Source Type</Typography>
                  {SOURCE_TYPES.map((row, i) => (
                    <StatRow key={i} i={i} label={row.label} count={row.count} color={row.color} points={row.points} />
                  ))}
                </Box>

                {/* Location */}
                <Box sx={{ mb: 2.5 }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#212121', mb: 0.5 }}>Location</Typography>
                  {LOCATIONS.map((row, i) => (
                    <StatRow key={i} i={i} label={row.label} count={row.count} points={row.points} />
                  ))}
                </Box>

                {/* Language */}
                <Box sx={{ mb: 2.5 }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#212121', mb: 0.5 }}>Language</Typography>
                  {LANGUAGES.map((row, i) => (
                    <StatRow key={i} i={i} label={row.label} count={row.count} points={row.points} />
                  ))}
                </Box>

                {/* Sentiment */}
                <Box>
                  <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#212121', mb: 1 }}>Sentiment</Typography>
                  {SENTIMENTS.map((s, i) => (
                    <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
                      <Typography sx={{ fontSize: 12, color: 'text.secondary', width: 14 }}>{i + 1}</Typography>
                      <Typography sx={{ fontSize: 13, color: '#212121', width: 72 }}>{s.label}</Typography>
                      <Typography sx={{ fontSize: 12, color: '#212121', width: 36 }}>{s.pct}%</Typography>
                      <SentimentBar pct={s.pct} color={s.color} />
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        )}

        {/* Loading state for canvas */}
        {isLoading && (
          <Box sx={{ flex: 1, overflow: 'auto', bgcolor: 'white' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 3, py: 2, borderBottom: '1px solid #f0f0f0', bgcolor: 'background.paper' }}>
              <FindInPageIcon sx={{ fontSize: 24, color: '#5C6BC0', flexShrink: 0 }} />
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <SkeletonLine width="55%" height={12} />
                <SkeletonLine width="35%" height={10} />
              </Box>
              <Button variant="contained" size="small" disabled
                sx={{ borderRadius: 1, textTransform: 'none', fontSize: 13, fontWeight: 700, px: 2 }}>
                Save
              </Button>
            </Box>
            <CanvasSkeletonCard />
            <CanvasSkeletonCard />
            <CanvasSkeletonCard />
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default MiraStudioChat
