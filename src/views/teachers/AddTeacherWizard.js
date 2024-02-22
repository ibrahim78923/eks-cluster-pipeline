import * as React from 'react'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import { Icon } from '@iconify/react'
import { useAuth } from 'src/hooks/useAuth'
import { Card, Grid, TextField, Checkbox, FormControlLabel } from '@mui/material'

import { getByClientId } from 'src/services/school.service'
import { create, getByID, update, updateSelectedGrades } from 'src/services/teacher.service'
import { toast } from 'react-hot-toast'
import { Spin } from 'antd'
import { getBySchoolId } from 'src/services/grade.service'

const steps = ['Select School','Select Grades', 'Add Teacher']

const AddTeacherWizard = ({ onComplete,teacherId }) => {
  const [activeStep, setActiveStep] = React.useState(0)
  const [skipped, setSkipped] = React.useState(new Set())
  const [teacherData, setTeacherData] = React.useState({});

  const [selectedSchool, setSelectedSchool] = React.useState(0)
  const [selectedGrades, setSelectedGrades] = React.useState([])
console.log(selectedGrades,"selectedGrades")
  const isEdit = (id) => {
    if (id) {
      return true;
    } else {
      return false
    }
  }
  console.log(teacherId, "teacherId")

  console.log(isEdit(teacherId), "isEdit")

  const reset = () => {
    setTeacherData({});
    setSelectedSchool(null);
    setSelectedGrades([]);
  }

  React.useEffect(() => {
    if (isEdit(teacherId)) {
      const fn = async () => {
        const result = await getByID(teacherId)

        if (result?.success) {
          console.log(result, "grade data")
          setTeacherData(result?.teacher);
          setSelectedSchool(result?.teacher?.schoolId);
          setSelectedGrades(result?.teacher?.grades?.map((item)=> item.id))
        }
      }
      fn()
    } else {
      reset();
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
        return <SelectGrade back={handleBack} next={handleNext} schoolId={selectedSchool} setSelectedGrade={setSelectedGrades} selectedGrade={selectedGrades} />
      case 2:
        return <AddTeacher back={handleBack} finish={finish} grades={selectedGrades} schoolId={selectedSchool} isEdit={isEdit(teacherId)} teacherData={teacherData}/>
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

      if (data?.success) {
        setSchoolLoading(false);
        setSchools(data.schools)
        // setSelected(data.schools[0]?.id)
      }else{
        setSchoolLoading(false);
        toast.error(data?.message)
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
        <Button variant='contained' onClick={next} disabled={!selected}>
          Next
        </Button>
      </Box>
    </Spin>
  )
}
const Grade = ({ grade, selected, setSelected }) => {
  const isSelected = selected?.some(id => id === grade.id)
  const handleOnclick = (gradeId, selected) => {
    if (!selected?.includes(gradeId)) {
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
const SelectGrade = ({ schoolId, back,next, selectedGrade,setSelectedGrade }) => {
  const [grades, setGrades] = React.useState([])
  const [gradeLoading, setGradeLoading] = React.useState(false)
  const [checked, setChecked] = React.useState(false)

  React.useEffect(() => {
    const fn = async () => {
      setGradeLoading(true);
      const data = await getBySchoolId(schoolId)

      if (data?.success) {
        setGrades(data.grades)
        setChecked(data.grades?.length === selectedGrade?.length? true:false)
        setGradeLoading(false);
      }
    }

    fn()
  }, [])

  const handleCheckBox = event => {
    setChecked(event.target.checked)
    if (event.target.checked) {
      setSelectedGrade([])
      const newArray = grades.map(obj => obj.id)
      setSelectedGrade(newArray)
    } else {
      setSelectedGrade([])
    }
  }

  return (
    <Spin spinning={gradeLoading}>
      <Typography variant='h6' sx={{ mt: 1, textAlign: 'center' }}>
        Select Grade
      </Typography>
      <Typography variant='body2' sx={{ textAlign: 'center' }}>
        You can Select Multiple Grades
      </Typography>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <FormControlLabel
              control={
                <Checkbox checked={checked} onChange={handleCheckBox} inputProps={{ 'aria-label': 'controlled' }} />
              }
              label='Select All Grades'
            />
          </div>
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
        <Button variant='contained' onClick={next} disabled={!selectedGrade?.length}>
          Next
        </Button>
      </Box>
    </Spin>
  )
}
const AddTeacher = ({ back, finish, schoolId,grades, teacherData, isEdit }) => {
  const [name, setName] = React.useState('')
  const [nameAr, setNameAr] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [isLoading, setLoading] = React.useState(false)

  const auth = useAuth()

  const reset = () => {
    setName('');
    setNameAr('');
    setEmail('')
    setPassword('')
  }

  React.useEffect(() => {
    if (isEdit) {
      setName(teacherData?.name);
      setNameAr(teacherData?.nameAr);
      setEmail(teacherData?.email)
      setPassword(teacherData?.password)
    } else {
      reset();
    }
  }, [])

  const addTeacher = async () => {
    if (isEdit) {
    setLoading(true);
      const result = await update(teacherData?.id, name, nameAr, email, password, schoolId,grades)

      if (result.success) {
        setLoading(false);
        toast.success('Teacher has been updated')
        finish(result.grade)
        updateSelectedGrades(teacherData?.id, JSON.stringify(grades))
      } else {
        setLoading(false);
        toast.error(result.message)
      }
    } else {
    setLoading(true);
    const result = await create(name, nameAr, email, password, auth.user.id, schoolId,grades)

    if (result.success) {
      setLoading(false);
      toast.success('Teacher has been added')
      finish(result.grade)
    } else {
      setLoading(false);
      toast.error(result.message)
    }
  }
  }

  return (
    <Spin spinning={isLoading}>
      <Box sx={{ mb: 9, textAlign: 'center' }}>
        <Typography variant='h5' sx={{ mb: 3, lineHeight: '2rem' }}>
          Add New Teacher
        </Typography>
      </Box>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <TextField value={name} onChange={e => setName(e.target.value)} fullWidth label='Name' size='small' />
        </Grid>
        <Grid item xs={12}>
          <TextField
            value={nameAr}
            onChange={e => setNameAr(e.target.value)}
            fullWidth
            label='Arabic Name'
            size='small'
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            type='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            fullWidth
            label='Email'
            size='small'
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            type='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            fullWidth
            label='Password'
            size='small'
          />
        </Grid>
      </Grid>
      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2, mt: 5 }}>
        <Button variant='outlined' onClick={back}>
          Back
        </Button>
        <Box sx={{ flex: '1 1 auto' }} />
        <Button variant='contained' onClick={addTeacher}>
        {isEdit ? "Save" : "Create"}
        </Button>
      </Box>
    </Spin>
  )
}

export default AddTeacherWizard
