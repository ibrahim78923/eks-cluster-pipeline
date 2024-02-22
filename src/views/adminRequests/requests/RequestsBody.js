import { useEffect, useState } from 'react'

import { useSocket } from '/src/context/socket'
import { useRequests } from '/src/context/requests'

import { getByGradeId as getStudents } from 'src/services/student.service'
import { updateSelectedGrade } from 'src/services/client.service'
import { Box, Tooltip, Typography, Switch } from '@mui/material'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Checkbox from '@mui/material/Checkbox'
import ListItemText from '@mui/material/ListItemText'
import studentImage from 'public/images/avatars/student.png'
import Carousel from 'react-simply-carousel'
import style from './RequestBody.module.css'
import { useAuth } from 'src/hooks/useAuth'
import { useRouter } from 'next/router'

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

const NoData = () => <Box></Box>

const RequestsBody = ({ grades }) => {
  const [gradeName, setGradeName] = useState('all')
  const [activeSlideIndex, setActiveSlideIndex] = useState(0)
  const [gradeIds, setGradeIds] = useState(['all'])
  const [requests, setRequests] = useRequests()
  const [sortedReq, setSortedReq] = useState([])
  const [itemsToShow, setItemsToShow] = useState(3)
  const [isMobile, setIsMobile] = useState(false)
  const [nameOnly, setNameOnly] = useState(false)

  const auth = useAuth()

  const handleChangeSwitch = event => {
    setNameOnly(event.target.checked)
  }

  const [sorted, setSorted] = useState(false)
  const handleSelect = e => {
    setGradeName(e.target.value)
    if (e.target.value === 'all') {
      setSorted(false)
    } else {
      setSorted(true)
    }
  }

  const handleOnRequestChange = newActiveSlideIndex => {
    setActiveSlideIndex(newActiveSlideIndex)
  }

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
    const sortedSyudents = requests
      ?.filter(item => item.status === 0 && auth?.user?.id === item?.clientId)
      ?.sort((a, b) => {
        const aDate = Number(new Date(a.updatedAt))
        const bDate = Number(new Date(b.updatedAt))
        return bDate - aDate
      })
    setSortedReq(sortedSyudents)
  }, [requests, gradeIds])
  console.log(requests, 'requestsrequests')
  const handleResize = () => {
    // Adjust the number of items to show based on the screen size
    if (window.innerWidth < 600) {
      setItemsToShow(2)
      setIsMobile(true)
    } else if (window.innerWidth < 1100) {
      setItemsToShow(3)
      setIsMobile(false)
    } else if (window.innerWidth < 1300) {
      setItemsToShow(7)
      setIsMobile(false)
    } else if (window.innerWidth < 1500) {
      setItemsToShow(8)
      setIsMobile(false)
    } else if (window.innerWidth < 1800) {
      setItemsToShow(9)
      setIsMobile(false)
    } else if (window.innerWidth < 2100) {
      setItemsToShow(10)
      setIsMobile(false)
    } else if (window.innerWidth < 2400) {
      setItemsToShow(10)
      setIsMobile(false)
    } else if (window.innerWidth < 2700) {
      setItemsToShow(11)
      setIsMobile(false)
    } else {
      setItemsToShow(13)
      setIsMobile(false)
    }
  }

  useEffect(() => {
    // Listen for window resize events and update itemsToShow accordingly
    window.addEventListener('resize', handleResize)
    handleResize() // Call it initially to set the value based on the current screen size

    return () => {
      // Clean up the event listener when the component is unmounted
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const [userData, setUserDate] = useState()
  const router = useRouter()

  useEffect(() => {
    const data = JSON.parse(window.localStorage.getItem('userData'))
    setUserDate(data)
  }, [router])
  console.log(isMobile, 'isMobile')
  if (grades) {
    return !grades.length ? (
      <NoData />
    ) : (
      <div className={!userData?.status ? 'blury-display' : ''}>
        <Box sx={{ display: 'flex', width: '100%', flexWrap: 'wrap', gap: 10 }}>
          <Box>
            <Select
              labelId='my-select-label'
              id='my-select'
              multiple
              value={gradeIds}
              onChange={handleChange}
              MenuProps={MenuProps}
              style={{ width: 200 }}
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
                <Checkbox checked={gradeIds?.indexOf('all') > -1} />
              </MenuItem>
              {grades.map(item => (
                <MenuItem sx={{ height: 33, padding: 0, margin: 0, ml: 3 }} key={item.id} value={item.id}>
                  <ListItemText primary={item.name} />
                  <Checkbox checked={gradeIds?.indexOf(item.id) > -1} />
                </MenuItem>
              ))}
            </Select>
          </Box>
          <Box style={{ display: 'inline-flex', alignItems: 'center' }}>
            <Typography>Name with Image</Typography>
            <Switch checked={nameOnly} onChange={handleChangeSwitch} color='primary' />
            <Typography>Name Only</Typography>
          </Box>
          <Box style={{ display: 'inline-flex', alignItems: 'center' }}>
            <Typography>Parents Requests:</Typography> &nbsp;&nbsp;
            <p
              style={{ width: 35, height: 20, backgroundColor: 'white', boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)' }}
            />
            &nbsp;&nbsp;
            <Typography>Other Requests:</Typography> &nbsp;&nbsp;
            <p
              style={{ width: 35, height: 20, backgroundColor: '#D7EEFE', boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)' }}
            />
          </Box>
        </Box>
        {/* <br /> */}
        {/* <Box>
        {sortedReq?.length > 0 ?
          <div style={{display: "flex", width: "100%", overflowX: "auto",overflowY: "hidden", gap: 5}}>
            {
              sortedReq?.map((req)=> {
                return(
                  <GradeColBody key={req?.student?.id} student={req?.student} isFromTop={true} grades={grades} />
                )
              })
            }
          </div>
            : null
          }
        </Box> */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            // px: 1
            paddingX: 5
          }}
          className={style.parent}
        >
          <Box sx={{ display: 'flex' }} className={style.child}>
            {gradeIds?.includes('all') ? (
              <Carousel
                activeSlideIndex={activeSlideIndex}
                onRequestChange={handleOnRequestChange}
                itemsToShow={itemsToShow}
                itemsToScroll={1}
                backwardBtnProps={{
                  children: '<',
                  style: {
                    width: 40,
                    height: 40,
                    marginTop: 28,
                    marginRight: isMobile ? -5 : 15,
                    zIndex: isMobile ? 1 : 0,
                    backgroundColor: 'black',
                    borderRadius: 50,
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: 20,
                    position: isMobile ? 'absolute' : 'sticky',
                    left: -15,
                    zIndex: 1
                  }
                }}
                forwardBtnProps={{
                  children: '>',
                  style: {
                    width: 40,
                    height: 40,
                    marginTop: 28,
                    marginLeft: isMobile ? -20 : 0,
                    zIndex: isMobile ? 1 : 0,
                    backgroundColor: 'black',
                    borderRadius: 50,
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: 20,
                    position: isMobile ? 'absolute' : 'sticky',
                    right: -15
                  }
                }}
                containerProps={{
                  style: {
                    width: 'max-content'
                  }
                }}
                easing='linear'
              >
                {grades.map((grade, i) => (
                  <Box>
                    <GradeCol
                      isMobile={isMobile}
                      isAllGrades={gradeIds?.includes('all')}
                      key={grade.id}
                      grade={grade}
                      nameOnly={nameOnly}
                    />
                  </Box>
                ))}
              </Carousel>
            ) : (
              // : gradeIds?.length === 1 ? (
              //   grades
              //     ?.filter(item => gradeIds?.includes(item.id))
              //     ?.map((grade, i) => (
              //       <Box>
              //         <GradeCol
              //           nameOnly={nameOnly}
              //           isAllGrades={gradeIds?.includes('all')}
              //           key={grade.id}
              //           grade={grade}
              //         />
              //       </Box>
              //     ))
              // )
              <Carousel
                activeSlideIndex={activeSlideIndex}
                onRequestChange={handleOnRequestChange}
                itemsToShow={itemsToShow}
                itemsToScroll={1}
                backwardBtnProps={{
                  children: '<',
                  style: {
                    width: 40,
                    height: 40,
                    marginTop: 28,
                    marginRight: isMobile ? -5 : 15,
                    zIndex: isMobile ? 1 : 0,
                    backgroundColor: 'black',
                    borderRadius: 50,
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: 20,
                    position: 'sticky',
                    left: -15,
                    zIndex: 1
                  }
                }}
                forwardBtnProps={{
                  children: '>',
                  style: {
                    width: 40,
                    height: 40,
                    marginTop: 28,
                    marginLeft: isMobile ? -20 : 0,
                    zIndex: isMobile ? 1 : 0,
                    backgroundColor: 'black',
                    borderRadius: 50,
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: 20,
                    position: 'sticky',
                    right: -15
                  }
                }}
                containerProps={{
                  style: {
                    width: 'max-content'
                  }
                }}
              >
                {grades
                  ?.filter(item => gradeIds?.includes(item.id))
                  ?.map((grade, i) => (
                    <Box>
                      <GradeCol
                        nameOnly={nameOnly}
                        isAllGrades={gradeIds?.includes('all')}
                        key={grade.id}
                        grade={grade}
                        gradeIds={gradeIds}
                        isMobile={isMobile}
                      />
                    </Box>
                  ))}
              </Carousel>
            )}
          </Box>
        </Box>
      </div>
    )
  }

  return <NoData />
}

const GradeCol = ({ gradeIds, nameOnly, isMobile, isAllGrades, grade }) => {
  const [show, setShow] = useState(true)

  const [students, setStudents] = useState([])
  const [requests, setRequests] = useRequests()
  const [socket] = useSocket()

  useEffect(() => {
    getStudents(grade.id).then(res => {
      if (res?.success) {
        setStudents(res.students)
      }
    })
  }, [grade.id])

  useEffect(() => {
    if (students?.length) {
      const sortedSyudents = students?.slice()?.sort((a, b) => {
        const aIndex = requests?.findIndex(req => req.studentId === a.id)
        const bIndex = requests?.findIndex(req => req.studentId === b.id)
        const aDate = aIndex >= 0 ? Number(new Date(requests[aIndex].updatedAt)) : null
        const bDate = bIndex >= 0 ? Number(new Date(requests[bIndex].updatedAt)) : null
        return bDate - aDate
      })
      setStudents(sortedSyudents)
    }
  }, [requests, socket])

  return (
    <Box sx={{ maxWidth: isMobile ? '150px' : '100%', height: 'auto', mr: '8px' }} key={grade?.id}>
      <GradeColHeader gradeIds={gradeIds} isMobile={isMobile} grade={grade} />
      <div id='GradeColBody' className={gradeIds?.length > 4 && isMobile ? '' : style.cardStyle}>
        {show === true ? (
          <>
            {students?.length > 0 &&
              students?.map((student, index) => (
                <GradeColBody nameOnly={nameOnly} isMobile={isMobile} key={student?.id} student={student} />
              ))}
          </>
        ) : null}
      </div>
    </Box>
  )
}

const GradeColHeader = ({ gradeIds, isMobile, grade }) => {
  return (
    <Box sx={{ position: 'sticky', top: 0, mt: 7 }}>
      <Typography
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',

          width: isMobile
            ? '150px'
            : gradeIds?.length === 1
            ? '90vw'
            : gradeIds?.length === 2
            ? '37vw'
            : gradeIds?.length === 3
            ? '25vw'
            : gradeIds?.length === 4
            ? '23vw'
            : '160px',
          minHeight: '42px',
          background: theme => theme.palette.primary.main,
          borderRadius: '6px',
          color: 'white'
        }}
        variant='body2'
      >
        {grade.name}
      </Typography>
    </Box>
  )
}

const DURATION = 90

const GradeColBody = ({ nameOnly, isMobile, key, student, isFromTop, grades }) => {
  const [request, setRequest] = useState()
  const [timer, setTimer] = useState(DURATION)
  const [requests, setRequests] = useRequests()
  const [socket] = useSocket()

  useEffect(() => {
    if (requests?.length && student) {
      const existing = requests?.find(r => r.studentId == student.id)

      const sortedRequests = requests.sort((x, y) => Number(new Date(y.requestTime)) - Number(new Date(x.requestTime)))

      if (existing) {
        setRequests(sortedRequests)
        setRequest(existing)
      }
    }
  }, [requests])

  useEffect(() => {
    if (request) {
      let seconds =
        DURATION - Math.floor(Math.abs(new Date().getTime() - new Date(request.requestTime).getTime()) / 1000)
      setTimer(seconds)
    }
  }, [request?.requestTime])

  const updateRequestStatus = () => {
    setRequest({ ...request, status: 1 })
  }

  if (request) {
    switch (request.status) {
      // case 0:
      //   return (
      //     <StudentCardRequested
      //       student={student}
      //       requestId={request.id}
      //       requestTime={request.requestTime}
      //       timer={timer}
      //       setTimer={setTimer}
      //       isTimedOut={timer <= 0}
      //       updateRequestStatus={updateRequestStatus}
      //       key={student.id}
      //       isFromTop={isFromTop}
      //       grades={grades}
      //       setRequests={setRequests}
      //       request={request}
      //       isMobile={isMobile}
      //     />
      //   )
      case 1:
        return <StudentCardConfirmed nameOnly={nameOnly} student={student} key={student.id} isMobile={isMobile} />
      case 2:
        return (
          <StudentCardApproved
            nameOnly={nameOnly}
            request={request}
            student={student}
            key={student.id}
            isMobile={isMobile}
          />
        )
      default:
        return <></>
    }
  } else {
    return !isFromTop && <StudentCardDisabled nameOnly={nameOnly} student={student} key={key} isMobile={isMobile} />
  }
}

const TEMP_IMG = studentImage

// const StudentCardRequested = ({
//   student,
//   requestId,
//   updateRequestStatus,
//   timer,
//   setTimer,
//   isTimedOut,
//   requestTime,
//   isFromTop,
//   grades,
//   setRequests,
//   request,
//   isMobile
// }) => {
//   const [socket] = useSocket()

//   const [timerInterval, setTimerInterval] = useState(null)
//   const auth = useAuth()

//   useEffect(() => {
//     // if (!timerInterval) {
//       var interval = setInterval(() => {
//         if (timer >= 0) setTimer(t => t - 1)
//         // else clearInterval(interval)
//       }, 1000)
//       setTimerInterval(interval)
//     // }

//     return () => {
//       if (timerInterval) {
//         clearInterval(timerInterval)
//       }
//     }
//   }, [student.id])

//   const approveRequest = () => {
//     // alert('Approving Student ' + student.id)
//     // Emit an event
//     socket.emit('_approve_request', { requestId })
//     setRequests(prevArray => {
//       // Find the object with the specified id
//       const updatedArray = prevArray.map(obj => {
//         if (obj.id === requestId) {
//           // Update the name of the object
//           return { ...obj,status: 1};
//         }
//         return obj;
//       });

//       return updatedArray;
//     });
//     updateRequestStatus()
//   }
//   if(!isFromTop){
//   return (
//     <Box
//       sx={{
//         width: isMobile? '150px' : '200px',
//         height: 'auto',
//         boxShadow: '2px 2px 10px -7px black',
//         border: '2px solid #2f4d33',
//         borderRadius: '10px',
//         transition: '0.25s all ease-in-out',

//         p: 2,
//         mt: 1
//       }}
//     >
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//         <Box sx={{ width: '50px', height: '50px', minWidth: '50px', overflow: 'hidden', borderRadius: 1 }}>
//           <img
//             src={student?.profileUrl || TEMP_IMG.src || TEMP_IMG}
//             style={{ width: '100%', height: '100%', objectFit: 'cover' }}
//             alt={student?.name ? student.name : student.nameAr}
//           />
//         </Box>
//         <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end', flexDirection: 'column' }}>
//           {isTimedOut ? (
//             <Typography
//               component='span'
//               sx={{
//                 color: 'red',
//                 textTransform: 'uppercase',
//                 fontSize: '16px',
//                 mr: 2,
//                 fontWeight: 'bold',
//                 textAlign: 'center'
//               }}
//             >
//               Timed <br /> Out
//             </Typography>
//           ) : (
//             <>
//               <Typography component='span' sx={{ color: '#ffbd1d', fontSize: '26px', fontWeight: 'bold' }}>
//                 {timer}
//               </Typography>
//               <Typography component='span' sx={{ fontSize: '13px', color: 'black' }}>
//                 Secs Left
//               </Typography>
//             </>
//           )}
//         </Box>
//       </Box>

//       <Box sx={{ fontSize: '12px', fontWeight: 'bold', lineHeight: 1, my: 4 }}>{student?.name ? student.name : student.nameAr}</Box>

//       <Box
//         sx={{
//           width:  isMobile? '130px' : '180px',
//           height: isMobile? '30px' : '38px',
//           background: 'transparent linear-gradient(102deg, #067a25 0%, #2f4d33 100%) 0% 0% no-repeat padding-box',
//           boxShadow: '0px 3px 6px #00000029',
//           borderRadius: '5px',
//           color: 'white',
//           cursor: 'pointer',
//           transition: '0.25s all ease-in-out',

//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',

//           '&:hover': {
//             background: 'transparent linear-gradient(102deg, #2f4d33 0%, #067a25 100%) 0% 0% no-repeat padding-box'
//           }
//         }}
//         onClick={approveRequest}
//       >
//         CONFIRM
//       </Box>
//     </Box>
//   )} else{
//     return (
//       <Box
//         sx={{
//           width: '140px',
//           height:"99px",
//           boxShadow: '2px 2px 10px -7px black',
//           border: '2px solid #2f4d33',
//           borderRadius: '10px',
//           transition: '0.25s all ease-in-out',
//           marginTop: 0,
//           p: 1,
//           mt: 1,
//           marginBottom: 1
//         }}
//       >
//         <Box sx={{ display: 'flex', justifyContent: "flex-start", alignItems: 'center'}}>
//           <Box sx={{ width: '40px', height: '40px', minWidth: '40px', overflow: 'hidden', borderRadius: 1, marginRight: 1  }}>
//             <img
//               src={student?.profileUrl || TEMP_IMG.src || TEMP_IMG}
//               style={{ width: '100%', height: '100%', objectFit: 'cover'}}
//               alt={student?.name ? student.name : student.nameAr}
//             />
//           </Box>
//           <Box sx={{fontSize: '12px', fontWeight: 'bold', lineHeight: 1, my: 4, margin: 0 }}>{student?.name ? student.name : student.nameAr}</Box>
//         </Box>
//         <Box sx={{fontSize: '10px', fontWeight: 'bold'}}>{`Grade: ${grades?.filter((item)=> item.id === student?.gradeId)[0]?.name}`}</Box>
//         <Box sx={{ display: 'flex', justifyContent: "space-between", alignItems: 'center' }}>
//         <Box
//           sx={{
//             width: '80px',
//             height: '26px',padding: 2,
//             background: 'transparent linear-gradient(102deg, #067a25 0%, #2f4d33 100%) 0% 0% no-repeat padding-box',
//             boxShadow: '0px 3px 6px #00000029',
//             borderRadius: '5px',
//             color: 'white',
//             cursor: 'pointer',
//             transition: '0.25s all ease-in-out',

//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',

//             '&:hover': {
//               background: 'transparent linear-gradient(102deg, #2f4d33 0%, #067a25 100%) 0% 0% no-repeat padding-box'
//             }
//           }}
//           onClick={approveRequest}
//         >
//           CONFIRM
//         </Box>
//         <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end', flexDirection: 'column', marginLeft: 1 }}>
//             {isTimedOut ? (
//               <Typography
//                 component='span'
//                 sx={{
//                   color: 'red',
//                   textTransform: 'uppercase',
//                   fontSize: '11px',
//                   mr: 2,
//                   fontWeight: 'bold',
//                   textAlign: 'center'
//                 }}
//               >
//                 Timed <br /> Out
//               </Typography>
//             ) : (
//               <Box sx={{display: 'flex'}}>
//                 <Typography component='span' sx={{ color: '#ffbd1d', fontSize: '21px', fontWeight: 'bold' }}>
//                   {timer}
//                 </Typography>
//                 <Typography component='span' sx={{ fontSize: '8px', color: 'black', marginTop: 1 }}>
//                   Sec<br/>Left
//                 </Typography>
//               </Box>
//             )}
//           </Box>
//         </Box>
//       </Box>
//     )
//   }
// }

const StudentCardDisabled = ({ nameOnly, student, isMobile }) => {
  return (
    <Box
      sx={{
        p: 2,
        mt: 4,
        border: '2px solid #707070',
        borderRadius: 1,
        minHeight: 100,
        width: isMobile ? '150px' : '160px',
        backgroundColor: '#E1E1E1'
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
            sx={{ minHeight: 50, color: '#000000', ml: 1, fontSize: nameOnly ? '15px' : '12px', width: '120px' }}
          >
            {student?.name ? student.name : student?.nameAr}
          </Box>
        </Tooltip>
      </Box>
      <Tooltip title='Waiting for Request'>
        <Typography
          variant='body1'
          sx={{
            textTransform: 'uppercase',
            mt: 2,
            textAlign: 'center',
            color: '#393939',
            fontWeight: 'bold',
            fontSize: isMobile ? 14 : 18
          }}
        >
          Unsend
        </Typography>
      </Tooltip>
    </Box>
  )
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
        width: isMobile ? '150px' : '160px',
        minHeight: 100
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
            sx={{ minHeight: 50, color: '#000000', ml: 1, fontSize: nameOnly ? '15px' : '12px', width: '120px' }}
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
          width: isMobile ? '150px' : '160px',
          minHeight: 100
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
              sx={{ minHeight: 50, color: '#000000', ml: 1, fontSize: nameOnly ? '15px' : '12px', width: '120px' }}
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
          width: isMobile ? '150px' : '160px',
          height: '100%'
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

export default RequestsBody
