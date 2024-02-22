import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
const CLIENT_URL = BASE_URL + 'clients/'

const getAll = async () => {
  try {
    // get all schools
    const endpoint = CLIENT_URL

    const response = await axios.get(endpoint)
    return response.data
  } catch (e) {
    console.log(e)
  }
}

const create = async (
  name,
  email,
  schoolName,
  mobile,
  landline,
  perUserPrice,
  startDate,
  duration,
  expiryDate,
  password,
  planId
) => {
  try {
    const endpoint = CLIENT_URL + 'create'

    const response = await axios.put(endpoint, {
      name,
      email,
      schoolName,
      mobile,
      landline,
      perUserPrice,
      startDate,
      duration,
      expiryDate,
      password,
      planId
    })
    return response.data
  } catch (e) {
    console.log(e)
  }
}
const sendEmail = async (data) => {
  try {
    // get all plans
    const endpoint = BASE_URL + `clients/sendEmail`;

    const response = await axios.post(endpoint, data);
    return response.data;
  } catch (e) {
    console.log(e);
  }
};
const update = async (id, name, email, schoolName, mobile, planId) => {
  try {
    const endpoint = CLIENT_URL + 'update'

    const response = await axios.patch(endpoint, {
      id,
      name,
      email,
      schoolName,
      mobile,
      planId
    })
    return response.data
  } catch (e) {
    console.log(e)
  }
}
const updateClient = async data => {
  try {
    const endpoint = CLIENT_URL + 'update'

    const response = await axios.patch(endpoint, data)
    return response.data
  } catch (e) {
    console.log(e)
  }
}
const updateSelectedGrade = async (id, selectedGrades) => {
  try {
    const endpoint = CLIENT_URL + 'update'

    const response = await axios.patch(endpoint, {
      id,
      selectedGrades
    })
    return response.data
  } catch (e) {
    console.log(e)
  }
}
const forgotPassword = async email => {
  try {
    const endpoint = CLIENT_URL + 'forgotPassword'

    const response = await axios.post(endpoint, {
      email
    })
    return response.data
  } catch (e) {
    console.log(e)
  }
}
const cancelSubscription = async subscriptionId => {
  try {
    const endpoint = CLIENT_URL + 'cancelSubscription'

    const response = await axios.post(endpoint, {
      subscriptionId
    })
    return response.data
  } catch (e) {
    console.log(e)
  }
}
const updateSubscription = async data => {
  try {
    const endpoint = CLIENT_URL + 'updateSubscriptionInvoice'

    const response = await axios.post(endpoint, data)
    return response.data
  } catch (e) {
    console.log(e)
  }
}
const updateSubscriptionConfirm = async data => {
  try {
    const endpoint = CLIENT_URL + 'updateSubscription'

    const response = await axios.post(endpoint, data)
    return response.data
  } catch (e) {
    console.log(e)
  }
}
const getInvoices = async customerId => {
  try {
    const endpoint = CLIENT_URL + 'billing'

    const response = await axios.post(endpoint, {
      customerId
    })
    return response.data
  } catch (e) {
    console.log(e)
  }
}
const updateStatus = async (id, deactivate) => {
  try {
    const endpoint = CLIENT_URL + `update`

    const response = await axios.patch(endpoint, { id, deactivate })
    return response.data
  } catch (e) {
    console.log(e)
  }
}
const updateDisable = async (id, status) => {
  try {
    const endpoint = CLIENT_URL + `update`

    const response = await axios.patch(endpoint, { id, status })
    return response.data
  } catch (e) {
    console.log(e)
  }
}
const updatePassword = async (id, password) => {
  try {
    const endpoint = CLIENT_URL + 'update-password'

    const response = await axios.patch(endpoint, {
      id,
      password
    })
    return response.data
  } catch (e) {
    console.log(e)
  }
}
const getByID = async id => {
  try {
    const endpoint = CLIENT_URL + id

    const response = await axios.get(endpoint)
    return response.data
  } catch (e) {
    console.log(e)
  }
}
const remove = async id => {
  try {
    const endpoint = CLIENT_URL + id

    const response = await axios.delete(endpoint)
    return response.data
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
  updateStatus,
  updatePassword,
  updateSelectedGrade,
  forgotPassword,
  cancelSubscription,
  updateClient,
  getInvoices,
  updateSubscription,
  updateDisable,
  updateSubscriptionConfirm,
  sendEmail
}
