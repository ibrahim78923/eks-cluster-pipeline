// ** React Imports
import {  forwardRef,  useRef } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'

import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Fade from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

import { create } from 'src/services/guard.service'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import { toast } from 'react-hot-toast'

import { useAuth } from 'src/hooks/useAuth'

import { DialogTitle } from '@mui/material'

import { Spin } from 'antd'
import * as React from "react";
import NProgress from "nprogress";

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})

const AddGuardModal = ({ isOpen, handleClose, onSubmit }) => {
  const auth = useAuth()
  // ** States
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState("")
  const [phoneNo, setPhoneNo] = React.useState('')
  const [nationalId, setNationalId] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const logoInputRef = useRef(null)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = {
      name,
      email,
      phoneNo,
      motherEmail: email,
      nationalId,
      clientId: auth.user.id,
      role:'guards'
    }
    const result = await create(
      data
    )

    if (result?.success) {
      toast.success('security guard added')
      setLoading(false);
      onSubmit(result.guards)
      handleClose()
      reset()
    } else {
      toast.error(result?.message)
      setLoading(false);
    }
  }

  const handlePhoneNo = e => {
    const inputValue = event.target.value
    const isPositiveNumber = /^\d*\.?\d*$/.test(inputValue)

    if (isPositiveNumber) {
      setPhoneNo(inputValue)
    } else {
      setPhoneNo('')
    }
  }
  const reset = () => {
    setPhoneNo('')
    setName('')
    setNationalId('')
    setEmail('')
  }
  return (
    <>
      <Dialog
        fullWidth
        open={isOpen}
        maxWidth='sm'
        scroll='body'
        onClose={()=>{reset();handleClose();}}
        TransitionComponent={Transition}
        onBackdropClick={handleClose}
      >
        <DialogTitle>Add Guard</DialogTitle>
        <IconButton size='small' onClick={handleClose} sx={{ position: 'absolute', right: '1rem', top: '1rem' }}>
          <Icon icon='mdi:close' />
        </IconButton>
        <Spin spinning={loading}>
          <form autocomplete="off" onSubmit={handleSubmit}>
            <DialogContent>
              <Grid container spacing={5}>
                    <Grid item sm={12} md={12}>
                      <TextField
                        value={name}
                        onChange={e => setName(e.target.value)}
                        fullWidth
                        label='Name'
                        size='small'
                        required
                      />
                    </Grid>
                    <Grid item sm={12} md={12}>
                      <TextField
                        type='email'
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        fullWidth
                        label='Email'
                        size='small'
                        required
                        autocomplete='off'
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        type='text'
                        value={phoneNo}
                        onChange={handlePhoneNo}
                        fullWidth
                        label='Guardian Phone No'
                        size='small'
                      />
                    </Grid>
                    <Grid item xs={12}>
                          <TextField
                            type='text'
                            value={nationalId}
                            onChange={e => setNationalId(e.target.value)}
                            fullWidth
                            label='Guard National Id card  No'
                            size='small'
                            required
                          />
                    </Grid>

              </Grid>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'space-between' }}>
              <Button variant='outlined' onClick={()=> {
                reset();
                handleClose();
              }}>
                Discard
              </Button>
              <Button variant='contained' type='submit'>
                Create
              </Button>
            </DialogActions>
          </form>
        </Spin>
      </Dialog>
    </>
  )
}

export default AddGuardModal
