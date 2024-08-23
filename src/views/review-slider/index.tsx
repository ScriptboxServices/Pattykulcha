import {
  Box,
  Typography,
  Avatar,
  useTheme,
  Card,
  CardContent,
  Rating,
  useMediaQuery,
} from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";

type Review = {
  id: number;
  content: string;
  author: string;
  rating: number;
  avatarUrl: string;
  date:string;
};

const reviews: Review[] = [
  {
    id: 1,
    content:
      "These kulchas are amazing—crispy on the outside, soft inside, and packed with flavor. Their creamy lassi is also a perfect match for the meal. If you’re after authentic taste, these are worth trying",
    author: "Harpreet Kaur",
    rating: 4,
    avatarUrl: "/images/avatars/1.png",
    date: "2024-08-18",
  },
  {
    id: 2,
    content:
      "The delivery was super fast and the food arrived fresh warm,. The paneer kulcha was generously filled and full of flavor. I added a cold coffee, and it really was a hit. Do try these out!",
    author: "Liam Anderson",
    rating: 5,
    avatarUrl: "/images/avatars/2.png",
    date: "2024-08-15",
  },
  {
    id: 3,
    content:
      "Great taste, authentic flavors, at such a reasonable price. These kulchas are a must-try!",
    author: "Rajesh Desai",
    rating: 5,
    avatarUrl: "/images/avatars/3.png",
    date: "2024-08-18",
  },
  {
    id: 4,
    content:
      "The kulchas here are just like the ones I tasted back home —generously stuffed, perfectly spiced, and full of authentic flavor. The chutney is tangy and the drinks are a refreshing treat. ",
    author: "Kunal Singh",
    rating: 4,
    avatarUrl: "/images/avatars/4.png",
    date: "2024-08-17",
  },
  {
    id: 5,
    content:
      "I am impressed with the quick delivery! The kulcha was still warm, with just the right crunch and spice.. Great service and delicious food—The kulchas are worth trying!",
    author: "Chris Lee",
    rating: 4,
    avatarUrl: "/images/avatars/5.png",
    date: "2024-08-21",
  },
  {
    id: 6,
    content:
      "PattyKulcha has got wonderful kulchas in Canada! I paired their crispy kulchas with hot chai, it was a true comfort food!",
    author: "Emma Turner",
    rating: 5,
    avatarUrl: "/images/avatars/6.png",
    date: "2024-08-16",
  },
  {
    id: 7,
    content:
      "I tried the paneer kulcha, and the stuffed paneer was soft and well-seasoned. I also got the masala chai, which had that perfect homemade taste. Together, it was a perfect meal for the day.",
    author: "Riya Sethi",
    rating: 4,
    avatarUrl: "/images/avatars/7.png",
    date: "2024-08-17",
  },
  {
    id: 8,
    content:
      "The kulchas are always crispy and generously stuffed. My favorite is the gobi kulcha paired with an iced coffee. Great food, great service—highly recommended!",
    author: "Anjali Kapoor",
    rating: 5,
    avatarUrl: "/images/avatars/8.png",
    date: "2024-08-20",
  },
  {
    id: 9,
    content:
      "My recent order was the aloo kulcha, and it was packed with flavor. The lassi I got was sweet and refreshing, a perfect pairing with the spicy kulcha. Delivery is always prompt.",
    author: "Sana Ali",
    rating: 5,
    avatarUrl: "/images/avatars/1.png",
    date: "2024-08-21",
  },
  {
    id: 10,
    content:
      "The mix kulcha is one of my favorites—well-spiced stuffing and consistently perfect baking. Amazing quality and taste!",
    author: "Daniel Miller",
    rating: 4,
    avatarUrl: "/images/avatars/2.png",
    date: "2024-08-19",
  },
];

const ReviewSlider = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Detect mobile screens
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(
        (prevIndex) => (prevIndex + (isMobile ? 1 : 3)) % reviews.length
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [isMobile, reviews.length]);

  const variants = {
    enter: { opacity: 0, x: 50 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  const displayedReviews = isMobile
    ? [reviews[index]]
    : [
        reviews[index],
        reviews[(index + 1) % reviews.length],
        reviews[(index + 2) % reviews.length],
      ];

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        marginTop: 3,
        minWidth: "100%",
        position: "relative",
        overflow: "hidden",
        height: isMobile ? "auto" : "320px", // Adjust height based on screen size
      }}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={index}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "16px",
            flexDirection: isMobile ? "column" : "row", // Stack cards vertically on mobile
          }}
        >
          {displayedReviews.map((review) => (
            <Card
              key={review.id}
              sx={{
                width: isMobile ? "100%" : 350,
                height: isMobile ? 300 : 240, // Fixed height to maintain consistency
                borderRadius: "16px",
                padding: 2,
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 2,
                    justifyContent: "space-around",
                  }}
                >
                  <Avatar
                    src={review.avatarUrl}
                    alt={review.author}
                    sx={{ width: 60, height: 60, marginRight: 2 }}
                  />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {review.author}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {review.date}
                    </Typography>
                  </Box>
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    marginBottom: 2,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {review.content}
                </Typography>
              </CardContent>
              <Box sx={{ paddingBottom: 2 }}>
                <Rating value={review.rating} readOnly size="small" />
              </Box>
            </Card>
          ))}
        </motion.div>
      </AnimatePresence>
    </Box>
  );
};

export default ReviewSlider;
