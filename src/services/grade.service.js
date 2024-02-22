import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
const GRADE_URL = BASE_URL + 'grades/'
const TEACHER_URL = BASE_URL + 'teachers/'
const REQUESTS_URL = BASE_URL + 'requests/'

const getAll = async () => {
  try {
    // get all schools
    const endpoint = GRADE_URL

    const response = await axios.get(endpoint)
    return response.data
  } catch (e) {
    console.log(e)
  }
}
const getAllRequests = async (clientId) => {
  try {
    // get all schools
    const endpoint = REQUESTS_URL + 'client/' + clientId

    const response = await axios.get(endpoint)
    return response.data
  } catch (e) {
    console.log(e)
  }
}

const getBySchoolId = async schoolId => {
  try {
    // get all schools
    const endpoint = GRADE_URL + 'web/school/' + schoolId

    const response = await axios.get(endpoint)
    return response.data
  } catch (e) {
    console.log(e)
  }
}

const getByClientId = async clientId => {
  try {
    // get all schools
    const endpoint = GRADE_URL + 'web/client/' + clientId

    const response = await axios.get(endpoint)
    return response.data
  } catch (e) {
    console.log(e)
  }
}

const create = async (data) => {
  try {
    const endpoint = GRADE_URL + 'create'

    const response = await axios.put(endpoint, data)
    return response.data
  } catch (e) {
    console.log(e)
  }
}
const update = async (data) => {
  try {
    const endpoint = GRADE_URL + 'update'

    const response = await axios.patch(endpoint, data)
    return response.data
  } catch (e) {
    console.log(e)
  }
}
// const update = async (id, name, startTime, offTime) => {
//   try {
//     const endpoint = GRADE_URL + 'update'

//     const response = await axios.patch(endpoint, { id, name, startTime, offTime })
//     return response.data
//   } catch (e) {
//     console.log(e)
//   }
// }

const getByID = async id => {
  try {
    const endpoint = GRADE_URL + "web/" + id

    const response = await axios.get(endpoint)
    return response.data
  } catch (e) {
    console.log(e)
  }
}
const getAllByClientId = async clientId => {
  try {
    // get all schools
    const endpoint = GRADE_URL + 'client/' + clientId

    const response = await axios.get(endpoint)
    return response.data
  } catch (e) {
    console.log(e)
  }
}
const remove = async id => {
  try {
    const endpoint = GRADE_URL + id

    const response = await axios.delete(endpoint)
    return response.data
  } catch (e) {
    console.log(e)
  }
}

const getClientId = async teacherId => {
  try {
    const endpoint = TEACHER_URL + teacherId
    const response = await axios.get(endpoint)
    return response.data
  } catch (e) {
    console.log(e)
  }
}
const getPromoteGrades = async (selectedGradeFrom,selectedSchoolPromoteFrom, selected, selectedSchoolPromoteTo, selectStudents) => {
  try {
    const endpoint = BASE_URL + `students/promoteStudent/${selectedGradeFrom}?schoolId=${selectedSchoolPromoteFrom}&promotedGradeId=${selected}&promotedSchoolId=${selectedSchoolPromoteTo}&students=[${selectStudents}]`
    const response = await axios.get(endpoint)
    return response.data
  } catch (e) {
    console.log(e)
  }
}

export { getAll, getByClientId, getBySchoolId, create, update, getByID, remove, getClientId,getAllByClientId, getAllRequests, getPromoteGrades }
