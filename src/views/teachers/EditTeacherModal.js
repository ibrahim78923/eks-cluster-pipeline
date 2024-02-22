// ** React Imports
import * as React from 'react'
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
import { Spin } from 'antd'

import { update } from 'src/services/teacher.service'

import { toast } from 'react-hot-toast'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})

const DialogEditTeacher = props => {
  const { isOpen, handleClose, onSubmit, teacher } = props

  const [name, setName] = useState('')
  const [nameAr, setNameAr] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setLoading] = React.useState(false)

  useEffect(() => {
    if (teacher.name) {
      setName(teacher.name)
    }
    if (teacher.nameAr) {
      setNameAr(teacher.nameAr)
    }
    if (teacher.email) {
      setEmail(teacher.email)
    }
    if (teacher.password) {
      setPassword(teacher.password)
    }
  }, [teacher])

  const handleSubmit = async () => {
    setLoading(true);
    const result = await update(teacher.id, name, nameAr, email,password)

    if (result.success) {
      setLoading(false);
      toast.success('Teacher updated successfully')
      onSubmit()
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
    <Spin spinning={isLoading}>
      <DialogContent sx={{ pb: 6, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}>
        <IconButton size='small' onClick={handleClose} sx={{ position: 'absolute', right: '1rem', top: '1rem' }}>
          <Icon icon='mdi:close' />
        </IconButton>
        <Box sx={{ mb: 9, textAlign: 'center' }}>
          <Typography variant='h5' sx={{ mb: 3, lineHeight: '2rem' }}>
            Edit Teacher
          </Typography>
        </Box>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <TextField
              value={name}
              size='small'
              onChange={e => setName(e.target.value)}
              fullWidth
              label='Teacher Name'
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              value={nameAr}
              size='small'
              onChange={e => setNameAr(e.target.value)}
              fullWidth
              label='Arabic Name'
            />
          </Grid>
          <Grid item xs={12}>
            <TextField value={email} size='small' onChange={e => setEmail(e.target.value)} fullWidth label='Email' />
          </Grid>
          <Grid item xs={12}>
            <TextField value={password} size='small' onChange={e => setPassword(e.target.value)} fullWidth label='Password' />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'center' }}>
        <Button variant='outlined' color='secondary' onClick={handleClose}>
          Cancel
        </Button>
        <Button variant='contained' sx={{ mr: 2 }} onClick={handleSubmit}>
          Submit
        </Button>
      </DialogActions>
      </Spin>
    </Dialog>
  )
}

export default DialogEditTeacher
