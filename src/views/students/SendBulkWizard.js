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
import { Spin } from 'antd'

import { getByClientId } from 'src/services/school.service'
import { getByGradeId, postBulkEmail } from 'src/services/student.service'
import { toast } from 'react-hot-toast'
import { getBySchoolId } from 'src/services/grade.service'

import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputLabel from '@mui/material/InputLabel'

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
const steps = ['Select School', 'Select Grade']

const SendBulkWizard = ({ onComplete }) => {
  const [activeStep, setActiveStep] = React.useState(0)
  const [skipped, setSkipped] = React.useState(new Set())

  const [selectedSchool, setSelectedSchool] = React.useState(null)

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
        return <SelectGrade back={handleBack} schoolId={selectedSchool} finish={finish} />
      case 2:
        return <SelectStudents back={handleBack} finish={finish} schoolId={selectedSchool} />
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
  const isSelected = selected === school.id

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
        background: theme => (isSelected ? theme.palette.primary.main : `transparent`),
        color: theme => (isSelected ? theme.palette.primary.contrastText : 'auto'),
        border: theme => (isSelected ? `1px solid ${theme.palette.primary.main}` : `1px solid transparent`),
        '&:hover': {
          boxShadow: 5
        }
      }}
      onClick={() => {
        setSelected(school.id)
      }}
    >
      <Typography variant='p'>{school.name}</Typography>
      {isSelected && <Icon icon='mdi:tick' />}
    </Card>
  )
}

const SelectSchool = ({ selected, setSelected, next }) => {
  const [schools, setSchools] = React.useState([])
  const [canProceed, setCanProceed] = React.useState(false)
  const [schoolLoading, setSchoolLoading] = React.useState(false)

  const auth = useAuth()

  React.useEffect(() => {
    const fn = async () => {
      setSchoolLoading(true);
      const data = await getByClientId(auth.user.id)

      if (data.success) {
        setSchools(data.schools)
        setSchoolLoading(false);
      }
    }

    fn()
  }, [])

  React.useEffect(() => {
    setCanProceed(selected !== null)
  }, [selected])

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
        <Button variant='contained' onClick={next} disabled={!canProceed}>
          Next
        </Button>
      </Box>
    </Spin>
  )
}

const Grade = ({ grade, selected, setSelected }) => {
  const isSelected = selected?.some(id => id === grade.id)
  const handleOnclick = (gradeId, selected) => {
    if (!selected.includes(gradeId)) {
      // check if the new value already exists in the array
      const newArray = [...selected, gradeId]
      setSelected(newArray) // set the new array using setState function
    } else {
      const newArray = selected.filter(value => value !== gradeId) // create a new array that excludes the existing value
      setSelected(newArray) // set the new array using setState function
    }
  }
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
        background: theme => (isSelected ? theme.palette.primary.main : `transparent`),
        color: theme => (isSelected ? theme.palette.primary.contrastText : 'auto'),
        border: theme => (isSelected ? `1px solid ${theme.palette.primary.main}` : `1px solid transparent`),
        '&:hover': {
          boxShadow: 5
        }
      }}
      onClick={() => handleOnclick(grade.id, selected)}
    >
      <Typography variant='p'>{grade.name}</Typography>
      <Typography variant='p' fontSize={13}>
        {/* Assigned to {grade.teacher.name} */}
      </Typography>
      {isSelected && <Icon icon='mdi:tick' />}
    </Card>
  )
}

const SelectGrade = ({ schoolId, back, finish }) => {
  const [grades, setGrades] = React.useState([])
  const [selectedGrade, setSelectedGrade] = React.useState([])
  const [gradeLoading, setGradeLoading] = React.useState(false)

  React.useEffect(() => {
    const fn = async () => {
      setGradeLoading(true);
      const data = await getBySchoolId(schoolId)

      if (data.success) {
        setGrades(data.grades)
        setGradeLoading(false);
      }
    }

    fn()
  }, [])

  const sendCredentials = async () => {
    let obj = {}
    obj.gradeIds = selectedGrade
    setGradeLoading(true);
    const result = await postBulkEmail(obj)

    if (result?.success) {
      toast.success('Emails Sent Successfully')
      setGradeLoading(false);
      finish()
    } else {
      toast.error(result?.message)
      setGradeLoading(false);
    }
  }

  return (
    <Spin spinning={gradeLoading}>
      <Typography variant='h6' sx={{ mt: 1, textAlign: 'center' }}>
        Select Grade
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
        {grades?.length > 0 ? (
          grades.map((grade, i) => (
            <Grade key={i} grade={grade} setSelected={setSelectedGrade} selected={selectedGrade} />
          ))
        ) : (
          <Typography variant='body2' sx={{ textAlign: 'center' }}>
            No grades found against this school, please go back and select another one
          </Typography>
        )}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'row', mt: 5, justifyContent: 'space-between' }}>
        <Button variant='outlined' onClick={back}>
          Back
        </Button>
        <Button variant='contained' onClick={sendCredentials} disabled={!selectedGrade?.length}>
          Send
        </Button>
      </Box>
    </Spin>
  )
}

const SelectStudents = ({ back, finish, schoolId, gradeId }) => {
  const [students, setStudents] = React.useState([])
  const [selectedStudents, setSelectedStudents] = React.useState([])

  React.useEffect(() => {
    const fn = async () => {
      const data = await getByGradeId(gradeId)
      if (data.success) {
        setStudents(data.students)
      }
    }

    fn()
  }, [])

  const handleChange = event => {
    const {
      target: { value }
    } = event
    setSelectedStudents(value)
  }

  const addTeacher = async () => {
    let obj = {}
    obj.teacherIds = selectedStudents
    const result = await postBulkEmail(obj)

    if (result.success) {
      toast.success('Emails Sent Successfully')
      finish()
    } else {
      toast.error(result.message)
    }
  }
  return (
    <>
      <Box sx={{ mb: 9, textAlign: 'center' }}>
        <Typography variant='h5' sx={{ mb: 3, lineHeight: '2rem' }}>
          Select Students
        </Typography>
      </Box>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          {students?.length > 0 ? (
            <>
              <InputLabel id='demo-multiple-name-label'>Name</InputLabel>
              <Select
                labelId='demo-multiple-name-label'
                id='demo-multiple-name'
                multiple
                displayEmpty
                value={selectedStudents}
                onChange={handleChange}
                input={<OutlinedInput label='Select Students' placeholder='Select Students' />}
                MenuProps={MenuProps}
                style={{ width: '100%' }}
                placeholder='Select Students'
                renderValue={selected => {
                  if (selected.length === 0) {
                    return <em>Select Students</em>
                  }

                  return selected.join(', ')
                }}
              >
                {students.map(item => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </>
          ) : (
            <Typography variant='body2' sx={{ textAlign: 'center' }}>
              No students found against this grade, please go back and select another one
            </Typography>
          )}
        </Grid>
      </Grid>
      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2, mt: 5 }}>
        <Button variant='outlined' onClick={back}>
          Back
        </Button>
        <Box sx={{ flex: '1 1 auto' }} />
        <Button variant='contained' onClick={addTeacher} disabled={!selectedStudents?.length}>
          Save
        </Button>
      </Box>
    </>
  )
}

export default SendBulkWizard
