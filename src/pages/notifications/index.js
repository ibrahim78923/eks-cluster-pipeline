import { Grid, Button, Box, Typography, Card, TextField, Divider } from '@mui/material'
import { useEffect, useState } from 'react'
import { Table } from 'antd'

import getColumns from './columns'
import { useAuth } from 'src/hooks/useAuth'
import { useSettings } from 'src/@core/hooks/useSettings'
import { AddNotificationModal } from 'src/views/notifications'
import { getByClientId } from 'src/services/notification.service'

const Notifications = () => {
  const [schools, setSchools] = useState([])
  const [isAddModalVisible, setAddModalVisible] = useState(false)

  const [isLoading, setLoading] = useState(true)
  const { settings, saveSettings } = useSettings()
  const [searchTitle, setSearchTitle] = useState('')
  const [pagination, setPagination] = useState({
    pageSize: 10, // Initial page size
    current: 1 // Initial current page
  })

  const startLoading = () => {
    setLoading(true)
  }

  const endLoading = () => {
    setLoading(false)
  }

  // Auth to get the logged in user id
  const auth = useAuth()

  const fetchSchools = async () => {
    startLoading()
    const data = await getByClientId(auth.user.id)
    1000000

    if (data?.success) {
      setSchools(data?.notifications)
    }
    endLoading()
  }

  // get the school data when the page loads
  useEffect(() => {
    fetchSchools()
  }, [])

  const openAddModal = () => setAddModalVisible(true)
  const closeAddModal = () => setAddModalVisible(false)

  const columns = getColumns({ pagination })

  return (
    <Grid container spacing={5}>
      {isAddModalVisible && (
        <AddNotificationModal onSubmit={fetchSchools} isOpen={isAddModalVisible} handleClose={closeAddModal} />
      )}
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          <Card style={{ minHeight: 500, width: 1000, padding: 20, margin: 10 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant='h5'>Notifications</Typography>
              <Button variant='contained' color='primary' onClick={openAddModal}>
                Send Notifications
              </Button>
            </Box>
            <Divider />
            <Box style={{ textAlign: 'right', marginBottom: '20px' }}>
              <TextField label='Search' variant='outlined' onChange={e => setSearchTitle(e.target.value)} />
            </Box>
            <Table
              className={
                settings?.mode.includes('dark')
                  ? 'dark custom-table ant-pagination-total-text student-Table fix_left_dark fix_right_dark'
                  : 'light student-Table-light'
              }
              dataSource={schools.filter(value => {
                if (searchTitle === '') {
                  return value
                } else if (
                  value?.message?.toLowerCase()?.includes(searchTitle?.toLowerCase()) ||
                  value?.title?.toLowerCase()?.includes(searchTitle?.toLowerCase())
                ) {
                  return value
                }
              })}
              columns={columns}
              size='small'
              loading={isLoading}
              pagination={{
                defaultCurrent: 1,
                total: schools?.length,
                defaultPageSize: 10,
                showSizeChanger: true,
                showTotal: (total, range) => `Total: ${total}`,
                pageSizeOptions: ['10', '20', '50', '100'],
                locale: { items_per_page: '' }
              }}
              onChange={pagination => setPagination(pagination)}
              scroll={{
                x: true
              }}
            />
          </Card>
        </Box>
      </Grid>
    </Grid>
  )
}

export default Notifications
