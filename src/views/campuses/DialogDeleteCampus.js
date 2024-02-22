// ** React Imports
import { useState, forwardRef } from 'react'

import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import Fade from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContentText from '@mui/material/DialogContentText'

import { remove } from 'src/services/campus.service'

import { toast } from 'react-hot-toast'

// ** Hooks
import useBgColor from 'src/@core/hooks/useBgColor'

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})

const DialogDeleteCampus = props => {
  const { isOpen, handleClose, onSubmit, campus } = props

  const handleSubmit = async () => {
    const result = await remove(campus.id)

    if (result.success) {
      toast.success('School Campus has been deleted')
      onSubmit(campus.id)
      handleClose()
    } else {
      toast.error(result.message)
    }
  }

  return (
    <Dialog
      fullWidth
      open={isOpen}
      maxWidth='md'
      scroll='body'
      onClose={handleClose}
      TransitionComponent={Transition}
      onBackdropClick={handleClose}
    >
      <DialogTitle>{'Are you you want to delete this School Campus'}</DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-slide-description'>
          After delete this school Campus is no longer visible in this record.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'center' }}>
        <Button variant='contained' sx={{ mr: 2 }} onClick={handleSubmit}>
          Delete
        </Button>
        <Button variant='outlined' color='secondary' onClick={handleClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DialogDeleteCampus
