import * as React from 'react'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'

import { Icon } from '@iconify/react'
import { useAuth } from 'src/hooks/useAuth'
import { Card, Grid, TextField, Tooltip } from '@mui/material'
import { Divider, Spin } from 'antd'

import { getByClientIdWithTeachers } from 'src/services/school.service'
import { create, getByID, update } from 'src/services/grade.service'
import { toast } from 'react-hot-toast'
import { getBySchoolId } from 'src/services/teacher.service'

import Alert from '@mui/material/Alert'
import { DaysData } from './DaysData'
import GradeTimeForm from './AddDaysForm'

const steps = ['Select School', 'Add Grade']

const AddTeacherWizard = ({ onComplete, gradeId }) => {
  const [activeStep, setActiveStep] = React.useState(0)
  const [skipped, setSkipped] = React.useState(new Set())

  const [selectedSchool, setSelectedSchool] = React.useState('')
  const [selectedTeacher, setSelectedTeacher] = React.useState(0)
  const [gradeData, setGradeData] = React.useState({})

  const isStepOptional = () => false

  const isEdit = id => {
    if (id !== '') {
      return true
    } else {
      return false
    }
  }
  console.log(isEdit(gradeId), 'isEdit')
  const isStepSkipped = step => {
    return skipped.has(step)
  }

  React.useEffect(() => {
    if (isEdit(gradeId)) {
      const fn = async () => {
        const result = await getByID(gradeId)

        if (result?.success) {
          console.log(result, 'grade data')
          setGradeData(result?.grade)
          setSelectedSchool(result?.grade?.school?.id)
          setSelectedTeacher(result?.grade?.teacherId)
        }
      }

      fn()
    }
  }, [])

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
      case 4:
        return (
          <SelectTeacher
            back={handleBack}
            next={handleNext}
            schoolId={selectedSchool}
            selected={selectedTeacher}
            setSelected={setSelectedTeacher}
          />
        )
      case 1:
        return (
          <AddGrade
            back={handleBack}
            finish={finish}
            schoolId={selectedSchool}
            teacherId={selectedTeacher}
            isEdit={isEdit(gradeId)}
            gradeData={gradeData}
          />
        )
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
  // const hasTeachers = school.teachers?.length !== 0

  // if (hasTeachers) {
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
  // }

  // return (
  //   <Tooltip title="You can't select a School if it has no Teachers">
  //     <Card
  //       sx={{
  //         display: 'flex',
  //         width: '100%',
  //         minHeight: 50,
  //         justifyContent: 'space-between',
  //         alignItems: 'center',
  //         cursor: 'not-allowed',
  //         p: 2,
  //         my: 1,
  //         boxShadow: 2,
  //         transition: '0.25s all ease-in-out',
  //         background: `transparent`,
  //         color: 'auto',
  //         border: `1px solid transparent`
  //       }}
  //       onClick={() => hasTeachers && setSelected(school.id)}
  //     >
  //       <Typography variant='p'>
  //         {school.name}{' '}
  //         <strong>
  //           <small>(No Teachers)</small>
  //         </strong>
  //       </Typography>
  //       <Icon icon='material-symbols:chevron-right' />
  //     </Card>
  //   </Tooltip>
  // )
}

const SelectSchool = ({ selected, setSelected, next }) => {
  const [schools, setSchools] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const auth = useAuth()

  React.useEffect(() => {
    const fn = async () => {
      setLoading(true)
      const data = await getByClientIdWithTeachers(auth.user.id)

      if (data?.success) {
        setLoading(false)
        setSchools(data.schools)
        // setSelected(data.schools[0]?.id)
      } else {
        setLoading(false)
        toast.error(data?.message)
      }
    }

    fn()
  }, [])

  return (
    <Spin spinning={loading}>
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
        <Button variant='contained' onClick={next} disabled={!selected}>
          Next
        </Button>
      </Box>
    </Spin>
  )
}

const Teacher = ({ teacher, selected, setSelected }) => {
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
        background: theme => (selected === teacher.id ? theme.palette.primary.main : `transparent`),
        color: theme => (selected === teacher.id ? theme.palette.primary.contrastText : 'auto'),
        border: theme =>
          selected === teacher.id ? `1px solid ${theme.palette.primary.main}` : `1px solid transparent`,
        '&:hover': {
          boxShadow: 5
        }
      }}
      onClick={() => setSelected(teacher.id)}
    >
      <Typography variant='p'>{teacher.name}</Typography>
      <Icon icon='material-symbols:chevron-right' />
    </Card>
  )
}

const SelectTeacher = ({ selected, setSelected, schoolId, back, next }) => {
  const [teachers, setTeachers] = React.useState([])
  const auth = useAuth()

  React.useEffect(() => {
    const fn = async () => {
      const data = await getBySchoolId(schoolId)

      if (data.success) {
        console.log(data.teachers)
        setTeachers(data.teachers)
        // setSelected(data.teachers[0]?.id)
      }
    }

    fn()
  }, [])

  return (
    <>
      <Typography variant='h6' sx={{ mt: 1, textAlign: 'center' }}>
        Select Teacher
      </Typography>
      <Typography variant='body2' sx={{ textAlign: 'center' }}>
        Please select the teacher you want to assign this grade to
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
        {teachers.map((teacher, i) => (
          <Teacher key={i} teacher={teacher} setSelected={setSelected} selected={selected} />
        ))}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'row', mt: 5, justifyContent: 'space-between' }}>
        <Button variant='outlined' onClick={back}>
          Back
        </Button>
        <Button variant='contained' onClick={next} disabled={!selected}>
          Next
        </Button>
      </Box>
    </>
  )
}

const AddGrade = ({ back, finish, schoolId, teacherId, isEdit, gradeData }) => {
  const [name, setName] = React.useState('')
  const [gradeTimes, setGradeTime] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [errors, setErrors] = React.useState('')

  const reset = () => {
    setName('')
  }

  React.useEffect(() => {
    if (isEdit) {
      setName(gradeData?.name)
      setGradeTime(gradeData?.gradesTimes)
    } else {
      reset()
      setGradeTime(DaysData)
    }
  }, [])

  const auth = useAuth()

  const addGrade = async e => {
    e.preventDefault()
    if (!isEdit) {
      setLoading(true)
      const obj = {}
      obj.name = name
      obj.clientId = auth.user.id
      obj.schoolId = schoolId
      // obj.teacherId = teacherId;
      obj.gradeTimes = gradeTimes

      const result = await create(obj)

      if (result?.success) {
        setErrors('')
        setLoading(false)
        toast.success('Grade has been added')
        reset()
        setName('')
        finish(result?.grade)
      } else {
        setLoading(false)
        setErrors(result?.message)
        toast.error(result?.message)
      }
    } else {
      setLoading(true)
      const obj = {}
      obj.name = name
      obj.clientId = auth.user.id
      obj.schoolId = schoolId
      obj.teacherId = teacherId
      obj.gradeTimes = gradeTimes
      obj.id = gradeData?.id

      const result = await update(obj)

      if (result?.success) {
        setErrors('')
        setLoading(false)
        toast.success('Grade has been Update')
        reset()
        setName('')
        finish(result?.grade)
      } else {
        setLoading(false)
        setErrors(result?.message)
        toast.error(result?.message)
      }
    }
  }

  return (
    <Spin spinning={loading}>
      <Box sx={{ mb: 9, textAlign: 'center' }}>
        <Typography variant='h5' sx={{ mb: 3, lineHeight: '2rem' }}>
          Add New Grade
        </Typography>
      </Box>
      <form autocomplete='off' onSubmit={addGrade}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <TextField
              value={name}
              required
              onChange={e => setName(e.target.value)}
              fullWidth
              label='Grade Name'
              size='small'
            />
          </Grid>
          <Grid item xs={12}>
            {/* <div style={{ display: "flex", flexWrap: 'wrap', gap: "50px", alignItems: "center",justifyContent: "space-between", marginBottom: 10, width: "98%" }}>
        <Typography style={{marginLeft: 12}} variant='h6'>Day</Typography>
        <Typography style={{marginLeft: 15}} variant='h6'>Start Time</Typography>
        <Typography style={{marginRight: 15}} variant='h6'>Off Time</Typography>
        <Typography variant='h6'>Status</Typography>
    </div> */}
            {gradeTimes?.map((item, index) => {
              return (
                <>
                  <GradeTimeForm key={index} item={item} setGradeTime={setGradeTime} isDetail={false} />
                  <Divider />
                </>
              )
            })}
          </Grid>
          {errors !== '' && (
            <Grid item xs={12}>
              <Alert severity='error'>{errors}</Alert>
            </Grid>
          )}
        </Grid>
        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2, mt: 5 }}>
          <Button variant='outlined' onClick={back}>
            Back
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />
          <Button variant='contained' type='submit' disabled={!gradeTimes?.length}>
            {isEdit ? 'Edit' : 'Create'}
          </Button>
        </Box>
      </form>
    </Spin>
  )
}

export default AddTeacherWizard
