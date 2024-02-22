// ** React Imports
import { useState } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import { DataGrid } from '@mui/x-data-grid'
import Tooltip from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import useMediaQuery from '@mui/material/useMediaQuery'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'

// ** Styled component for the link in the dataTable
const StyledLink = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

function formatUnixTimestamp(timestamp) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const date = new Date(timestamp * 1000) // Convert to milliseconds
  const day = date.getDate()
  const month = months[date.getMonth()]
  const year = date.getFullYear()

  return `${day} ${month} ${year}`
}

const defaultColumns = [
  {
    flex: 0.1,
    minWidth: 30,
    field: 'id',
    headerName: 'Invoice Id',
    renderCell: ({ row }) => (
      <StyledLink href={row?.invoice_pdf} download={'pdf'} target='_blank'>{`${row.id}`}</StyledLink>
    )
  },
  {
    flex: 0.2,
    minWidth: 40,
    field: 'name',
    headerName: 'Client',
    renderCell: ({ row }) => {
      const { customer_name, customer_email } = row

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
              {customer_name}
            </Typography>
            <Typography noWrap variant='caption'>
              {customer_email}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.2,
    minWidth: 60,
    field: 'account_name',
    headerName: 'Organization'
  },
  {
    flex: 0.1,
    minWidth: 50,
    field: 'total',
    headerName: 'Total',
    align: 'center',
    headerAlign: 'center',
    renderCell: ({ row }) => {
      return `$${row?.total / 100}`
    }
  },
  {
    flex: 0.1,
    minWidth: 50,
    field: 'period_start',
    headerName: 'Period Start',
    align: 'center',
    headerAlign: 'center',
    renderCell: ({ row }) => formatUnixTimestamp(row?.period_start)
  },
  {
    flex: 0.1,
    minWidth: 50,
    field: 'period_end',
    headerName: 'Period End',
    align: 'center',
    headerAlign: 'center',
    renderCell: ({ row }) => formatUnixTimestamp(row?.period_end)
  },
  {
    flex: 0.1,
    minWidth: 30,
    field: 'status',
    align: 'center',
    headerAlign: 'center',
    headerName: 'Status',
    renderCell: ({ row }) => {
      return !row.paid ? (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          <CustomChip size='small' skin='light' color='error' label='Unpaid' />
        </Typography>
      ) : (
        <CustomChip size='small' skin='light' color='success' label='Paid' />
      )
    }
  }
]

/* eslint-enable */
const BillingHistoryTable = ({ invoice, loading }) => {
  // ** State
  const [pageSize, setPageSize] = useState(10)
  const isMobile = useMediaQuery(theme => theme.breakpoints.down('md'))

  const columns = [
    ...defaultColumns,
    {
      flex: 0.1,
      minWidth: 50,
      sortable: false,
      field: 'actions',
      align: 'center',
      headerAlign: 'center',
      headerName: 'Actions',
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Tooltip title='Download Invoice'>
            <StyledLink href={row?.invoice_pdf} download>
              <IconButton size='small'>
                <Icon icon='mdi:download' fontSize={20} /> <p style={{ marginLeft: 10 }}>Download</p>
              </IconButton>
            </StyledLink>
          </Tooltip>
        </Box>
      )
    }
  ]

  return (
    <Card>
      <CardHeader title='Billing History' />
      <Divider sx={{ m: '0 !important' }} />
      <div style={{ overflowX: 'auto' }}>
        <DataGrid
          style={{ width: isMobile ? 1400 : '100%' }}
          autoHeight
          pagination={invoice?.length > 10 ? true : false}
          rows={invoice}
          loading={loading}
          columns={columns}
          disableSelectionOnClick
          pageSize={Number(pageSize)}
          rowsPerPageOptions={invoice?.length > 10 ? [10, 25, 50] : []}
          onPageSizeChange={newPageSize => setPageSize(newPageSize)}
        />
      </div>
    </Card>
  )
}

export default BillingHistoryTable
