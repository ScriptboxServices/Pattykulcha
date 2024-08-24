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
import { gsap } from "gsap";

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
      "These kulchas are amazing—crispy on the outside, soft inside, and packed with flavor. Their creamy lassi is also a perfect match for the meal. If you’re after authentic taste, these are worth trying. They remind me of traditional flavors from back home, and the attention to detail is clear in every bite.",
    author: "Harpreet Kaur",
    rating: 4,
    avatarUrl: "/images/avatars/1.png",
    date: "2024-08-18",
  },
  {
    id: 2,
    content:
      "The delivery was super fast and the food arrived fresh and warm. The paneer kulcha was generously filled and full of flavor. I added a cold coffee, and it really was a hit. Do try these out! I’m thoroughly impressed with both the quality of the food and the service.",
    author: "Liam Anderson",
    rating: 5,
    avatarUrl: "/images/avatars/2.png",
    date: "2024-08-15",
  },
  {
    id: 3,
    content:
      "Great taste, authentic flavors, at such a reasonable price. These kulchas are a must-try! It’s rare to find such good quality and consistency, especially when ordering for delivery. I’ll definitely be recommending this to friends and family.",
    author: "Rajesh Desai",
    rating: 5,
    avatarUrl: "/images/avatars/3.png",
    date: "2024-08-18",
  },
  {
    id: 4,
    content:
      "The kulchas here are just like the ones I tasted back home—generously stuffed, perfectly spiced, and full of authentic flavor. The chutney is tangy and the drinks are a refreshing treat. It's a must-try for anyone craving a genuine taste of Indian street food.",
    author: "Kunal Singh",
    rating: 4,
    avatarUrl: "/images/avatars/4.png",
    date: "2024-08-17",
  },
  {
    id: 5,
    content:
      "I am impressed with the quick delivery! The kulcha was still warm, with just the right crunch and spice. Great service and delicious food—The kulchas are worth trying! It’s become my go-to comfort food whenever I want something both tasty and filling.",
    author: "Chris Lee",
    rating: 4,
    avatarUrl: "/images/avatars/5.png",
    date: "2024-08-21",
  },
  {
    id: 6,
    content:
      "PattyKulcha has got wonderful kulchas in Canada! I paired their crispy kulchas with hot chai, it was a true comfort food! The quality is consistent, and the flavors never disappoint. Perfect for those rainy evenings when all you want is something warm and hearty.",
    author: "Emma Turner",
    rating: 5,
    avatarUrl: "/images/avatars/6.png",
    date: "2024-08-16",
  },
  {
    id: 7,
    content:
      "I tried the paneer kulcha, and the stuffed paneer was soft and well-seasoned. I also got the masala chai, which had that perfect homemade taste. Together, it was a perfect meal for the day. If you’re looking for authentic, homestyle food, this is the place.",
    author: "Riya Sethi",
    rating: 4,
    avatarUrl: "/images/avatars/7.png",
    date: "2024-08-17",
  },
  {
    id: 8,
    content:
      "The kulchas are always crispy and generously stuffed. My favorite is the gobi kulcha paired with an iced coffee. Great food, great service—highly recommended! The flavors are balanced, and the quality is consistent across different orders.",
    author: "Anjali Kapoor",
    rating: 5,
    avatarUrl: "/images/avatars/8.png",
    date: "2024-08-20",
  },
  {
    id: 9,
    content:
      "My recent order was the aloo kulcha, and it was packed with flavor. The lassi I got was sweet and refreshing, a perfect pairing with the spicy kulcha. Delivery is always prompt. It’s a great option for those quick lunches when you crave something filling but tasty.",
    author: "Sana Ali",
    rating: 5,
    avatarUrl: "/images/avatars/1.png",
    date: "2024-08-21",
  },
  {
    id: 10,
    content:
      "The mix kulcha is one of my favorites—well-spiced stuffing and consistently perfect baking. Amazing quality and taste! The chutney adds just the right kick, and the kulchas have that homemade feel that’s hard to find elsewhere.",
    author: "Daniel Miller",
    rating: 4,
    avatarUrl: "/images/avatars/2.png",
    date: "2024-08-19",
  },
  {
    id: 11,
    content:
      "The kulchas are well-prepared, with a great balance of flavors. I especially enjoyed the paneer stuffing with the chai. Highly recommended for quick delivery and delicious meals. It’s the kind of food that leaves you satisfied without feeling overly heavy.",
    author: "Priya Sharma",
    rating: 4,
    avatarUrl: "/images/avatars/3.png",
    date: "2024-08-14",
  },
  {
    id: 12,
    content:
      "I ordered for a family get-together and everyone loved it. The gobi kulcha was a hit, and the sweet lassi was the perfect complement. Will order again! The food arrived fresh and warm, making it an instant favorite for all of us.",
    author: "David Brown",
    rating: 5,
    avatarUrl: "/images/avatars/4.png",
    date: "2024-08-13",
  },
  {
    id: 13,
    content:
      "Authentic flavors that remind me of home. The chutneys were spot on, and the kulchas had just the right texture. A must-try if you crave Indian street food. It’s the perfect blend of nostalgia and quality—highly recommend!",
    author: "Sneha Patel",
    rating: 5,
    avatarUrl: "/images/avatars/5.png",
    date: "2024-08-12",
  },
  {
    id: 14,
    content:
      "Consistent quality with every order. My go-to is the mix kulcha, and it never disappoints. The stuffing is flavorful, and the service is excellent. Whether you’re ordering for a quick meal or for a group, it’s always reliable.",
    author: "Amit Singh",
    rating: 4,
    avatarUrl: "/images/avatars/6.png",
    date: "2024-08-11",
  },
  {
    id: 15,
    content:
      "Quick delivery and delicious kulchas! I particularly enjoyed the paneer kulcha with a side of lassi. A great option for comfort food at home. The flavors are rich and the portion sizes are generous, making it a perfect meal option.",
    author: "Laura Johnson",
    rating: 4,
    avatarUrl: "/images/avatars/7.png",
    date: "2024-08-10",
  },
  {
    id: 16,
    content:
      "If you're looking for a taste of authentic kulchas, this is the place. The flavors are rich, and the portions are generous. Highly recommend the gobi kulcha! It’s a perfect example of how simple ingredients can be turned into something delicious.",
    author: "Ravi Verma",
    rating: 5,
    avatarUrl: "/images/avatars/8.png",
    date: "2024-08-09",
  },
  {
    id: 17,
    content:
      "The kulchas are flavorful and filling, with just the right amount of spice. The delivery was prompt, and the food was still hot when it arrived. It’s the ideal comfort food, especially when you’re looking for something quick but satisfying.",
    author: "Jessica Lee",
    rating: 5,
    avatarUrl: "/images/avatars/1.png",
    date: "2024-08-08",
  },
  {
    id: 18,
    content:
      "Loved the taste and the freshness of the kulchas. The cold coffee I ordered was the perfect drink to go along with it. Definitely coming back for more. It’s rare to find such a well-balanced meal that’s both tasty and convenient.",
    author: "Aditya Kumar",
    rating: 5,
    avatarUrl: "/images/avatars/2.png",
    date: "2024-08-07",
  },
  {
    id: 19,
    content:
      "The combination of crispy kulchas and sweet lassi is unbeatable. Perfect for a light but filling meal. The service was top-notch, too! I’ll definitely be ordering from here again for those easy weekday meals.",
    author: "Sarah Wilson",
    rating: 4,
    avatarUrl: "/images/avatars/3.png",
    date: "2024-08-06",
  },
  {
    id: 20,
    content:
      "Tried the aloo kulcha and was very impressed. The stuffing was well-seasoned, and the chutney was flavorful. Great value for money. It’s perfect for those times when you want something delicious without breaking the bank.",
    author: "Michael Davis",
    rating: 4,
    avatarUrl: "/images/avatars/4.png",
    date: "2024-08-05",
  },
];

const ReviewSlider = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [index, setIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const leftReviewRef = useRef<HTMLDivElement | null>(null);
  const rightReviewRef = useRef<HTMLDivElement | null>(null);
  const [expandedReview, setExpandedReview] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      animateReviews();
      setTimeout(() => {
        setIndex((prevIndex) => (prevIndex + 1) % reviews.length);
      }, 1500);
    }, 5000);

    return () => clearInterval(interval);
  }, [isMobile, reviews.length]);

  const animateReviews = () => {
    if (leftReviewRef.current && rightReviewRef.current) {
      const tl = gsap.timeline();
      tl.to(leftReviewRef.current, {
        x: isMobile ? "-100%" : "-350px",
        opacity: 0,
        duration: 1.2,
        ease: "power2.inOut",
      });
      tl.fromTo(
        rightReviewRef.current,
        { x: isMobile ? "100%" : "350px", opacity: 0 },
        { x: "0%", opacity: 1, duration: 1.2, ease: "power2.inOut" },
        "-=0.5"
      );
    }
  };

  const displayedReviews = isMobile
    ? [reviews[index]]
    : [
        reviews[index],
        reviews[(index + 1) % reviews.length],
        reviews[(index + 2) % reviews.length],
      ];

  const toggleExpand = (reviewId: number) => {
    setExpandedReview(expandedReview === reviewId ? null : reviewId);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        marginTop: 3,
        minWidth: "100%",
        position: "relative",
        overflow: "hidden",
        height: isMobile ? "auto" : "auto",
        paddingRight: 2,
        paddingBottom: 6,
      }}
    >
      <div
        ref={containerRef}
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "16px",
          flexDirection: isMobile ? "column" : "row",
        }}
      >
        {displayedReviews.map((review, idx) => (
          <Card
            key={review.id}
            ref={idx === 0 ? leftReviewRef : idx === 2 ? rightReviewRef : undefined}
            sx={{
              width: isMobile ? "100%" : 350,
              maxHeight: expandedReview === review.id ? 350 : 270,
              borderRadius: "16px",
              padding: 2,
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              transition: "max-height 0.3s ease-in-out",
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
                  overflow: expandedReview === review.id ? "visible" : "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: expandedReview === review.id ? "none" : 3,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {review.content}
              </Typography>
              <Button
                size="small"
                onClick={() => toggleExpand(review.id)}
                sx={{ textTransform: "none" }}
              >
                {expandedReview === review.id ? "Show Less" : "Show More"}
              </Button>
            </CardContent>
            <Box sx={{ paddingBottom: 4,marginBottom:3 }}>
              <Rating value={review.rating} readOnly size="small" />
            </Box>
          </Card>
        ))}
      </div>
    </Box>
  );
};

export default ReviewSlider;