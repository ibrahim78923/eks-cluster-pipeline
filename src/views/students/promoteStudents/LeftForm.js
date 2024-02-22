import React, { useState, useEffect } from 'react'
import { Button, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material'
import { getBySchoolId, getPromoteGrades } from 'src/services/grade.service'

import { getByGradeId } from 'src/services/student.service'

import { toast } from 'react-hot-toast'
import LeftStudentList from './LeftStudentList'

const LeftForm = ({
  schools,
  gradeStudent,
  setGradeSchool,
  selectedSchoolTo,
  selectedGradeTo,
  setLoading,
  isLoading,
  fetchStudentTo,
  onComplete
}) => {
  const [schoolId, setSchoolId] = useState('')
  const [grade, setGrade] = useState('')
  const [grades, setGrades] = useState([])
  const [selectStudents, setSelectedStudents] = useState([])

  const handleSubmit = async event => {
    event.preventDefault()
    setLoading(true)
    const result = await getPromoteGrades(grade, schoolId, selectedGradeTo, selectedSchoolTo, selectStudents)

    if (result?.success) {
      toast.success('Done Successfully')
      fetchStudentName(grade)
      fetchStudentTo(selectedGradeTo)
      // onComplete()
      setLoading(false)
    } else {
      toast.error('Server Error')
    }
  }

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

  const fetchStudentName = async grade => {
    startLoading()
    const data = await getByGradeId(grade)
    if (data?.success) setGradeSchool(data?.students)
    endLoading()
  }

  useEffect(() => {
    fetchStudentName(grade)
  }, [grade])

  const reset = () => {
    setSchoolId('')
    setGrade('')

    setGrades([])
    setGradeSchool([])
  }

  return (
    <>
      <Typography sx={{ textAlign: 'center', marginBottom: 5 }}>Promote From</Typography>
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', gap: 20 }}
      >
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
            {grades?.map((elements, index) => {
              return (
                <MenuItem key={index} value={elements?.id}>
                  {elements?.name}
                </MenuItem>
              )
            })}
          </Select>
        </FormControl>
        {gradeStudent?.length > 0 && (
          <LeftStudentList checked={selectStudents} setChecked={setSelectedStudents} students={gradeStudent || []} />
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <Button variant='outlined' color='primary' style={{ marginRight: 10, bottom: 0 }} onClick={onComplete}>
            Close
          </Button>
          <Button
            type='submit'
            variant='contained'
            color='primary'
            disabled={!selectStudents?.length || !selectedGradeTo}
          >
            Promote
          </Button>
        </div>
      </form>
    </>
  )
}

export default LeftForm
