import { forwardRef } from 'react'
import { Button, CircularProgress, Box } from '@mui/material'
import { MIRA_BUTTON_GRADIENT, MIRA_BUTTON_BG_GRADIENT } from '../../constants/miraStyles'

/**
 * MiraButton - Gradient button with multiple variants
 *
 * @param {'gradient' | 'outlined' | 'teal' | 'tealOutlined'} variant - Button variant
 * @param {'small' | 'medium' | 'large'} size - Button size
 * @param {boolean} loading - Show loading spinner
 * @param {boolean} disabled - Disable the button
 * @param {React.ReactNode} startIcon - Icon before label
 * @param {React.ReactNode} endIcon - Icon after label
 * @param {function} onClick - Click handler
 * @param {React.ReactNode} children - Button label
 * @param {object} sx - Additional MUI sx styles
 */
const MiraButton = forwardRef(function MiraButton(
  {
    variant = 'gradient',
    size = 'medium',
    loading = false,
    disabled = false,
    startIcon,
    endIcon,
    onClick,
    children,
    sx = {},
    ...rest
  },
  ref
) {
  const isDisabled = disabled || loading

  const sizeStyles = {
    small: { px: 2, py: 0.75, fontSize: '0.8125rem' },
    medium: { px: 2.5, py: 1, fontSize: '0.875rem' },
    large: { px: 3, py: 1.25, fontSize: '1rem' },
  }

  const baseStyles = {
    textTransform: 'none',
    fontWeight: 600,
    borderRadius: 1,
    minWidth: 'auto',
    ...sizeStyles[size],
  }

  const variantStyles = {
    gradient: {
      position: 'relative',
      isolation: 'isolate',
      background: 'transparent',
      color: 'text.primary',
      border: 'none',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        inset: 0,
        background: MIRA_BUTTON_BG_GRADIENT,
        borderRadius: 'inherit',
        zIndex: -1,
      },
      '&:hover::before': {
        filter: 'brightness(0.96)',
      },
      '& .MuiButton-startIcon, & .MuiButton-endIcon': {
        color: 'text.primary',
      },
    },
    outlined: {
      background: 'white',
      color: 'transparent',
      backgroundImage: MIRA_BUTTON_GRADIENT,
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      border: 'none',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        inset: 0,
        padding: '1px',
        borderRadius: 'inherit',
        background: MIRA_BUTTON_GRADIENT,
        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        WebkitMaskComposite: 'xor',
        maskComposite: 'exclude',
        pointerEvents: 'none',
      },
      '&:hover': {
        background: 'rgba(182, 39, 161, 0.04)',
        backgroundImage: MIRA_BUTTON_GRADIENT,
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
      },
      '& .MuiButton-startIcon svg, & .MuiButton-endIcon svg': {
        fill: 'url(#mira-gradient-icon)',
      },
    },
    teal: {
      backgroundColor: 'primary.main',
      color: 'white',
      border: 'none',
      '&:hover': {
        backgroundColor: 'primary.dark',
      },
    },
    tealOutlined: {
      backgroundColor: 'transparent',
      color: 'primary.main',
      border: '1px solid',
      borderColor: 'primary.main',
      '&:hover': {
        backgroundColor: 'rgba(0, 130, 127, 0.04)',
      },
    },
  }

  const disabledStyles = isDisabled
    ? {
        background: '#E0E0E0',
        backgroundImage: 'none',
        backgroundClip: 'border-box',
        WebkitBackgroundClip: 'border-box',
        color: '#9E9E9E',
        cursor: 'not-allowed',
        pointerEvents: 'none',
        '&::before': { display: 'none' },
        '&:hover': {
          filter: 'none',
        },
        '& .MuiButton-startIcon, & .MuiButton-endIcon': {
          color: '#9E9E9E',
        },
      }
    : {}

  const GradientDefs = () => (
    <svg width="0" height="0" style={{ position: 'absolute' }}>
      <defs>
        <linearGradient id="mira-gradient-icon" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#B627A1" />
          <stop offset="100%" stopColor="#00827F" />
        </linearGradient>
        <linearGradient id="mira-gradient-spinner" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#B627A1" />
          <stop offset="100%" stopColor="#00827F" />
        </linearGradient>
      </defs>
    </svg>
  )

  const GradientSpinner = () => (
    <Box
      sx={{
        position: 'relative',
        display: 'inline-flex',
        mr: children ? 1 : 0,
      }}
    >
      <CircularProgress
        size={size === 'small' ? 14 : size === 'large' ? 20 : 16}
        sx={{
          color: 'transparent',
          '& .MuiCircularProgress-circle': {
            stroke: 'url(#mira-gradient-spinner)',
          },
        }}
      />
    </Box>
  )

  return (
    <>
      <GradientDefs />
      <Button
        ref={ref}
        onClick={onClick}
        disabled={isDisabled}
        startIcon={loading ? <GradientSpinner /> : startIcon}
        endIcon={endIcon}
        sx={{
          ...baseStyles,
          ...variantStyles[variant],
          ...disabledStyles,
          ...sx,
        }}
        {...rest}
      >
        {children}
      </Button>
    </>
  )
})

export default MiraButton
