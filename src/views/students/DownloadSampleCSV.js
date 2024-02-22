// ** React Imports
import { forwardRef } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'

import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import Fade from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import { List, ListItem, ListItemText, Typography } from '@mui/material'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { Spin } from 'antd'

// ** Hooks

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})

const DownloadCSVModal = ({ isOpen, handleClose }) => {
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
      <DialogContent sx={{ pb: 6, position: 'relative' }}>
        <IconButton size='small' onClick={handleClose} sx={{ position: 'absolute', right: '1rem', top: '1rem' }}>
          <Icon icon='mdi:close' />
        </IconButton>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant='h5' sx={{ mb: 3, lineHeight: '2rem' }}>
            Sample CSV
          </Typography>
        </Box>
        <Grid container spacing={6}>
          <Grid item xs={12}>
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
                    <>
                      <Typography variant='subtitle1' component='span'>
                        2. Add the same grade ID(correct=167 not Correct=4B) that is mentioned on the class/grade page,
                        for example, 167.
                      </Typography>
                      <img style={{ marginTop: 10 }} src='/images/gradeSampleImg.png' />
                    </>
                  }
                />
              </ListItem>
              <ListItem disableGutters>
                <ListItemText
                  primary={
                    <Typography variant='subtitle1' component='span'>
                      3. Make sure all the fields are correctly filled.
                    </Typography>
                  }
                />
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12}>
            <a
              style={{ textDecoration: 'none', display: 'flex', justifyContent: 'center', alignItem: 'center' }}
              href='/sample.csv'
              download='sample.csv'
              type='text/csv'
            >
              <Box
                onClick={() => {
                  handleClose()
                }}
                sx={{
                  fontSize: 20,
                  backgroundColor: theme => theme.palette.primary.main,
                  color: 'white',
                  border: '1px solid grey',
                  borderRadius: 1,
                  p: 1,
                  textAlign: 'center',
                  width: '60%'
                }}
              >
                <Icon icon='material-symbols:download-rounded' fontSize='large' />
                &nbsp;Download Sample CSV
              </Box>
            </a>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  )
}

export default DownloadCSVModal
