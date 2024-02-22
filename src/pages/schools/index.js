import { useEffect, useState } from 'react'

import { useAuth } from 'src/hooks/useAuth'

import { getByClientId } from 'src/services/school.service'

import { AddSchoolModal, DeleteSchoolModal, EditSchoolModal } from 'src/views/schools'
import {
  Grid,
  Button,
  Box,
  Typography,
  IconButton,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Tooltip,
  Card,
  TextField,
  Divider
} from '@mui/material'
import { useSettings } from 'src/@core/hooks/useSettings'
import NProgress from 'nprogress'
import { Icon } from '@iconify/react'
import { Table } from 'antd'

import { useJsApiLoader } from '@react-google-maps/api'
import usePlacesAutocompleteService from 'react-google-autocomplete/lib/usePlacesAutocompleteService'
import getColumns from './columns'

const Schools = () => {
  // State for schools
  const [schools, setSchools] = useState([])

  // State for the modals
  const [selectedSchool, setSelectedSchool] = useState(null)
  const [isAddModalVisible, setAddModalVisible] = useState(false)
  const [isEditModalVisible, setEditModalVisible] = useState(false)
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false)

  const [isLoading, setLoading] = useState(true)
  const { settings, saveSettings } = useSettings()
  const [searchTitle, setSearchTitle] = useState('')
  const [pagination, setPagination] = useState({
    pageSize: 10, // Initial page size
    current: 1 // Initial current page
  })

  const placesData = usePlacesAutocompleteService({
    apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY
  })
  const { isLoaded: isScriptLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY
  })

  const startLoading = () => {
    // NProgress.start()
    setLoading(true)
  }

  const endLoading = () => {
    // NProgress.done()
    setLoading(false)
  }

  // Auth to get the logged in user id
  const auth = useAuth()

  const fetchSchools = async () => {
    startLoading()
    const data = await getByClientId(auth.user.id)

    if (data?.success) {
      setSchools(data?.schools)
    }
    endLoading()
  }

  // get the school data when the page loads
  useEffect(() => {
    fetchSchools()
  }, [])

  // utility functions to interact with modal state for add
  const openAddModal = () => setAddModalVisible(true)
  const closeAddModal = () => setAddModalVisible(false)

  // utility functions to interact with modal state for edit
  const openEditModal = id => {
    setSelectedSchool(id)
    setEditModalVisible(true)
  }
  const closeEditModal = () => setEditModalVisible(false)

  // utility functions to interact with modal state for delete
  const openDeleteModal = id => {
    setSelectedSchool(id)
    setDeleteModalVisible(true)
  }
  const closeDeleteModal = () => setDeleteModalVisible(false)
  const columns = getColumns({ openEditModal, openDeleteModal, pagination })

  return (
    <Grid container spacing={5}>
      {isAddModalVisible && (
        <AddSchoolModal
          onSubmit={fetchSchools}
          isLoaded={isScriptLoaded}
          isOpen={isAddModalVisible}
          handleClose={closeAddModal}
          placesData={placesData}
        />
      )}
      {/* <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant='h5'>Schools</Typography>
          <Button variant='contained' color='primary' onClick={openAddModal}>
            Add School
          </Button>
        </Box>
      </Grid> */}
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Card style={{ width: 1000, padding: 20 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant='h5'>Schools</Typography>
              <Button variant='contained' color='primary' onClick={openAddModal}>
                Add School
              </Button>
            </Box>
            <Divider />
            <Box style={{ textAlign: 'right', marginBottom: '20px' }}>
              <TextField label='Search' variant='outlined' onChange={e => setSearchTitle(e.target.value)} />
            </Box>
            <Table
              className={
                settings?.mode.includes('dark')
                  ? 'dark custom-table ant-pagination-total-text student-Table fix_left_dark fix_right_dark'
                  : 'light student-Table-light'
              }
              dataSource={schools.filter(value => {
                if (searchTitle === '') {
                  return value
                } else if (value?.name?.toLowerCase()?.includes(searchTitle?.toLowerCase())) {
                  return value
                }
              })}
              columns={columns}
              size='small'
              loading={isLoading}
              pagination={{
                defaultCurrent: 1,
                total: schools?.length,
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

        {isEditModalVisible && (
          <EditSchoolModal
            onSubmit={fetchSchools}
            school={selectedSchool}
            isOpen={isEditModalVisible}
            handleClose={closeEditModal}
            isLoaded={isScriptLoaded}
            placesData={placesData}
          />
        )}
        <DeleteSchoolModal
          onSubmit={fetchSchools}
          school={selectedSchool}
          isOpen={isDeleteModalVisible}
          handleClose={closeDeleteModal}
        />
      </Grid>
    </Grid>
  )
}

export default Schools
