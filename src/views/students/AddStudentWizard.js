import * as React from 'react'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import { Icon } from '@iconify/react'
import { useAuth } from 'src/hooks/useAuth'
import { Card, Grid, TextField, IconButton } from '@mui/material'

import { getByClientId } from 'src/services/school.service'
import { create, createSibling, getByID as studentGetById, update } from 'src/services/student.service'
import { toast } from 'react-hot-toast'
import { getBySchoolId } from 'src/services/grade.service'

import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import Alert from '@mui/material/Alert'
import Switch from '@mui/material/Switch'
import Divider from '@mui/material/Divider'
import { Spin, message } from 'antd'

const steps = ['Select School', 'Select Grade', 'Add Student']

const AddTeacherWizard = ({ onComplete, studentId }) => {
  const [activeStep, setActiveStep] = React.useState(0)
  const [skipped, setSkipped] = React.useState(new Set())

  const [selectedSchool, setSelectedSchool] = React.useState(null)
  const [selectedGrade, setSelectedGrade] = React.useState(null)
  const [studentData, setStudentData] = React.useState({})

  const auth = useAuth()

  const isEdit = id => {
    if (id) {
      return true
    } else {
      return false
    }
  }
  console.log(studentId, 'studentId')

  console.log(isEdit(studentId), 'isEdit')

  const reset = () => {
    setStudentData({})
    setSelectedSchool(null)
    setSelectedGrade(null)
  }

  React.useEffect(() => {
    if (isEdit(studentId)) {
      const fn = async () => {
        const result = await studentGetById(studentId)

        if (result?.success) {
          console.log(result, 'grade data')
          setStudentData(result?.student)
          setSelectedSchool(result?.student?.grade?.school?.id)
          setSelectedGrade(result?.student?.grade?.id)
        }
      }
      fn()
    } else {
      reset()
    }
  }, [])

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
        return (
          <SelectGrade
            back={handleBack}
            next={handleNext}
            schoolId={selectedSchool}
            selected={selectedGrade}
            setSelected={setSelectedGrade}
          />
        )
      case 2:
        return (
          <AddStudent
            back={handleBack}
            finish={finish}
            schoolId={selectedSchool}
            gradeId={selectedGrade}
            isEdit={isEdit(studentId)}
            studentData={studentData}
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
      onClick={() => setSelected(school.id)}
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
      setSchoolLoading(true)
      const data = await getByClientId(auth.user.id)

      if (data?.success) {
        setSchools(data.schools)
        setSchoolLoading(false)
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
  const isSelected = selected === grade.id
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
      onClick={() => setSelected(grade.id)}
    >
      <Typography variant='p'>{grade.name}</Typography>
      {/* <Typography variant='p' fontSize={13}> Assigned to {grade.teacher.name}</Typography> */}
      {isSelected && <Icon icon='mdi:tick' />}
    </Card>
  )
}

const SelectGrade = ({ selected, setSelected, schoolId, back, next }) => {
  const [grades, setGrades] = React.useState([])
  const [canProceed, setCanProceed] = React.useState(false)
  const [gradeLoading, setGradeLoading] = React.useState(false)

  React.useEffect(() => {
    setCanProceed(selected !== null)
  }, [selected])

  const auth = useAuth()

  React.useEffect(() => {
    const fn = async () => {
      setGradeLoading(true)
      const data = await getBySchoolId(schoolId)

      if (data?.success) {
        setGrades(data.grades)
        setGradeLoading(false)
      }
    }

    fn()
    console.log(grades)
  }, [])

  return (
    <Spin spinning={gradeLoading}>
      <Typography variant='h6' sx={{ mt: 1, textAlign: 'center' }}>
        Select Grade
      </Typography>
      <Typography variant='body2' sx={{ textAlign: 'center' }}>
        Please select the Grade you want to assign this Student to
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
        {grades.map((grade, i) => (
          <Grade key={i} grade={grade} setSelected={setSelected} selected={selected} />
        ))}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'row', mt: 5, justifyContent: 'space-between' }}>
        <Button variant='outlined' onClick={back}>
          Back
        </Button>
        <Button variant='contained' onClick={next} disabled={!canProceed}>
          Next
        </Button>
      </Box>
    </Spin>
  )
}

const AddStudent = ({ back, finish, schoolId, gradeId, isEdit, studentData }) => {
  const [name, setName] = React.useState('')
  const [nameAr, setNameAr] = React.useState('')
  const [gender, setGender] = React.useState('Male')
  const [email, setEmail] = React.useState('')
  const [motherEmail, setmotherEmail] = React.useState('')
  const [phoneNo, setPhoneNo] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [errors, setErrors] = React.useState('')
  const [isSibling, setIsSibling] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)

  const auth = useAuth()

  const reset = () => {
    setName('')
    setNameAr('')
    setGender('Male')
    setEmail('')
    setmotherEmail('')
    setPhoneNo('')
    setPassword('')
  }

  React.useEffect(() => {
    if (isEdit) {
      setName(studentData?.name)
      setNameAr(studentData?.nameAr)
      setGender(studentData?.gender)
      setEmail(studentData?.parent?.email)
      setmotherEmail(studentData?.parent?.motherEmail)
      setPhoneNo(studentData?.parent?.phoneNo)
      setPassword(studentData?.parent?.password)
    } else {
      reset()
    }
  }, [])

  const handleChangeSwitch = event => {
    console.log(event.target.checked, 'event.target.checked')
    setIsSibling(event.target.checked)
  }

  const addStudent = async e => {
    e.preventDefault()
    let role = 'parent'
    if (isEdit) {
      setLoading(true)
      const result = await update(
        studentData?.id,
        name?.trim(),
        nameAr?.trim(),
        gender,
        email?.trim(),
        motherEmail?.trim(),
        phoneNo,
        auth.user.id,
        schoolId,
        gradeId,
        studentData?.parent?.id,
        password,
        isSibling
      )
      if (result?.success) {
        toast.success('Student has been Edited ')
        setLoading(false)
        finish(result.student)
      } else {
        setErrors(result?.message)
        setLoading(false)
        // toast.error("Student Already exits against this Parent Email, if you want Sibling please Press the Add Sibling Button!")
      }
    } else {
      if (!isSibling) {
        setLoading(true)
        const result = await create(
          role,
          name?.trim(),
          nameAr?.trim(),
          gender,
          email?.trim(),
          motherEmail?.trim(),
          phoneNo,
          auth.user.id,
          schoolId,
          gradeId,
          password
        )

        if (result?.success) {
          toast.success('Student has been added')
          setLoading(false)
          finish(result.student)
        } else {
          setErrors(result?.message)
          setLoading(false)
          // toast.error("Student Already exits against this Parent Email, if you want Sibling please Press the Add Sibling Button!")
        }
      } else {
        setLoading(true)
        const result = await createSibling(
          name?.trim(),
          nameAr?.trim(),
          gender,
          email?.trim(),
          motherEmail?.trim(),
          phoneNo,
          auth.user.id,
          schoolId,
          gradeId,
          password
        )

        if (result?.success) {
          toast.success('Sibling has been added')
          setLoading(false)
          finish(result.student)
        } else {
          setErrors(result?.message)
          setLoading(false)
          // toast.error("Student Already exits against this Parent Email, if you want Sibling please Press the Add Sibling Button!")
        }
      }
    }
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleMouseDownPassword = event => {
    event.preventDefault()
  }
  const handlePhoneNo = e => {
    const inputValue = event.target.value
    const isPositiveNumber = /^\d*\.?\d*$/.test(inputValue)

    if (isPositiveNumber) {
      setPhoneNo(inputValue)
    } else {
      setPhoneNo('')
    }
  }
  const [nameError, setNameError] = React.useState('')
  const [error, setError] = React.useState('')
  const handleChangeArabicName = e => {
    const newValue = e.target.value
    setNameAr(newValue)
    // if (newValue.match(/^[A-Za-z]+(?:\s?[A-Za-z]+)*\s?$/)) {
    //   setError('')
    // } else {
    //   setError('Invalid input! Spaces is not allow at the beginning or end of the character.')
    // }
  }
  const handleChangeName = e => {
    const newValue = e.target.value
    setName(newValue)
    // if (newValue.match(/^[A-Za-z]+(?:\s?[A-Za-z]+)*\s?$/)) {
    //   setNameError('')
    // } else {
    //   setNameError('Invalid input! Spaces is not allow at the beginning or end of the character.')
    // }
  }

  return (
    <Spin spinning={loading}>
      <Box sx={{ mb: 9, textAlign: 'center' }}>
        <Typography variant='h5' sx={{ mb: 3, lineHeight: '2rem' }}>
          {isEdit ? 'Edit Student' : 'Add New Student'}
        </Typography>
      </Box>
      <form autocomplete='off' onSubmit={addStudent}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <TextField
              value={name}
              type='text'
              onChange={handleChangeName}
              fullWidth
              label='Student Name'
              size='small'
              required
              // error={!!nameError}
              // helperText={nameError}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              value={nameAr}
              onChange={handleChangeArabicName}
              fullWidth
              label='Arabic Name'
              size='small'
              type='text'
              // required
              // error={!!error}
              // helperText={error}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl>
              <FormLabel>Gender</FormLabel>
              <RadioGroup row value={gender} onChange={e => setGender(e.target.value)}>
                <FormControlLabel value='Male' control={<Radio />} label='Male' />
                <FormControlLabel value='Female' control={<Radio />} label='Female' />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Divider>This Field is used for Email Notification</Divider>
            <TextField
              type='email'
              value={email}
              onChange={e => setEmail(e.target.value)}
              fullWidth
              label='Father Email'
              size='small'
              required
              autocomplete='off'
            />
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <TextField
              type='email'
              value={motherEmail}
              onChange={e => setmotherEmail(e.target.value)}
              fullWidth
              label='Mother Email'
              size='small'
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              type='text'
              value={phoneNo}
              onChange={handlePhoneNo}
              fullWidth
              label='Guardian Phone No'
              size='small'
            />
          </Grid>
          {isEdit && (
            <Grid item xs={12}>
              <TextField
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                fullWidth
                label='Password'
                autocomplete='off'
                size='small'
                required
                InputProps={{
                  endAdornment: (
                    <IconButton
                      aria-label='toggle password visibility'
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      <Icon icon={showPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} fontSize={20} />
                    </IconButton>
                  )
                }}
              />
            </Grid>
          )}
        </Grid>
        {errors ===
          'Student Already exits against this Parent Email, if you want to add Sibling please on the Switch!' && (
          <>
            <Alert severity='error'>
              Student Already exits against this Parent Email, if you want to add Sibling please on the Switch Below!
            </Alert>
            <FormControlLabel
              control={<Switch checked={isSibling} onChange={handleChangeSwitch} name='gilad' />}
              label='Add Sibling'
            />
          </>
        )}
        {errors &&
          errors !==
            'Student Already exits against this Parent Email, if you want to add Sibling please on the Switch!' && (
            <Alert severity='error'>{errors} </Alert>
          )}
        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2, mt: 5 }}>
          <Button variant='outlined' onClick={back}>
            Back
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />
          <Button variant='contained' type='submit' disabled={!!error || !!nameError}>
            {isEdit ? 'Edit' : 'Create'}
          </Button>
        </Box>
      </form>
    </Spin>
  )
}

export default AddTeacherWizard
