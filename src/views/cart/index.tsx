"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useMenuContext } from "@/context";
import { v4 as uuidv4 } from "uuid";
import Link from "next/link";

export const getImageSrc = (item: string) => {
  const images: { [key: string]: string } = {
    "Chana": "/images/footer/cart1.png",
    "Impli Pyaz Chutney": "/images/footer/cart2.png",
    "Amul Butter": "/images/footer/cart3.png",
    "Normal Butter": "/images/footer/cart3.png",
    "Regular Coca-Cola": "/images/drinks/coke.png",
    "Large Coca-Cola": "/images/drinks/coke.png",
    "Regular Coke Zero Sugar": "/images/drinks/coke-zero.png",
    "Large Coke Zero Sugar": "/images/drinks/coke-zero.png",
    "Regular Diet Coke": "/images/drinks/diet-coke.png",
    "Large Diet Coke": "/images/drinks/diet-coke.png",
    "Salted Lassi": "/images/drinks/salted-lassi.png",
    "Sweet Lassi": "/images/drinks/salted-lassi.png",
  };

  return images[item] || "/images/footer/default.png";
};

export const coffeeOptions = [
  {
    name: "Espresso",
    price: 3.5,
    image: "/images/drinks/espresso.png", // Replace with the actual image path
  },
  {
    name: "Caffe Latte",
    price: 3.5,
    image: "/images/drinks/caffe-latte.png", // Replace with the actual image path
  },
  {
    name: "Cold Coffee",
    price: 3.5,
    image: "/images/drinks/cold-coffee.png", // Replace with the actual image path
  },
];

const teaOptions = [
  {
    name: "Tea",
    price: 3.5,
    image: "/images/drinks/milk-tea.png", // Replace with actual image path
  },
  {
    name: "Masala Tea",
    price: 3.5,
    image: "/images/drinks/masala-tea.png", // Replace with actual image path
  },
];

const lassiOptions = [ { name: "Salted Lassi", price: 5.5, image: "/images/drinks/salted-lassi.png", }, { name: "Sweet Lassi", price: 5.5, image: "/images/drinks/salted-lassi.png" }, ];


export const drinkOptions = [
  { name: "Regular Coca-Cola", price: 3.0, image: "/images/drinks/coke.png" },
  { name: "Large Coca-Cola", price: 3.5, image: "/images/drinks/coke.png" },
  {
    name: "Regular Coke Zero Sugar",
    price: 3.0,
    image: "/images/drinks/coke-zero.png",
  },
  {
    name: "Large Coke Zero Sugar",
    price: 3.5,
    image: "/images/drinks/coke-zero.png",
  },
  {
    name: "Regular Diet Coke",
    price: 3.0,
    image: "/images/drinks/diet-coke.png",
  },
  {
    name: "Large Diet Coke",
    price: 3.5,
    image: "/images/drinks/diet-coke.png",
  },
  {
    name: "Coke",
    price: 3.0,
    image: "/images/drinks/coke.png",
  },
  {
    name: "Diet Coke",
    price: 3.0,
    image: "/images/drinks/diet-coke.png",
  },
  {
    name: "Sprite",
    price: 3.0,
    image: "/images/drinks/sprite.png",
  }
];



const MenuPage = () => {
  const {
    size,
    setSize,
    price,
    setPrice,
    cal,
    setCal,
    includedItems,
    setIncludedItems,
    extraItems,
    setPlasticware,
    quantity,
    setQuantity,
    selectedDrinks,
    setSelectedDrinks,
    selectedLassis,
    setSelectedLassis,
  } = useMenuContext();

  const [isDrinkDialogOpen, setIsDrinkDialogOpen] = useState(false);
  const [isLassiDialogOpen, setIsLassiDialogOpen] = useState(false);

  const handleSize = (event: any, newSize: string | null) => {
    if (newSize !== null) {
      setSize(newSize);
      if (newSize == "regular") {
        setPrice(8);
        setCal(640);
      } else {
        setPrice(6.75);
        setCal(320);
      }
    }
  };

  const handlePlasticwareChange = (
    event: any,
    newPlasticware: string | null
  ) => {
    if (newPlasticware !== null) {
      setPlasticware(newPlasticware);
    }
  };

  const handleAddItem = (itemName: string) => {
    const itemId = uuidv4();

    // Determine the price for the item
    const drink = drinkOptions.find((drink) => drink.name === itemName);
    const lassi = lassiOptions.find((lassi) => lassi.name === itemName);

    const price =
      drink?.price ||
      lassi?.price ||
      (itemName === "Chana"
        ? 3.0
        : itemName === "Impli Pyaz Chutney"
        ? 2.0
        : itemName === "Amul Butter"
        ? 1.1
        : itemName === "Normal Butter"
        ? 0.75
        : 0); // Default price if item is not in the above lists

    const newItem= {
      id: itemId,
      items: [{ name: itemName, price }],
    };

    if (
      !includedItems.some((includedItem) =>
        includedItem.items.some((item) => item.name === itemName)
      )
    ) {
      setIncludedItems([...includedItems, newItem]);
    }
  };

  const handleDrinkSelect = (drink: string) => {
    const drinkItem = drinkOptions.find((d) => d.name === drink);
    handleAddItem(drinkItem!.name);
  };

  const handleLassiSelect = (lassi: string) => {
    const lassiItem = lassiOptions.find((l) => l.name === lassi);
    handleAddItem(lassiItem!.name);
  };

  const handleRemoveItem = (itemId: string) => {
    setIncludedItems(includedItems.filter((item) => item.id !== itemId));
    setSelectedDrinks(selectedDrinks.filter((drink) => drink !== itemId));
    setSelectedLassis(selectedLassis.filter((lassi) => lassi !== itemId));
  };

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleDrinkDialogOpen = () => {
    setIsDrinkDialogOpen(true);
  };

  const handleDrinkDialogClose = () => {
    setIsDrinkDialogOpen(false);
  };

  const handleLassiDialogOpen = () => {
    setIsLassiDialogOpen(true);
  };

  const handleLassiDialogClose = () => {
    setIsLassiDialogOpen(false);
  };

  return (
    <Box sx={{ backgroundColor: "#f8f8f8", padding: "2rem" }}>
      <Grid container spacing={4} sx={{ width: "100%", margin: 0 }}>
        <Grid item xs={12} md={6}>
          <Box>
            <Typography
              variant="body2"
              sx={{ marginBottom: "1rem", color: "#000000" }}
            >
              Menu / Everyday Value / Kulcha
            </Typography>
            <Typography
              variant="h4"
              sx={{
                marginBottom: "1rem",
                fontWeight: "bold",
                fontSize: "2rem",
                color: "#000000",
              }}
            >
              AMRITSARI KULCHA
            </Typography>
            <Typography
              variant="body1"
              sx={{ marginBottom: "1rem", color: "#000000" }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam
            </Typography>
            <Typography>
              {price} {cal} cal
            </Typography>

            <Box sx={{ marginTop: "4rem" }}>
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ color: "#00070e", fontWeight: 500 }}
              >
                Size
              </Typography>
              <ToggleButtonGroup
                value={size}
                exclusive
                onChange={handleSize}
                aria-label="size"
              >
                <ToggleButton
                  value="regular"
                  aria-label="regular"
                  sx={{
                    width: "200px",
                    height: "60px",
                    borderRadius: "8px !important",
                    fontWeight: "bold",
                    textAlign: "center",
                    "&:not(.Mui-selected)": {
                      border: "1px solid #dcdcdc",
                    },
                    "&.Mui-selected": {
                      border: "2px solid #1e90ff",
                      boxShadow: "0 0 10px rgba(30, 144, 255, 0.5)",
                    },
                  }}
                >
                  Regular
                  <br />
                  +$8.00 | 640 cal
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ textAlign: "right" }}>
            <img
              src="/images/footer/main2.png"
              alt="Amritsari Kulcha"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box
            sx={{
              marginTop: "2rem",
              paddingTop: "2rem",
              marginBottom: "4rem",
              borderTop: "1px solid #dcdcdc",
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ color: "#021e3a" }}>
              What's Included
            </Typography>
            <Grid container spacing={2} justifyContent="flex-start">
              {includedItems.length === 0 ? (
                <Grid item>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "1rem",
                      backgroundColor: "white",
                      border: "2px solid #dcdcdc",
                      borderRadius: "8px",
                      textAlign: "center",
                      height: "300px",
                      width: "175px",
                      margin: "1rem",
                    }}
                  >
                    <AddCircleOutlineIcon
                      sx={{ fontSize: "4rem", color: "#1e90ff" }}
                    />
                    <Typography variant="body1" color="textSecondary">
                      Add Items
                    </Typography>
                  </Box>
                </Grid>
              ) : (
                includedItems.map((item) => (
                  <Grid item xs={12} sm={6} md={3} key={item.id}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "1rem",
                        backgroundColor: "white",
                        border: `2px solid ${item ? "#1e90ff" : "#dcdcdc"}`,
                        borderRadius: "8px",
                        textAlign: "center",
                        position: "relative",
                        cursor: "pointer",
                        height: "300px",
                        width: "175px",
                        margin: "1rem",
                        boxShadow: item
                          ? "0 0 10px rgba(30, 144, 255, 0.5)"
                          : "none",
                      }}
                    >
                      <CheckCircleIcon
                        sx={{
                          position: "absolute",
                          top: "10px",
                          right: "10px",
                          color: "#1e90ff",
                          backgroundColor: "white",
                          borderRadius: "50%",
                        }}
                      />
                      <img
                        src={getImageSrc(item.items[0].name)}
                        alt={item.items[0].name}
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                          borderRadius: "50%",
                        }}
                      />
                      <Typography variant="body1" color="textPrimary">
                        {item.items[0].name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        ${item.items[0].price.toFixed(2)}
                      </Typography>
                      <Button
                        variant="outlined"
                        onClick={() => handleRemoveItem(item.id)}
                        sx={{
                          backgroundColor: "transparent",
                          color: "#1e90ff",
                          border: "1px solid #1e90ff",
                          marginTop: "1rem",
                          borderRadius: "20px",
                          textTransform: "none",
                        }}
                      >
                        Remove
                      </Button>
                    </Box>
                  </Grid>
                ))
              )}
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box
            sx={{
              marginTop: "2rem",
              paddingTop: "2rem",
              marginBottom: "4rem",
              borderTop: "1px solid #dcdcdc",
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ color: "#021e3a" }}>
              Would you like to add extra items?
            </Typography>
            <Grid container spacing={2}>
              {extraItems.map((item, index) => (
                <Grid item xs={12} key={index}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "1rem",
                      backgroundColor: "white",
                      border: "2px solid #dcdcdc",
                      borderRadius: "8px",
                      textAlign: "left",
                      position: "relative",
                      cursor: "pointer",
                      margin: "1rem 0",
                      width: "60%",
                    }}
                    onClick={() => handleAddItem(item)}
                  >
                    <Box display="flex" alignItems="center">
                      <img
                        src={`/images/footer/cartt${index + 1}.png`}
                        alt={item}
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                          borderRadius: "50%",
                        }}
                      />
                      <Typography
                        variant="body1"
                        color="textPrimary"
                        sx={{ marginLeft: "1rem" }}
                      >
                        {item}
                      </Typography>
                    </Box>
                    <IconButton sx={{ color: "#1e90ff" }}>
                      <AddCircleOutlineIcon />
                    </IconButton>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box
            sx={{
              marginTop: "2rem",
              paddingTop: "2rem",
              marginBottom: "4rem",
              borderTop: "1px solid #dcdcdc",
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ color: "#021e3a" }}>
              Make it a Meal
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "1rem",
                    backgroundColor: "white",
                    border: "2px solid #dcdcdc",
                    borderRadius: "8px",
                    textAlign: "left",
                    position: "relative",
                    cursor: "pointer",
                    margin: "1rem 0",
                    width: "60%",
                  }}
                  onClick={handleDrinkDialogOpen}
                >
                  <Box display="flex" alignItems="center">
                    <img
                      src="/images/footer/drinks.png"
                      alt="Add a Drink"
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                        borderRadius: "50%",
                      }}
                    />
                    <Typography
                      variant="body1"
                      color="textPrimary"
                      sx={{ marginLeft: "1rem" }}
                    >
                      Add a Drink
                    </Typography>
                  </Box>
                  <ArrowForwardIosIcon />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "1rem",
                    backgroundColor: "white",
                    border: "2px solid #dcdcdc",
                    borderRadius: "8px",
                    textAlign: "left",
                    position: "relative",
                    cursor: "pointer",
                    margin: "1rem 0",
                    width: "60%",
                  }}
                  onClick={handleLassiDialogOpen}
                >
                  <Box display="flex" alignItems="center">
                    <img
                      src="/images/footer/lassi.jpg"
                      alt="Add a Lassi"
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                        borderRadius: "50%",
                      }}
                    />
                    <Typography
                      variant="body1"
                      color="textPrimary"
                      sx={{ marginLeft: "1rem" }}
                    >
                      Add a Lassi
                    </Typography>
                  </Box>
                  <ArrowForwardIosIcon />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "1rem",
                    backgroundColor: "white",
                    border: "2px solid #dcdcdc",
                    borderRadius: "8px",
                    textAlign: "left",
                    position: "relative",
                    cursor: "pointer",
                    margin: "1rem 0",
                    width: "60%",
                  }}
                  onClick={handleLassiDialogOpen}
                >
                  <Box display="flex" alignItems="center">
                    <img
                      src="/images/footer/lassi.jpg"
                      alt="Add a Lassi"
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                        borderRadius: "50%",
                      }}
                    />
                    <Typography
                      variant="body1"
                      color="textPrimary"
                      sx={{ marginLeft: "1rem" }}
                    >
                      Add a Tea
                    </Typography>
                  </Box>
                  <ArrowForwardIosIcon />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "1rem",
                    backgroundColor: "white",
                    border: "2px solid #dcdcdc",
                    borderRadius: "8px",
                    textAlign: "left",
                    position: "relative",
                    cursor: "pointer",
                    margin: "1rem 0",
                    width: "60%",
                  }}
                  onClick={handleLassiDialogOpen}
                >
                  <Box display="flex" alignItems="center">
                    <img
                      src="/images/footer/lassi.jpg"
                      alt="Add a Lassi"
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                        borderRadius: "50%",
                      }}
                    />
                    <Typography
                      variant="body1"
                      color="textPrimary"
                      sx={{ marginLeft: "1rem" }}
                    >
                      Add a Coffee
                    </Typography>
                  </Box>
                  <ArrowForwardIosIcon />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        {/* New Section for Plasticware */}
        <Box
          sx={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            backgroundColor: "#ebebe1",
            border: "2px solid #dcdcdc",
            borderRadius: "8px",
            padding: "1rem",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Box display="flex" justifyContent="flex-end" alignItems="center">
            <Link href={"/checkout"}>
              <Button variant="contained" color="warning" disabled={includedItems.length==0}>
                Checkout
              </Button>
            </Link>
          </Box>
        </Box>
      </Grid>
      <Dialog
        open={isDrinkDialogOpen}
        onClose={handleDrinkDialogClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add a Drink</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {drinkOptions.map((drink) => (
              <Grid item xs={12} sm={6} md={4} key={drink.name}>
                <Card
                  onClick={() => handleDrinkSelect(drink.name)}
                  sx={{
                    border: selectedDrinks.includes(drink.name)
                      ? "2px solid green"
                      : "1px solid #ddd",
                    position: "relative",
                    cursor: "pointer",
                  }}
                >
                  <CardMedia
                    component="img"
                    alt={drink.name}
                    height="140"
                    image={drink.image}
                    sx={{ objectFit: "contain", padding: "1rem" }}
                  />
                  <CardContent>
                    <Typography
                      variant="body1"
                      color="textPrimary"
                      align="center"
                    >
                      {drink.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      align="center"
                    >
                      ${drink.price.toFixed(2)}
                    </Typography>
                    {selectedDrinks.includes(drink.name) && (
                      <CheckCircleIcon
                        sx={{
                          position: "absolute",
                          top: "10px",
                          right: "10px",
                          color: "green",
                          backgroundColor: "white",
                          borderRadius: "50%",
                        }}
                      />
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDrinkDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDrinkDialogClose} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={isLassiDialogOpen}
        onClose={handleLassiDialogClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add a Lassi</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {lassiOptions.map((lassi) => (
              <Grid item xs={12} sm={6} md={4} key={lassi.name}>
                <Card
                  onClick={() => handleLassiSelect(lassi.name)}
                  sx={{
                    border: selectedLassis.includes(lassi.name)
                      ? "2px solid green"
                      : "1px solid #ddd",
                    position: "relative",
                    cursor: "pointer",
                  }}
                >
                  <CardMedia
                    component="img"
                    alt={lassi.name}
                    height="140"
                    image={lassi.image}
                    sx={{ objectFit: "contain", padding: "1rem" }}
                  />
                  <CardContent>
                    <Typography
                      variant="body1"
                      color="textPrimary"
                      align="center"
                    >
                      {lassi.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      align="center"
                    >
                      ${lassi.price.toFixed(2)}
                    </Typography>
                    {selectedLassis.includes(lassi.name) && (
                      <CheckCircleIcon
                        sx={{
                          position: "absolute",
                          top: "10px",
                          right: "10px",
                          color: "green",
                          backgroundColor: "white",
                          borderRadius: "50%",
                        }}
                      />
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLassiDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleLassiDialogClose} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </Box>
  );
};

export default MenuPage;
