// ** React Imports
import React, { forwardRef, useEffect } from 'react'

import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import Fade from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContentText from '@mui/material/DialogContentText'
import Alert from '@mui/material/Alert';

import { remove } from 'src/services/teacher.service'
import { Spin, message } from 'antd'

import { toast } from 'react-hot-toast'
import { Box, IconButton, Typography } from '@mui/material'
import { Icon } from '@iconify/react'

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})

const DeleteTeacherModal = ({ isOpen, handleClose, onSubmit, teacher }) => {
  const [isLoading, setLoading] = React.useState(false)
  const [errors, setErrors] = React.useState(false)

  useEffect(()=> {
    return ()=> {
      setErrors(false);
    }
  },[handleClose])

  const handleSubmit = async () => {
    setLoading(true);
    const result = await remove(teacher.id)

    if (result?.success) {
      setLoading(false);
      toast.success('Teacher has been deleted')
      setErrors(false);
      onSubmit(teacher.id)
      handleClose()
    } else {
      setLoading(false);
      setErrors(true);
      toast.error(result?.message)
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
    <Spin spinning={isLoading}>
      <DialogContent sx={{ pb: 6, px: { xs: 8, sm: 15 }, pt: 8, position: 'relative' }}>
        <IconButton size='small' onClick={handleClose} sx={{ position: 'absolute', right: '1rem', top: '1rem' }}>
          <Icon icon='mdi:close' />
        </IconButton>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant='h6'>Delete {teacher?.name}?</Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant='body2'>
            All the data related to this teacher will be removed and will be inaccessible after deletion.
          </Typography>
        </Box>
      </DialogContent>
      {errors &&
        <Alert severity="error">Teacher can't be Delete, Because this Teacher is assigned in Grades!</Alert>
      }
      <DialogActions sx={{ pb: 8, px: { xs: 8, sm: 15 }, justifyContent: 'center' }}>
        <Button variant='outlined' color='secondary' onClick={handleClose}>
          Cancel
        </Button>
        <Button variant='contained' sx={{ mr: 2 }} onClick={handleSubmit} disabled={errors}>
          Delete
        </Button>
      </DialogActions>
      </Spin>
    </Dialog>
  )
}

export default DeleteTeacherModal
