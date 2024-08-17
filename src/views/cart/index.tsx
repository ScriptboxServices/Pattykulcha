"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
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
  CardContent,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuthContext, useMenuContext } from "@/context";
import { v4 as uuidv4 } from "uuid";
import Link from "next/link";
import { addDoc, collection, doc, Timestamp } from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "next/navigation";
import CircularLodar from "@/components/CircularLodar";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";


import {
  drinkOptions,
  lassiOptions,
  coffeeOptions,
  teaOptions,
} from "@/constants/MenuOptions";

export const getImageSrc = (item: string) => {
  const images: { [key: string]: string } = {
    Chana: "/images/landingpage/Chana.svg",
    "Imli Pyaz Chutney": "/images/landingpage/Chutney.svg",
    "Amul Butter": "/images/landingpage/butter_6587237.svg",
    "Normal Butter": "/images/landingpage/butter_6587237.svg",
    Pickle: "/images/landingpage/pickle.svg",
    "Regular Coca-Cola": "/images/drinks/coke.png",
    "Large Coca-Cola": "/images/drinks/coke.png",
    "Regular Coke Zero Sugar": "/images/drinks/coke-zero.png",
    "Large Coke Zero Sugar": "/images/drinks/coke-zero.png",
    "Regular Diet Coke": "/images/drinks/diet-coke.png",
    "Large Diet Coke": "/images/drinks/diet-coke.png",
    "Salted Lassi": "/images/drinks/salted-lassi.png",
    "Sweet Lassi": "/images/drinks/salted-lassi.png",
    "Mix Kulcha": "/images/landingpage/menu1.png",
    "Aloo Kulcha": "/images/landingpage/menu2.png",
    "Onion Kulcha": "/images/landingpage/menu3.png",
    "Gobi Kulcha": "/images/landingpage/image5.jpg",
    "Paneer Kulcha": "/images/landingpage/menu5.png",
    "Hot & Spicy Mix Kulcha": "/images/landingpage/menu6.png",
    Tea: "/images/landingpage/milktea.png",
    "Masala Tea": "/images/landingpage/tea.png",
    Espresso: "/images/landingpage/Espresso.png",
    "Caffe Latte": "/images/landingpage/caffe-latte.png",
    "Cold Coffee": "/images/landingpage/caffe-latte.png",
  };
  return images[item] || "/images/footer/default.png";
};

export interface IncludedItem {
  id: string;
  items: Array<{
    name: string;
    price: number;
  }>;
}

const MenuPage = () => {
  const {
    size,
    setSize,
    price,
    setPrice,
    cal,
    kulcha,
    setCal,
    includedItems2,
    setIncludedItems2,
    includedItems1,
    extraItems,
    setPlasticware,
    selectedkulchas,
    count,
    setCount,
    selectedDrinks,
    setSelectedDrinks,
    selectedLassis,
    setSelectedLassis,
  } = useMenuContext();

  const { user } = useAuthContext();

  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);

  const [isDrinkDialogOpen, setIsDrinkDialogOpen] = useState(false);
  const [isLassiDialogOpen, setIsLassiDialogOpen] = useState(false);
  const [isTeaDialogOpen, setIsTeaDialogOpen] = useState(false);
  const [isCoffeeDialogOpen, setIsCoffeeDialogOpen] = useState(false);
  const [itemCounts, setItemCounts] = useState<{ [key: string]: number }>({});

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

  const handleAddItem = (itemName: string) => {
    const itemId = uuidv4();
    // Determine the price for the item
    const drink = drinkOptions.find((drink) => drink.name == itemName);
    const lassi = lassiOptions.find((lassi) => lassi.name == itemName);
    const tea = teaOptions.find((tea) => tea.name == itemName);
    const coffee = coffeeOptions.find((coffee) => coffee.name == itemName);

    const price =
      drink?.price ||
      lassi?.price ||
      tea?.price ||
      coffee?.price ||
      (itemName == "Chana"
        ? 1.5
        : itemName == "Imli Pyaz Chutney"
        ? 1.5
        : itemName == "Amul Butter"
        ? 2.5
        : itemName == "Normal Butter"
        ? 1.5
        : itemName == "Pickle"
        ? 1 // Assuming the price for Pickle is 1.5
        : 0); // Default price if item is not in the above lists

    const newItem = {
      id: itemId,
      items: [{ name: itemName, price }],
    };

    if (
      !includedItems2.some((includedItem) =>
        includedItem.items.some((item) => item.name == itemName)
      )
    ) {
      setIncludedItems2([...includedItems2, newItem]);
      localStorage.setItem(
        "includedItems2",
        JSON.stringify([...includedItems2, newItem])
      );
    }
  };

  const handleDrinkSelect = (drink: string) => {
    const drinkItem = drinkOptions.find((d) => d.name == drink);
    handleAddItem(drinkItem!.name);
  };

  const handleLassiSelect = (lassi: string) => {
    const lassiItem = lassiOptions.find((l) => l.name == lassi);
    handleAddItem(lassiItem!.name);
  };

  const handleTeaSelect = (tea: string) => {
    const teaItem = teaOptions.find((t) => t.name == tea);
    handleAddItem(teaItem!.name);
  };

  const handleCoffeeSelect = (coffee: string) => {
    const coffeeItem = coffeeOptions.find((c) => c.name == coffee);
    handleAddItem(coffeeItem!.name);
  };

  const handleRemoveItem = (itemId: string) => {
    setIncludedItems2(includedItems2.filter((item) => item.id !== itemId));
    setSelectedDrinks(selectedDrinks.filter((drink) => drink !== itemId));
    setSelectedLassis(selectedLassis.filter((lassi) => lassi !== itemId));
    localStorage.setItem(
      "includedItems2",
      JSON.stringify([...includedItems2.filter((item) => item.id !== itemId)])
    );
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

  const handleTeaDialogOpen = () => {
    setIsTeaDialogOpen(true);
  };

  const handleTeaDialogClose = () => {
    setIsTeaDialogOpen(false);
  };

  const handleCoffeeDialogOpen = () => {
    setIsCoffeeDialogOpen(true);
  };

  const handleCoffeeDialogClose = () => {
    setIsCoffeeDialogOpen(false);
  };

  const handleAddToCart = async () => {
    try {
      setLoading(true);
      const colRef = collection(db, "carts");
      const data = {
        userId: user?.uid,
        order: {
          kulcha: kulcha,
          withKulcha: [...includedItems1],
          additional: [...includedItems2],
        },
        createdAt: Timestamp.now(),
      };
      await addDoc(colRef, {
        ...data,
      });
      setLoading(false);
      setCount(count + 1);
      localStorage.removeItem("includedItems2");
      localStorage.removeItem("kulcha");
      router.push("/checkout");
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#fffaeb",
        padding: { xs: "1rem", sm: "2rem" },
        backgroundImage: `
        url('/images/small/chana.png'), 
        url('/images/small/chilli.png'), 
        url('/images/small/bowl.png'), 
        url('/images/small/bowl2.png'), 
        url('/images/small/bucket.png'), 
        url('/images/small/butter.png'),
        url('/images/small/drink.png'),
        url('/images/small/plate.png')
      `,
        backgroundPosition: `
      left bottom 20%,   
      right bottom 20%,  
      left bottom 40%,  
      right bottom 40%,  
      left bottom 60%,   
      right bottom 60%, 
      center bottom 30%, 
      center bottom 50%  
    `,
        backgroundSize: `
        150px 150px, 
        150px 150px, 
        150px 150px, 
        150px 150px, 
        150px 150px, 
        150px 150px, 
        150px 150px, 
        150px 150px
      `,
        backgroundRepeat:
          "no-repeat, no-repeat, no-repeat, no-repeat, no-repeat, no-repeat, no-repeat, no-repeat",
      }}
    >
      <CircularLodar isLoading={loading} />

      <Grid
        container
        spacing={4}
        sx={{
          width: "100%",
          paddingLeft: "15px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Grid item xs={12} md={6}>
          <Box sx={{ paddingLeft: "7%" }}>
            <Typography
              variant="h4"
              sx={{
                marginBottom: "1rem",
                marginTop: "2rem",
                fontWeight: "bold",
                fontSize: { xs: "1.5rem", sm: "3.2rem" },
                color: "#000000",
              }}
            >
              {kulcha?.name}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                marginBottom: "1rem",
                color: "#000000",
                fontSize: { xs: "1rem", sm: "1.2rem" },
              }}
            >
              {kulcha?.desc}
            </Typography>
            <Box sx={{ marginTop: "3.2rem" }}>
              <ToggleButtonGroup
                value={size}
                exclusive
                onChange={handleSize}
                aria-label="size"
              >
                <Button
                  value="regular"
                  aria-label="regular"
                  sx={{
                    color: "black",
                    // backgroundColor: "black",
                    border: "2px solid black",
                    borderRadius: "12px",
                    padding: { xs: "6px 12px", sm: "8px 20px" }, // Adjust padding as needed
                    "&:hover": {
                      color: "black",

                      // backgroundColor: "black",
                    },
                  }}
                >
                  Regular Size
                </Button>
              </ToggleButtonGroup>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              textAlign: { xs: "center", md: "right" },
              marginLeft: { md: 13 },
              paddingRight: "10%",
            }}
          >
            <Image
              src={kulcha?.image}
              alt="Amritsari Kulcha"
              layout="responsive"
              width={500}
              height={500}
              style={{
                maxWidth: "100%",
                height: "auto",
                borderRadius: "5%", // This makes the image round
                objectFit: "cover",
              }}
            />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box
            sx={{
              marginTop: "2rem",
              paddingTop: "2rem",
              textAlign: "center",
            }}
          >
            <Box
              sx={{
                width: "60%",
                height: "1px",
                backgroundColor: "#dcdcdc",
                margin: "0 auto", // Center the line horizontally
                marginBottom: "23px", // Add space between the line and the text
              }}
            />
            <Typography variant="h4" gutterBottom sx={{ color: "#021e3a" }}>
              What&apos;s Included
            </Typography>
            <Grid container spacing={2} justifyContent="center">
              {includedItems1.length == 0 ? (
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
                      height: {
                        xs: "200px",
                        sm: "220px",
                        md: "250px",
                        lg: "250px",
                      },
                      width: { xs: "150px", sm: "175px" },
                      margin: "1rem",
                    }}
                  >
                    <AddCircleOutlineIcon
                      sx={{ fontSize: "4rem", color: "#336195" }}
                    />
                    <Typography variant="body1" color="textSecondary">
                      Add Items
                    </Typography>
                  </Box>
                </Grid>
              ) : (
                includedItems1.map((item) => (
                  <Grid item xs={6} sm={4} md={1.6} key={item.id}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        padding: "1rem",
                        backgroundColor: "white",
                        border: "2px solid #87939f", // Updated border color
                        borderRadius: "8px", // Updated border-radius
                        textAlign: "center", // Center text alignment
                        position: "relative", // Maintain position relative
                        cursor: "pointer", // Pointer cursor
                        height: {
                          xs: "200px",
                          sm: "220px",
                          md: "250px",
                          lg: "250px",
                        },
                        width: { xs: "150px", sm: "175px" },
                        margin: "0.5rem", // Updated margin
                        boxShadow: "2px 2px 3px #4e5664", // Updated box-shadow
                      }}
                    >
                      <CheckCircleIcon
                        sx={{
                          position: "absolute",
                          top: "10px",
                          right: "10px",
                          color: "#336195",
                          backgroundColor: "white",
                          borderRadius: "50%",
                        }}
                      />
                      <Image
                        src={getImageSrc(item.items[0].name)}
                        alt={item.items[0].name}
                        width={150}
                        height={150}
                        style={{
                          width: "65%", // Set the width to 65% of the container
                          height: "65%", // Set the height to 55% of the container
                          objectFit: "contain",
                        }}
                      />
                      <Typography variant="body1" color="textPrimary">
                        {item.items[0].name}
                      </Typography>
                    </Box>
                  </Grid>
                ))
              )}
            </Grid>
            <Typography
              variant="h4"
              gutterBottom
              sx={{ color: "#021e3a", marginTop: 4 }}
            >
              Additional items
            </Typography>
            <Grid container spacing={2} justifyContent="center">
              {includedItems2.length == 0 ? (
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
                      height: { xs: "200px", sm: "270px" },
                      width: { xs: "150px", sm: "175px" },
                      margin: "1rem",
                    }}
                  >
                    <Typography variant="body1" color="textSecondary">
                      Add items will be shown here
                    </Typography>
                  </Box>
                </Grid>
              ) : (
                includedItems2.map((item) => (
                  <Grid item xs={6} sm={4} md={1.6} key={item.id}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "1rem",
                        backgroundColor: "white",
                        border: "2px solid #87939f",
                        borderRadius: "8px",
                        textAlign: "center",
                        position: "relative",
                        cursor: "pointer",
                        height: { xs: "220px", sm: "270px" },
                        width: { xs: "150px", sm: "175px" },
                        margin: "0.5rem",
                        boxShadow: "2px 2px 3px #4e5664",
                      }}
                    >
                      <CheckCircleIcon
                        sx={{
                          position: "absolute",
                          top: "10px",
                          right: "10px",
                          color: "#336195",
                          backgroundColor: "white",
                          borderRadius: "50%",
                        }}
                      />
                      <Image
                        src={getImageSrc(item.items[0].name)}
                        alt={item.items[0].name}
                        width={150}
                        height={150}
                        style={{
                          width: "65%",
                          height: "55%",
                          objectFit: "contain",
                        }}
                      />
                      <Typography variant="body1" color="textPrimary">
                        {item.items[0].name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        ${item.items[0].price.toFixed(2)}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginTop: "0.5rem",
                        }}
                      >
                        <IconButton
                          onClick={() => handleRemoveItem(item.items[0].name)}
                          sx={{
                            color: "#336195",
                          }}
                        >
                          <RemoveCircleOutlineIcon />
                        </IconButton>
                        <Typography variant="body1" color="textPrimary">
                          {itemCounts[item.items[0].name] || 1}
                        </Typography>
                        <IconButton
                          onClick={() => handleAddItem(item.items[0].name)}
                          sx={{
                            color: "#336195",
                          }}
                        >
                          <AddCircleOutlineIcon />
                        </IconButton>
                      </Box>
                      <Button
                        variant="outlined"
                        onClick={() => handleRemoveItem(item.items[0].name)}
                        sx={{
                          backgroundColor: "transparent",
                          color: "#336195",
                          border: "1px solid #336195",
                          marginTop: "auto",
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
              marginTop: "2.7rem",
              paddingTop: "0rem",
              marginBottom: "0rem",
              textAlign: "center",
            }}
          >
            <Box
              sx={{
                width: "65%",
                height: "1px",
                backgroundColor: "#dcdcdc",
                margin: "0 auto", // Center the line horizontally
                marginBottom: "23px", // Add space between the line and the text
              }}
            />
            <Typography variant="h4" gutterBottom sx={{ color: "#021e3a" }}>
              Would you like to add extra items?
            </Typography>
            <Grid container spacing={1} justifyContent="center">
              {extraItems.map((item, index) => (
                <Grid
                  item
                  xs={12}
                  key={index}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
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
                      margin: "0.5rem 0",
                      width: { xs: "100%", md: "60%" },
                    }}
                    onClick={() => handleAddItem(item)}
                  >
                    <Box display="flex" alignItems="center">
                      <Image
                        src={getImageSrc(item)}
                        alt={item}
                        layout="fixed"
                        width={50}
                        height={50}
                        style={{
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
                    <IconButton sx={{ color: "#336195" }}>
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
              marginTop: "2.7rem",
              paddingTop: "0rem",
              marginBottom: "0.5rem",
              textAlign: "center",
            }}
          >
            <Box
              sx={{
                width: "65%",
                height: "1px",
                backgroundColor: "#dcdcdc",
                margin: "0 auto", // Center the line horizontally
                marginBottom: "23px", // Add space between the line and the text
              }}
            />
            <Typography variant="h4" gutterBottom sx={{ color: "#021e3a" }}>
              Make it a Meal
            </Typography>
            <Grid container spacing={1} justifyContent="center">
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
                    margin: "0.2rem 0",
                    width: { xs: "100%", md: "60%" },
                    marginInline: "auto",
                  }}
                  onClick={handleDrinkDialogOpen}
                >
                  <Box display="flex" alignItems="center">
                    <Image
                      src="/images/landingpage/Drinks.svg"
                      alt="Add a Drink"
                      layout="fixed"
                      width={50}
                      height={50}
                      style={{
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
                    width: { xs: "100%", md: "60%" },
                    marginInline: "auto",
                  }}
                  onClick={handleLassiDialogOpen}
                >
                  <Box display="flex" alignItems="center">
                    <Image
                      src="/images/landingpage/Lassi.svg"
                      alt="Add a Lassi"
                      layout="fixed"
                      width={50}
                      height={50}
                      style={{
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
                    margin: "0.5rem 0",
                    width: { xs: "100%", md: "60%" },
                    marginInline: "auto",
                  }}
                  onClick={handleTeaDialogOpen}
                >
                  <Box display="flex" alignItems="center">
                    <Image
                      src="/images/landingpage/tea.svg"
                      alt="Add a Tea"
                      layout="fixed"
                      width={50}
                      height={50}
                      style={{
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
                    margin: "0.5rem 0",
                    width: { xs: "100%", md: "60%" },
                    marginInline: "auto",
                  }}
                  onClick={handleCoffeeDialogOpen}
                >
                  <Box display="flex" alignItems="center">
                    <Image
                      src="/images/landingpage/coffee.svg"
                      alt="Add a Coffee"
                      layout="fixed"
                      width={50}
                      height={50}
                      style={{
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
        <Box
          sx={{
            position: "fixed",
            bottom: { xs: "10px", md: "20px" },
            right: { xs: "10px", md: "20px" },
            backgroundColor: "#ebebe1",
            border: "2px solid #dcdcdc",
            borderRadius: "8px",
            padding: "1rem",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Box display="flex" justifyContent="flex-end" alignItems="center">
            <Button
              variant="contained"
              color="warning"
              onClick={handleAddToCart}
              disabled={
                includedItems1.length == 0 && includedItems2.length == 0
              }
            >
              Add to cart
            </Button>
          </Box>
        </Box>
      </Grid>
      <Dialog
        open={isDrinkDialogOpen}
        onClose={handleDrinkDialogClose}
        maxWidth="sm"
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
                    border: includedItems2.some((item) =>
                      item.items.some((i) => i.name === drink.name)
                    )
                      ? "2px solid green"
                      : "1px solid #ddd",
                    position: "relative",
                    cursor: "pointer",
                    height: "270px", // Ensure all cards have the same height
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center", // Align items center horizontally
                  }}
                >
                  <Image
                    alt={drink.name}
                    src={drink.image}
                    width={150}
                    height={150}
                    style={{
                      width: "65%", // Set the width to 65% of the container
                      height: "55%", // Set the height to 55% of the container
                      objectFit: "contain",
                      display: "block", // Ensures the image is treated as a block-level element
                      margin: "0 auto", // Center horizontally within the container
                    }}
                  />
                  <CardContent sx={{ textAlign: "center" }}>
                    <Typography variant="body1" color="textPrimary">
                      {drink.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      ${drink.price.toFixed(2)}
                    </Typography>
                    {includedItems2.some((item) =>
                      item.items.some((i) => i.name === drink.name)
                    ) && (
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
        {/* <DialogActions>
          <Button onClick={handleDrinkDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDrinkDialogClose} color="primary">
            Save
          </Button>
        </DialogActions> */}
      </Dialog>
      <Dialog
        open={isLassiDialogOpen}
        onClose={handleLassiDialogClose}
        maxWidth="sm"
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
                    border: includedItems2.some((item) =>
                      item.items.some((i) => i.name === lassi.name)
                    )
                      ? "2px solid green"
                      : "1px solid #ddd",
                    position: "relative",
                    cursor: "pointer",
                    height: "270px", // Ensure all cards have the same height
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    alt={lassi.name}
                    src={lassi.image}
                    width={150}
                    height={150}
                    style={{
                      width: "65%", // Set the width to 65% of the container
                      height: "55%", // Set the height to 55% of the container
                      objectFit: "contain",
                      display: "block", // Ensures the image is treated as a block-level element
                      margin: "0 auto", // Center horizontally within the container
                    }}
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
                    {includedItems2.some((item) =>
                      item.items.some((i) => i.name === lassi.name)
                    ) && (
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
        {/* <DialogActions>
          <Button onClick={handleLassiDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleLassiDialogClose} color="primary">
            Save
          </Button>
        </DialogActions> */}
      </Dialog>
      <Dialog
        open={isTeaDialogOpen}
        onClose={handleTeaDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add a Tea</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {teaOptions.map((tea) => (
              <Grid item xs={12} sm={6} md={4} key={tea.name}>
                <Card
                  onClick={() => handleTeaSelect(tea.name)}
                  sx={{
                    border: includedItems2.some((item) =>
                      item.items.some((i) => i.name === tea.name)
                    )
                      ? "2px solid green"
                      : "1px solid #ddd",
                    position: "relative",
                    cursor: "pointer",
                    height: "270px", // Ensure all cards have the same height
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    alt={tea.name}
                    src={tea.image}
                    width={150}
                    height={150}
                    style={{
                      width: "65%", // Set the width to 65% of the container
                      height: "55%", // Set the height to 55% of the container
                      objectFit: "contain",
                      display: "block", // Ensures the image is treated as a block-level element
                      margin: "0 auto",
                    }}
                  />
                  <CardContent>
                    <Typography
                      variant="body1"
                      color="textPrimary"
                      align="center"
                    >
                      {tea.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      align="center"
                    >
                      ${tea.price.toFixed(2)}
                    </Typography>
                    {includedItems2.some((item) =>
                      item.items.some((i) => i.name === tea.name)
                    ) && (
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
        {/* <DialogActions>
          <Button onClick={handleTeaDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleTeaDialogClose} color="primary">
            Save
          </Button>
        </DialogActions> */}
      </Dialog>
      <Dialog
        open={isCoffeeDialogOpen}
        onClose={handleCoffeeDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add a Coffee</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {coffeeOptions.map((coffee) => (
              <Grid item xs={12} sm={6} md={4} key={coffee.name}>
                <Card
                  onClick={() => handleCoffeeSelect(coffee.name)}
                  sx={{
                    border: includedItems2.some((item) =>
                      item.items.some((i) => i.name === coffee.name)
                    )
                      ? "2px solid green"
                      : "1px solid #ddd",
                    position: "relative",
                    cursor: "pointer",
                    height: "270px", // Ensure all cards have the same height
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    alt={coffee.name}
                    src={coffee.image}
                    width={150}
                    height={150}
                    style={{
                      width: "65%", // Set the width to 65% of the container
                      height: "55%", // Set the height to 55% of the container
                      objectFit: "contain",
                      display: "block", // Ensures the image is treated as a block-level element
                      margin: "0 auto",
                    }}
                  />
                  <CardContent>
                    <Typography
                      variant="body1"
                      color="textPrimary"
                      align="center"
                    >
                      {coffee.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      align="center"
                    >
                      ${coffee.price.toFixed(2)}
                    </Typography>
                    {includedItems2.some((item) =>
                      item.items.some((i) => i.name === coffee.name)
                    ) && (
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
        {/* <DialogActions>
          <Button onClick={handleCoffeeDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCoffeeDialogClose} color="primary">
            Save
          </Button>
        </DialogActions> */}
      </Dialog>
      <ToastContainer />
    </Box>
  );
};

export default MenuPage;
