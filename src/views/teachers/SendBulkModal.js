// ** React Imports
import { forwardRef } from 'react'

// ** MUI Imports
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import Fade from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'

// import { create } from 'src/services/teacher.service'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import SendBulkWizard from './SendBulkWizard'

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})

const SendBulkModal = ({ isOpen, handleClose, onSubmit }) => {
  const onComplete = args => {
    handleClose()
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
      <DialogContent sx={{ position: 'relative', pt: 15 }}>
        <IconButton size='small' onClick={handleClose} sx={{ position: 'absolute', right: '1rem', top: '1rem' }}>
          <Icon icon='mdi:close' />
        </IconButton>
        <SendBulkWizard onComplete={onComplete} />
      </DialogContent>
    </Dialog>
  )
}

export default SendBulkModal
