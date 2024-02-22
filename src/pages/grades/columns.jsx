import { Box, IconButton, Tooltip } from '@mui/material'
import { Icon } from '@iconify/react'

const getColumns = ({ openEditModal, openDeleteModal, openDetailModal, pagination }) => {
  const handleTimeChange = value => {
    if (value) {
      const selectedTime = value
      const [hours, minutes] = selectedTime?.split(':')
      const date = new Date()
      date.setHours(hours)
      date.setMinutes(minutes)
      const formattedDate = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      })
      return formattedDate
    }
    return '-'
  }
  const columns = [
    {
      key: '0',
      title: 'Sr. No',
      render: (_, object, index) => index + 1 + (pagination.current - 1) * pagination.pageSize,
      width: '5%',
      fixed: 'left',
    },
    {
      key: '1',
      title: 'Grade ID',
      render: (_, object) => object.id,
      width: '5%',
      fixed: 'left',
    },
    {
      key: '2',
      title: 'Name',
      dataIndex: 'name',
      width: '10%'
    },

    {
      key: '6',
      title: 'School',
      render: (_, object) => object?.school?.school || '-',
      width: '20%'
    },
    {
      key: '7',
      title: 'Actions',
      width: '8%',
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
            <Tooltip title='View Detail'>
              <IconButton color='info' onClick={() => openDetailModal(object)}>
                <Icon icon='material-symbols:view-list-outline' />
              </IconButton>
            </Tooltip>
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
  return columns
}
export default getColumns
