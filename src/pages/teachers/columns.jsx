import { Box, IconButton, Avatar, Tooltip, Badge } from '@mui/material'
import { Icon } from '@iconify/react'
import { formatDate } from '../../utiles/utiles'

const getColumns = ({ openEditModal, openDeleteModal, handleSend, passwordComp, pagination, openDetailModal }) => [
  {
    key: '0',
    title: 'Sr. No',
    render: (_, object, index) => index + 1 + (pagination.current - 1) * pagination.pageSize,
    fixed: 'left',
    ellipsis: true,
    align: 'center'
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
    dataIndex: 'name',
    ellipsis: true,
    render: (_, object) => (
      <>
        <Tooltip title={object.name}>
          <p className='long-text'>{object.name || '-'}</p>
        </Tooltip>
        <Tooltip title={object.nameAr}>
          <p className='long-text'>{object.nameAr || '-'}</p>
        </Tooltip>
      </>
    )
  },
  {
    key: '4',
    title: 'Email',
    dataIndex: 'name',
    render: (_, object) => object.email || '-'
  },
  {
    key: '5',
    title: 'School Name',
    dataIndex: 'name',
    render: (_, object) => object?.school?.school || '-',
    ellipsis: true,
    align: 'center'
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
          <Tooltip title='View Detail'>
            <IconButton color='info' onClick={() => openDetailModal(object)}>
              <Badge badgeContent={object?.grades?.length} color='primary'>
                <Icon icon='material-symbols:view-list-outline' />
              </Badge>
            </IconButton>
          </Tooltip>
          <Tooltip title='Edit'>
            <IconButton color='info' onClick={() => openEditModal(object)}>
              <Icon icon='material-symbols:edit' />
            </IconButton>
          </Tooltip>
          <Tooltip title='Send Credentials'>
            <IconButton
              color='info'
              onClick={() => {
                handleSend(object?.id)
              }}
            >
              <Icon icon='material-symbols:send' />
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
