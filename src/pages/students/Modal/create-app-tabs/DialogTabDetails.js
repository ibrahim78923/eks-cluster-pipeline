import React from 'react'
import { Box, Typography, Grid, Paper } from '@mui/material'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import GroupIcon from '@mui/icons-material/Group'
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck'
import ReportProblemIcon from '@mui/icons-material/ReportProblem'
import { useSettings } from 'src/@core/hooks/useSettings'

const TotalCounts = ({ data }) => {
  const { settings } = useSettings()
  const iconSize = 30 // Adjust icon size as needed

  const countStyles = {
    fontSize: '2em',
    fontWeight: 'bold'
  }

  return (
    <Paper elevation={3} sx={{ padding: '16px', backgroundColor: settings?.mode === 'dark' ? '' : '#f2f2f2' }}>
      <Typography variant='h5'>Import Student Detail (Total Records: {data?.totalImportedLength})</Typography>
      <Grid container spacing={2} sx={{ mt: 10 }}>
        <Grid item xs={6} sm={4} md={3}>
          <Box textAlign='center'>
            <Typography variant='body2' sx={countStyles}>
              {data?.newStudents?.length}
            </Typography>
            <PersonAddIcon fontSize='large' style={{ fontSize: iconSize, color: 'green' }} />
            <Typography variant='body1'>New Students</Typography>
          </Box>
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <Box textAlign='center'>
            <Typography variant='body2' sx={countStyles}>
              {data?.existingUsers?.length}
            </Typography>
            <GroupIcon fontSize='large' style={{ fontSize: iconSize, color: 'orange' }} />
            <Typography variant='body1'>Existing Users</Typography>
          </Box>
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <Box textAlign='center'>
            <Typography variant='body2' sx={countStyles}>
              {data?.duplicates?.length}
            </Typography>
            <PlaylistAddCheckIcon fontSize='large' style={{ fontSize: iconSize, color: 'purple' }} />
            <Typography variant='body1'>Duplicates</Typography>
          </Box>
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <Box textAlign='center'>
            <Typography variant='body2' sx={countStyles}>
              {data?.invalidData?.length}
            </Typography>
            <ReportProblemIcon fontSize='large' style={{ fontSize: iconSize, color: 'red' }} />
            <Typography variant='body1'>Invalid Data</Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  )
}

export default TotalCounts
