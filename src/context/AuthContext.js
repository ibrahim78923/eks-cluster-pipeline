// ** React Imports
import { createContext, useEffect, useState } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'
import { toast } from 'react-hot-toast'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

// ** Defaults
const defaultProvider = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
  googleLogin: () => Promise.resolve(),
}
const AuthContext = createContext(defaultProvider)

const AuthProvider = ({ children }) => {
  // ** States
  const [user, setUser] = useState(defaultProvider.user)
  const [loading, setLoading] = useState(defaultProvider.loading)

  // ** Hooks
  const router = useRouter()
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
      const storedUser = JSON.parse(window.localStorage.getItem('userData'))

      if (storedToken) {
        setLoading(false)
        setUser({ ...storedUser })
      } else {
        setLoading(false)
      }
    }
    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = (params, cb) => {
    let roleName
    let loginURL = BASE_URL
    let aliasTokenUrl = BASE_URL+'teachers/aliasToken/'
    let role = null

    let roleRedirectURL = null

    if (params.role) {
      const authRole = authConfig.roles.find(r => r.name === params.role)
      roleRedirectURL = authRole.homepage

      if (authRole) {
        loginURL += authRole.loginEndpoint
        role = authRole.name
        delete params.role
        roleName = authRole.name.toUpperCase()
        // console.log(roleName)
      }
    } else {
      const authRole = authConfig?.admin
      roleRedirectURL = authRole.homepage

      if (authRole) {
        loginURL += authRole.loginEndpoint
        role = authRole.name
        delete params.role
        roleName = authRole.name.toUpperCase()
        // console.log(roleName)
      }
    }
    if(params?.isSuperAdmin && params.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL){
      window.localStorage.setItem('isFromSuperAdmin', JSON.stringify({isFromSuperAdmin:true}))
    }

    return axios
      .post(loginURL, params)
      .then(response => {
        if (response.data.success === false) {
          cb({ message: response.data.message })
          return
        }
        // alias token
        const base64Url = response.data.token.split('.')[1];
        const base64 = base64Url.replace('-', '+').replace('_', '/');
        const jwtToken =JSON.parse(window.atob(base64));
        aliasTokenUrl =aliasTokenUrl+jwtToken.id
        if (jwtToken.role=='TEACHER'){
           axios
            .get(aliasTokenUrl, params)
            .then(res => {
              if (res.data.success === false) {
                cb({ message: res.data.message })
                return
              }
              window.localStorage.setItem(authConfig.storageAliasTokenKeyName, res.data.aliasToken)
            })
            .catch(err => {
              cb({ message: err.response.data.message })
            })
        }
        //
        window.localStorage.setItem(authConfig.storageTokenKeyName, response.data.token)

        const user = { ...response.data.data, role }

        const returnUrl = router.query.returnUrl
        setUser(user)

        window.localStorage.setItem('userData', JSON.stringify(user))
        const redirectURL = roleRedirectURL
        cb({ success: true })
        router.replace(redirectURL)
        console.log(redirectURL)
      })
      .catch(err => {
        cb({ message: err?.response?.data?.message })
      })
  }

  const handleGoogleLogin = (params, cb) => {
    console.log(params,"params")
    let roleName
    let loginURL = BASE_URL+`teachers/auth/google/verifyGoogleToken?tokens=${params.credential}&role=${params.role}`
    let aliasTokenUrl = BASE_URL+'teachers/aliasToken/'
    let role = null

    let roleRedirectURL = null

    if (params.role) {
      const authRole = authConfig.roles.find(r => r.name === params.role)
      roleRedirectURL = authRole.homepage

      if (authRole) {
        loginURL += authRole.loginEndpoint
        role = authRole.name
        delete params.role
        roleName = authRole.name.toUpperCase()
        // console.log(roleName)
      }
    }

    return axios
      .get(loginURL)
      .then(response => {
        if (response.data.success === false) {
          cb({ message: response.data.message })
          return
        }
        // alias token
        const base64Url = response.data.token.split('.')[1];
        const base64 = base64Url.replace('-', '+').replace('_', '/');
        const jwtToken =JSON.parse(window.atob(base64));
        aliasTokenUrl =aliasTokenUrl+jwtToken.id
        if (jwtToken.role=='TEACHER'){
           axios
            .get(aliasTokenUrl, params)
            .then(res => {
              if (res.data.success === false) {
                cb({ message: res.data.message })
                return
              }
              window.localStorage.setItem(authConfig.storageAliasTokenKeyName, res.data.aliasToken)
            })
            .catch(err => {
              cb({ message: err.response.data.message })
            })
        }
        
        window.localStorage.setItem(authConfig.storageTokenKeyName, response.data.token)

        const user = { ...response.data.data, role }

        const returnUrl = router.query.returnUrl
        setUser(user)

        window.localStorage.setItem('userData', JSON.stringify(user))
        const redirectURL = roleRedirectURL
        cb({ success: true })
        router.replace(redirectURL)
        console.log(redirectURL)
      })
      .catch(err => {
        cb({ message: err.response.data.message })
      })
  }


  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem('isFromSuperAdmin')
    window.localStorage.removeItem('selectedGrades')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    router.push('/login')
  }

  const handleRegister = (params, errorCallback) => {
    axios
      .post(authConfig.registerEndpoint, params)
      .then(res => {
        if (res.data.error) {
          if (errorCallback) errorCallback(res.data.error)
        } else {
          handleLogin({ email: params.email, password: params.password })
        }
      })
      .catch(err => (errorCallback ? errorCallback(err) : null))
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister,
    googleLogin: handleGoogleLogin
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
