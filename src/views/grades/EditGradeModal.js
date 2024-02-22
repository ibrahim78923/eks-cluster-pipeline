// ** React Imports
import { useState, forwardRef, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'

import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Fade from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

import { update } from 'src/services/grade.service'

import { toast } from 'react-hot-toast'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import { Stack } from '@mui/material'

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})

const EditGradeModal = props => {
  const { isOpen, handleClose, onSubmit, grade } = props

  // ** States
  const [name, setName] = useState('')
  const [startTime, setStartTime] = useState('')
  const [offTime, setOffTime] = useState('')

  useEffect(() => {
    if (grade.name) {
      setName(grade.name)
    }
    if (grade.startTime) {
      setStartTime(grade.startTime)
    }
    if (grade.offTime) {
      setOffTime(grade.offTime)
    }
  }, [grade])

  const handleSubmit = async () => {
    const updatedSchool = {
      ...grade,
      name
    }

    const result = await update(grade.id, name, startTime, offTime)

    if (result.success) {
      toast.success('School updated successfully.')
      onSubmit(updatedSchool)
      handleClose()
    } else {
      toast.error(result.message)
    }
  }

  return (
    <Dialog
      fullWidth
      open={isOpen}
      maxWidth='sm'
      scroll='body'
      onClose={handleClose}
      TransitionComponent={Transition}
      onBackdropClick={handleClose}
    >
      <DialogContent sx={{ pb: 6, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}>
        <IconButton size='small' onClick={handleClose} sx={{ position: 'absolute', right: '1rem', top: '1rem' }}>
          <Icon icon='mdi:close' />
        </IconButton>
        <Box sx={{ mb: 9, textAlign: 'center' }}>
          <Typography variant='h5' sx={{ mb: 3, lineHeight: '2rem' }}>
            Edit Grade
          </Typography>
        </Box>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <TextField value={name} onChange={e => setName(e.target.value)} fullWidth label='Grade Name' size='small' />
          </Grid>
          <Grid item xs={6}>
            <Stack>
              <Typography variant='caption' sx={{ mb: 1 }}>
                Start Time
              </Typography>
              <TextField
                type='time'
                size='small'
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                fullWidth
              />
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <Stack>
              <Typography variant='caption' sx={{ mb: 1 }}>
                Off Time
              </Typography>
              <TextField
                type='time'
                size='small'
                value={offTime}
                onChange={e => setOffTime(e.target.value)}
                fullWidth
              />
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, px: { xs: 8, sm: 15 }, justifyContent: 'space-between' }}>
        <Button variant='outlined' onClick={handleClose}>
          Cancel
        </Button>
        <Button variant='contained' sx={{ mr: 2 }} onClick={handleSubmit}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditGradeModal
