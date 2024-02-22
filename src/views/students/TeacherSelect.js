import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Box from '@mui/material/Box'
import { useEffect, useState } from 'react'

import { getByGradeId } from 'src/services/teacher.service'
import { useAuth } from 'src/hooks/useAuth'

const TeacherSelect = ({ teacher, setTeacher, grade }) => {
  const [teachers, setTeachers] = useState([])
  const [isLoading, setLoading] = useState([])

  const auth = useAuth()

  useEffect(() => {
    setLoading(true)
    const fn = async () => {
      const response = await getByGradeId(grade)
      console.log(response)
      setLoading(false)
      if (response.success) {
        setTeachers(response.teachers)
      }
    }

    fn()
  }, [grade])

  useEffect(
    () => {
      console.log(teachers)
    }, [teachers]
  )

  useEffect(() => {
    const firstteacher = teachers[0]
    if (firstteacher) setTeacher(firstteacher.id)
  }, [grade])

  return (
    <Box sx={{ width: '100%' }}>
      <FormControl fullWidth>
        <InputLabel id='demo-simple-select-label'>Teacher</InputLabel>
        {isLoading || (
          <Select size="small" value={teacher || ''} label='g' onChange={e => setTeacher(e.target.value)}>
            {teachers.map(s => {
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

export default TeacherSelect
