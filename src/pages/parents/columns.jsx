import { Avatar, Badge, Box, IconButton, Tooltip } from '@mui/material'
import { Icon } from '@iconify/react'
import { formatDate } from '../../utiles/utiles'
import Link from 'next/link'

const getColumns = ({ openDetailModal, passwordComp, pagination, openDeleteModal }) => {
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
      key: '9',
      title: 'No of Childs',
      align: 'center',
      render: (_, object) => {
        return (
          <Tooltip title='View Detail'>
            <IconButton color='info'>
              <Badge badgeContent={object?.students?.length} color='primary'>
                <Icon icon='material-symbols:supervisor-account-outline' />
              </Badge>
            </IconButton>
          </Tooltip>
        )
      }
    },
    {
      key: '8',
      title: 'Print Card',
      align: 'center',
      render: (_, object) => {
        return (
          <Tooltip title='View Detail'>
            <Link href={`print-card?id=${object?.id}`} target='_blank'>
              <IconButton color='info'>
                <Icon icon='material-symbols:add-card-outline-sharp' />
              </IconButton>
            </Link>
          </Tooltip>
        )
      }
    },
    {
      key: '7',
      title: 'Actions',
      // render: (_, object) => {
      //   return (
      //     <Box
      //       sx={{
      //         display: 'flex',
      //         justifyContent: 'space-around',
      //         alignItems: 'center'
      //       }}
      //     >
      //       <Tooltip
      //         title={
      //           object?.students?.length
      //             ? `It's advisable not to delete this parent account as it's connected to ${object?.students?.length} student accounts.`
      //             : 'Delete'
      //         }
      //       >
      //         <IconButton
      //           color={object?.students?.length? "info":'error'}
      //           onClick={() => {
      //             if (!object?.students?.length) openDeleteModal(object)
      //             else return
      //           }}
      //         >
      //           <Icon icon='material-symbols:delete-outline' />
      //         </IconButton>
      //       </Tooltip>
      //     </Box>
      //   )
      // },
      render: (_, object) => <RowOptions id={object.id} />,
      align: 'center'
    }
  ];

  return columns
}

export default getColumns
