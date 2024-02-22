import * as React from 'react'
// ** MUI Components
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard from '@mui/material/Card'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV1 from 'src/views/auth/FooterIllustrationsV1'

// ** Styled Components
const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
}))

const WelcomePage = () => {
  // ** Hook
  const theme = useTheme()

  return (
    <Box className='content-center'>
      <Card sx={{ zIndex: 1 }}>
        <CardContent sx={{ p: theme => `${theme.spacing(15.5, 7, 8)} !important` }}>
          <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant='h6' sx={{ ml: 2, lineHeight: 1, fontWeight: 700, fontSize: '1.5rem !important' }}>
              <img src='/images/welcome_image.png' style={{ width: 150, objectFit: 'cover' }} />
            </Typography>
          </Box>
          <Box sx={{ mb: 6 }}>
            <Typography variant='h5' sx={{ mb: 1.5, letterSpacing: '0.18px', fontWeight: 600, textAlign: 'center' }}>
              Congratulations 🎉
            </Typography>
            <Typography style={{ textAlign: 'center' }} variant='body2'>
              Your password has been reset!
            </Typography>
          </Box>
        </CardContent>
      </Card>
      <FooterIllustrationsV1 image={`/images/pages/auth-v1-reset-password-mask-${theme.palette.mode}.png`} />
    </Box>
  )
}
WelcomePage.getLayout = page => <BlankLayout>{page}</BlankLayout>
WelcomePage.guestGuard = true

export default WelcomePage
