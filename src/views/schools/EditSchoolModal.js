// ** React Imports
import { useState, forwardRef, useEffect, useRef } from 'react'

import { update, updateSchoolProfile } from 'src/services/school.service'

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
import Autocomplete from '@mui/material/Autocomplete'
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { AimOutlined } from '@ant-design/icons';

import { toast } from 'react-hot-toast'
import usePlacesService from 'react-google-autocomplete/lib/usePlacesAutocompleteService'

import { useAuth } from 'src/hooks/useAuth'
import Map from 'src/@core/components/map'

import { DialogTitle, Stack, Tooltip } from '@mui/material'
import { Spin } from 'antd'

import Cropper from './Cropper'

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})

const EditSchoolModal = ({ isOpen, handleClose, onSubmit, school, isLoaded, placesData }) => {
  const auth = useAuth()
  const [isMyLocation, setIsMyLocation] = useState(false)

  const geoencoder = new google.maps.Geocoder()
  const [schoolLocation, setSchoolLocation] = useState({
    latLng: null,
    address: '',
    place_id: null,
    query: ''
  })

  const { placesService, placePredictions, getPlacePredictions, isPlacePredictionsLoading } = placesData

  useEffect(() => {
    if (isLoaded) {
      setSchoolLocation({
        ...schoolLocation,
        latLng: new google.maps.LatLng(23.885942, 45.079162)
      })
    }
  }, [isLoaded])

  useEffect(() => {
    // fetch place details for the first element in placePredictions array
    placesService?.getDetails(
      {
        placeId: schoolLocation.place_id
      },
      placeDetails => {
        setSchoolLocation({
          ...schoolLocation,
          active: true,
          query: placeDetails.formatted_address,
          address: placeDetails.formatted_address,
          place_id: placeDetails.place_id,
          latLng: new google.maps.LatLng(placeDetails.geometry.location.lat(), placeDetails.geometry.location.lng())
        })
      }
    )
  }, [schoolLocation.place_id])

  useEffect(() => {
    if (isMyLocation) {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log(position, "position")
            const { latitude, longitude } = position.coords;
            // Use Geocoding API to get location name
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
              if (status === 'OK' && results[0]) {
                setSchoolLocation({
                  ...schoolLocation,
                  active: true,
                  query: results[0].formatted_address,
                  address: results[0].formatted_address,
                  place_id: '',
                  latLng: new google.maps.LatLng(latitude, longitude)
                })
              }
            });
          },
          (error) => {
            console.log(error);
          }
        );
      } else {
        console.log('Geolocation is not supported by this browser.');
      }
    } else {
      setSchoolLocation({
        latLng: null,
        address: '',
        place_id: null,
        query: ''
      })
    }
  }, [isMyLocation]);

  // ** States
  const [name, setName] = useState('')
  const [radius, setRadius] = useState(school.radius)
  const [logo, setLogo] = useState(school?.profileUrl)
  const [selectedImage, setSelectedImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState(false)

  const logoInputRef = useRef(null)

  const handleSubmit = async (e) => {
    e.preventDefault();
    // let addr = await geoencoder.geocode({ location: schoolLocation.latLng })
    if(schoolLocation?.query) {
      setErrors(false)
      setLoading(true);
    const result = await update(
      school.id,
      name,
      schoolLocation.query,
      schoolLocation.latLng.lat(),
      schoolLocation.latLng.lng(),
      selectedImage,
      radius,
      auth.user.id
    )
    console.log(result)

    if (result?.success) {
      setLoading(false);
      toast.success('Update successful')
      onSubmit()
      handleClose()
    } else {
      setLoading(false);
      toast.error(result.message)
    }
  } else{
    setLoading(false);
    toast.error("Please Enter Location")
    setErrors(true)
  }
  }

  /////////////////////////////////////////////////////////////////////////////
  const [crop, setCrop] = useState()
  const [isCropping, setCropping] = useState(false)
  const [placeholderImg, setPlaceholderImg] = useState('')

  const logoChangeHandler = async (e) => {
    if (e.target.files && e.target.files.length > 0) {

      const result = await updateSchoolProfile(
        school.id,
        e.target.files[0]
      )

      if (result.success) {
        toast.success('File Uploaded Successfully')
      } else {
        toast.error(result.message)
      }
      setSelectedImage(e.target.files[0]);
      setCrop(undefined) // Makes crop preview update between images.
      const reader = new FileReader()
      reader.addEventListener('load', () => {
        setPlaceholderImg(reader.result?.toString() || '')
        setCropping(true)
      })
      reader.readAsDataURL(e.target.files[0])
    }
  }

  function finalizeLogo(file) {
    setLogo(placeholderImg)
    setCropping(false)
    setPlaceholderImg('')
  }

  /////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (school) {
      if (school.name) {
        setName(school.name)
        setRadius(school.radius)
      }

      setSchoolLocation({
        ...schoolLocation,
        active: true,
        query: school.address,
        address: school.address,
        latLng: new google.maps.LatLng(school.lat, school.long)
      })
    }
  }, [school])

  const handleRadiusChange = (e) => {
    if (e.target.value < 0) {
      setRadius(0.5);
    } else {
      setRadius(e.target.value)
    }
  }

  const hamdleMyLocation = (event) => {
    setIsMyLocation(event.target.checked);
  };

  return (
    <>
      <Cropper
        imgSrc={placeholderImg}
        crop={crop}
        setCrop={setCrop}
        cb={finalizeLogo}
        handleClose={() => {
          setCropping(false)
          setPlaceholderImg('')
        }}
        isOpen={isCropping}
      />

      <Dialog
        fullWidth
        open={isOpen}
        maxWidth='md'
        scroll='body'
        onClose={handleClose}
        TransitionComponent={Transition}
        onBackdropClick={handleClose}
      >
        <DialogTitle>Edit School</DialogTitle>
        <IconButton size='small' onClick={handleClose} sx={{ position: 'absolute', right: '1rem', top: '1rem' }}>
          <Icon icon='mdi:close' />
        </IconButton>
        <Spin spinning={loading}>
        <form autocomplete="off" onSubmit={handleSubmit}>
        <DialogContent sx={{ pb: 4, px: { xs: 8, sm: 15 }, pt: { xs: 1.5, sm: 1.5 }, position: 'relative' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={5}>
              {placeholderImg === '' && (
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <input type='file' ref={logoInputRef} onChange={logoChangeHandler} hidden />
                  {!logo ? (
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                        '&:hover > .upload': {
                          background: theme => `${theme.palette.primary.main}11`
                        }
                      }}
                      onClick={() => logoInputRef.current.click()}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          color: theme => theme.palette.primary.main,
                          p: 4,
                          border: theme => `1px dashed ${theme.palette.primary.main}`,

                          borderRadius: 1,
                          transition: '0.25s all ease-in-out'
                        }}
                        className='upload'
                      >
                        <Icon icon='material-symbols:upload-rounded' />
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-around',
                          alignItems: 'flex-start',
                          pl: 2,
                          color: theme => theme.palette.primary.main,
                          maxWidth: 150
                        }}
                      >
                        <Typography variant='p'>School Logo</Typography>
                        <Typography variant='caption'>Click here to upload the school logo</Typography>
                      </Box>
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        width: 240,
                        height: 70,
                        boxShadow: 3,
                        p: 1,
                        borderRadius: 1,
                        position: 'relative'
                      }}
                    >
                      <img
                        src={logo.src || logo}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }}
                      />
                      <Tooltip title='Edit Logo'>
                        <Box
                          sx={{
                            position: 'absolute',
                            top: '-10px',
                            right: '-10px',
                            height: '25px',
                            width: '25px',
                            p: 1.25,
                            borderRadius: 1,
                            background: theme => theme.palette.primary.main,
                            color: theme => theme.palette.primary.contrastText,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                          }}
                          onClick={() => logoInputRef.current.click()}
                        >
                          <Icon icon='material-symbols:edit' />
                        </Box>
                      </Tooltip>
                    </Box>
                  )}
                </Box>
              )}
            </Grid>
            <Grid item xs={12} sm={7}>
              <Stack spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    value={name}
                    onChange={e => setName(e.target.value)}
                    fullWidth
                    label='School Name'
                    size='small'
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    value={radius}
                    onChange={handleRadiusChange}
                    fullWidth
                    type='number'
                    label='Distance Range (km)'
                    size='small'
                  />
                </Grid>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                freeSolo
                fullWidth
                value={schoolLocation.query}
                onChange={(_, value) => {
                  const place = placePredictions.find(p => p.description === value)
                  if (place) setSchoolLocation({ ...schoolLocation, place_id: place.place_id, query: value })
                }}
                options={placePredictions.map(option => option.description) || []}
                size='small'
                renderInput={params => (
                  <TextField
                    {...params}
                    onChange={evt => {
                      getPlacePredictions({ input: evt.target.value })
                    }}
                    label='School Location'
                    loading={isPlacePredictionsLoading}
                  />
                )}
              />
              {errors && <Alert severity="error">PLease Select Location!</Alert>}
              <div style={{ position: "relative" }}>
                <Tooltip title='My Location'>
                  <FormControlLabel
                    value="end"
                    control={
                      <Checkbox
                        checked={isMyLocation}
                        onChange={hamdleMyLocation}
                        inputProps={{ 'aria-label': 'controlled' }}
                        icon={<AimOutlined style={{ fontSize: 30 }} />}
                        checkedIcon={<AimOutlined style={{ fontSize: 35, color: "#0099ff" }} />}
                      />}
                    labelPlacement="end"
                    style={{
                      position: 'absolute',
                      bottom: 20,
                      left: 10,
                      backgroundColor: 'white',
                      padding: 8,
                      margin: 5,
                      borderRadius: 50,
                      border: 'none',
                      boxShadow: '0 0 5px gray',
                      cursor: 'pointer',
                      zIndex: 1,
                    }}
                  />
                </Tooltip>
                <Map marker={schoolLocation} setMarker={setSchoolLocation} isLoaded={isLoaded} radius={radius} />
              </div>
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

export default EditSchoolModal
