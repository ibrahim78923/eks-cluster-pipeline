import React from 'react'
import { List, ListItem, ListItemIcon, ListItemText, Typography, Divider, Box } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'

const ExistingStudentsList = ({ newStudents }) => {
  return (
    <div style={{ maxHeight: '400px', overflowX: 'auto', marginBottom: 40 }}>
      <Typography variant='h5'>New Students</Typography>
      <List>
        {newStudents?.length > 0 ? (
          newStudents?.map(student => (
            <div key={student.id}>
              <ListItem>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText
                  primary={`Name: ${student?.name}, Parent ID: ${student?.parentId}`}
                  secondary={`Gender: ${student?.gender}`}
                />
              </ListItem>
              <Divider />
            </div>
          ))
        ) : (
          <Box
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: 20, paddingBottom: 20 }}
          >
            <Typography variant='h5'>There is no Students added in our System</Typography>
          </Box>
        )}
      </List>
    </div>
  )
}

export default ExistingStudentsList
