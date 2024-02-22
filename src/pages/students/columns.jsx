import React, { useState } from 'react'
import { Box, IconButton, Avatar, Tooltip, Badge } from '@mui/material'
import { Icon } from '@iconify/react'
import { formatDate } from '../../utiles/utiles'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Link from 'next/link'

const getColumns = ({ openAssistantModal, openEditModal, openDeleteModal, handleSend, passwordComp, pagination }) => {
  const RowOptions = ({ object }) => {
    const [anchorEl, setAnchorEl] = useState(null)
    const rowOptionsOpen = Boolean(anchorEl)

    const handleRowOptionsClick = event => {
      setAnchorEl(event.currentTarget)
    }

    const handleRowOptionsClose = () => {
      setAnchorEl(null)
    }
    const handleEdit = object => {
      openEditModal(object)
      handleRowOptionsClose()
    }
    const handleSendCredential = object => {
      handleSend(object?.id)
      handleRowOptionsClose()
    }
    const handleDelete = object => {
      openDeleteModal(object)
      handleRowOptionsClose()
    }

    return (
      <Box>
        <IconButton size='medium' onClick={handleRowOptionsClick}>
          <Icon icon='mdi:dots-vertical' />
        </IconButton>
        <Menu
          keepMounted
          anchorEl={anchorEl}
          open={rowOptionsOpen}
          onClose={handleRowOptionsClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          PaperProps={{ style: { minWidth: '5rem' } }}
        >
          <MenuItem onClick={() => handleEdit(object)} sx={{ '& svg': { mr: 2 } }}>
            <Icon color='green' icon='material-symbols:edit' /> Edit
          </MenuItem>
          <MenuItem onClick={() => handleSendCredential(object)} sx={{ '& svg': { mr: 2 } }}>
            <Icon color='#26C6F9' icon='material-symbols:send' /> Send Email
          </MenuItem>
          <MenuItem onClick={() => handleDelete(object)} sx={{ '& svg': { mr: 2 } }}>
            <Icon color='red' icon='material-symbols:delete-outline' /> Delete
          </MenuItem>
        </Menu>
      </Box>
    )
  }

  const columns = [
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
      render: (_, object) => object?.parent?.id,
      fixed: 'left'
    },
    {
      key: '2',
      title: 'Profile',
      render: (_, object, index) => {
        return object.profileUrl ? (
          <a href={'' + object.profileUrl} target='_blank'>
            <Badge
              overlap='circular'
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              badgeContent={
                <div
                  style={{
                    width: '12px', // Adjust the size as needed
                    height: '12px', // Adjust the size as needed
                    borderRadius: '50%', // Makes it circular
                    backgroundColor: object?.requests?.length ? 'green' : 'red', // White background
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxShadow: '0px 0px 5px 2px rgba(0,0,0,0.3)' // Add shadow
                  }}
                ></div>
              }
            >
              <Avatar>
                <img src={object.profileUrl} style={{ width: '100%', objectFit: 'contain' }} />
              </Avatar>
            </Badge>
          </a>
        ) : (
          <Badge
            overlap='circular'
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            badgeContent={
              <div
                style={{
                  width: '12px', // Adjust the size as needed
                  height: '12px', // Adjust the size as needed
                  borderRadius: '50%', // Makes it circular
                  backgroundColor: object?.requests?.length ? 'green' : 'red', // White background
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  boxShadow: '0px 0px 5px 2px rgba(0,0,0,0.3)' // Add shadow
                }}
              ></div>
            }
          >
            <Avatar
              sx={{
                background: theme => theme.palette.primary.main,
                color: theme => theme.palette.primary.contrastText
              }}
            >
              {object.name ? object.name[0].toUpperCase() : 'S'}
            </Avatar>
          </Badge>
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
      key: '6',
      title: 'School / Grade',
      render: (_, object) => (
        <>
          <p className='long-message'>{object.grade?.school?.school || '-'}</p>
          {object.grade?.grade || '-'}
        </>
      )
    },
    {
      key: '7',
      title: 'Email / Phone No',
      render: (_, object) => (
        <>
          <Tooltip title={object.parent?.email}>
            <p className='long-message'>{object.parent?.email || '-'}</p>
          </Tooltip>
          <Tooltip title={object.parent?.phoneNo}>
            <p className='long-message'>{object.parent?.phoneNo || '-'}</p>
          </Tooltip>
        </>
      )
    },
    {
      key: '5',
      title: 'Last Login',
      render: (_, object) => (object?.parent?.lastLogin ? formatDate(object?.parent?.lastLogin) : '-'),
      ellipsis: true,
      align: 'center'
    },
    {
      key: '8',
      title: 'Assistant',
      align: 'center',
      render: (_, object) => {
        return (
          <Tooltip title='View Detail'>
            <IconButton color='info' onClick={() => openAssistantModal(object)}>
              <Icon icon='material-symbols:view-list-outline' />
            </IconButton>
          </Tooltip>
        )
      }
    },
    {
      key: '9',
      title: 'Password',
      render: (_, object) => passwordComp(object),
      align: 'center'
    },
    {
      key: '10',
      title: 'Email Logs',
      render: (_, object) => (object?.parent?.credentialSentAt ? formatDate(object?.parent?.credentialSentAt) : '-'),
      align: 'center'
    },
    {
      key: '8',
      title: 'Print Card',
      align: 'center',
      render: (_, object) => {
        return (
          <Tooltip title='View Detail'>
            <Link href={`print-card?id=${object?.parent?.id}`} target='_blank'>
              <Badge badgeContent={object?.students?.length} color='primary'>
                <IconButton color='info'>
                  <Icon icon='material-symbols:add-card-outline-sharp' />
                </IconButton>
              </Badge>
            </Link>
          </Tooltip>
        )
      }
    },
    {
      key: '11',
      title: 'Actions',
      render: (_, object) => <RowOptions object={object} />,
      align: 'center',
      width: '5%'
    }
  ]

  return columns
}
export default getColumns
