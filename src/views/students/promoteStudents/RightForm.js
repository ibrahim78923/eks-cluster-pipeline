import React, { useState, useEffect } from 'react'
import { FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material'
import { getBySchoolId } from 'src/services/grade.service'

import RightStudentList from './RightStudentList'

const RightForm = ({ schools, setGrade, grade, setSchoolId, schoolId, fetchStudentName, students, setLoading }) => {
  const [grades, setGrades] = useState([])

  const startLoading = () => {
    setLoading(true)
  }
  const endLoading = () => {
    setLoading(false)
  }
  const fetchGrades = async schoolId => {
    startLoading()
    const data = await getBySchoolId(schoolId)
    if (data?.success) setGrades(data?.grades)
    endLoading()
  }
  useEffect(() => {
    fetchGrades(schoolId)
  }, [schoolId])

  useEffect(() => {
    fetchStudentName(grade)
  }, [grade])

  return (
    <>
      <Typography sx={{ textAlign: 'center', marginBottom: 5 }}>Promote To</Typography>
      <form style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', gap: 20 }}>
        <FormControl fullWidth>
          <InputLabel id='demo-simple-select-label'>Select School</InputLabel>
          <Select
            labelId='demo-simple-select-label'
            value={schoolId}
            label='Select School'
            onChange={event => setSchoolId(event.target.value)}
          >
            {schools?.map((elements, index) => {
              return (
                <MenuItem key={index} value={elements?.id}>
                  {elements?.name}
                </MenuItem>
              )
            })}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id='grade-select'>Select Grade</InputLabel>
          <Select
            labelId='grade-select'
            value={grade}
            label='Select Grade'
            onChange={event => setGrade(event.target.value)}
          >
            {grades.map((elements, index) => {
              return (
                <MenuItem key={index} value={elements?.id}>
                  {elements?.name}
                </MenuItem>
              )
            })}
          </Select>
        </FormControl>

        {students?.length > 0 && <RightStudentList students={students || []} />}
      </form>
    </>
  )
}

export default RightForm
