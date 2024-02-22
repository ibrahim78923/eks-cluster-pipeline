import { useEffect, useState } from 'react'
import { useSocket } from '/src/context/socket/teacherSocket'
import { useRequests } from '/src/context/requests'
import { getByGradeId as getStudents } from 'src/services/student.service'
import { Box, Tooltip, Typography } from '@mui/material'

const NoData = () => <Box></Box>

const RequestsBody = ({ grades }) => {
  if (grades) {
    return !grades.length ? (
      <NoData />
    ) : (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          width: '100%',
          overflowX: 'auto',
          px: 1,
          pb: 30
        }}
      >
        {grades.map((grade, i) => (
          <GradeCol key={i} grade={grade} />
        ))}
      </Box>
    )
  }

  return <NoData />
}

const GradeCol = ({ grade }) => {
  const [show, setShow] = useState(true)
  useEffect(() => {
    // setInterval(() => {
    //   if (show === true) {
    //     setShow(false)
    //   } else {
    //     setShow(true)
    //   }
    // }, 5000)
  }, [])
  const [students, setStudents] = useState([])
  const [requests] = useRequests()

  useEffect(() => {
    getStudents(grade.id).then(res => {
      if (res.success) {
        setStudents(res.students)
      }
    })
  }, [grade])

  return (
    <Box sx={{ maxWidth: '190px', height: 'auto', mr: '13px' }}>
      <GradeColHeader grade={grade} />
      {/* {students.map((student, index) => (
        <GradeColBody key={index} student={student} />
      ))} */}
      {show === true ? (
        <>
          {students.map((student, index) => (
            <GradeColBody key={index} student={student} />
          ))}
        </>
      ) : null}
    </Box>
  )
}

const GradeColHeader = ({ grade }) => {
  return (
    <Box sx={{ position: 'sticky', top: 0, mt: 7 }}>
      <Typography
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '190px',
          minHeight: '42px',
          background: theme => theme.palette.primary.main,
          borderRadius: '6px',
          color: 'white'
        }}
        variant='body2'
      >
        {grade.name}
      </Typography>
    </Box>
  )
}

const DURATION = 90

const GradeColBody = ({ student }) => {
  const [request, setRequest] = useState()
  const [socket] = useSocket()
  const [timer, setTimer] = useState(DURATION)
  const [requests] = useRequests()
  // useEffect(() => {
  //   if (socket) {
  //     socket.on('_new_request', data => {
  //       console.log('[TEACHER] New Request: ', data)
  //       if (requests) {
  //         setRequests([data, ...requests])
  //       } else {
  //         setRequests(data)
  //       }
  //     })
  //   }
  // }, [socket])
  useEffect(() => {
    if (requests) {
      const existing = requests.find(r => r.studentId == student.id)
      if (existing) {
        setRequest(existing)

        let seconds =
          DURATION - Math.floor(Math.abs(new Date().getTime() - new Date(existing.requestTime).getTime()) / 1000)
        setTimer(seconds)
      }
    }
  }, [requests])

  const updateRequestStatus = () => {
    setRequest({ ...request, status: 1 })
  }

  if (request) {
    switch (request.status) {
      case 0:
        return (
          <StudentCardRequested
            student={student}
            requestId={request.id}
            requestTime={request.requestTime}
            timer={timer}
            setTimer={setTimer}
            isTimedOut={timer <= 0}
            updateRequestStatus={updateRequestStatus}
          />
        )
      case 1:
        return <StudentCardConfirmed student={student} />
      case 2:
        return <StudentCardApproved student={student} />
      default:
        return <></>
    }
  } else {
    return <StudentCardDisabled student={student} />
  }
}

const TEMP_IMG =
  'https://images.unsplash.com/photo-1560785496-3c9d27877182?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80'

const StudentCardRequested = ({ student, requestId, updateRequestStatus, timer, setTimer, isTimedOut }) => {
  const [socket] = useSocket()

  const [timerInterval, setTimerInterval] = useState(null)

  useEffect(() => {
    if (!timerInterval) {
      var interval = setInterval(() => {
        if (timer >= 0) setTimer(t => t - 1)
        else clearInterval(interval)
      }, 1000)

      setTimerInterval(interval)
    }

    return () => {
      if (timerInterval) {
        clearInterval(timerInterval)
      }
    }
  }, [])

  const approveRequest = () => {
    alert('Approving Student ' + student.id)

    // Emit an event
    socket.emit('_approve_request', { requestId })

    updateRequestStatus()
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: 'auto',
        boxShadow: '2px 2px 10px -7px black',
        border: '2px solid #2f4d33',
        borderRadius: '10px',
        transition: '0.25s all ease-in-out',

        p: 2,
        mt: 1
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ width: '50px', height: '50px', minWidth: '50px', overflow: 'hidden', borderRadius: 1 }}>
          <img
            src={student.profileUrl || TEMP_IMG.src || TEMP_IMG}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            alt={student.name}
          />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end', flexDirection: 'column' }}>
          {isTimedOut ? (
            <Typography
              component='span'
              sx={{
                color: 'red',
                textTransform: 'uppercase',
                fontSize: '16px',
                mr: 2,
                fontWeight: 'bold',
                textAlign: 'center'
              }}
            >
              Timed <br /> Out
            </Typography>
          ) : (
            <>
              <Typography component='span' sx={{ color: '#ffbd1d', fontSize: '26px', fontWeight: 'bold' }}>
                {timer}
              </Typography>
              <Typography component='span' sx={{ fontSize: '13px', color: 'black' }}>
                Secs Left
              </Typography>
            </>
          )}
        </Box>
      </Box>

      <Box sx={{ fontSize: '16px', fontWeight: 'bold', lineHeight: 1, my: 4 }}>{student.name}</Box>

      <Box
        sx={{
          width: '170px',
          height: '38px',
          background: 'transparent linear-gradient(102deg, #067a25 0%, #2f4d33 100%) 0% 0% no-repeat padding-box',
          boxShadow: '0px 3px 6px #00000029',
          borderRadius: '5px',
          color: 'white',
          cursor: 'pointer',
          transition: '0.25s all ease-in-out',

          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',

          '&:hover': {
            background: 'transparent linear-gradient(102deg, #2f4d33 0%, #067a25 100%) 0% 0% no-repeat padding-box'
          }
        }}
        onClick={approveRequest}
      >
        CONFIRM
      </Box>
    </Box>
  )
}

const StudentCardDisabled = ({ student }) => {
  return (
    <Box sx={{ p: 2, mt: 4, border: '1px solid grey', borderRadius: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
        <Box sx={{ width: '50px', height: '50px', minWidth: '50px', overflow: 'hidden', borderRadius: 1 }}>
          <img
            src={student.profileUrl || TEMP_IMG.src || TEMP_IMG}
            alt={student.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Box>
        <Box sx={{ ml: 2 }}>{student.name}</Box>
      </Box>
      <Tooltip title='Waiting for Request'>
        <Box
          sx={{
            width: '170px',
            height: '38px',
            boxShadow: '0px 3px 6px #00000029',
            borderRadius: '5px',
            background: 'grey',
            color: 'white',
            transition: '0.25s all ease-in-out',

            cursor: 'not-allowed',
            userSelect: 'none',

            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',

            mt: 3
          }}
          disabled
        >
          CONFIRM
        </Box>
      </Tooltip>
    </Box>
  )
}

const StudentCardConfirmed = ({ student }) => {
  return (
    <Box sx={{ p: 2, mt: 4, border: '1px solid grey', borderRadius: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
        <Box sx={{ width: '50px', height: '50px', minWidth: '50px', overflow: 'hidden', borderRadius: 1 }}>
          <img
            src={student.profileUrl || TEMP_IMG.src || TEMP_IMG}
            alt={student.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Box>
        <Box sx={{ ml: 2 }}>{student.name}</Box>
      </Box>
      <Box>
        <Typography variant='body1' sx={{ mt: 2, fontSize: 13 }}>
          Status:&nbsp;
          <Tooltip placement='right' title='Student has been sent.'>
            <Typography component='span' sx={{ color: '#2f4d33', fontWeight: 'bold', fontSize: 15 }}>
              Sent
            </Typography>
          </Tooltip>
        </Typography>
      </Box>
    </Box>
  )
}

const StudentCardApproved = ({ student }) => {
  return (
    <Box sx={{ p: 2, mt: 4, border: '1px solid grey', borderRadius: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
        <Box sx={{ width: '50px', height: '50px', minWidth: '50px', overflow: 'hidden', borderRadius: 1 }}>
          <img
            src={student.profileUrl || TEMP_IMG.src || TEMP_IMG}
            alt={student.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Box>
        <Box sx={{ ml: 2 }}>{student.name}</Box>
      </Box>
      <Box>
        <Typography variant='body1' sx={{ mt: 2, fontSize: 13 }}>
          Status:&nbsp;
          <Tooltip placement='right' title='Parent has confirmed the request!'>
            <Typography component='span' sx={{ color: '#2f4d33', fontWeight: 'bold', fontSize: 15 }}>
              Confirmed
            </Typography>
          </Tooltip>
        </Typography>
      </Box>
    </Box>
  )
}

export default RequestsBody
