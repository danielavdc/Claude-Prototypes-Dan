import { useState, useRef, useEffect } from 'react'
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Typography, Button, TextField, Box, IconButton,
  MenuItem, Select, FormControl, InputLabel,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import FolderIcon from '@mui/icons-material/Folder'

const MOCK_FOLDERS = [
  'Brand Reputation',
  'Campaign Monitoring',
  'Competitive Analysis',
  'North America',
  'Media Analytics',
  'EMEA',
]

const MOCK_TEMPLATES = ['Brand', 'Benchmark', 'Coverage', 'Earned Media Measurement']

function CreateDashboardModal({ open, onClose, onSave, title = 'Create Dashboard', subtext = 'Turn this search into a live dashboard using a template.', hideTemplate, zIndex }) {
  const [name, setName] = useState('')
  const [folder, setFolder] = useState('')
  const [template, setTemplate] = useState('Brand')
  const [showError, setShowError] = useState(false)
  const nameInputRef = useRef(null)

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => nameInputRef.current?.focus(), 100)
      return () => clearTimeout(timer)
    }
  }, [open])

  const handleClose = () => {
    setName('')
    setFolder('')
    setTemplate('Brand')
    setShowError(false)
    onClose()
  }

  const handleCreate = () => {
    if (!name.trim()) {
      setShowError(true)
      return
    }
    if (onSave) onSave(name.trim())
    handleClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth
      PaperProps={{ sx: { borderRadius: 1 } }}
      sx={zIndex ? { zIndex } : undefined}
      disableAutoFocus
      disableEnforceFocus
    >
      <DialogTitle sx={{ pb: 0.5, pt: 2.5, px: 3 }}>
        <Typography sx={{ fontSize: 18, fontWeight: 700, color: '#212121' }}>{title}</Typography>
        <Typography sx={{ fontSize: 14, color: '#212121', mt: 1 }}>{subtext}</Typography>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pt: '24px !important', pb: 2 }}>
        {/* Name input */}
        <TextField
          fullWidth
          label="Dashboard Name"
          placeholder=""
          inputRef={nameInputRef}
          value={name}
          onChange={(e) => { if (e.target.value.length <= 50) { setName(e.target.value); setShowError(false) } }}
          error={showError && !name.trim()}
          helperText={showError && !name.trim() ? 'Please enter a dashboard name' : ''}
          sx={{
            mb: 0.5,
            '& .MuiOutlinedInput-root': {
              borderRadius: 0.5,
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#00827F' },
            },
            '& .MuiInputLabel-root.Mui-focused': { color: '#00827F' },
          }}
        />
        <Typography sx={{ fontSize: 12, color: 'text.secondary', textAlign: 'right', mb: 1.5 }}>
          {name.length}/50
        </Typography>

        {/* Folder dropdown */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel
            sx={{ '&.Mui-focused': { color: '#00827F' } }}
          >
            Select Folder
          </InputLabel>
          <Select
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
            label="Select Folder"
            sx={{
              borderRadius: 0.5,
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#00827F' },
            }}
          >
            <MenuItem value="">
              <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>None</Typography>
            </MenuItem>
            {MOCK_FOLDERS.map((f) => (
              <MenuItem key={f} value={f}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FolderIcon sx={{ fontSize: 18, color: '#757575' }} />
                  <Typography sx={{ fontSize: 14 }}>{f}</Typography>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Template dropdown */}
        {!hideTemplate && <FormControl fullWidth sx={{ mt: '20px', mb: '8px' }}>
          <InputLabel
            sx={{ '&.Mui-focused': { color: '#00827F' } }}
          >
            Template
          </InputLabel>
          <Select
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            label="Template"
            sx={{
              borderRadius: 0.5,
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#00827F' },
            }}
          >
            {MOCK_TEMPLATES.map((t) => (
              <MenuItem key={t} value={t}>
                <Typography sx={{ fontSize: 14 }}>{t}</Typography>
              </MenuItem>
            ))}
          </Select>
        </FormControl>}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={handleClose} sx={{ color: '#00827F', fontWeight: 600, textTransform: 'none', fontSize: 14 }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleCreate}
          sx={{
            bgcolor: '#00827F', color: 'white', fontWeight: 600, textTransform: 'none', fontSize: 14,
            '&:hover': { bgcolor: '#00726E' },
          }}
        >
          Save Dashboard
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CreateDashboardModal
