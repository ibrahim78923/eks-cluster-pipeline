import React, { useEffect, useRef, useState } from 'react'
import ReactToPrint from 'react-to-print'

import { useRouter } from 'next/router'
import { Box, Button } from '@mui/material'

import BlankLayout from 'src/@core/layouts/BlankLayout'
import ParentCard from 'src/views/ParentCard'

import { getByID } from 'src/services/parent.service'
import useMediaQuery from '@mui/material/useMediaQuery' // Import useMediaQuery

const PrintCard = () => {
  const router = useRouter()
  const [parentData, setParentData] = useState([])
  const { id } = router.query

  const cardRef = useRef(null)

  const fetchParentData = async id => {
    const res = await getByID(id)
    if (res?.success) {
      setParentData(res?.parent)
    }
  }

  useEffect(() => {
    if (id) {
      fetchParentData(id)
    }
  }, [id])

  const isMobile = useMediaQuery('(max-width: 600px)') // Adjust the breakpoint as needed

  return (
    <Box className='content-center'>
      <div
        style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 20 }}
      >
        <div style={{ transform: isMobile && 'rotate(90deg)', width: '100%' }}>
          <ParentCard ref={cardRef} data={parentData} />
        </div>

        <div style={{ marginTop: isMobile ? 100 : 30 }}>
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
        </div>
      </div>
    </Box>
  )
}
PrintCard.getLayout = page => <BlankLayout>{page}</BlankLayout>
PrintCard.guestGuard = true

export default PrintCard
