import React from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { TextField, FormControl, FormControlLabel, Checkbox, Button, Box, IconButton, Tooltip } from '@mui/material'
import Switch from '@mui/material/Switch'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'

const validationSchema = yup.object().shape({
  startTime: yup.string().required('Start time is required'),
  offTime: yup.string().required('Off time is required')
})

export default function InlineForm({ item, key, setGradeTime, isDetail }) {
  const [checked, setChecked] = React.useState(item?.isActive)
  const [startTime, setStartTime] = React.useState(item?.startTime)
  const [offTime, setOffTime] = React.useState(item?.offTime)
  const [day, setDay] = React.useState(item?.day)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid }
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(validationSchema)
    // defaultValues: {
    //   day: item?.day,
    //   startTime:  item?.startTime,
    //   offTime: item?.offTime,
    //   switch: item?.isActive,
    // },
  })

  const onSubmit = data => {
    let obj = { ...data }
    obj.isActive = !checked
    obj.startTime = startTime
    obj.offTime = offTime
    obj.day = day

    console.log(obj, 'objjjj')
    setGradeTime(prevData =>
      prevData.map(item => {
        if (item.day === obj.day) {
          return { ...item, ...obj }
        }
        return item
      })
    )
  }

  const handleChange = event => {
    setChecked(event.target.checked)
    let obj = {}
    obj.isActive = event.target.checked
    setGradeTime(prevData =>
      prevData.map(item => {
        if (item.day === day) {
          return { ...item, ...obj }
        }
        return item
      })
    )
  }
  const handleChangeStartTime = (event, day) => {
    setStartTime(event.target.value)
    let obj = {}
    obj.startTime = event.target.value
    setGradeTime(prevData =>
      prevData.map(item => {
        if (item.day === day) {
          return { ...item, ...obj }
        }
        return item
      })
    )
  }
  const handleChangeOffTime = event => {
    setOffTime(event.target.value)
    let obj = {}
    obj.offTime = event.target.value
    setGradeTime(prevData =>
      prevData.map(item => {
        if (item.day === day) {
          return { ...item, ...obj }
        }
        return item
      })
    )
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ display: 'flex', gap: '10px', flexDirection: 'column', marginBottom: 10 }}
      key={item.id}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
        <div>
          <FormControl error={!!errors.day} style={{marginTop: 15}}>
            <TextField
              {...register('day')}
              label='Day'
              variant='outlined'
              error={!!errors.day}
              helperText={errors.day?.message}
              style={{ width: 120 }}
              disabled={true}
              value={day}
            />
          </FormControl>
        </div>
        <div style={{ display: 'flex', gap: '5px', marginTop: 15}}>
          <FormControl error={!!errors.startTime}>
            <TextField
              {...register('startTime')}
              label='Start Time'
              variant='outlined'
              error={!!errors.startTime}
              helperText={errors.startTime?.message}
              style={{ width: 160 }}
              type='time'
              disabled={!checked || isDetail}
              value={startTime}
              onChange={e => handleChangeStartTime(e, item?.day)}
            />
          </FormControl>
          <FormControl error={!!errors.offTime}>
            <TextField
              {...register('offTime')}
              label='Off Time'
              variant='outlined'
              error={!!errors.offTime}
              helperText={errors.offTime?.message}
              style={{ width: 160 }}
              type='time'
              disabled={!checked || isDetail}
              onChange={handleChangeOffTime}
              value={offTime}
            />
          </FormControl>
        </div>
        <div>
          <Tooltip title='Status'>
            <Checkbox
              checked={checked}
              style={{ paddingLeft: 15 }}
              disabled={isDetail}
              onChange={handleChange}
              inputProps={{ 'aria-label': 'controlled' }}
              // icon={<CloseOutlined style={{ fontSize: 25, color: "red" }} />}
              // checkedIcon={<CheckOutlined style={{ fontSize: 25, color: "green" }} />}
            />
          </Tooltip>
        </div>
      </div>
    </form>
  )
}
