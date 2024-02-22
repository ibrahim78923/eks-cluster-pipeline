// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'
import OptionsMenu from 'src/@core/components/option-menu'
import ReactApexcharts from 'src/@core/components/react-apexcharts'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

const AnalyticsVisitsByDay = ({ data }) => {
  // ** Hook
  const theme = useTheme()
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const values =
    data &&
    weekdays.map(day => {
      if (data[day.toLowerCase()]) {
        return data[day.toLowerCase()]
      } else {
        return 0
      }
    })

  const options = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        distributed: true,
        columnWidth: '51%',
        endingShape: 'rounded',
        startingShape: 'rounded'
      }
    },
    legend: { show: false },
    dataLabels: { enabled: true },
    colors: [
      hexToRGBA(theme.palette.success.main, 1),
      hexToRGBA(theme.palette.warning.main, 1),
      hexToRGBA(theme.palette.primary.main, 1),
      hexToRGBA(theme.palette.warning.main, 1),
      hexToRGBA(theme.palette.warning.main, 1),
      hexToRGBA(theme.palette.warning.main, 0.6),
      hexToRGBA(theme.palette.warning.main, 0.6)
    ],
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    xaxis: {
      axisTicks: { show: false },
      axisBorder: { show: false },
      categories: weekdays,
      labels: {
        style: { colors: theme.palette.text.disabled }
      }
    },
    yaxis: { show: false },
    grid: {
      show: false,
      padding: {
        top: -30,
        left: -7,
        right: -4
      }
    }
  }

  let maxCharacter = null
  let maxValue = -Infinity

  for (let char in data) {
    if (data[char] > maxValue) {
      maxValue = data[char]
      maxCharacter = char
    }
  }

  return (
    <Card>
      <CardHeader
        title='Requests Per Day'
        subheaderTypographyProps={{ sx: { lineHeight: 1.429 } }}
        titleTypographyProps={{ sx: { letterSpacing: '0.15px' } }}
      />
      <CardContent sx={{ pt: { xs: `${theme.spacing(6)} !important`, md: `${theme.spacing(0)} !important` } }}>
        <ReactApexcharts type='bar' height={180} options={options} series={[{ data: values }]} />
        <Box sx={{ mt: 5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography sx={{ mb: 0.75, fontWeight: 600 }}>Most Requests Day</Typography>
            {maxCharacter && (
              <Typography variant='body2'>
                Total {maxValue} Visits on {maxCharacter}
              </Typography>
            )}
          </Box>
          {/* <CustomAvatar skin='light' color='warning' variant='rounded'>
            <Icon icon='mdi:chevron-right' />
          </CustomAvatar> */}
        </Box>
      </CardContent>
    </Card>
  )
}

export default AnalyticsVisitsByDay
