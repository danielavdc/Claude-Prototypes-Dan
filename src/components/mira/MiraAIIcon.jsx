import { Avatar } from '@mui/material'

function MiraAIIcon({ size = 28 }) {
  return (
    <Avatar
      src="/fjord_ai.png"
      sx={{ width: size, height: size, flexShrink: 0 }}
    />
  )
}

export default MiraAIIcon
