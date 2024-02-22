// ** React Imports
import * as React from 'react'
import { useState } from 'react'
import { useRouter } from 'next/router'

// ** MUI Components
import {
  Box,
  Button,
  Typography,
  InputLabel,
  IconButton,
  CardContent,
  FormControl,
  OutlinedInput,
  InputAdornment
} from '@mui/material'
import { styled, useTheme } from '@mui/material/styles'
import { toast } from 'react-hot-toast'
import { updateParent, checkForgotPassword, updateUser } from 'src/services/student.service'
import MuiCard from '@mui/material/Card'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** De142
import FooterIllustrationsV1 from 'src/views/auth/FooterIllustrationsV1'
import { Spin } from 'antd'
import { concat } from 'lodash'

// ** Styled Components
const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
}))

const ResetPasswordV1 = () => {
  // ** States
  const [values, setValues] = useState({
    newPassword: '',
    showNewPassword: false,
    confirmNewPassword: '',
    showConfirmNewPassword: false
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = React.useState(false)
  const [isPasswordChange, setIsPasswordChange] = useState(false)

  const router = useRouter()
  const { token } = router.query

  // ** Hook
  const theme = useTheme()
  function parseJwt(token) {
    if (token) {
      var base64Payload = token?.split('.')[1]
      var payload = Buffer?.from(base64Payload, 'base64')
      return JSON.parse(payload?.toString())
    }
  }
  let jwtToken = parseJwt(token)
  console.log(jwtToken, 'jwt')

  function isLinkExpired(linkExpiryMillis) {
    const currentTime = Date.now()
    return currentTime >= linkExpiryMillis
  }

  const isExpired = isLinkExpired(jwtToken?.expiry)

  const checkPassword = async data => {
    if (data?.id) {
      const res = await checkForgotPassword(data?.id, data?.role)
      if (res?.success) {
        setIsPasswordChange(res?.data?.forget)

        return res?.data?.forget
      }
    }
  }
  React.useEffect(() => {
    checkPassword(jwtToken)
  }, [jwtToken?.id])

  const handleSubmit = async e => {
    e.preventDefault()
    if (!checkPassword(jwtToken) || !isExpired) {
      if (values?.newPassword && values?.confirmNewPassword) {
        if (values?.newPassword === values?.confirmNewPassword) {
          setError('')
          setLoading(true)
          const result = await updateParent(jwtToken?.id, values?.confirmNewPassword, jwtToken?.role)

          if (result?.success) {
            toast.success('Password has been Reset')
            const data = {
              id: jwtToken?.id,
              forget: true
            }
            const res = await updateUser(data, jwtToken?.role)
            if (res?.success) {
              setLoading(false)
              setValues({
                newPassword: '',
                showNewPassword: false,
                confirmNewPassword: '',
                showConfirmNewPassword: false
              })
              if (jwtToken?.role === 'CLIENT') {
                router.push('/login')
              } else {
                router.push('/welcome-page')
              }
            }
          } else {
            setLoading(false)
            toast.error('Server Error')
          }
        } else {
          setError('Password is Mis-matched')
          toast.error('Password is Mis-matched')
          setValues({ ...values, confirmNewPassword: '' })
        }
      } else {
        toast.error('PLease Enter Password')
      }
    } else {
      setIsPasswordChange(true)
    }
  }

  // Handle New Password
  const handleNewPasswordChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleClickShowNewPassword = () => {
    setValues({ ...values, showNewPassword: !values.showNewPassword })
  }

  const handleMouseDownNewPassword = event => {
    event.preventDefault()
  }

  // Handle Confirm New Password
  const handleConfirmNewPasswordChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleClickShowConfirmNewPassword = () => {
    setValues({ ...values, showConfirmNewPassword: !values.showConfirmNewPassword })
  }

  const handleMouseDownConfirmNewPassword = event => {
    event.preventDefault()
  }

  return (
    <Box className='content-center'>
      <Card sx={{ zIndex: 1 }}>
        <CardContent sx={{ p: theme => `${theme.spacing(15.5, 7, 8)} !important` }}>
          <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant='h6' sx={{ ml: 2, lineHeight: 1, fontWeight: 700, fontSize: '1.5rem !important' }}>
              <img src='/images/logo.png' style={{ width: 150, objectFit: 'cover' }} />
            </Typography>
          </Box>
          <Box sx={{ mb: 6 }}>
            <Typography variant='h5' sx={{ mb: 1.5, letterSpacing: '0.18px', fontWeight: 600 }}>
              Reset Password 🔒
            </Typography>
          </Box>
          {jwtToken?.id && (
            <div>
              {isExpired || isPasswordChange ? (
                // Show expired message
                <p>The link has been expired. Please request a new reset password link.</p>
              ) : (
                <Spin spinning={loading}>
                  <form noValidate autoComplete='off' onSubmit={handleSubmit}>
                    <FormControl fullWidth sx={{ mb: 4 }}>
                      <InputLabel htmlFor='auth-reset-password-new-password'>New Password</InputLabel>
                      <OutlinedInput
                        autoFocus
                        label='New Password'
                        value={values.newPassword}
                        id='auth-reset-password-new-password'
                        onChange={handleNewPasswordChange('newPassword')}
                        type={values.showNewPassword ? 'text' : 'password'}
                        endAdornment={
                          <InputAdornment position='end'>
                            <IconButton
                              edge='end'
                              onClick={handleClickShowNewPassword}
                              aria-label='toggle password visibility'
                              onMouseDown={handleMouseDownNewPassword}
                            >
                              <Icon icon={values.showNewPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} />
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                    </FormControl>
                    <FormControl fullWidth sx={{ mb: 4 }}>
                      <InputLabel htmlFor='auth-reset-password-confirm-password'>Confirm Password</InputLabel>
                      <OutlinedInput
                        label='Confirm Password'
                        value={values.confirmNewPassword}
                        id='auth-reset-password-confirm-password'
                        type={values.showConfirmNewPassword ? 'text' : 'password'}
                        onChange={handleConfirmNewPasswordChange('confirmNewPassword')}
                        error={!!error}
                        helperText={error}
                        required
                        endAdornment={
                          <InputAdornment position='end'>
                            <IconButton
                              edge='end'
                              aria-label='toggle password visibility'
                              onClick={handleClickShowConfirmNewPassword}
                              onMouseDown={handleMouseDownConfirmNewPassword}
                            >
                              <Icon icon={values.showConfirmNewPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} />
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                    </FormControl>
                    <Button
                      loading={loading}
                      fullWidth
                      size='large'
                      type='submit'
                      variant='contained'
                      sx={{ mb: 5.25 }}
                    >
                      Set New Password
                    </Button>
                  </form>
                </Spin>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      <FooterIllustrationsV1 image={`/images/pages/auth-v1-reset-password-mask-${theme.palette.mode}.png`} />
    </Box>
  )
}
ResetPasswordV1.getLayout = page => <BlankLayout>{page}</BlankLayout>
ResetPasswordV1.guestGuard = true

export default ResetPasswordV1
