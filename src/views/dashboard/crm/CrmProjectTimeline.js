// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Util Import
import CrmTotalGrowth from './CrmTotalGrowth'

const CrmProjectTimeline = ({ data }) => {
  return (
    <Card>
      <Grid container>
        <Grid item xs={12} sm={6}>
          <CrmTotalGrowth growthData={data} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CardHeader
            title='Device List'
            subheader='2 Ongoing Devices'
            subheaderTypographyProps={{ sx: { lineHeight: 1.429 } }}
            titleTypographyProps={{ sx: { letterSpacing: '0.15px' } }}
          />
          <CardContent>
            <Box sx={{ mb: 6, display: 'flex', alignItems: 'center' }}>
              <CustomAvatar skin='light' variant='rounded' sx={{ mr: 3, width: 45, height: 45 }}>
                <Icon icon='mdi:cellphone' />
              </CustomAvatar>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant='body2' sx={{ mb: 0.5, fontWeight: 600, color: 'text.primary' }}>
                  IOS Application
                </Typography>
                <Typography variant='caption'>Total {data?.iphoneDevices}</Typography>
              </Box>
            </Box>
            <Box sx={{ mb: 6, display: 'flex', alignItems: 'center' }}>
              <CustomAvatar skin='light' color='success' variant='rounded' sx={{ mr: 3, width: 45, height: 45 }}>
                <Icon fontSize={30} icon='material-symbols:settings-cell-outline' />
              </CustomAvatar>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant='body2' sx={{ mb: 0.5, fontWeight: 600, color: 'text.primary' }}>
                  Android Application
                </Typography>
                <Typography variant='caption'>Total {data?.androidDevices}</Typography>
              </Box>
            </Box>
            <Box sx={{ mb: 6, display: 'flex', alignItems: 'center' }}>
              <CustomAvatar skin='light' color='secondary' variant='rounded' sx={{ mr: 3, width: 45, height: 45 }}>
                <Icon icon='material-symbols:mobile-off-sharp' />
              </CustomAvatar>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant='body2' sx={{ mb: 0.5, fontWeight: 600, color: 'text.primary' }}>
                  Not Installed
                </Typography>
                <Typography variant='caption'>Total {data?.emptydevice}</Typography>
              </Box>
            </Box>
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  )
}

export default CrmProjectTimeline
