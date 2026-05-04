import { useState } from 'react'
import { Box, Typography, Button, InputBase, IconButton, Checkbox, Tabs, Tab, Divider } from '@mui/material'
import CreateMenu from './CreateMenu'
import { alpha } from '@mui/material/styles'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import SearchIcon from '@mui/icons-material/Search'
import FilterListIcon from '@mui/icons-material/FilterList'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import AddIcon from '@mui/icons-material/Add'
import FolderIcon from '@mui/icons-material/Folder'
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import CodeIcon from '@mui/icons-material/Code'
import CallMergeIcon from '@mui/icons-material/CallMerge'

const FOLDERS = [
  { name: 'Brands 2025', count: 3, expanded: false },
  { name: 'Competitors', count: 3, expanded: false },
  { name: 'Industry', count: 3, expanded: false },
  { name: 'Other searches', count: 3, icon: 'doc' },
]

const SEARCHES = [
  { name: '2test', usedIn: '3 Places', createdBy: 'Angelica G.', lastEdited: 'Jun 23 • 9:31 AM', query: '"2test" OR "test search"' },
  { name: 'Tesla Brand Sentiment', usedIn: '0 Places', createdBy: 'Angelica G.', lastEdited: 'Jun 23 • 9:31 AM', query: '("Tesla" OR "TSLA") AND ("brand" OR "sentiment" OR "perception" OR "reputation")' },
  { name: 'Tesla Product Quality Mentions', usedIn: '0 Places', createdBy: 'Angelica G.', lastEdited: 'Jun 23 • 9:31 AM', query: '"Tesla" AND ("quality" OR "defect" OR "recall" OR "build quality" OR "reliability")' },
  { name: 'EV Market Share Analysis', usedIn: '1 Places', createdBy: 'Angelica G.', lastEdited: 'Jun 23 • 9:31 AM', query: '("EV" OR "electric vehicle" OR "BEV") AND ("market share" OR "sales" OR "growth" OR "adoption")' },
  { name: 'Comparative Coverage: Tesla & Ford', usedIn: '1 Places', createdBy: 'Angelica G.', lastEdited: 'Jun 23 • 9:31 AM', query: '("Tesla" OR "TSLA") AND ("Ford" OR "F-150 Lightning" OR "Mustang Mach-E")' },
  { name: 'Cybertruck Launch Coverage', usedIn: '5 Places', createdBy: 'Angelica G.', lastEdited: 'Jun 23 • 9:31 AM', query: '"Cybertruck" AND ("launch" OR "delivery" OR "release" OR "debut" OR "review")' },
  { name: 'Recall Mentions and Updates', usedIn: '3 Places', createdBy: 'Angelica G.', lastEdited: 'Jun 23 • 9:31 AM', sub: 'Crisis Tracking', query: '"Tesla" AND ("recall" OR "NHTSA" OR "safety issue" OR "firmware update" OR "OTA fix")' },
]

export default function SearchesListPage({ onOpenSearch, onCreateSearch }) {
  const [tab, setTab] = useState(0)
  const [aiInput, setAiInput] = useState('')
  const [selectedAll, setSelectedAll] = useState(false)
  const [selected, setSelected] = useState([])
  const [createAnchor, setCreateAnchor] = useState(null)

  const toggleRow = (i) => {
    setSelected(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i])
  }

  return (
    <Box sx={{ flex: 1, overflow: 'auto', bgcolor: '#f5f5f5' }}>

      {/* Page header */}
      <Box sx={{ bgcolor: 'background.paper', borderBottom: '1px solid #e0e0e0', px: 3, pt: 2.5, pb: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography sx={{ fontSize: 26, fontWeight: 700, color: '#212121' }}>Create Searches with AI</Typography>
          <Button variant="contained" endIcon={<ArrowDropDownIcon />}
            onClick={(e) => setCreateAnchor(e.currentTarget)}
            sx={{ bgcolor: '#B627A1', color: 'white', fontWeight: 700, fontSize: 14, height: 40, borderRadius: 0.5, px: 2.5, '&:hover': { bgcolor: '#9C1F8A' } }}>
            Create
          </Button>
          <CreateMenu anchorEl={createAnchor} onClose={() => setCreateAnchor(null)} onSelect={(key) => onCreateSearch?.(key)} />
        </Box>

        {/* AI input */}
        <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #e0e0e0', borderRadius: 1, px: 2, py: 1, gap: 1, mb: 1.5, bgcolor: 'background.paper' }}>
          <AutoFixHighIcon sx={{ fontSize: 18, color: '#9e9e9e' }} />
          <InputBase
            placeholder="Start with a Brand or Industry"
            value={aiInput}
            onChange={e => setAiInput(e.target.value)}
            sx={{ flex: 1, fontSize: 15, color: '#9e9e9e' }}
          />
          <IconButton size="small" sx={{ bgcolor: '#e0e0e0', width: 30, height: 30, '&:hover': { bgcolor: '#bdbdbd' } }}>
            <ArrowForwardIcon sx={{ fontSize: 16, color: '#616161' }} />
          </IconButton>
        </Box>
        <Typography onClick={() => onOpenSearch?.('("Tesla" OR "TSLA") AND ("brand" OR "sentiment" OR "perception" OR "reputation")')} sx={{ fontSize: 14, color: '#1D9F9F', fontWeight: 500, cursor: 'pointer', mb: 2 }}>Run a sample search</Typography>

        {/* Search type cards */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2.5 }}>
          {[
            { key: 'keyword', title: 'Keyword search', description: 'Use keywords to get results quickly and easily', icon: <SearchIcon sx={{ fontSize: 20, color: '#1D9F9F' }} />, iconBg: alpha('#1D9F9F', 0.1), accentColor: '#1D9F9F' },
            { key: 'advanced', title: 'Advanced search', description: 'Use Boolean queries for precision', icon: <CodeIcon sx={{ fontSize: 20, color: '#1D9F9F' }} />, iconBg: alpha('#1D9F9F', 0.1), accentColor: '#1D9F9F' },
            { key: 'combined', title: 'Combined search', description: 'Combine saved searches into one dataset', icon: <CallMergeIcon sx={{ fontSize: 20, color: '#1D9F9F' }} />, iconBg: alpha('#1D9F9F', 0.1), accentColor: '#1D9F9F' },
            { key: 'ai-assistant', title: 'AI Search Assistant', description: 'Create and refine searches using AI', icon: <AutoFixHighIcon sx={{ fontSize: 20, color: '#8B49A0' }} />, iconBg: alpha('#B627A1', 0.1), accentColor: '#B627A1' },
          ].map((card) => (
            <Box
              key={card.key}
              onClick={() => onCreateSearch?.(card.key)}
              sx={{
                flex: 1, minWidth: 0, border: '1px solid #e0e0e0', borderRadius: 1.5,
                px: 2, height: 60, display: 'flex', alignItems: 'center', gap: 1.5,
                bgcolor: 'background.paper', cursor: 'pointer',
                '&:hover': { borderColor: card.accentColor, bgcolor: alpha(card.accentColor, 0.02) },
              }}
            >
              <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: card.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {card.icon}
              </Box>
              <Box>
                <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#212121', lineHeight: 1.3 }}>{card.title}</Typography>
                <Typography sx={{ fontSize: 12, color: 'text.secondary', lineHeight: 1.3 }}>{card.description}</Typography>
              </Box>
            </Box>
          ))}
        </Box>

      </Box>

      {/* Tabs + Table */}
      <Box sx={{ p: 3 }}>
        {/* Card: tabs + body */}
        <Box sx={{ bgcolor: 'background.paper', border: '1px solid #e0e0e0', borderRadius: 1, overflow: 'hidden' }}>
        {/* Tabs */}
        <Box sx={{ px: 2, pt: 1.5, borderBottom: '1px solid #e0e0e0' }}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ minHeight: 40, '& .MuiTabs-indicator': { bgcolor: '#1D9F9F', height: 3 } }}>
            {['Searches', 'Custom Categories', 'Author Lists', 'Filter Sets'].map((label, i) => (
              <Tab key={label} label={label} sx={{ minHeight: 36, fontSize: 14, fontWeight: tab === i ? 700 : 400, color: '#212121 !important', textTransform: 'none', px: 2, borderRadius: '4px 4px 0 0', bgcolor: tab === i ? alpha('#1D9F9F', 0.1) : 'transparent', mr: 0.5 }} />
            ))}
          </Tabs>
        </Box>

        {/* Body */}
        <Box sx={{ display: 'flex', minHeight: 500 }}>

        {/* Left sidebar */}
        <Box sx={{ width: 260, flexShrink: 0, borderRight: '1px solid #e0e0e0', display: 'flex', flexDirection: 'column', overflow: 'auto' }}>

          {/* All Searches */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1.5, bgcolor: alpha('#1D9F9F', 0.08), borderLeft: '3px solid #1D9F9F', cursor: 'pointer' }}>
            <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#1D9F9F' }}>All Searches</Typography>
            <Typography sx={{ fontSize: 13, color: '#1D9F9F', fontWeight: 600 }}>10</Typography>
          </Box>

          <Divider />

          {/* Folders header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, pt: 1.5, pb: 1 }}>
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#9e9e9e', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Folders</Typography>
            <IconButton size="small"><AddIcon sx={{ fontSize: 16, color: '#9e9e9e' }} /></IconButton>
          </Box>

          {FOLDERS.map((f, i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 1, cursor: 'pointer', '&:hover': { bgcolor: alpha('#000', 0.04) } }}>
              {f.icon === 'doc'
                ? <InsertDriveFileOutlinedIcon sx={{ fontSize: 20, color: '#616161' }} />
                : <><ChevronRightIcon sx={{ fontSize: 16, color: '#9e9e9e' }} /><FolderIcon sx={{ fontSize: 20, color: '#616161' }} /></>
              }
              <Typography sx={{ fontSize: 14, color: '#424242', flex: 1 }}>{f.name}</Typography>
              <Typography sx={{ fontSize: 13, color: '#9e9e9e' }}>{f.count}</Typography>
            </Box>
          ))}
        </Box>

        {/* Table */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>

          {/* Table toolbar */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', px: 2, py: 1, borderBottom: '1px solid #f0f0f0', gap: 1 }}>
            <IconButton size="small"><SearchIcon sx={{ fontSize: 18, color: '#616161' }} /></IconButton>
            <IconButton size="small"><FilterListIcon sx={{ fontSize: 18, color: '#616161' }} /></IconButton>
          </Box>

          {/* Table header */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '44px 1fr 120px 140px 160px 44px', borderBottom: '1px solid #e0e0e0', bgcolor: '#fafafa' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 1 }}>
              <Checkbox size="small" checked={selectedAll} onChange={e => { setSelectedAll(e.target.checked); setSelected(e.target.checked ? SEARCHES.map((_, i) => i) : []) }} />
            </Box>
            {['Name', 'Used in', 'Created by', 'Last edited'].map(h => (
              <Box key={h} sx={{ display: 'flex', alignItems: 'center', py: 1, px: 1.5 }}>
                <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#424242' }}>{h}</Typography>
              </Box>
            ))}
            <Box />
          </Box>

          {/* Rows */}
          {SEARCHES.map((row, i) => (
            <Box key={i} sx={{ display: 'grid', gridTemplateColumns: '44px 1fr 120px 140px 160px 44px', borderBottom: '1px solid #f0f0f0', cursor: 'pointer', '&:hover': { bgcolor: alpha('#1D9F9F', 0.04) } }} onClick={() => onOpenSearch?.(row.query)}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={e => e.stopPropagation()}>
                <Checkbox size="small" checked={selected.includes(i)} onChange={() => toggleRow(i)} />
              </Box>
              <Box sx={{ py: 1.5, px: 1.5 }}>
                <Typography sx={{ fontSize: 14, color: '#212121' }}>{row.name}</Typography>
                {row.sub && <Typography sx={{ fontSize: 12, color: '#9e9e9e' }}>{row.sub}</Typography>}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', px: 1.5 }}>
                <Typography sx={{ fontSize: 14, color: '#424242' }}>{row.usedIn}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', px: 1.5 }}>
                <Typography sx={{ fontSize: 14, color: '#424242' }}>{row.createdBy}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', px: 1.5 }}>
                <Typography sx={{ fontSize: 14, color: '#424242' }}>{row.lastEdited}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={e => e.stopPropagation()}>
                <IconButton size="small"><MoreVertIcon sx={{ fontSize: 18, color: '#9e9e9e' }} /></IconButton>
              </Box>
            </Box>
          ))}
        </Box>
        </Box>
        </Box>
      </Box>
    </Box>
  )
}
