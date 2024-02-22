import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Box from '@mui/material/Box'
import { useEffect, useState } from 'react'

import { getByClientId } from 'src/services/school.service'
import { useAuth } from 'src/hooks/useAuth'

const SchoolSelect = ({ school, setSchool }) => {
  const [schools, setSchools] = useState([])
  const [isLoading, setLoading] = useState([])

  const auth = useAuth()

  useEffect(() => {
    setLoading(true)
    const fn = async () => {
      const response = await getByClientId(auth.user.id)
      setLoading(false)

      if (response.success) {
        setSchools(response.schools)
      }
    }

    fn()
  }, [])

  useEffect(() => {
    const firstSchool = schools[0]
    if (firstSchool) setSchool(firstSchool.id)
  }, [schools])

  return (
    <Box sx={{ width: '100%' }}>
      <FormControl fullWidth>
        <InputLabel id='demo-simple-select-label'>School</InputLabel>
        {isLoading || (
          <Select value={school || ''} label='School' onChange={e => setSchool(e.target.value)}>
            {schools.map(s => {
              return (
                <MenuItem key={s.id} value={s.id}>
                  {s.name}
                </MenuItem>
              )
            })}
          </Select>
        )}
      </FormControl>
    </Box>
  )
}

export default SchoolSelect
