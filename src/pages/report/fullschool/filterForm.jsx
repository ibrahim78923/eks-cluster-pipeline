import React, { useState } from 'react'
import { Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material'

import { formatYYYYMMDD } from 'src/utiles/utiles'
import { DatePicker, Spin } from 'antd'
import { toast } from 'react-hot-toast'

const { RangePicker } = DatePicker

const FilterForm = ({ schools, handleSend, settings, setFullSchool }) => {
  const [schoolId, setSchoolId] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [dataValue, setDateValue] = useState(null);

  const handleSubmit = event => {
    event.preventDefault()
    if (schoolId) {
      if (startDate && endDate) {
        handleSend(schoolId, startDate, endDate)
      } else {
        toast.error('Please Select Date')
      }
    } else {
      toast.error('Please Select School')
    }
  }

  const [isLoading, setLoading] = useState(false)

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
    setStartDate("")
    setEndDate("")
    setDateValue(null)
    setFullSchool([])
  }

  return (
    <Spin spinning={isLoading}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 20 }}>
          <FormControl style={{ width: 180 }}>
            <InputLabel id='schoole-djcb'>School Name</InputLabel>
            <Select
              value={schoolId}
              labelId='schoole-djcb'
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
          <RangePicker
          size='large'
          format={'DD-MM-YYYY'}
          className={settings?.mode.includes('dark') ? 'ant_date_place' : ''}
          onChange={handleDateChange}
          value={dataValue}
          style={{ backgroundColor: 'transparent', height: 57, placeContent: 'white' }}
        />
        </div>

        <div style={{display: "flex"}}>
        {(schoolId || dataValue) &&
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
