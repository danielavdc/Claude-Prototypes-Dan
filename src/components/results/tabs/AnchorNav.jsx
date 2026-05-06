import { Box, Typography, Tooltip } from '@mui/material'
import { useState, useRef, useEffect } from 'react'

const TEAL = '#1D9F9F'

export function SectionTitle({ children }) {
  return (
    <Typography sx={{ fontSize: 17, fontWeight: 700, color: '#212121', mb: 2, pb: 1.5, borderBottom: '2px solid #f0f0f0' }}>
      {children}
    </Typography>
  )
}

export default function AnchorNav({ items }) {
  const [active, setActive] = useState(items[0]?.id || '')
  const [compact, setCompact] = useState(false)
  const navRef = useRef(null)

  useEffect(() => {
    const el = navRef.current
    if (!el) return
    let scrollEl = el.parentElement
    while (scrollEl && scrollEl !== document.body) {
      const s = window.getComputedStyle(scrollEl)
      if (s.overflow === 'auto' || s.overflowY === 'auto' || s.overflow === 'scroll' || s.overflowY === 'scroll') break
      scrollEl = scrollEl.parentElement
    }
    if (!scrollEl || scrollEl === document.body) return

    const onScroll = () => {
      const containerTop = scrollEl.getBoundingClientRect().top
      let current = items[0]?.id
      for (const { id } of items) {
        const sEl = document.getElementById(id)
        if (!sEl) continue
        if (sEl.getBoundingClientRect().top - containerTop < 80) current = id
      }
      setActive(current)
    }
    scrollEl.addEventListener('scroll', onScroll, { passive: true })

    const ro = new ResizeObserver(([entry]) => {
      setCompact(entry.contentRect.width < 620)
    })
    ro.observe(scrollEl)

    return () => {
      scrollEl.removeEventListener('scroll', onScroll)
      ro.disconnect()
    }
  }, [items])

  return (
    <Box ref={navRef} sx={{ position: 'sticky', top: 0, alignSelf: 'flex-start', flexShrink: 0, pt: 0.5 }}>
      {items.map(({ id, label, Icon }) => {
        const isActive = active === id
        return (
          <Tooltip key={id} title={compact ? label : ''} placement="left" arrow>
            <Box
              onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              sx={{
                display: 'flex',
                alignItems: 'center',
                pl: 1.5,
                pr: compact ? 1 : 2,
                py: 0.875,
                cursor: 'pointer',
                borderLeft: `3px solid ${isActive ? TEAL : 'transparent'}`,
                bgcolor: isActive ? 'rgba(29,159,159,0.08)' : 'transparent',
                borderRadius: '0 4px 4px 0',
                transition: 'background-color 0.15s ease',
                userSelect: 'none',
                width: compact ? 44 : 'auto',
                '&:hover': { bgcolor: isActive ? 'rgba(29,159,159,0.12)' : 'rgba(0,0,0,0.04)' },
              }}
            >
              {compact
                ? <Icon sx={{ fontSize: 18, color: isActive ? TEAL : '#757575', flexShrink: 0 }} />
                : <Typography sx={{ fontSize: 14, fontWeight: isActive ? 700 : 400, color: isActive ? '#212121' : '#424242', whiteSpace: 'nowrap' }}>{label}</Typography>
              }
            </Box>
          </Tooltip>
        )
      })}
    </Box>
  )
}
