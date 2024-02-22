import React, { useEffect, useState } from 'react'
import { Box } from '@mui/material'

import { useAuth } from 'src/hooks/useAuth'
import { getClientId } from 'src/services/grade.service'
import { RequestProvider, useRequests } from '/src/context/requests'
import { RequestsBody } from 'src/views/teacherRequests/sentRequests'
import { SocketProvider, useSocket } from 'src/context/socket/teacherSocket'

const SentRequests = props => {
  return (
    <RequestProvider>
      <SocketProvider>
        <Main {...props} />
      </SocketProvider>
    </RequestProvider>
  )
}

const Main = () => {
  const [socket] = useSocket()
  const auth = useAuth()
  const [requests, setRequests] = useRequests()
  const [grades, setGrades] = useState([])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Reload or fetch new data here
        location.reload()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  useEffect(() => {
    if (socket) {
      // Attach events to the Socket
      socket.on('connect', () => {
        console.log('Connected to Socket Server')
      })

      socket.on('disconnect', () => {
        console.log('Disconnected from Socket Server')
      })
      socket.on('_teacher_requests', data => {
        const today = new Date().toISOString().slice(0, 10)
        const newRequestData = data
          ?.filter(item => item.createdAt.slice(0, 10) === today && item.status === 1)
          ?.sort((x, y) => Number(new Date(y.requestTime)) - Number(new Date(x.requestTime)))
        console.log(newRequestData, '[CLIENT] Existing Requests: ', data)
        setRequests(newRequestData)
      })

      socket.on('_new_request', data => {
        console.log('[CLIENT] New Request: ', data)

        // Check if there are any existing requests
        setRequests(prevData => {
          console.log(prevData, 'prevData')
          if (prevData?.length) {
            const existing_request = prevData.find(r => r.studentId === data.studentId)

            if (existing_request) {
              // Replace the existing request's values with new ones
              const updatedRequests = prevData.map(r => (r.id === data.id ? data : r))

              // Update the requests

              return updatedRequests?.sort((x, y) => Number(new Date(y.requestTime)) - Number(new Date(x.requestTime)))
            } else {
              // Add the new request to the requests object.
              return [...prevData, data]?.sort(
                (x, y) => Number(new Date(y.requestTime)) - Number(new Date(x.requestTime))
              )
            }
          } else {
            return [...prevData, data]?.sort(
              (x, y) => Number(new Date(y.requestTime)) - Number(new Date(x.requestTime))
            )
          }
        })
      })

      socket.on('_confirmed_request', data => {
        console.log('[TEACHER] Confirmed Request: ', data)
        //Check if there are any existing requests
        setRequests(prevData => {
          console.log(prevData, 'prevData')
          if (prevData?.length) {
            const existing_request = prevData.find(r => r.id === data.id)

            if (existing_request) {
              // Replace the existing request's values with new ones
              const updatedRequests = prevData.map(r => (r.id === data.id ? data : r))

              // Update the requests
              return updatedRequests
            } else {
              // Add the new request to the requests object.
              return [...prevData, data]
            }
          } else {
            return [...prevData, data]
          }
        })
      })
    }
  }, [socket])

  useEffect(() => {
    getClientId(auth.user.id).then(res => {
      if (res?.success) {
        setGrades(res?.teacher?.grades)
      }
    })
  }, [auth.user.id])

  return (
    <Box>
      <RequestsBody grades={grades} />
    </Box>
  )
}

export default SentRequests
