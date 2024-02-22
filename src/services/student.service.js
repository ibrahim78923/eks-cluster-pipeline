import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
const STUDENT_URL = BASE_URL + 'students/'

const getAll = async () => {
  try {
    // get all Teachers
    const endpoint = STUDENT_URL

    const response = await axios.get(endpoint)
    return response.data
  } catch (e) {
    console.log(e)
  }
}

const getByClientId = async clientId => {
  try {
    // get all Teachers
    const endpoint = STUDENT_URL + 'client/' + clientId

    const response = await axios.get(endpoint)
    return response.data
  } catch (e) {
    console.log(e)
  }
}
const getByGradeId = async gradeId => {
  try {
    // get all Teachers
    const endpoint = STUDENT_URL + 'grade/' + gradeId

    const response = await axios.get(endpoint)
    return response.data
  } catch (e) {
    console.log(e)
  }
}

const postBulkEmail = async data => {
  try {
    const endpoint = STUDENT_URL + 'bulkSendEmail'
    const response = await axios.post(endpoint, data)
    return response.data
  } catch (e) {
    console.log(e)
  }
}

const create = async (
  role,
  name,
  nameAr,
  gender,
  email,
  motherEmail,
  phoneNo,
  clientId,
  schoolId,
  gradeId,
  password
) => {
  try {
    const endpoint = STUDENT_URL + 'create'

    const response = await axios.put(endpoint, {
      role,
      name,
      nameAr,
      gender,
      email,
      motherEmail,
      phoneNo,
      clientId,
      schoolId,
      gradeId,
      password
    })
    return response.data
  } catch (e) {
    console.log(e)
  }
}
const importStudent = async data => {
  try {
    const endpoint = STUDENT_URL + 'import'

    const response = await axios.put(endpoint, data)
    return response.data
  } catch (e) {
    console.log(e)
  }
}
const createSibling = async (
  name,
  nameAr,
  gender,
  email,
  motherEmail,
  phoneNo,
  clientId,
  schoolId,
  gradeId,
  password
) => {
  try {
    const endpoint = STUDENT_URL + 'add-Sibling'

    const response = await axios.post(endpoint, {
      name,
      nameAr,
      gender,
      email,
      motherEmail,
      phoneNo,
      clientId,
      schoolId,
      gradeId,
      password
    })
    return response.data
  } catch (e) {
    console.log(e)
  }
}

const update = async (
  id,
  name,
  nameAr,
  gender,
  email,
  motherEmail,
  phoneNo,
  clientId,
  schoolId,
  gradeId,
  parentId,
  password,
  isSibling
) => {
  try {
    const endpoint = STUDENT_URL + 'update'
    console.log(id, 'updateupdate')
    const response = await axios.patch(endpoint, {
      id,
      name,
      nameAr,
      gender,
      email,
      motherEmail,
      phoneNo,
      clientId,
      schoolId,
      gradeId,
      parentId,
      password,
      isSibling
    })
    return response.data
  } catch (e) {
    console.log(e)
  }
}
const updateParent = async (id, password, role) => {
  try {
    const endpoint =
      role === 'CLIENT'
        ? BASE_URL + 'clients/update-password'
        : BASE_URL + `${role === 'TEACHER' ? 'teachers' : 'parents'}/update`
    const response = await axios.patch(endpoint, { id, password })
    return response.data
  } catch (e) {
    console.log(e)
  }
}
const checkForgotPassword = async (id, role) => {
  try {
    const endpoint =
      BASE_URL + `${role === 'TEACHER' ? 'teachers' : role === 'CLIENT' ? 'clients' : 'parents'}/forgot-password-check`
    const response = await axios.post(endpoint, { id })
    return response.data
  } catch (e) {
    console.log(e)
  }
}
const updateUser = async (data, role) => {
  try {
    const endpoint = BASE_URL + `${role === 'TEACHER' ? 'teachers' : role === 'CLIENT' ? 'clients' : 'parents'}/update`
    const response = await axios.patch(endpoint, data)
    return response.data
  } catch (e) {
    console.log(e)
  }
}
const getByID = async id => {
  try {
    const endpoint = STUDENT_URL + id

    const response = await axios.get(endpoint)
    return response.data
  } catch (e) {
    console.log(e)
  }
}

const remove = async id => {
  try {
    const endpoint = STUDENT_URL + id

    const response = await axios.delete(endpoint)
    return response.data
  } catch (e) {
    console.log(e)
  }
}
const sendStundetCredentials = async id => {
  try {
    const endpoint = STUDENT_URL + 'sendEmail/' + id

    const response = await axios.get(endpoint)
    return response.data
  } catch (e) {
    console.log(e)
  }
}
export {
  getAll,
  getByClientId,
  getByGradeId,
  create,
  createSibling,
  update,
  getByID,
  sendStundetCredentials,
  remove,
  postBulkEmail,
  updateParent,
  importStudent,
  checkForgotPassword,
  updateUser
}
