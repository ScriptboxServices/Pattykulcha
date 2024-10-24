"use client";

import React, { useEffect, useState, useRef } from "react";
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
  Tab,
  Tabs,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useAuthContext, useMenuContext, FIXED_INCLUDE_ITEMS } from "@/context";
import { v4 as uuidv4 } from "uuid";
import Link from "next/link";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "next/navigation";
import CircularLodar from "@/components/CircularLodar";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import GiftIcon from "@mui/icons-material/CardGiftcard"; // This will act as the gift icon
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SearchIcon from "@mui/icons-material/Search";

import {
  drinkOptions,
  menuItems,
  extraItemsOptions,
} from "@/constants/MenuOptions";

export const getImageSrc = (item: string) => {
  const images: { [key: string]: string } = {
    Chana: "/images/Channa.png",
    "Imli Pyaz Chutney": "/images/Imlipyaazchutney.png",
    "Amul Butter": "/images/AmulButter.png",
    "Normal Butter": "/images/Normalbutter.png",
    Coke: "/images/Cokecan.png",
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

const scrollToRef = (ref: React.RefObject<HTMLDivElement>) => {
  if (ref.current) {
    ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

const MenuPage = ({ _kulcha }: { _kulcha: any }) => {
  const {
    kulcha,
    setKulcha,
    extraItems,
    setExtraItems,
    selectedDrinks,
    setSelectedDrinks,
    selectedLassis,
    setSelectedLassis,
    otherKulchas,
    setOtherKulchas,
    allDrinks,
    setAllDrinks,
  } = useMenuContext();

  const { user, metaData } = useAuthContext();

  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);

  const [isDrinkDialogOpen, setIsDrinkDialogOpen] = useState(false);
  const [isLassiDialogOpen, setIsLassiDialogOpen] = useState(false);
  const [isTeaDialogOpen, setIsTeaDialogOpen] = useState(false);
  const [isCoffeeDialogOpen, setIsCoffeeDialogOpen] = useState(false);
  const [alignment, setAlignment] = useState<string | null>("delivery");
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [isSticky, setIsSticky] = useState<boolean>(false);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const kulchaRef = useRef<HTMLDivElement>(null);
  const extrasRef = useRef<HTMLDivElement>(null);
  const beveragesRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
    if (newValue === 0)
      kulchaRef.current?.scrollIntoView({ behavior: "smooth" });
    if (newValue === 1)
      extrasRef.current?.scrollIntoView({ behavior: "smooth" });
    if (newValue === 2)
      beveragesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "-100px 0px 0px 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target === kulchaRef.current) {
            setSelectedTab(0);
          } else if (entry.target === extrasRef.current) {
            setSelectedTab(1);
          } else if (entry.target === beveragesRef.current) {
            setSelectedTab(2);
          }
        }
      });
    }, options);

    if (kulchaRef.current) observer.observe(kulchaRef.current);
    if (extrasRef.current) observer.observe(extrasRef.current);
    if (beveragesRef.current) observer.observe(beveragesRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (tabsRef.current && tabsContainerRef.current) {
        const tabsPosition =
          tabsContainerRef.current.getBoundingClientRect().top;
        if (tabsPosition <= 0 && !isSticky) {
          setIsSticky(true);
        } else if (tabsPosition > 0 && isSticky) {
          setIsSticky(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isSticky]);

  const handleAlignmentChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string | null
  ) => {
    if (newAlignment !== null) {
      setAlignment(newAlignment);
    }
  };

  useEffect(() => {
    setKulcha({
      ..._kulcha,
      ...kulcha,
    });
  }, []);

  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const component = document.getElementById("scrollable-container");
      const componentHeight = component?.offsetHeight || 0;
      const componentTop =
        component?.getBoundingClientRect().top! + scrollTop || 0;

      const componentBottom = componentTop + componentHeight;
      const viewportBottom = scrollTop + windowHeight;

      if (viewportBottom >= componentBottom) {
        setIsAtBottom(true);
      } else {
        setIsAtBottom(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const calculateAmount = (includedItems2: any) => {
    const additionalTotal = includedItems2?.reduce((acc: any, value: any) => {
      return (acc =
        acc +
        Number(value?.items?.[0]?.price) * Number(value?.items?.[0]?.quantity));
    }, Number(kulcha?.price) * Number(kulcha.quantity));
    return Number(additionalTotal.toFixed(2));
  };

  const handleAddToCart = async () => {
    try {
      let includedItems2 = [];
      setLoading(true);
      for (let item of extraItems) {
        if (item.added) {
          includedItems2.push({
            items: [
              { name: item.name, price: item.price, quantity: item.quantity },
            ],
          });
        }
      }
      for (let item of allDrinks) {
        if (item.added) {
          includedItems2.push({
            items: [
              { name: item.name, price: item.price, quantity: item.quantity },
            ],
          });
        }
      }
      const orderRef = collection(db, "orders");
      const q = query(orderRef, where("userId", "==", user?.uid));
      const hasOrders = await getDocs(q);
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
          Number(calculateAmount(includedItems2)) +
          Number(calculateAmount(includedItems2)) * 0.13
        ).toFixed(2),
        createdAt: Timestamp.now(),
        isUserExist: hasOrders.size > 0,
      };
      await addDoc(colRef, {
        ...data,
      });

      const extra = otherKulchas?.map((item: any) => {
        if (item?.added === true) {
          return addDoc(colRef, {
            userId: user?.uid,
            customer: {
              name: metaData?.name,
              phoneNumber: metaData?.phoneNumber,
              address: metaData?.address,
            },
            order: {
              kulcha: item,
              withKulcha: [...FIXED_INCLUDE_ITEMS],
              additional: [],
            },
            total_amount: (
              Number(item.price) * Number(item.quantity) +
              Number(item.price) * Number(item.quantity) * 0.13
            ).toFixed(2),
            createdAt: Timestamp.now(),
          });
        }
      });

      await Promise.all([...extra]);

      localStorage.removeItem("otherKulchas");
      localStorage.removeItem("drinks");
      localStorage.removeItem("extra");
      setOtherKulchas([...menuItems]);
      setAllDrinks([...drinkOptions]);
      setExtraItems([...extraItemsOptions]);

      setLoading(false);
      router.push("/checkout");
    } catch (err: any) {
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

  const addDrinks = (name: string) => {
    let arr = allDrinks.map((item: any) => {
      let clonedItem = { ...item };
      if (clonedItem.name === name) {
        clonedItem.added = true;
      }
      return clonedItem;
    });
    setAllDrinks([...arr]);
    localStorage.setItem("drinks", JSON.stringify([...arr]));
  };

  const addExtraItem = (name: string) => {
    let arr = extraItems.map((item: any) => {
      let clonedItem = { ...item };
      if (clonedItem.name === name) {
        clonedItem.added = true;
      }
      return clonedItem;
    });
    setExtraItems([...arr]);
    localStorage.setItem("extra", JSON.stringify([...arr]));
  };

  const addOtherKulchas = (name: string) => {
    let arr = otherKulchas.map((item: any) => {
      let clonedItem = { ...item };
      if (clonedItem.name === name) {
        clonedItem.added = true;
      }
      return clonedItem;
    });
    setOtherKulchas([...arr]);
    localStorage.setItem("otherKulchas", JSON.stringify([...arr]));
  };

  const removeDrink = (name: string) => {
    let arr = allDrinks.map((item: any) => {
      let clonedItem = { ...item };
      if (clonedItem.name === name) {
        delete clonedItem.added;
      }
      return clonedItem;
    });
    setAllDrinks([...arr]);
    localStorage.setItem("drinks", JSON.stringify([...arr]));
  };

  const removeExtraItem = (name: string) => {
    let arr = extraItems.map((item: any) => {
      let clonedItem = { ...item };
      if (clonedItem.name === name) {
        delete clonedItem.added;
      }
      return clonedItem;
    });
    setExtraItems([...arr]);
    localStorage.setItem("extra", JSON.stringify([...arr]));
  };

  const removeOtherKulchas = (name: string) => {
    let arr = otherKulchas.map((item: any) => {
      let clonedItem = { ...item };
      if (clonedItem.name === name) {
        delete clonedItem.added;
      }
      return clonedItem;
    });
    setOtherKulchas([...arr]);
    localStorage.setItem("otherKulchas", JSON.stringify([...arr]));
  };

  const increaseQTYDrink = (name: string) => {
    let arr = allDrinks.map((item: any) => {
      let clonedItem = { ...item };
      if (clonedItem.name === name) {
        clonedItem.quantity = clonedItem.quantity + 1;
      }
      return clonedItem;
    });
    setAllDrinks([...arr]);
    localStorage.setItem("drinks", JSON.stringify([...arr]));
  };

  const increaseQTYExtraItem = (name: string) => {
    let arr = extraItems.map((item: any) => {
      let clonedItem = { ...item };
      if (clonedItem.name === name) {
        clonedItem.quantity = clonedItem.quantity + 1;
      }
      return clonedItem;
    });
    setExtraItems([...arr]);
    localStorage.setItem("extra", JSON.stringify([...arr]));
  };

  const increaseQTYOtherKulchas = (name: string) => {
    let arr = otherKulchas.map((item: any) => {
      let clonedItem = { ...item };
      if (clonedItem.name === name) {
        clonedItem.quantity = clonedItem.quantity + 1;
      }
      return clonedItem;
    });
    setOtherKulchas([...arr]);
    localStorage.setItem("otherKulchas", JSON.stringify([...arr]));
  };

  const decreaseQTYDrink = (name: string) => {
    let arr = allDrinks.map((item: any) => {
      let clonedItem = { ...item };
      if (clonedItem.name === name) {
        clonedItem.quantity = clonedItem.quantity - 1;
      }
      return clonedItem;
    });
    setAllDrinks([...arr]);
    localStorage.setItem("drinks", JSON.stringify([...arr]));
  };

  const decreaseQTYExtraItem = (name: string) => {
    let arr = extraItems.map((item: any) => {
      let clonedItem = { ...item };
      if (clonedItem.name === name) {
        clonedItem.quantity = clonedItem.quantity - 1;
      }
      return clonedItem;
    });
    setExtraItems([...arr]);
    localStorage.setItem("extra", JSON.stringify([...arr]));
  };

  const decreaseQTYOtherKulchas = (name: string) => {
    let arr = otherKulchas.map((item: any) => {
      let clonedItem = { ...item };
      if (clonedItem.name === name) {
        clonedItem.quantity = clonedItem.quantity - 1;
      }
      return clonedItem;
    });
    setOtherKulchas([...arr]);
    localStorage.setItem("otherKulchas", JSON.stringify([...arr]));
  };

  return (
    <Box
      sx={{
        backgroundColor: { xs: "#FFFFFF", sm: "#fffaeb" },
        padding: { xs: "0rem", sm: "2rem" },
      }}
    >
      <CircularLodar isLoading={loading} />
      <Box
        sx={{
          display: { xs: "none", sm: "flex" },
          justifyContent: "center",
          flexDirection: { xs: "row", sm: "row" },
        }}
      >
        <Grid item xs={8} sm={6} md={6}>
          {" "}
          {/* Updated xs to 8 (70% of 12-column grid) */}
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
                fontSize: { xs: "0.9rem", sm: "1.2rem" },
                fontWeight: "bold",
              }}
            >
              What&apos;s Included:- Chana, Imli-Pyaz-Chutney, Butter.
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={4} sm={6} md={6}>
          {" "}
          <Box
            sx={{
              textAlign: { xs: "center", md: "right" },
              marginLeft: { md: 13 },
              paddingLeft: { xs: "0", md: "20%" },
              paddingRight: { xs: "0", md: "10%" },
            }}
          >
            <Image
              src={kulcha?.image}
              alt="Amritsari Kulcha"
              width={500}
              height={500}
              style={{
                maxWidth: "90%",
                height: "auto", // Adjusted height for responsiveness
                paddingTop: 10,
                borderRadius: "5%", // Keeps the image rounded
                objectFit: "cover",
                // Adjusted width for responsiveness
              }}
            />
          </Box>
          <Box
            sx={{
              textAlign: { xs: "center", md: "right" },
              marginLeft: { md: 8 },
              paddingLeft: { xs: "0", md: "20%" },
              paddingRight: { xs: "0", md: "10%" },
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <IconButton
              onClick={() => handleDecreaseKulchaQTY()}
              sx={{
                color: "#336195",
              }}
            >
              <RemoveCircleOutlineIcon
                sx={{ fontSize: { xs: "1.5rem", sm: "2.5rem" } }}
              />
            </IconButton>
            <Typography variant="body1" color="textPrimary">
              {kulcha?.quantity}
            </Typography>
            <IconButton
              onClick={() => handleIncreaseKulchaQTY()}
              sx={{
                color: "#336195",
              }}
            >
              <AddCircleOutlineIcon
                sx={{ fontSize: { xs: "1.5rem", sm: "2.5rem" } }}
              />
            </IconButton>
          </Box>
        </Grid>
      </Box>

      <Grid
        item
        xs={12}
        sx={{ display: { xs: "flex", sm: "none" }, justifyContent: "center" }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            padding: { xs: "0rem", sm: "1rem" },
            backgroundColor: "white",
            border: { xs: "none", sm: "2px solid #dcdcdc" },
            borderRadius: "8px",
            position: "relative",
            width: { xs: "95%", md: "60%" },
            cursor: "pointer",
            mt: 3,
            gap: 3,
          }}
        >
          <Box
            sx={{
              position: "relative",
              width: "100px", // Adjust width based on the image size
              height: "100px",
              overflow: "hidden", // Ensures content is clipped inside the box
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#f5f5f5",
              borderRadius: "50%",
            }}
          >
            {/* Image */}
            <Image
              src={kulcha?.image}
              alt={kulcha?.name}
              layout="fill" // Fills the parent container
              objectFit="cover" // Ensures the image is properly fitted
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              textAlign: "left",
              position: "relative",
              width: { xs: "65%", md: "80%" },
            }}
          >
            <Typography
              variant="h6"
              color="textPrimary"
              sx={{ fontWeight: "bold" }}
            >
              {kulcha?.name}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: "0.5rem",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "white",
                  borderRadius: "20px",
                  // boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                }}
              >
                <IconButton
                  onClick={() => handleDecreaseKulchaQTY()}
                  sx={{
                    color: "#336195",
                    border: "2px solid #336195",
                    width: "30px", // Same width as the buttons
                    height: "30px",
                  }}
                >
                  <RemoveIcon
                    sx={{ fontSize: { xs: "1.5rem", sm: "2.5rem" } }}
                  />
                </IconButton>
                <Typography variant="body1" color="textPrimary"
                sx={{
                  background: "#336195",
                  color: "white",
                  borderRadius: "50%",
                  fontSize: "1rem",
                  width: "30px", // Same width as the buttons
                  height: "30px", // Same height as the buttons
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: "0.5rem",
                  marginRight: "0.5rem",
                }}>
                  {kulcha?.quantity}
                </Typography>
                <IconButton
                  onClick={() => handleIncreaseKulchaQTY()}
                  sx={{
                    color: "#336195",
                    border: "2px solid #336195",
                    width: "30px", // Same width as the buttons
                    height: "30px",
                  }}
                >
                  <AddIcon sx={{ fontSize: { xs: "1.5rem", sm: "2.5rem" } }} />
                </IconButton>
              </Box>

              <Typography
                variant="body1"
                color="textSecondary"
                sx={{
                  fontWeight: "bold",
                  marginLeft: "auto",
                  alignItem: "end",
                  color:'black',
                  pr:2
                }}
              >
                ${kulcha?.price}.00 x {kulcha?.quantity}
              </Typography>
            </Box>
          </Box>

          {/* Image and Quantity Controls Section */}
        </Box>
      </Grid>

      {/* <Box
        maxWidth="md"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          padding: "1rem",
          mx: "auto",
          flexDirection: "row",
          textAlign: { xs: "left", sm: "left" },
          gap: { xs: 2, sm: 0 },
          width: "100%",
        }}
      >
        <ToggleButtonGroup
          value={alignment}
          exclusive
          onChange={handleAlignmentChange}
          aria-label="delivery pickup"
          sx={{
            backgroundColor: { xs: "#FFFFFF", sm: "#fffaeb" },
            borderRadius: "30px",
            padding: "4px",
            width: "auto",
            justifyContent: "center",
          }}
        >
          <ToggleButton
            value="delivery"
            aria-label="delivery"
            sx={{
              borderRadius: "20px",
              padding: { xs: "8px 15px", sm: "10px 20px" },
              backgroundColor: alignment === "delivery" ? "#1A2B48" : "#FFFFFF",
              color: alignment === "delivery" ? "#FFFFFF" : "#1A2B48",
              textTransform: "none",
              "&.Mui-selected": {
                backgroundColor: "#1A2B48",
                color: "#FFFFFF",
              },
              "&:hover": {
                backgroundColor: "#1A2B48",
                color: "#FFFFFF",
              },
            }}
          >
            Delivery
          </ToggleButton>
          <ToggleButton
            value="pickup"
            aria-label="pickup"
            sx={{
              borderRadius: "20px", // Rounded all sides for Pickup
              padding: { xs: "8px 15px", sm: "10px 20px" },
              backgroundColor: alignment === "pickup" ? "#1A2B48" : "#FFFFFF",
              color: alignment === "pickup" ? "#FFFFFF" : "#1A2B48",
              textTransform: "none",
              "&.Mui-selected": {
                backgroundColor: "#1A2B48",
                color: "#FFFFFF",
              },
              "&:hover": {
                backgroundColor: "#1A2B48",
                color: "#FFFFFF",
              },
            }}
          >
            Pickup
          </ToggleButton>
        </ToggleButtonGroup>

        <Box
          sx={{
            textAlign: "left", // Left-align the text
            marginRight: { xs: "1rem", sm: "1rem" }, // Add space between toggle and text on all screen sizes
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: "#1A2B48",
              fontSize: { xs: "1rem", sm: "1.25rem" }, 
            }}
          >
            Welcome Back
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              color: "#1A2B48",
              fontSize: { xs: "1.5rem", sm: "2rem" }, 
            }}
          >
            {metaData?.name?.split(" ")[0]}
          </Typography>
        </Box>
      </Box> */}

      {/* Address Section - Conditionally Render Address */}
      {/* <Box maxWidth="md" sx={{ padding: "1rem", mx: "auto" }}>
        <Box display="flex" alignItems="center">
          <LocationOnIcon sx={{ color: "#1A2B48" }} />
          <Typography variant="body1" sx={{ ml: 1, color: "#333" }}>
            {alignment === "delivery"
              ? "456 Elm Street, Suite 789, Toronto..."
              : "7159 Magistrate Terrace, Ontario, Canada."}
          </Typography>
        </Box>
      </Box> */}
      {/* <Box ref={tabsContainerRef}>
        <Box
          ref={tabsRef}
          sx={{
            position: isSticky ? "fixed" : "relative",
            top: isSticky ? 0 : "auto",
            zIndex: 1000,
            backgroundColor: { xs: "white", sm: "#fffaeb" }, // Ensure background is white
            width: "100%",
            display: "flex", // Corrected "display" typo
            justifyContent: "center", // Centers the Box horizontally
            alignItems: "center",
          }}>
          <Box
            maxWidth='md'
            sx={{
              padding: "1rem",
              mx: "auto",
              display: "flex",
              justifyContent: "center",
            }}>
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              textColor='inherit'
              variant='scrollable'
              scrollButtons='auto'
              sx={{
                flexGrow: 1,
                justifyContent: "center", // Center the tabs
                "& .MuiTabs-indicator": {
                  backgroundColor: "#000",
                },
                "& .MuiTab-root": {
                  fontSize: {
                    xs: "0.8rem",
                    sm: "1rem",
                  },
                  minWidth: 80,
                  textTransform: "none",
                },
              }}>
              <Tab
                sx={{ padding: { xs: "12px", sm: "16px" } }}
                label="Other Kulcha's"
              />
              <Tab
                sx={{ padding: { xs: "12px", sm: "16px" } }}
                label="Extra's"
              />
              <Tab
                sx={{ padding: { xs: "12px", sm: "16px" } }}
                label='Beverages'
              />
            </Tabs>
          </Box>
        </Box>
      </Box> */}
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
        <Grid item xs={12} ref={kulchaRef}>
          <Box
            sx={{
              textAlign: { xs: "left", md: "center" },
            }}
          >
            <Typography
              variant="h4"
              gutterBottom
              sx={{ color: "#021e3a", fontWeight: "700", mt: "20px" }}
            >
              Other Kulcha&rsquo;s
            </Typography>
            <Grid
              container
              spacing={1}
              sx={{
                display: "flex",
                justifyContent: "center",
                // pl: 1,
              }}
            >
              {/* <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: "center",
                  justifyContent: { xs: "center", sm: "space-between" },
                  padding: "1rem",
                  backgroundColor: "white",
                  border: "2px solid #336195",
                  borderRadius: "8px",
                  textAlign: "center",
                  position: "relative",
                  cursor: "pointer",
                  margin: "0.5rem 0",
                  width: { xs: "100%", md: "59%" },
                }}
              >
                <Box display="flex" alignItems="center">
                  <Image
                    src={kulcha?.image}
                    alt={kulcha?.name}
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
                    {kulcha?.name}
                  </Typography>
                </Box>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  sx={{ marginRight: 2 }}
                >
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ marginTop: "0.2rem" }}
                  >
                    ${kulcha?.price?.toFixed(2)}
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
                      onClick={() => handleDecreaseKulchaQTY()}
                      sx={{
                        color: "#336195",
                      }}
                    >
                      <RemoveCircleOutlineIcon sx={{ fontSize: "2rem" }} />
                    </IconButton>
                    <Typography variant="body1" color="textPrimary">
                      {kulcha?.quantity}
                    </Typography>
                    <IconButton
                      onClick={() => handleIncreaseKulchaQTY()}
                      sx={{
                        color: "#336195",
                      }}
                    >
                      <AddCircleOutlineIcon sx={{ fontSize: "2rem" }} />
                    </IconButton>
                  </Box>
                </Box>
              </Box> */}
              {otherKulchas
                ?.filter((item: any) => item?.name !== kulcha?.name)
                .map((item: any) => (
                  <Grid
                    item
                    xs={12}
                    key={item.name}
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        padding: { xs: "0rem", sm: "1rem" },
                        backgroundColor: "white",
                        border: { xs: "none", sm: "2px solid #dcdcdc" },
                        borderRadius: "8px",
                        position: "relative",
                        width: { xs: "100%", md: "60%" },
                        cursor: "pointer",
                        mt: 3,
                        gap: 3,
                      }}
                    >
                      <Box
                        sx={{
                          position: "relative",
                          width: "100px", // Adjust width based on the image size
                          height: "100px",
                          overflow: "hidden", // Ensures content is clipped inside the box
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "#f5f5f5",
                          borderRadius: "50%", // Light gray background to mimic the image's border
                        }}
                      >
                        {/* Image */}
                        <Image
                          src={item?.image}
                          alt={item?.name}
                          layout="fill" // Fills the parent container
                          objectFit="cover" // Ensures the image is properly fitted
                        />
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          textAlign: "left",
                          position: "relative",
                          width: { xs: "65%", md: "80%" },
                        }}
                      >
                        {/* Item Name */}
                        <Typography
                          variant="h6"
                          color="textPrimary"
                          sx={{ fontWeight: "bold" }}
                        >
                          {item.name}
                        </Typography>

                        {/* Quantity and Price Section */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginTop: "0.5rem",
                          }}
                        >
                          {/* Quantity Control */}
                          {item?.added ? (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                backgroundColor: "white",
                                borderRadius: "20px",
                                // boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                              }}
                            >
                              {item?.quantity == 1 ? (
                                <IconButton
                                  onClick={() => removeOtherKulchas(item.name)}
                                  sx={{
                                    color: "#336195",
                                    border: "2px solid #336195",
                                    width: "30px", // Same width as the buttons
                                    height: "30px",
                                  }}
                                >
                                  <RemoveIcon sx={{ fontSize: "1.5rem" }} />
                                </IconButton>
                              ) : (
                                <IconButton
                                  onClick={() =>
                                    decreaseQTYOtherKulchas(item.name)
                                  }
                                  sx={{
                                    color: "#336195",
                                    border: "2px solid #336195",
                                    width: "30px", // Same width as the buttons
                                    height: "30px",
                                  }}
                                >
                                  <RemoveIcon sx={{ fontSize: "1.5rem" }} />
                                </IconButton>
                              )}
                              <Typography
                                variant="body1"
                                color="textPrimary"
                                sx={{
                                  background: "#336195",
                                  color: "white",
                                  borderRadius: "50%",
                                  fontSize: "1rem",
                                  width: "30px", // Same width as the buttons
                                  height: "30px", // Same height as the buttons
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  marginLeft: "0.5rem",
                                  marginRight: "0.5rem",
                                }}
                              >
                                {item?.quantity}
                              </Typography>
                              <IconButton
                                onClick={() =>
                                  increaseQTYOtherKulchas(item.name)
                                }
                                sx={{
                                  color: "#336195",
                                  border: "2px solid #336195",
                                  width: "30px", // Same width as the buttons
                                  height: "30px",
                                }}
                              >
                                <AddIcon sx={{ fontSize: "1.5rem" }} />
                              </IconButton>
                            </Box>
                          ) : (
                            <IconButton
                              onClick={() => addOtherKulchas(item.name)}
                              sx={{
                                color: "#336195",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "white",
                                borderRadius: "50%",
                                border: "2px solid #336195",
                                width: "30px", //
                                height: "30px",
                                "&:hover": {
                                  backgroundColor: "#f5f5f5", // Slightly change the color on hover
                                },
                              }}
                            >
                              <AddIcon sx={{ fontSize: "1.5rem" }} />
                            </IconButton>
                          )}

                          <Typography
                            variant="body1"
                            color="textPrimary"
                            sx={{
                              fontWeight: "bold",
                              marginLeft: "auto",
                              alignItem: "end",
                              color:'black'
                            }}
                          >
                            ${item?.price.toFixed(2)}{" "}
                            {item?.added && <>x {item?.quantity}</>}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Image and Quantity Controls Section */}
                    </Box>
                  </Grid>
                ))}
            </Grid>
            {/* <Typography
              variant='h4'
              gutterBottom
              sx={{ color: "#021e3a", fontWeight: "bold" }}>
              What&apos;s Included
            </Typography> */}
            {/* <Grid container spacing={2} justifyContent='center'>
              {
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
              }
            </Grid> */}
          </Box>
        </Grid>
        <Grid item xs={12} ref={extrasRef}>
          <Box
            sx={{
              paddingTop: "0rem",
              marginLeft: 0,
              textAlign: { xs: "left", md: "center" },
            }}
          >
            <Typography
              variant="h4"
              gutterBottom
              sx={{ color: "#021e3a", fontWeight: "bold", mt: 5 }}
            >
              Extra&rsquo;s
            </Typography>
            <Grid container spacing={1} justifyContent="center">
              {extraItems.map((item: any, index) => (
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
                      padding: { xs: "0rem", sm: "1rem" },
                      backgroundColor: "white",
                      border: { xs: "none", sm: "2px solid #dcdcdc" },
                      borderRadius: "8px",
                      position: "relative",
                      width: { xs: "100%", md: "60%" },
                      cursor: "pointer",
                      mt: 3,
                      gap: 3, // Ensuring the image stays on the right
                    }}
                  >
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      sx={{
                        position: "relative",
                        width: "100px", // Adjust width based on the image size
                        height: "100px",
                        overflow: "hidden", // Ensures content is clipped inside the box
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#f5f5f5",
                        borderRadius: "50%",
                      }}
                    >
                      <Image
                        src={getImageSrc(item?.name)}
                        alt={item?.name}
                        layout="fixed"
                        width={120}
                        height={120}
                        style={{
                          objectFit: "cover",
                          borderRadius: "10px",
                        }}
                      />
                    </Box>

                    <Box
                      display="flex"
                      flexDirection="column"
                      justifyContent="center"
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        textAlign: "left",
                        position: "relative",
                        width: { xs: "65%", md: "80%" },
                      }} // Ensure the text is left-aligned
                    >
                      <Typography
                        variant="h6"
                        color="textPrimary"
                        sx={{ fontWeight: "bold" }}
                      >
                        {item?.name}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginTop: "0.5rem",
                        }}
                      >
                        {item?.added ? (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              backgroundColor: "white",
                              borderRadius: "20px",
                            }}
                          >
                            {/* Quantity Control: If quantity is 1, show delete icon, otherwise show decrease */}
                            {item?.quantity == 1 ? (
                              <IconButton
                                onClick={() => removeExtraItem(item.name)}
                                sx={{
                                  color: "#336195",
                                  border: "2px solid #336195",
                                  width: "30px", // Same width as the buttons
                                  height: "30px",
                                }}
                              >
                                <RemoveIcon sx={{ fontSize: "1.5rem" }} />
                              </IconButton>
                            ) : (
                              <IconButton
                                onClick={() => decreaseQTYExtraItem(item.name)}
                                sx={{
                                  color: "#336195",
                                  border: "2px solid #336195",
                                  width: "30px", // Same width as the buttons
                                  height: "30px",
                                }}
                              >
                                <RemoveIcon sx={{ fontSize: "1.5rem" }} />
                              </IconButton>
                            )}
                            <Typography
                              variant="body1"
                              color="textPrimary"
                              sx={{
                                background: "#336195",
                                color: "white",
                                borderRadius: "50%",
                                fontSize: "1rem",
                                width: "30px", // Same width as the buttons
                                height: "30px", // Same height as the buttons
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginLeft: "0.5rem",
                                marginRight: "0.5rem",
                              }}
                            >
                              {item?.quantity}
                            </Typography>
                            <IconButton
                              onClick={() => increaseQTYExtraItem(item.name)}
                              sx={{
                                color: "#336195",
                                border: "2px solid #336195",
                                width: "30px", // Same width as the buttons
                                height: "30px",
                              }}
                            >
                              <AddIcon sx={{ fontSize: "1.5rem" }} />
                            </IconButton>
                          </Box>
                        ) : (
                          <IconButton
                            onClick={() => addExtraItem(item.name)}
                            sx={{
                              color: "#336195",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: "white",
                              borderRadius: "50%",
                              border: "2px solid #336195",
                              width: "30px", //
                              height: "30px",
                              "&:hover": {
                                backgroundColor: "#f5f5f5", // Slightly change the color on hover
                              },
                            }}
                          >
                            <AddIcon sx={{ fontSize: "1.5rem" }} />
                          </IconButton>
                        )}

                        <Typography
                          variant="body1"
                          color="textSecondary"
                          sx={{
                            fontWeight: "bold",
                            marginLeft: "auto",
                            alignItem: "end",
                            color: "black",
                          }}
                        >
                          ${item?.price.toFixed(2)}{" "}
                          {item?.added && <>x {item?.quantity}</>}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={12} ref={beveragesRef}>
          <Box
            sx={{
              paddingTop: "0rem",
              marginBottom: "0rem",
              textAlign: { xs: "left", md: "center" },
            }}
          >
            <Typography
              variant="h4"
              gutterBottom
              sx={{ color: "#021e3a", fontWeight: "bold", mt: "20px" }}
            >
              Beverages
            </Typography>
            <Grid container spacing={1} justifyContent="center">
              {allDrinks?.map((item: any, index: any) => (
                <Grid
                  item
                  xs={12}
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      padding: { xs: "0rem", sm: "1rem" },
                      backgroundColor: "white",
                      border: { xs: "none", sm: "2px solid #dcdcdc" },
                      borderRadius: "8px",
                      position: "relative",
                      width: { xs: "100%", md: "60%" },
                      cursor: "pointer",
                      mt: 3,
                      gap: 3,
                    }}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        width: "100px", // Adjust width based on the image size
                        height: "100px",
                        overflow: "hidden", // Ensures content is clipped inside the box
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "white",
                        borderRadius: "50%",
                      }}
                    >
                      <Image
                        alt={item.name}
                        src={item.image}
                        layout="fixed"
                        width={100}
                        height={100}
                        style={{
                          objectFit: "cover",
                          borderRadius: "50%",
                        }}
                      />
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        textAlign: "left",
                        position: "relative",
                        width: { xs: "65%", md: "80%" }, // Add space between text and image
                      }}
                    >
                      <Typography
                        variant="h6"
                        color="textPrimary"
                        sx={{ fontWeight: "bold" }}
                      >
                        {item.name}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginTop: "0.5rem",
                        }}
                      >
                        {item?.added ? (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              backgroundColor: "white",
                              borderRadius: "20px",
                            }}
                          >
                            {/* Quantity Control: If quantity is 1, show delete icon, otherwise show decrease */}
                            {item?.quantity == 1 ? (
                              <IconButton
                                onClick={() => removeDrink(item.name)}
                                sx={{
                                  color: "#336195",
                                  border: "2px solid #336195",
                                  width: "30px", // Same width as the buttons
                                  height: "30px",
                                }}
                              >
                                <RemoveIcon sx={{ fontSize: "1.5rem" }} />
                              </IconButton>
                            ) : (
                              <IconButton
                                onClick={() => decreaseQTYDrink(item.name)}
                                sx={{
                                  color: "#336195",
                                  border: "2px solid #336195",
                                  width: "30px", // Same width as the buttons
                                  height: "30px",
                                }}
                              >
                                <RemoveIcon sx={{ fontSize: "1.5rem" }} />
                              </IconButton>
                            )}
                            <Typography
                              variant="body1"
                              color="textPrimary"
                              sx={{
                                background: "#336195",
                                color: "white",
                                borderRadius: "50%",
                                fontSize: "1rem",
                                width: "30px", // Same width as the buttons
                                height: "30px", // Same height as the buttons
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginLeft: "0.5rem",
                                marginRight: "0.5rem",
                              }}
                            >
                              {item?.quantity}
                            </Typography>
                            <IconButton
                              onClick={() => increaseQTYDrink(item.name)}
                              sx={{
                                color: "#336195",
                                border: "2px solid #336195",
                                width: "30px", // Same width as the buttons
                                height: "30px",
                              }}
                            >
                              <AddIcon sx={{ fontSize: "1.5rem" }} />
                            </IconButton>
                          </Box>
                        ) : (
                          <IconButton
                            onClick={() => addDrinks(item.name)}
                            sx={{
                              color: "#336195",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: "white",
                              borderRadius: "50%",
                              border: "2px solid #336195",
                              width: "30px", //
                              height: "30px",
                              "&:hover": {
                                backgroundColor: "#f5f5f5", // Slightly change the color on hover
                              },
                            }}
                          >
                            <AddIcon sx={{ fontSize: "1.5rem" }} />
                          </IconButton>
                        )}

                        <Typography
                          variant="body1"
                          color="textSecondary"
                          sx={{
                            fontWeight: "bold",
                            marginLeft: "auto",
                            alignItem: "end",
                            color: "black",
                          }}
                        >
                          ${item?.price.toFixed(2)}{" "}
                          {item?.added && <>x {item?.quantity}</>}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box
            sx={{
              paddingTop: "0rem",
              marginBottom: "0.5rem",
              textAlign: "center",
              position: "relative",
            }}
          >
            <Box
              id="scrollable-container"
              sx={{
                position: "relative",
                height: "100%",
                marginTop: 10,
                display: "flex",
                justifyContent: "center",
                marginBottom: 2,
              }}
            >
              <Box
                sx={{
                  position: isAtBottom ? "absolute" : "fixed",
                  bottom: isAtBottom ? 16 : 0,
                  right: { xs: "auto", md: 5 },
                  left: { xs: "0", md: "auto" },
                  width: "100%",
                  borderTop: isAtBottom ? "" : "1px solid #80808069",
                  backgroundColor: { xs: "white", sm: "#fffaeb" },
                  display: "flex",
                  justifyContent: "center",
                  zIndex: 1000,
                }}
              >
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#ECAB21",
                    color: "white",
                    borderRadius: 10,
                    paddingX: { xs: 3, sm: 4 },
                    paddingY: 1,
                    mb: 2,
                    mt: 2,
                    fontWeight: "bold",
                    "&:hover": {
                      backgroundColor: "#FFC107",
                      color: "white",
                    },
                  }}
                  onClick={handleAddToCart}
                >
                  Add to cart
                </Button>
              </Box>
            </Box>

            {/* <Box
              sx={{
                width: "65%",
                height: "1px",
                backgroundColor: "#dcdcdc",
                margin: "0 auto", // Center the line horizontally
                marginBottom: "23px", // Add space between the line and the text
              }}
            /> */}
            {/* <Typography
              variant="h4"
              gutterBottom
              sx={{ color: "#021e3a", fontWeight: "bold" }}
            >
              Make it a Meal
            </Typography> */}
            <Grid container spacing={1} justifyContent="center">
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
                    margin: "0.2rem 0",
                    width: { xs: "100%", md: "60%" },
                    marginInline: "auto",
                  }}
                  onClick={handleDrinkDialogOpen}
                >
                  <Box display="flex" alignItems="center">
                    <Image
                      src="/images/image.png"
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
                <Box display="flex" justifyContent="center" alignItems="center">
                  <Button
                    variant="contained"
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
                    onClick={handleAddToCart}
                  >
                    Add to cart
                  </Button>
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
      {/* <Dialog
        open={isDrinkDialogOpen}
        onClose={handleDrinkDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          Add a Drink{" "}
          <IconButton
            aria-label="close"
            onClick={handleDrinkDialogClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
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
                    width: { xs: "230px", sm: "auto" },
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center", // Align items center horizontally
                    marginInline: { xs: "auto" },
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
                    <Typography
                      variant="body1"
                      color="textPrimary"
                      sx={{ fontSize: "18px" }}
                    >
                      {drink.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
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
        <DialogActions>
          <Button onClick={handleDrinkDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDrinkDialogClose} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog> */}
      {/* <Dialog
        open={isLassiDialogOpen}
        onClose={handleLassiDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          Add a Lassi
          <IconButton
            aria-label="close"
            onClick={handleLassiDialogClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
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
                      sx={{ fontSize: "18px" }}
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
        <DialogActions>
          <Button onClick={handleLassiDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleLassiDialogClose} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog> */}
      {/* <Dialog
        open={isTeaDialogOpen}
        onClose={handleTeaDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          Add a Tea
          <IconButton
            aria-label="close"
            onClick={handleTeaDialogClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
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
                      sx={{ fontSize: "18px" }}
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
        <DialogActions>
          <Button onClick={handleTeaDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleTeaDialogClose} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog> */}
      {/* <Dialog
        open={isCoffeeDialogOpen}
        onClose={handleCoffeeDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          Add a Coffee
          <IconButton
            aria-label="close"
            onClick={handleCoffeeDialogClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
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
                  }}
                >
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
                      variant="body1"
                      color="textPrimary"
                      align="center"
                      sx={{ fontSize: "18px" }}
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
        <DialogActions>
          <Button onClick={handleCoffeeDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCoffeeDialogClose} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog> */}
    </Box>
  );
};

export default MenuPage;
