import { Grid, Box, Typography, Card } from '@mui/material'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { useAuth } from 'src/hooks/useAuth'
import { getByClientId } from 'src/services/school.service'
import NProgress from 'nprogress'
import { Table } from 'antd'

import { toast } from 'react-hot-toast'
import getColumns from './columns'
import FilterForm from './filterForm'
import { getsinglestudentrequest } from 'src/services/request.service'

import { useSettings } from 'src/@core/hooks/useSettings'

import { ExportToExcel } from 'src/utiles/utiles'

const SingleStudent = () => {
  const [singlestudent, setSingleStudent] = useState([])
  const { settings, saveSettings } = useSettings()
  const [pagination, setPagination] = useState({
    pageSize: 10, // Initial page size
    current: 1 // Initial current page
  })

  const [isLoading, setLoading] = useState(true)
  const startLoading = () => {
    // NProgress.start()
    setLoading(true)
  }

  const endLoading = () => {
    // NProgress.done()
    setLoading(false)
  }

  const [schools, setSchools] = useState([])

  const auth = useAuth()

  useEffect(() => {
    fetchSchools()
  }, [])

  const fetchSchools = async () => {
    startLoading()
    const data = await getByClientId(auth.user.id)
    if (data?.success) {
      endLoading()
      setSchools(data?.schools)
    }
    endLoading()
  }

  const handleSend = async (studentId, dateFrom, dateTo) => {
    startLoading()
    const response = await getsinglestudentrequest(studentId, dateFrom, dateTo)
    if (response?.success === true) {
      setSingleStudent(response.requests)
      endLoading()
    } else {
      toast.error(response?.message)
      endLoading()
    }
  }

  const columns = getColumns({ pagination })

  return (
    <Grid container spacing={5}>
      <Grid item xs={12}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%'
          }}
        >
          <Typography variant='h5'>REPORTS</Typography>

          <Box sx={{ display: 'flex', gap: '20px', flexDirection: 'row-reverse', justifyContent: 'flex-end' }}>
            <ExportToExcel data={singlestudent || []} />
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
            // width: '100%'
          }}
        >
          <Box sx={{ width: 1220 }}>
            <Card style={{ marginBottom: 10, padding: 10 }}>
              <FilterForm
                setSingleStudent={setSingleStudent}
                schools={schools}
                handleSend={handleSend}
                settings={settings}
              />
            </Card>
            <Card style={{ minHeight: 750, padding: 10 }}>
              <Table
                className={
                  settings?.mode.includes('dark')
                    ? 'dark custom-table ant-pagination-total-text student-Table'
                    : 'light student-Table-light'
                }
                columns={columns}
                loading={isLoading}
                dataSource={singlestudent || []}
                pagination={
                  singlestudent?.length > 10
                    ? {
                        defaultCurrent: 1,
                        total: singlestudent?.length,
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
            </Card>
          </Box>
        </Box>
      </Grid>
    </Grid>
  )
}

export default SingleStudent
