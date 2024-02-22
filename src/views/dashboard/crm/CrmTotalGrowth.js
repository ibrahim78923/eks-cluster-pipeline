// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Custom Components Imports
import ReactApexcharts from 'src/@core/components/react-apexcharts'

const CrmTotalGrowth = ({ growthData }) => {
  // ** Hook
  const theme = useTheme()

  const options = {
    legend: { show: false },
    stroke: { width: 5, colors: [theme.palette.background.paper] },
    colors: [theme.palette.primary.main, theme.palette.success.main, theme.palette.secondary.main],
    labels: [`IOS App`, `Android App`, `Not Installed`],
    tooltip: {
      y: { formatter: val => val }
    },
    dataLabels: {
      enabled: false
    },
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            name: { show: false },
            total: {
              label: 'aaaa',
              show: true,
              fontWeight: 600,
              fontSize: '1rem',
              color: theme.palette.text.secondary,
              formatter: val => val.globals.series?.reduce((sum, num) => sum + num, 0)
            },
            value: {
              offsetY: 6,
              fontWeight: 600,
              fontSize: '1rem',
              formatter: val => val,
              color: theme.palette.text.secondary
            }
          }
        }
      }
    }
  }

  return (
    <CardContent>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <Typography variant='h6' sx={{ mr: 1.5 }}>
          {growthData?.parents}
        </Typography>
      </Box>
      <Typography variant='body2'>Total Users</Typography>
      <ReactApexcharts
        type='donut'
        height={230}
        options={options}
        series={[growthData?.iphoneDevices || 0, growthData?.androidDevices || 0, growthData?.emptydevice || 0]}
      />
    </CardContent>
  )
}

export default CrmTotalGrowth
