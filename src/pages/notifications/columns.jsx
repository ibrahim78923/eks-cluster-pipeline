import { Box, Avatar, Chip, Stack, Tooltip } from '@mui/material'
import { formatDate } from 'src/utiles/utiles'

const getColumns = ({ pagination }) => [
  {
    key: '1',
    title: 'Sr. No',
    render: (_, object, index) => index + 1 + (pagination.current - 1) * pagination.pageSize
  },
  {
    key: '2',
    title: 'Image',
    dataIndex: 'name',
    render: (_, object) => {
      return object.imageUrl !== 'null' && object.imageUrl ? (
        <a href={'' + object.imageUrl} target='_blank'>
          <Avatar>
            <img src={object.imageUrl} style={{ width: '100%', objectFit: 'contain' }} />
          </Avatar>
        </a>
      ) : (
        <Avatar
          sx={{
            background: theme => theme.palette.primary.main,
            color: theme => theme.palette.primary.contrastText
          }}
        >
          {object.title ? object.title[0].toUpperCase() : 'S'}
        </Avatar>
      )
    }
  },
  {
    key: '3',
    title: 'Title',
    dataIndex: 'title',
    render: (_, object) => (
      <Tooltip title={object.title}>
        <p className='long-text'>{object.title || '-'}</p>
      </Tooltip>
    )
  },
  {
    key: '4',
    title: 'Message',
    dataIndex: 'name',
    render: (_, object) => (
      <Tooltip title={object.message}>
        <p className='long-message'>{object.message || '-'}</p>
      </Tooltip>
    )
  },
  {
    key: '5',
    title: 'Created At',
    dataIndex: 'name',
    render: (_, object) => formatDate(object?.createdAt),
    align: 'center'
  },
  {
    key: '7',
    title: 'Sent To',
    fixed: 'right',
    render: (_, object) => {
      return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            minWidth: 150
          }}
        >
          <Stack direction='row' spacing={1}>
            <Chip
              size='small'
              label={object?.teacherId ? <h4>Teacher</h4> : <h4>Parent</h4>}
              color={object?.teacherId ? 'success' : 'warning'}
              variant='outlined'
            />
          </Stack>
        </Box>
      )
    },
    align: 'center'
  }
]
export default getColumns
