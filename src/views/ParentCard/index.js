import Grid from '@mui/material/Grid'
import React, { forwardRef, useEffect, useState } from 'react'
import QRCode from 'qrcode.react'
import Typography from '@mui/material/Typography'
import { Box } from '@mui/material'
import { Divider } from 'antd'

const backgroundImageUrl = 'url(/images/parent_card_back.png)'

const boxStyle = {
  backgroundImage: backgroundImageUrl,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  width: '465px',
  height: '314px',
  border: '2px solid gray'
}

const ParentCard = forwardRef((props, ref) => {
  const { data } = props
  const [students, setStudents] = useState([])

  function processArray(arr) {
    const slicedArray = arr.length >= 3 ? arr.slice(0, 3) : arr

    return slicedArray
  }

  useEffect(() => {
    if (data?.students?.length) {
      const resultArray = processArray(data?.students)
      setStudents(resultArray)
    }
  }, [data])

  return (
    <div style={{ ...boxStyle }} ref={ref}>
      <div style={{ marginLeft: 20, marginRight: 20, paddingTop: 10 }}>
        <div className='print-card-header'>
          <div className='print-logo'>
            {students?.length > 0 ? (
              <img src={data?.students[0]?.grade?.school?.profileUrl} width={125} height={45} />
            ) : null}
          </div>
          <div className='print-text'>
            <p>Pick-up Card</p>
          </div>
          <div></div>
        </div>

        <div>
          <Grid container spacing={5}>
            <Grid
              item
              xs={4}
              md={4}
              sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
            >
              <QRCode size={110} value={`https://ezpick.co/?id=${data?.id}`} />
            </Grid>

            <Grid item xs={8} md={8}>
              <Grid container spacing={0} style={{ minHeight: 160 }}>
                {students?.length > 0 ? (
                  students?.map((student, index) => {
                    return (
                      <Grid key={student?.id} item sm={12} md={12}>
                        <Box sx={{ position: 'relative' }}>
                          <Grid container spacing={8}>
                            <Grid item xs={2}>
                              <img
                                src={student?.profileUrl ? student?.profileUrl : '/images/student-logo--preview.png'}
                                alt={'Image' + index}
                                width={45}
                                height={45}
                                style={{ borderRadius: 5 }}
                              />
                            </Grid>

                            <Grid item xs={10}>
                              <Grid container justifyContent='space-between'>
                                <Grid item xs={8}>
                                  <Typography className='card-student-name' variant='body1'>
                                    {student?.name}
                                  </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                  <Typography className='card-grade-name' variant='body1'>
                                    {student?.grade?.name}
                                  </Typography>
                                </Grid>
                              </Grid>

                              <Grid container>
                                <Grid item xs={12}>
                                  <Typography style={{ color: '#067A25' }} variant='body1'>
                                    {student?.grade?.school?.name}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                          {index === students?.length - 1 && (
                            <div style={{ width: '90%' }}>
                              <Divider style={{ backgroundColor: 'grey', margin: 5 }} />
                            </div>
                          )}
                        </Box>
                      </Grid>
                    )
                  })
                ) : (
                  <Typography>No Student Found</Typography>
                )}
              </Grid>
            </Grid>
          </Grid>

          <Grid container>
            <Grid item sm={12} md={12}>
              <Typography>
                <strong>Authorized:</strong>
              </Typography>
            </Grid>
            <Grid item>
              <Typography sm={12} md={12}>
                <strong>Contact:</strong> {data?.phoneNo}, {data?.email}
              </Typography>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  )
})

export default ParentCard
