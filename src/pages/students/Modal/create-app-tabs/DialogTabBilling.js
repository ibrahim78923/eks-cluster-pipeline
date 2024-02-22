import React from 'react'
import { List, ListItem, ListItemText, Typography, Divider, Box } from '@mui/material'

const DuplicateUsersList = ({ duplicates }) => {
  return (
    <div>
      <Typography variant='h5'>Duplicate Users</Typography>
      <List>
        {duplicates?.length > 0 ? (
          duplicates.map((user, index) => (
            <div key={index}>
              <ListItem>
                <ListItemText
                  primary={`Student Name: ${user.StudentName}`}
                  secondary={`Grade ID: ${user.gradeId}, Email: ${user?.Guardian1Email}`}
                />
              </ListItem>
              <Divider />
            </div>
          ))
        ) : (
          <Box
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: 20, paddingBottom: 20 }}
          >
            <Typography variant='h5'>There is no Duplicate Users found in your File</Typography>
          </Box>
        )}
      </List>
    </div>
  )
}

export default DuplicateUsersList
