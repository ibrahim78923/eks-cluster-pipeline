import axios from "axios"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const CAMPUS_URL = BASE_URL + "campuses/"

const getAll = async () => {
  try {
    // get all schools
    const endpoint = CAMPUS_URL;

    const response = await axios.get(endpoint)
    return response.data;
  } catch (e) {
    console.log (e)
  }
}
const getByClientId = async (clientId) => {
  try {
    // get all schools
    const endpoint = CAMPUS_URL + "client/" + clientId;

    const response = await axios.get(endpoint)
    return response.data;
  } catch (e) {
    console.log (e)
  }
}
const getBySchoolId = async (schoolId) => {
  try {
    // get all schools
    const endpoint = CAMPUS_URL + "school/" + schoolId;

    const response = await axios.get(endpoint)
    return response.data;
  } catch (e) {
    console.log (e)
  }
}
const create = async (name,clientId, schoolId) => {
  try {
    const endpoint = CAMPUS_URL + "create"

    const response = await axios.put(endpoint, { name,clientId, schoolId })
    return response.data;
  } catch (e) {
    console.log(e)
  }
}
const update = async (id, name, schoolId) => {
  try {
    const endpoint = CAMPUS_URL + "update"

    const response = await axios.patch(endpoint, { id, name,clientId, schoolId })
    return response.data;
  } catch (e) {
    console.log(e)
  }
}
const getByID = async (id) => {
  try {
    const endpoint = CAMPUS_URL + id

    const response = await axios.get(endpoint)
    return response.data;
  } catch (e) {
    console.log(e)
  }
}
const remove = async (id) => {
  try {
    const endpoint = CAMPUS_URL + id

    const response = await axios.delete(endpoint)
    return response.data;
  } catch (e) {
    console.log(e)
  }
}

export {
  getAll,
  create,
  update,
  getByID,
  remove,
  getByClientId,
  getBySchoolId
}
