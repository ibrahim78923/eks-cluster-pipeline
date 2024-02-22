import { Box, Typography } from '@mui/material'
import React from 'react'

const RequestsHeader = () => {
  return (
    <Box>
      <Box
        sx={{
          width: '100%',
          height: '54px',
          background: '#e2e2e2 0% 0% no-repeat padding-box',
          borderRadius: '10px 10px 0px 0px',
          px: '10px',

          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontWeight: 'bold'
        }}
      >
        <Typography>Request Pickup</Typography>
        <Box>
          Confirm Request
          <Typography
            component='span'
            sx={{
              width: '36px',
              height: '31px',
              background: '#ffffff 0% 0% no-repeat padding-box',
              borderRadius: '4px',
              margin: '0 10px',

              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            12
          </Typography>
        </Box>
        <Box>
          <Typography variant='body2'>
            Total Request
            <Typography
              component='span'
              sx={{
                width: '36px',
                height: '31px',
                background: '#ffffff 0% 0% no-repeat padding-box',
                borderRadius: '4px',
                margin: '0 10px',

                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              12
            </Typography>
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default RequestsHeader
