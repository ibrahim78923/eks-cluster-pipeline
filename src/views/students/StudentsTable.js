import { DataGrid } from '@mui/x-data-grid'

import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import { Icon } from '@iconify/react'
import * as React from 'react'
import { useState } from 'react'
import DialogShowStudent from './DialogShowStudent'
import DeleteStudentModal from './DeleteStudentModal'
import { EditStudentModal } from '.'

const StudentsTable = ({ students, setStudents }) => {
  const handleShowModalOpen = data => {
    setShowModalVisible(true)
    setStudent(data)
  }
  const handleShowModalClose = () => {
    setShowModalVisible(false)
  }

  const editStudent = student => {
    const newStudents = students.map(s => {
      if (s.id == student.id) {
        return student
      } else return s
    })

    setStudents(newStudents)
  }

  const deleteStudent = id => {
    const newStudents = students.filter(s => {
      return s.id !== id
    })

    setStudents(newStudents)
  }

  const columns = [
    { field: 'id', headerName: 'ID', width: 20 },
    { field: 'name', headerName: 'Name', width: 130 },
    {
      field: 'gradeName',
      headerName: 'Grade',
      width: 75,
      renderCell: params => (params.row.grade ? params.row.grade.grade : '')
    },
    {
      field: 'parentEmail',
      headerName: 'Parent Email',
      width: 200,
      renderCell: params => (params.row.parent ? params.row.parent.parentEmail : '')
    },
    {
      field: 'parentPhoneNo',
      headerName: 'Parent Number',
      width: 150,
      renderCell: params => (params.row.parent ? params.row.parent.parentPhoneNo : '')
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: params => {
        return (
          <Box sx={{ display: 'flex' }}>
            {/* <IconButton color='primary' onClick={() => handleShowModalOpen(params.row)}>
              <Icon icon='ic:round-content-copy' />
            </IconButton> */}
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
      <DialogShowStudent
        onSubmit={editStudent}
        teacher={student}
        isOpen={isShowModalVisible}
        handleClose={handleShowModalClose}
      />
      <DataGrid rows={students} columns={columns} pageSize={50} autoHeight />
    </>
  )
}
export default StudentsTable
