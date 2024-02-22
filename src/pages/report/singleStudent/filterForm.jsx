import React, { useState, useEffect } from 'react'
import { Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { getBySchoolId } from 'src/services/grade.service'
import { getByGradeId } from 'src/services/student.service'

import { formatYYYYMMDD } from 'src/utiles/utiles'
import { DatePicker, Spin } from 'antd'
import { toast } from 'react-hot-toast'

const { RangePicker } = DatePicker

const FilterForm = ({ schools, handleSend, settings, setSingleStudent }) => {
  const [schoolId, setSchoolId] = useState('')
  const [grade, setGrade] = useState('')
  const [studentId, setStudentName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [dataValue, setDateValue] = useState(null)
  const [endDate, setEndDate] = useState('')

  const [grades, setGrades] = useState([])
  const [gradeStudent, setGradeSchool] = useState([])

  const handleSubmit = event => {
    event.preventDefault()
    if (studentId) {
      if (startDate && endDate) {
        handleSend(studentId, startDate, endDate)
      } else {
        toast.error('Please Select Date')
      }
    } else {
      toast.error('Please Select Student')
    }
  }

  const [isLoading, setLoading] = useState(true)
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

  const fetchStudentName = async grade => {
    startLoading()
    const data = await getByGradeId(grade)
    if (data?.success) setGradeSchool(data?.students)
    endLoading()
  }
  const handleDateChange = date => {
    setDateValue(date)
    if (date) {
      setStartDate(formatYYYYMMDD(date[0]?.$d))
      setEndDate(formatYYYYMMDD(date[1]?.$d))
    } else {
      setStartDate('')
      setEndDate('')
    }
  }
  const reset = () => {
    setSchoolId('')
    setGrade('')
    setStudentName('')
    setStartDate('')
    setEndDate('')
    setGrades([])
    setGradeSchool([])
    setDateValue(null)
    setSingleStudent([])
  }

  return (
    <Spin spinning={isLoading}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
          <FormControl>
            <InputLabel id='demo-simple-select-label'>School</InputLabel>
            <Select
              labelId='demo-simple-select-label'
              value={schoolId}
              label='School'
              onChange={event => setSchoolId(event.target.value)}
            >
              {schools.map((elements, index) => {
                return (
                  <MenuItem key={index} value={elements?.id}>
                    {elements?.name}
                  </MenuItem>
                )
              })}
            </Select>
          </FormControl>

          <FormControl>
            <InputLabel id='grade-select'>Grade</InputLabel>
            <Select labelId='grade-select' value={grade} label='Grade' onChange={event => setGrade(event.target.value)}>
              {grades.map((elements, index) => {
                return (
                  <MenuItem key={index} value={elements?.id}>
                    {elements?.name}
                  </MenuItem>
                )
              })}
            </Select>
          </FormControl>

          <FormControl>
            <InputLabel id='student-select'>Student</InputLabel>
            <Select
              labelId='student-select'
              value={studentId}
              label='Student'
              onChange={event => setStudentName(event.target.value)}
            >
              {gradeStudent.map((elements, index) => {
                return (
                  <MenuItem key={index} value={elements?.id}>
                    {elements?.name}
                  </MenuItem>
                )
              })}
            </Select>
          </FormControl>
          <RangePicker
            size='small'
            format={'DD-MM-YYYY'}
            className={settings?.mode.includes('dark') ? 'ant_date_place' : ''}
            onChange={handleDateChange}
            value={dataValue}
            style={{ backgroundColor: 'transparent', height: 57, placeContent: 'white' }}
          />
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {(schoolId || grade || studentId || dataValue) && (
            <Button variant='outlined' color='primary' style={{ marginRight: 10 }} onClick={reset}>
              Clear
            </Button>
          )}
          <Button type='submit' variant='contained' color='primary'>
            Search
          </Button>
        </div>
      </form>
    </Spin>
  )
}

export default FilterForm
