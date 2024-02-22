import React, { useState, useEffect } from 'react'
import { FormControl, InputLabel, MenuItem, Select, Button } from '@mui/material'
import { getBySchoolId } from 'src/services/grade.service'
import { Spin } from 'antd'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 7 + ITEM_PADDING_TOP,
      width: 200,
      borderRadius: 10,
      marginTop: 5
    }
  }
}
const FilterForm = ({ schools, schoolId, setSchoolId, gradeId, setGradeId }) => {
  const [grades, setGrades] = useState([])

  const [isLoading, setLoading] = useState(false)
  const startLoading = () => {
    setLoading(true)
  }

  const endLoading = () => {
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

  const reset = () => {
    setSchoolId('')
    setGradeId('')
    setGrades([])
  }

  return (
    <Spin spinning={isLoading}>
      <div style={{ display: 'flex', gap: 30, padding: 10 }}>
        <FormControl style={{ width: '50%' }}>
          <InputLabel id='school-name-grade'>Select School</InputLabel>
          <Select
            value={schoolId}
            labelId='school-name-grade'
            label='Select School'
            MenuProps={MenuProps}
            onChange={event => setSchoolId(event.target.value)}
          >
            {schools?.map((elements, index) => {
              return (
                <MenuItem sx={{ height: 30, padding: 2, ml: 3, mr: 3 }} key={index} value={elements?.id}>
                  {elements?.name}
                </MenuItem>
              )
            })}
          </Select>
        </FormControl>

        <FormControl style={{ width: '50%' }}>
          <InputLabel id='grade-name'>Select Grade</InputLabel>
          <Select
            value={gradeId}
            labelId='grade-name'
            label='Select Grade'
            MenuProps={MenuProps}
            onChange={event => setGradeId(event.target.value)}
          >
            {grades?.map((elements, index) => {
              return (
                <MenuItem sx={{ height: 30, padding: 2, ml: 3, mr: 3 }} key={index} value={elements?.id}>
                  {elements?.name}
                </MenuItem>
              )
            })}
          </Select>
        </FormControl>
        {(gradeId || schoolId) && (
          <Button onClick={reset} variant='outlined' color='primary' style={{ float: 'right' }}>
            Clear
          </Button>
        )}
      </div>
    </Spin>
  )
}

export default FilterForm
