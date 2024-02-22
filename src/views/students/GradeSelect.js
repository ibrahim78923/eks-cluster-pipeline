import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Box from '@mui/material/Box'
import { useEffect, useState } from 'react'

import { getBySchoolId } from 'src/services/grade.service'
import { useAuth } from 'src/hooks/useAuth'
import { Spin } from 'antd'

const GradesSelect = ({ grade, setGrade, school }) => {
  const [grades, setGrades] = useState([])
  const [isLoading, setLoading] = useState(false)

  const auth = useAuth()

  useEffect(() => {
    setLoading(true)
    const fn = async () => {
      const response = await getBySchoolId(school)
      setLoading(false)

      if (response?.success) {
        setGrades(response?.grades)
      }
    }

    fn()
  }, [school])

  useEffect(() => {
    const firstGrades = grades[0]
    if (firstGrades) setGrade(firstGrades.id)
  }, [grades])

  return (
    <Box sx={{ width: '100%' }}>
      <Spin spinning={isLoading}>
        <FormControl fullWidth>
          <InputLabel id='demo-simple-select-label'>Grades</InputLabel>
          {grades && (
            <Select
              size='small'
              value={grade || ''}
              labelId='demo-simple-select-label'
              label='Grades'
              onChange={e => setGrade(e.target.value)}
            >
              {grades?.map(s => {
                return (
                  <MenuItem key={s.id} value={s.id}>
                    {s.name}
                  </MenuItem>
                )
              })}
            </Select>
          )}
        </FormControl>
      </Spin>
    </Box>
  )
}

export default GradesSelect
