import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
const NOTIFICATION_URL = BASE_URL + 'notifications/'

const getAll = async () => {
  try {
    // get all schools
    const endpoint = NOTIFICATION_URL + '?getCampuses=true'

    const response = await axios.get(endpoint)
    return response.data
  } catch (e) {
    console.log(e)
  }
}

const getAllWithGrades = async () => {
  try {
    // get all schools
    const endpoint = NOTIFICATION_URL

    const response = await axios.get(endpoint)
    return response.data
  } catch (e) {
    console.log(e)
  }
}

const getByClientId = async clientId => {
  try {
    // get all schools
    const endpoint = NOTIFICATION_URL + 'client/' + clientId

    const response = await axios.get(endpoint)
    return response.data
  } catch (e) {
    console.log(e)
  }
}

const getByClientIdWithGrades = async clientId => {
  try {
    // get all schools
    const endpoint = NOTIFICATION_URL + 'client/' + clientId + '?getGrades=true'

    const response = await axios.get(endpoint)
    return response.data
  } catch (e) {
    console.log(e)
  }
}

const getByClientIdWithTeachers = async clientId => {
  try {
    // get all schools
    const endpoint = NOTIFICATION_URL + 'client/' + clientId + '?getTeachers=true'

    const response = await axios.get(endpoint)
    return response.data
  } catch (e) {
    console.log(e)
  }
}

const create = async (title, message, profileUrl,sendTo, clientId) => {
  try {
    const formData = new FormData()
    formData.append('title', title)
    formData.append('message', message)
    formData.append('imageUrl', profileUrl)
    formData.append('sendTo', sendTo)
    formData.append('clientId', clientId)

    const endpoint = NOTIFICATION_URL + 'bulkCreate'

    const response = await axios.post(endpoint, formData)
    return response.data
  } catch (e) {
    console.log(e)
  }
}

const update = async (id, name, address, lat, long, profileUrl, radius,clientId) => {
  try {
    const endpoint = NOTIFICATION_URL + 'update'

    const response = await axios.patch(endpoint, { id, name, address, lat, long, radius })
    return response.data
  } catch (e) {
    console.log(e)
  }
}

const updateSchoolProfile = async (id, pfp) => {
  try {
    const endpoint = NOTIFICATION_URL + 'upload-pfp'
    const formData = new FormData()
    formData.append('id', id)
    formData.append('pfp', pfp)

    const response = await axios.post(endpoint, formData)
    return response.data
  } catch (e) {
    console.log(e)
  }
}

const getByID = async id => {
  try {
    const endpoint = NOTIFICATION_URL + id

    const response = await axios.get(endpoint)
    return response.data
  } catch (e) {
    console.log(e)
  }
}

const remove = async id => {
  try {
    const endpoint = NOTIFICATION_URL + id

    const response = await axios.delete(endpoint)
    return response.data
  } catch (e) {
    console.log(e)
  }
}

export { getAll, getByClientId, getByClientIdWithGrades, getByClientIdWithTeachers, create, update, getByID, remove, updateSchoolProfile }
