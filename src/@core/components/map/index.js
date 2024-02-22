import { Box } from '@mui/material'

import { GoogleMap, Marker, useGoogleMap, Circle } from '@react-google-maps/api'
import React, { useEffect, useState } from 'react'

const containerStyle = {
  width: 'inherit',
  height: 'inherit'
}

const center = {
  lat: 23.885942,
  lng: 45.079162
}

const Map = ({ marker, setMarker, isLoaded, radius }) => {
  const geoencoder = new google.maps.Geocoder()
  // useEffect(() => {
  //   if ("geolocation" in navigator) {
  //     navigator.geolocation.getCurrentPosition(function (position) {
  //       console.log(position,"position")
  //       setMarker({
  //         ...marker,
  //         active: true,
  //         latLng: new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
  //       });
  //     });
  //   } else {
  //     setMarker({
  //       ...marker,
  //       active: true,
  //       latLng: new google.maps.LatLng(23.885942, 45.079162)
  //     });
  //   }
  // }, []);
  const getAddress = async (latLng)=> {
    let addr = await geoencoder.geocode({ location: latLng })
    console.log(addr?.results[0]?.formatted_address,"addres");
    return addr?.results[0]?.formatted_address;
  }

  return (
    <Box sx={{ width: '100%', height: 350, mt: 2 }}>
      {!isLoaded ? (
        <h1>Loading...</h1>
      ) : (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={20}
          onClick={async(e) => {
            if (e.placeId) {
              setMarker({
                ...marker,
                place_id: e.placeId,
                active: true,
                latLng: e.latLng,
                query: await getAddress(e.latLng),
                address: await getAddress(e.latLng),
              })
            } else {
              setMarker({
                ...marker,
                query: e.latLng.lat() + ', ' + e.latLng.lng(),
                active: true,
                latLng: e.latLng,
                query: await getAddress(e.latLng),
                address: await getAddress(e.latLng),
              })
            }
          }}
        >
          {marker.active && <CustomMarker marker={marker} radius={radius}/>}
        </GoogleMap>
      )}
    </Box>
  )
}

const CustomMarker = ({ marker, radius }) => {
  const googleMap = useGoogleMap()

  useEffect(() => {
    if (googleMap && marker.active) googleMap.panTo(marker.latLng)
  }, [marker.latLng])

  return (
    <>
      <Marker position={marker.latLng} />
      <Circle center={marker.latLng} radius={parseFloat(radius) * 1000} />
    </>
  )

}

export default Map
