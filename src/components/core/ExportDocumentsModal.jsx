import { useState } from 'react'
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Typography, Button, Box, IconButton, Slider, TextField,
  Radio, RadioGroup, FormControlLabel, Divider, Tooltip,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'

function ExportDocumentsModal({ open, onClose }) {
  const [exportLimit, setExportLimit] = useState(20000)
  const [sampleType, setSampleType] = useState('first')
  const [format, setFormat] = useState('csv')
  const [template, setTemplate] = useState('popular')

  const handleClose = () => {
    setExportLimit(20000)
    setSampleType('first')
    setFormat('csv')
    setTemplate('popular')
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth
      PaperProps={{ sx: { borderRadius: 1 } }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1, pt: 2.5, px: 3 }}>
        <Typography sx={{ fontSize: 18, fontWeight: 700, color: '#212121' }}>Export Documents</Typography>
        <IconButton size="small" onClick={handleClose}>
          <CloseIcon sx={{ fontSize: 20, color: '#757575' }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pt: '8px !important', pb: 2 }}>
        {/* Set Export Limit */}
        <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#616161', letterSpacing: '0.08em', textTransform: 'uppercase', mb: 1.5 }}>
          Set Export Limit
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
          <Typography sx={{ fontSize: 13, color: '#616161' }}>1</Typography>
          <Slider
            value={exportLimit}
            onChange={(e, v) => setExportLimit(v)}
            min={1}
            max={20000}
            sx={{
              color: '#00827F',
              '& .MuiSlider-thumb': { width: 20, height: 20 },
              '& .MuiSlider-track': { height: 4 },
              '& .MuiSlider-rail': { height: 4, bgcolor: '#e0e0e0' },
            }}
          />
          <Typography sx={{ fontSize: 13, color: '#616161' }}>20k</Typography>
        </Box>
        <TextField
          fullWidth size="small"
          value={exportLimit}
          onChange={(e) => {
            const v = parseInt(e.target.value) || 0
            setExportLimit(Math.min(Math.max(v, 1), 20000))
          }}
          sx={{ mb: 2.5, '& .MuiOutlinedInput-root': { borderRadius: 0.5 }, '& input': { fontSize: 14, fontWeight: 700 } }}
        />

        <Divider sx={{ mx: -3, mb: 2 }} />

        {/* Sample Type */}
        <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#616161', letterSpacing: '0.08em', textTransform: 'uppercase', mb: 1 }}>
          Sample Type
        </Typography>
        <RadioGroup value={sampleType} onChange={(e) => setSampleType(e.target.value)}>
          <FormControlLabel
            value="first"
            control={<Radio size="small" sx={{ color: '#9e9e9e', '&.Mui-checked': { color: '#00827F' } }} />}
            label={
              <Box>
                <Typography sx={{ fontSize: 14, color: '#212121' }}>First 20k documents</Typography>
                <Typography sx={{ fontSize: 13, color: '#616161' }}>Ordered by date descending</Typography>
              </Box>
            }
            sx={{ mb: 0.5, alignItems: 'flex-start', '& .MuiRadio-root': { pt: 0.25 } }}
          />
          <FormControlLabel
            value="random"
            control={<Radio size="small" sx={{ color: '#9e9e9e', '&.Mui-checked': { color: '#00827F' } }} />}
            label={
              <Box>
                <Typography sx={{ fontSize: 14, color: '#212121' }}>Randomized sample of 20k documents</Typography>
                <Typography sx={{ fontSize: 13, color: '#616161' }}>Across all 2.61M documents</Typography>
              </Box>
            }
            sx={{ alignItems: 'flex-start', '& .MuiRadio-root': { pt: 0.25 } }}
          />
        </RadioGroup>

        <Divider sx={{ mx: -3, my: 2 }} />

        {/* Format */}
        <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#616161', letterSpacing: '0.08em', textTransform: 'uppercase', mb: 1 }}>
          Format
        </Typography>
        <RadioGroup value={format} onChange={(e) => setFormat(e.target.value)}>
          {['CSV', 'Excel', 'PDF'].map((f) => (
            <Tooltip
              key={f}
              title={f === 'PDF' ? 'Can export up to 100 documents for PDF' : ''}
              placement="right"
              arrow
            >
              <span>
                <FormControlLabel
                  value={f.toLowerCase()}
                  control={<Radio size="small" sx={{ color: '#9e9e9e', '&.Mui-checked': { color: '#00827F' } }} />}
                  label={<Typography sx={{ fontSize: 14, color: f === 'PDF' ? '#9e9e9e' : '#212121' }}>{f}</Typography>}
                  disabled={f === 'PDF'}
                  sx={{ mb: 0.25 }}
                />
              </span>
            </Tooltip>
          ))}
        </RadioGroup>

        <Divider sx={{ mx: -3, my: 2 }} />

        {/* Template */}
        <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#616161', letterSpacing: '0.08em', textTransform: 'uppercase', mb: 1 }}>
          Template
        </Typography>
        <RadioGroup value={template} onChange={(e) => setTemplate(e.target.value)}>
          {[
            { value: 'popular', label: 'Popular fields & metrics' },
            { value: 'legacy', label: 'Legacy' },
          ].map((t) => (
            <Box key={t.value} sx={{ display: 'flex', alignItems: 'center' }}>
              <FormControlLabel
                value={t.value}
                control={<Radio size="small" sx={{ color: '#9e9e9e', '&.Mui-checked': { color: '#00827F' } }} />}
                label={<Typography sx={{ fontSize: 14, color: '#212121' }}>{t.label}</Typography>}
                sx={{ flex: 1, mb: 0.25 }}
              />
              <IconButton size="small">
                <InfoOutlinedIcon sx={{ fontSize: 18, color: '#9e9e9e' }} />
              </IconButton>
            </Box>
          ))}
        </RadioGroup>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={handleClose} sx={{ color: '#00827F', fontWeight: 600, textTransform: 'none', fontSize: 14 }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleClose}
          sx={{
            bgcolor: '#00827F', color: 'white', fontWeight: 600, textTransform: 'none', fontSize: 14,
            '&:hover': { bgcolor: '#00726E' },
          }}
        >
          Export
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ExportDocumentsModal
