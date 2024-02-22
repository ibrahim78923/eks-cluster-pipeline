import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Box from '@mui/material/Box'
import { useEffect, useState } from 'react'

import { getBySchoolId } from 'src/services/campus.service'
import { useAuth } from 'src/hooks/useAuth'

const CampusSelect = ({ campus, setCampus, school }) => {
  const [campuses, setCampuses] = useState([])
  const [isLoading, setLoading] = useState([])

  const auth = useAuth()

  useEffect(() => {
    setLoading(true)
    const fn = async () => {
      const response = await getBySchoolId(school)
      setLoading(false)

      if (response.success) {
        setCampuses(response.campuses)
      }
    }

    fn()
  }, [school])

  useEffect(() => {
    const firstcampus = campuses[0]
    if (firstcampus) setCampus(firstcampus.id)
  }, [campuses])

  return (
    <Box sx={{ width: '100%' }}>
      <FormControl fullWidth>
        <InputLabel id='demo-simple-select-label'>Campus</InputLabel>
        {isLoading || (
          <Select value={campus || ''} label='Campus' onChange={e => setCampus(e.target.value)}>
            {campuses.map(s => {
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

export default CampusSelect
