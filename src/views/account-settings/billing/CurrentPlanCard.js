// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import AlertTitle from '@mui/material/AlertTitle'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { LinearProgress, IconButton, InputLabel, Switch } from '@mui/material'

import { cancelSubscription, getByID } from 'src/services/client.service'
import { formatDate } from 'src/utiles/utiles'
// ** Icon Imports
import Icon from 'src/@core/components/icon'
import SelectOptions from './options'
import { updateClient } from 'src/services/client.service'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import Link from '@mui/material/Link'
import { useAuth } from 'src/hooks/useAuth'
import { toast } from 'react-hot-toast'
import { Spin } from 'antd'
import PricingPlans from './pricingModel'
import { getAllPlans } from 'src/services/cms'

import UpgradePlanDetails from './invoiceDetail'

const CurrentPlanCard = () => {
  // ** State
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState({})
  const [userInput, setUserInput] = useState('yes')
  const [secondDialogOpen, setSecondDialogOpen] = useState(false)
  const auth = useAuth()
  const { logout } = useAuth()
  const [selectedOption, setSelectedOption] = useState('')
  const [otherReason, setOtherReason] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleClose = () => setOpen(false)
  const handleSecondDialogClose = () => setSecondDialogOpen(false)
  const [openPricingDialog, setOpenPricingDialog] = useState(false)

  const [plans, setPlans] = useState([])
  const [planDuration, setPlanDuration] = useState('yearly')
  const [selectedPlan, setSelectedPlan] = useState(null)

  const [invoiceData, setInvoiceData] = useState({})
  const [isOpenInvoiceDialog, setOpenInvoiceDialog] = useState(false)

  const fetchPlans = async lang => {
    const result = await getAllPlans(lang)
    if (result?.success) setPlans(result?.plans)
  }

  const handleConfirmation = value => {
    handleClose()
    // setUserInput(value)
    // setSecondDialogOpen(true)
  }

  const fetchUser = async id => {
    const result = await getByID(id)
    if (result?.success) {
      console.log(result?.client, 'result?.client')
      setUser(result?.client)
      setSelectedPlan(result?.client?.plan)
      setPlanDuration(result?.client?.plan?.durationType)
      fetchPlans(result?.client?.plan?.lang)
    }
  }

  useEffect(() => {
    fetchUser(auth?.user?.id)
  }, [auth?.user?.id])

  const handleCancelSubscription = async () => {
    let reason = ''
    if (selectedOption === 'Other') {
      reason = otherReason
    } else {
      reason = selectedOption
    }

    if (reason) {
      setLoading(true)
      let subscriptionId = auth?.user?.subscription
      const result = await cancelSubscription(subscriptionId)
      if (result?.success) {
        let date = new Date()
        const data = {
          id:auth?.user?.id,
          cancelSubscription: false,
          deactivate: false,
          cancelSubscriptionDate: date?.toString(),
          cancelSubscriptionReason: reason
        }
        const result = await updateClient(data)
        if (result?.success) {
          setLoading(false)
          handleClose()
          toast.success('Subscription unsubscribed successfully')
          logout()
        } else {
          setLoading(false)
          toast.error(result?.message)
        }
      } else {
        setLoading(false)
        toast.success('Failed to unsubscribe, Try Again')
      }
    } else {
      setError('Please give a reason')
    }
  }
  const calculateRemainingDays = (startDate, expiryDate) => {
    const currentDate = new Date()
    const startDateObj = new Date(startDate)
    const expirationDate = new Date(expiryDate)

    // Calculate the total number of days in the plan
    const totalDays = Math.ceil((expirationDate - startDateObj) / (1000 * 60 * 60 * 24))

    // Calculate the current day within the plan
    const currentDay = Math.ceil((currentDate - startDateObj) / (1000 * 60 * 60 * 24))

    // Calculate the remaining days
    const daysRemaining = totalDays - currentDay

    // Calculate the percentage used
    const percentageUsed = (currentDay / totalDays) * 100

    return { daysRemaining, totalDays, currentDay, percentageUsed }
  }
  const { daysRemaining, totalDays, currentDay, percentageUsed } = calculateRemainingDays(
    user?.startDate,
    user?.expiryDate
  )
  let statusMessage = ''
  if (daysRemaining > 0) {
    statusMessage = 'Plan is active.'
  } else if (daysRemaining === 0) {
    statusMessage = 'Plan expires today.'
  } else {
    statusMessage = 'Plan has expired.'
  }

  return (
    <>
      <Card>
        <CardHeader title='Current Plan' />
        <CardContent>
          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 6 }}>
                <Typography sx={{ mb: 2, fontWeight: 500 }}>
                  Your Current Plan is <strong>{user?.plan?.title}</strong>
                </Typography>
              </Box>
              <Box sx={{ mb: 6 }}>
                <Typography sx={{ mb: 2, fontWeight: 500 }}>
                  Started at: <strong>{user?.startDate ? formatDate(user?.startDate) : ''}</strong>
                </Typography>
              </Box>
              <Box sx={{ mb: 6 }}>
                <Typography sx={{ mb: 2, fontWeight: 500 }}>
                  Active until: <strong>{user?.expiryDate ? formatDate(user?.expiryDate) : ''}</strong>
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                  We will send you a notification upon Subscription expiration
                </Typography>
              </Box>
              <div>
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <Typography
                    sx={{ mr: 2, fontWeight: 500, textTransform: 'capitalize' }}
                  >{`$${user?.plan?.price} ${user?.plan?.durationType}`}</Typography>
                  <CustomChip label={user?.plan?.title} size='small' color='primary' skin='light' />
                </Box>
                <ul>
                  <li component='li'>{user?.plan?.point1}</li>
                  <li component='li'>{user?.plan?.point2}</li>
                  <li component='li'>{user?.plan?.point3}</li>
                  <li component='li'>{user?.plan?.point4}</li>
                  <li component='li'>{user?.plan?.point5}</li>
                  <li component='li'>{user?.plan?.point6}</li>
                </ul>
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              {statusMessage === 'Plan expires today.' && (
                <Alert severity='warning' icon={false} sx={{ mb: 6 }}>
                  <AlertTitle sx={{ fontWeight: 700 }}>We need your attention!</AlertTitle>
                  Your plan requires update
                </Alert>
              )}

              <div>
                {statusMessage !== 'Plan has expired.' && (
                  <>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography sx={{ fontWeight: 600, color: 'text.secondary' }}>Days</Typography>
                      <Typography sx={{ fontWeight: 600, color: 'text.secondary' }}>
                        {currentDay} of {totalDays} Days
                      </Typography>
                    </Box>
                    <LinearProgress
                      value={percentageUsed}
                      variant='determinate'
                      sx={{ my: 1, height: 12, borderRadius: 6, '& .MuiLinearProgress-bar': { borderRadius: 6 } }}
                    />
                    <Typography sx={{ color: 'text.secondary' }}>
                      {daysRemaining} days remaining until your plan requires update
                    </Typography>
                  </>
                )}
                {!user?.cancelSubscription ? (
                  <Typography variant='h6'>Your subscription has been canceled to this plan.</Typography>
                ) : (
                  <Typography variant='h6'>{statusMessage}</Typography>
                )}
              </div>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ gap: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                <Button variant='contained' onClick={() => setOpenPricingDialog(true)}>
                  Upgrade Plan
                </Button>
                {!user?.cancelSubscription ? (
                  <Typography variant='h6'>You have already canceled your subscription to this plan.</Typography>
                ) : (
                  <Button variant='outlined' color='secondary' onClick={() => setOpen(true)}>
                    Cancel Subscription
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Dialog fullWidth maxWidth='sm' open={open} onClose={handleClose}>
        <Spin spinning={loading}>
          <DialogContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Box sx={{ width: '90%', textAlign: 'center', '& svg': { mb: 4, color: 'warning.main' } }}>
                <Icon icon='mdi:alert-circle-outline' fontSize='5.5rem' />
                <SelectOptions
                  setSelectedOption={setSelectedOption}
                  selectedOption={selectedOption}
                  setOtherReason={setOtherReason}
                  otherReason={otherReason}
                  setError={setError}
                />
                <span style={{ color: 'red' }}>{error}</span>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center' }}>
            <Button variant='contained' onClick={handleCancelSubscription}>
              Yes
            </Button>
            <Button variant='outlined' color='secondary' onClick={() => handleConfirmation('cancel')}>
              Cancel
            </Button>
          </DialogActions>
        </Spin>
      </Dialog>
      <Dialog fullWidth maxWidth='xs' open={secondDialogOpen} onClose={handleSecondDialogClose}>
        <DialogContent>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              '& svg': {
                mb: 14,
                color: userInput === 'yes' ? 'success.main' : 'error.main'
              }
            }}
          >
            <Icon
              fontSize='5.5rem'
              icon={userInput === 'yes' ? 'mdi:check-circle-outline' : 'mdi:close-circle-outline'}
            />
            <Typography variant='h4' sx={{ mb: 8 }}>
              {userInput === 'yes' ? 'Unsubscribed!' : 'Cancelled'}
            </Typography>
            <Typography>
              {userInput === 'yes' ? 'Your subscription cancelled successfully.' : 'Unsubscription Cancelled!'}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button variant='contained' color='success' onClick={handleSecondDialogClose}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullWidth
        scroll='body'
        maxWidth='lg'
        open={openPricingDialog}
        onClose={() => setOpenPricingDialog(false)}
        onBackdropClick={() => setOpenPricingDialog(false)}
      >
        <DialogContent sx={{ px: { xs: 8, sm: 15 }, position: 'relative' }}>
          <IconButton
            size='small'
            onClick={() => setOpenPricingDialog(false)}
            sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
          >
            <Icon icon='mdi:close' />
          </IconButton>

          <PricingPlans
            plans={plans?.filter(item => item?.durationType === planDuration)}
            setPlanDuration={setPlanDuration}
            setSelectedPlan={setSelectedPlan}
            selectedPlan={selectedPlan}
            planDuration={planDuration}
            closeModal={() => setOpenPricingDialog(false)}
            user={user}
            setOpenInvoiceDialog={setOpenInvoiceDialog}
            setInvoiceData={setInvoiceData}
          />
        </DialogContent>
      </Dialog>
      <Dialog
        fullWidth
        scroll='body'
        maxWidth='sm'
        open={isOpenInvoiceDialog}
        onClose={() => setOpenInvoiceDialog(false)}
        // onBackdropClick={() => setOpenInvoiceDialog(false)}
      >
        <DialogContent sx={{ px: { xs: 8, sm: 15 }, position: 'relative' }}>
          <IconButton
            size='small'
            onClick={() => setOpenInvoiceDialog(false)}
            sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
          >
            <Icon icon='mdi:close' />
          </IconButton>
          <UpgradePlanDetails
            user={user}
            selectedPlan={selectedPlan}
            invoice={invoiceData}
            closeModal={() => setOpenInvoiceDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default CurrentPlanCard
