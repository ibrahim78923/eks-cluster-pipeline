// ** React Imports
import { useState, forwardRef, useEffect, useRef } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'

import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Fade from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

import { create } from 'src/services/notification.service'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import { toast } from 'react-hot-toast'

import { useAuth } from 'src/hooks/useAuth'

import { DialogTitle, Stack, Tooltip, colors, Alert, Card, Typography } from '@mui/material'

import { Spin } from 'antd'

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})

const AddSchoolModal = ({ isOpen, handleClose, onSubmit }) => {
  const auth = useAuth()
  // ** States
  const [title, setTitle] = useState('')
  const [massage, setMessage] = useState("")
  const [selected, setSelected] = useState("teacher")
  const [selectedImage, setSelectedImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const logoInputRef = useRef(null)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await create(
      title,
      massage,
      selectedImage,
      selected,
      auth.user.id
    )

    if (result?.success) {
      toast.success('Notification has been sent')
      setLoading(false);
      onSubmit(result.school)
      handleClose()
    } else {
      toast.error(result?.message)
      setLoading(false);
    }
  }

  const handleMessageChange = (e) => {
    if (e.target.value < 0) {
      setMessage(0.5);
    } else {
      setMessage(e.target.value)
    }
  }

  const SelectComponent = ({ item, selected, setSelected }) => {
  
      return (
        <Card
          sx={{
            display: 'flex',
            width: '100%',
            minHeight: 50,
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            p: 2,
            my: 1,
            boxShadow: 2,
            transition: '0.25s all ease-in-out',
            background: theme => (selected === item.id ? theme.palette.primary.main : `transparent`),
            color: theme => (selected === item.id ? theme.palette.primary.contrastText : 'auto'),
            border: theme =>
              selected === item.id ? `1px solid ${theme.palette.primary.main}` : `1px solid transparent`,
            '&:hover': {
              boxShadow: 5
            }
          }}
          onClick={() => setSelected(item.id)}
        >
          <Typography variant='p'>{item.name}</Typography>
          <Icon icon='material-symbols:chevron-right' />
        </Card>
      )
  };

  const selectData = [
    {
      name: "Teacher",
      id: "teacher",
    },
    {
      name: "Parent",
      id: "parent",
    }
  ]
console.log(selected,"selected")
  return (
    <>
      <Dialog
        fullWidth
        open={isOpen}
        maxWidth='sm'
        scroll='body'
        onClose={handleClose}
        TransitionComponent={Transition}
        onBackdropClick={handleClose}
      >
        <DialogTitle>Send Notifications</DialogTitle>
        <IconButton size='small' onClick={handleClose} sx={{ position: 'absolute', right: '1rem', top: '1rem' }}>
          <Icon icon='mdi:close' />
        </IconButton>
        <Spin spinning={loading}>
          <form autocomplete="off" onSubmit={handleSubmit}>
            <DialogContent sx={{ pb: 4, px: { xs: 8, sm: 15 }, pt: { xs: 1.5, sm: 1.5 }, position: 'relative' }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={5}>
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    {!selectedImage ? (
                      // <div class="image-upload">
                      //   <label for="file-input">
                      //     <img style={{ cursor: "pointer" }} src="https://cdn.pixabay.com/photo/2016/01/03/00/43/upload-1118928_960_720.png" width={'100px'} />
                      //   </label>

                        <input
                          type='file'
                          id="file-input"
                          ref={logoInputRef}
                          onChange={event => {
                            setSelectedImage(event.target.files[0])
                          }}
                        />
                      // </div>
                    ) : null}
                    {selectedImage && (
                      <Box display='flex' flexDirection='column' justifyContent='baseline' alignItems={"center"}>
                        <div>
                          <img alt='not found' width={'180px'} src={URL.createObjectURL(selectedImage)} />
                        </div>
                        <div>
                          <Button onClick={() => setSelectedImage(null)}>Remove</Button>
                        </div>
                      </Box>
                    )}
                  </Box>
                </Grid>
                <br />
                <Grid item xs={12} sm={7}>
                  <Stack spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        fullWidth
                        label='Title'
                        size='small'
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        value={massage}
                        onChange={handleMessageChange}
                        fullWidth
                        type='text'
                        label='Message'
                        size='large'
                        required
                      />
                    </Grid>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={12}>
                  {selectData?.map((item,i)=> {
                    return(
                      <SelectComponent key={i} item={item}  setSelected={setSelected} selected={selected} />
                    )
                  })}
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, px: { xs: 8, sm: 15 }, justifyContent: 'space-between' }}>
              <Button variant='outlined' onClick={handleClose}>
                Discard
              </Button>
              <Button variant='contained' type='submit'>
                Send
              </Button>
            </DialogActions>
          </form>
        </Spin>
      </Dialog>
    </>
  )
}

export default AddSchoolModal
