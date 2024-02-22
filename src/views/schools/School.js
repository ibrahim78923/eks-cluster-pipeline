import { useState } from 'react'
import { Icon } from '@iconify/react'
import { Box, Grid, Accordion, AccordionDetails, AccordionSummary, IconButton, Stack, Typography } from '@mui/material'

const School = ({ school, startDelete, startEdit }) => {
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
          <Stack sx={{ py: 1 }}>
            <Typography>{school.name}</Typography>
            <Typography variant='caption'>{school.address}</Typography>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            <IconButton color='primary' onClick={() => startEdit(school)}>
              <Icon icon='material-symbols:edit' />
            </IconButton>
            <IconButton color='primary' onClick={() => startDelete(school)}>
              <Icon icon='material-symbols:delete-outline' />
            </IconButton>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Grid>
  )
}

export default School
