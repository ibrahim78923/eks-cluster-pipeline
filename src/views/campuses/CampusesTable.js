import { DataGrid } from '@mui/x-data-grid'

import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import { Icon } from '@iconify/react'
import * as React from 'react'
import DialogEditCampus from 'src/views/campuses/DialogEditCampus'
import DialogDeleteCampus from 'src/views/campuses/DialogDeleteCampus'
import { useState } from 'react'

const CampusesTable = ({ campuses, setCampuses }) => {
  const [isEditModalVisible, setEditModalVisible] = useState(false)
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false)
  const [campus, setCampus] = useState({})

  const handleEditModalOpen = data => {
    setEditModalVisible(true)
    setCampus(data)
  }
  const handleEditModalClose = () => {
    setEditModalVisible(false)
  }
  const handleDeleteModalOpen = data => {
    setDeleteModalVisible(true)
    setCampus(data)
  }
  const handleDeleteModalClose = () => {
    setDeleteModalVisible(false)
  }

  const editCampus = campus => {
    // old campuses
    const newCampuses = campuses.map(s => {
      if (s.id == campus.id) {
        return campus
      } else return s
    })

    setCampuses(newCampuses)
  }

  const deleteCampus = id => {
    const newCampuses = campuses.filter(s => {
      return s.id !== id
    })

    setCampuses(newCampuses)
  }

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 200 },
    {
      field: 'school.school',
      headerName: 'School',
      width: 250,
      renderCell: params => params.row.school ? params.row.school.school : ''
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: params => {
        return (
          <Box sx={{ display: 'flex' }}>
            <IconButton color='primary' onClick={() => handleEditModalOpen(params.row)}>
              <Icon icon='material-symbols:edit' />
            </IconButton>
            <IconButton color='primary' onClick={() => handleDeleteModalOpen(params.row)}>
              <Icon icon='material-symbols:delete-outline' />
            </IconButton>
          </Box>
        )
      }
    }
  ]

  return (
    <>
      <DataGrid rows={campuses} columns={columns} pageSize={20} rowsPerPageOptions={[10]} autoHeight />
      <DialogEditCampus
        onSubmit={editCampus}
        campus={campus}
        isOpen={isEditModalVisible}
        handleClose={handleEditModalClose}
      />
      <DialogDeleteCampus
        onSubmit={deleteCampus}
        campus={campus}
        isOpen={isDeleteModalVisible}
        handleClose={handleDeleteModalClose}
      />
    </>
  )
}
export default CampusesTable
