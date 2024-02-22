// ** React Imports
import { forwardRef } from 'react'

import Dialog from '@mui/material/Dialog'
import Fade from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'

// ** Icon Imports
import AddGradeWizard from './AddGradeWizard'
import { IconButton } from '@mui/material'
import { Icon } from '@iconify/react'

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})

const AddGradeModal = ({ isOpen, handleClose, onSubmit, gradeId }) => {
  const onComplete = args => {
    onSubmit(args)
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
        <AddGradeWizard onComplete={onComplete} gradeId={gradeId} />
      </DialogContent>
    </Dialog>
  )
}

export default AddGradeModal
