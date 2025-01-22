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
import Checkbox from '@mui/material/Checkbox';
import { Collapse } from '@mui/material';
import axios from 'axios';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

const Inventory = () => {

    let date = Date();

    const [items, setItems]= useState([])
    const [filteredItems, setFilteredItems]= useState([])

    const [open, setOpen]= useState(false)

    const [currentDescription, setCurrentDescription] = useState('')
    const [currentPrice, setCurrentPrice] = useState('')
    const [currentQuantity, setCurrentQuantity] = useState('')
    const [expirationDate, setExpirationDate] = useState(dayjs(date))
    const [type, setType] = useState('')
    const [status, setStatus] = useState(false)

    const [showStatus, setShowStatus] = useState('all')

    useEffect(() => {
      getItems();
      }, []);

    const getItems = async () => {
      axios.get(`http://localhost:3005/items/getItems`)
      .then(res => {
        const data = res.data.itemsList
        setItems(data);
        setFilteredItems(data)
      })
    }

    const deleteItem = (id) => {
      axios.delete(`http://localhost:3005/items/deleteItem/${id}`)
      .then(res => {   
        getItems();
      })
    }

    const addItemToList = () => {
      const data = {
        description: currentDescription,
        price: Number(currentPrice),
        quantity: Number(currentQuantity),
        expirationDate: expirationDate,
        type: type,
        damaged: status
      }
      axios.post(`http://localhost:3005/items/addItem`, {data})
      .then(res => {   
        getItems();
        reset()
      })
    }

    const reset = () => {
      setCurrentDescription('')
      setCurrentPrice('')
      setCurrentQuantity('')
      setType('')
      setStatus(false)
    }

    const addNewItem = () => {
      setOpen(true)
    }

    const done = () => {
      addItemToList()
      // setOpen(false)
    }
    
    const filterList = (text) => {
      if(text.length > 0){
        const filterList = filteredItems.filter((item)=> item.type.includes(text))

        setFilteredItems([...filterList])
      }else{
        setFilteredItems([...items])
      }
    }

    const showDamadgedItems = (status) => {
      setShowStatus(status)
      if(status === 'damadged'){
        const filterList = items.filter((item)=> item.damaged)
        setFilteredItems([...filterList])
      }
      if(status === 'notDamadged'){
        const filterList = items.filter((item)=> !item.damaged)
        setFilteredItems([...filterList])
      }
      if(status === 'all'){
        setFilteredItems([...items])
      }
    }
    

    return <>
    <Typography variant="h3">Inventory List</Typography>
    <Box component="form" sx={{display: 'flex', justifyContent: 'space-between', p: 2}}>
    <Box >
      <Button variant="contained" onClick={addNewItem}>Add</Button>
    </Box>
    <Box sx={{display: 'flex', justifyContent: 'space-between', p: 2}}>
      <Box sx={{mr: 2}}>
        <TextField id="outlined-basic" label="Search Inventory Type" variant="outlined" onChange={(event)=> filterList(event.target.value)}/>
      </Box>
      <Box >
        <FormControl>
          <FormLabel id="status-radio-buttons-group-label">Show Inventory By Status</FormLabel>
          <RadioGroup
            row
            aria-labelledby="status-radio-buttons-group-label"
            defaultValue="all"
            name="radio-buttons-group"
            value={showStatus}
            onChange={(event) => showDamadgedItems(event.target.value)}
          >
            <FormControlLabel value="all" control={<Radio />} label="All" />
            <FormControlLabel value="damadged" control={<Radio />} label="Damadged" />
            <FormControlLabel value="notDamadged" control={<Radio />} label="Not Damadged" />
          </RadioGroup>
        </FormControl>
      </Box>
    </Box>
    </Box>
    <Collapse in={open}>
    <Box component="form" sx={{display: 'flex', justifyContent: 'space-around', p: 2}}>
    
      
      <TextField id="description" label="description" variant="outlined" value={currentDescription} onChange={(event) => setCurrentDescription(event.target.value)}/>
      <TextField id="price" label="price" variant="outlined" value={currentPrice} onChange={(event) => setCurrentPrice(event.target.value)}/>
      <TextField id="quantity" label="quantity" variant="outlined" value={currentQuantity} onChange={(event) => setCurrentQuantity(event.target.value)}/>
      
      
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker label="expiration date" value={expirationDate} onChange={(newDate) => setExpirationDate(newDate)}/>
      </LocalizationProvider>


      <TextField id="type" label="type" variant="outlined" value={type}  onChange={(event) => setType(event.target.value)}/>

      Damaged:
      <Checkbox label="status" checked={status} onChange={(event) => setStatus(event.target.checked)}/>
      
      <Button variant="contained" onClick={done}>done</Button>
      </Box>
    </Collapse>
    <List>
    {filteredItems && filteredItems.map((item) => (
      <ListItem key={item._id}> 
      
      <ListItemText sx={{pl: 2, minWidth: 200}} primary={item.description} />
     

      Price:
      <ListItemText sx={{pl: 2,minWidth: 100}} primary={item.price} />

      Quantity:
      <ListItemText sx={{pl: 2,minWidth: 100}} primary={item.quantity} />

      Status:
      {item.damaged && <ListItemText sx={{pl: 2,minWidth: 100}} primary="Damaged" />}
      {!item.damaged && <ListItemText sx={{pl: 2,minWidth: 100}} primary="Good" />}

      Expire Date:
      <ListItemText sx={{pl: 2,minWidth: 100}} primary={item.expirationDate.slice(0,10)} />

      Type:
      <ListItemText sx={{pl: 2,minWidth: 200}} primary={item.type} />

    

        <ListItemButton sx={{ pl: 2 }} onClick={() => deleteItem(item._id)}>
        <ListItemIcon>
          <DeleteOutlineIcon />
        </ListItemIcon>
        </ListItemButton>

        
      </ListItem>
      ))}
     </List>
    </>
}

export default Inventory;