import { useEffect, useState } from 'react'

import { AddGradeModal, DeleteGradeModal, EditGradeModal, DetailModal } from 'src/views/grades'

import { useAuth } from 'src/hooks/useAuth'

import NProgress from 'nprogress'
import { getByClientId } from 'src/services/grade.service'

import { Grid, Button, Box, Typography, Card, TextField, Divider } from '@mui/material'
import { Table } from 'antd'
import { useSettings } from 'src/@core/hooks/useSettings'

import getColumns from './columns'

const Grades = () => {
  const [grades, setGrades] = useState([])

  const [isAddModalVisible, setAddModalVisible] = useState(false)
  const [isEditModalVisible, setEditModalVisible] = useState(false)
  const [isDetailModalVisible, setDetailModalVisible] = useState(false)
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false)
  const [selectedGrade, setSelectedGrade] = useState({})
  const [searchTitle, setSearchTitle] = useState('')
  const [gradeId, setGradeId] = useState('')

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

  const fetchGrades = async () => {
    startLoading()
    const data = await getByClientId(auth.user.id)

    endLoading()
    if (data?.success) setGrades(data?.grades)
  }

  useEffect(() => {
    fetchGrades()
  }, [])

  const openAddModal = () => {
    setAddModalVisible(true)
    setGradeId('')
  }
  const closeAddModal = () => {
    setAddModalVisible(false)
    setGradeId('')
  }

  const openEditModal = data => {
    setAddModalVisible(true)
    setGradeId(data.id)
    setSelectedGrade(data)
  }
  const closeEditModal = () => {
    setAddModalVisible(false)
    setGradeId('')
  }
  const openDetailModal = data => {
    setDetailModalVisible(true)
    setGradeId(data.id)
  }
  const closeDetailModal = () => {
    setDetailModalVisible(false)
    setGradeId(null)
  }
  const openDeleteModal = data => {
    setDeleteModalVisible(true)
    setSelectedGrade(data)
  }
  const closeDeleteModal = () => setDeleteModalVisible(false)

  const columns = getColumns({ openEditModal, openDeleteModal, openDetailModal, pagination })

  return (
    <Grid container spacing={5}>
      <AddGradeModal onSubmit={fetchGrades} isOpen={isAddModalVisible} handleClose={closeAddModal} gradeId={gradeId} />
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          <Card style={{ width: 900, padding: 20 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 1
              }}
            >
              <Typography variant='h5'>Grades</Typography>
              <Button variant='contained' color='primary' onClick={openAddModal}>
                Add Grade
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
              dataSource={grades.filter(value => {
                if (searchTitle === '') {
                  return value
                } else if (value.name.toLowerCase().includes(searchTitle.toLowerCase())) {
                  return value
                }
              })}
              columns={columns}
              size='small'
              loading={isLoading}
              pagination={{
                defaultCurrent: 1,
                total: grades?.length,
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

      <EditGradeModal
        onSubmit={fetchGrades}
        grade={selectedGrade}
        isOpen={isEditModalVisible}
        handleClose={closeEditModal}
      />
      <DetailModal isOpen={isDetailModalVisible} handleClose={closeDetailModal} gradeId={gradeId} settings={settings} />
      <DeleteGradeModal
        onSubmit={fetchGrades}
        grade={selectedGrade}
        isOpen={isDeleteModalVisible}
        handleClose={closeDeleteModal}
      />
    </Grid>
  )
}

export default Grades
