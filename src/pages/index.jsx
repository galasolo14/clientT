import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import {useState} from 'react';
import Units from './units';
import Orders from './orders'
import Inventory from './inventory'
import InventoryIcon from '@mui/icons-material/Inventory';

const Header = () => {
  const [selected, setSelected] = useState('orders')

  const pages = ['orders', 'budgets', 'inventory'];

  const clickHandle = (page) => {    
    setSelected(page)
  }


    return <>
    <AppBar position="static">
    <Container maxWidth="xl">
      <Toolbar disableGutters>
      <InventoryIcon sx={{pr: 1}}/>
        <Typography
          variant="h6"
          noWrap
          component="a"
          href="#app-bar-with-responsive-menu"
          sx={{
            mr: 2,
            display: { xs: 'none', md: 'flex' },
            fontFamily: 'monospace',
            fontWeight: 700,
            letterSpacing: '.3rem',
            color: 'inherit',
            textDecoration: 'none',
          }}
        >
          Inventory
        </Typography>

        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'end' }}>
          {pages.map((page) => (
            <Button
              key={page}
              onClick={() => clickHandle(page)}
              sx={{ my: 2, color: page === selected ? 'yellow' :  'white', display: 'block' }}
            >
              {page}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </Container>
  </AppBar>
  {selected === 'orders' && <Orders />}
  {selected === 'budgets' && <Units />}
  {selected === 'inventory' && <Inventory />}
  </>
}

export default Header;