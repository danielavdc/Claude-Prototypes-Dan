import { Box, Typography, Chip, Avatar } from '@mui/material'
import WidgetCard, { SegmentNav, HBar } from './WidgetCard'

const SECTIONS = [
  { id: 'aud-demographics', label: 'Demographics' },
  { id: 'aud-interests', label: 'Interests' },
  { id: 'aud-authors', label: 'Top Authors' },
  { id: 'aud-sources', label: 'Sources' },
]

const AGE_GROUPS = [
  { label: '18–24', pct: 18 },
  { label: '25–34', pct: 32 },
  { label: '35–44', pct: 26 },
  { label: '45–54', pct: 14 },
  { label: '55–64', pct: 7 },
  { label: '65+', pct: 3 },
]

const GENDER = [
  { label: 'Female', pct: 54, color: '#CF2D8A' },
  { label: 'Male', pct: 42, color: '#2196F3' },
  { label: 'Non-binary', pct: 4, color: '#9C4DD6' },
]

const PROFESSIONS = [
  { label: 'Marketing & Advertising', value: 3400 },
  { label: 'Technology', value: 2900 },
  { label: 'Media & Journalism', value: 2100 },
  { label: 'Education', value: 1600 },
  { label: 'Healthcare', value: 1200 },
  { label: 'Finance & Banking', value: 900 },
]

const INTERESTS = [
  { label: 'Coffee & Cafes', value: 4800 },
  { label: 'Sustainability', value: 3600 },
  { label: 'Local Business', value: 3100 },
  { label: 'Food & Dining', value: 2700 },
  { label: 'Health & Wellness', value: 2200 },
  { label: 'Tech & Innovation', value: 1900 },
]

const TOP_AUTHORS = [
  { name: 'Sarah Mitchell', handle: '@sarahmitchell', followers: '128k', mentions: 14, sentiment: 'Positive', avatarColor: '#9C4DD6', initials: 'SM' },
  { name: 'James Thornton', handle: '@jthornton_writes', followers: '84k', mentions: 11, sentiment: 'Positive', avatarColor: '#1D9F9F', initials: 'JT' },
  { name: 'Priya Nair', handle: '@priyanair', followers: '72k', mentions: 9, sentiment: 'Neutral', avatarColor: '#CF2D8A', initials: 'PN' },
  { name: 'Marco Delgado', handle: '@marcodelgado', followers: '61k', mentions: 7, sentiment: 'Negative', avatarColor: '#FF9800', initials: 'MD' },
  { name: 'Liu Wei', handle: '@liu_wei_sf', followers: '54k', mentions: 6, sentiment: 'Positive', avatarColor: '#2196F3', initials: 'LW' },
]

const SOURCE_SPLIT = [
  { label: 'Online News', pct: 38, color: '#1D9F9F' },
  { label: 'Twitter/X', pct: 28, color: '#9C4DD6' },
  { label: 'Blogs', pct: 16, color: '#CF2D8A' },
  { label: 'Instagram', pct: 11, color: '#FF9800' },
  { label: 'Forums', pct: 7, color: '#2196F3' },
]

const SENTIMENT_COLOR = { Positive: { bg: '#E8F5E9', color: '#2E7D32' }, Neutral: { bg: '#F5F5F5', color: '#616161' }, Negative: { bg: '#FFEBEE', color: '#C62828' } }

function GenderBar({ segments }) {
  return (
    <Box>
      <Box sx={{ display: 'flex', height: 12, borderRadius: 1, overflow: 'hidden', mb: 1 }}>
        {segments.map((s, i) => <Box key={i} sx={{ width: `${s.pct}%`, bgcolor: s.color }} />)}
      </Box>
      <Box sx={{ display: 'flex', gap: 2 }}>
        {segments.map((s, i) => (
          <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: s.color }} />
            <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{s.label}</Typography>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#212121' }}>{s.pct}%</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default function AudienceTabContent({ loading }) {
  if (loading) return null
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>

      <SegmentNav items={SECTIONS} />

      <Box id="aud-demographics" sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <Box sx={{ display: 'flex', gap: 1.5 }}>
        <WidgetCard title="Age Distribution">
          <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, height: 140, pt: 1, mb: 1 }}>
            {AGE_GROUPS.map((g, i) => (
              <Box key={i} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                <Typography sx={{ fontSize: 10, fontWeight: 700, color: '#212121' }}>{g.pct}%</Typography>
                <Box sx={{ width: '100%', height: `${(g.pct / 32) * 100}px`, bgcolor: '#1D9F9F', borderRadius: '2px 2px 0 0', opacity: 0.85 }} />
                <Typography sx={{ fontSize: 10, color: '#616161' }}>{g.label}</Typography>
              </Box>
            ))}
          </Box>
        </WidgetCard>

        <WidgetCard title="Gender Split">
          <GenderBar segments={GENDER} />
          <Box sx={{ mt: 2 }}>
            {GENDER.map((g, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: g.color, flexShrink: 0 }} />
                <Typography sx={{ fontSize: 13, flex: 1, color: '#424242' }}>{g.label}</Typography>
                <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#212121' }}>{g.pct}%</Typography>
              </Box>
            ))}
          </Box>
        </WidgetCard>
      </Box>

      </Box>

      <Box id="aud-interests" sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <Box sx={{ display: 'flex', gap: 1.5 }}>
        <WidgetCard title="Top Professions">
          {PROFESSIONS.map((p, i) => (
            <HBar key={i} label={p.label} value={p.value} max={3400} color="#9C4DD6" />
          ))}
        </WidgetCard>
        <WidgetCard title="Top Interests">
          {INTERESTS.map((p, i) => (
            <HBar key={i} label={p.label} value={p.value} max={4800} color="#1D9F9F" />
          ))}
        </WidgetCard>
      </Box>

      </Box>

      <Box id="aud-authors" sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <WidgetCard title="Top Authors by Mentions">
        <Box sx={{ display: 'flex', mb: 0.5 }}>
          <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary', flex: 1 }}>Author</Typography>
          <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary', width: 70, textAlign: 'right' }}>Followers</Typography>
          <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary', width: 70, textAlign: 'right' }}>Mentions</Typography>
          <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary', width: 72, textAlign: 'right' }}>Sentiment</Typography>
        </Box>
        {TOP_AUTHORS.map((a, i) => (
          <Box key={i} sx={{ display: 'flex', alignItems: 'center', py: 0.75, borderBottom: '1px solid #f5f5f5' }}>
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: a.avatarColor, fontSize: 12, fontWeight: 700 }}>{a.initials}</Avatar>
              <Box>
                <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#212121', lineHeight: 1.2 }}>{a.name}</Typography>
                <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{a.handle}</Typography>
              </Box>
            </Box>
            <Typography sx={{ fontSize: 13, color: '#424242', width: 70, textAlign: 'right' }}>{a.followers}</Typography>
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#212121', width: 70, textAlign: 'right' }}>{a.mentions}</Typography>
            <Box sx={{ width: 72, display: 'flex', justifyContent: 'flex-end' }}>
              <Chip size="small" label={a.sentiment} sx={{ height: 20, fontSize: 11, fontWeight: 700, bgcolor: SENTIMENT_COLOR[a.sentiment]?.bg, color: SENTIMENT_COLOR[a.sentiment]?.color }} />
            </Box>
          </Box>
        ))}
        <Typography sx={{ fontSize: 13, color: '#1D9F9F', cursor: 'pointer', mt: 1 }}>1 – 5 of 40 Authors &gt;</Typography>
      </WidgetCard>

      </Box>

      <Box id="aud-sources" sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <WidgetCard title="Audience by Source">
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
          <Box sx={{ flex: 1 }}>
            {SOURCE_SPLIT.map((s, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: s.color, flexShrink: 0 }} />
                <Typography sx={{ fontSize: 13, flex: 1, color: '#424242' }}>{s.label}</Typography>
                <Box sx={{ width: 100, height: 8, bgcolor: '#f0f0f0', borderRadius: 1 }}>
                  <Box sx={{ width: `${s.pct}%`, height: '100%', bgcolor: s.color, borderRadius: 1 }} />
                </Box>
                <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#212121', width: 32, textAlign: 'right' }}>{s.pct}%</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </WidgetCard>
      </Box>

    </Box>
  )
}
