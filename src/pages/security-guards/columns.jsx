import {Avatar, Box, IconButton, Tooltip} from '@mui/material'
import { Icon } from '@iconify/react'
import {formatDate} from "../../utiles/utiles";


const getColumns = ({  openEditModal, openDeleteModal, passwordComp, pagination }) => [
  {
    key: '0',
    title: 'Sr. No',
    render: (_, object, index) => index + 1 + (pagination.current - 1) * pagination.pageSize,
    fixed: 'left',
    ellipsis: true
  },
  {
    key: '1',
    title: 'Username',
    render: (_, object) => object?.id,
    fixed: 'left'
  },
  {
    key: '2',
    title: 'Profile',
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
    dataIndex: 'name',
    ellipsis: true,
    render: (_, object) => (
      <>
        <Tooltip title={object.name}>
          <p className='long-text'>{object.name || '-'}</p>
        </Tooltip>

      </>
    )
  },
  {
    key: '4',
    title: 'Email / Phone No',
    render: (_, object) => (
      <>
        <Tooltip title={object.email}>
          <p className='long-message'>{object.email || '-'}</p>
        </Tooltip>
        <Tooltip title={object.phoneNo}>
          <p className='long-message'>{object.phoneNo || '-'}</p>
        </Tooltip>
      </>
    )
  },
  {
    key: '5',
    title: 'Last Login',
    render: (_, object) => (object?.lastLogin ? formatDate(object?.lastLogin) : '-'),
    ellipsis: true,
    align: 'center'
  },
  {
    key: '6',
    title: 'Password',
    render: (_, object) => passwordComp(object),
    align: 'center'
  },

  {
    key: '7',
    title: 'Actions',
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
