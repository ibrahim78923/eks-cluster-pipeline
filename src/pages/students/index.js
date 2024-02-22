import * as React from 'react'

import { useEffect, useState } from 'react'

import { useAuth } from '../../hooks/useAuth'
import { getByClientId } from '../../services/student.service'
import { getByClientId as getSchoolByClientId } from '../../services/school.service'

import { Icon } from '@iconify/react'
import { Divider, Menu, MenuItem } from '@mui/material'
import ImportModal from 'src/views/students/ImportModal'
import { useSettings } from 'src/@core/hooks/useSettings'

import {
  AddStudentModal,
  SendBulkModal,
  PromoteStudentsModal,
  AssistantDetail,
  DownloadSampleCSV
} from 'src/views/students'
import { Table } from 'antd'

import { Grid, Button, Box, Typography, IconButton, Card, Tooltip, TextField } from '@mui/material'

import { EditStudentModal, DeleteStudentModal } from 'src/views/students'
import { toast } from 'react-hot-toast'
import { sendStundetCredentials } from '../../services/student.service'
import { getAllRequests } from 'src/services/request.service'

import getColumns from './columns'
import FilterForm from './filterForm'
import ImportStudentDetailModal from './Modal/DialogCreateApp'
import Link from 'next/link'

const Students = () => {
  const [isAddModalVisible, setAddModalVisible] = useState(false)
  const [isAssistantModalVisible, setAssistantModalVisible] = useState(false)
  const [isSendBulkModalVisible, setSendBulkAddModalVisible] = useState(false)
  const [isPromoteModalVisible, setPromoteModalVisible] = useState(false)
  const [isImportModalVisible, setImportModalVisible] = useState(false)
  const [isDownloadCSVModalVisible, setDownloadCSVModalVisible] = useState(false)

  const [isEditModalVisible, setEditModalVisible] = useState(false)
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false)

  const [student, setStudent] = useState({})
  const [students, setStudents] = useState([])
  const [schools, setSchools] = useState([])
  const [requests, setRequests] = useState([])

  const [schoolId, setSchoolId] = useState('')
  const [gradeId, setGradeId] = useState('')

  const [tableLoading, setTableLoading] = useState(false)
  const [studentId, setStudentId] = useState(null)
  const [show, setShow] = useState(false)
  const [importDetailData, setImportDetail] = useState([])

  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleMenuClick = e => setAnchorEl(e.currentTarget)
  const handleMenuClose = () => setAnchorEl(null)

  const auth = useAuth()
  const { settings, saveSettings } = useSettings()
  const [pagination, setPagination] = useState({
    pageSize: 10, // Initial page size
    current: 1 // Initial current page
  })
  const fetchStudents = async () => {
    setTableLoading(true)
    const data = await getByClientId(auth.user.id)

    if (data?.success) {
      setStudents(data.students)
      setTableLoading(false)
    } else {
      toast.error('Faild to fetch Students')
    }
  }

  const fetchSchools = async () => {
    const data = await getSchoolByClientId(auth.user.id)
    if (data?.success) {
      setSchools(data?.schools)
    }
  }
  const fetchRequests = async () => {
    const data = await getAllRequests(auth.user.id)
    if (data?.success) {
      setRequests(data?.requests)
    }
  }

  useEffect(() => {
    fetchStudents()
    fetchSchools()
  }, [])

  const openEditModal = data => {
    // setEditModalVisible(true)
    setAddModalVisible(true)
    setStudentId(data?.id)
    setStudent(data)
  }
  const closeEditModal = () => {
    // setEditModalVisible(false)
    setAddModalVisible(false)
    setStudentId(null)
  }

  const openDeleteModal = data => {
    setDeleteModalVisible(true)
    setStudent(data)
  }
  const closeDeleteModal = () => setDeleteModalVisible(false)

  const openAddModal = () => {
    setStudentId(null)
    setAddModalVisible(true)
  }
  const closeAddModal = () => {
    setStudentId('')
    setAddModalVisible(false)
  }
  const openAssistantModal = data => {
    setStudentId(data?.id)
    setAssistantModalVisible(true)
  }
  const closeAssistantModal = () => {
    setStudentId('')
    setAssistantModalVisible(false)
  }
  const openSendBulkModal = () => setSendBulkAddModalVisible(true)
  const closeSendBulkModal = () => setSendBulkAddModalVisible(false)
  const openPromoteModal = () => setPromoteModalVisible(true)
  const closePromoteModal = () => setPromoteModalVisible(false)

  const openDownloadCSV = () => setDownloadCSVModalVisible(true)
  const closeDownloadCSV = () => setDownloadCSVModalVisible(false)

  const openImportModal = () => setImportModalVisible(true)
  const closeImportModal = () => {
    setImportModalVisible(false)
    fetchStudents()
  }
  const handleImport = () => openImportModal()
  const handleExport = () => alert('Exporting')
  const handleTemplateExport = () => alert('Exporting Template')
  // searchbar
  const [loading, setLoadings] = useState(false)
  const [searchTitle, setSearchTitle] = useState('')

  const handleSend = async id => {
    console.log(id)
    const response = await sendStundetCredentials(id)
    if (response.success === true) {
      fetchStudents()
      toast.success(response.message)
    } else {
      toast.error(response.message)
    }
  }

  const passwordComp = row => (
    <PasswordComponent password={row?.parent?.password} username={row?.parent?.id} email={row?.parent?.email} />
  )
  const columns = getColumns({
    openAssistantModal,
    openEditModal,
    openDeleteModal,
    handleSend,
    passwordComp,
    pagination
  })

  const dataSource = schoolId
    ? students.filter(item => {
        if (searchTitle && gradeId) {
          return (
            item?.grade?.school?.id === schoolId &&
            item?.grade?.id === gradeId &&
            (item?.name?.toLowerCase()?.includes(searchTitle?.toLowerCase()) ||
              item?.parent?.email?.toLowerCase()?.includes(searchTitle?.toLowerCase()) ||
              item?.nameAr?.toLowerCase()?.includes(searchTitle?.toLowerCase()) ||
              JSON.stringify(item?.parent?.id)?.includes(searchTitle))
          )
        }
        if (gradeId) {
          return item?.grade?.school?.id === schoolId && item?.grade?.id === gradeId
        }
        if (searchTitle) {
          return (
            (item?.grade?.school?.id === schoolId &&
              item?.grade?.grade?.toUpperCase() === searchTitle?.toUpperCase()) ||
            item?.name?.toLowerCase()?.includes(searchTitle?.toLowerCase()) ||
            item?.parent?.email?.toLowerCase()?.includes(searchTitle?.toLowerCase()) ||
            item?.nameAr?.toLowerCase()?.includes(searchTitle?.toLowerCase()) ||
            JSON.stringify(item?.parent?.id)?.includes(searchTitle)
          )
        } else {
          return item?.grade?.school?.id === schoolId
        }
      })
    : students.filter(value => {
        if (searchTitle === '') {
          return true // Include all items when searchTitle is empty
        } else {
          return (
            value?.grade?.grade?.toUpperCase() === searchTitle?.toUpperCase() ||
            value?.name?.toLowerCase()?.includes(searchTitle?.toLowerCase()) ||
            value?.parent?.email?.toLowerCase()?.includes(searchTitle?.toLowerCase()) ||
            value?.nameAr?.toLowerCase()?.includes(searchTitle?.toLowerCase()) ||
            JSON.stringify(value?.parent?.id)?.includes(searchTitle)
          )
        }
      })

  const getRowClassName = (record, index) => {
    return index % 2 === 0 ? 'highlighted-row' : 'other-row' // Apply a class for even-numbered rows
  }

  return (
    <>
      <ImportStudentDetailModal data={importDetailData} setShow={setShow} show={show} />
      <Grid container spacing={5}>
        <Grid item xs={12}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Card style={{ padding: 10 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  padding: 3
                }}
              >
                <Typography variant='h5'>Student</Typography>
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '20px',
                    flexDirection: 'row-reverse'
                  }}
                >
                  <Button style={{ marginLeft: 10 }} variant='contained' color='primary' onClick={openSendBulkModal}>
                    Send Credentials in Bulk
                  </Button>
                  <Button style={{ marginLeft: 10 }} variant='contained' color='primary' onClick={openPromoteModal}>
                    Promote Students
                  </Button>
                  <Button
                    variant='outlined'
                    color='primary'
                    onClick={handleMenuClick}
                    sx={{ textTransform: 'none', mx: 1 }}
                  >
                    <Icon icon='bi:file-earmark-spreadsheet' fontSize='large' />
                    &nbsp;Bulk Upload
                    <Icon icon='material-symbols:keyboard-arrow-down-rounded' />
                  </Button>
                  <Link href={'/print-multi-card'} target='_blank'>
                    <Button style={{ marginLeft: 10 }} variant='contained' color='primary'>
                      Print Bulk Cards
                    </Button>
                  </Link>
                  <Menu
                    id='basic-menu'
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleMenuClose}
                    MenuListProps={{
                      'aria-labelledby': 'basic-button'
                    }}
                  >
                    <MenuItem
                      onClick={() => {
                        handleImport()
                        handleMenuClose()
                      }}
                      sx={{ width: 165, fontSize: 15 }}
                    >
                      <Icon icon='material-symbols:upload-rounded' fontSize='large' />
                      &nbsp;Import CSV
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        openDownloadCSV()
                        handleMenuClose()
                      }}
                      sx={{ width: 165, fontSize: 15 }}
                    >
                      <Icon icon='material-symbols:download-rounded' fontSize='large' />
                      &nbsp;Sample CSV
                    </MenuItem>
                  </Menu>
                </Box>
              </Box>
              <Divider />
              <Typography variant='h6' sx={{ ml: 3 }}>
                Search Filters
              </Typography>
              <Grid container>
                <Grid item xs={12} md={8}>
                  <FilterForm
                    schools={schools}
                    setSchoolId={setSchoolId}
                    schoolId={schoolId}
                    setGradeId={setGradeId}
                    gradeId={gradeId}
                  />
                </Grid>
              </Grid>
              <Divider />
              <Box
                style={{
                  textAlign: 'right',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  justifyContent: 'flex-end'
                }}
              >
                <TextField label='Search' variant='outlined' onChange={e => setSearchTitle(e.target.value)} />
                <Button style={{ height: 48 }} variant='contained' color='primary' onClick={openAddModal}>
                  Add Student
                </Button>
              </Box>
              <Table
                className={
                  settings?.mode.includes('dark')
                    ? 'dark custom-table ant-pagination-total-text student-Table fix_left_dark fix_right_dark'
                    : 'light student-Table-light'
                }
                dataSource={dataSource}
                columns={columns}
                size='small'
                loading={tableLoading}
                pagination={{
                  defaultCurrent: 1,
                  total: dataSource?.length,
                  defaultPageSize: 10,
                  showSizeChanger: true,
                  showTotal: (total, range) => `Total: ${total}`,
                  pageSizeOptions: ['10', '20', '50', '100'],
                  locale: { items_per_page: '' }
                }}
                rowClassName={getRowClassName}
                onChange={pagination => setPagination(pagination)}
                scroll={{
                  x: true
                }}
              />
            </Card>
          </Box>
        </Grid>
        <ImportModal
          setImportDetail={setImportDetail}
          setOpenImportDetialModal={setShow}
          isOpen={isImportModalVisible}
          handleClose={closeImportModal}
        />
        <DownloadSampleCSV isOpen={isDownloadCSVModalVisible} handleClose={closeDownloadCSV} />
        <AddStudentModal
          onSubmit={fetchStudents}
          isOpen={isAddModalVisible}
          handleClose={closeAddModal}
          studentId={studentId}
        />
        <AssistantDetail
          onSubmit={fetchStudents}
          isOpen={isAssistantModalVisible}
          handleClose={closeAssistantModal}
          studentId={studentId}
        />
        <SendBulkModal onSubmit={fetchStudents} isOpen={isSendBulkModalVisible} handleClose={closeSendBulkModal} />
        <PromoteStudentsModal onSubmit={fetchStudents} isOpen={isPromoteModalVisible} handleClose={closePromoteModal} />
        <EditStudentModal
          onSubmit={fetchStudents}
          student={student}
          isOpen={isEditModalVisible}
          handleClose={closeEditModal}
        />
        <DeleteStudentModal
          onSubmit={fetchStudents}
          student={student}
          isOpen={isDeleteModalVisible}
          handleClose={closeDeleteModal}
        />
      </Grid>
    </>
  )
}

const PasswordComponent = ({ username, password, email }) => {
  const [isVisible, setVisible] = useState(false)

  const copyPassword = () => {
    // Copy the text inside the text field
    const content =
      'Username: ' +
      username +
      '\nPassword: ' +
      password +
      '\nEmail: ' +
      email +
      '\nApple: https://apps.apple.com/sa/app/ezpick-student-pick-up-system/id1673235177 ' +
      '\nAndroid: https://play.google.com/store/apps/details?id=com.app.ezpick&pli=1 '
    navigator.clipboard.writeText(content)

    // Alert the copied text
    toast.success('Copied Details')
    setVisible(false)
  }
  const copyPasswordOnly = () => {
    // Copy the text inside the text field
    const content = password
    navigator.clipboard.writeText(content)

    // Alert the copied text
    toast.success('Copied Password')
    setVisible(false)
  }

  return (
    <>
      {isVisible && (
        <Tooltip title='Click to Copy'>
          <Box sx={{ cursor: 'copy' }} onClick={copyPasswordOnly}>
            {password}
          </Box>
        </Tooltip>
      )}
      &nbsp;
      <IconButton onClick={() => setVisible(!isVisible)}>
        <Icon icon='ic:baseline-remove-red-eye' />
      </IconButton>
      <IconButton onClick={copyPassword}>
        <Icon icon='material-symbols:content-copy-outline' />
      </IconButton>
    </>
  )
}

const styles = {
  headingContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
}

export default Students
