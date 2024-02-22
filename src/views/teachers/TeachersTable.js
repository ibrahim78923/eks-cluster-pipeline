import { DataGrid } from '@mui/x-data-grid';

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { Icon } from "@iconify/react";
import * as React from "react";
import DialogShowTeacher from 'src/views/teachers/DialogShowTeacher'
import DialogEditTeacher from 'src/views/teachers/DialogEditTeacher'
import DialogDeleteTeacher from 'src/views/teachers/DialogDeleteTeacher'
import {useState} from "react";



const  TeachersTable = ({ teachers, setTeachers }) => {

  const [ isEditModalVisible, setEditModalVisible ] = useState(false)
  const [ isDeleteModalVisible, setDeleteModalVisible ] = useState(false)
  const [ isShowModalVisible, setShowModalVisible ] = useState(false)
  const [teacher, setTeacher] = useState({})

  const handleEditModalOpen = (data) => {
    setEditModalVisible(true)
    setTeacher(data)
  }
  const handleEditModalClose = () => {
    setEditModalVisible(false)
  }
  const handleShowModalOpen = (data) => {
    setShowModalVisible(true)
    setTeacher(data)
  }
  const handleShowModalClose = () => {
    setShowModalVisible(false)
  }
  const handleDeleteModalOpen = (data) => {
    setDeleteModalVisible(true)
    setTeacher(data)
  }
  const handleDeleteModalClose = () => {
    setDeleteModalVisible(false)
  }

  const editTeacher = (teacher) => {
    // old teachers
    const newTeachers = teachers.map(
      (s) => {
        if (s.id == teacher.id) {
           return teacher;
        } else return s;
      }
    )

    setTeachers(newTeachers)
  }


  const deleteTeacher = id => {
    const newTeachers = teachers.filter(
      (s) => {
        return s.id !== id;
      }
    )

    setTeachers(newTeachers)
  }

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'email', headerName: 'Email', width: 250 },
    // { field: 'campusId', headerName: 'Campus', width: 250, renderCell: params => params.row.grades ? params.row.campus.campus : '' },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => {
        return (
          <Box sx={{ display: "flex" }} >
            <IconButton color='primary' onClick={() => handleShowModalOpen(params.row)}><Icon  icon="ic:round-content-copy" /></IconButton>
            <IconButton color='primary' onClick={() => handleEditModalOpen(params.row)}><Icon  icon="material-symbols:edit" /></IconButton>
            <IconButton color='primary' onClick={() => handleDeleteModalOpen(params.row)}><Icon icon="material-symbols:delete-outline" /></IconButton>
          </Box>
        )
      },
    },
  ];

  return (
    <>
      <DataGrid
        rows={teachers}
        columns={columns}
        pageSize={20}
        rowsPerPageOptions={[10]}
        autoHeight
      />
      <DialogShowTeacher onSubmit={editTeacher} teacher={teacher} isOpen={isShowModalVisible} handleClose={handleShowModalClose} />
      <DialogEditTeacher onSubmit={editTeacher} teacher={teacher} isOpen={isEditModalVisible} handleClose={handleEditModalClose} />
      <DialogDeleteTeacher onSubmit={deleteTeacher} teacher={teacher} isOpen={isDeleteModalVisible} handleClose={handleDeleteModalClose} />
    </>
  );
}
export default TeachersTable;
