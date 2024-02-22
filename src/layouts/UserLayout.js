import useMediaQuery from '@mui/material/useMediaQuery'
import { useEffect } from 'react'
// ** Layout Imports
// !Do not remove this Layout import
import Layout from 'src/@core/layouts/Layout'
import { useRouter } from 'next/router'
// ** Navigation Imports
import VerticalNavItems from 'src/navigation/vertical'
import HorizontalNavItems from 'src/navigation/horizontal'

// ** Component Import
// Uncomment the below line (according to the layout type) when using server-side menu
// import ServerSideVerticalNavItems from './components/vertical/ServerSideNavItems'
// import ServerSideHorizontalNavItems from './components/horizontal/ServerSideNavItems'

import VerticalAppBarContent from './components/vertical/AppBarContent'
import HorizontalAppBarContent from './components/horizontal/AppBarContent'

// ** Hook Import
import { useSettings } from 'src/@core/hooks/useSettings'
import { useAuth } from 'src/hooks/useAuth'
import { useSelector, useDispatch } from 'react-redux'
import { Box } from '@mui/material'
import { fullscreen } from 'src/store/fullscreen'
import { Button } from '@mui/material'
import { BiFullscreen } from 'react-icons/bi'
import { BiExitFullscreen } from 'react-icons/bi'

const UserLayout = ({ children, contentHeightFixed }) => {
  // ** Hooks
  const { settings, saveSettings } = useSettings()
  const auth = useAuth()
  const hide = useSelector(state => state.fullscreen.value.hidden)
  const router = useRouter()
  const dispatch = useDispatch()

  // ** Vars for server side navigation
  // const { menuItems: verticalMenuItems } = ServerSideVerticalNavItems()
  // const { menuItems: horizontalMenuItems } = ServerSideHorizontalNavItems()
  /**
   *  The below variable will hide the current layout menu at given screen size.
   *  The menu will be accessible from the Hamburger icon only (Vertical Overlay Menu).
   *  You can change the screen size from which you want to hide the current layout menu.
   *  Please refer useMediaQuery() hook: https://mui.com/material-ui/react-use-media-query/,
   *  to know more about what values can be passed to this hook.
   *  ! Do not change this value unless you know what you are doing. It can break the template.
   */
  const hidden = useMediaQuery(theme => theme.breakpoints.down('lg'))
  if (hidden && settings.layout === 'horizontal') {
    settings.layout = 'vertical'
  }

  return (
    <>
      {!hide ? (
        <Layout
          hidden={hidden}
          settings={settings}
          saveSettings={saveSettings}
          contentHeightFixed={contentHeightFixed}
          verticalLayoutProps={{
            navMenu: {
              navItems: VerticalNavItems(auth.user.role)

              // Uncomment the below line when using server-side menu in vertical layout and comment the above line
              // navItems: verticalMenuItems
            },
            appBar: {
              content: props => (
                <VerticalAppBarContent
                  hidden={hidden}
                  settings={settings}
                  saveSettings={saveSettings}
                  toggleNavVisibility={props.toggleNavVisibility}
                />
              )
            }
          }}
          {...(settings.layout === 'horizontal' && {
            horizontalLayoutProps: {
              navMenu: {
                navItems: HorizontalNavItems(auth.user.role)

                // Uncomment the below line when using server-side menu in horizontal layout and comment the above line
                // navItems: horizontalMenuItems
              },
              appBar: {
                content: () => (
                  <HorizontalAppBarContent hidden={hidden} settings={settings} saveSettings={saveSettings} />
                )
              }
            }
          })}
        >
          {/* {router.pathname.includes('requests') ? (
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginBottom: -8 }}>
              <Button
                variant='contained'
                onClick={() => {
                  dispatch(fullscreen())
                }}
              >
                {hide === false ? <BiFullscreen size={25} /> : <BiExitFullscreen size={25} />}
              </Button>
            </Box>
          ) : null} */}

          {children}
        </Layout>
      ) : (
        <Box sx={{ padding: '20px' }}>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', paddingBottom: '30px' }}>
            <Button
              variant='contained'
              onClick={() => {
                dispatch(fullscreen())
              }}
            >
              {hide === false ? <BiFullscreen size={25} /> : <BiExitFullscreen size={25} />}
            </Button>
          </Box>

          {children}
        </Box>
      )}
    </>
  )
}

export default UserLayout
