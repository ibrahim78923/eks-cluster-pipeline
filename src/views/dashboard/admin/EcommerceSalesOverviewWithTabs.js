// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Import
import Tab from '@mui/material/Tab'
import Card from '@mui/material/Card'
import TabList from '@mui/lab/TabList'
import Avatar from '@mui/material/Avatar'
import TabContext from '@mui/lab/TabContext'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'

import { Tooltip } from 'antd'

const EcommerceSalesOverviewWithTabs = ({ setselectedClient, data }) => {
  // ** State
  const [value, setValue] = useState({})

  const handleChange = (event, newValue) => {
    setValue(newValue)
    setselectedClient(newValue)
  }
  useEffect(() => {
    setValue({ id: data[0]?.id, name: data[0]?.name })
    setselectedClient({ id: data[0]?.id, name: data[0]?.name })
  }, [data])
  const RenderTabAvatar = ({ data }) => (
    <>
      <Avatar
        variant='rounded'
        // alt={`tabs-${data.category}`}
        // src={`/images/cards/tabs-${data.category}.png`}
        sx={{
          width: 60,
          height: 60,
          // backgroundColor: 'transparent',
          // '& img': { width: data.imgWidth, height: data.imgHeight },
          background: theme => theme.palette.primary.main,
          color: theme => theme.palette.primary.contrastText,
          border: theme =>
            value?.id === data.id ? `3px solid ${theme.palette.secondary.main}` : `2px ${theme.palette.divider}`
        }}
      >
        {data.name ? data.name[0].toUpperCase() : 'S'}
      </Avatar>
      <Tooltip title={data.name}>
        <Typography
          sx={{ color: theme => (value?.id === data.id ? theme.palette.primary.main : theme.palette.secondary.main) }}
          className='long-client-title'
        >
          {data.name}
        </Typography>
      </Tooltip>
    </>
  )

  return (
    <Card>
      <CardHeader title={`Total Client (${data?.length})`} subheader='Choose to see the Stats' />
      <TabContext value={value}>
        <TabList
          variant='scrollable'
          scrollButtons='auto'
          onChange={handleChange}
          aria-label='top referral sources tabs'
          sx={{
            mb: 2.5,
            px: 5,
            '& .MuiTab-root:not(:last-child)': { mr: 4 },
            '& .MuiTabs-indicator': { display: 'none' }
          }}
        >
          {data?.map(item => {
            return (
              <Tab value={{ id: item.id, name: item.name }} sx={{ p: 0 }} label={<RenderTabAvatar data={item} />} />
            )
          })}
        </TabList>
      </TabContext>
    </Card>
  )
}

export default EcommerceSalesOverviewWithTabs
