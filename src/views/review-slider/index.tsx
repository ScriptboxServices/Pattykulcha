import {
  Box,
  Typography,
  Avatar,
  useTheme,
  Card,
  CardContent,
  Rating,
  useMediaQuery,
  Button,
} from "@mui/material";
import { useState, useEffect, useRef } from "react";

type Review = {
  id: number;
  content: string;
  author: string;
  rating: number;
  avatarUrl: string;
  date: string;
};
const reviews: Review[] = [
  {
    id: 1,
    content:
      "These kulchas are amazing—crispy on the outside, soft inside, and packed with flavor. The creamy lassi is also a perfect match. Authentic taste worth trying!",
    author: "Harpreet Kaur",
    rating: 4,
    avatarUrl: "/images/avatars/1.png",
    date: "2024-08-18",
  },
  {
    id: 2,
    content:
      "Super fast delivery, fresh and warm. The paneer kulcha was generously filled and flavorful. Added a cold coffee, and it was a hit. Highly recommend!",
    author: "Liam Anderson",
    rating: 5,
    avatarUrl: "/images/avatars/2.png",
    date: "2024-08-15",
  },
  {
    id: 3,
    content:
      "Great taste and authentic flavors at a reasonable price. These kulchas are a must-try! Consistent quality, especially for delivery. Definitely recommend.",
    author: "Rajesh Desai",
    rating: 5,
    avatarUrl: "/images/avatars/3.png",
    date: "2024-08-18",
  },
  {
    id: 4,
    content:
      "Kulchas just like back home—stuffed, spiced, and full of flavor. Tangy chutney and refreshing drinks. A must-try for those craving authentic Indian street food.",
    author: "Kunal Singh",
    rating: 4,
    avatarUrl: "/images/avatars/4.png",
    date: "2024-08-17",
  },
  {
    id: 5,
    content:
      "Quick delivery! The kulcha was warm, crunchy, and flavorful. Great service and delicious food. It’s now my go-to comfort food for a filling, tasty meal.",
    author: "Chris Lee",
    rating: 4,
    avatarUrl: "/images/avatars/5.png",
    date: "2024-08-21",
  },
  {
    id: 6,
    content:
      "Wonderful kulchas! Paired with hot chai, it’s true comfort food. Consistent quality and flavors that never disappoint. Perfect for a cozy evening.",
    author: "Emma Turner",
    rating: 5,
    avatarUrl: "/images/avatars/6.png",
    date: "2024-08-16",
  },
  {
    id: 7,
    content:
      "Tried the paneer kulcha and masala chai. Perfect homestyle meal. Authentic and satisfying. If you’re after real, homestyle food, this is the place.",
    author: "Riya Sethi",
    rating: 4,
    avatarUrl: "/images/avatars/7.png",
    date: "2024-08-17",
  },
  {
    id: 8,
    content:
      "Crispy kulchas, generously stuffed. My favorite is the gobi kulcha with iced coffee. Great food and service—highly recommended!",
    author: "Anjali Kapoor",
    rating: 5,
    avatarUrl: "/images/avatars/8.png",
    date: "2024-08-20",
  },
  {
    id: 9,
    content:
      "Ordered aloo kulcha, packed with flavor. Sweet lassi was the perfect pairing. Prompt delivery and perfect for a quick, tasty lunch.",
    author: "Sana Ali",
    rating: 5,
    avatarUrl: "/images/avatars/1.png",
    date: "2024-08-21",
  },
  {
    id: 10,
    content:
      "Mix kulcha is a favorite—well-spiced and perfectly baked. Great quality and taste with a kick from the chutney. Feels homemade.",
    author: "Daniel Miller",
    rating: 4,
    avatarUrl: "/images/avatars/2.png",
    date: "2024-08-19",
  },
  {
    id: 11,
    content:
      "Well-prepared kulchas with balanced flavors. Enjoyed the paneer stuffing with chai. Highly recommended for quick, delicious meals.",
    author: "Priya Sharma",
    rating: 4,
    avatarUrl: "/images/avatars/3.png",
    date: "2024-08-14",
  },
  {
    id: 12,
    content:
      "Ordered for a family gathering and everyone loved it. The gobi kulcha and sweet lassi were hits. Fresh, warm, and an instant favorite.",
    author: "David Brown",
    rating: 5,
    avatarUrl: "/images/avatars/4.png",
    date: "2024-08-13",
  },
  {
    id: 13,
    content:
      "Authentic flavors that remind me of home. Spot-on chutneys and perfect texture. A must-try if you crave Indian street food.",
    author: "Sneha Patel",
    rating: 5,
    avatarUrl: "/images/avatars/5.png",
    date: "2024-08-12",
  },
  {
    id: 14,
    content:
      "Consistent quality in every order. Mix kulcha is my go-to. Flavorful stuffing and reliable service. Perfect for quick meals or groups.",
    author: "Amit Singh",
    rating: 4,
    avatarUrl: "/images/avatars/6.png",
    date: "2024-08-11",
  },
  {
    id: 15,
    content:
      "Quick delivery and delicious kulchas. Loved the paneer kulcha with lassi. Rich flavors and generous portions. Great comfort food.",
    author: "Laura Johnson",
    rating: 4,
    avatarUrl: "/images/avatars/7.png",
    date: "2024-08-10",
  },
  {
    id: 16,
    content:
      "If you’re after authentic kulchas, this is the place. Rich flavors and generous portions. Highly recommend the gobi kulcha!",
    author: "Ravi Verma",
    rating: 5,
    avatarUrl: "/images/avatars/8.png",
    date: "2024-08-09",
  },
  {
    id: 17,
    content:
      "Flavorful kulchas with just the right spice. Prompt delivery and the food was still hot. Ideal comfort food for a quick, satisfying meal.",
    author: "Jessica Lee",
    rating: 5,
    avatarUrl: "/images/avatars/1.png",
    date: "2024-08-08",
  },
  {
    id: 18,
    content:
      "Loved the taste and freshness. The cold coffee was the perfect match. Well-balanced and convenient. Definitely ordering again.",
    author: "Aditya Kumar",
    rating: 5,
    avatarUrl: "/images/avatars/2.png",
    date: "2024-08-07",
  },
  {
    id: 19,
    content:
      "Crispy kulchas and sweet lassi—perfect combo. Great for a light meal. Service was excellent. Definitely ordering again!",
    author: "Sarah Wilson",
    rating: 4,
    avatarUrl: "/images/avatars/3.png",
    date: "2024-08-06",
  },
  {
    id: 20,
    content:
      "Tried the aloo kulcha and was impressed. Well-seasoned stuffing and flavorful chutney. Great value and perfect for a delicious meal.",
    author: "Michael Davis",
    rating: 4,
    avatarUrl: "/images/avatars/4.png",
    date: "2024-08-05",
  },
];

const ReviewSlider = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const duplicatedReviews = [...reviews, ...reviews]; // Duplicate reviews for seamless scrolling

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        marginTop: 3,
        position: "relative",
        overflow: "hidden",
        height: "auto",
        paddingBottom: 6,
      }}
    >
      <Box
        className="review-container" // Target this class for animation control
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: isMobile ? "column" : "row",
          animation: `scrolling 120s linear infinite`,
          "&:hover": {
            animationPlayState: "paused", // Pauses the animation on hover
          },
        }}
      >
        {duplicatedReviews.map((review, idx) => (
          <Card
            key={idx}
            sx={{
              width: isMobile ? "100%" : 350,
              maxHeight: 270,
              borderRadius: "16px",
              padding: 2,
              marginRight: isMobile ? 0 : "16px",
              marginBottom: isMobile ? "16px" : 0,
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
              flexDirection: "column",
              justifyContent: "space-between",
              overflow: "hidden",
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
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  overflowWrap: "break-word",
                  whiteSpace: "normal",
                }}
              >
                {review.content}
              </Typography>
            </CardContent>
            <Box sx={{ paddingBottom: 4, marginBottom: 3 }}>
              <Rating value={review.rating} readOnly size="small" />
            </Box>
          </Card>
        ))}
      </Box>

      <style jsx global>{`
        @keyframes scrolling {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </Box>
  );
};



export default ReviewSlider;
