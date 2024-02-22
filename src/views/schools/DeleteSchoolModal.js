// ** React Imports
import React, { forwardRef, useState } from 'react'

import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import Fade from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

import { remove } from 'src/services/school.service'

import { toast } from 'react-hot-toast'

// ** Hooks
import { Box, IconButton, Typography, Alert } from '@mui/material'
import { Icon } from '@iconify/react'
import { Spin } from 'antd'

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})

const DeleteSchoolModal = ({ isOpen, handleClose, onSubmit, school }) => {
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState('')

  const handleSubmit = async () => {
    setErrors('')
    setLoading(true)
    const result = await remove(school.id)

    if (result?.success) {
      setLoading(false)
      toast.success('School deleted successfully.')
      onSubmit(school.id)
      handleClose()
    } else {
      setLoading(false)
      setErrors(result?.response?.data?.message)
      toast.error(result?.response?.data?.message)
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
            <Typography variant='h6'>Delete {school?.name}?</Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant='body2'>
              All the data related to this school will be removed and will be inaccessible after deletion.
            </Typography>
          </Box>
        </DialogContent>
        {errors && <Alert severity='error'>{errors}</Alert>}
        <DialogActions sx={{ pb: 8, px: { xs: 8, sm: 15 }, justifyContent: 'center' }}>
          <Button variant='outlined' onClick={handleClose}>
            Cancel
          </Button>
          <Button variant='contained' onClick={handleSubmit}>
            Delete
          </Button>
        </DialogActions>
      </Spin>
    </Dialog>
  )
}

export default DeleteSchoolModal
