import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
const SCHOOL_URL = BASE_URL + 'schools/'

const getAll = async () => {
  try {
    // get all schools
    const endpoint = SCHOOL_URL + '?getCampuses=true'

    const response = await axios.get(endpoint)
    return response.data
  } catch (e) {
    console.log(e)
  }
}

const getAllWithGrades = async () => {
  try {
    // get all schools
    const endpoint = SCHOOL_URL

    const response = await axios.get(endpoint)
    return response.data
  } catch (e) {
    console.log(e)
  }
}

const getByClientId = async clientId => {
  try {
    // get all schools
    const endpoint = SCHOOL_URL + 'web/client/' + clientId

    const response = await axios.get(endpoint)
    return response.data
  } catch (e) {
    console.log(e)
  }
}

const getByClientIdWithGrades = async clientId => {
  try {
    // get all schools
    const endpoint = SCHOOL_URL + 'client/' + clientId + '?getGrades=true'

    const response = await axios.get(endpoint)
    return response.data
  } catch (e) {
    console.log(e)
  }
}

const getByClientIdWithTeachers = async clientId => {
  try {
    // get all schools
    const endpoint = SCHOOL_URL + 'web/client/' + clientId + '?getTeachers=true'

    const response = await axios.get(endpoint)
    return response.data
  } catch (e) {
    console.log(e)
  }
}

const create = async (name, address, lat, long, radius, profileUrl, clientId) => {
  try {
    const formData = new FormData()
    formData.append('name', name)
    formData.append('address', address)
    formData.append('lat', lat)
    formData.append('long', long)
    formData.append('radius', radius)
    formData.append('profileUrl', profileUrl)
    formData.append('clientId', clientId)

    const endpoint = SCHOOL_URL + 'create'

    const response = await axios.post(endpoint, formData)
    return response.data
  } catch (e) {
    console.log(e)
  }
}

const update = async (id, name, address, lat, long, profileUrl, radius, clientId) => {
  try {
    const endpoint = SCHOOL_URL + 'update'

    const response = await axios.patch(endpoint, { id, name, address, lat, long, radius })
    return response.data
  } catch (e) {
    console.log(e)
  }
}

const updateSchoolProfile = async (id, pfp) => {
  try {
    const endpoint = SCHOOL_URL + 'upload-pfp'
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
    const endpoint = SCHOOL_URL + id

    const response = await axios.get(endpoint)
    return response.data
  } catch (e) {
    console.log(e)
  }
}

const remove = async id => {
  try {
    const endpoint = SCHOOL_URL + id

    const response = await axios.delete(endpoint)
    return response.data
  } catch (e) {
    return e
  }
}

export {
  getAll,
  getByClientId,
  getByClientIdWithGrades,
  getByClientIdWithTeachers,
  create,
  update,
  getByID,
  remove,
  updateSchoolProfile
}
