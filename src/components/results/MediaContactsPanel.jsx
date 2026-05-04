import { useState } from 'react'
import { Box, Typography, Paper, Checkbox, IconButton, Tooltip, Chip, Avatar } from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined'
import SortIcon from '@mui/icons-material/Sort'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt'
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined'
import WidgetMenu from './WidgetMenu'

const JOURNALISTS = [
  { rank: 1, name: 'Jenessa Abrams', location: 'New York, New York, USA', outlet: 'CNN', mentions: 2, role: 'Featured Writer', source: 'Tasting Tables', socials: ['x', 'li'], color: '#CC0000' },
  { rank: 2, name: 'USA Today', location: 'Miami, Florida, USA', outlet: 'USA Today', mentions: 6, role: 'Contributor', source: 'Aventura Magazine, Eater Miami, Mi...', socials: ['x', 'li', 'ig', 'fb'], color: '#009BDE' },
  { rank: 3, name: 'The New York Times', location: 'United States', outlet: 'NYT', mentions: 5, role: 'Freelance Trave...', source: 'AFAR, Food & Wine Magazine, Gard...', socials: ['x', 'li', 'yt'], color: '#000000' },
  { rank: 4, name: 'The Guardian', location: 'El Segundo, CA, USA', outlet: 'Guardian', mentions: 5, role: 'Restaurant Critic', source: 'Los Angeles Times', socials: ['x', 'li', 'ig', 'fb', 'yt'], color: '#052962' },
  { rank: 5, name: 'Mountain Weekly News', location: 'United States', outlet: 'MWN', mentions: 8, role: 'Head of Life', source: 'Star Tribune', socials: ['x', 'li', 'ig', 'fb'], color: '#1D7B3A' },
  { rank: 6, name: 'Mountain Weekly News', location: 'United States', outlet: 'MWN', mentions: 8, role: 'Health Writer', source: 'HuffPost', socials: ['x', 'li', 'ig', 'fb'], color: '#1D7B3A' },
  { rank: 7, name: 'Mountain Weekly News', location: 'United States', outlet: 'MWN', mentions: 8, role: 'Blogger', source: 'Associate Press', socials: ['x', 'li', 'ig', 'fb'], color: '#1D7B3A' },
]

const RANKING_DATA = [
  { rank: 1, name: 'Rafael Rivera', role: 'Featured Writer', outlet: 'Money Morning', reach: 134 },
  { rank: 2, name: 'Lindsey Barr', role: 'Contributing Editor', outlet: 'The Daily Beast', reach: 112 },
  { rank: 3, name: 'Alexandra Bird', role: 'Staff Reporter', outlet: 'Bloomberg', reach: 98 },
  { rank: 4, name: 'Alyssa Geller', role: 'Freelance Writer', outlet: 'Axios', reach: 54 },
  { rank: 5, name: 'Ralph D. Russo', role: 'Senior Correspondent', outlet: 'AP News', reach: 12 },
]
const maxReach = Math.max(...RANKING_DATA.map(d => d.reach))

const BAR_DATA = [
  { name: 'Matt Roush', value: 52100, color: '#5C6BC0' },
  { name: 'Lindsey Barr', value: 38300, color: '#FFA726' },
  { name: 'Alexandra Bird', value: 30900, color: '#EC407A' },
  { name: 'Alyssa Geller', value: 13100, color: '#66BB6A' },
  { name: 'Ralph D. Russo', value: 13100, color: '#FF7043' },
]

const TREND_DATA = {
  labels: ['Aug 25', 'Aug 27', 'Aug 29', 'Aug 31'],
  series: [
    { name: 'Matt Roush', color: '#5C6BC0', values: [55, 20, 45, 15] },
    { name: 'Lindsey Barr', color: '#FFA726', values: [35, 55, 25, 40] },
    { name: 'Alexandra Bird', color: '#EC407A', values: [20, 30, 10, 35] },
    { name: '+1', color: '#9E9E9E', values: [10, 15, 20, 10] },
  ],
}

const KEYWORDS = [
  { text: 'Boston Red Sox', size: 20, color: '#1A237E' },
  { text: 'Richland County', size: 18, color: '#66BB6A' },
  { text: 'IKEA', size: 14, color: '#1A237E' },
  { text: 'Answer Engine', size: 14, color: '#1A237E' },
  { text: 'MLB', size: 14, color: '#1A237E' },
  { text: 'fans', size: 12, color: '#FF9800' },
  { text: 'patients', size: 24, color: '#E91E90' },
  { text: '#policeprofessionalism', size: 12, color: '#F9A825' },
  { text: 'LLMs', size: 22, color: '#42A5F5' },
  { text: 'Real Estate Agence', size: 13, color: '#1A237E' },
  { text: 'coaching to ensure', size: 12, color: '#E91E90' },
  { text: 'Facebook', size: 14, color: '#1A237E' },
  { text: 'GPT-4', size: 20, color: '#7B1FA2' },
  { text: 'Clemson University', size: 14, color: '#1A237E' },
  { text: 'Oscar Fernandez', size: 13, color: '#42A5F5' },
  { text: 'Dallas', size: 16, color: '#66BB6A' },
  { text: 'University of South Carolina', size: 28, color: '#42A5F5' },
  { text: 'technology', size: 20, color: '#7B1FA2' },
  { text: 'Colombia', size: 18, color: '#66BB6A' },
  { text: 'Brian Shield', size: 22, color: '#42A5F5' },
  { text: 'United States', size: 16, color: '#66BB6A' },
  { text: 'Don White', size: 14, color: '#42A5F5' },
  { text: 'Leon Lott', size: 13, color: '#42A5F5' },
  { text: '#entirecountry', size: 13, color: '#F9A825' },
  { text: 'public safety activities', size: 13, color: '#E91E90' },
  { text: 'Anthony Tassone', size: 13, color: '#42A5F5' },
  { text: 'Dr. Ian Adams', size: 13, color: '#42A5F5' },
  { text: 'Richland County Sheriff\'s Department', size: 15, color: '#1A237E' },
  { text: 'South Carolina', size: 24, color: '#66BB6A' },
]

const SOCIAL_COLORS = { x: '#000', li: '#0077B5', ig: '#E1306C', fb: '#1877F2', yt: '#FF0000' }
const SOCIAL_LABELS = { x: 'X', li: 'in', ig: 'ig', fb: 'f', yt: '▶' }

const maxBar = Math.max(...BAR_DATA.map(d => d.value))
const chartH = 260

function SocialBadge({ type }) {
  return (
    <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: SOCIAL_COLORS[type], display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Typography sx={{ fontSize: 10, fontWeight: 700, color: 'white', lineHeight: 1 }}>{SOCIAL_LABELS[type]}</Typography>
    </Box>
  )
}

export default function MediaContactsPanel({ onDashboardSave }) {
  const [selected, setSelected] = useState([])
  const [page, setPage] = useState(1)

  const toggle = (rank) => setSelected(prev => prev.includes(rank) ? prev.filter(r => r !== rank) : [...prev, rank])

  return (
    <>
      {/* Media Contacts Insight AI card */}
      <Box sx={{ p: '1.5px', borderRadius: 2, background: 'linear-gradient(135deg, #9C4DD6 0%, #CF2D8A 40%, #1D9F9F 100%)' }}>
        <Box sx={{ bgcolor: 'background.paper', borderRadius: '6px', p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <AutoAwesomeIcon sx={{ fontSize: 16, color: '#9C4DD6' }} />
              <Typography sx={{ fontSize: 13, fontWeight: 700, background: 'linear-gradient(90deg, #9C4DD6 0%, #CF2D8A 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Media Contacts Insight
              </Typography>
            </Box>
            <WidgetMenu onDashboardSave={onDashboardSave} showRegenerate />
          </Box>
          <Typography sx={{ fontSize: 14, lineHeight: '22px', color: '#212121', mb: 1.5 }}>
            PepsiCo is doubling down on energy drinks with a $585M stake in Celsius, gaining U.S. and Canada rights to Rockstar and expanding Alani Nu distribution. At the same time, it's innovating with Pepsi Prebiotic Cola, a low-sugar, fiber-infused soda, and diversifying flavors with Mountain Dew Honeydew. Analysts highlight strong market growth and positive stock reactio...
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton size="small" sx={{ p: 0.5 }}><ThumbUpOffAltIcon sx={{ fontSize: 18, color: 'text.secondary' }} /></IconButton>
            <IconButton size="small" sx={{ p: 0.5 }}><ThumbDownOffAltIcon sx={{ fontSize: 18, color: 'text.secondary' }} /></IconButton>
            <IconButton size="small" sx={{ p: 0.5 }}><ContentCopyIcon sx={{ fontSize: 18, color: 'text.secondary' }} /></IconButton>
          </Box>
        </Box>
      </Box>

      {/* Top Media Contacts Ranking table */}
      <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, height: 676, display: 'flex', flexDirection: 'column' }}>
        {/* Title bar */}
        <Box sx={{ px: 2, pt: 1.5, pb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#212121' }}>Top Media Contacts Ranking</Typography>
            <Tooltip title="Media Contacts ranked by reach" arrow><InfoOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} /></Tooltip>
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton size="small"><FilterAltOutlinedIcon sx={{ fontSize: 18, color: '#616161' }} /></IconButton>
            <IconButton size="small"><SortIcon sx={{ fontSize: 18, color: '#616161' }} /></IconButton>
            <IconButton size="small"><MoreVertIcon sx={{ fontSize: 18, color: '#616161' }} /></IconButton>
          </Box>
        </Box>
        {/* Column headers */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '36px 24px minmax(0,1fr) 60px 90px minmax(0,1fr) 110px 56px 56px', alignItems: 'end', px: 1.5, py: 0.75, borderBottom: '1px solid #e0e0e0', bgcolor: '#fafafa' }}>
          <Checkbox size="small" sx={{ p: 0.25, '&.Mui-checked': { color: '#00827F' } }} />
          <Box />
          <Typography sx={{ fontSize: 12, fontWeight: 500, color: '#757575' }}>Name</Typography>
          <Typography sx={{ fontSize: 12, fontWeight: 500, color: '#757575', lineHeight: 1.3 }}>Relevant{'\n'}Mentions</Typography>
          <Typography sx={{ fontSize: 12, fontWeight: 500, color: '#757575' }}>Role</Typography>
          <Typography sx={{ fontSize: 12, fontWeight: 500, color: '#757575' }}>Source</Typography>
          <Typography sx={{ fontSize: 12, fontWeight: 500, color: '#757575' }}>Social Profiles</Typography>
          <Typography sx={{ fontSize: 12, fontWeight: 500, color: '#757575', lineHeight: 1.3, textAlign: 'center' }}>View{'\n'}Profile</Typography>
          <Typography sx={{ fontSize: 12, fontWeight: 500, color: '#757575', lineHeight: 1.3, textAlign: 'center' }}>Add{'\n'}to List</Typography>
        </Box>
        {/* Rows */}
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          {JOURNALISTS.map((j) => (
            <Box key={j.rank} sx={{ display: 'grid', gridTemplateColumns: '36px 24px minmax(0,1fr) 60px 90px minmax(0,1fr) 110px 56px 56px', alignItems: 'center', px: 1.5, py: 1, borderBottom: '1px solid #f0f0f0', '&:hover': { bgcolor: '#fafafa' } }}>
              <Checkbox size="small" sx={{ p: 0.25, '&.Mui-checked': { color: '#00827F' } }} />
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#757575' }}>{j.rank}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
                <Box sx={{ position: 'relative', flexShrink: 0 }}>
                  <Avatar sx={{ width: 34, height: 34, bgcolor: j.color, fontSize: 11, fontWeight: 700 }}>{j.outlet.slice(0, 2)}</Avatar>
                  <Box sx={{ position: 'absolute', bottom: -2, right: -2, width: 16, height: 16, borderRadius: '50%', bgcolor: '#e0e0e0', border: '1.5px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ArticleOutlinedIcon sx={{ fontSize: 10, color: '#616161' }} />
                  </Box>
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#212121', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{j.name}</Typography>
                  <Typography sx={{ fontSize: 11, color: '#757575', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{j.location}</Typography>
                </Box>
              </Box>
              <Typography sx={{ fontSize: 13, color: '#212121', textAlign: 'center', fontWeight: 500 }}>{j.mentions}</Typography>
              <Typography sx={{ fontSize: 12, color: '#212121', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{j.role}</Typography>
              <Typography sx={{ fontSize: 12, color: '#757575', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{j.source}</Typography>
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', alignItems: 'center' }}>
                {j.socials.map(s => <SocialBadge key={s} type={s} />)}
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <IconButton size="small"><PersonOutlineIcon sx={{ fontSize: 20, color: '#9e9e9e' }} /></IconButton>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <IconButton size="small"><PlaylistAddIcon sx={{ fontSize: 20, color: '#9e9e9e' }} /></IconButton>
              </Box>
            </Box>
          ))}
        </Box>
        {/* Pagination */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', px: 2, py: 1, gap: 0.5, borderTop: '1px solid #f0f0f0' }}>
          <Typography sx={{ fontSize: 13, color: '#212121' }}>1 - 10 of 30</Typography>
          <IconButton size="small"><NavigateBeforeIcon sx={{ fontSize: 18, color: '#9e9e9e' }} /></IconButton>
          <IconButton size="small"><NavigateNextIcon sx={{ fontSize: 18, color: '#212121' }} /></IconButton>
        </Box>
      </Paper>

      {/* Breakdown + Trend side by side */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 1.5 }}>
        {/* Top Media Contacts Breakdown bar chart */}
        <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, p: 2, flex: 1, minWidth: 0, height: 415, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#212121' }}>Top Media Contacts Breakdown</Typography>
              <Tooltip title="Mentions per journalist" arrow><InfoOutlinedIcon sx={{ fontSize: 15, color: 'text.secondary' }} /></Tooltip>
            </Box>
            <IconButton size="small"><MoreVertIcon sx={{ fontSize: 18, color: '#616161' }} /></IconButton>
          </Box>
          {/* Y axis + bars */}
          <Box sx={{ flex: 1, display: 'flex', minHeight: 0, minWidth: 0, overflow: 'hidden' }}>
            {/* Y axis labels — span full bar area, offset bottom 24px for x-label footer */}
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', pr: 0.75, pb: '24px', flexShrink: 0 }}>
              {[60, 50, 40, 30, 20, 10, 0].map(v => (
                <Typography key={v} sx={{ fontSize: 10, color: '#212121', lineHeight: 1 }}>{v === 0 ? '0' : `${v / 10}0k`}</Typography>
              ))}
            </Box>
            {/* Bars + X labels */}
            <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
              {/* Bar area fills remaining height */}
              <Box sx={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'flex-end', gap: '4px', minHeight: 0 }}>
                {[0, 1, 2, 3, 4, 5, 6].map(i => (
                  <Box key={i} sx={{ position: 'absolute', left: 0, right: 0, bottom: `${(i / 6) * 100}%`, borderBottom: '1px solid #f0f0f0' }} />
                ))}
                {BAR_DATA.map((d) => (
                  <Box key={d.name} sx={{ flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%', zIndex: 1, overflow: 'hidden' }}>
                    <Typography sx={{ fontSize: 10, color: '#212121', fontWeight: 600, mb: 0.5, whiteSpace: 'nowrap' }}>{`${(d.value/1000).toFixed(1)}k`}</Typography>
                    <Box sx={{ width: '100%', height: `calc(${(d.value / maxBar) * 100}% - 20px)`, bgcolor: d.color, borderRadius: '2px 2px 0 0' }} />
                  </Box>
                ))}
              </Box>
              {/* X axis label footer — 24px */}
              <Box sx={{ height: 24, display: 'flex', gap: '4px', alignItems: 'center' }}>
                {BAR_DATA.map((d) => (
                  <Typography key={d.name} sx={{ flex: '1 1 0', minWidth: 0, fontSize: 10, color: '#424242', textAlign: 'center', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {d.name}
                  </Typography>
                ))}
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* Top Media Contacts Trend line chart */}
        <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, p: 2, flex: 1, minWidth: 0, height: 415, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#212121' }}>Top Media Contacts Trend</Typography>
              <Tooltip title="Trend over time" arrow><InfoOutlinedIcon sx={{ fontSize: 15, color: 'text.secondary' }} /></Tooltip>
            </Box>
            <IconButton size="small"><MoreVertIcon sx={{ fontSize: 18, color: '#616161' }} /></IconButton>
          </Box>
          {/* Legend */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1.5, alignItems: 'center' }}>
            {TREND_DATA.series.slice(0, 3).map(s => (
              <Box key={s.name} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: s.color }} />
                <Typography sx={{ fontSize: 11, color: '#212121' }}>{s.name}</Typography>
              </Box>
            ))}
            <Chip label="+1" size="small" variant="outlined" sx={{ height: 20, fontSize: 11, fontWeight: 600 }} />
          </Box>
          {/* SVG line chart with Y-axis */}
          <Box sx={{ flex: 1, display: 'flex', minHeight: 0 }}>
            {/* Y-axis labels */}
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', pr: 0.75, pb: '24px', flexShrink: 0 }}>
              {[60, 40, 20, 0].map(v => (
                <Typography key={v} sx={{ fontSize: 10, color: '#212121', lineHeight: 1 }}>{v === 0 ? '0' : `${v / 10}0k`}</Typography>
              ))}
            </Box>
            {/* Chart area */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              <Box sx={{ flex: 1, position: 'relative', minHeight: 0 }}>
                <svg width="100%" height="100%" viewBox="0 0 300 100" preserveAspectRatio="none" style={{ display: 'block' }}>
                  {/* Grid lines */}
                  {[0, 1, 2, 3].map(i => (
                    <line key={i} x1="0" y1={`${(i / 3) * 100}`} x2="300" y2={`${(i / 3) * 100}`} stroke="#f0f0f0" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                  ))}
                  {/* Trend lines */}
                  {TREND_DATA.series.map((s) => {
                    const pts = s.values
                    const w = 300 / (pts.length - 1)
                    const maxV = 60
                    const points = pts.map((v, i) => `${i * w},${100 - (v / maxV) * 100}`).join(' ')
                    return <polyline key={s.name} points={points} fill="none" stroke={s.color} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                  })}
                </svg>
              </Box>
              {/* X-axis labels */}
              <Box sx={{ height: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {TREND_DATA.labels.map(l => <Typography key={l} sx={{ fontSize: 10, color: '#212121' }}>{l}</Typography>)}
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Media Contacts Keywords & Entities */}
      <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, p: 2, minHeight: 415, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#212121' }}>Media Contacts Keywords & Entities</Typography>
            <Tooltip title="Keywords and entities from journalist coverage" arrow><InfoOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} /></Tooltip>
          </Box>
          <IconButton size="small"><MoreVertIcon sx={{ fontSize: 18, color: '#616161' }} /></IconButton>
        </Box>
        {/* Legend */}
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 2 }}>
          {[
            { label: 'Keyword', color: '#E91E90' },
            { label: 'Hashtag', color: '#F9A825' },
            { label: 'Organization', color: '#1A237E' },
            { label: 'People', color: '#42A5F5' },
            { label: 'Location', color: '#66BB6A' },
            { label: 'Product', color: '#7B1FA2' },
            { label: 'Emoji', color: '#FF9800' },
          ].map(item => (
            <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: item.color }} />
              <Typography sx={{ fontSize: 12, color: '#212121' }}>{item.label}</Typography>
            </Box>
          ))}
        </Box>
        {/* Word cloud */}
        <Box sx={{ flex: 1, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignContent: 'center', gap: '2px 8px', pt: 1 }}>
          {KEYWORDS.map((w, i) => {
            const jitter = (Math.sin(i * 47.3 + 13.1) * 10000 % 1 + 1) % 1
            return (
              <Typography
                key={i}
                component="span"
                sx={{
                  fontSize: w.size,
                  color: w.color,
                  cursor: 'pointer',
                  fontWeight: w.size > 18 ? 700 : 400,
                  lineHeight: 1.6,
                  mt: `${jitter * 8}px`,
                  whiteSpace: 'nowrap',
                  '&:hover': { opacity: 0.75 },
                }}
              >
                {w.text}
              </Typography>
            )
          })}
        </Box>
      </Paper>
    </>
  )
}
