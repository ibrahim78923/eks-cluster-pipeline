// ** React Imports
import * as React from 'react'
import { forwardRef } from 'react'

import Dialog from '@mui/material/Dialog'
import Fade from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import { Grid } from '@mui/material'
import Typography from '@mui/material/Typography'
import { Spin, Table } from 'antd'

// ** Icon Imports
import { IconButton } from '@mui/material'
import { Icon } from '@iconify/react'
import { getByID } from 'src/services/grade.service'

import getColumns from './detailColumns'

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})

const DetailModal = ({ isOpen, handleClose, onSubmit, gradeId, settings }) => {
  const [gradeData, setGradeData] = React.useState({})
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    const fn = async () => {
      if (gradeId) {
        setLoading(true)
        const result = await getByID(gradeId)

        if (result?.success) {
          console.log(result, 'grade data')
          setLoading(false)
          setGradeData(result?.grade)
        } else {
          setLoading(false)
        }
      }
    }
    fn()
  }, [gradeId])
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
        <DialogContent sx={{ position: 'relative', pt: 15 }}>
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
              dataSource={gradeData?.gradesTimes}
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
