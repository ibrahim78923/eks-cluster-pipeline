import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { Icon } from '@iconify/react';
import {useState} from "react";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import DialogEditCampus from "./DialogEditCampus";
import DialogDeleteCampus from "./DialogDeleteCampus";

const CampusGrid = ({ campuses = [], setCampuses }) => {
  const [isEditModalVisible, setEditModalVisible] = useState(false)
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false)
  const [campus, setCampus] = useState({})

  const openEditModal = data => {
    setEditModalVisible(true)
    setCampus(data)
  }
  const closeEditModal = () => {
    setEditModalVisible(false)
  }
  const openDeleteModal = data => {
    setDeleteModalVisible(true)
    setCampus(data)
  }
  const closeDeleteModal = () => {
    setDeleteModalVisible(false)
  }

  const editCampus = campus => {
    const newCampuses = campuses.map(s => {
      if (s.id == campus.id) {
        return campus
      } else return s
    })

    setCampuses(newCampuses)
  }

  const deleteCampus = id => {
    const newCampuses = campuses.filter(s => {
      return s.id !== id
    })

    setCampuses(newCampuses)
  }

  return (
    <>
      <Grid container spacing={3}>
        {campuses.map((c, index) => {
          return <GridItem key={index} campus={c} openDeleteModal={openEditModal} openEditModal={openDeleteModal}/>
        })}
      </Grid>
      <DialogEditCampus
        onSubmit={editCampus}
        campus={campus}
        isOpen={isEditModalVisible}
        handleClose={closeEditModal}
      />
      <DialogDeleteCampus
        onSubmit={deleteCampus}
        campus={campus}
        isOpen={isDeleteModalVisible}
        handleClose={closeDeleteModal}
      />
    </>
  );
}

const GridItem = ({ campus, openDeleteModal, openEditModal }) => {
  const [isMouseOver, setMouseOver] = useState(false);

  return (
    <Grid item xs={12} sm={6} md={4} lg={3} onMouseEnter={() => setMouseOver(true)} onMouseLeave={() => setMouseOver(false)}>
      <Accordion expanded={isMouseOver}>
        <AccordionSummary
          expandIcon={<Icon icon="material-symbols:keyboard-arrow-down" />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Stack>
            <Typography>{campus.name}</Typography>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex' }}>
            <IconButton color='primary' onClick={() => openDeleteModal(campus.id)}>
              <Icon icon='material-symbols:edit' />
            </IconButton>
            <IconButton color='primary' onClick={() => openEditModal(campus.id)}>
              <Icon icon='material-symbols:delete-outline' />
            </IconButton>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Grid>
  )
}

export default CampusGrid;
