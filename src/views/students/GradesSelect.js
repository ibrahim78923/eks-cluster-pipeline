import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Box from '@mui/material/Box'
import { useEffect, useState } from 'react'

import {getByCampusId} from 'src/services/grade.service'
import { useAuth } from 'src/hooks/useAuth'

const GradeSelect = ({ grade, setGrade, campus }) => {
  const [grades, setGrades] = useState([])
  const [isLoading, setLoading] = useState([])

  const auth = useAuth()

  useEffect(() => {
    setLoading(true)
    const fn = async () => {
      const response = await getByCampusId(campus)
      setLoading(false)

      if (response.success) {
        setGrades(response.grades)
      }
    }

    fn()
  }, [campus])

  useEffect(() => {
    const firstgrade = grades[0]
    if (firstgrade) setGrade(firstgrade.id)
  }, [grades])

  return (
    <Box sx={{ width: '100%' }}>
      <FormControl fullWidth>
        <InputLabel id='demo-simple-select-label'>Grade</InputLabel>
        {isLoading || (
          <Select size="small" value={grade || ''} label='g' onChange={e => setGrade(e.target.value)}>
            {grades.map(s => {
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

export default GradeSelect
