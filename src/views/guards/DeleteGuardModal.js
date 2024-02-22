// ** React Imports
import * as React from 'react'
import { forwardRef } from 'react'

import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import Fade from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

import { remove } from 'src/services/guard.service'
import { Spin } from 'antd'

import { toast } from 'react-hot-toast'

import { Box, IconButton, Typography } from '@mui/material'
import { Icon } from '@iconify/react'

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})

const DeleteGuardModal = props => {
  const [loading, setLoading] = React.useState(false)

  const { isOpen, handleClose, onSubmit, guard } = props

  const handleSubmit = async () => {
    setLoading(true);
    const result = await remove(guard.id)

    if (result.success) {
      setLoading(false);
      toast.success('Grade has been deleted')
      onSubmit(guard.id)
      handleClose()
    } else {
      setLoading(false);
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
      <Spin spinning={loading}>
      <DialogContent sx={{ pb: 6, px: { xs: 8, sm: 15 }, pt: 8, position: 'relative' }}>
        <IconButton size='small' onClick={handleClose} sx={{ position: 'absolute', right: '1rem', top: '1rem' }}>
          <Icon icon='mdi:close' />
        </IconButton>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant='h6'>Delete {guard?.name}?</Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant='body2'>
            All the data related to this Security Guard will be removed and will be inaccessible after deletion.
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
      </Spin>
    </Dialog>
  )
}

export default DeleteGuardModal
