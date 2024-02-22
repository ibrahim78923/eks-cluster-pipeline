import { useEffect, useState } from 'react'
import { useSocket } from '/src/context/socket'
import { useRequests } from '/src/context/requests'
import { Box, Typography, Switch, Select, MenuItem, Checkbox, ListItemText, Tooltip, Grid } from '@mui/material'

import { updateSelectedGrade } from 'src/services/client.service'
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
const TEMP_IMG = studentImage

const RequestsBody = ({ grades }) => {
  const [gradeIds, setGradeIds] = useState(['all'])
  const [requests] = useRequests()
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
        setGradeIds(['all'])
        window.localStorage.setItem('selectedGrades', JSON.stringify(['all']))
        updateSelectedGrade(auth.user.id, JSON.stringify(['all']))
      } else {
        setGradeIds(value?.filter(item => item !== 'all'))
        window.localStorage.setItem('selectedGrades', JSON.stringify(value?.filter(item => item !== 'all')))
        updateSelectedGrade(auth.user.id, JSON.stringify(value?.filter(item => item !== 'all')))
      }
    }
  }
  useEffect(() => {
    const selectedGrades = JSON.parse(window.localStorage.getItem('selectedGrades'))
    if (selectedGrades) setGradeIds(selectedGrades)
    else if (auth.user?.selectedGrades ? JSON.parse(auth.user?.selectedGrades) : null)
      setGradeIds(JSON.parse(auth.user?.selectedGrades))
    else setGradeIds(['all'])
  }, [])

  useEffect(() => {
    const sortedSyudents = gradeIds?.includes('all')
      ? requests?.filter(item => item.status === 1 && auth?.user?.id === item?.clientId)
      : requests?.filter(
          item => gradeIds?.includes(item.gradeId) && item.status === 1 && auth?.user?.id === item?.clientId
        )
    setSortedReq(sortedSyudents)
  }, [requests, requests?.length, gradeIds])

  const [userData, setUserDate] = useState()
  const router = useRouter()

  useEffect(() => {
    const data = JSON.parse(window.localStorage.getItem('userData'))
    setUserDate(data)
  }, [router])

  // const [threshold, setThreshold] = useState(100)

  // const handleScroll = ({ scrollTop }) => {
  //   if (scrollTop < threshold + 100) {
  //     setIsLoading(true)
  //     setThreshold(scrollTop)
  //   }
  //   setTimeout(() => {
  //     setIsLoading(false)
  //   }, 1000)
  // }

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
              key={req?.student?.id}
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
        <Typography variant='h6'>Sent Requests</Typography>
      </Box>
      <Box>
        {sortedReq?.length > 0 ? (
          <div style={{ display: 'flex', width: '100%', flexWrap: 'wrap', gap: 10 }}>
            <VirtualGrid
              cellRenderer={cellRenderer}
              columnCount={columnCount}
              rowCount={rowCount}
              columnWidth={isMobile ? window.innerWidth / 2.2 : 150}
              rowHeight={isMobile ? 130 : 120}
              width={window.innerWidth}
              height={window.innerHeight - 200}
              // onScroll={handleScroll}
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

const GradeColBody = ({ isMobile, student, nameOnly }) => {
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

  if (request?.status === 1) {
    return <StudentCardConfirmed nameOnly={nameOnly} student={student} key={student.id} isMobile={isMobile} />
  }
}

const StudentCardConfirmed = ({ nameOnly, student, isMobile }) => {
  return (
    <Box
      sx={{
        p: 2,
        mt: 4,
        backgroundColor: '#FFFAEF',
        border: '2px solid #FFBD1D',
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
            sx={{
              minHeight: isMobile ? 60 : 50,
              color: '#000000',
              ml: 1,
              fontSize: nameOnly ? '15px' : '12px',
              width: '120px'
            }}
          >
            {student?.name ? student.name : student?.nameAr}
          </Box>
        </Tooltip>
      </Box>
      <Box>
        <Tooltip placement='right' title='Student has been sent.'>
          <Typography
            variant='body1'
            sx={{
              textTransform: 'uppercase',
              mt: 2,
              textAlign: 'center',
              color: '#FDB528',
              fontWeight: 'bold',
              fontSize: isMobile ? 14 : 18
            }}
          >
            Sent
          </Typography>
        </Tooltip>
      </Box>
    </Box>
  )
}

export default RequestsBody
