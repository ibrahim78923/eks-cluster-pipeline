import React from 'react'
import { List, ListItem, ListItemText, Typography, Divider, Box } from '@mui/material'

const InvalidUsersList = ({ invalidData }) => {
  return (
    <div>
      <Typography variant='h5'>Invalid Users</Typography>
      <List>
        {invalidData?.length > 0 ? (
          invalidData.map((user, index) => (
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
            <Typography variant='h5'>There is no Invalid data</Typography>
          </Box>
        )}
      </List>
    </div>
  )
}

export default InvalidUsersList
