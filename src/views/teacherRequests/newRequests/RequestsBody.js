import { useEffect, useState } from 'react'
import { useSocket } from 'src/context/socket/teacherSocket'
import { useRequests } from '/src/context/requests'
import { Box, Typography, Switch, Select, MenuItem, Checkbox, ListItemText, Tooltip, Grid } from '@mui/material'

import { updateSelectedGrades } from 'src/services/teacher.service'
import studentImage from 'public/images/avatars/student.png'
import { useAuth } from 'src/hooks/useAuth'
import { useRouter } from 'next/router'
import { Grid as VirtualGrid } from 'react-virtualized'
import useMediaQuery from '@mui/material/useMediaQuery'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 7 + ITEM_PADDING_TOP,
      width: 200,
      borderRadius: 10,
      marginTop: 5
    }
  }
}

const NewRequestsBody = ({ grades }) => {
  const [gradeIds, setGradeIds] = useState([])
  const [requests, setRequests] = useRequests()
  const [sortedReq, setSortedReq] = useState([])
  const [nameOnly, setNameOnly] = useState(false)
  const isMobile = useMediaQuery(theme => theme.breakpoints.down('md'))

  const [isLoading, setIsLoading] = useState(false)

  const handlePLaceHolder = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }
  useEffect(() => {
    handlePLaceHolder()
  }, [])

  const handleChangeSwitch = event => {
    setNameOnly(event.target.checked)
  }

  const auth = useAuth()

  const handleChange = event => {
    const {
      target: { value }
    } = event
    if (value?.length) {
      const selectedValue = value[value?.length - 1]
      if (selectedValue === 'all') {
        setGradeIds(grades?.map(item => item.id))
        window.localStorage.setItem('selectedGrades', JSON.stringify(grades?.map(item => item.id)))
        updateSelectedGrades(auth.user.id, JSON.stringify(grades?.map(item => item.id)))
      } else {
        setGradeIds(value?.filter(item => item !== 'all'))
        window.localStorage.setItem('selectedGrades', JSON.stringify(value?.filter(item => item !== 'all')))
        updateSelectedGrades(auth.user.id, JSON.stringify(value?.filter(item => item !== 'all')))
      }
    }
  }
  useEffect(() => {
    const selectedGrades = JSON.parse(window.localStorage.getItem('selectedGrades'))
    if (selectedGrades) setGradeIds(selectedGrades)
    else if (auth.user?.selectedGrades ? JSON.parse(auth.user?.selectedGrades) : null)
      setGradeIds(JSON.parse(auth.user?.selectedGrades))
    else setGradeIds(grades?.map(item => item.id))
  }, [grades])

  useEffect(() => {
    const sortedSyudents = gradeIds?.includes('all')
      ? requests?.filter(item => item.status === 0 && auth?.user?.clientId === item?.clientId)
      : requests?.filter(
          item => gradeIds?.includes(item.gradeId) && item.status === 0 && auth?.user?.clientId === item?.clientId
        )
    setSortedReq(sortedSyudents)
  }, [requests, requests?.length, gradeIds])

  const [userData, setUserDate] = useState()
  const router = useRouter()

  useEffect(() => {
    const data = JSON.parse(window.localStorage.getItem('userData'))
    setUserDate(data)
  }, [router])

  const getColumnCount = () => {
    const screenWidth = window.innerWidth
    if (screenWidth <= 600) {
      return 2
    } else {
      return Math.floor(screenWidth / 155)
    }
  }

  const cellRenderer = ({ columnIndex, rowIndex, style }) => {
    const index = rowIndex * getColumnCount() + columnIndex

    if (index < sortedReq.length) {
      const req = sortedReq[index]
      const styleObj = {
        ...style,
        backgroundColor: ''
      }

      if (isLoading) {
        return (
          <div style={styleObj}>
            <img
              width={isMobile ? 170 : 140}
              height={isMobile ? 130 : 120}
              src='https://ph-files.imgix.net/2611612b-dfbc-4211-b49b-80c63728363e.png?auto=format'
            />
          </div>
        )
      } else {
        return (
          <div style={styleObj}>
            <GradeColBody
              request={req}
              key={req?.student?.id}
              student={req?.student}
              isFromTop={true}
              grades={grades}
              nameOnly={nameOnly}
              isMobile={isMobile}
            />
          </div>
        )
      }
    } else {
      return null // Return null for empty cells
    }
  }

  const columnCount = getColumnCount()
  const rowCount = Math.ceil(sortedReq.length / columnCount)

  return (
    <div className={!userData?.status ? 'blury-display' : ''}>
      <Grid container>
        <Grid item xs={6} md={2}>
          <Select
            labelId='my-select-label'
            id='my-select'
            multiple
            value={gradeIds}
            onChange={handleChange}
            MenuProps={MenuProps}
            style={{ width: isMobile ? '95%' : 200 }}
            placeholder='Select Teachers'
            renderValue={selected => {
              if (selected.length === 0) {
                return <em>Select Grades</em>
              }
              const names = selected?.map(id => {
                const object = grades.find(obj => obj.id === id)
                return object ? object.name : 'All Grades'
              })
              return names.join(', ')
            }}
          >
            <MenuItem sx={{ height: 33, padding: 0, margin: 0, ml: 3 }} key={'all'} value={'all'}>
              <ListItemText primary={'All Grades'} />
              <Checkbox checked={gradeIds.indexOf('all') > -1} />
            </MenuItem>
            {grades.map(item => (
              <MenuItem sx={{ height: 33, padding: 0, margin: 0, ml: 3 }} key={item.id} value={item.id}>
                <ListItemText primary={item.name} />
                <Checkbox checked={gradeIds.indexOf(item.id) > -1} />
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={6} md={3} sx={{ display: 'flex', justifyContent: 'flex-start' }}>
          <Box style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Typography>Image</Typography>
            <Switch checked={nameOnly} onChange={handleChangeSwitch} color='primary' />
            <Typography>Name</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={7}>
          <Box style={{ display: 'inline-flex', alignItems: 'center' }}>
            <Typography>
              <strong>Request By:</strong> Parents:
            </Typography>{' '}
            &nbsp;&nbsp;
            <p
              style={{ width: 35, height: 20, backgroundColor: 'white', boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)' }}
            />
            &nbsp;&nbsp;
            <Typography>Other:</Typography> &nbsp;&nbsp;
            <p
              style={{ width: 35, height: 20, backgroundColor: '#D7EEFE', boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)' }}
            />
          </Box>
        </Grid>
      </Grid>
      <Box>
        <Typography variant='h5'>New Requests</Typography>
      </Box>
      <Box>
        {sortedReq?.length > 0 ? (
          <div style={{ display: 'flex', width: '100%', flexWrap: 'wrap', gap: 5 }}>
            {/* {sortedReq?.map(req => {
              return (
                <GradeColBody
                  request={req}
                  key={req?.student?.id}
                  student={req?.student}
                  isFromTop={true}
                  grades={grades}
                  nameOnly={nameOnly}
                />
              )
            })} */}
            <VirtualGrid
              cellRenderer={cellRenderer}
              columnCount={columnCount}
              rowCount={rowCount}
              columnWidth={isMobile ? window.innerWidth / 2.2 : 150}
              rowHeight={isMobile ? 130 : 120}
              width={window.innerWidth}
              height={window.innerHeight - 200}
            />
          </div>
        ) : (
          <Box>
            <Typography variant='h5' sx={{ textAlign: 'center', mt: 30 }}>
              Waiting for parent's request
            </Typography>
          </Box>
        )}
      </Box>
    </div>
  )
}

const DURATION = 90

const GradeColBody = ({ isMobile, key, student, isFromTop, grades, nameOnly }) => {
  const [request, setRequest] = useState({})
  const [timer, setTimer] = useState(DURATION)
  const [requests, setRequests] = useRequests()
  const [socket] = useSocket()

  useEffect(() => {
    if (requests?.length && student) {
      const existing = requests?.find(r => r.studentId == student.id)

      const sortedRequests = requests.sort((x, y) => Number(new Date(y.requestTime)) - Number(new Date(x.requestTime)))

      if (existing) {
        setRequests(sortedRequests)
        setRequest(existing)
      }
    }
  }, [requests, requests?.length])

  useEffect(() => {
    if (request) {
      let seconds =
        DURATION - Math.floor(Math.abs(new Date().getTime() - new Date(request.requestTime).getTime()) / 1000)
      setTimer(seconds)
    }
  }, [request?.requestTime])

  const updateRequestStatus = () => {
    setRequest({ ...request, status: 1 })
  }

  if (request?.status === 0) {
    return (
      <StudentCardRequested
        student={student}
        requestId={request.id}
        requestTime={request.requestTime}
        timer={timer}
        setTimer={setTimer}
        isTimedOut={timer <= 0}
        updateRequestStatus={updateRequestStatus}
        key={student.id}
        isFromTop={isFromTop}
        grades={grades}
        setRequests={setRequests}
        request={request}
        isMobile={isMobile}
        nameOnly={nameOnly}
      />
    )
  }
}

const TEMP_IMG = studentImage

const StudentCardRequested = ({
  student,
  requestId,
  updateRequestStatus,
  timer,
  setTimer,
  isTimedOut,
  requestTime,
  isFromTop,
  grades,
  setRequests,
  request,
  isMobile,
  nameOnly
}) => {
  const [socket] = useSocket()

  const [timerInterval, setTimerInterval] = useState(null)
  const auth = useAuth()

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prevCountdown => prevCountdown - 1) // Decrement the countdown by 1 every second

      if (timer === 0) {
        clearInterval(interval) // Stop the countdown when it reaches 0
      }
    }, 1000)

    return () => {
      clearInterval(interval) // Clean up the interval when the component is unmounted or when requestedTime changes
    }
  }, [requestTime])

  const approveRequest = e => {
    // alert('Approving Student ' + student.id)
    // Emit an event
    socket.emit('_approve_request', { requestId })
    setRequests(prevArray => {
      // Find the object with the specified id
      const updatedArray = prevArray.map(obj => {
        if (obj.id === requestId) {
          // Update the name of the object
          return { ...obj, status: 1 }
        }
        return obj
      })

      return updatedArray
    })
    updateRequestStatus()
  }
  if (request?.pickUpGuardian?.includes('parent')) {
    return (
      <Box
        sx={{
          width: isMobile ? '96%' : '140px',
          height: isMobile ? '130x' : '102px',
          boxShadow: '2px 2px 10px -7px black',
          border: '1px solid #FCA000',
          borderRadius: '10px',
          transition: '0.25s all ease-in-out',
          marginTop: 0,
          p: 1,
          mt: 1,
          marginBottom: 1
        }}
      >
        <Box
          sx={{ minHeight: isMobile ? 55 : 45, display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}
        >
          <Box
            sx={{
              width: '40px',
              height: '40px',
              minWidth: '40px',
              overflow: 'hidden',
              borderRadius: 1,
              marginRight: 1,
              display: nameOnly ? 'none' : ''
            }}
          >
            <img
              src={student?.profileUrl || TEMP_IMG.src || TEMP_IMG}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              alt={student?.name ? student.name : student.nameAr}
            />
          </Box>
          <Tooltip title={student?.name ? student.name : student.nameAr}>
            <Box
              className={nameOnly ? 'short-stname' : 'short-stname-with-image'}
              sx={{
                fontSize: nameOnly ? '20px' : '12px',
                fontWeight: 'bold',
                lineHeight: 1,
                my: nameOnly ? 0 : 4,
                margin: 0,
                padding: 0
              }}
            >
              {student?.name ? student.name : student.nameAr}
            </Box>
          </Tooltip>
        </Box>
        <Box sx={{ fontSize: '12px', fontWeight: 'bold' }}>{`Grade: ${
          grades?.filter(item => item.id === student?.gradeId)[0]?.name
        }`}</Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box
            sx={{
              width: '100%',
              height: '30px',
              padding: 2,
              background: 'transparent linear-gradient(102deg, #FFBD1D 0%, #FCA000 100%) 0% 0% no-repeat padding-box',
              boxShadow: '0px 3px 6px #00000029',
              borderRadius: '5px',
              color: 'white',
              cursor: 'pointer',
              transition: '0.25s all ease-in-out',

              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',

              '&:hover': {
                background: 'transparent linear-gradient(102deg, #FCA000 0%, #FFBD1D 100%) 0% 0% no-repeat padding-box'
              }
            }}
            onClick={approveRequest}
          >
            CONFIRM
            <Box
              sx={{
                ml: 2,
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'flex-end',
                flexDirection: 'column',
                marginLeft: 1
              }}
              onClick={approveRequest}
            >
              {isTimedOut ? (
                <Typography
                  component='span'
                  sx={{
                    color: 'white',
                    textTransform: 'uppercase',
                    fontSize: '10px',
                    mr: 2,
                    fontWeight: 'bold',
                    textAlign: 'center'
                  }}
                >
                  Timed Out
                </Typography>
              ) : (
                <Box sx={{ display: 'flex' }} onClick={approveRequest}>
                  <Typography component='span' sx={{ color: 'white', fontSize: '21px', fontWeight: 'bold' }}>
                    {timer}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    )
  } else {
    return (
      <Box
        sx={{
          width: isMobile ? '96%' : '140px',
          height: isMobile ? '130x' : '102px',
          boxShadow: '2px 2px 10px -7px black',
          border: '1px solid #006BAA',
          borderRadius: '10px',
          transition: '0.25s all ease-in-out',
          marginTop: 0,
          p: 1,
          mt: 1,
          marginBottom: 1,
          backgroundColor: '#D7EEFE'
        }}
      >
        <Box
          sx={{ minHeight: isMobile ? 55 : 45, display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}
        >
          <Box
            sx={{
              width: '40px',
              height: '40px',
              minWidth: '40px',
              overflow: 'hidden',
              borderRadius: 1,
              marginRight: 1,
              display: nameOnly ? 'none' : ''
            }}
          >
            <img
              src={student?.profileUrl || TEMP_IMG.src || TEMP_IMG}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              alt={student?.name ? student.name : student.nameAr}
            />
          </Box>
          <Tooltip title={student?.name ? student.name : student.nameAr}>
            <Box
              className={nameOnly ? 'short-stname' : 'short-stname-with-image'}
              sx={{
                fontSize: nameOnly ? '20px' : '12px',
                fontWeight: 'bold',
                lineHeight: 1,
                my: nameOnly ? 0 : 4,
                margin: 0,
                padding: 0
              }}
            >
              {student?.name ? student.name : student.nameAr}
            </Box>
          </Tooltip>
        </Box>
        <Box sx={{ fontSize: '12px', fontWeight: 'bold' }}>{`Grade: ${
          grades?.filter(item => item.id === student?.gradeId)[0]?.name
        }`}</Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box
            sx={{
              width: '100%',
              height: '30px',
              padding: 2,
              background: 'transparent linear-gradient(102deg, #34AEFF 0%, #006BAA 100%) 0% 0% no-repeat padding-box',
              boxShadow: '0px 3px 6px #00000029',
              borderRadius: '5px',
              color: 'white',
              cursor: 'pointer',
              transition: '0.25s all ease-in-out',

              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',

              '&:hover': {
                background: 'transparent linear-gradient(102deg, #006BAA 0%, #34AEFF 100%) 0% 0% no-repeat padding-box'
              }
            }}
            onClick={approveRequest}
          >
            CONFIRM
            <Box
              sx={{
                ml: 2,
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'flex-end',
                flexDirection: 'column',
                marginLeft: 1
              }}
            >
              {isTimedOut ? (
                <Typography
                  component='span'
                  sx={{
                    color: 'white',
                    textTransform: 'uppercase',
                    fontSize: '10px',
                    mr: 2,
                    fontWeight: 'bold',
                    textAlign: 'center'
                  }}
                >
                  Timed Out
                </Typography>
              ) : (
                <Box sx={{ display: 'flex' }}>
                  <Typography component='span' sx={{ color: '#ffbd1d', fontSize: '21px', fontWeight: 'bold' }}>
                    {timer}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    )
  }
}

export default NewRequestsBody
