// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Components
import CurrentPlanCard from 'src/views/account-settings/billing/CurrentPlanCard'

const TabBilling = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <CurrentPlanCard />
      </Grid>
    </Grid>
  )
}

export default TabBilling
