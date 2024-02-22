// ** MUI Imports
import { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid'
// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import { getAll } from 'src/services/client.service'

// ** Demo Components Imports
import CrmAward from 'src/views/dashboard/crm/CrmAward'
import EcommerceSalesOverviewWithTabs from 'src/views/dashboard/admin//EcommerceSalesOverviewWithTabs'
import EcommerceSalesOverview from 'src/views/dashboard/admin/EcommerceSalesOverview'

import MainDashBoard from '../dashboard'

import { Spin } from 'antd'

const CrmDashboard = () => {
  const [clients, setClients] = useState([])
  const [selectedClient, setselectedClient] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fn = async () => {
      setLoading(true)
      const data = await getAll()

      if (data?.success) {
        setLoading(false)
        setClients(data.clients?.reverse())
      }
      setLoading(false)
    }

    fn()
  }, [])
  return (
    <ApexChartWrapper>
      <Spin spinning={loading}>
        <Grid container spacing={6} className='match-height'>
          <Grid item xs={12} md={6}>
            <CrmAward />
          </Grid>
          <Grid item xs={12} md={6}>
            <EcommerceSalesOverview />
          </Grid>

          <Grid item xs={12}>
            <EcommerceSalesOverviewWithTabs setselectedClient={setselectedClient} data={clients} />
          </Grid>
          <Grid item xs={12}>
            <MainDashBoard selectedClient={selectedClient} isFromSuperAdmin={true} />
          </Grid>
        </Grid>
      </Spin>
    </ApexChartWrapper>
  )
}

export default CrmDashboard
