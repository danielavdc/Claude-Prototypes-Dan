import { useState } from 'react'
import {
  Box, Typography, IconButton, Divider, Avatar, Tooltip,
  Menu, MenuItem, ListItemIcon, ListItemText,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import DashboardCustomizeOutlinedIcon from '@mui/icons-material/DashboardCustomizeOutlined'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt'
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt'
import RefreshIcon from '@mui/icons-material/Refresh'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import SearchIcon from '@mui/icons-material/Search'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import HubIcon from '@mui/icons-material/Hub'
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined'
import LanguageIcon from '@mui/icons-material/Language'
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined'
import NotificationAddOutlinedIcon from '@mui/icons-material/NotificationAddOutlined'
import CreateDashboardModal from '../core/CreateDashboardModal'

function getSourceIcon(type, color) {
  if (type === 'X Spike') return <Typography sx={{ fontSize: 16, fontWeight: 900, color, lineHeight: 1 }}>{'\uD835\uDD4F'}</Typography>
  if (type === 'News Spike') return <LanguageIcon sx={{ fontSize: 20, color }} />
  if (type === 'Reddit Spike') return <ForumOutlinedIcon sx={{ fontSize: 20, color }} />
  return <LanguageIcon sx={{ fontSize: 20, color }} />
}

function InsightRow({ icon, bgColor, children }) {
  return (
    <Box sx={{ display: 'flex', gap: 1.5, mb: 2, alignItems: 'flex-start' }}>
      <Box sx={{
        width: 36, height: 36, borderRadius: '50%', bgcolor: bgColor,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        {icon}
      </Box>
      <Box sx={{ flex: 1, pt: 0.25 }}>
        {children}
      </Box>
    </Box>
  )
}

const PANEL_ARTICLES = [
  {
    avatarText: 'J',
    avatarColor: '#E91E63',
    name: 'Jess',
    handle: '@meetjess',
    platform: 'Twitter',
    platformColor: '#212121',
    location: 'CA',
    date: 'Dec 9 · 8:33 AM',
    snippet: "Tina Turner and Ike Turner's Son Ronnie Turner passes away at 62. The singer confirmed the news in a heartfelt post on social media.",
    reach: '96M',
    sentiment: 'Negative',
    sentimentColor: '#d32f2f',
  },
  {
    avatarText: 'RT',
    avatarColor: '#FF5722',
    name: 'Reuters',
    handle: '@reuters',
    platform: 'News',
    platformColor: '#00827F',
    location: 'US',
    date: 'Dec 9 · 7:15 AM',
    snippet: 'Breaking: Major developments reported across multiple sectors as analysts point to sustained growth driven by innovation and increased adoption rates.',
    reach: '89M',
    sentiment: 'Neutral',
    sentimentColor: '#757575',
  },
  {
    avatarText: 'AP',
    avatarColor: '#1565C0',
    name: 'AP News',
    handle: '@apnews',
    platform: 'News',
    platformColor: '#00827F',
    location: 'US',
    date: 'Dec 9 · 6:45 AM',
    snippet: 'Coverage continues as sources confirm widespread impact across the region, with officials urging caution and monitoring the situation closely.',
    reach: '120M',
    sentiment: 'Negative',
    sentimentColor: '#d32f2f',
  },
]

function SpikeAnalysisPanel({ spike, onClose }) {
  const [exportAnchor, setExportAnchor] = useState(null)
  const [createDashboardOpen, setCreateDashboardOpen] = useState(false)

  if (!spike) return null

  const { type, date, mentions, multiplier, color, lightBg, badgeBorder, source, topTerm, sentiment, location } = spike
  const textSx = { fontSize: 13, lineHeight: '20px', color: '#212121' }

  return (
    <Box sx={{
      position: 'fixed', top: 0, right: 0, bottom: 0, width: 420,
      bgcolor: 'white', boxShadow: '-4px 0 20px rgba(0,0,0,0.12)',
      zIndex: 9999, display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      {/* Header */}
      <Box sx={{ px: 2.5, pt: 2, pb: 0, flexShrink: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 700, color: '#212121' }}>Spike Analysis</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
            <Tooltip title="Create Spike Alert" arrow slotProps={{ popper: { sx: { zIndex: 10001 } } }}>
              <IconButton size="small">
                <NotificationAddOutlinedIcon sx={{ fontSize: 20, color: 'rgba(0,0,0,0.87)' }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Create Spike Dashboard" arrow slotProps={{ popper: { sx: { zIndex: 10001 } } }}>
              <IconButton size="small" onClick={() => setCreateDashboardOpen(true)}>
                <Box component="img" src="/Dashboard.png" alt="" sx={{ width: 20, height: 20, objectFit: 'contain', filter: 'brightness(0) opacity(0.87)' }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Export" arrow slotProps={{ popper: { sx: { zIndex: 10001 } } }}>
              <IconButton size="small" onClick={(e) => setExportAnchor(e.currentTarget)}>
                <FileDownloadOutlinedIcon sx={{ fontSize: 20, color: 'rgba(0,0,0,0.87)' }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Close" arrow slotProps={{ popper: { sx: { zIndex: 10001 } } }}>
              <IconButton size="small" onClick={onClose}>
                <CloseIcon sx={{ fontSize: 20, color: 'rgba(0,0,0,0.87)' }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Divider sx={{ mx: -2.5 }} />

        {/* Tabs */}
        <Box sx={{ display: 'flex', borderBottom: '2px solid #e0e0e0', mx: -2.5 }}>
          <Box sx={{ flex: 1, py: 1.25, bgcolor: 'rgba(0,130,127,0.12)', borderBottom: '3px solid #00827F', mb: '-2px', textAlign: 'center' }}>
            <Typography sx={{ fontSize: 14, fontWeight: 700, color: 'rgba(0,0,0,0.94)' }}>Mentions</Typography>
          </Box>
          <Box sx={{ flex: 1, py: 1.25, textAlign: 'center', cursor: 'pointer' }}>
            <Typography sx={{ fontSize: 14, color: '#757575' }}>Analytics</Typography>
          </Box>
        </Box>
      </Box>

      {/* Scrollable content */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {/* Viewing context */}
        <Box sx={{ px: 2.5, py: 1.25, bgcolor: '#ECEFF1', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
            <VisibilityOutlinedIcon sx={{ fontSize: 18, color: '#757575', flexShrink: 0 }} />
            <Typography sx={{ fontSize: 13, color: '#424242' }}>
              <strong>Viewing</strong>: {date}
            </Typography>
          </Box>
          <Box sx={{ bgcolor: '#00827F', color: 'white', fontSize: 12, fontWeight: 600, px: 1.5, py: 0.5, borderRadius: 0.5, whiteSpace: 'nowrap', cursor: 'pointer', flexShrink: 0, ml: 1 }}>
            Add Filter
          </Box>
        </Box>

        {/* Total Mentions summary */}
        <Box sx={{ px: 2.5, py: 2, display: 'flex', alignItems: 'flex-start', gap: 1 }}>
          <Box sx={{ flexShrink: 0 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#212121', mb: 0.5 }}>Total Mentions</Typography>
            <Typography sx={{ fontSize: 36, fontWeight: 800, color: '#212121', lineHeight: 1, mb: 0.75 }}>{mentions}</Typography>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, bgcolor: '#E8F5E9', borderRadius: 0.5, px: 0.75, py: 0.25 }}>
              <ArrowUpwardIcon sx={{ fontSize: 14, color: '#4CAF50' }} />
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#4CAF50' }}>{multiplier > 100 ? `${(multiplier * 100).toLocaleString()}%` : `${multiplier * 100}%`}</Typography>
            </Box>
          </Box>
          <Box sx={{ flex: 1, height: 70, position: 'relative', overflow: 'hidden' }}>
            <svg viewBox="0 0 180 70" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
              <defs>
                <linearGradient id="spikeAreaFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2196F3" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#2196F3" stopOpacity="0.02" />
                </linearGradient>
              </defs>
              <polygon points="0,60 20,58 40,55 55,52 70,50 85,48 100,45 115,40 130,35 145,25 160,15 180,5 180,70 0,70" fill="url(#spikeAreaFill)" />
              <polyline points="0,60 20,58 40,55 55,52 70,50 85,48 100,45 115,40 130,35 145,25 160,15 180,5"
                fill="none" stroke="#2196F3" strokeWidth="2" vectorEffect="non-scaling-stroke" />
              <line x1="0" y1="50" x2="180" y2="50" stroke="#9e9e9e" strokeWidth="1" strokeDasharray="4,3" vectorEffect="non-scaling-stroke" />
              <circle cx="180" cy="5" r="5" fill="#2196F3" />
            </svg>
          </Box>
        </Box>

        <Divider />

        {/* AI-Powered Insight */}
        <Box sx={{ px: 2.5, py: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1.5 }}>
            <AutoAwesomeIcon sx={{ fontSize: 14, color: '#9C4DD6' }} />
            <Typography sx={{ fontSize: 12, fontWeight: 700, background: 'linear-gradient(90deg, #9C4DD6 0%, #CF2D8A 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              AI-Powered Insight
            </Typography>
          </Box>
          <Typography sx={{ fontSize: 14, color: '#212121', lineHeight: 1.6, mb: 1.5 }}>
            The posts discuss various topics related to digital health and healthcare innovation, such as digital health standards, rural healthcare challenges, AI in healthcare, patient engagement, and remote pharmacy services. There is a focus on partnerships and collaborations in the healthcare industry, with mentions of collaborations in mental healthcare, AI-driven vocal biomarker technology, and healthcare startups
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton size="small" sx={{ p: 0.5 }}><ThumbUpOffAltIcon sx={{ fontSize: 16, color: 'text.secondary' }} /></IconButton>
            <IconButton size="small" sx={{ p: 0.5 }}><ThumbDownOffAltIcon sx={{ fontSize: 16, color: 'text.secondary' }} /></IconButton>
            <IconButton size="small" sx={{ p: 0.5 }}><RefreshIcon sx={{ fontSize: 16, color: 'text.secondary' }} /></IconButton>
            <IconButton size="small" sx={{ p: 0.5 }}><ContentCopyIcon sx={{ fontSize: 16, color: 'text.secondary' }} /></IconButton>
          </Box>
        </Box>

        <Divider />

        {/* Spike Insight Details */}
        <Box sx={{ px: 2.5, py: 2 }}>
          <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#212121', mb: 1.5, lineHeight: 1.4 }}>
            Mentions spiked {multiplier}x higher than average
          </Typography>

          {/* Spike type badge */}
          <Box sx={{
            display: 'inline-flex', border: '1px solid', borderColor: badgeBorder,
            borderRadius: 0.5, px: 1.25, py: 0.375, mb: 2.5,
          }}>
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: badgeBorder }}>{type}</Typography>
          </Box>

          {/* AI summary row */}
          <InsightRow icon={<LightbulbOutlinedIcon sx={{ fontSize: 20, color }} />} bgColor={lightBg}>
            <Typography sx={textSx}>
              Mentions were mainly driven by Reddit and Twitter with most coverage coming from the US. The Catawba Valley Medical Center and Huffpost subreddits saw a significant number of mentions totalling {mentions} over the last day.
            </Typography>
          </InsightRow>

          {/* Trend row */}
          <InsightRow icon={<TrendingUpIcon sx={{ fontSize: 20, color }} />} bgColor={lightBg}>
            <Typography sx={textSx}>
              Mentions spiked to <strong>{mentions}</strong> on {date}, compared to a baseline of <strong>1</strong> in the previous seven days.
            </Typography>
          </InsightRow>

          {/* Source row */}
          <InsightRow icon={getSourceIcon(type, color)} bgColor={lightBg}>
            <Typography sx={textSx}>
              <strong>Top Sources:</strong> {source.name} was <strong>{source.up}</strong> and Twitter was <strong>{source.up}</strong> higher than average
            </Typography>
          </InsightRow>

          {/* Terms row */}
          <InsightRow icon={<HubIcon sx={{ fontSize: 20, color }} />} bgColor={lightBg}>
            <Typography sx={textSx}>
              <strong>Top Terms</strong>: <strong>{topTerm.term}</strong> is used in <strong>17%</strong> of mentions, <strong>{topTerm.comparison}</strong>
            </Typography>
          </InsightRow>

          {/* Sentiment row */}
          <InsightRow icon={<SentimentSatisfiedAltIcon sx={{ fontSize: 20, color }} />} bgColor={lightBg}>
            <Typography sx={textSx}>
              <strong>Sentiment</strong>: <strong>{sentiment.pct}</strong> of non-neutral mentions were <strong>{sentiment.type}</strong>, <strong>{sentiment.comparison}</strong>
            </Typography>
          </InsightRow>

          {/* Location row */}
          <InsightRow icon={<LocationOnOutlinedIcon sx={{ fontSize: 20, color }} />} bgColor={lightBg}>
            <Typography sx={textSx}>
              <strong>Location</strong>: <strong>{location.count}+</strong> mentions were from <strong>{location.place}</strong>, <strong>{location.comparison}</strong>
            </Typography>
          </InsightRow>
        </Box>

        <Divider />

        {/* Article cards */}
        {PANEL_ARTICLES.map((article, i) => (
          <Box key={i} sx={{ px: 2.5, py: 2, borderBottom: '1px solid #f0f0f0' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Avatar sx={{ width: 28, height: 28, bgcolor: article.avatarColor, fontSize: 10, fontWeight: 700 }}>
                {article.avatarText}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#212121' }}>
                  {article.name} <Typography component="span" sx={{ fontSize: 12, fontWeight: 400, color: '#757575' }}>{article.handle}</Typography>
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography sx={{ fontSize: 11, fontWeight: 600, color: article.platformColor }}>{article.platform}</Typography>
                  {article.location && <Typography sx={{ fontSize: 11, color: '#9e9e9e' }}>| {article.location}</Typography>}
                  <Typography sx={{ fontSize: 11, color: '#9e9e9e' }}>| {article.date}</Typography>
                </Box>
              </Box>
            </Box>
            <Typography sx={{ fontSize: 13, color: '#424242', lineHeight: 1.6, mb: 1.5 }}>
              {article.snippet}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography sx={{ fontSize: 11, color: '#757575' }}>{article.reach} Reach</Typography>
              <Typography sx={{ fontSize: 11, color: article.sentimentColor }}>{article.sentiment}</Typography>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Export menu */}
      <Menu anchorEl={exportAnchor} open={Boolean(exportAnchor)} onClose={() => setExportAnchor(null)}
        PaperProps={{ elevation: 4, sx: { width: 200, borderRadius: 1, mt: 0.5 } }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        sx={{ zIndex: 10001 }}
      >
        <MenuItem onClick={() => setExportAnchor(null)} sx={{ height: 36, px: 2 }}>
          <ListItemIcon sx={{ minWidth: 36 }}>
            <Box component="img" src="/csv.png" alt="" sx={{ width: 20, height: 20, objectFit: 'contain' }} />
          </ListItemIcon>
          <ListItemText>
            <Typography sx={{ fontSize: 15, fontWeight: 400, color: '#212121' }}>CSV Export</Typography>
          </ListItemText>
        </MenuItem>
        <MenuItem onClick={() => setExportAnchor(null)} sx={{ height: 36, px: 2 }}>
          <ListItemIcon sx={{ minWidth: 36 }}>
            <ImageOutlinedIcon sx={{ fontSize: 20, color: '#616161' }} />
          </ListItemIcon>
          <ListItemText>
            <Typography sx={{ fontSize: 15, fontWeight: 400, color: '#212121' }}>PNG Export</Typography>
          </ListItemText>
        </MenuItem>
      </Menu>

      <CreateDashboardModal open={createDashboardOpen} onClose={() => setCreateDashboardOpen(false)} title="Create Spike Dashboard" subtext="Analyze what's driving this spike with a live dashboard built from your search." hideTemplate zIndex={10002} />
    </Box>
  )
}

export default SpikeAnalysisPanel
