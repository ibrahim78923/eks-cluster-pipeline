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

import { update } from 'src/services/client.service'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Hooks
import { toast } from 'react-hot-toast'
import { Spin } from 'antd'
import { getAllPlans } from 'src/services/cms'

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})

const DialogEditClient = props => {
  const { client, isOpen, handleClose, onSubmit } = props

  // ** States
  const [name, setName] = useState('')
  const [schoolName, setSchoolName] = useState('')
  const [email, setEmail] = useState('')

  const [mobile, setMobile] = useState('')
  const [duration, setDuration] = useState('')
  const [planId, setPlanId] = useState(0)

  const [loading, setLoading] = useState(false)
  const [plans, setPlans] = useState([])
  const [error, setError] = useState('')

  const reset = () => {
    setName('')
    setSchoolName('')
    setEmail('')
    setMobile('')
    setDuration('')
  }

  useEffect(() => {
    return () => {
      reset()
    }
  }, [isOpen])

  const fetchPlans = async lang => {
    const res = await getAllPlans(lang)
    if (res?.success) {
      setPlans(res?.plans)
    }
  }

  useEffect(() => {
    if (client) {
      setName(client?.name)
      setSchoolName(client?.schoolName)
      setEmail(client?.email)
      setMobile(client?.mobile)
      setDuration(client?.plan?.durationType)
      setPlanId(client?.plan?.id)

      fetchPlans(client?.plan?.lang || 'en')
    }
  }, [client?.id])

  // ** Hooks
  const handleSubmit = async e => {
    e.preventDefault()
    if (planId) {
      setLoading(true)
      const result = await update(client?.id, name, email, schoolName, mobile, planId)

      if (result?.success) {
        setLoading(false)
        onSubmit(result.client)
        toast.success('Client has been added.')
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
                Edit Client
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
                  disabled
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
              Save
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

export default DialogEditClient
