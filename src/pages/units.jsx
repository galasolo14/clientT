import React, {useState, useEffect, ChangeEvent} from "react";
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ListItemText from '@mui/material/ListItemText';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import AddIcon from '@mui/icons-material/Add';

import { Collapse } from '@mui/material';
import axios from 'axios';

const Units = () => {
   
    const [units, setUnits]= useState([])
    const [open, setOpen]= useState(false)

    const [currentUnit, setCurrentUnit]= useState(null)
    const [currentAmount, setCurrentAmount]= useState(null)

    useEffect(() => {
      getUnits();
      }, []);

    const getUnits = async () => {
      axios.get(`http://localhost:3005/unit/getUnits`)
      .then(res => {
        const data = res.data.unitsList
        setUnits(data);
      })
    }

    const addBudget = (id, budget) => {
      console.log(id)
      axios.post(`http://localhost:3005/unit/addBudget/${id}`, {total: budget})
      .then(res => {   
        getUnits();
        setCurrentAmount(null)
        setCurrentUnit(null)
      })
    }

    const addNewBudget = () => {
      setOpen(true)
    }

    const done = () => {
      addBudget(currentUnit, currentAmount)
      setOpen(false)
    }

    const currentUnitAmount = (data) => {
      setCurrentAmount(data)
    }

    const currentUnitId = (data) => {
      const unit = units.find((unit) => unit.name ===data)
      setCurrentUnit(unit._id)
    }

    return (<>
    <Typography variant="h3">Units List</Typography>
    <Box component="form" sx={{display: 'flex', justifyContent: 'space-between', p: 2}}>
    <Button variant="contained" onClick={addNewBudget}>Add Budget</Button>
    </Box>
    <Collapse in={open}>
    <Box component="form" sx={{display: 'flex', justifyContent: 'space-around', p: 2}}>
  
    <Autocomplete
        options={units.map((option) => option.name)}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Unit" />}
        onChange={(event, value) => currentUnitId(value)}
      />
      
      <TextField id="outlined-basic" label="amount" variant="outlined" onChange={(event) => currentUnitAmount(event.target.value)} />
      <Button variant="contained" onClick={done}>done</Button>
      </Box>
    </Collapse>
    <List>
    {units && units.map((unit) => (
      <ListItem key={unit._id}> 
      
      <ListItemText sx={{pl: 2, minWidth: 400}} primary={unit.name} />
     
      Unit ID:
      <ListItemText sx={{pl: 2, minWidth: 300}} primary={unit._id} />

      Budget:
      <ListItemText sx={{pl: 2, minWidth: 300}} primary={unit.budget} />
        
      </ListItem>
      ))}
     </List>
    </>)
}

export default Units;