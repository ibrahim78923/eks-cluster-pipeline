import { useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'

import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import { Icon } from '@iconify/react'
import { DeleteGradeModal, EditGradeModal } from 'src/views/grades'

const GradesTable = ({ grades, setGrades }) => {
  const [isEditModalVisible, setEditModalVisible] = useState(false)
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false)
  const [grade, setGrade] = useState({})

  const handleEditModalOpen = data => {
    setEditModalVisible(true)
    setGrade(data)
  }
  const handleEditModalClose = () => {
    setEditModalVisible(false)
  }
  const handleDeleteModalOpen = data => {
    setDeleteModalVisible(true)
    setGrade(data)
  }
  const handleDeleteModalClose = () => {
    setDeleteModalVisible(false)
  }

  const editGrade = grade => {
    const newGrades = grades.map(s => {
      if (s.id == grade.id) {
        return grade
      } else return s
    })

    setGrades(newGrades)
  }

  const deleteGrade = id => {
    const newGrades = grades.filter(s => {
      return s.id !== id
    })

    setGrades(newGrades)
  }

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 200 },
    {
      field: 'schoolName',
      headerName: 'School',
      width: 200,
      renderCell: params => (params.row.school ? params.row.school.school : '')
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
      <DataGrid rows={grades} columns={columns} pageSize={20} autoHeight />
      <EditGradeModal
        onSubmit={editGrade}
        grade={grade}
        isOpen={isEditModalVisible}
        handleClose={handleEditModalClose}
      />
      <DeleteGradeModal
        onSubmit={deleteGrade}
        grade={grade}
        isOpen={isDeleteModalVisible}
        handleClose={handleDeleteModalClose}
      />
    </>
  )
}
export default GradesTable
