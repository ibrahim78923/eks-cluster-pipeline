// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { useAuth } from 'src/hooks/useAuth'

// Styled component for the trophy image
const TrophyImg = styled('img')(({ theme }) => ({
  right: 22,
  bottom: 0,
  width: 106,
  position: 'absolute',
  [theme.breakpoints.down('sm')]: {
    width: 95
  }
}))

const CrmAward = () => {
  const auth = useAuth()

  return (
    <Card sx={{ position: 'relative', minHeight: 150 }}>
      <CardContent>
        <Typography variant='h6'>
          Hey{' '}
          <Box component='span' sx={{ fontWeight: 'bold' }}>
            {auth.user.name}
          </Box>
          ! 🎉
        </Typography>
        <TrophyImg alt='trophy' src='/images/cards/trophy.png' />
      </CardContent>
    </Card>
  )
}

export default CrmAward
