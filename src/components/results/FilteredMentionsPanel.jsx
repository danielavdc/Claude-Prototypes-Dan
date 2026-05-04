import { useState } from 'react'
import { Box, Typography, IconButton, Divider, Avatar, Tooltip, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt'
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt'
import RefreshIcon from '@mui/icons-material/Refresh'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import SortIcon from '@mui/icons-material/Sort'
import SearchIcon from '@mui/icons-material/Search'

const MOCK_ARTICLES = [
  {
    avatarText: 'EW',
    avatarColor: '#1565C0',
    name: 'Epstein Web',
    handle: 'epsteinweb.bsky.social',
    platform: 'Bluesky',
    platformColor: '#0085FF',
    date: 'Apr 2, 6:21 PM',
    snippet: '#epsteinweb #efta02264314 https://epsteinweb.org Available in the iOS app store now!',
    reach: '115M',
    sentiment: 'Neutral',
    sentimentColor: '#757575',
  },
  {
    avatarText: 'JD',
    avatarColor: '#E91E63',
    name: 'Jane Doe',
    handle: '@janedoe',
    platform: 'X',
    platformColor: '#212121',
    date: 'Apr 2, 5:45 PM',
    snippet: 'Interesting developments in the market today. The data shows a significant shift in consumer behavior patterns across multiple regions.',
    reach: '2.4M',
    sentiment: 'Positive',
    sentimentColor: '#4CAF50',
  },
  {
    avatarText: 'RT',
    avatarColor: '#FF5722',
    name: 'Reuters Tech',
    handle: '@reuterstech',
    platform: 'News article',
    platformColor: '#00827F',
    location: 'US',
    date: 'Apr 2, 4:30 PM',
    snippet: 'New report highlights emerging trends in the sector, with analysts pointing to sustained growth driven by innovation and increased adoption.',
    reach: '89M',
    sentiment: 'Positive',
    sentimentColor: '#4CAF50',
  },
]

function FilteredMentionsPanel({ filter, onClose }) {
  const [exportAnchor, setExportAnchor] = useState(null)

  if (!filter) return null

  const { type, label, value } = filter
  const viewingLabel = type === 'date' ? `Date: ${label}` : label

  return (
    <Box sx={{
      position: 'fixed', top: 0, right: 0, bottom: 0, width: 420,
      bgcolor: 'white', boxShadow: '-4px 0 20px rgba(0,0,0,0.12)',
      zIndex: 9999, display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      {/* Header */}
      <Box sx={{ px: 2.5, pt: 2, pb: 0, flexShrink: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 700, color: '#212121' }}>Filtered Mentions</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
            <Tooltip title="Export" arrow slotProps={{ popper: { sx: { zIndex: 10001 } } }}><IconButton size="small" onClick={(e) => setExportAnchor(e.currentTarget)}><FileDownloadOutlinedIcon sx={{ fontSize: 20, color: 'rgba(0,0,0,0.87)' }} /></IconButton></Tooltip>
            <Tooltip title="Close" arrow slotProps={{ popper: { sx: { zIndex: 10001 } } }}><IconButton size="small" onClick={onClose}><CloseIcon sx={{ fontSize: 20, color: 'rgba(0,0,0,0.87)' }} /></IconButton></Tooltip>
          </Box>
        </Box>

        <Divider sx={{ mx: -2.5 }} />

        {/* Tabs */}
        <Box sx={{ display: 'flex', borderBottom: '2px solid #e0e0e0', mb: 0, mx: -2.5 }}>
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
            <Typography sx={{ fontSize: 13, color: '#424242', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              <strong>Viewing:</strong> {label}
            </Typography>
          </Box>
          <Box sx={{ bgcolor: '#00827F', color: 'white', fontSize: 12, fontWeight: 600, px: 1.5, py: 0.5, borderRadius: 0.5, whiteSpace: 'nowrap', cursor: 'pointer', flexShrink: 0, ml: 1 }}>
            Add a filter
          </Box>
        </Box>

        {/* Total Mentions summary */}
        <Box sx={{ px: 2.5, py: 2, display: 'flex', alignItems: 'flex-start', gap: 1 }}>
          <Box sx={{ flexShrink: 0 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#212121', mb: 0.5 }}>Total Mentions</Typography>
            <Typography sx={{ fontSize: 36, fontWeight: 800, color: '#212121', lineHeight: 1, mb: 0.75 }}>111K</Typography>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, bgcolor: '#FFEBEE', borderRadius: 0.5, px: 0.75, py: 0.25 }}>
              <ArrowDownwardIcon sx={{ fontSize: 14, color: '#EF5350' }} />
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#EF5350' }}>11.6%</Typography>
            </Box>
          </Box>
          <Box sx={{ flex: 1, height: 70, position: 'relative', overflow: 'hidden' }}>
            <svg viewBox="0 0 180 70" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
              <defs>
                <linearGradient id="panelAreaFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2196F3" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#2196F3" stopOpacity="0.02" />
                </linearGradient>
              </defs>
              <polygon points="0,55 20,50 40,42 55,45 70,38 85,30 100,28 115,32 130,25 145,22 160,28 180,20 180,70 0,70" fill="url(#panelAreaFill)" />
              <polyline points="0,55 20,50 40,42 55,45 70,38 85,30 100,28 115,32 130,25 145,22 160,28 180,20"
                fill="none" stroke="#2196F3" strokeWidth="2" vectorEffect="non-scaling-stroke" />
              <line x1="0" y1="48" x2="180" y2="30" stroke="#9e9e9e" strokeWidth="1" strokeDasharray="4,3" vectorEffect="non-scaling-stroke" />
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
          <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#212121', mb: 1, lineHeight: 1.4 }}>
            Widespread Promotion of {label} on Bluesky Platform
          </Typography>
          <Box component="ul" sx={{ m: 0, pl: 2, mb: 1.5 }}>
            <Typography component="li" sx={{ fontSize: 13, color: '#424242', lineHeight: 1.6, mb: 0.75 }}>
              All high-engagement documents uniformly promote the content, emphasizing availability with consistent hashtags and website links.
            </Typography>
            <Typography component="li" sx={{ fontSize: 13, color: '#424242', lineHeight: 1.6 }}>
              Posts consistently feature image filenames starting with identifiers followed by numeric codes, reinforcing cohesive visual branding across multiple posts.
            </Typography>
          </Box>
          <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#00827F', cursor: 'pointer', mb: 1.5, '&:hover': { textDecoration: 'underline' } }}>
            Show More
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton size="small" sx={{ p: 0.5 }}><ThumbUpOffAltIcon sx={{ fontSize: 16, color: 'text.secondary' }} /></IconButton>
            <IconButton size="small" sx={{ p: 0.5 }}><ThumbDownOffAltIcon sx={{ fontSize: 16, color: 'text.secondary' }} /></IconButton>
            <IconButton size="small" sx={{ p: 0.5 }}><RefreshIcon sx={{ fontSize: 16, color: 'text.secondary' }} /></IconButton>
            <IconButton size="small" sx={{ p: 0.5 }}><ContentCopyIcon sx={{ fontSize: 16, color: 'text.secondary' }} /></IconButton>
          </Box>
        </Box>


        <Divider />

        {/* Results header */}
        <Box sx={{ px: 2.5, py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#212121' }}>111.3k results</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography sx={{ fontSize: 12, color: '#757575' }}>Sort by:</Typography>
              <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#212121' }}>Date</Typography>
            </Box>
            <IconButton size="small" sx={{ p: 0.25 }}><ArrowUpwardIcon sx={{ fontSize: 16, color: '#757575' }} /></IconButton>
            <IconButton size="small" sx={{ p: 0.25 }}><SearchIcon sx={{ fontSize: 16, color: '#757575' }} /></IconButton>
          </Box>
        </Box>

        <Divider />

        {/* Article cards */}
        {MOCK_ARTICLES.map((article, i) => (
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
    </Box>
  )
}

export default FilteredMentionsPanel
