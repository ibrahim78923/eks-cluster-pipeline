import { Box, Button, Dialog, DialogActions, DialogContent } from '@mui/material'
import React, { useState, useRef } from 'react'

import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop'
import { canvasPreview } from './canvasPreview'
import { useDebounceEffect } from './useDebounceEffect'

// This is to demonstate how to make and center a % aspect crop
// which is a bit trickier so we use some helper functions.
function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  )
}

export default function Cropper({ aspect = 24 / 7, imgSrc = '', crop, setCrop, cb, isOpen, handleClose }) {
  const previewCanvasRef = useRef(null)
  const imgRef = useRef(null)
  const blobUrlRef = useRef('')

  const [completedCrop, setCompletedCrop] = useState()

  function onImageLoad(e) {
    const { width, height } = e.currentTarget
    setCrop(centerAspectCrop(width, height, aspect))
  }

  function onDownloadCropClick() {
    if (!previewCanvasRef.current) {
      throw new Error('Crop canvas does not exist')
    }

    previewCanvasRef.current.toBlob(blob => {
      if (!blob) {
        throw new Error('Failed to create blob')
      }
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current)
      }
      blobUrlRef.current = URL.createObjectURL(blob)

      //
      cb(blobUrlRef.current)
    })
  }

  useDebounceEffect(
    async () => {
      if (completedCrop?.width && completedCrop?.height && imgRef.current && previewCanvasRef.current) {
        // We use canvasPreview as it's much faster than imgPreview.
        canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop, 1, 0)
      }
    },
    100,
    [completedCrop]
  )

  return (
    <Dialog fullWidth open={isOpen} onClose={handleClose} maxWidth='sm' sx={{ zIndex: `9999999 !important` }}>
      <DialogContent sx={{ pb: 4, pt: { xs: 1.5, sm: 1.5 }, position: 'relative' }}>
        <Box
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: 300
          }}
        >
          {!!imgSrc && (
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={c => setCompletedCrop(c)}
              aspect={aspect}
            >
              <img ref={imgRef} alt='Crop' src={imgSrc} onLoad={onImageLoad} />
            </ReactCrop>
          )}

          {!!completedCrop && (
            <div>
              <canvas
                ref={previewCanvasRef}
                style={{
                  border: '1px solid black',
                  objectFit: 'contain',
                  display: 'none',
                  width: 240,
                  height: 70
                }}
              />
            </div>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'space-between' }}>
        <Button variant='outlined' onClick={handleClose}>
          Discard
        </Button>
        <Button variant='contained' onClick={onDownloadCropClick}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}
