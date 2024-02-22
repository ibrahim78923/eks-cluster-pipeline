// ** React Imports
import { useState, forwardRef } from 'react'

import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import Fade from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContentText from '@mui/material/DialogContentText'

import { remove } from 'src/services/grade.service'

import { toast } from 'react-hot-toast'

// ** Hooks
import useBgColor from 'src/@core/hooks/useBgColor'
import { Box, IconButton, Typography } from '@mui/material'
import { Icon } from '@iconify/react'

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})

const DialogDeleteGrade = props => {
  const { isOpen, handleClose, onSubmit, grade } = props

  const handleSubmit = async () => {
    const result = await remove(grade.id)

    if (result.success) {
      toast.success('School has been deleted')
      onSubmit(grade.id)
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
      <DialogContent sx={{ pb: 6, px: { xs: 8, sm: 15 }, pt: 8, position: 'relative' }}>
        <IconButton size='small' onClick={handleClose} sx={{ position: 'absolute', right: '1rem', top: '1rem' }}>
          <Icon icon='mdi:close' />
        </IconButton>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant='h6'>Delete {grade?.name}?</Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant='body2'>
            All the data related to this grade will be removed and will be inaccessible after deletion.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ pb: 8, px: { xs: 8, sm: 15 }, justifyContent: 'center' }}>
        <Button variant='outlined' onClick={handleClose}>
          Cancel
        </Button>
        <Button variant='contained' sx={{ mr: 2 }} onClick={handleSubmit}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DialogDeleteGrade
