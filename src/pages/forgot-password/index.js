// ** Next Import
import Link from 'next/link'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { styled } from '@mui/material/styles'
import MuiCard from '@mui/material/Card'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import { forgotPassword } from 'src/services/client.service'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { useState } from 'react'
import { Spin } from 'antd'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/router'

const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: 450 }
}))

const ForgotPasswordV1 = () => {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    const result = await forgotPassword(e.target[0]?.value)
    if (result?.success) {
      setLoading(false)
      toast.success('An Email has been sent to provided email')
      router.push('/login')
    } else {
      setLoading(false)
      toast.error(result?.message)
    }
  }

  return (
    <Box className='content-center'>
      <Card sx={{ zIndex: 1 }}>
        <CardContent sx={{ p: theme => `${theme.spacing(15.5, 7, 8)} !important` }}>
          <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src='/images/logo.png' style={{ width: 150, objectFit: 'cover' }} />
          </Box>
          <Spin spinning={loading}>
            <Box sx={{ mb: 6.5 }}>
              <Typography variant='h5' sx={{ mb: 1.5, letterSpacing: '0.18px', fontWeight: 600 }}>
                Forgot Password? 🔒
              </Typography>
              <Typography variant='body2'>
                Enter your email and we&prime;ll send you instructions to reset your password
              </Typography>
            </Box>
            <form onSubmit={handleSubmit}>
              <TextField required autoFocus type='email' label='Email' sx={{ display: 'flex', mb: 4 }} />
              <Button fullWidth size='large' type='submit' variant='contained' sx={{ mb: 5.25 }}>
                Send reset link
              </Button>
            </form>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Link href='/login'>
                <Typography
                  href='/pages/auth/login-v1'
                  sx={{
                    display: 'flex',
                    '& svg': { mr: 1.5 },
                    alignItems: 'center',
                    color: 'primary.main',
                    textDecoration: 'none',
                    justifyContent: 'center'
                  }}
                >
                  <Icon icon='mdi:chevron-left' fontSize='2rem' />
                  <span>Back to login</span>
                </Typography>
              </Link>
            </Box>
          </Spin>
        </CardContent>
      </Card>
    </Box>
  )
}
ForgotPasswordV1.getLayout = page => <BlankLayout>{page}</BlankLayout>
ForgotPasswordV1.guestGuard = true

export default ForgotPasswordV1
