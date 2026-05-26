import { Box } from '@mui/material'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
import { MIRA_HALO_BG } from '../../constants/layout'

function MiraHaloIcon({ size = 36 }) {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: MIRA_HALO_BG,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <AutoFixHighIcon sx={{ fontSize: size * 0.5, color: '#8B49A0' }} />
    </Box>
  )
}

export default MiraHaloIcon
