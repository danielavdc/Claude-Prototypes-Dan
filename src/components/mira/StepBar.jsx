import { Box, Tooltip } from '@mui/material'

function StepBar({ steps, currentStep }) {
  return (
    <Box sx={{ display: 'flex', gap: 0.75, px: 2, pt: 1.5, pb: 0.5 }}>
      {steps.map((label, i) => (
        <Tooltip key={i} title={label} placement="bottom">
          <Box
            sx={{
              height: 4,
              flex: 1,
              borderRadius: 2,
              bgcolor: i <= currentStep ? 'primary.main' : '#e0e0e0',
              transition: 'background-color 0.3s ease',
              cursor: 'default',
            }}
          />
        </Tooltip>
      ))}
    </Box>
  )
}

export default StepBar
