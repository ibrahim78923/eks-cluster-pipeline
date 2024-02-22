import * as React from 'react'
import Box from '@mui/material/Box'

import { useAuth } from 'src/hooks/useAuth'
import { Divider, Grid } from '@mui/material'
import { Spin } from 'antd'

import { getByClientId } from 'src/services/school.service'
import { getByGradeId } from 'src/services/student.service'

import LeftForm from './LeftForm'
import RightForm from './RightForm'

const PromoteStudentsWizard = ({ onComplete }) => {
  return (
    <Box sx={{ width: '100%' }}>
      <div
        sx={{
          width: '100%',
          py: 3,
          px: 1,
          boxShadow: 1,
          mb: 3
        }}
      >
        <Box sx={{ p: 2 }}>
          <SelectSchoolPromoteFrom onComplete={onComplete} />
        </Box>
      </div>
    </Box>
  )
}

const SelectSchoolPromoteFrom = ({ onComplete }) => {
  const [schools, setSchools] = React.useState([])
  const [schoolLoading, setSchoolLoading] = React.useState(false)
  const [gradeStudent, setGradeSchool] = React.useState([])

  const [selectedGradeTo, setSelectedGradeTo] = React.useState('')
  const [selectedSchoolTo, setSelectedSchoolTo] = React.useState('')

  const [students, setStudents] = React.useState([])

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

  const fetchStudentName = async grade => {
    setSchoolLoading(true)
    const data = await getByGradeId(grade)
    if (data?.success) setStudents(data?.students)
    setSchoolLoading(false)
  }

  return (
    <Spin spinning={schoolLoading}>
      <Grid container style={{ display: 'flex', justifyContent: 'center' }}>
        <Grid item xs={5}>
          <LeftForm
            setGradeSchool={setGradeSchool}
            gradeStudent={gradeStudent}
            schools={schools}
            selectedGradeTo={selectedGradeTo}
            selectedSchoolTo={selectedSchoolTo}
            setLoading={setSchoolLoading}
            isLoading={schoolLoading}
            fetchStudentTo={fetchStudentName}
            onComplete={onComplete}
          />
        </Grid>
        <Divider style={{ margin: 20 }} orientation='vertical' flexItem></Divider>
        <Grid item xs={5}>
          <RightForm
            schools={schools}
            setGrade={setSelectedGradeTo}
            grade={selectedGradeTo}
            setSchoolId={setSelectedSchoolTo}
            schoolId={selectedSchoolTo}
            setLoading={setSchoolLoading}
            isLoading={schoolLoading}
            fetchStudentName={fetchStudentName}
            students={students}
          />
        </Grid>
      </Grid>
    </Spin>
  )
}

export default PromoteStudentsWizard
