// ** React Imports
import { useState, forwardRef, useEffect } from 'react'

// ** MUI Imports
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import Fade from '@mui/material/Fade'
import { DialogContent, DialogTitle} from '@mui/material'

import { create } from 'src/services/student.service'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Hooks
import useBgColor from 'src/@core/hooks/useBgColor'

import { toast } from 'react-hot-toast'
import { useAuth } from 'src/hooks/useAuth'

import PromoteStudentsWizard from './PromoteStudentsWizard'

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})

const PromoteStudentModal = ({ isOpen, handleClose, onSubmit }) => {
  const onComplete = args => {
    onSubmit(args)
    handleClose()
  }

  return (
    <Dialog
      fullWidth
      open={isOpen}
      maxWidth='md'
      scroll='body'
      onClose={handleClose}
      TransitionComponent={Transition}
      onBackdropClick={handleClose}
    ><DialogTitle>Promote Students</DialogTitle>
    <IconButton size='small' onClick={handleClose} sx={{ position: 'absolute', right: '1rem', top: '1rem' }}>
      <Icon icon='mdi:close' />
    </IconButton>
      <DialogContent>
        {/* <IconButton size='small' onClick={handleClose} sx={{ position: 'absolute', right: '1rem', top: '1rem' }}>
          <Icon icon='mdi:close' />
        </IconButton> */}
        <PromoteStudentsWizard onComplete={onComplete} />
      </DialogContent>
    </Dialog>
  )
}

export default PromoteStudentModal
