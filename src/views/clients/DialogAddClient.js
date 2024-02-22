// ** React Imports
import { useState, useEffect, forwardRef } from 'react'

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
import { Select, MenuItem, FormControl, InputLabel, Alert } from '@mui/material'

import { create, sendEmail } from 'src/services/client.service'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Hooks
import { toast } from 'react-hot-toast'
import { Spin } from 'antd'
import { getAllPlans } from 'src/services/cms'

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})

const DialogAddClient = props => {
  const { isOpen, handleClose, onSubmit } = props

  // ** States
  const [name, setName] = useState('')
  const [schoolName, setSchoolName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [mobile, setMobile] = useState('')
  const [landline, setLandline] = useState('')
  const [perUserPrice, setPerUserPrice] = useState('')

  const [startDate, setStartDate] = useState('')
  const [duration, setDuration] = useState('')
  const [planId, setPlanId] = useState(0)
  const [expiryDate, setExpiryDate] = useState('')

  const [loading, setLoading] = useState(false)
  const [plans, setPlans] = useState([])
  const [error, setError] = useState('')

  const reset = () => {
    setName('')
    setSchoolName('')
    setEmail('')
    setPassword('')
    setMobile('')
    setLandline('')
    setPerUserPrice('')
    setStartDate('')
    setDuration('')
    setExpiryDate('')
  }

  useEffect(() => {
    return () => {
      reset()
    }
  }, [isOpen])

  const fetchPlans = async () => {
    const res = await getAllPlans('en')
    if (res?.success) {
      setPlans(res?.plans)
    }
  }
  useEffect(() => {
    fetchPlans()
  }, [])

  // ** Hooks
  const handleSubmit = async e => {
    e.preventDefault()
    if (planId) {
      setLoading(true)
      const result = await create(
        name,
        email,
        schoolName,
        mobile,
        landline,
        perUserPrice,
        startDate,
        duration,
        expiryDate,
        password,
        planId
      )

      if (result?.success) {
        setLoading(false)
        onSubmit(result.client)
        toast.success('Client has been added.')
        const emailData = {
          id: result?.client?.id,
          email: result?.client?.email,
          name: result?.client?.name,
          password: result?.client?.password
        }
        const response = await sendEmail(emailData)
        if (response?.success) {
          console.log('Email sent')
        }
        handleClose()
      } else {
        setLoading(false)
        toast.error(result?.message)
      }
    } else {
      setError('Please Select a Plan')
      toast.error('Please Select a Plan')
    }
  }

  const handleDurationChange = e => {
    setDuration(e.target.value)
  }
  const handlePLanChange = e => {
    setPlanId(e.target.value)
    setError('')
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
        <form autocomplete='off' onSubmit={handleSubmit}>
          <DialogContent sx={{ pb: 6, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}>
            <IconButton size='small' onClick={handleClose} sx={{ position: 'absolute', right: '1rem', top: '1rem' }}>
              <Icon icon='mdi:close' />
            </IconButton>
            <Box sx={{ mb: 9, textAlign: 'center' }}>
              <Typography variant='h5' sx={{ mb: 3, lineHeight: '2rem' }}>
                Add New Client
              </Typography>
            </Box>
            <Grid container spacing={5}>
              <Grid item sm={6} xs={12}>
                <TextField
                  value={schoolName}
                  onChange={e => setSchoolName(e.target.value)}
                  fullWidth
                  label='School Name'
                  placeholder='School Name'
                  type='text'
                  required
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextField
                  value={name}
                  onChange={e => setName(e.target.value)}
                  fullWidth
                  label='Representative Name'
                  placeholder='Representative Name'
                  type='text'
                  required
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextField
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  fullWidth
                  label='Email'
                  placeholder='abc@gmail.com'
                  type='email'
                  required
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextField
                  value={mobile}
                  onChange={e => setMobile(e.target.value)}
                  fullWidth
                  label='Mobile'
                  placeholder='Mobile'
                  type='number'
                  required
                />
              </Grid>

              <Grid item sm={6} xs={12}>
                <FormControl fullWidth required>
                  <InputLabel id='duration-select-label'>Select Duration</InputLabel>
                  <Select
                    labelId='duration-select-label'
                    label='Select Duration'
                    id='duration-select'
                    fullWidth
                    value={duration}
                    onChange={handleDurationChange}
                    required
                  >
                    <MenuItem value='monthly'>Monthly</MenuItem>
                    <MenuItem value='yearly'>Yearly</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item sm={6} xs={12}>
                <FormControl fullWidth required>
                  <InputLabel id='duration-select-label'>Select Plans</InputLabel>
                  <Select
                    labelId='duration-select-label'
                    label='Select Duration'
                    id='duration-select'
                    fullWidth
                    value={planId}
                    onChange={handlePLanChange}
                    disabled={!duration}
                    required
                  >
                    <MenuItem value={0}>--Select Plan--</MenuItem>
                    {plans
                      ?.filter(item => item?.durationType === duration)
                      ?.map(item => {
                        return <MenuItem value={item?.id}>{`${item?.title} $${item?.price}`}</MenuItem>
                      })}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            {error && <Alert severity='error'>{error}</Alert>}
          </DialogContent>
          <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'center' }}>
            <Button type='submit' variant='contained' sx={{ mr: 2 }}>
              Submit
            </Button>
            <Button variant='outlined' color='secondary' onClick={handleClose}>
              Cancel
            </Button>
          </DialogActions>
        </form>
      </Spin>
    </Dialog>
  )
}

export default DialogAddClient
