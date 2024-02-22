import { useState } from 'react'
import { Icon } from '@iconify/react'
import { Box, Grid, Accordion, AccordionDetails, AccordionSummary, IconButton, Stack, Typography } from '@mui/material'

const Grade = ({ grade, startDelete = () => {}, startEdit = () => {} }) => {
  const [isMouseOver, setMouseOver] = useState(false)

  return (
    <Grid
      item
      xs={12}
      sm={6}
      md={4}
      lg={3}
      onMouseEnter={() => setMouseOver(true)}
      onMouseLeave={() => setMouseOver(false)}
    >
      <Accordion expanded={isMouseOver}>
        <AccordionSummary expandIcon={<Icon icon='material-symbols:keyboard-arrow-down' />}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Stack sx={{ py: 1 }}>
              <Typography>{grade.name}</Typography>
              <Typography variant='caption'>{grade.teacher?.name}</Typography>
            </Stack>
            {grade.offTime && (
              <Box
                sx={{
                  fontSize: 12,
                  py: 0.75,
                  px: 1.5,
                  borderRadius: 3,
                  background: theme => theme.palette.primary.main,
                  color: theme => theme.palette.primary.contrastText,
                  mx: 1
                }}
              >
                {grade.offTime}
              </Box>
            )}
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            <IconButton color='primary' onClick={() => startEdit(grade)}>
              <Icon icon='material-symbols:edit' />
            </IconButton>
            <IconButton color='primary' onClick={() => startDelete(grade)}>
              <Icon icon='material-symbols:delete-outline' />
            </IconButton>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Grid>
  )
}

export default Grade
