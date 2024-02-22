import { useEffect, useState } from 'react'
import { useSocket } from 'src/context/socket/teacherSocket'
import { useRequests } from '/src/context/requests'
import { Box, Typography, Switch, Select, MenuItem, Checkbox, ListItemText, Tooltip, Grid } from '@mui/material'

import { updateSelectedGrades } from 'src/services/teacher.service'
import studentImage from 'public/images/avatars/student.png'
import { useAuth } from 'src/hooks/useAuth'
import { useRouter } from 'next/router'
import { Grid as VirtualGrid } from 'react-virtualized'
import useMediaQuery from '@mui/material/useMediaQuery'

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

const ConfirmedRequestsBody = ({ grades }) => {
  const [gradeIds, setGradeIds] = useState([])
  const [requests, setRequests] = useRequests()
  const [sortedReq, setSortedReq] = useState([])
  const [nameOnly, setNameOnly] = useState(false)
  const isMobile = useMediaQuery(theme => theme.breakpoints.down('md'))

  const [isLoading, setIsLoading] = useState(false)

  const handlePLaceHolder = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }
  useEffect(() => {
    handlePLaceHolder()
  }, [])

  const handleChangeSwitch = event => {
    setNameOnly(event.target.checked)
  }

  const auth = useAuth()

  const handleChange = event => {
    const {
      target: { value }
    } = event
    if (value?.length) {
      const selectedValue = value[value?.length - 1]
      if (selectedValue === 'all') {
        setGradeIds(grades?.map(item => item.id))
        window.localStorage.setItem('selectedGrades', JSON.stringify(grades?.map(item => item.id)))
        updateSelectedGrades(auth.user.id, JSON.stringify(grades?.map(item => item.id)))
      } else {
        setGradeIds(value?.filter(item => item !== 'all'))
        window.localStorage.setItem('selectedGrades', JSON.stringify(value?.filter(item => item !== 'all')))
        updateSelectedGrades(auth.user.id, JSON.stringify(value?.filter(item => item !== 'all')))
      }
    }
  }
  useEffect(() => {
    const selectedGrades = JSON.parse(window.localStorage.getItem('selectedGrades'))
    if (selectedGrades) setGradeIds(selectedGrades)
    else if (auth.user?.selectedGrades ? JSON.parse(auth.user?.selectedGrades) : null)
      setGradeIds(JSON.parse(auth.user?.selectedGrades))
    else setGradeIds(grades?.map(item => item.id))
  }, [grades])

  useEffect(() => {
    const sortedSyudents = gradeIds?.includes('all')
      ? requests?.filter(item => item.status === 2 && auth?.user?.clientId === item?.clientId)
      : requests?.filter(
          item => gradeIds?.includes(item.gradeId) && item.status === 2 && auth?.user?.clientId === item?.clientId
        )
    setSortedReq(sortedSyudents)
  }, [requests, requests?.length, gradeIds])

  const [userData, setUserDate] = useState()
  const router = useRouter()

  useEffect(() => {
    const data = JSON.parse(window.localStorage.getItem('userData'))
    setUserDate(data)
  }, [router])

  const getColumnCount = () => {
    const screenWidth = window.innerWidth
    if (screenWidth <= 600) {
      return 2
    } else {
      return Math.floor(screenWidth / 155)
    }
  }

  const cellRenderer = ({ columnIndex, rowIndex, style }) => {
    const index = rowIndex * getColumnCount() + columnIndex

    if (index < sortedReq.length) {
      const req = sortedReq[index]
      const styleObj = {
        ...style,
        backgroundColor: ''
      }

      if (isLoading) {
        return (
          <div style={styleObj}>
            <img
              width={isMobile ? 170 : 140}
              height={isMobile ? 130 : 120}
              src='https://ph-files.imgix.net/2611612b-dfbc-4211-b49b-80c63728363e.png?auto=format'
            />
          </div>
        )
      } else {
        return (
          <div style={styleObj}>
            <GradeColBody
              request={req}
              key={req?.student?.id}
              student={req?.student}
              isFromTop={true}
              grades={grades}
              nameOnly={nameOnly}
              isMobile={isMobile}
            />
          </div>
        )
      }
    } else {
      return null // Return null for empty cells
    }
  }

  const columnCount = getColumnCount()
  const rowCount = Math.ceil(sortedReq.length / columnCount)

  return (
    <div className={!userData?.status ? 'blury-display' : ''}>
      <Grid container>
        <Grid item xs={6} md={2}>
          <Select
            labelId='my-select-label'
            id='my-select'
            multiple
            value={gradeIds}
            onChange={handleChange}
            MenuProps={MenuProps}
            style={{ width: isMobile ? '95%' : 200 }}
            placeholder='Select Teachers'
            renderValue={selected => {
              if (selected.length === 0) {
                return <em>Select Grades</em>
              }
              const names = selected?.map(id => {
                const object = grades.find(obj => obj.id === id)
                return object ? object.name : 'All Grades'
              })
              return names.join(', ')
            }}
          >
            <MenuItem sx={{ height: 33, padding: 0, margin: 0, ml: 3 }} key={'all'} value={'all'}>
              <ListItemText primary={'All Grades'} />
              <Checkbox checked={gradeIds.indexOf('all') > -1} />
            </MenuItem>
            {grades.map(item => (
              <MenuItem sx={{ height: 33, padding: 0, margin: 0, ml: 3 }} key={item.id} value={item.id}>
                <ListItemText primary={item.name} />
                <Checkbox checked={gradeIds.indexOf(item.id) > -1} />
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={6} md={3} sx={{ display: 'flex', justifyContent: 'flex-start' }}>
          <Box style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Typography>Image</Typography>
            <Switch checked={nameOnly} onChange={handleChangeSwitch} color='primary' />
            <Typography>Name</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={7}>
          <Box style={{ display: 'inline-flex', alignItems: 'center' }}>
            <Typography>
              <strong>Request By:</strong> Parents:
            </Typography>{' '}
            &nbsp;&nbsp;
            <p
              style={{ width: 35, height: 20, backgroundColor: 'white', boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)' }}
            />
            &nbsp;&nbsp;
            <Typography>Other:</Typography> &nbsp;&nbsp;
            <p
              style={{ width: 35, height: 20, backgroundColor: '#D7EEFE', boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)' }}
            />
          </Box>
        </Grid>
      </Grid>
      <Box>
        <Typography variant='h5'>Confirmed Requests</Typography>
      </Box>
      <Box>
        {sortedReq?.length > 0 ? (
          <div style={{ display: 'flex', width: '100%', flexWrap: 'wrap', gap: 5 }}>
            <VirtualGrid
              cellRenderer={cellRenderer}
              columnCount={columnCount}
              rowCount={rowCount}
              columnWidth={isMobile ? window.innerWidth / 2.2 : 150}
              rowHeight={isMobile ? 125 : 120}
              width={window.innerWidth}
              height={window.innerHeight - 200}
            />
          </div>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant='h5' sx={{ textAlign: 'center', mt: 30 }}>
              No sent requests found yet
            </Typography>
          </Box>
        )}
      </Box>
    </div>
  )
}

const GradeColBody = ({ isMobile, key, student, isFromTop, grades, nameOnly }) => {
  const [request, setRequest] = useState({})
  const [requests, setRequests] = useRequests()

  useEffect(() => {
    if (requests?.length && student) {
      const existing = requests?.find(r => r.studentId == student.id)

      const sortedRequests = requests.sort((x, y) => Number(new Date(y.requestTime)) - Number(new Date(x.requestTime)))

      if (existing) {
        setRequests(sortedRequests)
        setRequest(existing)
      }
    }
  }, [requests, requests?.length])

  if (request?.status === 2) {
    return (
      <StudentCardApproved
        nameOnly={nameOnly}
        request={request}
        student={student}
        key={student.id}
        isMobile={isMobile}
      />
    )
  }
}

const TEMP_IMG = studentImage

const StudentCardApproved = ({ nameOnly, request, student, isMobile }) => {
  if (request?.pickUpGuardian === 'parent') {
    return (
      <Box
        sx={{
          p: 2,
          mt: 4,
          backgroundColor: '#E7F8EB',
          border: '2px solid #067A25',
          borderRadius: 1,
          width: isMobile ? '96%' : '140px',
          height: isMobile ? '130x' : '102px'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
          <Box
            sx={{
              display: nameOnly ? 'none' : '',
              width: '50px',
              height: '50px',
              minWidth: '50px',
              overflow: 'hidden',
              borderRadius: 1
            }}
          >
            <img
              src={student?.profileUrl || TEMP_IMG.src || TEMP_IMG}
              alt={student?.name ? student.name : student?.nameAr}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </Box>
          <Tooltip title={student?.name ? student.name : student?.nameAr}>
            <Box
              className={nameOnly ? 'short-stname body2' : 'short-stname-with-image body2'}
              sx={{ minHeight: 40, color: '#000000', ml: 1, fontSize: nameOnly ? '15px' : '12px', width: '120px' }}
            >
              {student?.name ? student.name : student?.nameAr}
            </Box>
          </Tooltip>
        </Box>
        <Box>
          <Tooltip placement='right' title='Parent has confirmed the request!'>
            <Typography
              variant='body1'
              sx={{
                textTransform: 'uppercase',
                mt: 2,
                textAlign: 'center',
                color: '#2f4d33',
                fontWeight: 'bold',
                fontSize: isMobile ? 14 : 18
              }}
            >
              Confirmed
            </Typography>
          </Tooltip>
        </Box>
      </Box>
    )
  } else {
    return (
      <Box
        sx={{
          p: 2,
          mt: 4,
          backgroundColor: '#D7EEFE',
          border: '2px solid #006BAA',
          borderRadius: 1,
          width: isMobile ? '96%' : '140px',
          height: isMobile ? '130x' : '102px'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
          <Box
            sx={{
              display: nameOnly ? 'none' : '',
              width: '50px',
              height: '50px',
              minWidth: '50px',
              overflow: 'hidden',
              borderRadius: 1
            }}
          >
            <img
              src={student?.profileUrl || TEMP_IMG.src || TEMP_IMG}
              alt={student?.name ? student.name : student?.nameAr}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </Box>
          <Box
            className={nameOnly ? 'short-stname body2' : 'short-stname-with-image body2'}
            sx={{ color: '#000000', ml: 1, fontSize: nameOnly ? '20px' : '12px', width: '120px' }}
          >
            {student?.name ? student.name : student?.nameAr}
          </Box>
        </Box>
        <Box>
          <Tooltip placement='right' title={`${request?.pickUpGuardian} has confirmed the request!`}>
            <Typography
              variant='body1'
              sx={{
                textTransform: 'uppercase',
                mt: 2,
                textAlign: 'center',
                color: '#006BAA',
                fontWeight: 'bold',
                fontSize: isMobile ? 14 : 18
              }}
            >
              Confirmed
            </Typography>
          </Tooltip>
        </Box>
      </Box>
    )
  }
}

export default ConfirmedRequestsBody
