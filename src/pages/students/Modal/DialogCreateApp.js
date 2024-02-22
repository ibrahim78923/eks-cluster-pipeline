// ** React Imports
import { useState, forwardRef } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Card from '@mui/material/Card'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Avatar from '@mui/material/Avatar'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import TabContext from '@mui/lab/TabContext'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Fade from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import GroupIcon from '@mui/icons-material/Group'
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck'
import ReportProblemIcon from '@mui/icons-material/ReportProblem'
// ** Hook Imports
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Tab Content Imports
import DialogTabDetails from './create-app-tabs/DialogTabDetails'
import DialogTabBilling from './create-app-tabs/DialogTabBilling'
import DialogTabDatabase from './create-app-tabs/DialogTabDatabase'
import DialogTabFramework from './create-app-tabs/DialogTabFramework'
import InvalidData from './create-app-tabs/InvalidData'

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})

const TabLabel = props => {
  const { icon, title, subtitle, active } = props

  return (
    <div>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar
          variant='rounded'
          sx={{
            mr: 3.5,
            ...(active ? { color: 'common.white', backgroundColor: 'primary.main' } : { color: 'text.primary' })
          }}
        >
          {icon}
        </Avatar>
        <Box sx={{ textAlign: 'left' }}>
          <Typography variant='body2'>{title}</Typography>
          <Typography variant='caption' sx={{ color: 'text.disabled', textTransform: 'none' }}>
            {subtitle}
          </Typography>
        </Box>
      </Box>
    </div>
  )
}
const tabsArr = ['detailsTab', 'frameworkTab', 'DatabaseTab', 'paymentTab', 'submitTab']

const DialogCreateApp = ({ show, setShow, data }) => {
  // ** States
  // const [show, setShow] = useState(true)
  const [activeTab, setActiveTab] = useState('detailsTab')

  // ** Hook
  const { settings } = useSettings()

  // ** Var
  const { direction } = settings

  const handleClose = () => {
    setShow(false)
    setActiveTab('detailsTab')
  }
  const nextArrow = direction === 'ltr' ? 'mdi:arrow-right' : 'mdi:arrow-left'
  const previousArrow = direction === 'ltr' ? 'mdi:arrow-left' : 'mdi:arrow-right'

  const renderTabFooter = () => {
    const prevTab = tabsArr[tabsArr.indexOf(activeTab) - 1]
    const nextTab = tabsArr[tabsArr.indexOf(activeTab) + 1]

    return (
      <Box sx={{ mt: 10, display: 'flex', gap: 10, alignItems: 'center', position: 'absolute', bottom: 0, right: 0 }}>
        <Button
          variant='outlined'
          color='secondary'
          disabled={activeTab === 'detailsTab'}
          onClick={() => setActiveTab(prevTab)}
          startIcon={<Icon icon={previousArrow} />}
        >
          Previous
        </Button>
        <Button
          variant='contained'
          color={'primary'}
          endIcon={<Icon icon={activeTab === 'submitTab' ? 'mdi:check' : nextArrow} />}
          onClick={() => {
            if (activeTab !== 'submitTab') {
              setActiveTab(nextTab)
            } else {
              handleClose()
            }
          }}
        >
          {activeTab === 'submitTab' ? 'Close' : 'Next'}
        </Button>
      </Box>
    )
  }

  return (
    <Dialog
      fullWidth
      open={show}
      scroll='body'
      maxWidth='md'
      onClose={(event, reason) => {
        if (reason && reason == "backdropClick") {
          console.log('backdropClicked. Not closing dialog.')
          return;
        }
    
        handleClose();
      }}
      TransitionComponent={Transition}
    >
      <DialogContent
        sx={{
          position: 'relative',
          pr: { xs: 5, sm: 12 },
          pl: { xs: 4, sm: 11 },
          pt: { xs: 8, sm: 12.5 },
          pb: { xs: 5, sm: 12.5 }
        }}
      >
        <IconButton size='small' onClick={handleClose} sx={{ position: 'absolute', right: '1rem', top: '1rem' }}>
          <Icon icon='mdi:close' />
        </IconButton>
        <Box sx={{ display: 'flex', flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
          <TabContext value={activeTab}>
            <TabList
              orientation='vertical'
              onChange={(e, newValue) => setActiveTab(newValue)}
              sx={{
                border: 0,
                minWidth: 200,
                '& .MuiTabs-indicator': { display: 'none' },
                '& .MuiTabs-flexContainer': {
                  alignItems: 'flex-start',
                  '& .MuiTab-root': {
                    width: '100%',
                    alignItems: 'flex-start'
                  }
                }
              }}
            >
              <Tab
                disableRipple
                value='detailsTab'
                label={
                  <TabLabel
                    title='Details'
                    subtitle='Total Records'
                    icon={<Icon icon='mdi:clipboard-outline' />}
                    active={activeTab === 'detailsTab'}
                  />
                }
              />
              <Tab
                disableRipple
                value='frameworkTab'
                label={
                  <TabLabel
                    title='New Students'
                    icon={<PersonAddIcon fontSize='medium' />}
                    subtitle='View Detail'
                    active={activeTab === 'frameworkTab'}
                  />
                }
              />
              <Tab
                disableRipple
                value='DatabaseTab'
                label={
                  <TabLabel
                    title='Existing Users'
                    active={activeTab === 'DatabaseTab'}
                    subtitle='View Detail'
                    icon={<GroupIcon fontSize='medium' />}
                  />
                }
              />
              <Tab
                disableRipple
                value='paymentTab'
                label={
                  <TabLabel
                    title='Duplicates'
                    active={activeTab === 'paymentTab'}
                    subtitle='View Detail'
                    icon={<PlaylistAddCheckIcon fontSize='medium' />}
                  />
                }
              />
              <Tab
                disableRipple
                value='submitTab'
                label={
                  <TabLabel
                    title='Invalid Data'
                    subtitle='View Detail'
                    icon={<ReportProblemIcon fontSize='medium' />}
                    active={activeTab === 'submitTab'}
                  />
                }
              />
            </TabList>
            <TabPanel value='detailsTab' sx={{ flexGrow: 1 }} style={{ position: 'relative', height: 500 }}>
              <DialogTabDetails data={data?.message} />
              {renderTabFooter()}
            </TabPanel>
            <TabPanel value='frameworkTab' sx={{ flexGrow: 1 }} style={{ position: 'relative', height: 500 }}>
              <DialogTabFramework newStudents={data?.message?.newStudents} />
              {renderTabFooter()}
            </TabPanel>
            <TabPanel value='DatabaseTab' sx={{ flexGrow: 1 }} style={{ position: 'relative', height: 500 }}>
              <DialogTabDatabase existingUsers={data?.message?.existingUsers} />
              {renderTabFooter()}
            </TabPanel>
            <TabPanel value='paymentTab' sx={{ flexGrow: 1 }} style={{ position: 'relative', height: 500 }}>
              <DialogTabBilling duplicates={data?.message?.duplicates} />
              {renderTabFooter()}
            </TabPanel>
            <TabPanel value='submitTab' sx={{ flexGrow: 1 }} style={{ position: 'relative', height: 500 }}>
              <InvalidData invalidData={data?.message?.invalidData} />
              {renderTabFooter()}
            </TabPanel>
          </TabContext>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default DialogCreateApp
