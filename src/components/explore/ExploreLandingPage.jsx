import { useState } from 'react'
import { Box, Typography, Button, Paper, InputBase, IconButton, Divider } from '@mui/material'
import { alpha } from '@mui/material/styles'
import SearchIcon from '@mui/icons-material/Search'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import CreateMenu from './CreateMenu'

const RECENT_SEARCHES = [
  { name: 'EV Industry Search', type: 'Combined Search', query: '("electric vehicle" OR "EV" OR "BEV" OR "PHEV") AND ("market" OR "industry" OR "growth" OR "sales" OR "adoption") NOT "hybrid"' },
  { name: 'Tesla Search', type: 'Compare Search', query: '"Tesla" OR "TSLA" OR "Elon Musk" AND ("electric vehicle" OR "EV" OR "Model S" OR "Model 3" OR "Model X" OR "Model Y")' },
  { name: 'Rivian Search', type: 'Standard Search', query: '"Rivian" OR "RIVN" AND ("electric truck" OR "R1T" OR "R1S" OR "delivery van" OR "Amazon")' },
  { name: 'Microsoft Global', type: 'Optimized Search', query: '"Microsoft" OR "MSFT" AND ("cloud" OR "Azure" OR "AI" OR "Copilot" OR "Office 365" OR "Teams")' },
  { name: 'Gaming & Xbox Ecosystem', type: 'Optimized Search', query: '"Xbox" OR "Microsoft Gaming" AND ("Game Pass" OR "console" OR "Activision" OR "Blizzard" OR "gaming")' },
  { name: 'Empower Every Voice Campaign', type: 'Standard Search', query: '"Empower Every Voice" OR ("diversity" AND "inclusion" AND "campaign") AND ("equity" OR "representation")' },
]

const RECOMMENDATIONS = [
  {
    icon: <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: alpha('#9C4DD6', 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center' }}><SearchIcon sx={{ fontSize: 18, color: '#9C4DD6' }} /></Box>,
    title: 'Search Suggestion: Consumer Electronics Show 2026',
    body: 'Electronics Show is trending. Here\'s a search to keep you on top of the buzz.',
    action: 'Preview Search',
  },
  {
    icon: <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: alpha('#F59E0B', 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center' }}><WarningAmberIcon sx={{ fontSize: 18, color: '#F59E0B' }} /></Box>,
    title: 'Crisis Watch',
    body: <>High-risk content detected: <Box component="span" sx={{ color: '#B627A1', fontWeight: 600 }}>Rumors about Azure</Box> outages are spreading on Twitter with elevated engagement.</>,
    action: 'Create Alert',
  },
  {
    icon: <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: alpha('#10B981', 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center' }}><TrendingUpIcon sx={{ fontSize: 18, color: '#10B981' }} /></Box>,
    title: 'Emerging Topics',
    body: <><Box component="span" sx={{ color: '#B627A1', fontWeight: 600 }}>Quantum security</Box> are emerging themes linked to your tracked keywords with high growth potential.</>,
    action: 'Explore Topic',
  },
]

const AI_BULLETS = [
  { label: 'EV Industry Search', text: 'Global EV growth is losing momentum as key markets brace for a broader correction in demand—though long-term electrification trends remain intact.', sources: ['source1.com', 'source 2.com'] },
  { label: 'Tesla Search', text: 'Tesla delivered a strong quarter thanks to a push ahead of U.S. tax-credit expiration, but analysts warn the boost may be temporary amid Europe weakness.', sources: ['source1.com', 'source 2.com'] },
  { label: 'Rivian Search', text: 'Rivian announced layoffs of ~600 employees as it narrows full-year delivery guidance, spotlighting pressures in the premium EV segment.', sources: ['source1.com'] },
]

function SearchDocIcon() {
  return (
    <Box sx={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="#5C6BC0" strokeWidth="1.5" fill="none"/>
        <path d="M14 2V8H20" stroke="#5C6BC0" strokeWidth="1.5" fill="none"/>
        <path d="M16 13H8M16 17H8M10 9H8" stroke="#5C6BC0" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="15" cy="15" r="3" stroke="#5C6BC0" strokeWidth="1.5" fill="none"/>
        <path d="M17.5 17.5L19 19" stroke="#5C6BC0" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    </Box>
  )
}

export default function ExploreLandingPage({ onNavigate, onOpenSearch, onCreateSearch }) {
  const [chatInput, setChatInput] = useState('')
  const [createAnchor, setCreateAnchor] = useState(null)

  return (
    <Box sx={{ flex: 1, overflow: 'auto', bgcolor: '#f5f5f5' }}>

      {/* White top section */}
      <Box sx={{ bgcolor: 'background.paper', borderBottom: '1px solid #e0e0e0' }}>
      <Box sx={{ maxWidth: 1500, mx: 'auto', px: 3, pt: 3, pb: 3 }}>

      {/* Page header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography sx={{ fontSize: 28, fontWeight: 700, color: '#212121', lineHeight: 1.2 }}>Explore the World's Media</Typography>
          <Typography sx={{ fontSize: 14, color: '#616161', mt: 0.5 }}>Insights beyond monitoring. Deeper data, smarter segmentation, and global scale.</Typography>
        </Box>
        <Button variant="contained" endIcon={<ArrowDropDownIcon />}
          onClick={(e) => setCreateAnchor(e.currentTarget)}
          sx={{ bgcolor: '#B627A1', color: 'white', fontWeight: 700, fontSize: 14, height: 40, borderRadius: 0.5, px: 2.5, flexShrink: 0, '&:hover': { bgcolor: '#9C1F8A' } }}>
          Create
        </Button>
        <CreateMenu anchorEl={createAnchor} onClose={() => setCreateAnchor(null)} onSelect={(key) => onCreateSearch?.(key)} />
      </Box>

      {/* Feature cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 1 }}>
        <Paper elevation={0} onClick={() => onNavigate?.('searches-list')} sx={{ px: 2, height: 60, borderRadius: 1.5, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 1.5, border: '1px solid #e0e0e0', '&:hover': { border: '1px solid #1D9F9F', boxShadow: 'none' } }}>
          <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: alpha('#F59E0B', 0.12), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <SearchIcon sx={{ fontSize: 20, color: '#F59E0B' }} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#212121', lineHeight: 1.3 }}>Searches & Filters</Typography>
            <Typography sx={{ fontSize: 12, color: '#616161', lineHeight: 1.3 }}>Manage Your Searches and Filters</Typography>
          </Box>
        </Paper>
        <Paper elevation={0} onClick={() => onNavigate?.('compare')} sx={{ px: 2, height: 60, borderRadius: 1.5, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 1.5, border: '1px solid #e0e0e0', '&:hover': { border: '1px solid #1D9F9F', boxShadow: 'none' } }}>
          <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: alpha('#5C6BC0', 0.12), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Box component="img" src="/compare.png" alt="" sx={{ width: 20, height: 20, objectFit: 'contain' }} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#212121', lineHeight: 1.3 }}>Compare</Typography>
            <Typography sx={{ fontSize: 12, color: '#616161', lineHeight: 1.3 }}>Benchmark Search Performance</Typography>
          </Box>
        </Paper>
      </Box>
      </Box>{/* end inner max-width */}
      </Box>{/* end white top section */}

      {/* Rest of content */}
      <Box sx={{ p: 3 }}>
      <Box sx={{ maxWidth: 1500, mx: 'auto' }}>

      {/* Recent Searches */}
      <Paper elevation={1} sx={{ borderRadius: 1, mb: 2, overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2.5, py: 2, borderBottom: '1px solid #f0f0f0' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#212121' }}>Recent Searches</Typography>
            <InfoOutlinedIcon sx={{ fontSize: 16, color: '#9e9e9e' }} />
            <Typography onClick={() => onNavigate?.('searches-list')} sx={{ fontSize: 14, color: '#1D9F9F', fontWeight: 600, cursor: 'pointer', ml: 0.5 }}>View All Items</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #e0e0e0', borderRadius: 5, px: 1.5, py: 0.5, gap: 1, width: 200 }}>
            <SearchIcon sx={{ fontSize: 16, color: '#9e9e9e' }} />
            <InputBase placeholder="Find Searches" sx={{ fontSize: 13, flex: 1 }} />
          </Box>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0 }}>
          {RECENT_SEARCHES.map((s, i) => (
            <Box key={i} onClick={() => onOpenSearch?.(s.query)} sx={{
              display: 'flex', alignItems: 'center', gap: 1.5, px: 2.5, py: 1.75, cursor: 'pointer',
              borderRight: i % 3 !== 2 ? '1px solid #f0f0f0' : 'none',
              borderBottom: i < 3 ? '1px solid #f0f0f0' : 'none',
              '&:hover': { bgcolor: alpha('#000', 0.03) }
            }}>
              <SearchDocIcon />
              <Box>
                <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#212121' }}>{s.name}</Typography>
                <Typography sx={{ fontSize: 12, color: '#9e9e9e' }}>{s.type} · 1 hour ago</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Paper>

      {/* Bottom two-column section */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>

        {/* AI-Powered Insights */}
        <Paper elevation={1} sx={{ borderRadius: 1, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2.5, pt: 2, pb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#212121' }}>AI-Powered Insights</Typography>
              <InfoOutlinedIcon sx={{ fontSize: 16, color: '#9e9e9e' }} />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <IconButton size="small"><EditOutlinedIcon sx={{ fontSize: 18, color: '#616161' }} /></IconButton>
              <IconButton size="small"><MoreVertIcon sx={{ fontSize: 18, color: '#616161' }} /></IconButton>
            </Box>
          </Box>
          <Typography sx={{ fontSize: 12, color: '#9e9e9e', px: 2.5, pb: 1.5 }}>Last 7 days</Typography>

          <Box sx={{ flex: 1, px: 2.5, pb: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {AI_BULLETS.map((b, i) => (
              <Box key={i} component="li" sx={{ listStyle: 'disc', ml: 2, fontSize: 14, color: '#212121', lineHeight: '22px' }}>
                <Box component="span" sx={{ fontWeight: 700 }}>{b.label}: </Box>
                {b.text}
                {' '}
                {b.sources.map((src, j) => (
                  <Box key={j} component="span" sx={{ color: '#1D9F9F', cursor: 'pointer', textDecoration: 'underline', mr: 0.5 }}>{src}{j < b.sources.length - 1 ? ',' : ''}</Box>
                ))}
              </Box>
            ))}
          </Box>

          <Divider />
          <Box sx={{ px: 2, py: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #e0e0e0', borderRadius: 5, px: 2, py: 1, gap: 1 }}>
              <InputBase
                placeholder="Ask questions about your searches"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                sx={{ flex: 1, fontSize: 14 }}
              />
              <IconButton size="small" sx={{ bgcolor: '#e0e0e0', width: 28, height: 28, '&:hover': { bgcolor: '#bdbdbd' } }}>
                <ArrowForwardIcon sx={{ fontSize: 16, color: '#616161' }} />
              </IconButton>
            </Box>
          </Box>
        </Paper>

        {/* Recommendations */}
        <Paper elevation={1} sx={{ borderRadius: 1, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2.5, pt: 2, pb: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#212121' }}>Recommendations</Typography>
              <InfoOutlinedIcon sx={{ fontSize: 16, color: '#9e9e9e' }} />
            </Box>
            <IconButton size="small"><MoreVertIcon sx={{ fontSize: 18, color: '#616161' }} /></IconButton>
          </Box>

          <Box sx={{ flex: 1, px: 2.5, display: 'flex', flexDirection: 'column', gap: 0 }}>
            {RECOMMENDATIONS.map((r, i) => (
              <Box key={i}>
                <Box sx={{ display: 'flex', gap: 1.5, py: 2 }}>
                  <Box sx={{ flexShrink: 0 }}>{r.icon}</Box>
                  <Box>
                    <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#212121', mb: 0.5 }}>{r.title}</Typography>
                    <Typography sx={{ fontSize: 13, color: '#616161', lineHeight: '20px', mb: 1 }}>{r.body}</Typography>
                    <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#1D9F9F', cursor: 'pointer' }}>{r.action}</Typography>
                  </Box>
                </Box>
                {i < RECOMMENDATIONS.length - 1 && <Divider />}
              </Box>
            ))}
          </Box>

          <Divider />
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', px: 2, py: 1, gap: 1 }}>
            <Typography sx={{ fontSize: 13, color: '#616161' }}>1 - 3 of 10</Typography>
            <IconButton size="small"><ChevronLeftIcon sx={{ fontSize: 18, color: '#9e9e9e' }} /></IconButton>
            <IconButton size="small"><ChevronRightIcon sx={{ fontSize: 18, color: '#616161' }} /></IconButton>
          </Box>
        </Paper>

      </Box>{/* end bottom grid */}
      </Box>{/* end inner max-width */}
      </Box>{/* end p:3 content wrapper */}
    </Box>
  )
}
