import { Button, Box, IconButton, Avatar, Tooltip } from '@mui/material'
import { Icon } from '@iconify/react'

const getColumns = ({ openEditModal, openDeleteModal, pagination }) => [
  {
    key: '111',
    title: 'Sr. No',
    render: (_, object, index) => index + 1 + (pagination.current - 1) * pagination.pageSize,
    fixed: 'left'
  },
  {
    key: '1',
    title: 'ID',
    render: (_, object) => object.id,
    fixed: 'left'
  },
  {
    key: '2',
    title: 'Profile',
    dataIndex: 'name',
    render: (_, object) => {
      return object.profileUrl ? (
        <a href={'' + object.profileUrl} target='_blank'>
          <Avatar>
            <img src={object.profileUrl} style={{ width: '100%', objectFit: 'contain' }} />
          </Avatar>
        </a>
      ) : (
        <Avatar
          sx={{
            background: theme => theme.palette.primary.main,
            color: theme => theme.palette.primary.contrastText
          }}
        >
          {object.name ? object.name[0].toUpperCase() : 'S'}
        </Avatar>
      )
    }
  },
  {
    key: '3',
    title: 'Name',
    dataIndex: 'name'
  },
  {
    key: '4',
    title: 'Address',
    dataIndex: 'name',
    width: '20%',
    render: (_, object) => (
      <Tooltip title={object.address}>
        <p className='long-address'>{object.address || '-'}</p>
      </Tooltip>
    )
  },
  {
    key: '4',
    title: 'Location',
    dataIndex: 'name',
    width: '20%',
    render: (_, object) => {
      return (
        <Box sx={{ display: 'flex' }}>
          <Button
            variant='text'
            color='success'
            disabled={object.lat === undefined || object.long === undefined}
            sx={{ textTransform: 'none' }}
            onClick={() => window.open('https://maps.google.com/?q=' + object.lat + ',' + object.long, '_blank')}
          >
            <Icon icon='material-symbols:map-outline' fontSize={25} /> &nbsp;Show in Map
          </Button>
        </Box>
      )
    }
  },
  {
    key: '7',
    title: 'Actions',
    fixed: 'right',
    render: (_, object) => {
      return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center'
          }}
        >
          <Tooltip title='Edit'>
            <IconButton color='info' onClick={() => openEditModal(object)}>
              <Icon icon='material-symbols:edit' />
            </IconButton>
          </Tooltip>
          <Tooltip title='Delete'>
            <IconButton color='error' onClick={() => openDeleteModal(object)}>
              <Icon icon='material-symbols:delete-outline' />
            </IconButton>
          </Tooltip>
        </Box>
      )
    },
    align: 'center'
  }
]
export default getColumns
