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
import Divider from '@mui/material/Divider';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { Collapse } from '@mui/material';
import axios from 'axios';

const Orders = () => {

    const [orders, setOrders]= useState([])
    const [filteredOrders, setFilteredOrders]= useState([])
    
    const [items, setItems]= useState([])
    const [filteredItems, setFilteredItems]= useState([])

    const [units, setUnits]= useState([])
    const [open, setOpen]= useState(false)

    const [currentUnit, setCurrentUnit]= useState(null)
    const [currentTotal, setCurrentTotal]= useState(0)
    const [currentItems, setCurrentItems]= useState([])

    const [currentItem, setCurrentItem]= useState(null)
    const [currentQuantity, setCurrentQuantity]= useState('')

    const [showStatus, setShowStatus] = useState('all')

    useEffect(() => {
        getOrders();
      }, []);

    const getOrders = async () => {
      try{
      axios.get(`http://localhost:3005/order/getOrders`)
      .then(res => {
        const data = res.data.orderList;
        setOrders(data);
        setFilteredOrders(data)
      })
    }catch (err){
      throw new Error(err);
    }
    }

    const getItems = async () => {
      axios.get(`http://localhost:3005/items/getItems`)
      .then(res => {
        const data = res.data.itemsList
        setItems(data);
        setFilteredItems(data)
      })
    }

    const getUnits = async () => {
      axios.get(`http://localhost:3005/unit/getUnits`)
      .then(res => {
        const data = res.data.unitsList
        setUnits(data);
      })
    }

    const deleteOrder = (id) => {
      axios.delete(`http://localhost:3005/order/deleteOrder/${id}`)
      .then(res => {   
        getOrders();
      })
    }

    const completeOrder = (id) => {
      try{
        axios.patch(`http://localhost:3005/order/orderDone/${id}`)
        .then(res => {   
          getOrders();
        })
      }catch (err){
        throw new Error(err);
      }
      
    }

    const saveOrder = () => {
      const data = {
        items:currentItems,
        totalPrice: currentTotal,
        unitId: currentUnit
      }
      axios.post('http://localhost:3005/order/addOrder', {data})
      .then(res => {   
        reset()
        getOrders();
      })
    }

    const addNewOrder = () => {
      setOpen(true)
      getItems();
      getUnits();
    }

    const addToOrder = () => {
      if(currentItem && currentQuantity){
        const findItem = filteredItems.find((item) => item.description ===currentItem)

        if(findItem.quantity >= currentQuantity){
          const item = {
            itemId: findItem._id,
            itemDescription: currentItem,
            quantity: Number(currentQuantity)
          }
    
          setCurrentItems([...currentItems, item])
          setCurrentTotal(currentTotal+ (currentQuantity * findItem.price))
    
          setCurrentItem(null)

          const index = filteredItems.findIndex((item) => item.description ===currentItem)
          const newFilteredItems = filteredItems.toSpliced(index,1)
          setFilteredItems([...newFilteredItems])

        }else{
          alert(`You can only enter max ${findItem.quantity}!`)
        }
        
      }else{
        alert('Must add Item and Quantity!')
      }
      
    }

    const currentItemId = (data) => {
      const item = items.find((item) => item.description ===data)
      setCurrentItem(item.description)
    }

    const currentUnitId = (data) => {
      const unit = units.find((unit) => unit.name ===data)
      setCurrentUnit(unit._id)
    }

    const filterList = (text) => {
      const filterList = filteredOrders.filter((item)=> item._id.includes(text))

      setFilteredOrders([...filterList])
    }

    const cancelOrder = () => {
      reset()
    }

    const reset = () => {
      setCurrentItems([])
      // setCurrentUnit(null)
      setCurrentTotal(0)
      setOpen(false)
      setCurrentItem(null)
      setFilteredItems(items)
      setCurrentQuantity('')
    }

    const showOrdersStatus = (status) => {
      setShowStatus(status)
      if(status === 'pendding'){
        const filterList = orders.filter((item)=> !item.statusDone)
        setFilteredOrders([...filterList])
      }
      if(status === 'completed'){
        const filterList = orders.filter((item)=> item.statusDone)
        setFilteredOrders([...filterList])
      }
      if(status === 'all'){
        setFilteredOrders([...orders])
      }
    }

    return <>
    <Typography variant="h3">Order List</Typography>
    <Box component="form" sx={{display: 'flex', justifyContent: 'space-between', p: 2}}>
    <Box >
      <Button variant="contained" onClick={addNewOrder}>Add new order</Button>
    </Box>
    <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
      <TextField id="outlined-basic" label="Search order" variant="outlined" onChange={(event)=> filterList(event.target.value)}/>
      <Box sx={{ml: 2}}>
        <FormControl>
          <FormLabel id="status-radio-buttons-group-label">Show Orders By Status</FormLabel>
          <RadioGroup
            row
            aria-labelledby="status-radio-buttons-group-label"
            defaultValue="all"
            name="radio-buttons-group"
            value={showStatus}
            onChange={(event) => showOrdersStatus(event.target.value)}
          >
            <FormControlLabel value="all" control={<Radio />} label="All" />
            <FormControlLabel value="pendding" control={<Radio />} label="Pendding" />
            <FormControlLabel value="completed" control={<Radio />} label="Completed" />
          </RadioGroup>
        </FormControl>
        </Box>
      </Box>
    </Box>
    <Collapse in={open}>
      <Box component="form" sx={{display: 'flex', justifyContent: 'space-around', p: 2}}>
          <Autocomplete
              options={units.map((option) => option.name)}
              // value={currentUnit}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Unit" />}
              onChange={(event, value) => currentUnitId(value)}
          />
          <Typography>Total Price: {currentTotal}</Typography>
        </Box>
      <Box component="form" sx={{display: 'flex', justifyContent: 'space-around', p: 2}}>
          <Autocomplete
            options={filteredItems.map((option) => option.description)}
            value={currentItem}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Item" />}
            onChange={(event, value) => currentItemId(value)}
          />
          <TextField id="outlined-basic" label="quantity" variant="outlined" value={currentQuantity} onChange={(event) => setCurrentQuantity(event.target.value)}/>
          <Button variant="contained" onClick={addToOrder}>Add</Button>
        </Box>
      <Collapse in={currentItems.length}>
      <List>
        {currentItems.map((item) => (
        <ListItem sx={{display: 'flex', justifyContent: 'space-around'}} key={item.itemId}> 
    
        Description: 
        <ListItemText sx={{pl: 2}} primary={item.itemDescription} />

        Quantity:
        <ListItemText sx={{pl: 2}} primary={item.quantity} />
        </ListItem>
        ))}
      </List>
      <Box sx={{display: 'flex', justifyContent: 'space-around', p: 2}}>
        <Button variant="contained" onClick={cancelOrder}>Cancel Order</Button> 
        <Button variant="contained" onClick={saveOrder}>Save Order</Button>
      </Box>
      <Divider />
      </Collapse>
    </Collapse>
    <List>
      {filteredOrders && filteredOrders.map((order) => (
      <ListItem key={order._id}> 
      ID: 
      <ListItemText sx={{pl: 2}} primary={order._id} />
      Items: 
      <ListItemText sx={{pl: 2}} primary={order.items.length} />

      Total:
      <ListItemText sx={{pl: 2}} primary={order.totalPrice} />

      Status:
      {order.statusDone && <ListItemText  sx={{pl: 2}} primary="Completed" />}
      {!order.statusDone && <ListItemText  sx={{pl: 2}} primary="Pendding" />}

        <ListItemButton disabled={order.statusDone} sx={{ pl: 2 }} onClick={()=> deleteOrder(order._id)}>
          <ListItemIcon>
            <DeleteOutlineIcon />
          </ListItemIcon>
        </ListItemButton>

        <ListItemButton disabled={order.statusDone} sx={{ pl: 2 }} onClick={()=> completeOrder(order._id)}>
          <ListItemIcon>
            <CheckCircleOutlineIcon />
          </ListItemIcon>
        </ListItemButton>

      </ListItem>
      ))}
     </List>
    </>
}

export default Orders;