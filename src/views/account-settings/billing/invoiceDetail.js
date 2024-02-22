import React, { useState } from 'react'
import Button from '@mui/material/Button'
import { updateSubscriptionConfirm } from 'src/services/client.service'
import { toast } from 'react-hot-toast'
import { Spin } from 'antd'

function UpgradePlanDetails({ user, invoice, closeModal, selectedPlan }) {
  const [loading, setLoading] = useState(false)

  if (!invoice || !invoice.lines || !invoice.lines.data) {
    return null // Handle the case when the data is not available
  }

  const {
    amount_due,
    amount_remaining,
    currency,
    customer_name,
    customer_email,
    lines: { data: lineItems }
  } = invoice

  const onCancel = () => {
    closeModal()
  }
  const onConfirm = async () => {
    const data = {
      subscriptionId: user?.subscriptionId,
      clientId: user?.id,
      priceId: selectedPlan?.priceId,
      planId: selectedPlan?.id
    }

    const res = await updateSubscriptionConfirm(data)
    if (res?.success) {
      setLoading(false)
      onCancel()
      toast.success('Plan upgraded sucessfully')
    } else {
      setLoading(false)
      toast.error(res?.message)
    }
  }

  return (
    <Spin spinning={loading}>
      <div>
        <h2>Upgrade Plan Details</h2>
        <p>
          Customer Name: <b>{customer_name}</b>
        </p>
        <p>
          Customer Email: <b>{customer_email}</b>
        </p>
        <p>
          Total Amount Due: {amount_due / 100} {currency}
        </p>
        <p>
          Amount Remaining: {amount_remaining / 100} {currency}
        </p>
        <h3>Invoice Line Items:</h3>
        <ul>
          {lineItems.map((item, index) => (
            <li key={index}>
              <strong>{item.description}</strong>
              <br />
              Amount: {item.amount / 100} {currency}
            </li>
          ))}
        </ul>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 30 }}>
          <Button variant='contained' onClick={onConfirm}>
            Confirm
          </Button>
          <Button variant='outlined' onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </Spin>
  )
}

export default UpgradePlanDetails
