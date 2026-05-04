import { TextField, InputAdornment, IconButton } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import { MIRA_PILL_INPUT_STYLES } from '../../constants/miraStyles'

/**
 * MiraChatInput - Pill-shaped multiline input with send button
 *
 * @param {string} value - Input value
 * @param {function} onChange - Change handler (receives string value)
 * @param {function} onSend - Send handler
 * @param {string} placeholder - Placeholder text
 * @param {number} maxRows - Maximum rows for multiline, default 4
 * @param {boolean} disabled - Disable input
 * @param {object} sx - Additional MUI sx styles
 */
function MiraChatInput({
  value = '',
  onChange,
  onSend,
  placeholder = 'Ask anything...',
  maxRows = 4,
  disabled = false,
  sx = {},
}) {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (value.trim() && onSend) {
        onSend()
      }
    }
  }

  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value || '')
    }
  }

  const handleSendClick = () => {
    if (value.trim() && onSend) {
      onSend()
    }
  }

  return (
    <TextField
      fullWidth
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      onKeyPress={handleKeyPress}
      disabled={disabled}
      multiline
      maxRows={maxRows}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={handleSendClick}
              disabled={!value.trim() || disabled}
              color="primary"
            >
              <SendIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          ...MIRA_PILL_INPUT_STYLES,
          backgroundColor: 'background.paper',
          paddingLeft: 3,
        },
        ...sx,
      }}
    />
  )
}

export default MiraChatInput
