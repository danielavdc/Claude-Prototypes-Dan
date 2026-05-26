import { useState } from 'react'
import { Box, Typography, Paper, IconButton, Button, Tooltip, Divider, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import InsertLinkIcon from '@mui/icons-material/InsertLink'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import SaveIcon from '@mui/icons-material/Save'
import SaveAsIcon from '@mui/icons-material/SaveAs'

const BRANDS = [
  { name: 'Tesla',   color: '#2196F3' },
  { name: 'BMW',     color: '#FFC107' },
  { name: 'Porsche', color: '#E91E63' },
  { name: 'Nio Inc', color: '#26C6DA' },
]

const TREND = {
  labels: ['Aug 25', 'Aug 27', 'Aug 29', 'Aug 31'],
  series: [
    { name: 'Tesla',   color: '#2196F3', count: '10.7k', values: [50, 95, 17, 53] },
    { name: 'BMW',     color: '#FFC107', count: '10.7k', values: [25, 47, 5,  25] },
    { name: 'Porsche', color: '#E91E63', count: '10.7k', values: [12, 37, 17, 12] },
    { name: 'Nio Inc', color: '#26C6DA', count: '10.7k', values: [37, 25, 12, 13] },
  ],
}

const SOV_DATA = [
  { name: 'Tesla',   color: '#2196F3', pct: 42 },
  { name: 'BMW',     color: '#FFC107', pct: 26 },
  { name: 'Porsche', color: '#E91E63', pct: 19 },
  { name: 'Nio Inc', color: '#26C6DA', pct: 13 },
]

const Y_LABELS = [60, 40, 20, 0]
const MAX_V = 60
const CIRC = 2 * Math.PI * 35 // ≈ 219.9

function BrandChip({ brand }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, border: '1px solid #e0e0e0', borderRadius: '16px', px: 1.25, py: 0.5, cursor: 'pointer', bgcolor: 'background.paper', '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } }}>
      <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: brand.color, flexShrink: 0 }} />
      <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#212121' }}>{brand.name}</Typography>
      <ArrowDropDownIcon sx={{ fontSize: 16, color: '#757575' }} />
    </Box>
  )
}

function DonutChart({ data }) {
  let offset = 0
  const segments = data.map(d => {
    const arc = (d.pct / 100) * CIRC
    const seg = { ...d, arc, offset }
    offset += arc
    return seg
  })

  return (
    <svg width="140" height="140" viewBox="0 0 100 100">
      {segments.map(s => (
        <circle
          key={s.name}
          cx="50" cy="50" r="35"
          fill="none"
          stroke={s.color}
          strokeWidth="18"
          strokeDasharray={`${s.arc} ${CIRC - s.arc}`}
          strokeDashoffset={-s.offset + CIRC / 4}
          style={{ transition: 'stroke-dasharray 0.3s' }}
        />
      ))}
      <text x="50" y="47" textAnchor="middle" fontSize="8" fontWeight="700" fill="#212121">{data[0].name}</text>
      <text x="50" y="57" textAnchor="middle" fontSize="7" fill="#757575">{data[0].pct}%</text>
    </svg>
  )
}

export default function ComparePage({ onBack }) {
  const [downloadAnchor, setDownloadAnchor] = useState(null)
  const [saveAnchor, setSaveAnchor] = useState(null)

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', bgcolor: '#f5f5f5' }}>

      {/* Toolbar */}
      <Box sx={{ flexShrink: 0, bgcolor: 'background.paper', borderBottom: '1px solid #e0e0e0', px: 1.5, height: 52, display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton size="small" onClick={onBack}><ArrowBackIcon sx={{ fontSize: 20, color: '#616161' }} /></IconButton>
        <Button size="small" endIcon={<ArrowDropDownIcon sx={{ fontSize: 16 }} />}
          sx={{ color: '#212121', fontWeight: 500, fontSize: 14, textTransform: 'none', borderRadius: 0.5 }}>
          Untitled Compare
        </Button>
        <Button size="small" startIcon={<CalendarTodayIcon sx={{ fontSize: 14 }} />} endIcon={<ArrowDropDownIcon sx={{ fontSize: 16 }} />}
          sx={{ color: '#424242', fontWeight: 400, fontSize: 13, textTransform: 'none', border: '1px solid #e0e0e0', borderRadius: 0.5, px: 1 }}>
          Last 7 days
        </Button>
        <Box sx={{ flex: 1 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          <Tooltip title="Create Monitor View" arrow>
            <IconButton size="small" sx={{ width: 36, height: 36, borderRadius: '50%', '&:hover': { bgcolor: 'rgba(0,0,0,0.08)' } }}>
              <Box component="img" src="/add-monitor.png" alt="Create Monitor View" sx={{ width: 20, height: 20, objectFit: 'contain' }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Export and Share" arrow>
            <IconButton size="small" onClick={(e) => setDownloadAnchor(e.currentTarget)} sx={{ width: 36, height: 36, borderRadius: '50%', '&:hover': { bgcolor: 'rgba(0,0,0,0.08)' } }}>
              <FileDownloadOutlinedIcon sx={{ fontSize: 20, color: '#212121' }} />
            </IconButton>
          </Tooltip>
        </Box>
        <Button variant="contained" size="small" endIcon={<ArrowDropDownIcon sx={{ fontSize: 16 }} />}
          onClick={(e) => setSaveAnchor(e.currentTarget)}
          sx={{ bgcolor: '#B627A1', color: 'white', fontWeight: 700, fontSize: 14, height: 36, borderRadius: 0.5, px: 2, '&:hover': { bgcolor: '#9C1F8A' } }}>
          Save
        </Button>
        <IconButton size="small"><KeyboardArrowUpIcon sx={{ fontSize: 20, color: '#616161' }} /></IconButton>
      </Box>

      {/* Brand chips + split by */}
      <Box sx={{ flexShrink: 0, bgcolor: 'background.paper', borderBottom: '1px solid #e0e0e0' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 1.25, flexWrap: 'wrap' }}>
          {BRANDS.map(b => <BrandChip key={b.name} brand={b} />)}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: 1.25, py: 0.5, border: '1px dashed #bdbdbd', borderRadius: '16px', cursor: 'pointer', '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } }}>
            <AddCircleOutlineIcon sx={{ fontSize: 16, color: '#757575' }} />
            <Typography sx={{ fontSize: 13, color: '#757575' }}>Add</Typography>
          </Box>
        </Box>
        <Divider />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 0.75 }}>
          <Button size="small" endIcon={<ArrowDropDownIcon sx={{ fontSize: 16 }} />}
            sx={{ color: '#424242', fontWeight: 500, fontSize: 13, textTransform: 'none', border: '1px solid #e0e0e0', borderRadius: 0.5, py: 0.25 }}>
            Split by
          </Button>
          <Tooltip title="Split results by attribute" arrow>
            <InfoOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          </Tooltip>
        </Box>
      </Box>

      {/* Scrollable content */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>

        {/* Mentions Trend by Search */}
        <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, p: 2 }}>
          {/* Card header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#212121' }}>Mentions Trend by Search</Typography>
              <Tooltip title="Mentions over time per search" arrow><InfoOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} /></Tooltip>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Button size="small" endIcon={<ArrowDropDownIcon sx={{ fontSize: 14 }} />} sx={{ color: '#424242', textTransform: 'none', fontSize: 13, fontWeight: 400 }}>Absolute</Button>
              <Button size="small" endIcon={<ArrowDropDownIcon sx={{ fontSize: 14 }} />} sx={{ color: '#424242', textTransform: 'none', fontSize: 13, fontWeight: 400 }}>Daily</Button>
              <IconButton size="small"><MoreVertIcon sx={{ fontSize: 18, color: '#616161' }} /></IconButton>
            </Box>
          </Box>

          {/* Legend */}
          <Box sx={{ display: 'flex', gap: 3, mb: 2, flexWrap: 'wrap' }}>
            {TREND.series.map(s => (
              <Box key={s.name} sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: s.color }} />
                  <Typography sx={{ fontSize: 12, color: '#212121' }}>{s.name}</Typography>
                </Box>
                <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#212121', pl: 2.25 }}>{s.count}</Typography>
              </Box>
            ))}
          </Box>

          {/* Chart */}
          <Box sx={{ display: 'flex', minHeight: 280 }}>
            {/* Y-axis */}
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', pr: 1, pb: '24px', flexShrink: 0 }}>
              {Y_LABELS.map(v => (
                <Typography key={v} sx={{ fontSize: 11, color: '#757575', lineHeight: 1 }}>
                  {v === 0 ? '0' : `${v / 10}0k`}
                </Typography>
              ))}
            </Box>
            {/* SVG area */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ flex: 1, position: 'relative' }}>
                <svg width="100%" height="100%" viewBox="0 0 300 100" preserveAspectRatio="none" style={{ display: 'block' }}>
                  {/* Grid lines */}
                  {[0, 1, 2, 3].map(i => (
                    <line key={i} x1="0" y1={`${(i / 3) * 100}`} x2="300" y2={`${(i / 3) * 100}`}
                      stroke="#e0e0e0" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                  ))}
                  {/* Trend lines */}
                  {TREND.series.map(s => {
                    const w = 300 / (s.values.length - 1)
                    const pts = s.values.map((v, i) => `${i * w},${100 - (v / MAX_V) * 100}`).join(' ')
                    return (
                      <polyline key={s.name} points={pts} fill="none" stroke={s.color}
                        strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                    )
                  })}
                </svg>
              </Box>
              {/* X-axis */}
              <Box sx={{ height: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {TREND.labels.map(l => <Typography key={l} sx={{ fontSize: 11, color: '#757575' }}>{l}</Typography>)}
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* Share of Voice cards */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>

          {/* Donut card */}
          <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#212121' }}>Share of Voice by Mentions</Typography>
                <Tooltip title="Share of voice across brands" arrow><InfoOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} /></Tooltip>
              </Box>
              <IconButton size="small"><FileDownloadOutlinedIcon sx={{ fontSize: 18, color: '#616161' }} /></IconButton>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <DonutChart data={SOV_DATA} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {SOV_DATA.map(d => (
                  <Box key={d.name} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: d.color, flexShrink: 0 }} />
                    <Typography sx={{ fontSize: 13, color: '#212121', minWidth: 60 }}>{d.name}</Typography>
                    <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#212121' }}>{d.pct}%</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Paper>

          {/* Horizontal bar card */}
          <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#212121' }}>Share of Voice by Mentions</Typography>
                <Tooltip title="Share of voice across brands" arrow><InfoOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} /></Tooltip>
              </Box>
              <IconButton size="small"><FileDownloadOutlinedIcon sx={{ fontSize: 18, color: '#616161' }} /></IconButton>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, pt: 1 }}>
              {SOV_DATA.map(d => (
                <Box key={d.name}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                      <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: d.color, flexShrink: 0 }} />
                      <Typography sx={{ fontSize: 13, color: '#212121' }}>{d.name}</Typography>
                    </Box>
                    <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#212121' }}>{d.pct}%</Typography>
                  </Box>
                  <Box sx={{ height: 14, bgcolor: '#f0f0f0', borderRadius: 1, overflow: 'hidden' }}>
                    <Box sx={{ width: `${d.pct}%`, height: '100%', bgcolor: d.color, borderRadius: 1 }} />
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* Save dropdown */}
      <Menu anchorEl={saveAnchor} open={Boolean(saveAnchor)} onClose={() => setSaveAnchor(null)}
        PaperProps={{ elevation: 4, sx: { width: 220, borderRadius: 1, mt: 0.5, boxShadow: '0px 4px 5px rgba(0,0,0,0.14), 0px 2px 4px rgba(0,0,0,0.12), 0px 1px 10px rgba(0,0,0,0.2)' } }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {[
          { icon: <SaveIcon sx={{ fontSize: 22, color: '#212121' }} />, label: 'Save' },
          { icon: <SaveAsIcon sx={{ fontSize: 22, color: '#212121' }} />, label: 'Save as...' },
        ].map((item, i) => (
          <MenuItem key={i} onClick={() => setSaveAnchor(null)} sx={{ py: 1.25, px: 2, height: 48 }}>
            <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText>
              <Typography sx={{ fontSize: 15, fontWeight: 400, color: '#212121' }}>{item.label}</Typography>
            </ListItemText>
          </MenuItem>
        ))}
      </Menu>

      {/* Download & Share dropdown */}
      <Menu anchorEl={downloadAnchor} open={Boolean(downloadAnchor)} onClose={() => setDownloadAnchor(null)}
        PaperProps={{ elevation: 4, sx: { width: 320, borderRadius: 1, mt: 0.5, boxShadow: '0px 4px 5px rgba(0,0,0,0.14), 0px 2px 4px rgba(0,0,0,0.12), 0px 1px 10px rgba(0,0,0,0.2)' } }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, pt: 1.5, pb: 0.5 }}>
          <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#616161', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Share</Typography>
        </Box>
        <MenuItem onClick={() => setDownloadAnchor(null)} sx={{ py: 1.5, px: 2 }}>
          <ListItemIcon sx={{ minWidth: 40 }}><InsertLinkIcon sx={{ fontSize: 22, color: '#616161' }} /></ListItemIcon>
          <ListItemText>
            <Typography sx={{ fontSize: 15, fontWeight: 500, color: '#212121' }}>Shareable Link</Typography>
            <Typography sx={{ fontSize: 13, color: '#616161' }}>Includes all tabs</Typography>
          </ListItemText>
          <ChevronRightIcon sx={{ fontSize: 20, color: '#9e9e9e' }} />
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <Box sx={{ px: 2, pt: 1.5, pb: 0.5 }}>
          <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#616161', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Export</Typography>
        </Box>
        {[
          { icon: <Box component="img" src="/excel.png" alt="" sx={{ width: 22, height: 22, objectFit: 'contain' }} />, label: 'Excel', hasArrow: false },
          { icon: <Box component="img" src="/pdf.png" alt="" sx={{ width: 22, height: 22, objectFit: 'contain' }} />, label: 'PDF', hasArrow: true },
          { icon: <Box component="img" src="/powerpoint.png" alt="" sx={{ width: 22, height: 22, objectFit: 'contain' }} />, label: 'PowerPoint', hasArrow: true },
          { icon: <Box component="img" src="/googleslides.png" alt="" sx={{ width: 22, height: 22, objectFit: 'contain' }} />, label: 'Google Slides', hasArrow: true },
        ].map((item, i) => (
          <MenuItem key={i} onClick={() => setDownloadAnchor(null)} sx={{ py: 1.5, px: 2 }}>
            <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText>
              <Typography sx={{ fontSize: 15, fontWeight: 500, color: '#212121' }}>{item.label}</Typography>
            </ListItemText>
            {item.hasArrow && <ChevronRightIcon sx={{ fontSize: 20, color: '#9e9e9e' }} />}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  )
}
