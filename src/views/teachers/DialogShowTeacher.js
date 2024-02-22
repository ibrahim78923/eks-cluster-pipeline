// ** React Imports
import { useState, forwardRef, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'

import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Fade from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Hooks
import useBgColor from 'src/@core/hooks/useBgColor'

import { useAuth } from '../../hooks/useAuth'

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})

const DialogShowTeacher = props => {
  const { isOpen, handleClose, onSubmit, teacher } = props
  const auth = useAuth()
  // ** States
  const [selectedSchool, setSelectedSchool] = useState(null)
  const [selectedCampus, setselectedCampus] = useState(null)
  const [selectedGrade, setselectedGrades] = useState(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [grade, setGrade] = useState('')

  useEffect(() => {
    if (teacher.name) {
      setName(teacher.name)
    }
    if (teacher.email) {
      setEmail(teacher.email)
    }
    if (teacher.campusId) {
      setselectedCampus(teacher.campusId)
    }
    if (teacher.schoolId) {
      setSelectedSchool(teacher.schoolId)
    }
  }, [teacher])

  // ** Hooks
  const bgColors = useBgColor()

  return (
    <Dialog
      fullWidth
      open={isOpen}
      maxWidth='md'
      scroll='body'
      onClose={handleClose}
      TransitionComponent={Transition}
      onBackdropClick={handleClose}
    >
      <DialogContent sx={{ pb: 6, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}>
        <IconButton size='small' onClick={handleClose} sx={{ position: 'absolute', right: '1rem', top: '1rem' }}>
          <Icon icon='mdi:close' />
        </IconButton>
        <Box sx={{ mb: 9, textAlign: 'center' }}>
          <Typography variant='h5' sx={{ mb: 3, lineHeight: '2rem' }}>
            Login Credentials
          </Typography>
          <Typography variant='body2'>Teacher login credentials</Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'center' }}>
        <Button variant='contained' sx={{ mr: 2 }}>
          Copy the credentials
        </Button>
        <Button variant='outlined' color='secondary' onClick={handleClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DialogShowTeacher
