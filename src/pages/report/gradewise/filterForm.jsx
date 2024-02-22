import React, { useState, useEffect } from 'react'
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { getBySchoolId } from 'src/services/grade.service'

import { formatYYYYMMDD } from 'src/utiles/utiles'
import { DatePicker, Spin } from 'antd'
import { toast } from 'react-hot-toast'

const { RangePicker } = DatePicker

const FilterForm = ({ schools, handleSend, settings, setGradeWise }) => {
  const [schoolId, setSchoolId] = useState('')
  const [grade, setGrade] = useState('')
  const [grades, setGrades] = useState([])
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [dataValue, setDateValue] = useState(null);

  const handleSubmit = event => {
    event.preventDefault()
    if (schoolId) {
      if (startDate && endDate) {
        handleSend(grade, startDate, endDate)
      } else {
        toast.error('Please Select Date')
      }
    } else {
      toast.error('Please Select School&Grade')
    }
  }

  const [isLoading, setLoading] = useState(false)
  const startLoading = () => {
    //NProgress.start()
    setLoading(true)
  }

  const endLoading = () => {
    //NProgress.done()
    setLoading(false)
  }

  useEffect(() => {
    fetchGrades(schoolId)
  }, [schoolId])

  const fetchGrades = async schoolId => {
    startLoading()
    const data = await getBySchoolId(schoolId)

    endLoading()
    if (data?.success) setGrades(data?.grades)
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
  const reset = ()=> {
    setSchoolId("")
    setGrade("")
    setStartDate("")
    setEndDate("")
    setGrades([])
    setDateValue(null)
    setGradeWise([])
  }


  return (
    <Spin spinning={isLoading}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 20 }}>
          <FormControl style={{ width: 180 }}>
            <InputLabel id='school-name-grade'>School Name</InputLabel>
            <Select
              value={schoolId}
              labelId='school-name-grade'
              label='School Name'
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

          <FormControl>
            <InputLabel id='grade-name'>Grade</InputLabel>
            <Select value={grade} labelId='grade-name' label='Grade' onChange={event => setGrade(event.target.value)}>
              {grades?.map((elements, index) => {
                return (
                  <MenuItem key={index} value={elements?.id}>
                    {elements?.name}
                  </MenuItem>
                )
              })}
            </Select>
          </FormControl>

          <RangePicker
          size='large'
          format={'DD-MM-YYYY'}
          className={settings?.mode.includes('dark') ? 'ant_date_place' : ''}
          onChange={handleDateChange}
          value={dataValue}
          style={{ backgroundColor: 'transparent', height: 57, color: 'grey' }}
        />
        </div>

        <div style={{display: "flex"}}>
        {(schoolId || grade || dataValue) &&
        <Button variant="outlined" color="primary" style={{marginRight: 10}} onClick={reset}>
          Clear
        </Button>
        }
        <Button type="submit" variant="contained" color="primary">
          Search
        </Button>
        </div>
      </form>
    </Spin>
  )
}

export default FilterForm
