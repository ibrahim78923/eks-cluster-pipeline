import React, { useState } from 'react'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import { Typography, TextField } from '@mui/material'

const options = [
  "It's too expensive for the value I'm receiving.",
  'I no longer need the service.',
  'I encountered too many technical issues.',
  'I found a product/service that fits my needs better.',
  'I found the platform difficult to navigate.',
  "I wasn't satisfied with the customer support.",
  "I'm taking a temporary break but plan to return.",
  'I have concerns about my data and privacy.',
  'Other'
]

const RadioGroupComponent = ({ setSelectedOption, selectedOption, setOtherReason, otherReason, setError }) => {
  const handleRadioChange = event => {
    setSelectedOption(event.target.value)
    if (event.target.value) setError('')
  }

  const handleOtherReasonChange = event => {
    setOtherReason(event.target.value)
    if (event.target.value) setError('')
  }
  return (
    <div>
      <Typography variant='h6'>Select a Reason:</Typography>
      <RadioGroup name='reason' value={selectedOption} onChange={handleRadioChange}>
        {options.map(option => (
          <FormControlLabel key={option} value={option} control={<Radio />} label={option} />
        ))}
      </RadioGroup>
      {selectedOption === 'Other' && (
        <TextField
          label='Other Reason'
          variant='outlined'
          value={otherReason}
          onChange={handleOtherReasonChange}
          fullWidth
          margin='normal'
        />
      )}
    </div>
  )
}

export default RadioGroupComponent
