"use client";

import React, { useEffect } from "react";
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
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux-store";
import ReviewSlider from "@/views/review-slider";
import { encrypt } from "@/utils/commonFunctions";

type MenuCategoryKey = "Kulcha" | "Lassi" | "Tea" | "Coffee" | "Soft Drinks";

interface MenuCategory {
  icon: string;
  label: MenuCategoryKey;
}

interface MenuItem {
  name: string;
  desc: string;
  image: string;
  price: number;
  quantity: number;
}

const MenuSection = () => {
  const { user, isLoggedIn } = useAuthContext();
  const {
    setIncludedItems2,
    includedItems1,
    setSelectedKulchas,
    setKulcha,
    kulcha,
  } = useMenuContext();
  const router = useRouter();
  const dispatch = useDispatch();

  const activeCategory = useSelector(
    (state: RootState) => state.menu.activeCategory as MenuCategoryKey
  );
  const menuItems = useSelector(
    (state: RootState) => state.menu.items[activeCategory]
  ) as MenuItem[];

  const menuCategories: MenuCategory[] = [
    { icon: "👍", label: "Kulcha" },
    { icon: "⭐", label: "Lassi" },
    { icon: "🍵", label: "Tea" },
    { icon: "☕", label: "Coffee" },
    { icon: "🥤", label: "Soft Drinks" },
  ];

  const handleAddItem = (
    itemName: string,
    desc: string,
    image: string,
    price: number,
    quantity: number
  ) => {
    const newKulcha = { name: itemName, desc, image, price, quantity };
    setKulcha(newKulcha);
    localStorage.setItem("kulcha", JSON.stringify(newKulcha));
    setSelectedKulchas((prevKulchas: MenuItem[]) => [
      ...prevKulchas,
      newKulcha,
    ]);
  };

  useEffect(() => {
    localStorage.removeItem("includedItems2");
    setIncludedItems2([]);
  }, []);

  const isOrderableCategory = (categoryLabel: string) => {
    // Only show "Order Now" for categories other than Lassi, Tea, Coffee, and Soft Drinks
    return !["Lassi", "Tea", "Coffee", "Soft Drinks"].includes(categoryLabel);
  };

  return (
    <Box
      sx={{
        paddingLeft: { xs: 1.5, sm: 3, md: 4, lg: 4 },
        backgroundColor: "#FFF8E1",
        position: "relative",
        paddingTop: 10,
      }}
    >
      <Box sx={{ textAlign: "center" }}>
        <Typography
          variant="h3"
          component="h2"
          sx={{ color: "#333333", fontWeight: "bold" }}
        >
          OUR MENU
        </Typography>
      </Box>

      <Container sx={{ marginTop: 12, textAlign: "center" }}>
        <Grid container spacing={7}>
          {menuItems?.map((item, index) => (
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
                  maxWidth: { xs: "100%", sm: 345, md: 345 },
                  height: "100%",
                  margin: "0 auto",
                  borderRadius: "20px",
                  overflow: "visible",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  position: "relative",
                  paddingTop: "80px",
                  paddingBottom: "10px",
                  transition: "transform 0.3s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.358)",
                  },
                }}
              >
                {/* {(index == 0 || index == menuItems.length - 1) && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: "-30px",
                      right: "-30px",
                      width: "100px", 
                      height: "100px", 
                      backgroundImage: 'url(/images/landingpage/dis.png)',
                      backgroundSize: "contain",
                      backgroundRepeat: "no-repeat",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontWeight: "bold",
                      color: "#fff",
                    }}
                  ></Box>
                )} */}

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
                    src={"https://firebasestorage.googleapis.com/v0/b/pattykulcha.appspot.com/o/images%2F5.jpg?alt=media&token=27fded59-049a-4d7f-b8d4-918ca647ac4b"}
                    alt={item.name}
                    width={220}
                    height={300}
                    objectFit="contain"
                    style={{ height: "100%", width: "100%" }}
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
                  <Box sx={{ flexGrow: 1, display: "flex" }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: "0.9rem" }}
                    >
                      {item.desc}
                    </Typography>
                  </Box>
                </CardContent>
                {isOrderableCategory(activeCategory) && (
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

                        handleAddItem(
                          item.name,
                          item.desc,
                          item.image,
                          item.price,
                          item.quantity
                        );
                        router.push(`/cart/${encodeURIComponent(
                          encrypt({ kulcha_name: item.name })
                        )}`);
                      }}
                    >
                      Order Now
                    </Button>
                  </Box>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
        <Typography
          variant="h3"
          component="h2"
          sx={{ color: "#333333", fontWeight: "bold" }}
        >
          Customer&apos;s review
        </Typography>
        <ReviewSlider/>
      </Container>
    </Box>
  );
};

export default MenuSection;
