import * as React from 'react'

import { List, ListItem, ListItemButton, ListItemText, ListItemAvatar, Avatar, Typography } from '@mui/material'

export default function CheckboxListSecondary({ students }) {
  return (
    <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant='body1' sx={{ textAlign: 'center' }}>
          Total: {students?.length}
        </Typography>
        <Typography variant='body1' sx={{ textAlign: 'center' }}></Typography>
      </div>
      {students?.map((item, index) => {
        const labelId = `checkbox-list-secondary-label-${item.id}`
        return (
          <ListItem key={item.id} disablePadding>
            <ListItemButton>
              <Typography variant='body2' sx={{ textAlign: 'left', marginRight: 5 }}>
                {item?.parent?.id}
              </Typography>
              <ListItemAvatar>
                <Avatar alt={item.name} src={item.profileUrl} />
              </ListItemAvatar>
              <ListItemText id={labelId} primary={item.name} />
            </ListItemButton>
          </ListItem>
        )
      })}
    </List>
  )
}
