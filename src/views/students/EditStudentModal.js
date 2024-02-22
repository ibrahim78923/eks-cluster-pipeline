// ** React Imports
import { useState, forwardRef, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'

import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Fade from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { Spin } from 'antd'

import { update } from 'src/services/student.service'

import { toast } from 'react-hot-toast'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import InputAdornment from '@mui/material/InputAdornment'
const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})

const DialogEditStudent = ({ isOpen, handleClose, onSubmit, student }) => {
  // ** States
  const [name, setName] = useState('')
  const [nameAr, setNameAr] = useState('')
  const [gender, setGender] = useState('')
  const [grade, setGrade] = useState('')

  const [gradeId, setGradeId] = useState(null)
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [passowrd, setPassowrd] = useState('')
  const [showpassword, setShowPassword] = useState(true)
  const [parentId, setParentId] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (student.name) {
      setName(student.name)
    }
    if (student.nameAr) {
      setNameAr(student.nameAr)
    }
    if (student.gender) {
      setGender(student.gender)
    }
    if (student.grade) {
      setGrade(student.grade.grade)
      setGradeId(student.grade.id)
    }
    if (student.parent) {
      setEmail(student.parent.email)
      setPassowrd(student.parent.password)
      setPhone(student.parent.phoneNo)
      setParentId(student.parent.id)
    }
  }, [student])

  const handleSubmit = async () => {
    const updatedSchoolStudent = {
      ...student,
      name,
      gender
    }
    const parentId = student?.parent?.id;
    const schoolId = student?.school?.id;
    setLoading(true);
    const result = await update(student.id, name, nameAr, gender,phone, email,parentId,passowrd, gradeId, schoolId )
    if (result?.success) {
      toast.success('Student has been edited')
      setLoading(false);
      onSubmit();
      handleClose()
    } else {
      toast.error(result?.message)
      setLoading(false);
    }
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
      <DialogContent sx={{ pb: 6, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}>
        <IconButton size='small' onClick={handleClose} sx={{ position: 'absolute', right: '1rem', top: '1rem' }}>
          <Icon icon='mdi:close' />
        </IconButton>
        <Box sx={{ mb: 9, textAlign: 'center' }}>
          <Typography variant='h5' sx={{ mb: 3, lineHeight: '2rem' }}>
            Edit Student
          </Typography>
        </Box>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <TextField
              value={name}
              onChange={e => setName(e.target.value)}
              fullWidth
              label='Student Name'
              size='small'
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              value={nameAr}
              onChange={e => setNameAr(e.target.value)}
              fullWidth
              label='Arabic Name'
              size='small'
            />
          </Grid>
          <Grid item xs={12}>
            <TextField value={grade} onChange={e => setGrade(e.target.value)} fullWidth label='Grade' size='small' />
          </Grid>
          <Grid item xs={12}>
            <TextField
              value={email}
              onChange={e => setEmail(e.target.value)}
              fullWidth
              label='Guardian Email'
              size='small'
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              value={phone}
              onChange={e => setPhone(e.target.value)}
              fullWidth
              label='Guardian Phone'
              size='small'
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              value={passowrd}
              onChange={e => setPassowrd(e.target.value)}
              fullWidth
              label='Password'
              size='small'
              type={showpassword === true ? 'password' : 'text'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      onMouseDown={e => e.preventDefault()}
                      aria-label='toggle password visibility'
                      onClick={() => setShowPassword(!showpassword)}
                    >
                      <Icon fontSize={20} icon={showpassword == false ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl>
              <FormLabel>Gender</FormLabel>
              <RadioGroup row value={gender} onChange={e => setGender(e.target.value)}>
                <FormControlLabel value='Male' control={<Radio />} label='Male' />
                <FormControlLabel value='Female' control={<Radio />} label='Female' />
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'center' }}>
        <Button variant='contained' sx={{ mr: 2 }} onClick={handleSubmit}>
          Submit
        </Button>
        <Button variant='outlined' color='secondary' onClick={handleClose}>
          Cancel
        </Button>
      </DialogActions>
      </Spin>
    </Dialog>
  )
}

export default DialogEditStudent
