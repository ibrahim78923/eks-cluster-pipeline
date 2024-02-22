import { Box, IconButton, Tooltip, Chip, Stack } from '@mui/material'
import { Icon } from '@iconify/react'
import { formatDate } from 'src/utiles/utiles'

const getColumns = ({ pagination, openEditModal }) => [
  {
    key: '1',
    title: 'Sr. No',
    render: (_, object, index) => index + 1 + (pagination.current - 1) * pagination.pageSize
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
    title: 'Price',
    dataIndex: 'price',
    render: (_, object) => `$${object?.price}`
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
    title: 'Duration Type',
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
              size='large'
              label={object?.durationType}
              color={object?.durationType === 'monthly' ? 'success' : 'warning'}
              variant='fiiled'
              style={{ fontSize: 18, fontWeight: 'bold', textTransform: 'capitalize' }}
            />
          </Stack>
        </Box>
      )
    },
    align: 'center'
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
        </Box>
      )
    },
    align: 'center'
  }
]
export default getColumns
