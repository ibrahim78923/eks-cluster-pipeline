// ** React Imports
import { useState, forwardRef, useEffect } from 'react'

import Dialog from '@mui/material/Dialog'
import { Button, Grid, TextField, IconButton } from '@mui/material'
import Fade from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContentText from '@mui/material/DialogContentText'

import { updatePassword } from 'src/services/client.service'

// ** Hooks
import useBgColor from 'src/@core/hooks/useBgColor'
import { toast } from 'react-hot-toast'
import { Spin } from 'antd'
import { Icon } from '@iconify/react'

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})

const DialogUpdatePassword = props => {
  const { isOpen, handleClose, client, onSubmit } = props
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState('')

  const handlePasswordChange = event => {
    setPassword(event.target.value)
  }
  // ** Hooks
  const bgColors = useBgColor()

  const handleSubmit = async () => {
    setLoading(true)
    const result = await updatePassword(client.id, password?.trim())

    if (result.success) {
      setLoading(false)
      toast.success('Password has been updated.')
      onSubmit(client.id)
      handleClose()
    } else {
      setLoading(false)
      toast.error(result.message)
    }
  }

  useEffect(()=> {
    return ()=> {
      setPassword("")
    }
  },[isOpen])

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
        <DialogTitle sx={{ textAlign: 'center' }}>Update Password</DialogTitle>
        <IconButton size='small' onClick={handleClose} sx={{ position: 'absolute', right: '1rem', top: '1rem' }}>
          <Icon icon='mdi:close' />
        </IconButton>
        <DialogContent sx={{ textAlign: 'center' }}>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <TextField fullWidth label='Password' value={password} onChange={handlePasswordChange} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button variant='contained' sx={{ mr: 2 }} onClick={handleSubmit}>
            Update
          </Button>
          <Button variant='outlined' color='secondary' onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </Spin>
    </Dialog>
  )
}

export default DialogUpdatePassword
