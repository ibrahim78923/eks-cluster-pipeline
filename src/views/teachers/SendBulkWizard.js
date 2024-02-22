import * as React from 'react'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import { Icon } from '@iconify/react'
import { useAuth } from 'src/hooks/useAuth'
import { Card, Grid, TextField } from '@mui/material'
import { getBySchoolId, postBulkEmail } from 'src/services/teacher.service'
import { getByClientId } from 'src/services/school.service'
import { toast } from 'react-hot-toast'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputLabel from '@mui/material/InputLabel'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
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
function getStyles(name, teachersIds, theme) {
  return {
    fontWeight:
      teachersIds.indexOf(name) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium
  }
}

const steps = ['Select School', 'Select Teacher']

const AddTeacherWizard = ({ onComplete }) => {
  const [activeStep, setActiveStep] = React.useState(0)
  const [skipped, setSkipped] = React.useState(new Set())

  const [selectedSchool, setSelectedSchool] = React.useState(0)

  const isStepOptional = () => false

  const isStepSkipped = step => {
    return skipped.has(step)
  }

  const handleNext = () => {
    let newSkipped = skipped
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values())
      newSkipped.delete(activeStep)
    }

    setActiveStep(prevActiveStep => prevActiveStep + 1)
    setSkipped(newSkipped)
  }

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const handleReset = () => {
    setActiveStep(0)
  }

  const finish = args => {
    handleReset()
    onComplete(args)
  }

  const getComponent = step => {
    switch (step) {
      case 0:
        return <SelectSchool next={handleNext} selected={selectedSchool} setSelected={setSelectedSchool} />
      case 1:
        return <AddTeacher back={handleBack} finish={finish} schoolId={selectedSchool} />
      default:
        return <></>
    }
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Card
        sx={{
          width: '100%',
          py: 3,
          px: 1,
          boxShadow: 1,
          mb: 3
        }}
      >
        <Stepper activeStep={activeStep} sx={{ px: 2 }}>
          {steps.map((label, index) => {
            const stepProps = {}
            const labelProps = {}
            if (isStepOptional(index)) {
              labelProps.optional = <Typography variant='caption'>Optional</Typography>
            }
            if (isStepSkipped(index)) {
              stepProps.completed = false
            }
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            )
          })}
        </Stepper>
      </Card>

      {activeStep === steps.length ? (
        <>
          <Typography sx={{ mt: 2, mb: 1 }}>All steps completed - you&apos;re finished</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </>
      ) : (
        <Box sx={{ p: 2 }}>{getComponent(activeStep)}</Box>
      )}
    </Box>
  )
}

const School = ({ school, selected, setSelected }) => {
  return (
    <Card
      sx={{
        display: 'flex',
        width: '100%',
        minHeight: 50,
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'pointer',
        p: 2,
        my: 1,
        boxShadow: 2,
        transition: '0.25s all ease-in-out',
        background: theme => (selected === school.id ? theme.palette.primary.main : `transparent`),
        color: theme => (selected === school.id ? theme.palette.primary.contrastText : 'auto'),
        border: theme => (selected === school.id ? `1px solid ${theme.palette.primary.main}` : `1px solid transparent`),
        '&:hover': {
          boxShadow: 5
        }
      }}
      onClick={() => setSelected(school.id)}
    >
      <Typography variant='p'>{school.name}</Typography>
      <Icon icon='material-symbols:chevron-right' />
    </Card>
  )
}

const SelectSchool = ({ selected, setSelected, next }) => {
  const [schools, setSchools] = React.useState([])
  const [schoolLoading, setSchoolLoading] = React.useState(false)

  const auth = useAuth()

  React.useEffect(() => {
    const fn = async () => {
      setSchoolLoading(true);
      const data = await getByClientId(auth.user.id)

      if (data.success) {
        setSchools(data.schools)
        setSchoolLoading(false)
        setSelected(data.schools[0]?.id)
      }
    }

    fn()
  }, [])

  return (
    <Spin spinning={schoolLoading}>
      <Typography variant='h6' sx={{ mt: 1, textAlign: 'center' }}>
        Select School
      </Typography>
      <Typography variant='body2' sx={{ textAlign: 'center' }}>
        Please select the school you want to add the grade to
      </Typography>
      <Box
        sx={{
          mt: 3,
          p: 2,
          display: 'flex',
          justifyContent: 'flex-start',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: 250,
          maxHeight: 500,
          overflowY: 'auto'
        }}
      >
        {schools.map((school, i) => (
          <School key={i} school={school} setSelected={setSelected} selected={selected} />
        ))}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'row', mt: 5, justifyContent: 'flex-end' }}>
        <Button variant='contained' onClick={next}>
          Next
        </Button>
      </Box>
    </Spin>
  )
}

const AddTeacher = ({ back, finish, schoolId }) => {
  const [teachers, setTeachers] = React.useState([])
  const [teachersIds, setPersonName] = React.useState([])
  const [checked, setChecked] = React.useState(false)
  const [isLoading, setLoading] = React.useState(false)

  const handleCheckBox = event => {
    setChecked(event.target.checked)
    if (event.target.checked) {
      setPersonName([])
      const newArray = teachers.map(obj => obj.id)
      setPersonName(newArray)
    } else {
      setPersonName([])
    }
  }

  React.useEffect(() => {
    const fn = async () => {
      setLoading(true);
      const data = await getBySchoolId(schoolId)
      if (data.success) {
        setTeachers(data.teachers)
      setLoading(false);
      }
    }

    fn()
  }, [])

  const handleChange = event => {
    const {
      target: { value }
    } = event
    setPersonName(value)
  }

  const addTeacher = async () => {
    let obj = {}
    obj.teacherIds = teachersIds
    setLoading(true);
    const result = await postBulkEmail(obj)

    if (result?.success) {
      toast.success('Emails Sent Successfully')
      setLoading(false);
      finish()
    } else {
      setLoading(false);
      toast.error(result?.message)
    }
  }

  return (
    <Spin spinning={isLoading}>
      <Box sx={{ mb: 9, textAlign: 'center' }}>
        <Typography variant='h5' sx={{ mb: 3, lineHeight: '2rem' }}>
          Select Teachers
        </Typography>
      </Box>

      <Grid container spacing={6}>
        <Grid item xs={12}>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <FormControlLabel
              control={
                <Checkbox checked={checked} onChange={handleCheckBox} inputProps={{ 'aria-label': 'controlled' }} />
              }
              label='Select All Teachers'
            />
          </div>
          <InputLabel id='demo-multiple-name-label'>Name</InputLabel>
          <Select
            labelId='demo-multiple-name-label'
            id='demo-multiple-name'
            multiple
            displayEmpty
            value={teachersIds}
            onChange={handleChange}
            input={<OutlinedInput label='Select Teachers' placeholder='Select Teachers' />}
            MenuProps={MenuProps}
            style={{ width: '100%' }}
            placeholder='Select Teachers'
            renderValue={selected => {
              if (selected.length === 0) {
                return <em>Select Teachers</em>
              }
              const names = selected?.map(id => {
                const object = teachers.find(obj => obj.id === id)
                return object ? object.name : 'all'
              })
              return names.join(', ')
            }}
            disabled={checked}
          >
            {teachers.map(item => (
              <MenuItem
                key={item.id}
                value={item.id}
                // style={getStyles(item.name, teachersIds, theme)}
              >
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </Grid>
      </Grid>
      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2, mt: 5 }}>
        <Button variant='outlined' onClick={back}>
          Back
        </Button>
        <Box sx={{ flex: '1 1 auto' }} />
        <Button variant='contained' onClick={addTeacher}>
          Save
        </Button>
      </Box>
    </Spin>
  )
}

export default AddTeacherWizard
