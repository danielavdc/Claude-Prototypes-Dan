import { useState } from 'react'
import { Box, Typography, Button, IconButton, Collapse, Tooltip } from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import EditNoteIcon from '@mui/icons-material/EditNote'
import FindInPageIcon from '@mui/icons-material/FindInPage'

function SearchVersionCard({ brandName, version, query, onPreview }) {
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard?.writeText(query)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1.5, overflow: 'hidden', mb: 2 }}>
      <Box sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ width: 36, height: 36, borderRadius: 1.5, bgcolor: '#EEF0FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <FindInPageIcon sx={{ color: '#5C6BC0', fontSize: 20 }} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0, mr: 0.5 }}>
          <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#212121' }} noWrap>{brandName} Brand Search</Typography>
          <Typography variant="caption" color="text.secondary">Version {version}</Typography>
        </Box>
        <Button variant="outlined" size="small" onClick={onPreview}
          sx={{ flexShrink: 0, borderRadius: 1, fontSize: 13, textTransform: 'none', borderColor: 'rgba(0,0,0,0.23)', color: '#212121' }}>
          Preview
        </Button>
        <IconButton size="small" onClick={() => setExpanded(e => !e)} sx={{ flexShrink: 0 }}>
          <KeyboardArrowDownIcon sx={{ fontSize: 18, color: 'text.secondary', transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </IconButton>
      </Box>

      <Collapse in={expanded}>
        <Box sx={{ px: 2, py: 1.5, bgcolor: '#fafafa', borderTop: '1px solid #e0e0e0' }}>
          <Typography sx={{ fontFamily: 'monospace', fontSize: 13, lineHeight: '22px', wordBreak: 'break-word', color: '#1565C0' }}>
            {query}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 1.5, py: 0.75, gap: 0.25, bgcolor: '#f0f0f0', borderTop: '1px solid #e0e0e0' }}>
          <Tooltip title={copied ? 'Copied!' : 'Copy'}>
            <IconButton size="small" onClick={handleCopy} sx={{ p: 0.75, color: copied ? 'primary.main' : 'text.secondary' }}>
              <ContentCopyIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
          <IconButton size="small" sx={{ p: 0.75, color: 'text.secondary' }}>
            <EditNoteIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>
      </Collapse>
    </Box>
  )
}

export default SearchVersionCard
