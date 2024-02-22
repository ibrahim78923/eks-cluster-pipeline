import { useEffect, useState } from 'react'

import { StudentDetail, DeleteParentModal } from 'src/views/parents'

import { useAuth } from 'src/hooks/useAuth'

import NProgress from 'nprogress'
import { getByClientId } from 'src/services/parent.service'

import { Grid, Button, Box, Typography, Card, TextField, Tooltip, IconButton } from '@mui/material'
import { Table } from 'antd'
import { useSettings } from 'src/@core/hooks/useSettings'

import getColumns from './columns'
import { toast } from 'react-hot-toast'
import { Icon } from '@iconify/react'
import * as React from 'react'

const Parents = () => {
  const [parents, setParents] = useState([])

  const [isDetailModalVisible, setDetailModalVisible] = useState(false)
  const [searchTitle, setSearchTitle] = useState('')
  const [parentId, setParentId] = useState('')
  const [selectedParent, setSelectedParent] = useState('')
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false)

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

  const fetchParents = async () => {
    startLoading()
    const data = await getByClientId(auth.user.id)

    endLoading()
    if (data?.success) setParents(data?.parents)
  }

  useEffect(() => {
    fetchParents()
  }, [])

  const openDetailModal = data => {
    setDetailModalVisible(true)
    console.log(data)
    setParentId(data.id)
    setSelectedParent(data)
  }
  const closeDetailModal = () => {
    setDetailModalVisible(false)
    setParentId('')
  }
  const openDeleteModal = data => {
    setDeleteModalVisible(true)
    setParentId(data.id)
    setSelectedParent(data)
  }
  const closeDeleteModal = () => {
    setDeleteModalVisible(false)
    setParentId('')
  }

  const passwordComp = row => <PasswordComponent password={row?.password} username={row?.id} email={row?.email} />
  const columns = getColumns({
    openDeleteModal,
    openDetailModal,
    passwordComp,
    pagination
  })

  return (
    <Grid container spacing={5}>
      <Grid item xs={12}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography variant='h5'>Parents</Typography>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          <Card style={{ width: 1000, padding: 10 }}>
            <Box style={{ textAlign: 'right', marginBottom: '20px' }}>
              <TextField
                // id='outlined-basic'
                label='Search'
                variant='outlined'
                autoComplete='off'
                onChange={e => setSearchTitle(e.target.value)}
              />
            </Box>
            <Table
              className={
                settings?.mode.includes('dark')
                  ? 'dark custom-table ant-pagination-total-text student-Table fix_left_dark fix_right_dark'
                  : 'light student-Table-light'
              }
              dataSource={parents?.filter(value => {
                if (searchTitle === '') {
                  return value
                } else if (value?.name?.toLowerCase().includes(searchTitle.toLowerCase())) {
                  return value
                }
              })}
              columns={columns}
              size='small'
              loading={isLoading}
              pagination={{
                defaultCurrent: 1,
                total: parents?.length,
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
      <StudentDetail
        onSubmit={fetchParents}
        parent={selectedParent}
        isOpen={isDetailModalVisible}
        handleClose={closeDetailModal}
        parentId={parentId}
      />
      <DeleteParentModal
        onSubmit={fetchParents}
        parent={selectedParent}
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
export default Parents
