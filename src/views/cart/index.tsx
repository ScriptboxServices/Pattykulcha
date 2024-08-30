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
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuthContext, useMenuContext, FIXED_INCLUDE_ITEMS } from "@/context";
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
    Butter: "/images/landingpage/butter_6587237.svg",
    "Normal Butter": "/images/landingpage/butter_6587237.svg",
    Coke: "https://firebasestorage.googleapis.com/v0/b/pattykulcha.appspot.com/o/images%2FPK%2Fsoftdrinks%2FCoke.png?alt=media&token=6fe53f5d-d772-41c7-8a54-ac40a6d80cbb",
    "Diet Coke":
      "https://firebasestorage.googleapis.com/v0/b/pattykulcha.appspot.com/o/images%2FPK%2Fsoftdrinks%2FDiet_coke.png?alt=media&token=ba40e428-2511-43ce-a012-cfe941f9f38c",
    Sprite:
      "https://firebasestorage.googleapis.com/v0/b/pattykulcha.appspot.com/o/images%2FPK%2Fsoftdrinks%2FSprite.png?alt=media&token=4dda8bdb-80cf-4ddf-b26e-1138d054e96d",
    "Mountain Dew":
      "https://firebasestorage.googleapis.com/v0/b/pattykulcha.appspot.com/o/images%2FPK%2Fsoftdrinks%2FMountain_Dew.png?alt=media&token=179fef8f-ee19-4488-a99b-aa90d8719adb",
    "Minute Maid Lemonade":
      "https://firebasestorage.googleapis.com/v0/b/pattykulcha.appspot.com/o/images%2FPK%2Fsoftdrinks%2FMinute-maid.png?alt=media&token=e7eb2ea0-d692-457f-b97a-faa73971c0db",
    "Salted Lassi":
      "https://firebasestorage.googleapis.com/v0/b/pattykulcha.appspot.com/o/images%2FPK%2Flassi%2FSalted-lassi.png?alt=media&token=fe924640-1c8c-4f43-97b3-fb27ec6cdb7a",
    "Sweet Lassi":
      "https://firebasestorage.googleapis.com/v0/b/pattykulcha.appspot.com/o/images%2FPK%2Flassi%2FSweet-lassi.png?alt=media&token=5a7debc1-8ba2-49f4-bbda-6ef3b1b057cb",
    "Mix Kulcha": "/images/landingpage/menu1.png",
    "Aloo Kulcha": "/images/landingpage/menu2.png",
    "Onion Kulcha": "/images/landingpage/menu3.png",
    "Gobi Kulcha": "/images/landingpage/image5.jpg",
    "Paneer Kulcha": "/images/landingpage/menu5.png",
    Tea: "https://firebasestorage.googleapis.com/v0/b/pattykulcha.appspot.com/o/images%2FPK%2Ftea%2Fmilktea.png?alt=media&token=862f39fc-3140-48ab-8beb-384e49071b66",
    "Masala Tea":
      "https://firebasestorage.googleapis.com/v0/b/pattykulcha.appspot.com/o/images%2FPK%2Ftea%2Ftea.png?alt=media&token=c0b48dcd-14a2-452a-80ec-d94138c3b258",
    "Hot Coffee":
      "https://firebasestorage.googleapis.com/v0/b/pattykulcha.appspot.com/o/images%2FPK%2Fcoffee%2Fcaffe-latte.png?alt=media&token=1cbc3419-4fd0-415c-8b2a-5b12d5d8246c",
    "Cold Coffee":
      "https://firebasestorage.googleapis.com/v0/b/pattykulcha.appspot.com/o/images%2FPK%2Fcoffee%2FCoffee.png?alt=media&token=14944dbb-c17a-45ec-bf9a-3360caeebd42",
  };
  return images[item] || "/images/footer/default.png";
};

export interface IncludedItem {
  id: string;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
}

const MenuPage = ({kulcha} : {kulcha : any}) => {
  const {
    setKulcha,
    includedItems2,
    setIncludedItems2,
    extraItems,
    count,
    setCount,
    selectedDrinks,
    setSelectedDrinks,
    selectedLassis,
    setSelectedLassis,
  } = useMenuContext();

  const { user, metaData } = useAuthContext();

  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);

  const [isDrinkDialogOpen, setIsDrinkDialogOpen] = useState(false);
  const [isLassiDialogOpen, setIsLassiDialogOpen] = useState(false);
  const [isTeaDialogOpen, setIsTeaDialogOpen] = useState(false);
  const [isCoffeeDialogOpen, setIsCoffeeDialogOpen] = useState(false);

  const handleAddItem = (itemName: string) => {
    const existingItem = includedItems2.find((includedItem) =>
      includedItem.items.some((item: any) => item.name === itemName)
    );

    if (existingItem) {
      // If item already exists, remove it
      handleRemoveItem(existingItem.id);
    } else {
      // Otherwise, add it
      const itemId = uuidv4();
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
        items: [{ name: itemName, price, quantity: 1 }],
      };

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

  const handleDecreaseQTY = (_id: string) => {
    const arr = [...includedItems2];
    arr.forEach((item) => {
      if (item.id === _id) {
        if (item.items[0].quantity > 1)
          item.items[0].quantity = item.items[0].quantity - 1;
      }
    });
    setIncludedItems2([...arr]);
    localStorage.setItem("includedItems2", JSON.stringify([...arr]));
  };

  const handleIncreaseQTY = (_id: string) => {
    const arr = [...includedItems2];
    arr.forEach((item) => {
      if (item.id === _id) {
        item.items[0].quantity = item.items[0].quantity + 1;
      }
    });

    setIncludedItems2([...arr]);
    localStorage.setItem("includedItems2", JSON.stringify([...arr]));
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

  const calculateAmount = () => {
    const additionalTotal = includedItems2?.reduce((acc, value) => {
      return (acc =
        acc +
        Number(value?.items?.[0]?.price) * Number(value?.items?.[0]?.quantity));
    }, Number(kulcha?.price) * Number(kulcha.quantity));
    return Number(additionalTotal.toFixed(2));
  };

  const handleAddToCart = async () => {
    try {
      setLoading(true);
      const colRef = collection(db, "carts");
      const data = {
        userId: user?.uid,
        customer: {
          name: metaData?.name,
          phoneNumber: metaData?.phoneNumber,
          address: metaData?.address,
        },
        order: {
          kulcha: kulcha,
          withKulcha: [...FIXED_INCLUDE_ITEMS],
          additional: [...includedItems2],
        },
        total_amount: (
          Number(calculateAmount()) +
          Number(calculateAmount()) * 0.13
        ).toFixed(2),
        createdAt: Timestamp.now(),
      };
      await addDoc(colRef, {
        ...data,
      });
      setLoading(false);
      setCount(count + 1);
      router.push("/checkout");
    } catch (err :any) {
      console.log(err);
      setLoading(false);
    }
  };

  const handleDecreaseKulchaQTY = () => {
    let item: any = { ...kulcha };
    if (item.quantity > 1) {
      item.quantity = item.quantity - 1;
    }
    localStorage.setItem("kulcha", JSON.stringify(item));
    setKulcha({
      ...item,
    });
  };

  const handleIncreaseKulchaQTY = () => {
    let item: any = { ...kulcha };
    item.quantity = item.quantity + 1;
    localStorage.setItem("kulcha", JSON.stringify(item));
    setKulcha({
      ...item,
    });
  };

  return (
    <Box
      sx={{
        backgroundColor: "#fffaeb",
        padding: { xs: "1rem", sm: "2rem" },
      }}>
      <CircularLodar isLoading={loading} />

      <Grid
        container
        spacing={4}
        sx={{
          width: "100%",
          paddingLeft: "15px",
          justifyContent: "center",
          alignItems: "center",
        }}>
        <Grid item xs={12} md={6}>
          <Box sx={{ paddingLeft: "7%" }}>
            <Typography
              variant='h4'
              sx={{
                marginBottom: "1rem",
                marginTop: "2rem",
                fontWeight: "bold",
                fontSize: { xs: "1.5rem", sm: "3.2rem" },
                color: "#000000",
              }}>
              {kulcha?.name}
            </Typography>
            <Typography
              variant='body1'
              sx={{
                marginBottom: "1rem",
                color: "#000000",
                fontSize: { xs: "1rem", sm: "1.2rem" },
              }}>
              {kulcha?.desc}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              textAlign: { xs: "center", md: "right" },
              marginLeft: { md: 13 },
              paddingLeft: "20%",
              paddingRight: "10%",
            }}>
            <Image
              src={kulcha?.image}
              alt='Amritsari Kulcha'
              width={500}
              height={500}
              style={{
                maxWidth: "90%",
                height: "20%",
                borderRadius: "5%", // This makes the image round
                objectFit: "cover",
              }}
            />
          </Box>

          <Box
            sx={{
              textAlign: { xs: "center", md: "right" },
              marginLeft: { md: 8 },
              paddingLeft: "20%",
              paddingRight: "10%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}>
            <IconButton
              onClick={() => handleDecreaseKulchaQTY()}
              sx={{
                color: "#336195",
              }}>
              <RemoveCircleOutlineIcon sx={{ fontSize: "2.5rem" }} />
            </IconButton>
            <Typography variant='body1' color='textPrimary'>
              {kulcha?.quantity}
            </Typography>
            <IconButton
              onClick={() => handleIncreaseKulchaQTY()}
              sx={{
                color: "#336195",
              }}>
              <AddCircleOutlineIcon sx={{ fontSize: "2.5rem" }} />
            </IconButton>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box
            sx={{
              textAlign: "center",
            }}>
            <Box
              sx={{
                width: "60%",
                height: "1px",
                backgroundColor: "#dcdcdc",
                margin: "0 auto",
                marginBottom: "23px",
              }}
            />
            <Typography
              variant='h4'
              gutterBottom
              sx={{ color: "#021e3a", fontWeight: "bold" }}>
              What&apos;s Included
            </Typography>
            <Grid container spacing={2} justifyContent='center'>
              {FIXED_INCLUDE_ITEMS.length == 0 ? (
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
                        md: "230px",
                        lg: "230px",
                      },
                      width: { xs: "150px", sm: "175px" },
                      margin: "1rem",
                    }}>
                    <AddCircleOutlineIcon
                      sx={{ fontSize: "4rem", color: "#336195" }}
                    />
                    <Typography variant='body1' color='textSecondary'>
                      Add Items
                    </Typography>
                  </Box>
                </Grid>
              ) : (
                FIXED_INCLUDE_ITEMS.map((item) => (
                  <Grid item xs={6} sm={4} md={1.6} key={item.id}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        padding: "1rem",
                        backgroundColor: "white",
                        border: "2px solid #87939f",
                        borderRadius: "8px",
                        textAlign: "center",
                        position: "relative",
                        cursor: "pointer",
                        height: {
                          xs: "160px",
                          sm: "120px",
                          md: "150px",
                          lg: "150px",
                        },
                        width: { xs: "130px", sm: "175px" },
                        margin: "0.5rem", // Updated margin
                        boxShadow: "2px 2px 3px #4e5664", // Updated box-shadow
                      }}>
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
                          width: "50%", // Set the width to 65% of the container
                          height: "50%", // Set the height to 55% of the container
                          objectFit: "contain",
                          marginTop: 1,
                        }}
                      />
                      <Typography
                        variant='body1'
                        color='textPrimary'
                        sx={{ mt: 2 }}>
                        {item.items[0].name}
                      </Typography>
                    </Box>
                  </Grid>
                ))
              )}
            </Grid>
            {includedItems2.length > 0 && (
              <Typography
                variant='h4'
                gutterBottom
                sx={{ color: "#021e3a", marginTop: 4 }}>
                Additional items
              </Typography>
            )}
            <Grid container spacing={2} justifyContent='center'>
              {includedItems2.length == 0 ? (
                <></>
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
                        height: { xs: "270px", sm: "270px" },
                        width: { xs: "130px", sm: "175px" },
                        margin: "0.5rem",
                        boxShadow: "2px 2px 3px #4e5664",
                      }}>
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
                      <Typography variant='body1' color='textPrimary'>
                        {item.items[0].name}
                      </Typography>
                      <Typography variant='body2' color='textSecondary'>
                        ${item.items[0].price.toFixed(2)}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginTop: "0.5rem",
                        }}>
                        <IconButton
                          onClick={() => handleDecreaseQTY(item.id)}
                          sx={{
                            color: "#336195",
                          }}>
                          <RemoveCircleOutlineIcon />
                        </IconButton>
                        <Typography variant='body1' color='textPrimary'>
                          {item.items[0].quantity || 1}
                        </Typography>
                        <IconButton
                          onClick={() => handleIncreaseQTY(item.id)}
                          sx={{
                            color: "#336195",
                          }}>
                          <AddCircleOutlineIcon />
                        </IconButton>
                      </Box>
                      <Button
                        variant='outlined'
                        onClick={() => handleRemoveItem(item.id)}
                        sx={{
                          backgroundColor: "transparent",
                          color: "#336195",
                          border: "1px solid #336195",
                          marginTop: "auto",
                          borderRadius: "20px",
                          textTransform: "none",
                        }}>
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
              paddingTop: "0rem",
              marginBottom: "0rem",
              textAlign: "center",
            }}>
            <Box
              sx={{
                width: "65%",
                height: "1px",
                backgroundColor: "#dcdcdc",
                margin: "0 auto",
                marginBottom: "23px",
              }}
            />
            <Typography
              variant='h4'
              gutterBottom
              sx={{ color: "#021e3a", fontWeight: "bold" }}>
              Would you like to add extra items?
            </Typography>
            <Grid container spacing={1} justifyContent='center'>
              {extraItems.map((item, index) => (
                <Grid
                  item
                  xs={12}
                  key={index}
                  sx={{ display: "flex", justifyContent: "center" }}>
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
                    onClick={() => handleAddItem(item)}>
                    <Box display='flex' alignItems='center'>
                      <Image
                        src={getImageSrc(item)}
                        alt={item}
                        layout='fixed'
                        width={50}
                        height={50}
                        style={{
                          objectFit: "cover",
                          borderRadius: "50%",
                        }}
                      />
                      <Typography
                        variant='body1'
                        color='textPrimary'
                        sx={{ marginLeft: "1rem" }}>
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
              // marginTop: "2.7rem",
              paddingTop: "0rem",
              marginBottom: "0.5rem",
              textAlign: "center",
            }}>
            {/* <Box
              sx={{
                width: "65%",
                height: "1px",
                backgroundColor: "#dcdcdc",
                margin: "0 auto", // Center the line horizontally
                marginBottom: "23px", // Add space between the line and the text
              }}
            /> */}
            <Typography
              variant='h4'
              gutterBottom
              sx={{ color: "#021e3a", fontWeight: "bold" }}>
              Make it a Meal
            </Typography>
            <Grid container spacing={1} justifyContent='center'>
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
                  onClick={handleDrinkDialogOpen}>
                  <Box display='flex' alignItems='center'>
                    <Image
                      src='/images/landingpage/Drinks.svg'
                      alt='Add a Drink'
                      layout='fixed'
                      width={50}
                      height={50}
                      style={{
                        objectFit: "cover",
                        borderRadius: "50%",
                      }}
                    />
                    <Typography
                      variant='body1'
                      color='textPrimary'
                      sx={{ marginLeft: "1rem" }}>
                      Add a Drink
                    </Typography>
                  </Box>
                  <ArrowForwardIosIcon />
                </Box>
                <Box
                    display='flex'
                    justifyContent='center'
                    alignItems='center'>
                    <Button
                      variant='contained'
                      sx={{
                        backgroundColor: "#ECAB21",
                        color: "white",
                        borderRadius: 10,
                        marginTop: 2,
                        paddingX: 4,
                        paddingY: 1,
                        fontWeight: "bold",
                        "&:hover": {
                          backgroundColor: "#FFC107",
                          color: "white",
                        },
                      }}
                      onClick={handleAddToCart}>
                      Add to cart
                    </Button>
                  </Box>
              </Grid>
              {/* <Grid item xs={12}>
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
              </Grid> */}
              {/* <Grid item xs={12}>
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
              </Grid> */}
              {/* <Grid item xs={12}>
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
              </Grid> */}
            </Grid>
          </Box>
        </Grid>
      </Grid>
      <Dialog
        open={isDrinkDialogOpen}
        onClose={handleDrinkDialogClose}
        maxWidth='sm'
        fullWidth>
        <DialogTitle sx={{ fontWeight: "bold" }}>
          Add a Drink{" "}
          <IconButton
            aria-label='close'
            onClick={handleDrinkDialogClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {drinkOptions.map((drink) => (
              <Grid item xs={12} sm={6} md={4} key={drink.name}>
                <Card
                  onClick={() => handleDrinkSelect(drink.name)}
                  sx={{
                    border: includedItems2.some((item) =>
                      item.items.some((i: any) => i.name === drink.name)
                    )
                      ? "2px solid green"
                      : "1px solid #ddd",
                    position: "relative",
                    cursor: "pointer",
                    height: "250px", // Ensure all cards have the same height
                    display: "flex",
                    width:{xs:"230px",sm:"auto"},
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center", // Align items center horizontally
                    marginInline:{xs:"auto"},
                  }}>
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
                    <Typography
                      variant='body1'
                      color='textPrimary'
                      sx={{ fontSize: "18px" }}>
                      {drink.name}
                    </Typography>
                    <Typography variant='body2' color='textSecondary'>
                      ${drink.price.toFixed(2)}
                    </Typography>
                    {includedItems2.some((item) =>
                      item.items.some((i: any) => i.name === drink.name)
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
        maxWidth='sm'
        fullWidth>
        <DialogTitle sx={{ fontWeight: "bold" }}>
          Add a Lassi
          <IconButton
            aria-label='close'
            onClick={handleLassiDialogClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {lassiOptions.map((lassi) => (
              <Grid item xs={12} sm={6} md={4} key={lassi.name}>
                <Card
                  onClick={() => handleLassiSelect(lassi.name)}
                  sx={{
                    border: includedItems2.some((item) =>
                      item.items.some((i: any) => i.name === lassi.name)
                    )
                      ? "2px solid green"
                      : "1px solid #ddd",
                    position: "relative",
                    cursor: "pointer",
                    height: "270px", // Ensure all cards have the same height
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}>
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
                      variant='body1'
                      color='textPrimary'
                      align='center'
                      sx={{ fontSize: "18px" }}>
                      {lassi.name}
                    </Typography>
                    <Typography
                      variant='body2'
                      color='textSecondary'
                      align='center'>
                      ${lassi.price.toFixed(2)}
                    </Typography>
                    {includedItems2.some((item) =>
                      item.items.some((i: any) => i.name === lassi.name)
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
        maxWidth='sm'
        fullWidth>
        <DialogTitle sx={{ fontWeight: "bold" }}>
          Add a Tea
          <IconButton
            aria-label='close'
            onClick={handleTeaDialogClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {teaOptions.map((tea) => (
              <Grid item xs={12} sm={6} md={4} key={tea.name}>
                <Card
                  onClick={() => handleTeaSelect(tea.name)}
                  sx={{
                    border: includedItems2.some((item) =>
                      item.items.some((i: any) => i.name === tea.name)
                    )
                      ? "2px solid green"
                      : "1px solid #ddd",
                    position: "relative",
                    cursor: "pointer",
                    height: "270px", // Ensure all cards have the same height
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}>
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
                      variant='body1'
                      color='textPrimary'
                      align='center'
                      sx={{ fontSize: "18px" }}>
                      {tea.name}
                    </Typography>
                    <Typography
                      variant='body2'
                      color='textSecondary'
                      align='center'>
                      ${tea.price.toFixed(2)}
                    </Typography>
                    {includedItems2.some((item) =>
                      item.items.some((i: any) => i.name === tea.name)
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
        maxWidth='sm'
        fullWidth>
        <DialogTitle sx={{ fontWeight: "bold" }}>
          Add a Coffee
          <IconButton
            aria-label='close'
            onClick={handleCoffeeDialogClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {coffeeOptions.map((coffee) => (
              <Grid item xs={12} sm={6} md={4} key={coffee.name}>
                <Card
                  onClick={() => handleCoffeeSelect(coffee.name)}
                  sx={{
                    border: includedItems2.some((item) =>
                      item.items.some((i: any) => i.name === coffee.name)
                    )
                      ? "2px solid green"
                      : "1px solid #ddd",
                    position: "relative",
                    cursor: "pointer",
                    height: "270px", // Ensure all cards have the same height
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}>
                  <Image
                    alt={coffee.name}
                    src={coffee.image}
                    width={150}
                    height={150}
                    style={{
                      width: "65%",
                      height: "55%",
                      objectFit: "contain",
                      display: "block",
                      margin: "0 auto",
                    }}
                  />
                  <CardContent>
                    <Typography
                      variant='body1'
                      color='textPrimary'
                      align='center'
                      sx={{ fontSize: "18px" }}>
                      {coffee.name}
                    </Typography>
                    <Typography
                      variant='body2'
                      color='textSecondary'
                      align='center'>
                      ${coffee.price.toFixed(2)}
                    </Typography>
                    {includedItems2.some((item) =>
                      item.items.some((i: any) => i.name === coffee.name)
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
