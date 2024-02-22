// ** React Imports
import {  forwardRef, useEffect } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'

import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Fade from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

import { update} from 'src/services/guard.service'

import { toast } from 'react-hot-toast'

// ** Icon Imports
import * as React from "react";
import {DialogTitle} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Icon from "../../@core/components/icon";
import {Spin} from "antd";

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})

const EditGuardModal = props => {
  const { isOpen, handleClose, onSubmit, guard } = props

  // ** States
  const [id, setId] = React.useState('')
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState("")
  const [phoneNo, setPhoneNo] = React.useState('')
  const [nationalId, setNationalId] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  useEffect(() => {
    if (guard) {
      setId(guard.id)
      setName(guard.name)
      setEmail(guard.email)
      setPhoneNo(guard.phoneNo)
      setNationalId(guard.nationalId)
    }

  }, [guard])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true);
    const data = {
      id,
      name,
      email,
      phoneNo,
      nationalId,
    }
    const result = await update(
      data
    )

    if (result.success) {
      toast.success('guard updated successfully.')
      onSubmit(data)
      setLoading(false);
      handleClose()
    } else {
      toast.error(result.message)
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
        <DialogTitle>Update Guard</DialogTitle>
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
              <Button variant='outlined' onClick={
                handleClose
              }>
                Discard
              </Button>
              <Button variant='contained' type='submit'>
                update
              </Button>
            </DialogActions>
          </form>
        </Spin>
      </Dialog>
    </>
  )
}

export default EditGuardModal
