import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

const getAllPlans = async value => {
  try {
    // get all schools
    const endpoint = BASE_URL + `plans?lang=${value}`

    const response = await axios.get(endpoint)
    return response.data
  } catch (e) {
    console.log(e)
  }
}
const updatePlan = async data => {
  try {
    // get all schools
    const endpoint = BASE_URL + `plans/update`

    const response = await axios.patch(endpoint, data)
    return response.data
  } catch (e) {
    console.log(e)
  }
}
export { getAllPlans, updatePlan }
