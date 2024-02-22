// Exports
import { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'

// Create a Socket Context
const SocketContext = createContext()

// Create a Socket Provider Wrapper
const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')

    const s = io(process.env.NEXT_PUBLIC_SOCKET_URL, { auth: { token, role: 'CLIENT' } })

    setSocket(s)

    return () => {
      s.close()
    }
  }, [])

  return <SocketContext.Provider value={[socket, setSocket]}>{children}</SocketContext.Provider>
}

// Create a Socket Consumer Hook
const useSocket = () => {
  const [socket, setSocket] = useContext(SocketContext)
  return [socket, setSocket]
}

// Exports
export { SocketProvider, useSocket }
