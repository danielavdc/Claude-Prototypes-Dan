import { useState } from 'react'
import { Box, Typography, IconButton, Avatar, Tooltip, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import HubIcon from '@mui/icons-material/Hub'
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import DashboardCustomizeOutlinedIcon from '@mui/icons-material/DashboardCustomizeOutlined'
import LanguageIcon from '@mui/icons-material/Language'
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined'
import NotificationAddOutlinedIcon from '@mui/icons-material/NotificationAddOutlined'
import CreateDashboardModal from '../core/CreateDashboardModal'

const SPIKE_CONFIGS = {
  28: {
    type: 'Mentions Spike',
    date: 'Aug 26',
    mentions: '50.2k',
    multiplier: 50,
    color: '#757575',
    lightBg: '#f5f5f5',
    badgeBorder: '#9e9e9e',
    source: { name: 'Twitter', up: '44x', avg: 155, total: 224 },
    topTerm: { term: '#Eames', count: 150, comparison: '10% higher than average' },
    sentiment: { pct: '77%', type: 'negative', comparison: '50% higher than average' },
    location: { count: '57k', place: 'Indonesia', comparison: '10% higher than average' },
    article: {
      avatarText: 'FN',
      avatarColor: '#003580',
      name: 'Fox News',
      handle: '@foxnews',
      platform: 'Twitter',
      platformColor: '#1DA1F2',
      location: 'US',
      date: 'Dec 9 \u2022 10:33pm',
      snippet: "Tina Turner\u2019s son, Ronnie Turner, dead at 62, singer confirms: \u2018You left the world far too early\u2019 and something else happened to ma\u2026",
      reach: '96M',
      duplicates: 278,
      sentiment: 'Negative',
      sentimentColor: '#d32f2f',
    },
  },
  71: {
    type: 'X Spike',
    date: 'Aug 29',
    mentions: '55k',
    multiplier: 299,
    color: '#1565C0',
    lightBg: 'rgba(21,101,192,0.08)',
    badgeBorder: '#1565C0',
    source: { name: 'Twitter', up: '10x', avg: 155, total: 224 },
    topTerm: { term: '#Eames', count: 150, comparison: '5x higher than average' },
    sentiment: { pct: '77%', type: 'negative', comparison: '2x higher than average' },
    location: { count: '57k', place: 'Indonesia', comparison: '10x higher than average' },
    article: {
      avatarText: 'FN',
      avatarColor: '#003580',
      name: 'Fox News',
      handle: '@foxnews',
      platform: 'Twitter',
      platformColor: '#1565C0',
      location: 'US',
      date: 'Dec 9 \u2022 10:33pm',
      snippet: "Tina Turner\u2019s son, Ronnie Turner, dead at 62, singer confirms: \u2018You left the world far too early\u2019 and something else happened to ma\u2026",
      reach: '96M',
      duplicates: 278,
      sentiment: 'Negative',
      sentimentColor: '#d32f2f',
    },
  },
  80: {
    type: 'News Spike',
    date: 'Aug 30',
    mentions: '42.1k',
    multiplier: 42,
    color: '#00827F',
    lightBg: 'rgba(0,130,127,0.08)',
    badgeBorder: '#00827F',
    source: { name: 'News', up: '44x', avg: 155, total: 224 },
    topTerm: { term: '#Eames', count: 150, comparison: '10% higher than average' },
    sentiment: { pct: '77%', type: 'negative', comparison: '50% higher than average' },
    location: { count: '57k', place: 'Indonesia', comparison: '10% higher than average' },
    article: {
      avatarText: 'T',
      avatarColor: '#000',
      name: 'Times',
      author: 'Lauren Thomas',
      platform: 'News',
      platformColor: '#00827F',
      location: 'US',
      date: 'Oct 31 \u2022 10:33pm',
      headline: "\u2018A constant in my life\u2019: World Mourns Queen Elizabeth II",
      snippet: 'The Queen came to the throne in 1952 and witnessed enormous social change. Her son King Charles III said\u2026',
      hasImage: true,
      imageColor: '#e0d5c9',
      reach: '96M',
      duplicates: 3,
      sentiment: 'Neutral',
      sentimentColor: '#757575',
    },
  },
  103: {
    type: 'Reddit Spike',
    date: 'Aug 31',
    mentions: '45.3k',
    multiplier: 45,
    color: '#FF5722',
    lightBg: 'rgba(255,87,34,0.08)',
    badgeBorder: '#FF5722',
    source: { name: 'Reddit', up: '44x', avg: 155, total: 224 },
    topTerm: { term: '#Eames', count: 150, comparison: '10% higher than average' },
    sentiment: { pct: '77%', type: 'negative', comparison: '50% higher than average' },
    location: { count: '57k', place: 'Indonesia', comparison: '10% higher than average' },
    article: {
      avatarText: '\uD83C\uDFAE',
      avatarColor: '#FF5722',
      name: 'r/gaming',
      handle: '_Iroha',
      platform: 'Reddit',
      platformColor: '#FF5722',
      location: 'US',
      date: 'Nov 21 \u2022 10:33pm',
      snippet: 'When it comes to NPC companions in video games, this right here is the peak of the mountain. Atreus from God of War and Elizabeth from Bioshock Infinite',
      reach: '96M',
      duplicates: 3,
      sentiment: 'Negative',
      sentimentColor: '#d32f2f',
    },
  },
}

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
        width: 40, height: 40, borderRadius: '50%', bgcolor: bgColor,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        {icon}
      </Box>
      <Box sx={{ flex: 1, pt: 0.5 }}>
        {children}
      </Box>
    </Box>
  )
}

function SpikePopover({ spikeIndex, onClose, onDashboardSave, onDataPointClick, onViewMoreInsights }) {
  const [createDashboardOpen, setCreateDashboardOpen] = useState(false)
  const [exportAnchor, setExportAnchor] = useState(null)
  const spike = SPIKE_CONFIGS[spikeIndex]
  if (!spike) return null

  const { type, date, mentions, multiplier, color, lightBg, badgeBorder, source, topTerm, sentiment, location, article } = spike
  const textSx = { fontSize: 14, lineHeight: '22px', color: '#212121' }

  return (
    <Box sx={{
      position: 'absolute', top: 0, left: 0, bottom: 0, width: 420,
      bgcolor: 'white', borderRadius: 1, boxShadow: '0px 4px 20px rgba(0,0,0,0.15)',
      zIndex: 10, display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      {/* Header */}
      <Box sx={{ px: 2.5, pt: 2, pb: 0.5, flexShrink: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography sx={{ fontSize: 14, color: '#616161' }}>
            {mentions} Mentions &middot; {date}
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.25 }}>
            <Tooltip title="Create Spike Alert" arrow><IconButton size="small"><NotificationAddOutlinedIcon sx={{ fontSize: 20, color: 'rgba(0,0,0,0.87)' }} /></IconButton></Tooltip>
            <Tooltip title="Create Spike Dashboard" arrow><IconButton size="small" onClick={() => setCreateDashboardOpen(true)}><Box component="img" src="/Dashboard.png" alt="" sx={{ width: 20, height: 20, objectFit: 'contain', filter: 'brightness(0) opacity(0.87)' }} /></IconButton></Tooltip>
            <Tooltip title="Export" arrow><IconButton size="small" onClick={(e) => setExportAnchor(e.currentTarget)}><FileDownloadOutlinedIcon sx={{ fontSize: 20, color: 'rgba(0,0,0,0.87)' }} /></IconButton></Tooltip>
            <Tooltip title="Close" arrow><IconButton size="small" onClick={onClose}><CloseIcon sx={{ fontSize: 20, color: 'rgba(0,0,0,0.87)' }} /></IconButton></Tooltip>
          </Box>
        </Box>
        <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#212121', mb: 1.5, lineHeight: 1.4 }}>
          Mentions spiked {multiplier}x higher than average
        </Typography>
      </Box>

      {/* Scrollable content */}
      <Box sx={{ flex: 1, overflow: 'auto', px: 2.5, pb: 2.5 }}>
        {/* Spike type badge */}
        <Box sx={{
          display: 'inline-flex', border: '1px solid', borderColor: badgeBorder,
          borderRadius: 0.5, px: 1.25, py: 0.375, mb: 2.5,
        }}>
          <Typography sx={{ fontSize: 13, fontWeight: 600, color: badgeBorder }}>{type}</Typography>
        </Box>

        {/* Trend row */}
        <InsightRow icon={<TrendingUpIcon sx={{ fontSize: 20, color }} />} bgColor={lightBg}>
          <Typography sx={textSx}>
            Mentions spiked to <strong>{mentions}</strong> on {date}, compared to a daily average of <strong>1</strong> in the previous period.
          </Typography>
        </InsightRow>

        {/* Source row */}
        <InsightRow icon={getSourceIcon(type, color)} bgColor={lightBg}>
          <Typography sx={textSx}>
            <strong>Top Source Types: {source.name}</strong> was up <strong>{source.up}</strong> from an average of <strong>{source.avg}</strong> mentions to <strong>{source.total}</strong>.
          </Typography>
        </InsightRow>

        {/* Terms row */}
        <InsightRow icon={<HubIcon sx={{ fontSize: 20, color }} />} bgColor={lightBg}>
          <Typography sx={textSx}>
            <strong>Top Terms</strong>: <strong>{topTerm.term}</strong> appeared in <strong>{topTerm.count}</strong> mentions, <strong>{topTerm.comparison}</strong>.
          </Typography>
        </InsightRow>

        {/* Sentiment row */}
        <InsightRow icon={<SentimentSatisfiedAltIcon sx={{ fontSize: 20, color }} />} bgColor={lightBg}>
          <Typography sx={textSx}>
            <strong>Sentiment</strong>: <strong>{sentiment.pct}</strong> of non-neutral mentions were <strong>{sentiment.type}</strong>, <strong>{sentiment.comparison}</strong>.
          </Typography>
        </InsightRow>

        {/* Location row */}
        <InsightRow icon={<LocationOnOutlinedIcon sx={{ fontSize: 20, color }} />} bgColor={lightBg}>
          <Typography sx={textSx}>
            <strong>Top Location</strong>: <strong>{location.count}</strong> mentions were from <strong>{location.place}</strong>, <strong>{location.comparison}</strong>.
          </Typography>
        </InsightRow>

        {/* Content row */}
        <InsightRow icon={<DescriptionOutlinedIcon sx={{ fontSize: 20, color }} />} bgColor={lightBg}>
          <Typography sx={textSx}>
            The following content had the highest reach for this spike:
          </Typography>
        </InsightRow>

        {/* Article card */}
        {article && (
          <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 2, mb: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: article.avatarColor, fontSize: 12, fontWeight: 700 }}>
                {article.avatarText}
              </Avatar>
              <Box>
                <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#212121' }}>
                  {article.name}{' '}
                  {article.handle && <Typography component="span" sx={{ fontSize: 13, fontWeight: 400, color: '#616161' }}>{article.handle}</Typography>}
                  {article.author && <Typography component="span" sx={{ fontSize: 13, fontWeight: 400 }}> &middot; {article.author}</Typography>}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography sx={{ fontSize: 12, fontWeight: 600, color: article.platformColor }}>{article.platform}</Typography>
                  <Typography sx={{ fontSize: 12, color: '#9e9e9e' }}>| {article.location} | {article.date}</Typography>
                </Box>
              </Box>
            </Box>

            {article.headline ? (
              <Box sx={{ display: 'flex', gap: 1.5, mb: 1 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#212121', lineHeight: '22px', mb: 0.5 }}>
                    {article.headline}
                  </Typography>
                  <Typography sx={{
                    fontSize: 13, color: '#424242', lineHeight: '20px',
                    display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>
                    {article.snippet}
                  </Typography>
                </Box>
                {article.hasImage && (
                  <Box sx={{ width: 64, height: 80, borderRadius: 0.5, bgcolor: article.imageColor, flexShrink: 0 }} />
                )}
              </Box>
            ) : (
              <Typography sx={{
                fontSize: 13, color: '#424242', lineHeight: '20px', mb: 1.5,
                display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
              }}>
                {article.snippet}
              </Typography>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1.5 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Typography sx={{ fontSize: 12, color: '#616161' }}>{article.reach} Reach</Typography>
                <Typography sx={{ fontSize: 12, color: '#616161' }}>{article.duplicates} Duplicates</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography sx={{ fontSize: 12, color: article.sentimentColor }}>{article.sentiment}</Typography>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', border: '1.5px solid', borderColor: article.sentimentColor }} />
              </Box>
            </Box>
          </Box>
        )}

      </Box>

      {/* Sticky footer */}
      <Box sx={{ flexShrink: 0, borderTop: '1px solid #e0e0e0', px: 2.5, py: 1.5, bgcolor: 'white' }}>
        <Typography onClick={() => { if (onViewMoreInsights) onViewMoreInsights(spike); onClose() }} sx={{ fontSize: 14, fontWeight: 700, color: '#00827F', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
          View more insights
        </Typography>
      </Box>

      <CreateDashboardModal open={createDashboardOpen} onClose={() => setCreateDashboardOpen(false)} title="Create Spike Dashboard" subtext="Analyze what's driving this spike with a live dashboard built from your search." hideTemplate onSave={(dashName) => {
        if (onDashboardSave) onDashboardSave({ name: dashName, message: <>Your new Spike Dashboard &ldquo;{dashName}&rdquo; is ready.</> })
      }} />

      {/* Export dropdown menu */}
      <Menu anchorEl={exportAnchor} open={Boolean(exportAnchor)} onClose={() => setExportAnchor(null)}
        PaperProps={{ elevation: 4, sx: { width: 200, borderRadius: 1, mt: 0.5 } }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
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
    </Box>
  )
}

export default SpikePopover
