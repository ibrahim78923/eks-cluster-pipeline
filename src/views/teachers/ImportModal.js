// ** React Imports
import { useState, forwardRef, useRef } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'

import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import { Typography, Tooltip } from '@mui/material'
import Fade from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import SchoolSelect from './SchoolSelect'
import GradesSelect from './GradesSelect'
import { importTeacher } from 'src/services/teacher.service'
import { useAuth } from 'src/hooks/useAuth'
import { List, ListItem, ListItemText } from '@mui/material'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { toast } from 'react-hot-toast'
import { Spin } from 'antd'

// ** Hooks

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})

const ImportModal = ({ isOpen, handleClose }) => {
  // ** States
  const [selectedSchool, setSelectedSchool] = useState(null)
  const [selectedGrade, setSelectedGrade] = useState([])
  const [uploadedFile, setFile] = useState(null)
  const [loading, setLoading] = useState(false)

  const fileInputRef = useRef(null)
  const auth = useAuth()

  const openFileSelector = () => fileInputRef.current.click()

  const handleFileUpload = e => {
    console.log(e, 'eeeee')
    const file = e.target.files[0]

    if (file) {
      setFile(file)
    } else {
      setFile(null)
    }
  }
  const reset = () => {
    setSelectedSchool(null)
    setSelectedGrade(null)
    setFile(null)
  }
  const handleProceed = async () => {
    if (selectedGrade) {
      if (uploadedFile) {
        setLoading(true)
        const formData = new FormData()
        formData.append('schoolId', selectedSchool)
        formData.append('grades', JSON.stringify(selectedGrade))
        formData.append('csvFile', uploadedFile)
        formData.append('clientId', auth.user.id)

        const result = await importTeacher(formData)
        if (result?.success) {
          setLoading(false)
          handleClose()
          reset()
          if (result?.message?.charAt(0) === '0') {
            toast.error('Teacher Already Exist')
          } else {
            toast.success(result?.message)
          }
        } else {
          setLoading(false)
          handleClose()
          reset()
          toast.error('Server Error!')
        }
      } else {
        toast.error('Please Upload a File')
      }
    } else {
      toast.error('Please select Grade')
    }
  }
  const deleteFile = () => {
    setFile(null)
  }
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
        <DialogContent sx={{ position: 'relative' }}>
          <IconButton size='small' onClick={handleClose} sx={{ position: 'absolute', right: '1rem', top: '1rem' }}>
            <Icon icon='mdi:close' />
          </IconButton>
          <Box sx={{ mb: 9, textAlign: 'center' }}>
            <Typography variant='h5' sx={{ mb: 3, lineHeight: '2rem' }}>
              Import Teachers
            </Typography>
          </Box>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <SchoolSelect school={selectedSchool} setSchool={setSelectedSchool} />
            </Grid>
            <Grid item xs={12}>
              <GradesSelect selectedGrade={selectedGrade} setSelectedGrade={setSelectedGrade} school={selectedSchool} />
            </Grid>
            <Grid item xs={12}>
              <Button disabled={uploadedFile} variant='outlined' sx={{ mb: 3 }} onClick={openFileSelector}>
                Upload Spreadsheet
              </Button>
              {uploadedFile && (
                <Tooltip title='Delete' sx={{ mb: 3 }}>
                  <IconButton color='error' onClick={deleteFile}>
                    <Icon icon='material-symbols:delete-outline' />
                  </IconButton>
                </Tooltip>
              )}
              <input accept='.csv' type='file' ref={fileInputRef} onChange={handleFileUpload} hidden />
              <Typography>{uploadedFile?.name}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant='h5' component='span'>
                Note:
              </Typography>
              <List>
                <ListItem disableGutters>
                  <ListItemText
                    primary={
                      <Typography variant='subtitle1' component='span'>
                        1. Make sure you use the same header mentioned in the spreadsheet.
                      </Typography>
                    }
                  />
                </ListItem>
                <ListItem disableGutters>
                  <ListItemText
                    primary={
                      <Typography variant='subtitle1' component='span'>
                        2. Make sure all the fields are correctly filled.
                      </Typography>
                    }
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button variant='contained' sx={{ mr: 2 }} onClick={handleProceed}>
            Proceed
          </Button>
          <Button variant='outlined' color='secondary' onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </Spin>
    </Dialog>
  )
}

export default ImportModal
