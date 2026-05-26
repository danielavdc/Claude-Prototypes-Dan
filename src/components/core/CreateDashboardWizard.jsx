import { useState } from 'react'
import {
  Dialog, Box, Typography, IconButton, Button, TextField,
  InputAdornment, Checkbox, Radio, Divider,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import DashboardCustomizeOutlinedIcon from '@mui/icons-material/DashboardCustomizeOutlined'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

const TEMPLATES = [
  {
    name: 'Custom',
    desc: 'Start from scratch with an empty dashboard.',
    colors: ['#e0e0e0', '#bdbdbd', '#9e9e9e'],
    preview: 'custom',
  },
  {
    name: 'Audience',
    desc: 'Gain insights into your audience by exploring demographics, trending topics, and key phrases using both social and editorial content.',
    colors: ['#FF80AB', '#FFAB40', '#40C4FF'],
    preview: 'audience',
  },
  {
    name: 'Benchmark',
    desc: 'Compare brands, topics, or competitors to understand their share of voice across mentions, reach, sentiment, source type, and markets.',
    colors: ['#2196F3', '#E91E63', '#4CAF50'],
    preview: 'benchmark',
  },
  {
    name: 'Brand',
    desc: 'Monitor your brand health with mentions, sentiment analysis, and source breakdown over time.',
    colors: ['#2196F3', '#4CAF50', '#FF9800'],
    preview: 'brand',
  },
  {
    name: 'Campaign',
    desc: 'Track campaign performance with real-time mentions, reach, and engagement metrics across all channels.',
    colors: ['#2196F3', '#FF9800', '#E91E63'],
    preview: 'campaign',
  },
  {
    name: 'Coverage Report',
    desc: 'Summarize media coverage with article cards, publication logos, and editorial highlights.',
    colors: ['#FF80AB', '#CE93D8', '#80CBC4'],
    preview: 'coverage',
  },
]

const MOCK_SEARCHES = [
  '000Apple', '000Apple2', '000AppleTest', '000Nicktest', '000Paulaner',
  '00Fox', '00tango', '00testCC - 2CC', '00testCCandAL - 1CC', '00testCCandAL - 2CC',
]

const MOCK_TAGS = ['Battery Tech', 'Biofuel', 'Clean Energy', 'EV Market', 'Solar Power']

const MOCK_FOLDERS = ['Company Space', 'Mira', 'UDs & New Filters']

function TemplatePreview({ template }) {
  const { colors, preview } = template
  if (preview === 'custom') {
    return (
      <Box sx={{ width: '100%', height: '100%', bgcolor: '#f5f5f5', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1.5 }}>
        <Box sx={{ width: 48, height: 48, display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: 'center', justifyContent: 'center' }}>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Box sx={{ width: 18, height: 28, bgcolor: '#bdbdbd', borderRadius: 0.5 }} />
            <Box sx={{ width: 18, height: 28, bgcolor: '#9e9e9e', borderRadius: 0.5, mt: 1 }} />
          </Box>
        </Box>
        <Box sx={{ width: '60%', height: 4, bgcolor: '#bdbdbd', borderRadius: 1 }} />
        <Box sx={{ width: '40%', height: 4, bgcolor: '#d0d0d0', borderRadius: 1 }} />
        <Box sx={{ width: '50%', height: 4, bgcolor: '#d0d0d0', borderRadius: 1 }} />
      </Box>
    )
  }
  if (preview === 'audience') {
    return (
      <Box sx={{ width: '100%', height: '100%', bgcolor: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, px: 2 }}>
        <Typography sx={{ fontSize: 28, fontWeight: 700, color: '#424242' }}>52.4</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Box sx={{ width: 20, height: 14, bgcolor: colors[0], borderRadius: 0.25 }} />
            <Box sx={{ width: 16, height: 14, bgcolor: '#40C4FF', borderRadius: 0.25 }} />
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Box sx={{ width: 24, height: 14, bgcolor: colors[1], borderRadius: 0.25 }} />
            <Box sx={{ width: 12, height: 14, bgcolor: '#E0E0E0', borderRadius: 0.25 }} />
          </Box>
        </Box>
      </Box>
    )
  }
  if (preview === 'benchmark') {
    return (
      <Box sx={{ width: '100%', height: '100%', bgcolor: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, px: 2 }}>
        <Box sx={{ width: 48, height: 48, borderRadius: '50%', background: `conic-gradient(${colors[0]} 0% 45%, ${colors[1]} 45% 75%, ${colors[2]} 75% 100%)` }} />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Box sx={{ width: 40, height: 3, bgcolor: colors[0], borderRadius: 1 }} />
          <Box sx={{ width: 32, height: 3, bgcolor: colors[1], borderRadius: 1 }} />
          <Box sx={{ width: 50, height: 3, bgcolor: colors[2], borderRadius: 1 }} />
        </Box>
      </Box>
    )
  }
  // brand, campaign, coverage
  return (
    <Box sx={{ width: '100%', height: '100%', bgcolor: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, px: 2 }}>
      <Typography sx={{ fontSize: 28, fontWeight: 700, color: '#424242' }}>52.4</Typography>
      <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'flex-end' }}>
        {[28, 40, 22, 35, 18].map((h, i) => (
          <Box key={i} sx={{ width: 8, height: h, bgcolor: colors[i % colors.length], borderRadius: '2px 2px 0 0' }} />
        ))}
      </Box>
    </Box>
  )
}

function StepIndicator({ stepNum, label, active, completed }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {completed ? (
        <CheckCircleIcon sx={{ fontSize: 28, color: '#00827F' }} />
      ) : (
        <Box sx={{
          width: 28, height: 28, borderRadius: '50%',
          bgcolor: active ? '#00827F' : '#e0e0e0',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Typography sx={{ fontSize: 14, fontWeight: 700, color: active ? 'white' : '#9e9e9e' }}>{stepNum}</Typography>
        </Box>
      )}
      <Typography sx={{ fontSize: 14, fontWeight: active ? 700 : 400, color: active || completed ? '#212121' : '#9e9e9e' }}>
        {label}
      </Typography>
    </Box>
  )
}

function CreateDashboardWizard({ open, onClose, onSave }) {
  const [step, setStep] = useState(0)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [templateSearch, setTemplateSearch] = useState('')
  const [sidebarFilter, setSidebarFilter] = useState('All Templates')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSearches, setSelectedSearches] = useState([])
  const [searchTab, setSearchTab] = useState('standard')
  const [selectedTags, setSelectedTags] = useState([])
  const [dashboardName, setDashboardName] = useState('')
  const [selectedFolder, setSelectedFolder] = useState('')

  const handleClose = () => {
    setStep(0)
    setSelectedTemplate(null)
    setTemplateSearch('')
    setSidebarFilter('All Templates')
    setSearchQuery('')
    setSelectedSearches([])
    setSearchTab('standard')
    setSelectedTags([])
    setDashboardName('')
    setSelectedFolder('')
    onClose()
  }

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template)
    setDashboardName(`${template.name} - Apr 2`)
    setStep(1)
  }

  const toggleSearch = (name) => {
    setSelectedSearches(prev =>
      prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]
    )
  }

  const toggleTag = (name) => {
    setSelectedTags(prev =>
      prev.includes(name) ? prev.filter(t => t !== name) : [...prev, name]
    )
  }

  const handleCreate = () => {
    if (onSave) onSave(dashboardName || `${selectedTemplate?.name} Dashboard`)
    handleClose()
  }

  const filteredTemplates = TEMPLATES.filter(t =>
    !templateSearch || t.name.toLowerCase().includes(templateSearch.toLowerCase())
  )

  const filteredSearches = MOCK_SEARCHES.filter(s =>
    !searchQuery || s.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Dialog open={open} onClose={handleClose} fullScreen
      PaperProps={{ sx: { bgcolor: '#fafafa' } }}
    >
      {/* Header */}
      <Box sx={{
        height: 56, bgcolor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        px: 3, borderBottom: '1px solid #e0e0e0', flexShrink: 0,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box component="img" src="/meltwater-icon.png" alt="" sx={{ width: 32, height: 32, objectFit: 'contain' }}
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextSibling && (e.target.nextSibling.style.display = 'flex')
            }}
          />
          <Box sx={{ width: 32, height: 32, display: 'none', alignItems: 'center', justifyContent: 'center', bgcolor: '#00827F', borderRadius: '50%' }}>
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: 'white' }}>M</Typography>
          </Box>
          <Typography sx={{ fontSize: 18, fontWeight: 700, color: '#212121' }}>Create Dashboard</Typography>
        </Box>
        <IconButton onClick={handleClose}>
          <CloseIcon sx={{ fontSize: 24, color: '#757575' }} />
        </IconButton>
      </Box>

      {/* Stepper */}
      <Box sx={{
        height: 48, bgcolor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        px: 4, borderBottom: '2px solid #00827F', flexShrink: 0,
      }}>
        <StepIndicator stepNum={1} label="Select a Template" active={step === 0} completed={step > 0} />
        <Box sx={{ flex: 1, height: 2, bgcolor: step > 0 ? '#00827F' : '#e0e0e0', mx: 2 }} />
        <StepIndicator stepNum={2} label="Select Searches" active={step === 1} completed={step > 1} />
        <Box sx={{ flex: 1, height: 2, bgcolor: step > 1 ? '#00827F' : '#e0e0e0', mx: 2 }} />
        <StepIndicator stepNum={3} label="Save Dashboard" active={step === 2} completed={false} />
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {/* Step 1: Select a Template */}
        {step === 0 && (
          <Box sx={{ display: 'flex', height: '100%' }}>
            {/* Sidebar */}
            <Box sx={{ width: 200, bgcolor: 'white', borderRight: '1px solid #e0e0e0', py: 3, px: 2.5, flexShrink: 0 }}>
              {['All Templates'].map(item => (
                <Typography key={item} onClick={() => setSidebarFilter(item)}
                  sx={{
                    fontSize: 14, fontWeight: sidebarFilter === item ? 700 : 400,
                    color: sidebarFilter === item ? '#00827F' : '#212121',
                    cursor: 'pointer', mb: 2,
                  }}
                >
                  {item}
                </Typography>
              ))}
              <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#9e9e9e', letterSpacing: '0.08em', textTransform: 'uppercase', mb: 1.5 }}>
                Preferred
              </Typography>
              <Typography onClick={() => setSidebarFilter('Most Used')}
                sx={{ fontSize: 14, color: sidebarFilter === 'Most Used' ? '#00827F' : '#212121', fontWeight: sidebarFilter === 'Most Used' ? 700 : 400, cursor: 'pointer', mb: 2.5 }}>
                Most Used
              </Typography>
              <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#9e9e9e', letterSpacing: '0.08em', textTransform: 'uppercase', mb: 1.5 }}>
                Role-Based Templates
              </Typography>
              {['PR & Comms', 'Social Media'].map(item => (
                <Typography key={item} onClick={() => setSidebarFilter(item)}
                  sx={{ fontSize: 14, color: sidebarFilter === item ? '#00827F' : '#212121', fontWeight: sidebarFilter === item ? 700 : 400, cursor: 'pointer', mb: 1.5 }}>
                  {item}
                </Typography>
              ))}
            </Box>

            {/* Template grid */}
            <Box sx={{ flex: 1, p: 3 }}>
              <TextField
                fullWidth size="small"
                placeholder="Search for template"
                value={templateSearch}
                onChange={(e) => setTemplateSearch(e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 20, color: '#9e9e9e' }} /></InputAdornment>,
                }}
                sx={{ mb: 4, bgcolor: 'white', '& .MuiOutlinedInput-root': { borderRadius: 0.5 } }}
              />

              <Typography sx={{ fontSize: 22, fontWeight: 700, color: '#212121', textAlign: 'center', mb: 4 }}>
                Select a Template That Fits Your Specific Use Case
              </Typography>

              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3, maxWidth: 1000, mx: 'auto' }}>
                {filteredTemplates.map((template) => (
                  <Box key={template.name} sx={{
                    bgcolor: 'white', borderRadius: 1, border: '1px solid #e0e0e0', overflow: 'hidden',
                    cursor: 'pointer', transition: 'all 0.15s',
                    '&:hover': { borderColor: '#00827F', boxShadow: '0 0 0 1px #00827F' },
                  }}>
                    <Box sx={{ height: 140, border: '3px solid #00827F', borderRadius: '4px 4px 0 0', overflow: 'hidden' }}>
                      <TemplatePreview template={template} />
                    </Box>
                    <Box sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <DashboardCustomizeOutlinedIcon sx={{ fontSize: 20, color: '#00827F' }} />
                        <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#212121' }}>{template.name}</Typography>
                      </Box>
                      <Typography sx={{ fontSize: 13, color: '#616161', lineHeight: 1.5, mb: 1.5, minHeight: 60 }}>
                        {template.desc}
                      </Typography>
                      <Typography
                        onClick={(e) => { e.stopPropagation(); handleTemplateSelect(template) }}
                        sx={{ fontSize: 14, fontWeight: 700, color: '#00827F', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                      >
                        Create
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        )}

        {/* Step 2: Select Searches */}
        {step === 1 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 5, px: 3 }}>
            <Typography sx={{ fontSize: 22, fontWeight: 700, color: '#212121', mb: 4 }}>
              Select the Searches to Power Your Dashboard
            </Typography>

            <Box sx={{ width: '100%', maxWidth: 640, bgcolor: 'white', borderRadius: 1, border: '1px solid #e0e0e0', overflow: 'hidden' }}>
              {/* Search field */}
              <Box sx={{ px: 2.5, pt: 2.5, pb: 1.5 }}>
                <TextField
                  fullWidth size="small"
                  placeholder="Find"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 20, color: '#9e9e9e' }} /></InputAdornment>,
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0.5 } }}
                />
              </Box>

              {/* Searches header */}
              <Box sx={{ px: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#9e9e9e', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    Searches
                  </Typography>
                  <InfoOutlinedIcon sx={{ fontSize: 14, color: '#9e9e9e' }} />
                </Box>
                <Typography onClick={() => { setSelectedSearches([]); setSelectedTags([]) }}
                  sx={{ fontSize: 13, fontWeight: 600, color: '#00827F', cursor: 'pointer' }}>
                  Clear
                </Typography>
              </Box>

              {/* Search tabs */}
              <Box sx={{ px: 2.5, mb: 1.5 }}>
                <Box sx={{ display: 'inline-flex', border: '1px solid #e0e0e0', borderRadius: 0.5, overflow: 'hidden' }}>
                  {[
                    { key: 'optimized', label: 'Optimized Searches' },
                    { key: 'standard', label: `Standard Searches (${selectedSearches.length}/10)` },
                  ].map(tab => (
                    <Box key={tab.key} onClick={() => setSearchTab(tab.key)}
                      sx={{
                        px: 1.5, py: 0.75, cursor: 'pointer',
                        bgcolor: searchTab === tab.key ? '#f5f5f5' : 'white',
                        borderRight: tab.key === 'optimized' ? '1px solid #e0e0e0' : 'none',
                      }}>
                      <Typography sx={{ fontSize: 13, fontWeight: searchTab === tab.key ? 600 : 400, color: '#212121' }}>
                        {tab.label}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>

              {/* Search list */}
              <Box sx={{ maxHeight: 320, overflow: 'auto' }}>
                {filteredSearches.map((name) => (
                  <Box key={name} onClick={() => toggleSearch(name)}
                    sx={{
                      display: 'flex', alignItems: 'center', px: 2.5, py: 0.75, cursor: 'pointer',
                      bgcolor: selectedSearches.includes(name) ? 'rgba(0,130,127,0.04)' : 'transparent',
                      borderLeft: selectedSearches.includes(name) ? '3px solid #00827F' : '3px solid transparent',
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' },
                    }}>
                    <Checkbox
                      checked={selectedSearches.includes(name)}
                      size="small"
                      sx={{ p: 0.5, mr: 1, color: '#bdbdbd', '&.Mui-checked': { color: '#00827F' } }}
                    />
                    <Typography sx={{ fontSize: 14, color: '#212121' }}>{name}</Typography>
                  </Box>
                ))}
              </Box>

              {/* Show all */}
              <Box sx={{ px: 2.5, py: 1.5 }}>
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#00827F', cursor: 'pointer' }}>
                  Show all
                </Typography>
              </Box>

              <Divider />

              {/* Tags */}
              <Box sx={{ px: 2.5, py: 1.5 }}>
                <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#9e9e9e', letterSpacing: '0.08em', textTransform: 'uppercase', mb: 1 }}>
                  Tags
                </Typography>
                {MOCK_TAGS.map((tag) => (
                  <Box key={tag} onClick={() => toggleTag(tag)}
                    sx={{ display: 'flex', alignItems: 'center', py: 0.5, cursor: 'pointer' }}>
                    <Checkbox
                      checked={selectedTags.includes(tag)}
                      size="small"
                      sx={{ p: 0.5, mr: 1, color: '#bdbdbd', '&.Mui-checked': { color: '#00827F' } }}
                    />
                    <Typography sx={{ fontSize: 14, color: '#212121' }}>{tag}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        )}

        {/* Step 3: Save Dashboard */}
        {step === 2 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 5, px: 3 }}>
            <Box sx={{ width: '100%', maxWidth: 640, bgcolor: 'white', borderRadius: 1, border: '1px solid #e0e0e0', p: 4 }}>
              <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#212121', mb: 0.5 }}>
                {selectedTemplate?.name} dashboard
              </Typography>
              <Typography sx={{ fontSize: 14, color: '#616161', mb: 3 }}>
                Select the folder you would like to save your {selectedTemplate?.name} Dashboard to
              </Typography>

              {/* Dashboard name */}
              <TextField
                fullWidth
                label="Dashboard name"
                value={dashboardName}
                onChange={(e) => setDashboardName(e.target.value)}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 0.5,
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#00827F' },
                  },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#00827F' },
                }}
              />

              <Divider sx={{ mb: 3 }} />

              {/* Folder selection */}
              <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#212121', mb: 2 }}>Folder</Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, cursor: 'pointer' }}>
                <AddCircleOutlineIcon sx={{ fontSize: 20, color: '#00827F' }} />
                <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#00827F' }}>Add Folder</Typography>
              </Box>

              {MOCK_FOLDERS.map((folder) => (
                <Box key={folder} onClick={() => setSelectedFolder(folder)}
                  sx={{ display: 'flex', alignItems: 'center', py: 0.75, cursor: 'pointer' }}>
                  <Radio
                    checked={selectedFolder === folder}
                    size="small"
                    sx={{ p: 0.5, mr: 1.5, color: '#bdbdbd', '&.Mui-checked': { color: '#00827F' } }}
                  />
                  <Typography sx={{ fontSize: 14, color: '#212121' }}>{folder}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>

      {/* Footer */}
      {step > 0 && (
        <Box sx={{
          height: 64, bgcolor: 'white', borderTop: '1px solid #e0e0e0',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, flexShrink: 0,
        }}>
          <Button onClick={() => setStep(step - 1)}
            sx={{ color: '#00827F', fontWeight: 600, textTransform: 'none', fontSize: 14 }}>
            Back
          </Button>
          <Button
            variant="contained"
            onClick={() => { if (step === 2) handleCreate(); else setStep(step + 1) }}
            sx={{
              bgcolor: '#00827F', color: 'white', fontWeight: 600, textTransform: 'none', fontSize: 14,
              '&:hover': { bgcolor: '#00726E' },
            }}
          >
            {step === 2 ? 'Create' : 'Next'}
          </Button>
        </Box>
      )}
    </Dialog>
  )
}

export default CreateDashboardWizard
