import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import Chip from '@mui/material/Chip'
import { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { getByCampusId, getBySchoolId } from '../../services/grade.service'
import { Spin } from 'antd'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
}

const grades = [
  { id: 1, name: 'A' },
  { id: 2, name: 'B' },
  { id: 3, name: 'C' }
]

function getStyles(theme) {
  return {
    fontWeight: theme.typography.fontWeightRegular
  }
}

const GradeSelect = ({ selectedGrade, setSelectedGrade, school }) => {
  const theme = useTheme()

  const [grades, setGrades] = useState([])
  const [isLoading, setLoading] = useState([])

  const auth = useAuth()

  useEffect(() => {
    setLoading(true)
    const fn = async () => {
      const response = await getBySchoolId(school)
      setLoading(false)

      if (response.success) {
        setGrades(response.grades)
      }
    }

    fn()
  }, [school])

  const handleChange = event => {
    const {
      target: { value }
    } = event
    setSelectedGrade(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    )
  }

  return (
    <Spin spinning={isLoading}>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id='demo-multiple-chip-label'>Grades</InputLabel>
        <Select
          labelId='demo-multiple-chip-label'
          id='demo-multiple-chip'
          multiple
          value={selectedGrade || []}
          onChange={handleChange}
          input={<OutlinedInput id='select-multiple-chip' label='Grades' />}
          renderValue={selected => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map(selectedId => {
                const grade = grades.find(n => selectedId === n.id)
                if (grade) {
                  return <Chip key={grade.id} label={grade.name} />
                }
              })}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {grades.map(grade => (
            <MenuItem key={grade.id} value={grade.id} style={getStyles(theme)}>
              {grade.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Spin>
  )
}

export default GradeSelect
