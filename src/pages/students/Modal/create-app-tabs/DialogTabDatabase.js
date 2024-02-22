import React from 'react'
import { List, ListItem, ListItemIcon, ListItemText, Typography, Divider, Box } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'

const ExistingStudentsList = ({ existingUsers }) => {
  return (
    <div style={{ maxHeight: '400px', overflowX: 'auto', marginBottom: 40 }}>
      <Typography variant='h5'>Existing Users</Typography>
      <List>
        {existingUsers?.length > 0 ? (
          existingUsers.map(student => (
            <div key={student.id}>
              <ListItem>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText
                  primary={`Name: ${student.name}, ID: ${student.id}`}
                  secondary={`Email: ${student.email}, Phone: ${student.phoneNo}`}
                />
              </ListItem>
              <Divider />
            </div>
          ))
        ) : (
          <Box
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: 20, paddingBottom: 20 }}
          >
            <Typography variant='h5'>There is no Existing Users found in our System</Typography>
          </Box>
        )}
      </List>
    </div>
  )
}

export default ExistingStudentsList
