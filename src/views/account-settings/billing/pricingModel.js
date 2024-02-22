import React, { useState } from 'react'
import Switch from '@mui/material/Switch'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'

import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { IconButton } from '@mui/material'

import { updateSubscription } from 'src/services/client.service'
import { toast } from 'react-hot-toast'
import { Spin } from 'antd'
import Icon from 'src/@core/components/icon'

const Section1 = ({
  setSelectedPlan,
  selectedPlan,
  plans,
  setPlanDuration,
  planDuration,
  user,
  closeModal,
  setOpenInvoiceDialog,
  setInvoiceData
}) => {
  const [nameOnly, setNameOnly] = useState(planDuration === 'yearly')
  const [loading, setLoading] = useState(false)

  const handleChangeSwitch = event => {
    setNameOnly(event.target.checked)
    if (event.target.checked) setPlanDuration('yearly')
    else setPlanDuration('monthly')
  }

  const handleSuccessForm = () => {
    closeModal()
    setOpenInvoiceDialog(true)
  }

  const handleSelect = async item => {
    setLoading(true)
    setSelectedPlan(item)
    const data = {
      subscriptionId: user?.subscriptionId,
      priceId: item?.priceId,
      customerId: user?.customerId,
      planId: item?.id,
      clientId: user?.id
    }
    const res = await updateSubscription(data)
    if (res?.success) {
      setLoading(false)
      setInvoiceData(res?.invoice)
      handleSuccessForm()
      toast.success('Plan Invoice generated')
    } else {
      setLoading(false)
      toast.error(res?.message)
    }
  }

  return (
    <>
      <Spin spinning={loading}>
        <div style={{ paddingBottom: '80px', paddingTop: '20px' }} id='pricing-section'>
          <div style={{ paddingBottom: '64px', paddingLeft: '30px' }}>
            <p
              style={{
                color: 'black',
                textAlign: 'center',
                fontSize: '38px',
                fontWeight: 'bold',
                marginBottom: '40px'
              }}
            >
              {'Choose the plan that fits your needs.'}
            </p>
            <p
              style={{
                color: 'black',
                textAlign: 'center',
                fontSize: '18px',
                fontWeight: 'normal',
                marginBottom: '25px'
              }}
            >
              {'Switch your plan from monthly to yearly'}
            </p>
            <Grid container alignItems='center' justifyContent='center'>
              <p
                style={{
                  color: 'black',
                  fontSize: '18px',
                  fontWeight: 'normal',
                  lineHeight: 'tight'
                }}
              >
                {'Monthly'}
              </p>
              <Switch checked={nameOnly} onChange={handleChangeSwitch} />
              <p
                style={{
                  color: 'black',
                  fontSize: '18px',
                  fontWeight: 'normal',
                  lineHeight: 'tight'
                }}
              >
                {'Yearly'}
              </p>
            </Grid>
          </div>
          <Grid container justifyContent='center' spacing={4}>
            {plans?.map((item, index) => {
              const selected = item?.id === selectedPlan?.id
              return (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <div
                    style={{
                      transform: 'skewY(-10deg)',
                      borderRadius: '15px',
                      backgroundColor: 'white',
                      filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))',
                      transition: 'box-shadow 0.25s ease-in-out',
                      height: planDuration === 'monthly' ? '70vh' : '75vh',
                      position: 'relative'
                    }}
                  >
                    <Button
                      style={{
                        position: 'absolute',
                        top: '-16px',
                        right: '-16px',
                        width: `${
                          item?.title?.toUpperCase() === 'ENTERPRISE PLAN' ||
                          item?.title?.toUpperCase() === 'PROFESSIONAL PLAN'
                            ? '200px'
                            : '160px'
                        }`,
                        height: '52px',
                        backgroundImage: 'linear-gradient(to right, #2F4D33, #339559)',
                        backgroundRepeat: 'no-repeat',
                        backgroundOrigin: 'padding-box',
                        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        transition: 'background 0.25s ease-in-out',
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textTransform: 'uppercase'
                      }}
                    >
                      {item?.title}
                    </Button>
                    <div style={{ transform: 'skewY(10deg)', position: 'absolute', top: 50 }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          flexDirection: 'column'
                        }}
                      >
                        <p
                          style={{
                            textTransform: 'capitalize',
                            color: 'black',
                            fontSize: '18px',
                            fontWeight: 'bold'
                          }}
                        >
                          {item?.durationType}
                        </p>
                        <span style={{ color: 'black', fontSize: '30px', fontWeight: 'bold' }}>
                          <sup style={{ color: 'black', fontSize: '15px', fontWeight: 'bold' }}>$</sup>
                          {item?.price}
                          <span style={{ color: 'black', fontSize: '15px', fontWeight: 'bold' }}>.00</span>
                        </span>
                        <span style={{ color: 'black', fontSize: '11px', fontWeight: 'normal' }}>
                          {`/ ${item?.durationType?.toUpperCase()}`}
                        </span>
                      </div>
                      {item?.durationType === 'yearly' && (
                        <p
                          style={{
                            textTransform: 'capitalize',
                            color: '#B40105',
                            textAlign: 'center',
                            fontSize: '18px',
                            fontWeight: 'bold',
                            marginTop: '2px'
                          }}
                        >
                          {`${item?.point8}% OFF`}
                        </p>
                      )}
                      <div style={{ padding: '25px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                          <span>&#8226;</span>
                          <span
                            style={{
                              marginLeft: '2px',
                              color: 'black',
                              fontSize: '14px',
                              fontWeight: 'normal',
                              lineHeight: 'normal'
                            }}
                          >
                            {item?.point1}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                          <span>&#8226;</span>
                          <span
                            style={{
                              marginLeft: '2px',
                              color: 'black',
                              fontSize: '14px',
                              fontWeight: 'normal',
                              lineHeight: 'normal'
                            }}
                          >
                            {item?.point2}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                          <span>&#8226;</span>
                          <span
                            style={{
                              marginLeft: '2px',
                              color: 'black',
                              fontSize: '14px',
                              fontWeight: 'normal',
                              lineHeight: 'normal'
                            }}
                          >
                            {item?.point3}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                          <span>&#8226;</span>
                          <span
                            style={{
                              marginLeft: '2px',
                              color: 'black',
                              fontSize: '14px',
                              fontWeight: 'normal',
                              lineHeight: 'normal'
                            }}
                          >
                            {item?.point4}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                          <span>&#8226;</span>
                          <span
                            style={{
                              marginLeft: '2px',
                              color: 'black',
                              fontSize: '14px',
                              fontWeight: 'normal',
                              lineHeight: 'normal'
                            }}
                          >
                            {item?.point5}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span>&#8226;</span>
                          <span
                            style={{
                              marginLeft: '2px',
                              color: 'black',
                              fontSize: '14px',
                              fontWeight: 'normal',
                              lineHeight: 'normal'
                            }}
                          >
                            {item?.point6}
                          </span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '25px' }}>
                        <Button
                          onClick={() => handleSelect(item)}
                          style={{
                            width: '180px',
                            height: '44px',
                            backgroundImage: selected ? 'none' : 'linear-gradient(to right, #FFBD1D, #FCA000)',
                            backgroundRepeat: 'no-repeat',
                            backgroundOrigin: 'padding-box',
                            boxShadow: '0px 2px 2px 2px rgba(0, 0, 0, 0.25)',
                            borderRadius: '22px',
                            cursor: 'pointer',
                            transition: 'background 0.25s ease-in-out',
                            color: selected ? 'black' : 'white',
                            fontSize: '14px',
                            fontWeight: selected ? 'normal' : 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textTransform: 'uppercase'
                          }}
                        >
                          {selected ? 'Current Plan' : 'Upgrade'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Grid>
              )
            })}
          </Grid>
          <div
            dir='ltr'
            style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
            className='block md:hidden'
          >
            {/* Your carousel component goes here */}
          </div>
        </div>
      </Spin>
    </>
  )
}

export default Section1
