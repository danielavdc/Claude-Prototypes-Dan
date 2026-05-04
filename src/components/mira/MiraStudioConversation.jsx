import { useState } from 'react'
import { Box, Typography, Button, IconButton } from '@mui/material'
import { alpha } from '@mui/material/styles'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ViewWeekIcon from '@mui/icons-material/ViewWeek'
import CropSquareIcon from '@mui/icons-material/CropSquare'
import AddIcon from '@mui/icons-material/Add'
import HistoryIcon from '@mui/icons-material/History'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt'
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import RefreshIcon from '@mui/icons-material/Refresh'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import ShareIcon from '@mui/icons-material/Share'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'

// ── Avatars ───────────────────────────────────────────────────────────────────
function MiraAvatar({ size = 28 }) {
  return (
    <Box component="img" src="/fjord_ai.png" alt="Mira"
      sx={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
    />
  )
}

function UserAvatar({ size = 28 }) {
  return (
    <Box sx={{ width: size, height: size, borderRadius: '50%', bgcolor: '#7C4DFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'white' }}>AO</Typography>
    </Box>
  )
}

// ── Spike chart ───────────────────────────────────────────────────────────────
function SpikeChart() {
  const points = [2,2,2,2,2,2,2,2,2,2,2,2,2,3,4,3,20,8,3,2,2,2,2]
  const w = 260, h = 72
  const min = 0, max = 22
  const norm = points.map(p => h - ((p - min) / (max - min)) * (h - 8) - 4)
  const d = norm.map((y, i) => `${i === 0 ? 'M' : 'L'} ${(i / (points.length - 1)) * w} ${y}`).join(' ')
  const area = d + ` L ${w} ${h} L 0 ${h} Z`
  const peakIdx = 16
  const peakX = (peakIdx / (points.length - 1)) * w
  const peakY = norm[peakIdx]
  return (
    <svg width={w} height={h} style={{ display: 'block' }}>
      <defs>
        <linearGradient id="convAreaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#42a5f5" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#42a5f5" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#convAreaGrad)" />
      <path d={d} fill="none" stroke="#42a5f5" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={peakX} cy={peakY} r={4} fill="#42a5f5" />
    </svg>
  )
}

// ── Source row ────────────────────────────────────────────────────────────────
const SOURCE_COLORS = { TikTok: '#212121', Instagram: '#E1306C', 'X/Twitter': '#1DA1F2', News: '#42a5f5', Blogs: '#9E9E9E', Bluesky: '#0085FF' }
const SOURCES = [
  { name: 'TikTok', pct: 50, mentions: '134M' },
  { name: 'Instagram', pct: 30, mentions: '134M' },
  { name: 'X/Twitter', pct: 20, mentions: '134k' },
  { name: 'News', pct: 10, mentions: '134k' },
  { name: 'Blogs', pct: 1, mentions: '134k' },
  { name: 'Bluesky', pct: 1, mentions: '134k' },
]

function SourceRow({ i, name, pct, mentions }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', py: 0.75, borderBottom: i < SOURCES.length - 1 ? '1px solid #f5f5f5' : 'none', gap: 1 }}>
      <Typography sx={{ fontSize: 12, color: 'text.secondary', width: 16, flexShrink: 0 }}>{i + 1}</Typography>
      <Box sx={{ width: 18, height: 18, borderRadius: '50%', bgcolor: '#f0f0f0', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography sx={{ fontSize: 9, fontWeight: 700, color: '#555' }}>{name[0]}</Typography>
      </Box>
      <Typography sx={{ flex: 1, fontSize: 13, color: '#212121' }}>{name}</Typography>
      <Typography sx={{ fontSize: 12, color: 'text.secondary', mr: 0.5 }}>{pct}%</Typography>
      <Box sx={{ width: 56, height: 6, borderRadius: 1, bgcolor: '#f0f0f0', overflow: 'hidden', mr: 1 }}>
        <Box sx={{ width: `${pct}%`, height: '100%', bgcolor: SOURCE_COLORS[name] || '#42a5f5', borderRadius: 1 }} />
      </Box>
      <Typography sx={{ fontSize: 12, color: 'text.secondary', width: 38, textAlign: 'right' }}>{mentions}</Typography>
    </Box>
  )
}

// ── Recommendations ───────────────────────────────────────────────────────────
const RECOMMENDATIONS = [
  { action: 'Build Rapid Licensing Capability', rationale: 'Pre-negotiate terms and legal frameworks for fast creator partnerships.' },
  { action: 'Audit Generational Brand Positioning', rationale: 'Review product names for generational fit. "Diet" vs. "Zero Sugar" shows strongly shape perception.' },
  { action: 'Establish Viral Content Monitoring', rationale: 'Real-time social listening to identify brand-relevant viral moments within 24-48 hours of emergence.' },
  { action: 'Allocate Creator Acquisition Budget', rationale: 'Treat UGC licensing as a discrete budget line within traditional agency creative.' },
]

// ── ChatPanel ─────────────────────────────────────────────────────────────────
function ChatPanel() {
  const [inputValue, setInputValue] = useState('')
  const [suggestOpen, setSuggestOpen] = useState(false)

  return (
    <Box sx={{ width: 370, flexShrink: 0, borderRight: '1px solid #e0e0e0', display: 'flex', flexDirection: 'column', height: '100%', bgcolor: 'background.paper' }}>
      <Box sx={{ flex: 1, overflow: 'auto', px: 2, py: 2.5, display: 'flex', flexDirection: 'column', gap: 2.5 }}>

        {/* User message */}
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
          <UserAvatar />
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#212121' }}>Angelica</Typography>
              <IconButton size="small" sx={{ p: 0.25, color: 'text.secondary' }}><StarBorderIcon sx={{ fontSize: 14 }} /></IconButton>
            </Box>
            <Typography sx={{ fontSize: 14, color: '#212121', lineHeight: '20px' }}>
              Create an Executive Ready Report based on{' '}
              <Box component="span" sx={{ fontWeight: 700 }}>Dr Pepper Baby Campaign</Box>
            </Typography>
          </Box>
        </Box>

        {/* Mira message 1 */}
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
          <MiraAvatar />
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#212121', mb: 0.5 }}>Mira</Typography>
            <Typography sx={{ fontSize: 14, color: '#212121', lineHeight: '20px', mb: 1.5 }}>
              We received your request to generate an Executive-ready report.
            </Typography>
            {/* Card */}
            <Box sx={{ border: '1px solid rgba(33,33,33,0.15)', borderRadius: 1.5, overflow: 'hidden' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 1.5, py: 1 }}>
                <Box sx={{ width: 28, height: 28, borderRadius: 0.75, bgcolor: '#EEF0FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Box sx={{ width: 14, height: 10, bgcolor: '#5C6BC0', borderRadius: 0.25 }} />
                </Box>
                <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#212121', flex: 1, lineHeight: '18px' }}>Dr Pepper x TikTok Creator Campaign</Typography>
              </Box>
              <Box sx={{ display: 'flex', borderTop: '1px solid rgba(33,33,33,0.1)' }}>
                <Box sx={{ flex: 1, py: 0.75, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, borderRight: '1px solid rgba(33,33,33,0.1)', cursor: 'pointer', '&:hover': { bgcolor: alpha('#000', 0.03) } }}>
                  <Typography sx={{ fontSize: 12, color: '#212121' }}>Details</Typography>
                  <KeyboardArrowDownIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                </Box>
                <Box sx={{ flex: 1, py: 0.75, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', '&:hover': { bgcolor: alpha('#000', 0.03) } }}>
                  <Typography sx={{ fontSize: 12, color: '#212121' }}>Close Canvas</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Mira message 2 */}
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
          <MiraAvatar />
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#212121', mb: 0.5 }}>Mira</Typography>
            <Typography sx={{ fontSize: 14, color: '#212121', lineHeight: '20px', mb: 1.5 }}>
              Your report is ready. Please let me know if there are any adjustments you would like to make.
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.25, mb: 1.25 }}>
              <IconButton size="small" sx={{ p: 0.5, color: 'text.secondary' }}><ThumbUpOffAltIcon sx={{ fontSize: 16 }} /></IconButton>
              <IconButton size="small" sx={{ p: 0.5, color: 'text.secondary' }}><ThumbDownOffAltIcon sx={{ fontSize: 16 }} /></IconButton>
              <IconButton size="small" sx={{ p: 0.5, color: 'text.secondary' }}><ContentCopyIcon sx={{ fontSize: 16 }} /></IconButton>
            </Box>
            <Box onClick={() => setSuggestOpen(o => !o)} sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }}>
              <AutoAwesomeIcon sx={{ fontSize: 14, color: '#9C4DD6' }} />
              <Typography sx={{ fontSize: 13, color: '#9C4DD6', fontWeight: 500 }}>Suggested follow-ups</Typography>
              <KeyboardArrowDownIcon sx={{ fontSize: 16, color: '#9C4DD6', transform: suggestOpen ? 'none' : 'rotate(-90deg)', transition: 'transform 0.2s' }} />
            </Box>
          </Box>
        </Box>

      </Box>

      {/* Input */}
      <Box sx={{ borderTop: '1px solid #e0e0e0', p: 1.5 }}>
        <Box sx={{ border: '1px solid rgba(33,33,33,0.23)', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 1, px: 1.5, py: 0.75 }}>
          <Box component="input" value={inputValue} onChange={e => setInputValue(e.target.value)}
            placeholder="Ask a follow-up..."
            sx={{ flex: 1, border: 'none', outline: 'none', fontSize: 14, color: '#212121', bgcolor: 'transparent', fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', '&::placeholder': { color: 'rgba(33,33,33,0.38)' } }}
          />
          <Box sx={{ width: 28, height: 28, borderRadius: '50%', bgcolor: inputValue.trim() ? 'primary.main' : '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background-color 0.2s', flexShrink: 0 }}>
            <ArrowUpwardIcon sx={{ fontSize: 16, color: 'white' }} />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

// ── CanvasPanel ───────────────────────────────────────────────────────────────
function CanvasPanel() {
  return (
    <Box sx={{ flex: 1, overflow: 'auto', bgcolor: '#f5f5f5', p: 3 }}>
      <Box sx={{ maxWidth: 820, mx: 'auto' }}>

        {/* Report header */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}>
          <Box>
            <Typography sx={{ fontSize: 24, fontWeight: 700, color: '#212121', lineHeight: 1.3, mb: 0.5 }}>
              Dr Pepper x TikTok Creator Campaign
            </Typography>
            <Typography sx={{ fontSize: 13, color: 'text.secondary', mb: 0.75 }}>UGC used for Commercial Ad</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <CalendarTodayIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>January 22–30, 2026</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0, mt: 0.5 }}>
            <IconButton size="small" sx={{ color: 'text.secondary' }}><RefreshIcon sx={{ fontSize: 18 }} /></IconButton>
            <IconButton size="small" sx={{ color: 'text.secondary' }}><FileDownloadOutlinedIcon sx={{ fontSize: 18 }} /></IconButton>
            <IconButton size="small" sx={{ color: 'text.secondary' }}><ShareIcon sx={{ fontSize: 18 }} /></IconButton>
            <IconButton size="small" sx={{ color: 'text.secondary' }}><BookmarkBorderIcon sx={{ fontSize: 18 }} /></IconButton>
            <Button variant="contained" size="small"
              sx={{ ml: 1, fontWeight: 700, fontSize: 13, textTransform: 'none', borderRadius: 1.5, bgcolor: '#1D9F9F', '&:hover': { bgcolor: '#1a8f8f' } }}>
              Save as Dashboard
            </Button>
          </Box>
        </Box>

        {/* Executive Overview */}
        <Box sx={{ bgcolor: 'background.paper', border: '1px solid rgba(33,33,33,0.1)', borderRadius: 2, p: 3, mb: 2 }}>
          <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#212121', mb: 1.5 }}>Executive Overview</Typography>
          <Typography sx={{ fontSize: 14, color: '#212121', lineHeight: '22px', mb: 1.5 }}>
            Dr Pepper turned a <Box component="span" sx={{ fontWeight: 700 }}>viral TikTok jingle</Box> by @romeo.show into a{' '}
            <Box component="span" sx={{ fontWeight: 700 }}>national commercial</Box> aired during the College Football Playoff. Discovered and licensed directly from social, the campaign proved its impact through organic engagement.
          </Typography>
          <Typography sx={{ fontSize: 14, color: '#212121', lineHeight: '22px' }}>
            This moment reflects a broader industry shift:{' '}
            <Box component="span" sx={{ fontWeight: 700 }}>creators are setting the cultural agenda</Box>, validating content in real time, and commanding significant brand investment.
          </Typography>
        </Box>

        {/* Stats row */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          {[
            { label: 'Total Reach', sub: 'Across all platforms', value: '847M' },
            { label: 'Engagement', sub: '8.2% Engagement Rate', value: '2.4M' },
            { label: 'Earned Media Value', sub: '7.4x ROI creator fee', value: '$14.7M' },
          ].map(stat => (
            <Box key={stat.label} sx={{ flex: 1, bgcolor: 'background.paper', border: '1px solid rgba(33,33,33,0.1)', borderRadius: 2, p: 2.5 }}>
              <Typography sx={{ fontSize: 13, color: 'text.secondary', mb: 0.25 }}>{stat.label}</Typography>
              <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 1.5 }}>{stat.sub}</Typography>
              <Typography sx={{ fontSize: 30, fontWeight: 700, color: '#212121', lineHeight: 1 }}>{stat.value}</Typography>
            </Box>
          ))}
        </Box>

        {/* Key Learnings */}
        <Box sx={{ bgcolor: 'background.paper', border: '1px solid rgba(33,33,33,0.1)', borderRadius: 2, p: 3, mb: 2 }}>
          <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#212121', mb: 2 }}>Key Learnings</Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#5C6BC0', letterSpacing: 0.5, textTransform: 'uppercase', mb: 1.5 }}>Generational Preferences</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box>
                  <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#212121', mb: 0.25 }}>Shift in Aesthetic:</Typography>
                  <Typography sx={{ fontSize: 13, color: '#212121', lineHeight: '18px' }}>The jingle's raw, low-production value stood out for its authenticity proving audiences connect more with relatable, personality-driven content over polished ads.</Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#212121', mb: 0.25 }}>Authenticity Drives Engagement:</Typography>
                  <Typography sx={{ fontSize: 13, color: '#212121', lineHeight: '18px' }}>Consumers value creative honesty over slick execution, especially on platforms like TikTok.</Typography>
                </Box>
              </Box>
            </Box>
            <Box sx={{ width: 1, bgcolor: '#e0e0e0', flexShrink: 0 }} />
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#9C27B0', letterSpacing: 0.5, textTransform: 'uppercase', mb: 1.5 }}>Cultural Shift</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box>
                  <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#212121', mb: 0.25 }}>New Marketing Blueprint:</Typography>
                  <Typography sx={{ fontSize: 13, color: '#212121', lineHeight: '18px' }}>Brands follow viral internet moments rather than lead with traditional top-down campaigns.</Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#212121', mb: 0.25 }}>Community-Led Creativity:</Typography>
                  <Typography sx={{ fontSize: 13, color: '#212121', lineHeight: '18px' }}>Social media audiences acted as a real-time focus group, validating the jingle's appeal and prompting brand adoption.</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Media Intelligence */}
        <Box sx={{ bgcolor: 'background.paper', border: '1px solid rgba(33,33,33,0.1)', borderRadius: 2, p: 3, mb: 2 }}>
          <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#212121', mb: 2 }}>Media Intelligence</Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#212121', mb: 1.5 }}>Mentions Trend</Typography>
              <Box sx={{ bgcolor: alpha('#42a5f5', 0.07), borderRadius: 1.5, p: 1.5, mb: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#42a5f5' }} />
                  <Typography sx={{ fontSize: 11, color: '#42a5f5', fontWeight: 700, letterSpacing: 0.3 }}>SPIKE DETECTED</Typography>
                </Box>
                <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#212121' }}>299x above baseline</Typography>
              </Box>
              <SpikeChart />
              <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
                {[
                  'Mentions spiked to 275 on Jan 8, driven by the airing of the Dr Pepper commercial during the College Football Playoff.',
                  'Coverage was driven by reactions to the ad\'s TikTok origins, creator @romeo.show\'s involvement.',
                  'Implication: Campaigns that originate from viral creator content can generate media spikes rivaling traditional tentpole ads.',
                ].map((text, i) => (
                  <Box key={i} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                    <Box sx={{ width: 16, height: 16, borderRadius: 0.5, bgcolor: '#f0f0f0', flexShrink: 0, mt: 0.1 }} />
                    <Typography sx={{ fontSize: 12, color: '#212121', lineHeight: '17px' }}>{text}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#212121', mb: 1.5 }}>Coverage by Source Type</Typography>
              <Box sx={{ display: 'flex', mb: 0.75, pl: 4 }}>
                <Typography sx={{ flex: 1, fontSize: 11, color: 'text.secondary' }}>Source Type</Typography>
                <Typography sx={{ fontSize: 11, color: 'text.secondary', mr: 1, width: 60 }}>Percentage</Typography>
                <Typography sx={{ fontSize: 11, color: 'text.secondary', width: 38, textAlign: 'right' }}>Mentions</Typography>
              </Box>
              {SOURCES.map((src, i) => <SourceRow key={src.name} i={i} {...src} />)}
            </Box>
          </Box>
        </Box>

        {/* Strategic Recommendations */}
        <Box sx={{ bgcolor: 'background.paper', border: '1px solid rgba(33,33,33,0.1)', borderRadius: 2, p: 3 }}>
          <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#212121', mb: 2 }}>Strategic Recommendations</Typography>
          <Box sx={{ display: 'flex', px: 1, mb: 0.5 }}>
            <Typography sx={{ width: 64, fontSize: 12, color: 'text.secondary' }}>Priority</Typography>
            <Typography sx={{ flex: 1, fontSize: 12, color: 'text.secondary' }}>Action</Typography>
            <Typography sx={{ flex: 2, fontSize: 12, color: 'text.secondary' }}>Rationale</Typography>
          </Box>
          {RECOMMENDATIONS.map((r, i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', px: 1, py: 1.5, borderTop: '1px solid #f0f0f0' }}>
              <Box sx={{ width: 64, flexShrink: 0 }}>
                <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#212121' }}>{i + 1}</Typography>
                </Box>
              </Box>
              <Typography sx={{ flex: 1, fontSize: 13, fontWeight: 600, color: '#212121', lineHeight: '18px', pr: 2 }}>{r.action}</Typography>
              <Typography sx={{ flex: 2, fontSize: 13, color: '#212121', lineHeight: '18px' }}>{r.rationale}</Typography>
            </Box>
          ))}
        </Box>

      </Box>
    </Box>
  )
}

// ── MiraStudioConversation ────────────────────────────────────────────────────
function MiraStudioConversation({ onBack }) {
  const [activeMode, setActiveMode] = useState('canvas')

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Top toolbar */}
      <Box sx={{ height: 48, flexShrink: 0, display: 'flex', alignItems: 'center', px: 2, borderBottom: '1px solid #e0e0e0', bgcolor: 'background.paper', gap: 1 }}>
        <IconButton size="small" onClick={onBack} sx={{ color: '#212121', mr: 0.5 }}>
          <ArrowBackIcon sx={{ fontSize: 20 }} />
        </IconButton>
        <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#212121', flex: 1 }}>
          Dr Pepper x TikTok Creator Campaign
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {[
            { key: 'thread', icon: <ViewWeekIcon sx={{ fontSize: 15 }} />, label: 'Thread' },
            { key: 'canvas', icon: <CropSquareIcon sx={{ fontSize: 15 }} />, label: 'Canvas' },
            { key: 'new', icon: <AddIcon sx={{ fontSize: 15 }} />, label: 'New Chat' },
            { key: 'history', icon: <HistoryIcon sx={{ fontSize: 15 }} />, label: 'View History' },
          ].map(m => (
            <Button key={m.key} size="small" startIcon={m.icon}
              onClick={() => setActiveMode(m.key)}
              variant={activeMode === m.key ? 'contained' : 'outlined'}
              sx={{
                fontSize: 13, fontWeight: 500, textTransform: 'none', borderRadius: 1.5, px: 1.5, height: 32,
                ...(activeMode === m.key
                  ? { bgcolor: '#1D9F9F', color: 'white', borderColor: '#1D9F9F', '&:hover': { bgcolor: '#1a8f8f' } }
                  : { color: '#212121', borderColor: 'rgba(33,33,33,0.23)', '&:hover': { bgcolor: alpha('#000', 0.04) } })
              }}>
              {m.label}
            </Button>
          ))}
        </Box>
      </Box>

      {/* Split pane */}
      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <ChatPanel />
        <CanvasPanel />
      </Box>
    </Box>
  )
}

export default MiraStudioConversation
