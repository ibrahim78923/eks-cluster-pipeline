// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// Styled component for the trophy image

const CrmAward = ({ name }) => {
  return (
    <Card sx={{ position: 'relative', minHeight: 150 }}>
      <CardContent>
        <Typography variant='h6'>Selected Client</Typography>
        <br />
        <Typography variant='h6'>
          <Box component='span' sx={{ fontWeight: 'bold' }}>
            {name}
          </Box>
        </Typography>
      </CardContent>
    </Card>
  )
}

export default CrmAward
