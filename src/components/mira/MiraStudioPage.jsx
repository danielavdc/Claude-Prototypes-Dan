import { useState } from 'react'
import MiraStudioChat from './MiraStudioChat'
import { Box, Typography, Button, IconButton, Tab, Tabs } from '@mui/material'
import { alpha } from '@mui/material/styles'
import FolderIcon from '@mui/icons-material/FolderOpen'
import HistoryIcon from '@mui/icons-material/History'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import ViewWeekIcon from '@mui/icons-material/ViewWeek'
import CropSquareIcon from '@mui/icons-material/CropSquare'
import LoyaltyIcon from '@mui/icons-material/Loyalty'
import GridViewIcon from '@mui/icons-material/GridView'


// ── MiraEyeIcon ───────────────────────────────────────────────────────────────
function MiraEyeIcon({ size = 80 }) {
  return (
    <Box component="img" src="/fjord_ai.png" alt="Mira"
      sx={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
    />
  )
}

// ── PromptCard ────────────────────────────────────────────────────────────────
function PromptCard({ title = 'Prompt Title', icon, onSelect }) {
  return (
    <Box onClick={onSelect} sx={{ flex: '1 1 calc(50% - 8px)', border: '1px solid rgba(33,33,33,0.12)', borderRadius: 2, p: 2, display: 'flex', gap: 1.5, cursor: 'pointer', '&:hover': { bgcolor: alpha('#1D9F9F', 0.03), borderColor: '#1D9F9F' } }}>
      <Box sx={{ width: 36, height: 36, borderRadius: 1.5, bgcolor: '#EEF0FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {icon ?? <FolderIcon sx={{ fontSize: 20, color: '#5C6BC0' }} />}
      </Box>
      <Box>
        <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#212121', mb: 0.25 }}>{title}</Typography>
        <Typography sx={{ fontSize: 13, color: 'text.secondary', lineHeight: '18px' }}>Lorem ipsum dolor sit amet, lorem ipsum dolor sit amet lipsum dol sit</Typography>
      </Box>
    </Box>
  )
}

const FAVORITE_PROMPTS = [
  { title: 'Prompt Title' },
  { title: 'Prompt Title' },
  { title: 'Prompt Title' },
  { title: 'Prompt Title' },
]

const SEARCH_ASSISTANT_PROMPTS = [
  { title: 'Create a Brand Search', icon: <LoyaltyIcon sx={{ fontSize: 20, color: '#5C6BC0' }} />, prompt: 'Create a brand search for [enter brand name]' },
  { title: 'Create an Industry Search', icon: <GridViewIcon sx={{ fontSize: 20, color: '#5C6BC0' }} /> },
  { title: 'Brief me on a topic', icon: <LoyaltyIcon sx={{ fontSize: 20, color: '#5C6BC0' }} /> },
  { title: 'Refine Existing Search', icon: <GridViewIcon sx={{ fontSize: 20, color: '#5C6BC0' }} /> },
]

// ── MiraStudioPage ────────────────────────────────────────────────────────────
function MiraStudioPage() {
  const [promptTab, setPromptTab] = useState(0)
  const [activeMode, setActiveMode] = useState('thread')
  const [inputValue, setInputValue] = useState('')
  const [submittedPrompt, setSubmittedPrompt] = useState(null)

  const handleSubmit = () => {
    if (!inputValue.trim()) return
    setSubmittedPrompt(inputValue.trim())
  }

  if (submittedPrompt) {
    return <MiraStudioChat prompt={submittedPrompt} onBack={() => setSubmittedPrompt(null)} />
  }

  const modes = [
    { key: 'thread', icon: <ViewWeekIcon sx={{ fontSize: 16 }} />, label: 'Thread' },
    { key: 'canvas', icon: <CropSquareIcon sx={{ fontSize: 16 }} />, label: 'Canvas' },
    { key: 'searches', label: 'Searches' },
  ]

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Sub-toolbar */}
      <Box sx={{ height: 48, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2.5, borderBottom: '1px solid #e0e0e0', bgcolor: 'background.paper' }}>
        <Button size="small" startIcon={<FolderIcon sx={{ fontSize: 16 }} />} endIcon={<ArrowDropDownIcon sx={{ fontSize: 18 }} />}
          sx={{ color: '#212121', fontWeight: 500, fontSize: 14, textTransform: 'none', px: 1 }}>
          Select Project
        </Button>
        <Button size="small" startIcon={<HistoryIcon sx={{ fontSize: 16 }} />}
          sx={{ color: '#212121', fontWeight: 700, fontSize: 14, textTransform: 'none', px: 1 }}>
          View History
        </Button>
      </Box>

      {/* Scrollable content */}
      <Box sx={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 6, px: 3, pb: 4 }}>
        <Box sx={{ width: '100%', maxWidth: 720 }}>

          {/* Mira avatar + greeting */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
            <MiraEyeIcon size={80} />
            <Typography sx={{ mt: 2.5, fontSize: 22, lineHeight: '32px', color: '#212121', textAlign: 'center' }}>
              <strong>Hello Leya,</strong> I'm Mira. How can I help you today?
            </Typography>
          </Box>

          {/* Input box */}
          <Box sx={{ border: '1px solid rgba(33,33,33,0.23)', borderRadius: 2, mb: 2, bgcolor: 'background.paper' }}>
            <Box
              component="textarea"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder={promptTab === 1 ? 'Ask me to create a brand or industry search' : 'Ask me about your media coverage, insights trends, and more!'}
              rows={3}
              sx={{
                width: '100%', border: 'none', outline: 'none', resize: 'none',
                px: 2, pt: 2, pb: 1, fontSize: 15, lineHeight: '22px', color: '#212121',
                bgcolor: 'transparent', fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                '&::placeholder': { color: 'rgba(33,33,33,0.38)' },
                boxSizing: 'border-box', display: 'block',
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', px: 1.5, pb: 1.5, gap: 1 }}>
              <Box sx={{ display: 'flex', gap: 0.75, flex: 1 }}>
                {promptTab === 1 ? (
                  <Box sx={{ px: 1.25, py: 0.5, borderRadius: 1, border: '1px solid rgba(33,33,33,0.23)' }}>
                    <Typography sx={{ fontSize: 13, color: '#212121' }}>Search Assistant Mode</Typography>
                  </Box>
                ) : (
                  <>
                    {modes.map(m => (
                      <Box key={m.key} onClick={() => setActiveMode(m.key)}
                        sx={{
                          display: 'flex', alignItems: 'center', gap: 0.5,
                          px: 1.25, py: 0.5, borderRadius: 1, cursor: 'pointer',
                          border: `1px solid ${activeMode === m.key ? '#1D9F9F' : 'rgba(33,33,33,0.23)'}`,
                          bgcolor: activeMode === m.key ? alpha('#1D9F9F', 0.06) : 'transparent',
                          color: activeMode === m.key ? 'primary.main' : 'text.secondary',
                        }}>
                        {m.icon}
                        <Typography sx={{ fontSize: 13, fontWeight: activeMode === m.key ? 600 : 400 }}>{m.label}</Typography>
                      </Box>
                    ))}
                    <IconButton size="small" sx={{ color: 'text.secondary' }}>
                      <CalendarMonthIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </>
                )}
              </Box>
              <Box onClick={handleSubmit} sx={{
                width: 32, height: 32, borderRadius: '50%',
                bgcolor: promptTab === 1 || inputValue.trim() ? 'primary.main' : '#e0e0e0',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}>
                <ArrowUpwardIcon sx={{ fontSize: 18, color: 'white' }} />
              </Box>
            </Box>
          </Box>

          {/* Mira Projects banner */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, border: '1px solid rgba(33,33,33,0.12)', borderRadius: 2, mb: 4, bgcolor: 'background.paper' }}>
            <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: '#EEF0FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <FolderIcon sx={{ fontSize: 22, color: '#5C6BC0' }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#5C6BC0', mb: 0.25 }}>Introducing Mira Projects</Typography>
              <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>Tell us more about who you are and leverage your existing searches and filters to improve results</Typography>
            </Box>
            <Button size="small"
              sx={{ flexShrink: 0, borderRadius: 1.5, fontSize: 13, fontWeight: 700, textTransform: 'none', bgcolor: alpha('#5C6BC0', 0.12), color: '#5C6BC0', px: 2, '&:hover': { bgcolor: alpha('#5C6BC0', 0.2) } }}>
              Try Now
            </Button>
          </Box>

          {/* Tabs */}
          <Tabs value={promptTab} onChange={(_, v) => setPromptTab(v)}
            sx={{ mb: 2, borderBottom: '1px solid #e0e0e0', '& .MuiTab-root': { textTransform: 'none', fontSize: 14, fontWeight: 500 }, '& .Mui-selected': { fontWeight: 700 } }}>
            <Tab label="Favorite Prompts" />
            <Tab label="Search Assistant" />
            <Tab label="Agents" />
          </Tabs>

          {/* Prompt cards grid */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {(promptTab === 1 ? SEARCH_ASSISTANT_PROMPTS : FAVORITE_PROMPTS).map((p, i) => (
              <PromptCard key={i} title={p.title} icon={p.icon}
                onSelect={p.prompt ? () => setInputValue(p.prompt) : undefined} />
            ))}
          </Box>

        </Box>
      </Box>
    </Box>
  )
}

export default MiraStudioPage
