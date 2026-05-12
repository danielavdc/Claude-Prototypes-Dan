import { useState, useRef, useCallback, useEffect } from 'react'
import { Box, Typography, Paper, Divider, IconButton, Button, Avatar, Chip, Skeleton, CircularProgress, Tooltip, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import TuneIcon from '@mui/icons-material/Tune'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import FilterListIcon from '@mui/icons-material/FilterList'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import SearchIcon from '@mui/icons-material/Search'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import TranslateIcon from '@mui/icons-material/Translate'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import LabelOutlinedIcon from '@mui/icons-material/LabelOutlined'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import NotificationAddOutlinedIcon from '@mui/icons-material/NotificationAddOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt'
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import MentionsTrendChart from './MentionsTrendChart'
import TopicClustersChart from './TopicClustersChart'
import TopKeywordsChart from './TopKeywordsChart'
import LocationsChart from './LocationsChart'
import SentimentChart from './SentimentChart'
import { formatMentions } from '../../utils/queryGenerators'
import { BASE_DATA_SUM, FAKE_ARTICLES } from '../../constants/mockData'
import { TABS } from '../../constants/messages'
import ExportDocumentsModal from '../core/ExportDocumentsModal'
import WidgetMenu from './WidgetMenu'
import FilteredMentionsPanel from './FilteredMentionsPanel'
import SpikeAnalysisPanel from './SpikeAnalysisPanel'
import MediaContactsPanel from './MediaContactsPanel'
import CoverageTabContent, { LocationsContent, NewsCoverageContent } from './tabs/CoverageTabContent'
import NarrativeTabContent from './tabs/NarrativeTabContent'
import SentimentTabContent from './tabs/SentimentTabContent'
import AudienceTabContent from './tabs/AudienceTabContent'
import OverviewTabContent from './tabs/OverviewTabContent'
import VisualAnalysisTabContent from './tabs/VisualAnalysisTabContent'
import SocialMediaInsightsTabContent from './tabs/SocialMediaInsightsTabContent'
import EngagementTabContent from './tabs/EngagementTabContent'

function ResultsView({ query, brandName, loading, resultCount = 107, onDashboardSave, onWidgetInsight, activeTab, activeTabLabel, navigateToTab, targetSubTab, subTabTrigger }) {
  const [exportModalOpen, setExportModalOpen] = useState(false)
  const [leftWidth, setLeftWidth] = useState(520)
  const [isDragging, setIsDragging] = useState(false)
  const [filteredMentions, setFilteredMentions] = useState(null)
  const [cardMenuAnchor, setCardMenuAnchor] = useState(null)
  const [headerMenuAnchor, setHeaderMenuAnchor] = useState(null)
  const [spikeAnalysis, setSpikeAnalysis] = useState(null)
  const containerRef = useRef(null)
  const rightPanelRef = useRef(null)
  const totalMentions = Math.round(BASE_DATA_SUM * resultCount / 107)

  useEffect(() => {
    rightPanelRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [activeTab, subTabTrigger])

  const handleMouseDown = useCallback((e) => {
    e.preventDefault()
    setIsDragging(true)
    const startX = e.clientX
    const startWidth = leftWidth

    const onMouseMove = (e) => {
      const containerLeft = containerRef.current?.getBoundingClientRect().left || 0
      const containerWidth = containerRef.current?.offsetWidth || 1000
      const newWidth = startWidth + (e.clientX - startX)
      const minW = 300
      const maxW = containerWidth - 350
      setLeftWidth(Math.max(minW, Math.min(maxW, newWidth)))
    }

    const onMouseUp = () => {
      setIsDragging(false)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }, [leftWidth])

  return (
    <Box ref={containerRef} sx={{ width: '100%', display: 'flex', height: '100%', overflow: 'hidden' }}>

      {/* Left: article list */}
      <Box sx={{ width: leftWidth, minWidth: 300, flexShrink: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid #e0e0e0', borderTop: 'none', borderRadius: '0 0 4px 4px' }}>

        {/* Sticky header */}
        <Box sx={{ flexShrink: 0, bgcolor: 'white', borderBottom: '1px solid #e0e0e0', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', px: 1.5, py: 1.25, gap: 1 }}>
            <Box sx={{ width: 20, height: 20, border: '1.5px solid #757575', borderRadius: 0.5, flexShrink: 0 }} />
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#212121', flex: 1, ml: 0.5 }}>
              {loading ? '—' : `${formatMentions(totalMentions)} results`}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Tooltip title="AI-Powered Features" arrow><IconButton size="small"><AutoFixHighIcon sx={{ fontSize: 20, color: 'rgba(0,0,0,0.87)' }} /></IconButton></Tooltip>
              <Tooltip title="Export Documents" arrow><IconButton size="small" onClick={() => setExportModalOpen(true)}><FileDownloadOutlinedIcon sx={{ fontSize: 20, color: 'rgba(0,0,0,0.87)' }} /></IconButton></Tooltip>
              <Tooltip title="Display Options" arrow><IconButton size="small"><TuneIcon sx={{ fontSize: 20, color: 'rgba(0,0,0,0.87)' }} /></IconButton></Tooltip>
              <Tooltip title="More Options" arrow><IconButton size="small" onClick={(e) => setHeaderMenuAnchor(e.currentTarget)}><MoreVertIcon sx={{ fontSize: 20, color: 'rgba(0,0,0,0.87)' }} /></IconButton></Tooltip>
            </Box>
          </Box>
          <Divider />
          <Box sx={{ display: 'flex', alignItems: 'center', px: 1.5, py: 0.75 }}>
            <FilterListIcon sx={{ fontSize: 18, color: 'rgba(0,0,0,0.87)', mr: 0.75 }} />
            <Typography sx={{ fontSize: 14, color: '#757575', mr: 0.5 }}>Sort by:</Typography>
            <Button size="small" endIcon={<ArrowDropDownIcon sx={{ fontSize: 16 }} />}
              sx={{ fontSize: 14, fontWeight: 700, color: '#212121', textTransform: 'none', minWidth: 0, px: 0.5 }}>
              Date
            </Button>
            <IconButton size="small" sx={{ p: 0.5 }}><ArrowUpwardIcon sx={{ fontSize: 18, color: 'rgba(0,0,0,0.87)' }} /></IconButton>
            <IconButton size="small" sx={{ p: 0.5 }}><ArrowDownwardIcon sx={{ fontSize: 18, color: 'rgba(0,0,0,0.87)' }} /></IconButton>
            <Box sx={{ flex: 1 }} />
            <IconButton size="small"><SearchIcon sx={{ fontSize: 20, color: 'rgba(0,0,0,0.87)' }} /></IconButton>
          </Box>
        </Box>

        {/* Scrollable article list */}
        <Box sx={{ flex: 1, overflow: 'auto', bgcolor: 'white' }}>
          {loading
            ? [0,1,2].map((i, idx, arr) => (
              <Box key={i}>
                <Box sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', gap: 1.5, mb: 1.5 }}>
                    <Skeleton variant="circular" width={40} height={40} sx={{ flexShrink: 0 }} />
                    <Box sx={{ flex: 1 }}>
                      <Skeleton variant="text" width={160} height={16} />
                      <Skeleton variant="text" width={120} height={13} />
                    </Box>
                  </Box>
                  <Skeleton variant="text" width="100%" height={15} />
                  <Skeleton variant="text" width="90%" height={15} />
                  <Skeleton variant="text" width="70%" height={15} sx={{ mb: 1.5 }} />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Skeleton variant="rectangular" width={90} height={26} sx={{ borderRadius: 0.5 }} />
                    <Skeleton variant="rectangular" width={80} height={26} sx={{ borderRadius: 0.5 }} />
                  </Box>
                </Box>
                {idx < arr.length - 1 && <Divider />}
              </Box>
            ))
            : FAKE_ARTICLES.map((a, i) => (
              <Box key={i}>
                <Box sx={{ p: 2, position: 'relative', '&:hover': { bgcolor: 'rgba(0,0,0,0.01)' }, '&:hover .card-hover-icons': { opacity: 1 } }}>
                  {/* Hover icons */}
                  <Box className="card-hover-icons" sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 0, opacity: 0, transition: 'opacity 0.15s ease', bgcolor: 'white', borderRadius: 0.5, boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>
                    {[
                      { icon: <TranslateIcon sx={{ fontSize: 18 }} />, tip: 'Translate to "User Language"' },
                      { icon: <OpenInNewIcon sx={{ fontSize: 18 }} />, tip: 'Open in new tab' },
                      { icon: <LabelOutlinedIcon sx={{ fontSize: 18 }} />, tip: 'Tag' },
                      { icon: <VisibilityOffOutlinedIcon sx={{ fontSize: 18 }} />, tip: 'Hide' },
                    ].map((item, idx) => (
                      <Tooltip key={idx} title={item.tip} arrow>
                        <IconButton size="small" sx={{ p: 0.5, color: 'rgba(0,0,0,0.87)' }}>{item.icon}</IconButton>
                      </Tooltip>
                    ))}
                    <Tooltip title="More" arrow>
                      <IconButton size="small" onClick={(e) => setCardMenuAnchor(e.currentTarget)} sx={{ p: 0.5, color: 'rgba(0,0,0,0.87)' }}>
                        <MoreVertIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 1.5 }}>
                    <Box sx={{ position: 'relative', flexShrink: 0 }}>
                      <Avatar sx={{ width: 40, height: 40, bgcolor: a.avatarColor, fontSize: 14, fontWeight: 700 }}>{a.initials}</Avatar>
                      <Box sx={{ position: 'absolute', bottom: -2, right: -2, width: 16, height: 16, borderRadius: '50%', bgcolor: '#212121', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid white' }}>
                        <Typography sx={{ fontSize: 9, color: 'white', fontWeight: 700, lineHeight: 1 }}>N</Typography>
                      </Box>
                    </Box>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#212121' }}>{a.author}</Typography>
                        <Typography sx={{ fontSize: 13, color: '#9e9e9e' }}>{a.handle}</Typography>
                      </Box>
                      <Typography sx={{ fontSize: 12, color: '#9e9e9e' }}>{a.platform} | {a.location} | {a.time}</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                    <Typography sx={{ flex: 1, fontSize: 14, lineHeight: '22px', color: '#212121', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {a.snippet}
                    </Typography>
                    {a.hasImage && (
                      <Box sx={{ width: 72, height: 72, borderRadius: 1, bgcolor: a.imageColor, flexShrink: 0 }} />
                    )}
                  </Box>

                  <Typography sx={{ fontSize: 12, color: '#9e9e9e', mb: 1 }}>{brandName || 'Brand'}</Typography>

                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip icon={<Box component="span" sx={{ fontSize: 12, ml: 0.5 }}>◎</Box>} label={`${a.reach} Reach`} size="small" variant="outlined"
                      sx={{ height: 26, fontSize: 12, borderColor: '#e0e0e0', color: '#616161', borderRadius: 0.5 }} />
                    <Chip label={`${a.sentiment} ▾`} size="small" variant="outlined"
                      sx={{ height: 26, fontSize: 12, borderColor: '#e0e0e0', color: '#616161', borderRadius: 0.5 }} />
                  </Box>
                </Box>
                {i < FAKE_ARTICLES.length - 1 && <Divider />}
              </Box>
            ))
          }
        </Box>
      </Box>

      {/* Resize handle */}
      <Box
        onMouseDown={handleMouseDown}
        sx={{
          width: 8,
          flexShrink: 0,
          cursor: 'col-resize',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mx: 0.5,
          borderRadius: 1,
          transition: isDragging ? 'none' : 'background-color 0.15s ease',
          bgcolor: isDragging ? 'rgba(0,0,0,0.08)' : 'transparent',
          '&:hover': { bgcolor: 'rgba(0,0,0,0.08)' },
          '&:hover .resize-dots': { opacity: 1 },
        }}
      >
        <Box
          className="resize-dots"
          sx={{
            width: 4,
            height: 32,
            borderRadius: 1,
            bgcolor: '#bdbdbd',
            opacity: isDragging ? 1 : 0,
            transition: 'opacity 0.15s ease',
          }}
        />
      </Box>

      {/* Right: AI Insight + chart */}
      <Box ref={rightPanelRef} sx={{ flex: 1, minWidth: 350, display: 'flex', flexDirection: 'column', gap: 1.5, overflow: 'auto', pt: 0, pb: 2, position: 'relative' }}>
        {/* Filtered mentions overlay panel */}
        <FilteredMentionsPanel filter={filteredMentions} onClose={() => setFilteredMentions(null)} />
        <SpikeAnalysisPanel spike={spikeAnalysis} onClose={() => setSpikeAnalysis(null)} />
        {activeTabLabel === 'Social Media Insights' ? (
          <SocialMediaInsightsTabContent loading={loading} />
        ) : activeTabLabel === 'Visual Analysis' ? (
          <VisualAnalysisTabContent loading={loading} />
        ) : activeTabLabel === 'Locations' ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, pt: 1 }}><LocationsContent /></Box>
        ) : activeTabLabel === 'News Coverage' ? (
          <NewsCoverageContent />
        ) : activeTabLabel === 'X Insight' ? (
          <SocialMediaInsightsTabContent loading={loading} />
        ) : activeTabLabel === 'Authors' ? (
          <AudienceTabContent loading={loading} targetSubTab={targetSubTab} subTabTrigger={subTabTrigger} />
        ) : activeTab === 5 ? (
          <MediaContactsPanel onDashboardSave={onDashboardSave} />
        ) : activeTab === 1 ? (
          <CoverageTabContent loading={loading} onDashboardSave={onDashboardSave} targetSubTab={targetSubTab} subTabTrigger={subTabTrigger} />
        ) : activeTab === 2 ? (
          <NarrativeTabContent loading={loading} />
        ) : activeTab === 3 ? (
          <EngagementTabContent loading={loading} />
        ) : activeTab === 4 ? (
          <SentimentTabContent loading={loading} />
        ) : (<>
        {/* AI Insight card */}
        <Box sx={{ p: '1.5px', borderRadius: 2, background: 'linear-gradient(135deg, #9C4DD6 0%, #CF2D8A 40%, #1D9F9F 100%)', mt: 2 }}>
          <Box sx={{ bgcolor: 'background.paper', borderRadius: '6px', p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <AutoAwesomeIcon sx={{ fontSize: 16, color: '#9C4DD6' }} />
                <Typography sx={{ fontSize: 13, fontWeight: 700, background: 'linear-gradient(90deg, #9C4DD6 0%, #CF2D8A 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  AI-Powered Insight
                </Typography>
              </Box>
              <WidgetMenu onDashboardSave={onDashboardSave} showRegenerate />
            </Box>
            {loading ? (
              <Box>
                <Skeleton variant="text" width="70%" height={18} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="100%" height={14} />
                <Skeleton variant="text" width="90%" height={14} />
                <Skeleton variant="text" width="80%" height={14} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="100%" height={14} />
                <Skeleton variant="text" width="85%" height={14} />
              </Box>
            ) : (
              <>
                <Typography sx={{ fontSize: 15, fontWeight: 700, lineHeight: '22px', color: '#212121', mb: 1 }}>
                  {brandName ? `${brandName}'s Rising Popularity and Local Impact` : 'Rising Popularity and Local Impact'}
                </Typography>
                <Box component="ul" sx={{ m: 0, pl: 2.5, mb: 2 }}>
                  {[
                    `${brandName || 'The brand'} commands a strong local following with high engagement and busy locations, particularly in the Inner Sunset area, replacing former Starbucks sites and attracting steady foot traffic. 1, 2, 3, 4`,
                    'The coffee shop is recognized for roasting its own micro-sourced, fair trade beans and focusing on light roasts popular in modern specialty coffee, appealing to customers seeking distinctive flavors. 5, 6, 7',
                    'Despite its popularity, some perceive it as pricey and less cozy compared to established local competitors, with mixed opinions on ambiance and a preference by some for other coffee shops nearby. 8, 9, 10…',
                  ].map((text, i) => (
                    <Typography key={i} component="li" sx={{ fontSize: 14, lineHeight: '22px', color: '#212121', mb: 1 }}>{text}</Typography>
                  ))}
                </Box>
                <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#1D9F9F', cursor: 'pointer', mb: 1.5, '&:hover': { textDecoration: 'underline' } }}>
                  View More Insights
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <IconButton size="small" sx={{ p: 0.5 }}><ThumbUpOffAltIcon sx={{ fontSize: 18, color: 'text.secondary' }} /></IconButton>
                  <IconButton size="small" sx={{ p: 0.5 }}><ThumbDownOffAltIcon sx={{ fontSize: 18, color: 'text.secondary' }} /></IconButton>
                  <IconButton size="small" sx={{ p: 0.5 }}><ContentCopyIcon sx={{ fontSize: 18, color: 'text.secondary' }} /></IconButton>
                </Box>
              </>
            )}
          </Box>
        </Box>
        {!loading && (
          <OverviewTabContent
            loading={loading}
            onDashboardSave={onDashboardSave}
            onWidgetInsight={onWidgetInsight}
            onFilteredMentions={(filter) => { setFilteredMentions(filter); setSpikeAnalysis(null) }}
            onSpikeAnalysis={(spike) => { setSpikeAnalysis(spike); setFilteredMentions(null) }}
            navigateToTab={navigateToTab}
          />
        )}
        </>)}
      </Box>

      <ExportDocumentsModal open={exportModalOpen} onClose={() => setExportModalOpen(false)} />

      {/* Header overflow menu */}
      <Menu anchorEl={headerMenuAnchor} open={Boolean(headerMenuAnchor)} onClose={() => setHeaderMenuAnchor(null)}
        PaperProps={{ elevation: 4, sx: { width: 220, borderRadius: 1, mt: 0.5 } }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => setHeaderMenuAnchor(null)} sx={{ height: 36, px: 2 }}>
          <ListItemIcon sx={{ minWidth: 36 }}><Box component="img" src="/add-monitor.png" alt="" sx={{ width: 20, height: 20, objectFit: 'contain' }} /></ListItemIcon>
          <ListItemText><Typography sx={{ fontSize: 15, color: '#212121' }}>Add Stream to Monitor</Typography></ListItemText>
        </MenuItem>
        <MenuItem onClick={() => setHeaderMenuAnchor(null)} sx={{ height: 36, px: 2 }}>
          <ListItemIcon sx={{ minWidth: 36 }}><VisibilityOutlinedIcon sx={{ fontSize: 20, color: '#616161' }} /></ListItemIcon>
          <ListItemText><Typography sx={{ fontSize: 15, color: '#212121' }}>Show Hidden Results</Typography></ListItemText>
        </MenuItem>
      </Menu>

      {/* Card overflow menu */}
      <Menu anchorEl={cardMenuAnchor} open={Boolean(cardMenuAnchor)} onClose={() => setCardMenuAnchor(null)}
        PaperProps={{ elevation: 4, sx: { width: 220, borderRadius: 1, mt: 0.5 } }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => setCardMenuAnchor(null)} sx={{ height: 36, px: 2 }}>
          <ListItemIcon sx={{ minWidth: 36 }}><MailOutlineIcon sx={{ fontSize: 20, color: '#616161' }} /></ListItemIcon>
          <ListItemText><Typography sx={{ fontSize: 15, color: '#212121' }}>Share</Typography></ListItemText>
        </MenuItem>
        <MenuItem onClick={() => setCardMenuAnchor(null)} sx={{ height: 36, px: 2 }}>
          <ListItemIcon sx={{ minWidth: 36 }}><NotificationAddOutlinedIcon sx={{ fontSize: 20, color: '#616161' }} /></ListItemIcon>
          <ListItemText><Typography sx={{ fontSize: 15, color: '#212121' }}>Create alert</Typography></ListItemText>
        </MenuItem>
        <MenuItem onClick={() => setCardMenuAnchor(null)} sx={{ height: 36, px: 2 }}>
          <ListItemIcon sx={{ minWidth: 36 }}><Typography sx={{ fontSize: 16, fontWeight: 900, color: '#616161', lineHeight: 1 }}>{'\uD835\uDD4F'}</Typography></ListItemIcon>
          <ListItemText><Typography sx={{ fontSize: 15, color: '#212121' }}>Post to X</Typography></ListItemText>
        </MenuItem>
        <MenuItem onClick={() => setCardMenuAnchor(null)} sx={{ height: 36, px: 2 }}>
          <ListItemIcon sx={{ minWidth: 36 }}><Box component="span" sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: '#0077B5', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Typography sx={{ fontSize: 11, fontWeight: 700, color: 'white', lineHeight: 1 }}>in</Typography></Box></ListItemIcon>
          <ListItemText><Typography sx={{ fontSize: 15, color: '#212121' }}>Post to LinkedIn</Typography></ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => setCardMenuAnchor(null)} sx={{ height: 36, px: 2 }}>
          <ListItemIcon sx={{ minWidth: 36 }}><VisibilityOffOutlinedIcon sx={{ fontSize: 20, color: '#616161' }} /></ListItemIcon>
          <ListItemText><Typography sx={{ fontSize: 15, color: '#212121' }}>Hide</Typography></ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default ResultsView
