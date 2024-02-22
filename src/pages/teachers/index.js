import {
  Grid,
  Button,
  Box,
  Typography,
  IconButton,
  Tooltip,
  Card,
  TextField,
  Menu,
  MenuItem,
  Divider
} from '@mui/material'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { useAuth } from 'src/hooks/useAuth'
import { useSettings } from 'src/@core/hooks/useSettings'
import { getByClientId } from 'src/services/teacher.service'
import {
  AddTeacherModal,
  DeleteTeacherModal,
  EditTeacherModal,
  SendBulkModal,
  DetailModal,
  DownloadSampleCSV
} from 'src/views/teachers'
import { Table } from 'antd'

import { Icon } from '@iconify/react'
import { toast } from 'react-hot-toast'
import { sendTeacherCredentials } from 'src/services/teacher.service'
import getColumns from './columns'
import ImportModal from 'src/views/teachers/ImportModal'

const Teachers = () => {
  const [teachers, setTeachers] = useState([])

  const [isAddModalVisible, setAddModalVisible] = useState(false)
  const [isEditModalVisible, setEditModalVisible] = useState(false)
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false)
  const [isBulkModalVisible, setBulkModalVisible] = useState(false)
  const [isDetailModalVisible, setDetailModalVisible] = useState(false)
  const [selectedTeacher, setSelectedTeacher] = useState({})
  const [tableLoading, setTableLoading] = useState(false)
  const [isImportModalVisible, setImportModalVisible] = useState(false)
  const [isDownloadCSVModalVisible, setDownloadCSVModalVisible] = useState(false)
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleMenuClick = e => setAnchorEl(e.currentTarget)
  const handleMenuClose = () => setAnchorEl(null)

  const { settings, saveSettings } = useSettings()
  const [pagination, setPagination] = useState({
    pageSize: 10, // Initial page size
    current: 1 // Initial current page
  })
  const [teacherId, setTeacherId] = useState(null)
  const auth = useAuth()

  const fetchTeachers = async () => {
    // startLoading()
    setTableLoading(true)
    const data = await getByClientId(auth.user.id)

    // endLoading()
    if (data?.success) {
      setTeachers(data.teachers)
      setTableLoading(false)
    } else {
      toast.error('Faild to fetch Teachers')
      setTableLoading(false)
    }
  }
  const handleSend = async username => {
    const response = await sendTeacherCredentials(username)
    if (response.success === true) {
      toast.success(response.message)
    } else {
      toast.error(response.message)
    }
  }
  useEffect(() => {
    fetchTeachers()
  }, [])

  // Add teacher Modal Visibility
  const openAddModal = () => {
    setAddModalVisible(true)
    setTeacherId(null)
  }
  const closeAddModal = () => {
    setAddModalVisible(false)
    setTeacherId(null)
  }
  const openDetailModal = data => {
    setDetailModalVisible(true)
    setTeacherId(data.id)
  }
  const closeDetailModal = () => {
    setDetailModalVisible(false)
    setTeacherId(null)
  }
  // Send credentials in Bulk Modal Visibility
  const openSendInBulkModal = () => setBulkModalVisible(true)
  const closeSendInBulkModal = () => setBulkModalVisible(false)

  const openDownloadCSV = () => setDownloadCSVModalVisible(true)
  const closeDownloadCSV = () => setDownloadCSVModalVisible(false)
  // Edit Modal Visibility
  const openEditModal = data => {
    // setEditModalVisible(true)
    setAddModalVisible(true)
    setTeacherId(data?.id)
    setSelectedTeacher(data)
  }
  const closeEditModal = () => {
    // setEditModalVisible(false)
    setTeacherId(null)
    setAddModalVisible(false)
  }

  // Delete Modal Visibility
  const openDeleteModal = data => {
    setDeleteModalVisible(true)
    setSelectedTeacher(data)
  }
  const openImportModal = () => setImportModalVisible(true)
  const closeImportModal = () => {
    setImportModalVisible(false)
    fetchTeachers()
  }
  const closeDeleteModal = () => setDeleteModalVisible(false)
  const handleImport = () => openImportModal()
  // searchbar
  const [searchTitle, setSearchTitle] = useState('')

  const passwordComp = row => <PasswordComponent password={row.password} username={row.id} email={row.email} />
  const columns = getColumns({ openEditModal, openDeleteModal, handleSend, passwordComp, pagination, openDetailModal })
  return (
    <Grid container spacing={5}>
      <AddTeacherModal
        onSubmit={fetchTeachers}
        isOpen={isAddModalVisible}
        handleClose={closeAddModal}
        teacherId={teacherId}
      />
      <SendBulkModal onSubmit={fetchTeachers} isOpen={isBulkModalVisible} handleClose={closeSendInBulkModal} />

      <Grid item xs={12}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Card style={{ width: 1220, minHeight: 750, padding: 20 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap'
              }}
            >
              <Typography variant='h5'>Teachers</Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '20px', flexDirection: 'row-reverse' }}>
                {/* <Button variant='contained' color='primary' onClick={openAddModal}>
              Add Teacher
            </Button> */}
                <Button variant='contained' color='primary' onClick={openSendInBulkModal}>
                  Send Credentials in Bulk
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
                Add Teacher
              </Button>
            </Box>
            <Table
              className={
                settings?.mode.includes('dark')
                  ? 'dark custom-table ant-pagination-total-text student-Table fix_left_dark fix_right_dark'
                  : 'light student-Table-light'
              }
              dataSource={teachers.filter(value => {
                if (searchTitle === '') {
                  return value
                } else if (
                  value?.name?.toLowerCase()?.includes(searchTitle?.toLowerCase()) ||
                  value?.nameAr?.toLowerCase()?.includes(searchTitle?.toLowerCase()) ||
                  value?.email?.toLowerCase()?.includes(searchTitle?.toLowerCase()) ||
                  JSON?.stringify(value?.id)?.includes(searchTitle)
                ) {
                  return value
                }
              })}
              size='small'
              columns={columns}
              loading={tableLoading}
              pagination={{
                defaultCurrent: 1,
                total: teachers?.length,
                defaultPageSize: 10,
                showSizeChanger: true,
                showTotal: (total, range) => `Total: ${total}`,
                pageSizeOptions: ['10', '20', '50', '100'],
                locale: { items_per_page: '' }
              }}
              onChange={pagination => setPagination(pagination)}
              scroll={{
                x: true
              }}
            />
          </Card>
        </Box>
      </Grid>
      <ImportModal isOpen={isImportModalVisible} handleClose={closeImportModal} />
      <DownloadSampleCSV isOpen={isDownloadCSVModalVisible} handleClose={closeDownloadCSV} />
      <EditTeacherModal
        onSubmit={fetchTeachers}
        teacher={selectedTeacher}
        isOpen={isEditModalVisible}
        handleClose={closeEditModal}
      />
      <DetailModal
        isOpen={isDetailModalVisible}
        handleClose={closeDetailModal}
        teacherId={teacherId}
        settings={settings}
      />
      <DeleteTeacherModal
        onSubmit={fetchTeachers}
        teacher={selectedTeacher}
        isOpen={isDeleteModalVisible}
        handleClose={closeDeleteModal}
      />
    </Grid>
  )
}

const PasswordComponent = ({ password, username, email }) => {
  const [isVisible, setVisible] = useState(false)

  const copyPassword = e => {
    // Copy the text inside the text field
    const content =
      'Username: ' + username + '\nPassword: ' + password + '\nEmail: ' + email + '\nSite: https://school.ezpick.co'
    navigator.clipboard.writeText(content)

    // Alert the copied text
    toast.success('Copied Password')
    setVisible(false)
  }
  const copyPasswordOnly = e => {
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

export default Teachers
