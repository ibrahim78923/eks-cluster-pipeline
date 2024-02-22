import { useEffect, useState } from 'react'

import { AddGuardModal, DeleteGuardModal, EditGuardModal } from 'src/views/guards'

import { useAuth } from 'src/hooks/useAuth'

import NProgress from 'nprogress'
import { getByClientId } from 'src/services/guard.service'

import { Grid, Button, Box, Typography, Card, TextField, Tooltip, IconButton, Divider } from '@mui/material'
import { Table } from 'antd'
import { useSettings } from 'src/@core/hooks/useSettings'

import getColumns from './columns'
import { toast } from 'react-hot-toast'
import { Icon } from '@iconify/react'
import * as React from 'react'

const Guards = () => {
  const [guards, setGuards] = useState([])

  const [isAddModalVisible, setAddModalVisible] = useState(false)
  const [isEditModalVisible, setEditModalVisible] = useState(false)
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false)
  const [selectedGuard, setSelectedGuard] = useState({})
  const [searchTitle, setSearchTitle] = useState('')
  const [guardId, setGuardId] = useState('')

  const { settings } = useSettings()
  const [pagination, setPagination] = useState({
    pageSize: 10, // Initial page size
    current: 1 // Initial current page
  })
  console.log(settings?.mode, 'settings')

  const [isLoading, setLoading] = useState(true)
  const startLoading = () => {
    NProgress.start()
    setLoading(true)
  }

  const endLoading = () => {
    NProgress.done()
    setLoading(false)
  }

  const auth = useAuth()

  const fetchGuards = async () => {
    startLoading()
    const data = await getByClientId(auth.user.id)

    endLoading()
    if (data?.success) setGuards(data?.parents)
  }

  useEffect(() => {
    fetchGuards()
  }, [])

  const openAddModal = () => {
    setAddModalVisible(true)
    setGuardId('')
  }
  const closeAddModal = () => {
    setAddModalVisible(false)
    setGuardId('')
  }

  const openEditModal = data => {
    setEditModalVisible(true)
    setGuardId(data.id)
    setSelectedGuard(data)
  }
  const closeEditModal = () => {
    setEditModalVisible(false)
    setGuardId('')
  }
  const openDeleteModal = data => {
    setDeleteModalVisible(true)
    setSelectedGuard(data)
  }
  const closeDeleteModal = () => setDeleteModalVisible(false)
  const passwordComp = row => <PasswordComponent password={row?.password} username={row?.id} email={row?.email} />
  const columns = getColumns({
    openEditModal,
    openDeleteModal,
    passwordComp,
    pagination
  })

  return (
    <Grid container spacing={5}>
      <AddGuardModal onSubmit={fetchGuards} isOpen={isAddModalVisible} handleClose={closeAddModal} guardId={guardId} />
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          <Card style={{ width: 1000, padding: 20 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <Typography variant='h5'>Security Guards</Typography>
              <Button variant='contained' color='primary' onClick={openAddModal}>
                Add Guards
              </Button>
            </Box>
            <Divider />
            <Box style={{ textAlign: 'right', marginBottom: '20px' }}>
              <TextField
                // id='outlined-basic'
                label='Search'
                variant='outlined'
                onChange={e => setSearchTitle(e.target.value)}
              />
            </Box>
            <Table
              className={
                settings?.mode.includes('dark')
                  ? 'dark custom-table ant-pagination-total-text student-Table fix_left_dark fix_right_dark'
                  : 'light student-Table-light'
              }
              dataSource={guards.filter(value => {
                if (searchTitle === '') {
                  return value
                } else if (value.name.toLowerCase().includes(searchTitle.toLowerCase())) {
                  return value
                }
              })}
              style={{ minHeight: 350 }}
              columns={columns}
              size='small'
              loading={isLoading}
              pagination={{
                defaultCurrent: 1,
                total: guards?.length,
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

      <EditGuardModal
        onSubmit={fetchGuards}
        guard={selectedGuard}
        isOpen={isEditModalVisible}
        handleClose={closeEditModal}
      />
      <DeleteGuardModal
        onSubmit={fetchGuards}
        guard={selectedGuard}
        isOpen={isDeleteModalVisible}
        handleClose={closeDeleteModal}
      />
    </Grid>
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
export default Guards
