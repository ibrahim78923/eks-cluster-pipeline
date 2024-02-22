// ** React Imports
import { useState, forwardRef } from 'react'

import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import Fade from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContentText from '@mui/material/DialogContentText'

import { remove } from 'src/services/client.service'

// ** Hooks
import useBgColor from 'src/@core/hooks/useBgColor'
import { toast } from 'react-hot-toast'
import { Spin } from 'antd'

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})

const DialogDeleteSchool = props => {
  const { isOpen, handleClose, onSubmit, client } = props
  const [loading, setLoading] = useState(false)

  // ** Hooks
  const bgColors = useBgColor()

  const handleSubmit = async () => {
    setLoading(true)
    const result = await remove(client.id)

    if (result.success) {
      setLoading(false)
      toast.success('Client has been deleted.')
      onSubmit(client.id)
      handleClose()
    } else {
      setLoading(false)
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
        <DialogTitle sx={{ textAlign: 'center' }}>{'Are you you want to delete this School'}</DialogTitle>
        <DialogContent sx={{ textAlign: 'center' }}>
          <DialogContentText id='alert-dialog-slide-description'>
            After delete this Client is no longer visible in this record.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button variant='contained' sx={{ mr: 2 }} onClick={handleSubmit}>
            Delete
          </Button>
          <Button variant='outlined' color='secondary' onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </Spin>
    </Dialog>
  )
}

export default DialogDeleteSchool
