"use client";

import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Button, 
  Select, 
  MenuItem, 
  Checkbox, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions ,
  SelectChangeEvent
} from '@mui/material';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';



interface DrinkOption {
  name: string;
  logo: string;
  sizes: { size: string, price: number }[];
}

const drinkOptions: DrinkOption[] = [
  { 
    name: 'Coca-Cola', 
    logo: '/images/drinkssection/cocaCola.png', 
    sizes: [
      { size: 'Regular', price: 3.00 }, 
      { size: 'Large', price: 3.50 }
    ] 
  },
  { 
    name: 'Coca-Cola Zero', 
    logo: '/images/drinkssection/cocaColaZero.png', 
    sizes: [
      { size: 'Regular', price: 3.00 }
    ] 
  },
  { 
    name: 'Diet Coke', 
    logo: '/images/drinkssection/coke.png', 
    sizes: [
      { size: 'Regular', price: 3.00 }
    ] 
  },
  { 
    name: 'Sprite', 
    logo: '/images/drinkssection/sprite.png', 
    sizes: [
      { size: 'Large', price: 3.50 }
    ] 
  },
  { 
    name: 'Minute-Maid Lemonade', 
    logo: '/images/drinkssection/minuteMaid.png', 
    sizes: [
      { size: 'Regular', price: 3.00 }
    ] 
  },
];

const DrinkSelector: React.FC = () => {
  const [selectedDrinks, setSelectedDrinks] = React.useState<{ [key: string]: string }>({});
  const [open, setOpen] = React.useState(false);

  const handleSizeChange = (event: SelectChangeEvent, drinkName: string) => {
    setSelectedDrinks(prev => ({
      ...prev,
      [drinkName]: event.target.value,
    }));
  };

  const toggleDrinkSelection = (drinkName: string) => {
    setSelectedDrinks(prev => {
      if (prev[drinkName]) {
        const updated = { ...prev };
        delete updated[drinkName];
        return updated;
      } else {
        return { ...prev, [drinkName]: drinkOptions.find(option => option.name === drinkName)?.sizes[0].size || 'Regular' };
      }
    });
  };

  const getPrice = (drinkName: string) => {
    const drink = drinkOptions.find(option => option.name === drinkName);
    const selectedSize = selectedDrinks[drinkName];
    const price = drink?.sizes.find(size => size.size === selectedSize)?.price || 0;
    return price.toFixed(2);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button variant="outlined" onClick={handleClickOpen}>
        Add A Drink Only
      </Button>
      <Dialog 
        open={open} 
        onClose={handleClose} 
        sx={{ 
          '.MuiDialog-paper': { 
            width: '600px', 
            maxHeight: '80vh',
            height: '600px' 
          } 
        }}
      >
        <DialogTitle align="center">Add A Drink Only</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Choose Your Drink</Typography>
          </Box>
          <Grid container spacing={2}>
            {drinkOptions.map((drink, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper 
                  sx={{ 
                    p: 2, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    position: 'relative',
                    border: '1px solid #ddd',
                    borderRadius: 1,
                    boxShadow: selectedDrinks[drink.name] ? '0 0 8px rgba(0, 0, 0, 0.2)' : 'none',
                    transition: 'box-shadow 0.3s ease',
                    height: '100%',  // Ensure each card is the same height
                  }}
                >
                  <Checkbox 
                    icon={<CheckBoxOutlineBlankIcon />} 
                    checkedIcon={<CheckBoxIcon sx={{ color: 'green' }} />} 
                    checked={!!selectedDrinks[drink.name]}
                    onChange={() => toggleDrinkSelection(drink.name)}
                    sx={{ 
                      position: 'absolute', 
                      top: 8, 
                      right: 8,
                      color: selectedDrinks[drink.name] ? 'green' : 'default'
                    }}
                  />
                  <img src={drink.logo} alt={drink.name} style={{ width: 80, height: 80 }} />
                  <Select
                    value={selectedDrinks[drink.name] || drink.sizes[0].size}
                    onChange={(event) => handleSizeChange(event, drink.name)}
                    sx={{ mt: 1, minWidth: 120, height: 26 }}
                    disabled={!selectedDrinks[drink.name]}
                  >
                    {drink.sizes.map((size) => (
                      <MenuItem key={size.size} value={size.size}>{size.size}</MenuItem>
                    ))}
                  </Select>
                  <Box sx={{ mt: 1, textAlign: 'center' }}>
                    <Typography variant="subtitle1">{drink.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      +${getPrice(drink.name)}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined">Done</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DrinkSelector;
