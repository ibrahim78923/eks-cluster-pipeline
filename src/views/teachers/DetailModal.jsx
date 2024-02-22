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
import { IconButton, DialogTitle } from '@mui/material'
import { Icon } from '@iconify/react'
import { getByID } from 'src/services/teacher.service'

import getColumns from './detailColumns';

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})

const DetailModal = ({ isOpen, handleClose, onSubmit, teacherId, settings }) => {
  const [gradeData, setGradeData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [pagination, setPagination] = React.useState({
    pageSize: 10, // Initial page size
    current: 1, // Initial current page
  });
  console.log(teacherId, "teacherId")
  React.useEffect(() => {
    const fn = async () => {
      if(teacherId){
      setLoading(true)
      const result = await getByID(teacherId)

      if (result?.success) {
        console.log(result, "grade data")
        setLoading(false);
        setGradeData(result?.teacher?.grades);
      } else {
        setLoading(false)
      }
    }
    }

    fn()
  }, [teacherId])
  const columns = getColumns({pagination});

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
      <DialogTitle>Teacher Grades</DialogTitle>
      <IconButton size='small' onClick={handleClose} sx={{ position: 'absolute', right: '1rem', top: '1rem' }}>
        <Icon icon='mdi:close' />
      </IconButton>
      <Spin spinning={loading}>
        <DialogContent>
          <Grid item xs={12}>
            <Table
              style={{ minHeight: 400 }}
              className={settings?.mode.includes('dark') ? 'dark custom-table ant-pagination-total-text student-Table' : 'light student-Table-light'}
              dataSource={gradeData}
              columns={columns}
              width={"100%"}
              pagination={gradeData?.length > 10 ? true : false}
              onChange={(pagination)=> setPagination(pagination)}
            />
          </Grid>
        </DialogContent>
      </Spin>
    </Dialog>
  )
}

export default DetailModal;
