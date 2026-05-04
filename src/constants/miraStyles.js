/**
 * Extended Mira style tokens for Mira-centric DS components
 */

// Re-export the base studio gradient
export { STUDIO_GRADIENT_BG } from './studioStyles'

// ============================================
// ATOMIC COLORS
// ============================================
export const MIRA_COLORS = {
  pink: '#B627A1',
  teal: '#00827F',
  palePink: '#F5E8F3',
  paleCyan: '#E8F3F5',
  darkPurple: '#8B5A9B',
  slateTeal: '#5A7B8B',
}

// ============================================
// NAMED GRADIENTS
// ============================================
export const MIRA_GRADIENTS = {
  primary: `linear-gradient(90deg, ${MIRA_COLORS.pink} 0%, ${MIRA_COLORS.teal} 100%)`,
  background: `linear-gradient(90deg, ${MIRA_COLORS.palePink} 0%, ${MIRA_COLORS.paleCyan} 100%)`,
  text: `linear-gradient(90deg, ${MIRA_COLORS.darkPurple} 0%, ${MIRA_COLORS.slateTeal} 100%)`,
}

// ============================================
// UTILITY: GRADIENT TEXT SX STYLES
// ============================================
export const MIRA_GRADIENT_TEXT_SX = {
  background: MIRA_GRADIENTS.text,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
}

// ============================================
// UTILITY: GRADIENT BORDER SX FUNCTION
// ============================================
export const getMiraGradientBorderSx = (borderWidth = 2) => ({
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    padding: `${borderWidth}px`,
    borderRadius: 'inherit',
    background: MIRA_GRADIENTS.primary,
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'xor',
    maskComposite: 'exclude',
    pointerEvents: 'none',
  },
})

// ============================================
// LEGACY EXPORTS (for backward compatibility)
// ============================================

export const MIRA_BUTTON_GRADIENT = MIRA_GRADIENTS.primary
export const MIRA_BUTTON_BG_GRADIENT = MIRA_GRADIENTS.background
export const MIRA_BUTTON_TEXT_GRADIENT = MIRA_GRADIENTS.text
export const MIRA_PROMO_GRADIENT = 'linear-gradient(135deg, rgba(182, 39, 161, 0.03) 0%, rgba(147, 51, 234, 0.03) 100%)'

export const MIRA_FROSTED_STYLES = {
  background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 100%)',
  backdropFilter: 'blur(10px)',
}

export const MIRA_PILL_INPUT_STYLES = {
  borderRadius: 50,
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
}

export const MIRA_FADE_IN = {
  animation: 'miraFadeIn 0.15s ease-in',
  '@keyframes miraFadeIn': {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
}

export const MIRA_ICON_BOX = {
  width: 40,
  height: 40,
  borderRadius: '50%',
  backgroundColor: 'grey.100',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'text.secondary',
  flexShrink: 0,
}

export const MIRA_THINKING_DOTS = {
  display: 'inline-flex',
  gap: 0.5,
  '& span': {
    width: 4,
    height: 4,
    borderRadius: '50%',
    backgroundColor: 'text.secondary',
    animation: 'miraBounce 1.4s infinite ease-in-out both',
  },
  '& span:nth-of-type(1)': { animationDelay: '-0.32s' },
  '& span:nth-of-type(2)': { animationDelay: '-0.16s' },
  '@keyframes miraBounce': {
    '0%, 80%, 100%': { transform: 'scale(0)' },
    '40%': { transform: 'scale(1)' },
  },
}

export const MIRA_ACTIVITY_TYPES = {
  thinking: { icon: 'PsychologyOutlined', color: 'text.secondary' },
  reading: { icon: 'MenuBookOutlined', color: 'primary.main' },
  searching: { icon: 'Search', color: 'info.main' },
  analyzing: { icon: 'Build', color: 'warning.main' },
  generating: { icon: 'Code', color: 'secondary.main' },
  canvas: { icon: 'Description', color: 'primary.main' },
  insight: { icon: 'CheckCircleOutline', color: 'success.main' },
  complete: { icon: 'CheckCircleOutline', color: 'success.main' },
}

export const MIRA_PROGRESS_STUB_STYLES = {
  backgroundColor: 'grey.50',
  borderRadius: 2,
  border: '1px solid',
  borderColor: 'divider',
}

export const MIRA_CHAT_MESSAGE_STYLES = {
  userAvatar: { backgroundColor: 'text.primary' },
  assistantAvatar: { backgroundColor: 'primary.main' },
  avatarSize: 36,
  gap: 1.5,
}

export const MIRA_STUDIO_GRADIENT_BG = {
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(74% 84% at 49% 45%, rgba(255, 255, 255, 0) 20%, rgb(255, 255, 255) 40%) center top -150px / 150% 150% no-repeat, radial-gradient(74% 75% at 50% 33%, rgba(255, 255, 255, 0) 25%, rgb(255, 255, 255) 50%), linear-gradient(90deg, rgb(255, 215, 240) 0%, rgb(205, 240, 245) 100%)',
    opacity: 0.5,
    zIndex: 0,
  },
}
