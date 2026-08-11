import { useState, useEffect, useRef } from 'react'
import { Box, Typography, IconButton, Avatar, Checkbox, Button, InputBase, Drawer } from '@mui/material'
import { alpha } from '@mui/material/styles'
import CloseIcon from '@mui/icons-material/Close'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { MIRA_AI_BG } from '../../constants/layout'
import { SEARCHABLE_JOURNALISTS } from '../../constants/mediaContacts'

const TEAL = '#1D9F9F'
const TEAL_DARK = '#00827F'
const MIRA_PURPLE = '#8B49A0'

const CHECKLIST_STEPS = [
  'Identifying common beats and topics',
  'Reviewing outlets your contacts write for',
  'Looking at location patterns in this list',
  'Searching for journalists with similar coverage',
]

const CHOICES = [
  { key: 'similar', label: 'Find similar contact to this list' },
  { key: 'describe', label: 'I want to describe my search first' },
]

const mostCommon = (arr) => {
  const counts = {}
  arr.forEach(v => { if (v) counts[v] = (counts[v] || 0) + 1 })
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0]
}

// Rank the off-list journalist directory against the list's own dominant beat/location,
// so "similar" suggestions feel grounded in what's already on the list.
function computeSimilarSuggestions(contacts) {
  const topBeat = mostCommon(contacts.map(c => c.beatCategory))
  const topLocation = mostCommon(contacts.map(c => c.location))
  const scored = SEARCHABLE_JOURNALISTS.map((j, i) => ({
    ...j, _id: i,
    _score: (j.beatCategory === topBeat ? 2 : 0) + (j.country === topLocation ? 1 : 0),
  }))
  const ranked = scored.sort((a, b) => b._score - a._score)
  return ranked.slice(0, 5)
}

// Loose keyword match against the free-text description; falls back to a plausible slice
// so the flow never dead-ends on a miss.
function computeDescribedSuggestions(text) {
  const words = text.toLowerCase().split(/[^a-z0-9&]+/).filter(Boolean)
  const matches = SEARCHABLE_JOURNALISTS.map((j, i) => ({ ...j, _id: i }))
    .filter(j => words.some(w => w.length > 2 && (
      j.title.toLowerCase().includes(w) || j.beatCategory.toLowerCase().includes(w) ||
      j.country.toLowerCase().includes(w) || j.city.toLowerCase().includes(w) || j.outlet.toLowerCase().includes(w)
    )))
  return (matches.length > 0 ? matches : SEARCHABLE_JOURNALISTS.map((j, i) => ({ ...j, _id: i })).slice(-5)).slice(0, 5)
}

function MiraAvatar() {
  return (
    <Box sx={{ width: 26, height: 26, borderRadius: '50%', background: MIRA_AI_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <AutoAwesomeIcon sx={{ fontSize: 14, color: '#fff' }} />
    </Box>
  )
}

function UserBubble({ text }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Box sx={{ bgcolor: '#eeeeee', borderRadius: 2.5, px: 1.75, py: 1, maxWidth: '80%' }}>
        <Typography sx={{ fontSize: 14, color: '#212121' }}>{text}</Typography>
      </Box>
    </Box>
  )
}

// The intro card offering "Find similar" vs "I want to describe my search first".
// Resolves in place once a choice is Select-ed (stays visible, non-interactive after).
function ChoiceCard({ resolved, onResolve }) {
  const [selected, setSelected] = useState(resolved || null)
  const locked = !!resolved

  return (
    <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1.5, overflow: 'hidden', mt: 1 }}>
      <Box sx={{ height: 4, background: 'linear-gradient(90deg, #3B6FE0 0%, #8B49A0 100%)' }} />
      {CHOICES.map(c => {
        const active = selected === c.key
        return (
          <Box key={c.key} onClick={() => !locked && setSelected(c.key)}
            sx={{
              px: 2, py: 1.5, cursor: locked ? 'default' : 'pointer', borderBottom: '1px solid #f0f0f0',
              bgcolor: active ? alpha(TEAL, 0.08) : 'transparent', borderLeft: active ? `3px solid ${TEAL}` : '3px solid transparent',
              '&:hover': { bgcolor: locked ? (active ? alpha(TEAL, 0.08) : 'transparent') : alpha('#000', 0.03) },
            }}>
            <Typography sx={{ fontSize: 14, fontWeight: active ? 700 : 500, color: active ? TEAL_DARK : '#212121' }}>{c.label}</Typography>
          </Box>
        )
      })}
      {!locked && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1.25 }}>
          <Typography sx={{ fontSize: 12.5, color: '#9e9e9e' }}>Action</Typography>
          <Button size="small" variant="contained" disableElevation disabled={!selected} onClick={() => onResolve(selected)}
            sx={{ textTransform: 'none', bgcolor: TEAL_DARK, '&:hover': { bgcolor: '#006B68' }, fontWeight: 700, fontSize: 13, borderRadius: 1, px: 2 }}>
            Select
          </Button>
        </Box>
      )}
    </Box>
  )
}

function Checklist({ items }) {
  return (
    <Box sx={{ mt: 1, pl: 1.5, borderLeft: '2px solid #e0e0e0', display: 'flex', flexDirection: 'column', gap: 0.75 }}>
      {items.map((item, i) => (
        <Typography key={i} sx={{ fontSize: 13.5, color: '#616161' }}>{item}</Typography>
      ))}
    </Box>
  )
}

// The suggested-contacts card: checkboxes default-checked, "Add to This List" adds the
// checked ones to the CRUD table via onAdd, then locks into a confirmed state.
function SuggestionsCard({ people, onAdd }) {
  const [checked, setChecked] = useState(() => people.map(p => p._id))
  const [added, setAdded] = useState(false)
  const toggle = (id) => setChecked(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const handleAdd = () => {
    onAdd(people.filter(p => checked.includes(p._id)))
    setAdded(true)
  }

  if (added) {
    return (
      <Box sx={{ mt: 1, border: '1px solid', borderColor: alpha(TEAL, 0.4), bgcolor: alpha(TEAL, 0.06), borderRadius: 1.5, px: 2, py: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
        <CheckCircleIcon sx={{ fontSize: 20, color: TEAL_DARK }} />
        <Typography sx={{ fontSize: 14, fontWeight: 600, color: TEAL_DARK }}>{checked.length} contact{checked.length === 1 ? '' : 's'} added to Eco Media List</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ mt: 1, border: '1px solid #e0e0e0', borderRadius: 1.5, overflow: 'hidden' }}>
      {people.map(p => (
        <Box key={p._id} onClick={() => toggle(p._id)} sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.5, py: 1, borderBottom: '1px solid #f0f0f0', cursor: 'pointer', '&:hover': { bgcolor: '#fafafa' } }}>
          <Checkbox size="small" checked={checked.includes(p._id)} onChange={() => toggle(p._id)} sx={{ p: 0.5, '&.Mui-checked': { color: TEAL_DARK } }} />
          <Avatar sx={{ width: 30, height: 30, bgcolor: p.color, fontSize: 12, fontWeight: 700 }}>{p.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: 13.5, fontWeight: 700, color: '#212121', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</Typography>
            <Typography sx={{ fontSize: 12, color: '#757575', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title} · {p.outlet} · {p.country}</Typography>
          </Box>
        </Box>
      ))}
      <Box sx={{ px: 1.5, py: 1.25 }}>
        <Button fullWidth variant="contained" disableElevation disabled={checked.length === 0} onClick={handleAdd}
          sx={{ textTransform: 'none', bgcolor: TEAL_DARK, '&:hover': { bgcolor: '#006B68' }, fontWeight: 700, fontSize: 14, borderRadius: 1 }}>
          Add to This List
        </Button>
      </Box>
    </Box>
  )
}

function MiraMessage({ msg, contacts, onResolveChoice, onAddContacts }) {
  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
      <MiraAvatar />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#212121', mb: 0.25 }}>Mira</Typography>
        {msg.text && <Typography sx={{ fontSize: 14, lineHeight: 1.5, color: '#212121' }}>{msg.text}</Typography>}
        {msg.checklistLabel && <Typography sx={{ fontSize: 14, color: '#212121', mt: 1 }}>{msg.checklistLabel}</Typography>}
        {msg.checklist && msg.checklist.length > 0 && <Checklist items={msg.checklist} />}
        {msg.card === 'choice' && <ChoiceCard resolved={msg.resolvedChoice} onResolve={(key) => onResolveChoice(msg.id, key)} />}
        {msg.suggestions && <SuggestionsCard people={msg.suggestions} onAdd={onAddContacts} />}
      </Box>
    </Box>
  )
}

export default function MiraCompanionPanel({ open, onClose, listName, contacts, onAddContacts }) {
  const [messages, setMessages] = useState([])
  const [stage, setStage] = useState('idle') // idle | awaiting-choice | thinking | awaiting-description | done
  const [inputValue, setInputValue] = useState('')
  const idRef = useRef(0)
  const nextId = () => ++idRef.current
  const scrollRef = useRef(null)

  // Kick off the scripted intro the first time the panel opens
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ id: nextId(), role: 'user', text: 'Suggest New Contacts' }])
      setTimeout(() => {
        setMessages(m => [...m, {
          id: nextId(), role: 'mira',
          text: `Let's add new contacts to your list "${listName}", to start, I would like to know what type of contacts you would like to add:`,
          card: 'choice',
        }])
        setStage('awaiting-choice')
      }, 500)
    }
  }, [open]) // eslint-disable-line

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages])

  const handleResolveChoice = (msgId, key) => {
    setMessages(m => m.map(msg => msg.id === msgId ? { ...msg, resolvedChoice: key } : msg))
    const label = CHOICES.find(c => c.key === key)?.label
    setMessages(m => [...m, { id: nextId(), role: 'user', text: label }])

    if (key === 'similar') {
      setStage('thinking')
      const thinkingId = nextId()
      setMessages(m => [...m, {
        id: thinkingId, role: 'mira',
        text: `Got it — I'm analyzing the contacts already in "${listName}" to find journalists with a similar profile.`,
        checklistLabel: 'Checking for...', checklist: [],
      }])
      CHECKLIST_STEPS.forEach((step, i) => {
        setTimeout(() => {
          setMessages(m => m.map(msg => msg.id === thinkingId ? { ...msg, checklist: [...msg.checklist, step] } : msg))
        }, 450 * (i + 1))
      })
      setTimeout(() => {
        const suggestions = computeSimilarSuggestions(contacts)
        setMessages(m => [...m, { id: nextId(), role: 'mira', text: `I found ${suggestions.length} journalists with a similar profile to your list:`, suggestions }])
        setStage('done')
      }, 450 * CHECKLIST_STEPS.length + 550)
    } else {
      setTimeout(() => {
        setMessages(m => [...m, {
          id: nextId(), role: 'mira',
          text: `Sure! Describe the type of contacts you'd like to add — for example a beat, a location, or a kind of outlet — and I'll find matching journalists.`,
        }])
        setStage('awaiting-description')
      }, 450)
    }
  }

  const handleAddContacts = (people) => {
    onAddContacts(people)
  }

  const handleSend = () => {
    const text = inputValue.trim()
    if (!text) return
    setInputValue('')
    setMessages(m => [...m, { id: nextId(), role: 'user', text }])
    if (stage === 'awaiting-description') {
      setStage('thinking')
      setTimeout(() => {
        const suggestions = computeDescribedSuggestions(text)
        setMessages(m => [...m, { id: nextId(), role: 'mira', text: `Here are some journalists that match “${text}”:`, suggestions }])
        setStage('done')
      }, 800)
    } else {
      setTimeout(() => {
        setMessages(m => [...m, { id: nextId(), role: 'mira', text: `Got it! Let me know if you'd like me to find similar contacts or describe a new search.` }])
      }, 450)
    }
  }

  return (
    <Drawer anchor="right" open={open} onClose={onClose} slotProps={{ paper: { sx: { width: 440, maxWidth: '92vw' } } }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <Box sx={{ flexShrink: 0, px: 2.5, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e0e0e0' }}>
          <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#212121' }}>Mira Companion</Typography>
          <IconButton size="small" onClick={onClose}><CloseIcon sx={{ fontSize: 22, color: '#616161' }} /></IconButton>
        </Box>

        {/* Messages */}
        <Box ref={scrollRef} sx={{ flex: 1, minHeight: 0, overflow: 'auto', px: 2.5, py: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {messages.map(msg => msg.role === 'user'
            ? <UserBubble key={msg.id} text={msg.text} />
            : <MiraMessage key={msg.id} msg={msg} contacts={contacts} onResolveChoice={handleResolveChoice} onAddContacts={handleAddContacts} />
          )}
        </Box>

        {/* Composer */}
        <Box sx={{ flexShrink: 0, px: 2, py: 1.5, borderTop: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', gap: 1 }}>
          <InputBase value={inputValue} onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSend() }}
            placeholder="Ask me a question…" fullWidth
            sx={{ fontSize: 14, border: '1px solid #e0e0e0', borderRadius: 3, px: 2, py: 1 }} />
          <IconButton onClick={handleSend} sx={{ bgcolor: '#f0f0f0', '&:hover': { bgcolor: '#e0e0e0' } }}>
            <ArrowForwardIcon sx={{ fontSize: 18, color: '#616161' }} />
          </IconButton>
        </Box>
      </Box>
    </Drawer>
  )
}
