import React, { useEffect, useRef, useState } from 'react'
import ReactToPrint from 'react-to-print'

import { useRouter } from 'next/router'
import { Box, Button, Grid } from '@mui/material'

import BlankLayout from 'src/@core/layouts/BlankLayout'
import ParentCard from 'src/views/ParentCard/bulk'

import { getByClientId } from 'src/services/parent.service'
import useMediaQuery from '@mui/material/useMediaQuery' // Import useMediaQuery
import { useAuth } from 'src/hooks/useAuth'

const PrintCard = () => {
  const [parentData, setParentData] = useState([])
  const cardRef = useRef(null)

  const auth = useAuth()

  const fetchParents = async id => {
    const data = await getByClientId(id)
    if (data?.success) setParentData(data?.parents)
  }
  console.log(auth.user, 'auth')
  useEffect(() => {
    fetchParents(auth?.user?.id)
  }, [auth?.user?.id])

  const isMobile = useMediaQuery('(max-width: 600px)') // Adjust the breakpoint as needed
  console.log(parentData, 'parentData')
  return (
    <Box>
      <div
        style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 20 }}
      >
        {!isMobile ? (
          <>
            <div style={{ marginTop: isMobile ? 100 : 50 }}>
              <ReactToPrint
                trigger={() => {
                  // NOTE: could just as easily return <SomeComponent />. Do NOT pass an `onClick` prop
                  // to the root node of the returned component as it will be overwritten.
                  return (
                    <Button variant='contained' color='primary'>
                      Print Card
                    </Button>
                  )
                }}
                content={() => cardRef.current}
              />
              <h2 style={{ textAlign: 'center' }}>
                Total: {parentData?.filter(item => item?.students?.length)?.length}
              </h2>
            </div>
            <div ref={cardRef}>
              <Grid container spacing={15} sx={{ px: 20 }}>
                {parentData?.map(item => {
                  if (item?.students?.length)
                    return (
                      <Grid item sm={12} md={6} lg={4}>
                        <div
                          key={item?.id}
                          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}
                        >
                          <ParentCard data={item} />
                        </div>
                      </Grid>
                    )
                })}
              </Grid>
            </div>
          </>
        ) : (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              margin: 10,
              paddingTop: 100,
              textAlign: 'center'
            }}
          >
            <h1>Please open this page in Desktop</h1>
          </div>
        )}
      </div>
    </Box>
  )
}
PrintCard.getLayout = page => <BlankLayout>{page}</BlankLayout>
PrintCard.guestGuard = true

export default PrintCard
