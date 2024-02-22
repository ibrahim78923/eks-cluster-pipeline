import { useEffect, useState } from 'react'
import authConfig from 'src/configs/auth'
import { useAuth } from './useAuth'

const useRole = () => {
  const [role, setRole] = useState()

  const auth = useAuth()

  useEffect(() => {
    if (auth.user.role === 'admin') setRole('Super Admin')
    else {
      const existing = authConfig.roles.find(r => r.name === auth.user.role)
      if (existing) {
        setRole(existing.displayName)
      }
    }
  }, [])

  return role
}

export default useRole
