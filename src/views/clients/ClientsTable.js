import Box from '@mui/material/Box'
import { IconButton, Tooltip, Button } from '@mui/material'
import { Icon } from '@iconify/react'
import * as React from 'react'
import DialogEditClient from 'src/views/clients/DialogEditClient'
import DialogDeleteClient from 'src/views/clients/DialogDeleteClient'
import DialogUpdatePassword from './DialogUpdatePassword'
import { useState } from 'react'
import { Spin, Table } from 'antd'
import { useSettings } from 'src/@core/hooks/useSettings'
import { formatDateWithOutTime } from 'src/utiles/utiles'
import { toast } from 'react-hot-toast'
import { updateStatus, updateDisable } from 'src/services/client.service'
import { styled } from '@mui/material/styles'
import Switch from '@mui/material/Switch'
import { useAuth } from 'src/hooks/useAuth'

const ClientsTable = ({ fetchClients, setLoading, loading, clients, setClients }) => {
  const [isEditModalVisible, setEditModalVisible] = useState(false)
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false)
  const [isUpdatePassModal, setUpdatePassModal] = useState(false)

  const [client, setClient] = useState({})
  const { settings } = useSettings()
  const [pagination, setPagination] = useState({
    pageSize: 10, // Initial page size
    current: 1 // Initial current page
  })
  const auth = useAuth()

  const handleEditModalOpen = data => {
    setEditModalVisible(true)
    setClient(data)
  }
  const handleEditModalClose = () => {
    setEditModalVisible(false)
  }
  const handleDeleteModalOpen = data => {
    setDeleteModalVisible(true)
    setClient(data)
  }
  const handleDeleteModalClose = () => {
    setDeleteModalVisible(false)
  }

  const handleUpdatePassModalOpen = data => {
    setUpdatePassModal(true)
    setClient(data)
  }
  const handleUpdatePassModalClose = () => {
    setUpdatePassModal(false)
  }

  const editClient = client => {
    fetchClients()
  }
  const handleUpdateDisable = async params => {
    setLoading(true)
    const result = await updateDisable(params.id, !params.status)

    if (result?.success) {
      setLoading(false)
      toast.success('Status updated')
      fetchClients()
    } else {
      setLoading(false)
      toast.error(result?.message)
    }
  }
  const handleActivate = async params => {
    setLoading(true)
    const result = await updateStatus(params.id, !params.deactivate)

    if (result?.success) {
      setLoading(false)
      toast.success('User Updated')
      fetchClients()
    } else {
      setLoading(false)
      toast.error(result?.message)
    }
  }

  const deleteClient = id => {
    const newClients = clients.filter(s => {
      return s.id !== id
    })

    setClients(newClients)
  }
  const passwordComp = row => <PasswordComponent password={row?.password} username={row?.id} email={row?.email} />
  const PasswordComponent = ({ username, password, email }) => {
    const [isVisible, setVisible] = useState(false)

    const copyPassword = () => {
      // Copy the text inside the text field
      const content =
        'Username: ' +
        username +
        '\nPassword: ' +
        password +
        '\nEmail: ' +
        email +
        '\nApple: https://apps.apple.com/sa/app/ezpick-student-pick-up-system/id1673235177 ' +
        '\nAndroid: https://play.google.com/store/apps/details?id=com.app.ezpick&pli=1 '
      navigator.clipboard.writeText(content)

      // Alert the copied text
      toast.success('Copied Details')
      setVisible(false)
    }
    const copyPasswordOnly = () => {
      // Copy the text inside the text field
      const content = password
      navigator.clipboard.writeText(content)

      // Alert the copied text
      toast.success('Copied Password')
      setVisible(false)
    }

    return (
      <>
        {isVisible && (
          <Tooltip title='Click to Copy'>
            <Box sx={{ cursor: 'copy' }} onClick={copyPasswordOnly}>
              {password}
            </Box>
          </Tooltip>
        )}
        &nbsp;
        <IconButton onClick={() => setVisible(!isVisible)}>
          <Icon icon='ic:baseline-remove-red-eye' />
        </IconButton>
        <IconButton onClick={copyPassword}>
          <Icon icon='material-symbols:content-copy-outline' />
        </IconButton>
      </>
    )
  }

  const AntSwitch = styled(props => <Switch focusVisibleClassName='.Mui-focusVisible' disableRipple {...props} />)(
    ({ theme }) => ({
      width: 42,
      height: 26,
      padding: 0,
      '& .MuiSwitch-switchBase': {
        padding: 0,
        margin: 2,
        transitionDuration: '300ms',
        '&.Mui-checked': {
          transform: 'translateX(16px)',
          color: '#fff',
          '& + .MuiSwitch-track': {
            backgroundColor: theme.palette.mode === 'dark' ? 'main.primary' : 'main.primary',
            opacity: 1,
            border: 0
          },
          '&.Mui-disabled + .MuiSwitch-track': {
            opacity: 0.5
          }
        },
        '&.Mui-focusVisible .MuiSwitch-thumb': {
          color: '#33cf4d',
          border: '6px solid #fff'
        },
        '&.Mui-disabled .MuiSwitch-thumb': {
          color: theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[600]
        },
        '&.Mui-disabled + .MuiSwitch-track': {
          opacity: theme.palette.mode === 'light' ? 0.7 : 0.3
        }
      },
      '& .MuiSwitch-thumb': {
        boxSizing: 'border-box',
        width: 22,
        height: 22
      },
      '& .MuiSwitch-track': {
        borderRadius: 26 / 2,
        backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
        opacity: 1,
        transition: theme.transitions.create(['background-color'], {
          duration: 500
        })
      }
    })
  )

  const columns = [
    {
      key: '0',
      title: 'Sr. No',
      render: (_, object, index) => index + 1 + (pagination.current - 1) * pagination.pageSize,
      fixed: 'left'
    },
    { key: '1', dataIndex: 'id', title: 'ID' },
    {
      key: '16',
      title: 'Plan',
      ellipsis: true,
      render: (_, params) => params?.plan?.title
    },
    { key: '2', dataIndex: 'name', title: 'Representative', ellipsis: true },
    { key: '3', dataIndex: 'schoolName', title: 'School Name', ellipsis: true },
    {
      key: '7',
      title: (
        <p>
          Email /<br />
          Phone
        </p>
      ),
      ellipsis: true,
      render: (_, params) => (
        <div>
          <Tooltip title={params.email}>
            <p className='long-message'>{params.email}</p>
          </Tooltip>
          <p>{params.mobile}</p>
        </div>
      )
    },
    {
      key: '7',
      title: (
        <p>
          Start Date /<br />
          Expiry Date
        </p>
      ),
      ellipsis: true,
      render: (_, params) => (
        <div>
          <p>{params.startDate ? formatDateWithOutTime(params.startDate) : '-'}</p>
          <p>{params.expiryDate ? formatDateWithOutTime(params.expiryDate) : '-'}</p>
        </div>
      )
    },
    {
      key: '4',
      dataIndex: 'cancelSubscriptionReason',
      title: (
        <p>
          Reason to Cancel <br />
          Subscription
        </p>
      )
    },
    {
      key: '8',
      title: 'Log In',
      align: 'center',
      render: (_, params) => {
        return (
          <Tooltip title={params?.deactivate ? 'Login' : 'User is Deactivated'}>
            <Button
              onClick={() => {
                setLoading(true)
                auth.login(
                  { email: params.email, password: params.password, role: 'client', isSuperAdmin: true },
                  ({ success, message }) => {
                    if (success) {
                      toast.success('Logged In')
                      setLoading(false)
                    } else {
                      setLoading(false)
                      toast.error(message)
                    }
                  }
                )
              }}
              variant='contained'
              color='primary'
              style={{ padding: 7 }}
              disabled={!params?.deactivate}
            >
              Login
            </Button>
          </Tooltip>
        )
      }
    },
    {
      key: '8',
      dataIndex: 'status',
      title: 'Disable',
      render: (_, params) => {
        return (
          <AntSwitch
            onChange={() => handleUpdateDisable(params)}
            checked={params.status}
            inputProps={{ 'aria-label': 'ant design' }}
          />
        )
      }
    },
    {
      key: '8',
      title: 'Update Password',
      align: 'center',
      render: (_, params) => {
        return (
          <Button
            onClick={() => handleUpdatePassModalOpen(params)}
            variant='text'
            color='primary'
            // style={{textTransform: 'none'}}
            style={{ padding: 7 }}
          >
            Update Password
          </Button>
        )
      }

      // render: (_, params) => (params.status ? 'Active' : 'Paused')
    },
    // {
    //   key: '9',
    //   title: 'Password',
    //   render: (_, object) => passwordComp(object),
    //   align: 'center'
    // },
    {
      key: '11',
      title: 'Active',
      render: (_, params) => {
        return (
          <Button
            onClick={() => handleActivate(params)}
            variant='contained'
            color={params?.deactivate ? 'error' : 'success'}
          >
            {params?.deactivate ? 'Deactivate' : 'Activate'}
          </Button>
        )
      }
    },
    {
      key: '9',
      title: 'Actions',
      align: 'center',
      render: (_, params) => {
        return (
          <Box sx={{ display: 'flex' }}>
            <IconButton color='primary' onClick={() => handleEditModalOpen(params)}>
              <Icon icon='material-symbols:edit' />
            </IconButton>
            <IconButton disabled color='primary' onClick={() => handleDeleteModalOpen(params)}>
              <Icon icon='material-symbols:delete-outline' />
            </IconButton>
          </Box>
        )
      }
    }
  ]

  return (
    <Spin spinning={loading}>
      <Table
        className={
          settings?.mode.includes('dark')
            ? 'dark custom-table ant-pagination-total-text student-Table fix_left_dark fix_right_dark'
            : 'light student-Table-light'
        }
        dataSource={clients}
        columns={columns}
        pageSize={20}
        rowsPerPageOptions={[10]}
        autoHeight
        size='small'
        pagination={{
          defaultCurrent: 1,
          total: clients?.length,
          defaultPageSize: 10,
          showSizeChanger: true,
          showTotal: (total, range) => `Total: ${total}`,
          pageSizeOptions: ['10', '20', '50', '100'],
          locale: { items_per_page: '' }
        }}
        onChange={pagination => setPagination(pagination)}
        scroll={{
          x: true
        }}
      />
      <DialogEditClient
        onSubmit={editClient}
        client={client}
        isOpen={isEditModalVisible}
        handleClose={handleEditModalClose}
      />
      <DialogDeleteClient
        onSubmit={deleteClient}
        client={client}
        isOpen={isDeleteModalVisible}
        handleClose={handleDeleteModalClose}
      />
      <DialogUpdatePassword
        onSubmit={editClient}
        client={client}
        isOpen={isUpdatePassModal}
        handleClose={handleUpdatePassModalClose}
      />
    </Spin>
  )
}
export default ClientsTable
