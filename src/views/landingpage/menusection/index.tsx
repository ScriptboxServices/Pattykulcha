"use client"

import React from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
} from "@mui/material";

import { useMenuContext } from "@/context";
import { useRouter } from "next/navigation";
import { drinkOptions, lassiOptions } from "@/views/cart";

import { v4 as uuidv4 } from "uuid";

const menuItems = [
  {
    name: "Mix Kulcha",
    image: "/images/landingpage/menu1.png",
    desc: "Crisp Indian bread filled with potato, cauliflower, peas, onion, corn, coriander, carrot, ginger, green chilli and beetroot, delivering a savoury taste.",
  },
  {
    name: "Aloo Kulcha",
    image: "/images/landingpage/menu2.png",
    desc: "A tender, golden leavened bread stuffed with potato and onion, cooked in a tandoor and served with chana.",
  },
  {
    name: "Onion Kulcha",
    image: "/images/landingpage/menu3.png",
    desc: "A warm, flavorful Indian bread stuffed with onion, and topped with rich masala, giving a satisfying taste.",
  },
  {
    name: "Gobi Kulcha",
    image: "/images/landingpage/image5.jpg",
    desc: "Flavorful Indian bread with gobi and onion, elegantly topped with herbs for a balanced flavour.",
  },
  {
    name: "Paneer Kulcha",
    image: "/images/landingpage/menu5.png",
    desc: "A crafted Indian bread stuffed with paneer, potato, and onion, delivering a delightful and flavorful experience.",
  },
  {
    name: "Hot & Spicy Mix Kulcha",
    image: "/images/landingpage/menu6.png",
    desc: "A golden and flaky Indian bread filled with potato, cauliflower, onion, carrot, ginger, beetroot, corn, coriander, peas, and green chilli, having a tempting taste.",
  },
];

interface IncludedItem {
  id: string;
  items: { name: string; price: number }[];
}


const MenuSection = () => {
  const {  setIncludedItems ,includedItems} = useMenuContext();

  const router=useRouter();

  const handleAddItem = (itemName: string) => {
    const itemId = uuidv4();

    // Determine the price for the item
    const drink = drinkOptions.find((drink) => drink.name == itemName);
    const lassi = lassiOptions.find((lassi) => lassi.name == itemName);

    const price =
      drink?.price ||
      lassi?.price ||
      (itemName == "Chana"
        ? 3.0
        : itemName == "Impli Pyaz Chutney"
        ? 2.0
        : itemName == "Amul Butter"
        ? 1.1
        : itemName == "Normal Butter"
        ? 0.75
        : 3); // Default price if item is not in the above lists

    const newItem= {
      id: itemId,
      items: [{ name: itemName, price }],
    };

    if (
      !includedItems.some((includedItem) =>
        includedItem.items.some((item) => item.name == itemName)
      )
    ) {
      setIncludedItems([...includedItems, newItem]);
    }
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
          justifyContent: "center", // Center the title
          alignItems: "center",
          marginBottom: 14, // Increase margin below the title for spacing
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Typography
            variant="h4"
            component="h2"
            sx={{
              color: "#333333", // Adjust the color to match your site design
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
              sx={{ paddingLeft: 2, paddingRight: 2, marginBottom: 6 }} // Added marginBottom
            >
              <Card
                sx={{
                  maxWidth: 345,
                  height: "100%",
                  margin: "0 auto",
                  borderRadius: "20px", // Rounded corners for the card
                  overflow: "visible", // Make sure overflow is visible to show the image
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Light shadow effect
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between", // Ensure that the content is spaced evenly
                  position: "relative", // Required for positioning the image
                  paddingTop: "80px", // Add space at the top for the image
                  paddingBottom: "10px", // Add padding at the bottom of the card
                }}
              >
                <CardMedia
                  component="img"
                  image={item.image}
                  alt={item.name}
                  sx={{
                    borderRadius: "50%", // Make the image circular
                    width: "220px", // Set the width of the image
                    height: "220px", // Set the height of the image
                    position: "absolute", // Position the image absolutely
                    top: "-74px", // Adjust to move the image to the visible area
                    left: "50%", // Center the image horizontally
                    transform: "translateX(-50%)", // Adjust the centering
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Add shadow to the image
                  }}
                />
                <CardContent
                  sx={{
                    flexGrow: 1, // Allow the content to grow to fill available space
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    marginTop: "80px", // Add space below the image for the content
                  }}
                >
                  <Typography
                    gutterBottom
                    variant="h6"
                    component="div"
                    sx={{
                      textAlign: "center",
                      fontWeight: 600,
                      fontSize: "1.2rem", // Larger font for the dish name
                      minHeight: "40px", // Set a minimum height for the title to ensure uniformity
                    }}
                  >
                    {item.name}
                  </Typography>
                  <Box
                    sx={{
                      flexGrow: 1, // Allow the description box to take up remaining space
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
                      handleAddItem(item.name)
                      router.push("/cart")
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
