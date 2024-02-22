import React, { useState } from 'react'
import { TextField, Button, Grid, Paper, IconButton } from '@mui/material'
import { Icon } from '@iconify/react'

const FormSection = () => {
  const [formData, setFormData] = useState({
    heroTitleBold: '',
    heroText1: '',
    heroText2: '',
    message: '',
    file: null
  })

  const handleInputChange = event => {
    const { name, value } = event.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = event => {
    event.preventDefault()
    // You can handle form submission logic here
    console.log('Form data submitted:', formData)
  }
  const handleFileChange = event => {
    const file = event.target.files[0]
    setFormData(prevData => ({
      ...prevData,
      file: file
    }))
  }

  return (
    <Grid container justifyContent='center' alignItems='center' className='my-8'>
      <Grid item xs={4} md={6} lg={10} sx={{ mx: 2 }}>
        <Paper
          elevation={3}
          sx={{ borderRadius: '10px', p: 8, boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', width: '100%' }}
        >
          <form onSubmit={handleSubmit}>
            <Grid container spacing={8}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label='Heading'
                  name='heroTitleBold'
                  value={formData.heroTitleBold}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label='Text1'
                  name='Text1'
                  value={formData.heroText1}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label='Text2'
                  type='text'
                  name='heroText2'
                  value={formData.heroText2}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              {/* Display selected image */}
              <Grid item xs={12}>
                {formData.file && (
                  <div style={{ position: 'relative' }}>
                    <img
                      src={URL.createObjectURL(formData.file)}
                      alt='Uploaded File'
                      style={{ width: '100%', maxHeight: '200px', marginBottom: '10px', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', top: -14, right: -14 }}>
                      <IconButton color='info'>
                        <Icon icon='material-symbols:edit' fontSize={40} />
                      </IconButton>
                    </div>
                  </div>
                )}
                <input
                  type='file'
                  accept='.jpg, .jpeg, .png, .pdf' // Specify allowed file types
                  name='file'
                  style={{ display: 'none' }}
                  id='upload-video'
                  onChange={handleFileChange}
                />
                {!formData.file && (
                  <label for='upload-video' style={{ cursor: 'pointer' }}>
                    <img
                      style={{ width: '100%', maxHeight: '200px', marginBottom: '10px', objectFit: 'contain' }}
                      src='https://menaiortho.com.au/wp-content/uploads/2015/03/banner-placeholder.jpg'
                    />
                  </label>
                )}
              </Grid>
              <Grid item xs={12}>
                <Button type='submit' variant='contained' color='primary' fullWidth>
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Grid>
    </Grid>
  )
}

export default FormSection
