// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Components Imports
import Welcome from 'src/views/dashboard/Welcome'

const Dashboard = () => {
  return (
    <Grid container spacing={6} className='match-height'>
      <Grid item xs={12} md={4}>
        <Welcome />
      </Grid>
    </Grid>
  )
}

export default Dashboard
