import { Box, Typography, Paper, IconButton } from '@mui/material'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt'
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'

const TEAL   = '#1D9F9F'
const BLUE   = '#2196F3'
const PURPLE = '#9C4DD6'
const PINK   = '#CF2D8A'
const ORANGE = '#FF9800'
const GREEN  = '#4CAF50'
const RED    = '#F44336'

const X_LABELS = ['Jul 20', 'Jul 21', 'Jul 22', 'Jul 23', 'Jul 24', 'Jul 25', 'Jul 26']

const ENGAGEMENT_TREND = [28000, 24000, 52000, 9000, 22000, 25000, 30000]

const ENGAGEMENT_SOURCES = [
  { label: 'All',      color: BLUE,      data: [28000, 24000, 52000, 9000,  22000, 25000, 30000] },
  { label: 'News',     color: ORANGE,    data: [8800,  8800,  10000, 5000,  8000,  8500,  8800]  },
  { label: 'Twitter',  color: PINK,      data: [7600,  7600,  8000,  4000,  6500,  7000,  7600]  },
  { label: 'Reddit',   color: GREEN,     data: [1000,  1000,  1100,  500,   800,   900,   1000]  },
  { label: 'Pinterest',color: RED,       data: [49,    49,    52,    25,    35,    42,    49]    },
  { label: 'Comments', color: '#212121', data: [29,    29,    31,    15,    22,    26,    29]    },
  { label: 'Blogs',    color: PURPLE,    data: [9,     9,     10,    5,     7,     8,     9]     },
]

const ENGAGED_CONTENT = [
  { bg: '#1565C0', source: 'Pinterest', author: 'pixie6810', time: 'Nov 13, 9:21 AM', title: "Apple pie tastes better when it looks like a rose. Beautiful apple rose pastries made with cream cheese and cinnamon sugar, you're going to", reach: '153', engagement: '919.71k' },
  { bg: '#2E7D32', source: 'Pinterest', author: 'pixie6810', time: 'Nov 13, 9:21 AM', title: "Apple pie tastes better when it looks like a rose. Beautiful apple rose pastries made with cream cheese and cinnamon sugar, you're going to", reach: '153', engagement: '919.71k' },
  { bg: '#6A1B9A', source: 'Pinterest', author: 'pixie6810', time: 'Nov 13, 9:21 AM', title: "Apple pie tastes better when it looks like a rose. Beautiful apple rose pastries made with cream cheese and cinnamon sugar, you're going to", reach: '153', engagement: '919.71k' },
]

const TOPIC_WORDS = [
  { text: 'University of South Carolina', size: 30, color: TEAL },
  { text: 'South Carolina',               size: 24, color: '#212121' },
  { text: 'technology',                   size: 22, color: '#212121' },
  { text: 'Boston Red Sox',               size: 20, color: TEAL },
  { text: 'Richland County',              size: 18, color: '#212121' },
  { text: 'LLMs',                         size: 18, color: '#212121' },
  { text: 'GPT-4',                        size: 17, color: '#212121' },
  { text: 'Answer Engine',                size: 16, color: '#212121' },
  { text: 'IKEA',                         size: 15, color: '#212121' },
  { text: 'MLB',                          size: 15, color: '#212121' },
  { text: 'Dallas',                       size: 15, color: ORANGE },
  { text: 'Oscar Fernandez',              size: 14, color: BLUE },
  { text: 'Clemson University',           size: 14, color: '#212121' },
  { text: 'Facebook',                     size: 14, color: '#212121' },
  { text: 'patients',                     size: 13, color: '#212121' },
  { text: 'fans',                         size: 13, color: '#212121' },
  { text: 'United States',               size: 13, color: ORANGE },
  { text: 'Colombia',                     size: 13, color: ORANGE },
  { text: '#policeprofessionalism',       size: 12, color: ORANGE },
  { text: '#entirecountry',              size: 12, color: ORANGE },
  { text: 'Real Estate Agence',           size: 12, color: '#212121' },
  { text: 'coaching to ensure',           size: 12, color: '#212121' },
  { text: 'Brian Shield',                 size: 12, color: BLUE },
  { text: 'Don White',                    size: 12, color: BLUE },
  { text: 'Leon Lott',                    size: 12, color: BLUE },
  { text: 'Anthony Tassone',             size: 12, color: BLUE },
  { text: 'Dr. Ian Adams',               size: 12, color: BLUE },
  { text: 'public safety activities',    size: 11, color: '#212121' },
  { text: "Richland County Sheriff's Department", size: 11, color: '#212121' },
]

const TOPIC_LEGEND = [
  { label: 'Keywords',      color: RED    },
  { label: 'Hashtags',      color: ORANGE },
  { label: 'Organizations', color: '#1A237E' },
  { label: 'People',        color: BLUE   },
  { label: 'Locations',     color: GREEN  },
  { label: 'Products',      color: PURPLE },
]

// ── shared ui ─────────────────────────────────────────────────────────────────

function WidgetHeader({ title, action }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
        <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#212121' }}>{title}</Typography>
        <InfoOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {action}
        <IconButton size="small"><MoreVertIcon sx={{ fontSize: 18, color: 'text.secondary' }} /></IconButton>
      </Box>
    </Box>
  )
}

function MetricKpi({ label, value, delta, sub }) {
  const pos = delta >= 0
  return (
    <Box>
      <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 0.25 }}>{label}</Typography>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75, flexWrap: 'wrap' }}>
        <Typography sx={{ fontSize: 28, fontWeight: 700, color: '#212121', lineHeight: 1.1 }}>{value}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, bgcolor: pos ? '#E8F5E9' : '#FFEBEE', color: pos ? '#2E7D32' : '#C62828', fontSize: 11, fontWeight: 700, px: 0.75, py: 0.25, borderRadius: 1 }}>
          {pos ? <ArrowUpwardIcon sx={{ fontSize: 11 }} /> : null}
          {Math.abs(delta)}%
        </Box>
      </Box>
      {sub && <Typography sx={{ fontSize: 11, color: 'text.secondary', mt: 0.25 }}>{sub}</Typography>}
    </Box>
  )
}

function LineChart({ data, color = BLUE, height = 160 }) {
  const w = 800, h = height
  const max = Math.max(...data) || 1
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * (h - 8) - 4}`).join(' ')
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" width="100%" height={height} style={{ display: 'block' }}>
      <polygon points={`0,${h} ${pts} ${w},${h}`} fill={color} fillOpacity="0.08" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}

function MultiLineChart({ datasets, height = 140 }) {
  const w = 800, h = height
  const max = Math.max(...datasets.flatMap(d => d.data)) || 1
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" width="100%" height={height} style={{ display: 'block' }}>
      {datasets.map((ds, di) => {
        const pts = ds.data.map((v, i) => `${(i / (ds.data.length - 1)) * w},${h - (v / max) * (h - 4) - 2}`).join(' ')
        return <polyline key={di} points={pts} fill="none" stroke={ds.color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      })}
    </svg>
  )
}

function XLabels() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
      {X_LABELS.map(l => <Typography key={l} sx={{ fontSize: 11, color: 'text.secondary' }}>{l}</Typography>)}
    </Box>
  )
}

function ChartLegend({ datasets }) {
  return (
    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 1.25 }}>
      {datasets.map((ds, i) => (
        <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: ds.color, flexShrink: 0 }} />
          <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{ds.label}</Typography>
          {ds.value && <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{ds.value}</Typography>}
        </Box>
      ))}
    </Box>
  )
}

// ── main export ───────────────────────────────────────────────────────────────

export default function EngagementTabContent({ loading }) {
  if (loading) return null
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>

      {/* AI Insight */}
      <Box sx={{ pt: 2 }}>
        <Box sx={{ p: '1.5px', borderRadius: 2, background: 'linear-gradient(135deg, #9C4DD6 0%, #CF2D8A 40%, #1D9F9F 100%)' }}>
          <Box sx={{ bgcolor: 'background.paper', borderRadius: '6px', p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <AutoAwesomeIcon sx={{ fontSize: 16, color: PURPLE }} />
                <Typography sx={{ fontSize: 13, fontWeight: 700, background: 'linear-gradient(90deg, #9C4DD6 0%, #CF2D8A 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  Engagement Insight
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <IconButton size="small" sx={{ p: 0.5 }}><ThumbUpOffAltIcon sx={{ fontSize: 18, color: 'text.secondary' }} /></IconButton>
                <IconButton size="small" sx={{ p: 0.5 }}><ThumbDownOffAltIcon sx={{ fontSize: 18, color: 'text.secondary' }} /></IconButton>
                <IconButton size="small" sx={{ p: 0.5 }}><ContentCopyIcon sx={{ fontSize: 18, color: 'text.secondary' }} /></IconButton>
              </Box>
            </Box>
            <Box component="ul" sx={{ m: 0, pl: 2.5, mb: 1.5 }}>
              {[
                'Total engagement peaked on Jul 22 at 52k — a 96% lift over the prior week average, driven largely by Pinterest shares and News reposts.',
                'Pinterest accounts for a disproportionate share of engagement relative to mention volume, indicating high visual content amplification.',
                'Top engaged content is concentrated in food and lifestyle topics — brand-adjacent conversations with strong organic reach potential.',
              ].map((t, i) => (
                <Typography key={i} component="li" sx={{ fontSize: 14, lineHeight: '22px', color: '#212121', mb: 0.75 }}>{t}</Typography>
              ))}
            </Box>
            <Typography sx={{ fontSize: 14, fontWeight: 700, color: TEAL, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>View More Insights</Typography>
          </Box>
        </Box>
      </Box>

      {/* Engagement Trend */}
      <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#212121' }}>Engagement Trend</Typography>
            <InfoOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, border: '1px solid #e0e0e0', borderRadius: 0.5, px: 1, py: 0.5, cursor: 'pointer' }}>
              <Typography sx={{ fontSize: 12, color: '#424242' }}>Engagement type</Typography>
              <Box component="span" sx={{ fontSize: 12, color: 'text.secondary' }}>▾</Box>
            </Box>
            <IconButton size="small"><DownloadOutlinedIcon sx={{ fontSize: 18, color: 'text.secondary' }} /></IconButton>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 4, mb: 2 }}>
          <MetricKpi label="Total Engagement" value="17.6k" delta={96} sub="Previously 9.01k" />
          <Box sx={{ width: 1, bgcolor: '#e0e0e0' }} />
          <MetricKpi label="Daily Average" value="2.52k" delta={96} sub="Previously 1.29k" />
        </Box>
        <LineChart data={ENGAGEMENT_TREND} color={BLUE} height={160} />
        <XLabels />
      </Paper>

      {/* Engagement Trend by Source Type */}
      <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#212121' }}>Engagement Trend by Source Type</Typography>
            <InfoOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          </Box>
          <IconButton size="small"><DownloadOutlinedIcon sx={{ fontSize: 18, color: 'text.secondary' }} /></IconButton>
        </Box>
        <MultiLineChart datasets={ENGAGEMENT_SOURCES} height={160} />
        <XLabels />
        <ChartLegend datasets={[
          { label: 'All',      color: BLUE,      value: '17.6k' },
          { label: 'News',     color: ORANGE,    value: '8.87k' },
          { label: 'Twitter',  color: PINK,      value: '7.69k' },
          { label: 'Reddit',   color: GREEN,     value: '1k'    },
          { label: 'Pinterest',color: RED,       value: '49'    },
          { label: 'Comments', color: '#212121', value: '29'    },
          { label: 'Blogs',    color: PURPLE,    value: '9'     },
        ]} />
      </Paper>

      {/* Most Engaged Content */}
      <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#212121' }}>Most Engaged Content</Typography>
            <InfoOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: TEAL, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>View Full Analysis</Typography>
            <IconButton size="small"><MoreVertIcon sx={{ fontSize: 18, color: 'text.secondary' }} /></IconButton>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          {ENGAGED_CONTENT.map((item, i) => (
            <Box key={i} sx={{ flex: 1, minWidth: 180, border: '1px solid #e0e0e0', borderRadius: 1, overflow: 'hidden' }}>
              <Box sx={{ height: 110, bgcolor: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography sx={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Image</Typography>
              </Box>
              <Box sx={{ p: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                  <Box sx={{ width: 18, height: 18, borderRadius: '50%', bgcolor: '#e0e0e0' }} />
                  <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{item.source}</Typography>
                </Box>
                <Typography sx={{ fontSize: 11, color: 'text.secondary', mb: 0.5 }}>{item.source} · {item.time}</Typography>
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#212121', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {item.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{item.reach} Reach</Typography>
                  <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{item.engagement} Engagement</Typography>
                  <Box sx={{ ml: 'auto', width: 8, height: 8, borderRadius: '50%', bgcolor: GREEN }} />
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
        <Typography sx={{ fontSize: 12, color: 'text.secondary', textAlign: 'center', mt: 1.5 }}>1 - 3 of 30</Typography>
      </Paper>

      {/* Top Engaged Topics */}
      <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#212121' }}>Top Engaged Topics</Typography>
            <InfoOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          </Box>
          <IconButton size="small"><DownloadOutlinedIcon sx={{ fontSize: 18, color: 'text.secondary' }} /></IconButton>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 1.5 }}>
          {TOPIC_LEGEND.map(l => (
            <Box key={l.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: l.color, flexShrink: 0 }} />
              <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{l.label}</Typography>
            </Box>
          ))}
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.25, alignItems: 'center', justifyContent: 'center', py: 2, minHeight: 220 }}>
          {TOPIC_WORDS.map((w, i) => (
            <Typography key={i} sx={{ fontSize: w.size, color: w.color, lineHeight: 1.3, cursor: 'pointer', '&:hover': { opacity: 0.75 } }}>
              {w.text}
            </Typography>
          ))}
        </Box>
      </Paper>

    </Box>
  )
}
