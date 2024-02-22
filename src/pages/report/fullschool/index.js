import { Grid, Box, Typography, Card } from '@mui/material'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { useAuth } from 'src/hooks/useAuth'
import { getByClientId } from 'src/services/school.service'
import { Table } from 'antd'
import { toast } from 'react-hot-toast'
import getColumns from './columns'
import FilterForm from './filterForm'
import { getfullschoolrequest } from 'src/services/request.service'
import { useSettings } from 'src/@core/hooks/useSettings'
import { ExportToExcel } from 'src/utiles/utiles';

const FullSchool = () => {
  const [fullschool, setFullSchool] = useState([])
  const { settings, saveSettings } = useSettings()

  const [tableLoading, setTableLoading] = useState(false)
  const [pagination, setPagination] = useState({
    pageSize: 10, // Initial page size
    current: 1 // Initial current page
  })

  const [schools, setSchools] = useState()

  const auth = useAuth()

  useEffect(() => {
    fetchSchools()
  }, [])

  const fetchSchools = async () => {
    setTableLoading(true)
    const data = await getByClientId(auth.user.id)
    if (data?.success) {
      setSchools(data?.schools)
      setTableLoading(false)
    }
    setTableLoading(false)
  }

  const handleSend = async (schoolId, dateFrom, dateTo) => {
    setTableLoading(true)
    const response = await getfullschoolrequest(schoolId, dateFrom, dateTo)
    if (response?.success === true) {
      setTableLoading(false)
      setFullSchool(response.requests)
      toast.success('Fetched Successfully')
    } else {
      setTableLoading(false)
      toast.error('Server Error')
    }
  }

  const columns = getColumns({ pagination })
  return (
    <>
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

            <Box sx={{ display: 'flex', gap: '20px', flexDirection: 'row-reverse', justifyContent: 'flex-end' }}></Box>
            <ExportToExcel data={fullschool || []}/>
          </Box>
        </Grid>
        <br />
        <>
          <Grid item xs={12}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
                width: '100%'
              }}
            >
              <Box>
                  <Card style={{marginBottom: 10, padding: 10}}>
                  <FilterForm setFullSchool={setFullSchool} schools={schools} handleSend={handleSend} settings={settings} />
                </Card>
                <Card style={{ minHeight: 750, padding: 10 }}>
                  <Box style={{ textAlign: 'right', marginBottom: '20px' }}>
                    <Box sx={{ minWidth: 1220 }}>
                      <Box
                        component='form'
                        sx={{
                          '& > :not(style)': { mb: 1, width: '40ch' }
                        }}
                        noValidate
                        autoComplete='off'
                        justifyContent='fl'
                      ></Box>
                    </Box>
                  </Box>
                  <Table
                    className={
                      settings?.mode.includes('dark')
                        ? 'dark custom-table ant-pagination-total-text student-Table'
                        : 'light student-Table-light'
                    }
                    columns={columns}
                    loading={tableLoading}
                    dataSource={fullschool || []}
                    pagination={
                      fullschool?.length > 10
                        ? {
                            defaultCurrent: 1,
                            total: fullschool?.length,
                            defaultPageSize: 10,
                            showSizeChanger: true,
                            showTotal: (total, range) => `Total: ${total}`,
                            pageSizeOptions: ['10', '20', '50', '100'],
                            locale: { items_per_page: '' }
                          }
                        : false
                    }
                    onChange={pagination => setPagination(pagination)}
                  />
                </Card>
              </Box>
            </Box>
          </Grid>
        </>
      </Grid>
    </>
  )
}

export default FullSchool
