import { Box, Typography } from '@mui/material'
import { MIRA_THINKING_DOTS } from '../../constants/miraStyles'

/**
 * MiraThinkingState - AI processing indicator with animated dots
 *
 * @param {string} label - Optional label text (e.g., "Analyzing...")
 * @param {'inline' | 'standalone'} variant - Display variant, default 'inline'
 * @param {object} sx - Additional MUI sx styles
 */
function MiraThinkingState({ label, variant = 'inline', sx = {} }) {
  const ThinkingDots = () => (
    <Box component="span" sx={MIRA_THINKING_DOTS}>
      <span />
      <span />
      <span />
    </Box>
  )

  if (variant === 'standalone') {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          py: 1.5,
          px: 2,
          borderRadius: 1,
          backgroundColor: 'grey.50',
          ...sx,
        }}
      >
        {label && (
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
        )}
        <ThinkingDots />
      </Box>
    )
  }

  return (
    <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', ...sx }}>
      {label && (
        <Typography component="span" variant="body2" color="text.secondary" sx={{ mr: 0.5 }}>
          {label}
        </Typography>
      )}
      <ThinkingDots />
    </Box>
  )
}

export default MiraThinkingState
