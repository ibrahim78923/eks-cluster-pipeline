// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Select from '@mui/material/Select'
import Dialog from '@mui/material/Dialog'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import Checkbox from '@mui/material/Checkbox'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import CardHeader from '@mui/material/CardHeader'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'

import { updateStatus, getByID, updateClient } from 'src/services/client.service'

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { useAuth } from 'src/hooks/useAuth'
import { toast } from 'react-hot-toast'
import { Spin } from 'antd'

const initialData = {
  mobile: '',
  address: '',
  zipCode: '',
  name: '',
  country: '',
  city: '',
  email: '',
  schoolName: ''
}

const TabAccount = () => {
  // ** State
  const [open, setOpen] = useState(false)
  const [userInput, setUserInput] = useState('yes')
  const [formData, setFormData] = useState(initialData)
  const [secondDialogOpen, setSecondDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const auth = useAuth()

  const fetchUser = async id => {
    const result = await getByID(id)
    if (result?.success) {
      setFormData(result?.client)
    }
  }

  useEffect(() => {
    fetchUser(auth?.user?.id)
  }, [])

  // ** Hooks
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues: { checkbox: false } })
  const handleClose = () => setOpen(false)
  const handleSecondDialogClose = () => setSecondDialogOpen(false)
  const onSubmit = async () => {
    const result = await updateStatus(auth?.user?.id, false)

    if (result?.success) {
      setOpen(true)
    } else {
      setOpen(false)
    }
  }

  const handleConfirmation = value => {
    handleClose()
    setUserInput(value)
    setSecondDialogOpen(true)
  }

  const handleFormChange = (field, value) => {
    setFormData(prev => {
      return { ...prev, [field]: value }
    })
  }
  const UpdateUser = async () => {
    setLoading(true)
    const result = await updateClient(formData)
    if (result?.success) {
      setLoading(false)
      toast.success('User Updated Successfully')
    } else {
      setLoading(false)

      toast.error(result?.message)
    }
  }
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Account Details' />
          <Spin spinning={loading}>
            <Divider />
            <CardContent>
              <Grid container spacing={6}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    type='text'
                    fullWidth
                    label='Your Name'
                    placeholder='John'
                    value={formData.name}
                    onChange={e => handleFormChange('name', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type='text'
                    label='SCHOOL NAME'
                    placeholder='SCHOOL NAME'
                    value={formData.schoolName}
                    onChange={e => handleFormChange('schoolName', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type='email'
                    label='Email'
                    value={formData.email}
                    placeholder='john.doe@example.com'
                    onChange={e => handleFormChange('email', e.target.value)}
                    disabled
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type='number'
                    label='PHONE NUMBER'
                    value={formData.mobile}
                    placeholder='PHONE NUMBER'
                    onChange={e => handleFormChange('mobile', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    type='text'
                    fullWidth
                    label='Country'
                    placeholder='Country'
                    value={formData.country}
                    onChange={e => handleFormChange('country', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    type='text'
                    fullWidth
                    label='City'
                    placeholder='City'
                    value={formData.city}
                    onChange={e => handleFormChange('city', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    type='text'
                    fullWidth
                    label='Address'
                    placeholder='Address'
                    value={formData.address}
                    onChange={e => handleFormChange('address', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type='text'
                    label='Zip Code'
                    placeholder='231465'
                    value={formData.zipCode}
                    onChange={e => handleFormChange('zipCode', e.target.value)}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button onClick={UpdateUser} variant='contained' sx={{ mr: 3 }}>
                    Save Changes
                  </Button>
                  <Button type='reset' variant='outlined' color='secondary' onClick={() => setFormData(initialData)}>
                    Reset
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Spin>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardHeader title='Delete Account' />
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box sx={{ mb: 4 }}>
                <FormControl>
                  <Controller
                    name='checkbox'
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <FormControlLabel
                        label='I confirm my account deactivation'
                        sx={errors.checkbox ? { '& .MuiTypography-root': { color: 'error.main' } } : null}
                        control={
                          <Checkbox
                            {...field}
                            size='small'
                            name='validation-basic-checkbox'
                            sx={errors.checkbox ? { color: 'error.main' } : null}
                          />
                        }
                      />
                    )}
                  />
                  {errors.checkbox && (
                    <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-checkbox'>
                      Please confirm you want to delete account
                    </FormHelperText>
                  )}
                </FormControl>
              </Box>
              <Button variant='contained' color='error' type='submit' disabled={errors.checkbox !== undefined}>
                Deactivate Account
              </Button>
            </form>
          </CardContent>
        </Card>
      </Grid>

      <Dialog fullWidth maxWidth='xs' open={open} onClose={handleClose}>
        <DialogContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ maxWidth: '85%', textAlign: 'center', '& svg': { mb: 4, color: 'warning.main' } }}>
              <Icon icon='mdi:alert-circle-outline' fontSize='5.5rem' />
              <Typography>Are you sure you would like to deactivate your account?</Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button variant='contained' onClick={() => handleConfirmation('yes')}>
            Yes
          </Button>
          <Button variant='outlined' color='secondary' onClick={() => handleConfirmation('cancel')}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog fullWidth maxWidth='xs' open={secondDialogOpen} onClose={handleSecondDialogClose}>
        <DialogContent>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              '& svg': {
                mb: 14,
                color: userInput === 'yes' ? 'success.main' : 'error.main'
              }
            }}
          >
            <Icon
              fontSize='5.5rem'
              icon={userInput === 'yes' ? 'mdi:check-circle-outline' : 'mdi:close-circle-outline'}
            />
            <Typography variant='h4' sx={{ mb: 8 }}>
              {userInput === 'yes' ? 'Deleted!' : 'Cancelled'}
            </Typography>
            <Typography>
              {userInput === 'yes' ? 'Your account has been deleted.' : 'Account Deactivation Cancelled!'}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button variant='contained' color='success' onClick={handleSecondDialogClose}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default TabAccount
