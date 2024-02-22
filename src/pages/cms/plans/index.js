import { Grid, Button, Box, Typography, Card, Divider } from '@mui/material'
import { useEffect, useState } from 'react'
import { Table } from 'antd'

import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'

import getColumns from './columns'
import { useSettings } from 'src/@core/hooks/useSettings'
import { EditPlan } from 'src/views/cms/plans'
import { getAllPlans } from 'src/services/cms'

const Notifications = () => {
  const [schools, setSchools] = useState([])
  const [plan, setPlan] = useState({})
  const [isAddModalVisible, setAddModalVisible] = useState(false)

  const [isLoading, setLoading] = useState(true)
  const { settings } = useSettings()
  const [pagination, setPagination] = useState({
    pageSize: 10, // Initial page size
    current: 1 // Initial current page
  })
  const [value, setValue] = useState('en')

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const startLoading = () => {
    setLoading(true)
  }

  const endLoading = () => {
    setLoading(false)
  }

  const fetchSchools = async () => {
    startLoading()
    const data = await getAllPlans(value)

    if (data?.success) {
      setSchools(data?.plans)
    }
    endLoading()
  }

  useEffect(() => {
    fetchSchools()
  }, [value])

  const openAddModal = () => setAddModalVisible(true)
  const closeAddModal = () => setAddModalVisible(false)

  const openEditModal = data => {
    setPlan(data)
    setAddModalVisible(true)
  }

  const columns = getColumns({ pagination, openEditModal })

  return (
    <Grid container spacing={5}>
      {isAddModalVisible && (
        <EditPlan plan={plan} onSubmit={fetchSchools} isOpen={isAddModalVisible} handleClose={closeAddModal} />
      )}
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          <Card style={{ minHeight: 500, width: 1000, padding: 20 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant='h5'>Plans</Typography>
            </Box>
            <Divider />
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={handleChange} aria-label='lab API tabs example'>
                  <Tab label='En' value='en' />
                  <Tab label='Ar' value='ar' />
                  <Tab label='Fr' value='fr' />
                </TabList>
              </Box>
              <Table
                className={
                  settings?.mode?.includes('dark')
                    ? 'dark custom-table ant-pagination-total-text student-Table fix_left_dark fix_right_dark'
                    : 'light student-Table-light'
                }
                dataSource={schools}
                style={{ marginTop: 30 }}
                columns={columns}
                size='small'
                loading={isLoading}
                pagination={
                  schools?.length > 10
                    ? {
                        defaultCurrent: 1,
                        total: schools?.length,
                        defaultPageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total, range) => `Total: ${total}`,
                        pageSizeOptions: ['10', '20', '50', '100'],
                        locale: { items_per_page: '' }
                      }
                    : false
                }
                onChange={pagination => setPagination(pagination)}
                scroll={{
                  x: true
                }}
              />
            </TabContext>
          </Card>
        </Box>
      </Grid>
    </Grid>
  )
}

export default Notifications
