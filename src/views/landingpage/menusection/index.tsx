"use client";

import React from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { useAuthContext, useMenuContext } from "@/context";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { Kulcha } from "@/context";
import Image from "next/image";

const menuItems = [
  {
    name: "Mix Kulcha",
    image: "/images/landingpage/menu1.png",
    desc: "Crisp Indian bread filled with potato, cauliflower, peas, onion, corn, coriander, carrot, ginger, green chilli and beetroot, delivering a savoury taste.",
    price: 9.99,
  },
  {
    name: "Aloo Kulcha",
    image: "/images/landingpage/menu2.png",
    desc: "A tender, golden leavened bread stuffed with potato and onion, cooked in a tandoor and served with chana.",
    price: 9.99,
  },
  {
    name: "Onion Kulcha",
    image: "/images/landingpage/menu3.png",
    desc: "A warm, flavorful Indian bread stuffed with onion, and topped with rich masala, giving a satisfying taste.",
    price: 9.99,
  },
  {
    name: "Gobi Kulcha",
    image: "/images/landingpage/Gobikulcha.png",
    desc: "Flavorful Indian bread with gobi and onion, elegantly topped with herbs for a balanced flavour.",
    price: 9.99,
  },
  {
    name: "Paneer Kulcha",
    image: "/images/landingpage/Paneerkulcha.png",
    desc: "A crafted Indian bread stuffed with paneer, potato, and onion, delivering a delightful and flavorful experience.",
    price: 12.99,
  },
  {
    name: "Hot & Spicy Mix Kulcha",
    image: "/images/landingpage/menu6.png",
    desc: "A golden and flaky Indian bread filled with potato, cauliflower, onion, carrot, ginger, beetroot, corn, coriander, peas, and green chilli, having a tempting taste.",
    price: 9.99,
  },
];

const MenuSection = () => {
  const { user, isLoggedIn } = useAuthContext();
  const { setIncludedItems1, includedItems1, setSelectedKulchas } = useMenuContext();
  const router = useRouter();

  const handleAddItem = (
    itemName: string,
    desc: string,
    image: string,
    price: number
  ) => {
    const newKulcha: Kulcha = { name: itemName, desc, image, price };

    setSelectedKulchas((prevKulchas: Kulcha[]): Kulcha[] => [...prevKulchas, newKulcha]);
  };

  return (
    <Box
      sx={{
        padding: 4,
        backgroundColor: "#FFF8E1",
        position: "relative",
        paddingTop: 12,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 14,
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Typography
            variant="h4"
            component="h2"
            sx={{
              color: "#333333",
              fontWeight: "bold",
            }}
          >
            OUR MENU
          </Typography>
        </Box>
      </Box>

      <Container sx={{ marginTop: 5, textAlign: "center" }}>
        <Grid container spacing={7}>
          {menuItems.map((item, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={index}
              sx={{ paddingLeft: 2, paddingRight: 2, marginBottom: 6 }}
            >
              <Card
                sx={{
                  maxWidth: 345,
                  height: "100%",
                  margin: "0 auto",
                  borderRadius: "20px",
                  overflow: "visible",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  position: "relative",
                  paddingTop: "80px",
                  paddingBottom: "10px",
                }}
              >
                <Box
                  sx={{
                    borderRadius: "50%",
                    width: "220px",
                    height: "220px",
                    position: "absolute",
                    top: "-74px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                    overflow: "hidden",
                  }}
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={220}
                    height={300}
                    objectFit="contain"
                    style={{
                      height:"100%",
                      width:"100%"
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    position: "absolute",
                    top: "-50px",
                    left: "30px",
                    backgroundColor: "#c33d32",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    color: "#FFF",
                    fontWeight: "bold",
                  }}
                >
                  PRICE ${item.price.toFixed(2)}
                </Box>
                <CardContent
                  sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    marginTop: "80px",
                  }}
                >
                  <Typography
                    gutterBottom
                    variant="h6"
                    component="div"
                    sx={{
                      textAlign: "center",
                      fontWeight: 600,
                      fontSize: "1.2rem",
                      minHeight: "40px",
                    }}
                  >
                    {item.name}
                  </Typography>
                  <Box
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: "0.9rem" }}
                    >
                      {item.desc}
                    </Typography>
                  </Box>
                </CardContent>
                <Box
                  sx={{
                    padding: 2,
                    width: "100%",
                    textAlign: "center",
                    marginTop: "auto",
                  }}
                >
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#ECAB21",
                      color: "white",
                      borderRadius: 20,
                      paddingX: 4,
                      paddingY: 1,
                      fontWeight: "bold",
                      "&:hover": {
                        backgroundColor: "#FFC107",
                        color: "white",
                      },
                    }}
                    onClick={() => {
                      if (!isLoggedIn) return router.push("/login");

                      handleAddItem(item.name, item.desc, item.image, item.price);
                      router.push("/cart");
                    }}
                  >
                    Order Now
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default MenuSection;
