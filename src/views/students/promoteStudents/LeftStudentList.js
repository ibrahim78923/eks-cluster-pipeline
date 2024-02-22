import * as React from 'react'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Checkbox from '@mui/material/Checkbox'
import { Avatar, Typography, FormControlLabel } from '@mui/material'

export default function CheckboxListSecondary({ students, setChecked, checked }) {
  const handleToggle = value => () => {
    const currentIndex = checked.indexOf(value)
    const newChecked = [...checked]

    if (currentIndex === -1) {
      newChecked.push(value)
    } else {
      newChecked.splice(currentIndex, 1)
    }

    setChecked(newChecked)
  }

  const handleSelectAll = event => {
    if (event.target.checked) {
      setChecked([])
      const newArray = students?.map(obj => obj.id)
      setChecked(newArray)
    } else {
      setChecked([])
    }
  }
  console.log(checked, 'checked')
  return (
    <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant='body1' sx={{ textAlign: 'center' }}>
          Total: {students?.length}
        </Typography>
        <FormControlLabel control={<Checkbox onChange={handleSelectAll} />} label='Select All' />
      </div>
      {students?.map((item, index) => {
        const labelId = `checkbox-list-secondary-label-${item.id}`
        return (
          <ListItem
            key={item.id}
            secondaryAction={
              <Checkbox
                edge='end'
                onChange={handleToggle(item.id)}
                checked={checked.indexOf(item.id) !== -1}
                inputProps={{ 'aria-labelledby': labelId }}
              />
            }
            onClick={handleToggle(item.id)}
            disablePadding
          >
            <ListItemButton>
              <Typography variant='body2' sx={{ textAlign: 'left', marginRight: 3 }}>
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
