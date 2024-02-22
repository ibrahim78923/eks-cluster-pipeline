// ** React Imports
import * as React from 'react'
import { forwardRef } from 'react'

import Dialog from '@mui/material/Dialog'
import Fade from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import { Grid, Box } from '@mui/material'
import Typography from '@mui/material/Typography'
import { Spin, Table } from 'antd'

// ** Icon Imports
import { IconButton } from '@mui/material'
import { Icon } from '@iconify/react'
import { getByID } from 'src/services/parent.service'

import getColumns from './columns'

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})

const DetailModal = ({ isOpen, handleClose, onSubmit, parentId, settings }) => {
  const [data, setData] = React.useState([])
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    const fn = async () => {
      if (parentId) {
        setLoading(true)
        const result = await getByID(parentId)

        if (result?.success) {
          setLoading(false)
          setData(result?.parent?.students)
        } else {
          setLoading(false)
        }
      }
    }
    fn()
  }, [parentId])
  const columns = getColumns()
  return (
    <Dialog
      fullWidth
      open={isOpen}
      maxWidth='sm'
      scroll='body'
      onClose={handleClose}
      TransitionComponent={Transition}
      onBackdropClick={handleClose}
    >
      <Spin spinning={loading}>
        <DialogContent sx={{ position: 'relative', pt: 10 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant='h5' sx={{ mb: 3, lineHeight: '2rem' }}>
              Student Detail
            </Typography>
          </Box>
          <IconButton size='small' onClick={handleClose} sx={{ position: 'absolute', right: '1rem', top: '1rem' }}>
            <Icon icon='mdi:close' />
          </IconButton>
          <Typography variant='h6' sx={{ mt: 1, textAlign: 'center' }}></Typography>
          <Grid item xs={12}>
            <Table
              style={{ minHeight: 400 }}
              className={
                settings?.mode.includes('dark')
                  ? 'dark custom-table ant-pagination-total-text student-Table'
                  : 'light student-Table-light'
              }
              dataSource={data}
              columns={columns}
              width={'100%'}
              pagination={false}
            />
          </Grid>
        </DialogContent>
      </Spin>
    </Dialog>
  )
}

export default DetailModal
