// ** Next Imports
import Head from 'next/head'
import { Router } from 'next/router'
import React, { useState, useEffect } from 'react'

// ** Store Imports
import { store } from 'src/store'
import { Provider } from 'react-redux'

// ** Loader Import
import NProgress from 'nprogress'

// ** Emotion Imports
import { CacheProvider } from '@emotion/react'

// ** Config Imports
import 'src/configs/i18n'
import { defaultACLObj } from 'src/configs/acl'
import themeConfig from 'src/configs/themeConfig'
import { Suspense } from 'react'

import { ReactInternetSpeedMeter } from 'react-internet-meter'
// import '@react-internet-speed-meter/dist/index.css'
// ** Fake-DB Import
// import 'src/@fake-db'

// ** Third Party Import
import { Toaster } from 'react-hot-toast'

// ** Component Imports
import UserLayout from 'src/layouts/UserLayout'
import AclGuard from 'src/@core/components/auth/AclGuard'
import ThemeComponent from 'src/@core/theme/ThemeComponent'
import AuthGuard from 'src/@core/components/auth/AuthGuard'
import GuestGuard from 'src/@core/components/auth/GuestGuard'
import WindowWrapper from 'src/@core/components/window-wrapper'

// ** Spinner Import
import Spinner from 'src/@core/components/spinner'
import Alert from '@mui/material/Alert'

// ** Contexts
import { AuthProvider } from 'src/context/AuthContext'
import { SettingsConsumer, SettingsProvider } from 'src/@core/context/settingsContext'

// ** Styled Components
import ReactHotToast from 'src/@core/styles/libs/react-hot-toast'

// ** Utils Imports
import { createEmotionCache } from 'src/@core/utils/create-emotion-cache'

// ** Prismjs Styles
import 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'

// ** React Perfect Scrollbar Style
import 'react-perfect-scrollbar/dist/css/styles.css'
import 'src/iconify-bundle/icons-bundle-react'

// ** React Image Crop
import 'react-image-crop/dist/ReactCrop.css'

// ** Global css styles
import '../../styles/globals.css'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { SlowInternetModal } from 'src/views/notifications'
import { Box } from '@mui/material'
import { useRouter } from 'next/router'

const clientSideEmotionCache = createEmotionCache()

// ** Pace Loader
if (themeConfig.routingLoader) {
  Router.events.on('routeChangeStart', () => {
    NProgress.start()
  })
  Router.events.on('routeChangeError', () => {
    NProgress.done()
  })
  Router.events.on('routeChangeComplete', () => {
    NProgress.done()
  })
}

const Guard = ({ children, authGuard, guestGuard }) => {
  if (guestGuard) {
    return <GuestGuard fallback={<Spinner />}>{children}</GuestGuard>
  } else if (!guestGuard && !authGuard) {
    return <>{children}</>
  } else {
    return <AuthGuard fallback={<Spinner />}>{children}</AuthGuard>
  }
}

// ** Configure JSS & ClassName
const App = props => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props

  // Variables
  const contentHeightFixed = Component.contentHeightFixed ?? false

  const getLayout =
    Component.getLayout ?? (page => <UserLayout contentHeightFixed={contentHeightFixed}>{page}</UserLayout>)
  const setConfig = Component.setConfig ?? undefined
  const authGuard = Component.authGuard ?? true
  const guestGuard = Component.guestGuard ?? false
  const aclAbilities = Component.acl ?? defaultACLObj

  const [wifiSpeed, setwifiSpeed] = useState('Checking ... ')
  const [isOpenInternetModal, setOpenInternetModal] = useState(false)

  const handleCloseInternetModal = () => {
    setOpenInternetModal(false)
  }
  const [userData, setUserDate] = useState()
  const router = useRouter()

  useEffect(() => {
    const data = JSON.parse(window.localStorage.getItem('userData'))
    setUserDate(data)
  }, [router])

  return (
    <Provider store={store}>
      <CacheProvider value={emotionCache}>
        <Head>
          <meta name='viewport' content='initial-scale=1, width=device-width' />
          <title>{`${themeConfig.templateName}`}</title>
          {/* <link rel='shortcut icon' href='' /> */}
        </Head>
        <GoogleOAuthProvider clientId='912485674622-q9hi3an3h71rdd6j7bgs66npaqtf8nit.apps.googleusercontent.com'>
          <AuthProvider>
            <SettingsProvider {...(setConfig ? { pageSettings: setConfig() } : {})}>
              <SettingsConsumer>
                {({ settings }) => {
                  return (
                    <ThemeComponent settings={settings}>
                      <WindowWrapper>
                        <Guard authGuard={authGuard} guestGuard={guestGuard}>
                          <AclGuard aclAbilities={aclAbilities} guestGuard={guestGuard}>
                            {getLayout(
                              <Suspense fallback={<div>loading ...</div>}>
                                {userData && userData?.role !== 'admin' && !userData?.status && (
                                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Alert sx={{ mb: 3, width: '89%' }} variant='filled' severity='error'>
                                      Your account has been suspended...! Please contact to Admin
                                    </Alert>
                                  </Box>
                                )}
                                <Component {...pageProps} />
                                <ReactInternetSpeedMeter
                                  txtSubHeading='Internet is too slow'
                                  outputType='alert'
                                  customClassName={null}
                                  txtMainHeading='Opps...'
                                  pingInterval={10000} // milliseconds
                                  thresholdUnit='megabyte' // "byte" , "kilobyte", "megabyte"
                                  threshold={2}
                                  imageUrl='/images/slow_internet.png'
                                  downloadSize='1781287' //bytes
                                  callbackFunctionOnNetworkDown={speed => console.log('low internet')}
                                  callbackFunctionOnNetworkTest={speed => {
                                    setwifiSpeed(speed)
                                    if (speed < 2) {
                                      setOpenInternetModal(true)
                                    } else {
                                      setOpenInternetModal(false)
                                    }
                                  }}
                                />
                                <SlowInternetModal
                                  handleClose={handleCloseInternetModal}
                                  isOpen={isOpenInternetModal}
                                />
                              </Suspense>
                            )}
                          </AclGuard>
                        </Guard>
                      </WindowWrapper>
                      <ReactHotToast>
                        <Toaster position={settings.toastPosition} toastOptions={{ className: 'react-hot-toast' }} />
                      </ReactHotToast>
                    </ThemeComponent>
                  )
                }}
              </SettingsConsumer>
            </SettingsProvider>
          </AuthProvider>
        </GoogleOAuthProvider>
      </CacheProvider>
    </Provider>
  )
}

export default App
