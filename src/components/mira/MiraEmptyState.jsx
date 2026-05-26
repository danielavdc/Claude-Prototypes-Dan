import { forwardRef } from 'react'
import { Box, Typography } from '@mui/material'
import SearchOffOutlinedIcon from '@mui/icons-material/SearchOffOutlined'
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined'
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined'
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined'
import MiraButton from './MiraButton'
import { MIRA_GRADIENTS } from '../../constants/miraStyles'

/**
 * MiraEmptyState - Empty state placeholder with Mira illustrations
 *
 * @param {'no-results' | 'no-messages' | 'error' | 'welcome'} variant - Empty state type
 * @param {string} title - Heading text (optional, has defaults per variant)
 * @param {string} description - Description text (optional, has defaults per variant)
 * @param {{ label: string, onClick: function }} action - Optional action button config
 * @param {object} sx - Additional MUI sx styles
 */
const MiraEmptyState = forwardRef(function MiraEmptyState(
  { variant = 'no-results', title, description, action, sx = {}, ...rest },
  ref
) {
  const variants = {
    'no-results': {
      icon: SearchOffOutlinedIcon,
      defaultTitle: 'No results found',
      defaultDescription: 'Try adjusting your search or filters to find what you\'re looking for.',
    },
    'no-messages': {
      icon: ChatBubbleOutlineOutlinedIcon,
      defaultTitle: 'No messages yet',
      defaultDescription: 'Start a conversation to get help with your questions.',
    },
    'error': {
      icon: ErrorOutlineOutlinedIcon,
      defaultTitle: 'Something went wrong',
      defaultDescription: 'We encountered an error. Please try again or contact support.',
    },
    'welcome': {
      icon: AutoAwesomeOutlinedIcon,
      defaultTitle: 'Welcome to Mira',
      defaultDescription: 'Your AI assistant is ready to help. Ask a question to get started.',
    },
  }

  const config = variants[variant] || variants['no-results']
  const IconComponent = config.icon
  const displayTitle = title || config.defaultTitle
  const displayDescription = description || config.defaultDescription

  return (
    <Box
      ref={ref}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        py: 6,
        px: 3,
        ...sx,
      }}
      {...rest}
    >
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: `linear-gradient(-45deg, rgba(182, 39, 161, 0.08) 0%, rgba(0, 130, 127, 0.08) 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 3,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: -4,
            borderRadius: '50%',
            background: `linear-gradient(-45deg, rgba(182, 39, 161, 0.04) 0%, rgba(0, 130, 127, 0.04) 100%)`,
            zIndex: -1,
          },
        }}
      >
        <IconComponent
          sx={{
            fontSize: 36,
            background: MIRA_GRADIENTS.text,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
          }}
        />
      </Box>

      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          mb: 1,
          color: 'text.primary',
        }}
      >
        {displayTitle}
      </Typography>

      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
          maxWidth: 360,
          mb: action ? 3 : 0,
          lineHeight: 1.6,
        }}
      >
        {displayDescription}
      </Typography>

      {action && (
        <MiraButton
          variant="outlined"
          onClick={action.onClick}
        >
          {action.label}
        </MiraButton>
      )}
    </Box>
  )
})

export default MiraEmptyState
