// Exports
import { createContext, useContext, useState } from 'react'
import React, { useEffect } from 'react'
import { getAllRequests } from 'src/services/grade.service'
import { useAuth } from 'src/hooks/useAuth'

// Create a Socket Context
const RequestContext = createContext()

// Create a Socket Provider Wrapper
const RequestProvider = ({ children }) => {
  const [requests, setRequests] = useState([])
  const auth = useAuth()
  
  function parseJwt(token) {
    if(token){
    var base64Payload = token?.split('.')[1];
    var payload = Buffer.from(base64Payload, 'base64');
    return JSON.parse(payload?.toString());
    }
  }
    const base64Url = window.localStorage.getItem('aliasToken');
    let jwtToken = parseJwt(base64Url);
     
  useEffect(()=> {
    // getAllRequests(auth.user.role === "teacher"? jwtToken?.id :auth.user.id).then(res => {
    //   if (res?.success) {
    //     const today = new Date().toISOString().slice(0, 10);
    //     const newRequestData = res?.requests?.filter(item => item.createdAt.slice(0, 10) === today);
    //     setRequests(newRequestData);
    //   }
    // })
  }, [])
  return <RequestContext.Provider value={[requests, setRequests]}>{children}</RequestContext.Provider>
}

// Create a Socket Consumer Hook
const useRequests = () => {
  const [requests, setRequests] = useContext(RequestContext)
  return [requests, setRequests]
}

// Exports
export { RequestProvider, useRequests }
