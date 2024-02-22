// ** React Imports
import { useState, forwardRef } from 'react'

// ** MUI Imports

import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Fade from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { Grid, TextField, Select, MenuItem, InputLabel, FormControl, DialogTitle } from '@mui/material'

import { updatePlan } from 'src/services/cms'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import { toast } from 'react-hot-toast'
import { Spin } from 'antd'

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})

const AddSchoolModal = ({ isOpen, handleClose, onSubmit, plan }) => {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState(plan)

  const handleSubmit = async e => {
    e.preventDefault()
    console.log(formData, 'formData')
    setLoading(true)
    const result = await updatePlan(formData)

    if (result?.success) {
      toast.success('Plan has been sent')
      setLoading(false)
      onSubmit(result.school)
      handleClose()
    } else {
      toast.error(result?.message)
      setLoading(false)
    }
  }

  const handleInputChange = event => {
    const { name, value } = event.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }
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
        <DialogTitle>Edit Plan</DialogTitle>
        <IconButton size='small' onClick={handleClose} sx={{ position: 'absolute', right: '1rem', top: '1rem' }}>
          <Icon icon='mdi:close' />
        </IconButton>
        <Spin spinning={loading}>
          <form autocomplete='off' onSubmit={handleSubmit}>
            <DialogContent sx={{ pb: 4, px: { xs: 8, sm: 15 }, pt: { xs: 1.5, sm: 1.5 }, position: 'relative' }}>
              <Grid container spacing={5}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Title'
                    name='title'
                    value={formData?.title}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    type='number'
                    fullWidth
                    label='No of Students'
                    name='noOfStudent'
                    value={formData?.noOfStudent}
                    onChange={handleInputChange}
                  />
                </Grid>
                {[1, 2, 3, 4, 5, 6].map(index => (
                  <Grid item xs={6} key={index}>
                    <TextField
                      fullWidth
                      label={`Point ${index}`}
                      name={`point${index}`}
                      value={formData && formData[`point${index}`]}
                      onChange={handleInputChange}
                    />
                  </Grid>
                ))}
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel for='select-duration'>Subscription Type</InputLabel>
                    <Select
                      style={{ marginTop: 8 }}
                      id='select-duration'
                      disabled
                      name='durationType'
                      value={formData?.durationType}
                      onChange={handleInputChange}
                    >
                      <MenuItem value='monthly'>Monthly</MenuItem>
                      <MenuItem value='yearly'>Yearly</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Price'
                    name='price'
                    type='number'
                    value={formData?.price}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Percentage OFF'
                    name='point8'
                    type='number'
                    disabled={formData?.durationType === 'monthly'}
                    value={formData?.point8}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label='Price Id'
                    name='priceId'
                    value={formData?.priceId}
                    onChange={handleInputChange}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, px: { xs: 8, sm: 15 }, justifyContent: 'space-between' }}>
              <Button variant='outlined' onClick={handleClose}>
                Discard
              </Button>
              <Button variant='contained' type='submit'>
                Save
              </Button>
            </DialogActions>
          </form>
        </Spin>
      </Dialog>
    </>
  )
}

export default AddSchoolModal
