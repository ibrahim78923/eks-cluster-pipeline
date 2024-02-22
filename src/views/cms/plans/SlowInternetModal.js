// ** React Imports
import React, { forwardRef } from 'react'

import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import Fade from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

// ** Hooks
import { Box, IconButton, Typography } from '@mui/material'
import { Icon } from '@iconify/react'

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})

const EditPlan = ({ isOpen, handleClose }) => {
  return (
    <Dialog
      fullWidth
      open={isOpen}
      maxWidth='xs'
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
          <img width={'60%'} src='/images/slow_internet.png' />
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant='body1'>Oops... Internet connection is too low</Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ pb: 8, px: { xs: 8, sm: 15 }, justifyContent: 'end' }}>
        <Button variant='contained' onClick={handleClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditPlan
