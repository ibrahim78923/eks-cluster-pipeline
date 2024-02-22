import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
const DASHBOARD_URL = BASE_URL + 'dashboard/'

const getClientDashboardData = async (id,startDate,endDate) => {
  try {
    // get all dashboard
    const endpoint = DASHBOARD_URL + 'client/' + id + `?dateFrom=${endDate}&dateTo=${startDate}`
    const response = await axios.get(endpoint)
    return response.data
  } catch (e) {
    console.log(e)
  }
}



export { getClientDashboardData }
