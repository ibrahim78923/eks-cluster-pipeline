import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
const GUARD_URL = BASE_URL + 'parents/'


const getByClientId = async clientId => {
  try {
    // get all schools
    const endpoint = GUARD_URL + 'client/' + clientId+'?role=guard'

    const response = await axios.get(endpoint)
    return response.data
  } catch (e) {
    console.log(e)
  }
}

const create = async (data) => {
  try {
    const endpoint = GUARD_URL + 'create'

    const response = await axios.put(endpoint, data)
    return response.data
  } catch (e) {
    console.log(e)
  }
}
const update = async (data) => {
  try {
    const endpoint = GUARD_URL + 'update'

    const response = await axios.patch(endpoint, data)
    return response.data
  } catch (e) {
    console.log(e)
  }
}
const getByID = async id => {
  try {
    const endpoint = GUARD_URL  + id

    const response = await axios.get(endpoint)
    return response.data
  } catch (e) {
    console.log(e)
  }
}

const remove = async id => {
  try {
    const endpoint = GUARD_URL + id

    const response = await axios.delete(endpoint)
    return response.data
  } catch (e) {
    console.log(e)
  }
}



export {  getByClientId,  create, update, getByID, remove}