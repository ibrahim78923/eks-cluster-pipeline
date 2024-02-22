import { useState } from 'react'
import { Icon } from '@iconify/react'
import { Box, Grid, Accordion, AccordionDetails, AccordionSummary, IconButton, Stack, Typography } from '@mui/material'

const Teacher = ({ teacher, startDelete = () => {}, startEdit = () => {} }) => {
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
            <Typography>{teacher.name}</Typography>
            <Grades grades={teacher.grades} />
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            <IconButton color='primary' onClick={() => startEdit(teacher)}>
              <Icon icon='material-symbols:edit' />
            </IconButton>
            <IconButton color='primary' onClick={() => startDelete(teacher)}>
              <Icon icon='material-symbols:delete-outline' />
            </IconButton>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Grid>
  )
}

const Grade = ({ grade }) => {
  return (
    <Box
      sx={{
        borderRadius: 3,
        py: 1,
        px: 2,
        background: theme => theme.palette.primary.main,
        color: theme => theme.palette.primary.contrastText,
        fontSize: 9,
        m: 0.5
      }}
    >
      {grade.name}
    </Box>
  )
}

const Grades = ({ grades }) => {
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexWrap: 'wrap',
        my: 1
      }}
    >
      {grades.map((grade, i) => (
        <Grade key={i} grade={grade} />
      ))}
    </Box>
  )
}

export default Teacher
