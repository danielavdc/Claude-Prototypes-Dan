import { Box } from '@mui/material'
import { STUDIO_GRADIENT_BG } from '../../constants/miraStyles'

/**
 * MiraGradientBox - Foundation wrapper that applies signature pink-cyan gradient
 *
 * @param {'full' | 'subtle' | 'insight'} variant - Gradient intensity variant
 * @param {number} opacity - Gradient opacity (0-1), default 0.5
 * @param {object} sx - Additional MUI sx styles
 * @param {React.ReactNode} children
 */
function MiraGradientBox({ variant = 'full', opacity = 0.5, sx = {}, children, ...props }) {
  const getGradientStyles = () => {
    switch (variant) {
      case 'subtle':
        return {
          background: `linear-gradient(135deg, rgba(182, 39, 161, 0.02) 0%, rgba(147, 51, 234, 0.02) 100%)`,
        }
      case 'insight':
        return {
          background: `linear-gradient(135deg, rgba(182, 39, 161, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%)`,
        }
      case 'full':
      default:
        return {
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: STUDIO_GRADIENT_BG,
            opacity: opacity,
            zIndex: 0,
          },
        }
    }
  }

  return (
    <Box
      sx={{
        position: 'relative',
        ...getGradientStyles(),
        ...sx,
      }}
      {...props}
    >
      {variant === 'full' ? (
        <Box sx={{ position: 'relative', zIndex: 1 }}>{children}</Box>
      ) : (
        children
      )}
    </Box>
  )
}

export default MiraGradientBox
