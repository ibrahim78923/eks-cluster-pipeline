import Grid from '@mui/material/Grid'
import BillingHistoryTable from 'src/views/account-settings/billing/BillingHistoryTable'
import { toast } from 'react-hot-toast'
import { useEffect, useState } from 'react'
import { useAuth } from 'src/hooks/useAuth'
import { getInvoices } from 'src/services/client.service'

const TabSecurity = () => {
  const [invoice, setIncoice] = useState([])
  const [loading, setLoading] = useState(false)

  const auth = useAuth()

  const fetchInvoice = async cusId => {
    setLoading(true)
    const res = await getInvoices(cusId)
    if (res?.success) {
      setLoading(false)
      setIncoice(res?.invoices?.data?.filter(item => item?.customer === auth?.user?.customerId))
      toast.success('Invoices fetched Successfully')
    } else {
      setLoading(false)
      toast.error(res?.message)
    }
  }

  useEffect(() => {
    fetchInvoice(auth?.user?.customerId)
  }, [auth?.user?.customerId])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <BillingHistoryTable invoice={invoice} loading={loading} />
      </Grid>
    </Grid>
  )
}

export default TabSecurity
