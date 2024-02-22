// ** MUI Imports
import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Component Import
import CardStatisticsVertical from 'src/@core/components/card-statistics/card-stats-vertical'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Components Imports
import CrmAwardFromAdmin from 'src/views/dashboard/crm/CrmAwardFromAdmin'
import CrmAward from 'src/views/dashboard/crm/CrmAward'
import CrmProjectTimeline from 'src/views/dashboard/crm/CrmProjectTimeline'
import AnalyticsSalesCountry from 'src/views/dashboard/crm/AnalyticsSalesCountry'
import AnalyticsVisitsByDay from 'src/views/dashboard/crm/AnalyticsVisitsByDay'

import { formatYYYYMMDD } from 'src/utiles/utiles'
import { getClientDashboardData } from 'src/services/dashboard.service'
import { useAuth } from 'src/hooks/useAuth'
import { toast } from 'react-hot-toast'
import { Spin } from 'antd'

const CrmDashboard = ({ isFromSuperAdmin, selectedClient }) => {
  const [value, setValue] = useState('Last Week')
  const [dashboardData, setDashboardData] = useState({})
  const [loading, setLoading] = useState(false)

  const auth = useAuth()

  useEffect(() => {
    const fetchDashboardData = async () => {
      const current_date = new Date()
      const past_date = new Date()
      if (value?.includes('Last Week')) {
        past_date.setDate(current_date.getDate() - 6)
      } else if (value?.includes('Yesterday')) {
        past_date.setDate(current_date.getDate() - 1)
        current_date.setDate(current_date.getDate() - 1)
      } else {
        past_date.setDate(current_date.getDate())
      }
      const startDate = formatYYYYMMDD(current_date)
      const endDate = formatYYYYMMDD(past_date)

      setLoading(true)
      const result = await getClientDashboardData(
        selectedClient?.id ? selectedClient.id : auth.user.id,
        startDate,
        endDate
      )
      if (result?.success) {
        setLoading(false)
        setDashboardData(result)
        // toast.success('Data Fetched Successfully')
      } else {
        setLoading(false)
        toast.error('Server Error')
      }
    }
    fetchDashboardData()
  }, [value, selectedClient?.id])

  return (
    <Spin spinning={loading}>
      <ApexChartWrapper>
        <Grid container spacing={6} className='match-height'>
          <Grid item xs={12} md={4}>
            {isFromSuperAdmin ? <CrmAwardFromAdmin name={selectedClient?.name} /> : <CrmAward />}
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <CardStatisticsVertical
              stats={dashboardData?.schools}
              color='primary'
              trendNumber='Assistants'
              title='Total Assistants'
              chipText='Last 4 Month'
              icon={<Icon icon='mdi:account-box-multiple' />}
            />
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <CardStatisticsVertical
              stats={dashboardData?.grades}
              color='success'
              trendNumber='Grades'
              title='Total Grades'
              chipText='Last Six Month'
              icon={<Icon icon='material-symbols:upgrade' />}
            />
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <CardStatisticsVertical
              stats={dashboardData?.teachers}
              color='primary'
              trendNumber='Teachers'
              title='Total Teachers'
              chipText='Last Six Month'
              icon={<Icon icon='mdi:teacher' />}
            />
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <CardStatisticsVertical
              stats={dashboardData?.students}
              color='success'
              trendNumber='Students'
              title='Total Students'
              chipText='Last Six Month'
              icon={<Icon icon='mdi:account-school' />}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CrmProjectTimeline data={dashboardData?.parentsData} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <AnalyticsSalesCountry data={dashboardData?.totalRequest} setValue={setValue} value={value} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <AnalyticsVisitsByDay data={dashboardData?.Weekly_Requests} />
          </Grid>
        </Grid>
      </ApexChartWrapper>
    </Spin>
  )
}

export default CrmDashboard
