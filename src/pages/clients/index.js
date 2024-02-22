import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'

import DialogAddClient from 'src/views/clients/DialogAddClient'
import * as React from 'react'
import { useEffect, useState } from 'react'

import { getAll } from 'src/services/client.service'
import ClientsTable from '../../views/clients/ClientsTable'
import { Divider } from '@mui/material'

const Clients = () => {
  const [isAddModalVisible, setAddModalVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  const [clients, setClients] = useState([])

  const fetchClient = async () => {
    setLoading(true)
    const data = await getAll()

    if (data?.success) {
      setLoading(false)
      setClients(data.clients)
    }
    setLoading(false)
  }

  useEffect(() => {
    const fn = async () => {
      setLoading(true)
      const data = await getAll()

      if (data?.success) {
        setLoading(false)
        setClients(data.clients)
      }
      setLoading(false)
    }

    fn()
  }, [])

  const addClient = client => {
    setClients([client, ...clients])
  }
  const handleOpen = () => {
    setAddModalVisible(true)
  }
  const handleClose = () => {
    setAddModalVisible(false)
  }

  return (
    <Grid container spacing={5}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Card style={{ padding: 20 }}>
            <Box sx={styles.headingContainer}>
              <Typography variant='h5'>Clients</Typography>
              <Button variant='contained' color='primary' onClick={() => handleOpen()}>
                Add Client
              </Button>
            </Box>
            <Divider />
            <ClientsTable
              fetchClients={fetchClient}
              setLoading={setLoading}
              loading={loading}
              clients={clients}
              setClients={setClients}
            />
          </Card>
        </Box>
      </Grid>
      <DialogAddClient onSubmit={addClient} isOpen={isAddModalVisible} handleClose={handleClose} />
    </Grid>
  )
}

const styles = {
  headingContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
}

export default Clients
