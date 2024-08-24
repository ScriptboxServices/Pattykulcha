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
      "These kulchas are amazing—crispy on the outside, soft inside, and packed with flavor. Their creamy lassi is also a perfect match for the meal. If you’re after authentic taste, these are worth trying",
    author: "Harpreet Kaur",
    rating: 4,
    avatarUrl: "/images/avatars/1.png",
    date: "2024-08-18",
  },
  {
    id: 2,
    content:
      "The delivery was super fast and the food arrived fresh and warm. The paneer kulcha was generously filled and full of flavor. I added a cold coffee, and it really was a hit. Do try these out!",
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
      "The kulchas here are just like the ones I tasted back home —generously stuffed, perfectly spiced, and full of authentic flavor. The chutney is tangy and the drinks are a refreshing treat.",
    author: "Kunal Singh",
    rating: 4,
    avatarUrl: "/images/avatars/4.png",
    date: "2024-08-17",
  },
  {
    id: 5,
    content:
      "I am impressed with the quick delivery! The kulcha was still warm, with just the right crunch and spice. Great service and delicious food—The kulchas are worth trying!",
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
  {
    id: 11,
    content:
      "The kulchas are well-prepared, with a great balance of flavors. I especially enjoyed the paneer stuffing with the chai. Highly recommended for quick delivery and delicious meals.",
    author: "Priya Sharma",
    rating: 4,
    avatarUrl: "/images/avatars/3.png",
    date: "2024-08-14",
  },
  {
    id: 12,
    content:
      "I ordered for a family get-together and everyone loved it. The gobi kulcha was a hit, and the sweet lassi was the perfect complement. Will order again!",
    author: "David Brown",
    rating: 5,
    avatarUrl: "/images/avatars/4.png",
    date: "2024-08-13",
  },
  {
    id: 13,
    content:
      "Authentic flavors that remind me of home. The chutneys were spot on, and the kulchas had just the right texture. A must-try if you crave Indian street food.",
    author: "Sneha Patel",
    rating: 5,
    avatarUrl: "/images/avatars/5.png",
    date: "2024-08-12",
  },
  {
    id: 14,
    content:
      "Consistent quality with every order. My go-to is the mix kulcha, and it never disappoints. The stuffing is flavorful, and the service is excellent.",
    author: "Amit Singh",
    rating: 4,
    avatarUrl: "/images/avatars/6.png",
    date: "2024-08-11",
  },
  {
    id: 15,
    content:
      "Quick delivery and delicious kulchas! I particularly enjoyed the paneer kulcha with a side of lassi. A great option for comfort food at home.",
    author: "Laura Johnson",
    rating: 4,
    avatarUrl: "/images/avatars/7.png",
    date: "2024-08-10",
  },
  {
    id: 16,
    content:
      "If you're looking for a taste of authentic kulchas, this is the place. The flavors are rich, and the portions are generous. Highly recommend the gobi kulcha!",
    author: "Ravi Verma",
    rating: 5,
    avatarUrl: "/images/avatars/8.png",
    date: "2024-08-09",
  },
  {
    id: 17,
    content:
      "The kulchas are flavorful and filling, with just the right amount of spice. The delivery was prompt, and the food was still hot when it arrived.",
    author: "Jessica Lee",
    rating: 5,
    avatarUrl: "/images/avatars/1.png",
    date: "2024-08-08",
  },
  {
    id: 18,
    content:
      "Loved the taste and the freshness of the kulchas. The cold coffee I ordered was the perfect drink to go along with it. Definitely coming back for more.",
    author: "Aditya Kumar",
    rating: 5,
    avatarUrl: "/images/avatars/2.png",
    date: "2024-08-07",
  },
  {
    id: 19,
    content:
      "The combination of crispy kulchas and sweet lassi is unbeatable. Perfect for a light but filling meal. The service was top-notch, too!",
    author: "Sarah Wilson",
    rating: 4,
    avatarUrl: "/images/avatars/3.png",
    date: "2024-08-06",
  },
  {
    id: 20,
    content:
      "Tried the aloo kulcha and was very impressed. The stuffing was well-seasoned, and the chutney was flavorful. Great value for money.",
    author: "Michael Davis",
    rating: 4,
    avatarUrl: "/images/avatars/4.png",
    date: "2024-08-05",
  },
  {
    id: 21,
    content:
      "The paneer kulcha had the perfect balance of softness and crunch. The masala chai was a great addition to the meal. Will order again soon!",
    author: "Simran Kaur",
    rating: 5,
    avatarUrl: "/images/avatars/5.png",
    date: "2024-08-04",
  },
  {
    id: 22,
    content:
      "The gobi kulcha was absolutely delicious. The stuffing was generous, and the flavor was spot-on. I paired it with an iced coffee, and it was perfect.",
    author: "John Smith",
    rating: 4,
    avatarUrl: "/images/avatars/6.png",
    date: "2024-08-03",
  },
  {
    id: 23,
    content:
      "I’ve tried many kulchas, but these are among the best. Crispy outside, soft inside, and packed with flavor. The delivery was quick, too.",
    author: "Ayesha Khan",
    rating: 5,
    avatarUrl: "/images/avatars/7.png",
    date: "2024-08-02",
  },
  {
    id: 24,
    content:
      "Great quality and taste. I especially enjoyed the aloo kulcha. The stuffing was perfectly spiced, and the chutney complemented it well.",
    author: "Rohan Mehta",
    rating: 4,
    avatarUrl: "/images/avatars/8.png",
    date: "2024-08-01",
  },
  {
    id: 25,
    content:
      "These kulchas are so good! The mix kulcha had an amazing blend of flavors, and the lassi was thick and creamy. Definitely recommend it.",
    author: "Sophia Martin",
    rating: 5,
    avatarUrl: "/images/avatars/1.png",
    date: "2024-07-31",
  },
  {
    id: 26,
    content:
      "The kulchas were delicious, and the service was quick. My order arrived hot and fresh. Will be ordering again soon!",
    author: "Kevin Thompson",
    rating: 4,
    avatarUrl: "/images/avatars/2.png",
    date: "2024-07-30",
  },
  {
    id: 27,
    content:
      "The kulchas are always crispy and perfectly stuffed. The sweet lassi was a great pairing. Great food and even better service.",
    author: "Anita Patel",
    rating: 5,
    avatarUrl: "/images/avatars/3.png",
    date: "2024-07-29",
  },
  {
    id: 28,
    content:
      "Tried the gobi kulcha, and it was delicious. The flavors were balanced, and the kulcha had the right amount of crispiness.",
    author: "Rahul Sharma",
    rating: 4,
    avatarUrl: "/images/avatars/4.png",
    date: "2024-07-28",
  },
  {
    id: 29,
    content:
      "Quick service, and the kulchas are consistently good. The lassi was refreshing and a great complement to the meal.",
    author: "Emily White",
    rating: 4,
    avatarUrl: "/images/avatars/5.png",
    date: "2024-07-27",
  },
  {
    id: 30,
    content:
      "These kulchas never disappoint. I tried the mix kulcha this time, and it was packed with flavor. Great taste and great service.",
    author: "James Clark",
    rating: 5,
    avatarUrl: "/images/avatars/6.png",
    date: "2024-07-26",
  },
  {
    id: 31,
    content:
      "Excellent kulchas, with just the right amount of spice. The delivery was prompt, and the food arrived hot and fresh.",
    author: "Neha Gupta",
    rating: 5,
    avatarUrl: "/images/avatars/7.png",
    date: "2024-07-25",
  },
  {
    id: 32,
    content:
      "The kulchas have a great texture, and the stuffing is delicious. The chutney was tangy, and the chai was flavorful. A complete meal!",
    author: "Richard Scott",
    rating: 4,
    avatarUrl: "/images/avatars/8.png",
    date: "2024-07-24",
  },
  {
    id: 33,
    content:
      "I tried the aloo kulcha, and it was amazing. The delivery was fast, and the food was still warm when it arrived. Great service.",
    author: "Olivia Taylor",
    rating: 4,
    avatarUrl: "/images/avatars/1.png",
    date: "2024-07-23",
  },
  {
    id: 34,
    content:
      "The kulchas were excellent, with a perfect balance of flavors. The gobi stuffing was well-seasoned and full of taste. Highly recommended.",
    author: "Sandeep Singh",
    rating: 5,
    avatarUrl: "/images/avatars/2.png",
    date: "2024-07-22",
  },
  {
    id: 35,
    content:
      "Great experience every time I order. The kulchas are always fresh, and the service is quick. The paneer kulcha is a must-try.",
    author: "Megan Roberts",
    rating: 5,
    avatarUrl: "/images/avatars/3.png",
    date: "2024-07-21",
  },
  {
    id: 36,
    content:
      "The mix kulcha had the perfect amount of spices. The chutney was flavorful, and the chai was comforting. A great meal overall.",
    author: "Vivek Kumar",
    rating: 4,
    avatarUrl: "/images/avatars/4.png",
    date: "2024-07-20",
  },
  {
    id: 37,
    content:
      "I ordered the gobi kulcha, and it was delicious. The stuffing was well-spiced, and the kulcha had the right level of crispiness.",
    author: "Isabella Brown",
    rating: 5,
    avatarUrl: "/images/avatars/5.png",
    date: "2024-07-19",
  },
  {
    id: 38,
    content:
      "The kulchas are consistently good. I love the paneer kulcha paired with a hot chai. Great food and timely delivery every time.",
    author: "Aarav Patel",
    rating: 4,
    avatarUrl: "/images/avatars/6.png",
    date: "2024-07-18",
  },
  {
    id: 39,
    content:
      "Tried the aloo kulcha, and it was bursting with flavor. The lassi was refreshing and balanced the spices perfectly. Will definitely order again.",
    author: "Sophia Garcia",
    rating: 5,
    avatarUrl: "/images/avatars/7.png",
    date: "2024-07-17",
  },
  {
    id: 40,
    content:
      "The mix kulcha was flavorful and satisfying. The service was quick, and the food was delivered hot. Great experience overall.",
    author: "Lucas Thompson",
    rating: 4,
    avatarUrl: "/images/avatars/8.png",
    date: "2024-07-16",
  },
  {
    id: 41,
    content:
      "These kulchas are my go-to comfort food. The gobi kulcha is always packed with flavor. The chai was a perfect pairing, as always.",
    author: "Emily Brown",
    rating: 5,
    avatarUrl: "/images/avatars/1.png",
    date: "2024-07-15",
  },
  {
    id: 42,
    content:
      "The kulchas are delicious, and the service is efficient. The aloo kulcha was perfectly spiced, and the lassi was creamy and refreshing.",
    author: "Andrew Davis",
    rating: 4,
    avatarUrl: "/images/avatars/2.png",
    date: "2024-07-14",
  },
  {
    id: 43,
    content:
      "The paneer kulcha is always a delight. The stuffing is flavorful, and the bread is perfectly cooked. The chutneys add a nice tangy kick.",
    author: "Harpreet Kaur",
    rating: 5,
    avatarUrl: "/images/avatars/3.png",
    date: "2024-07-13",
  },
  {
    id: 44,
    content:
      "I ordered the gobi kulcha, and it was amazing. The flavors were balanced, and the service was quick. Will definitely order again.",
    author: "Liam Anderson",
    rating: 4,
    avatarUrl: "/images/avatars/4.png",
    date: "2024-07-12",
  },
  {
    id: 45,
    content:
      "The kulchas are always fresh and delicious. The sweet lassi is the perfect complement to the spicy stuffing. Highly recommend trying them out!",
    author: "Rajesh Desai",
    rating: 5,
    avatarUrl: "/images/avatars/5.png",
    date: "2024-07-11",
  },
  {
    id: 46,
    content:
      "Consistent quality every time I order. The kulchas are crispy and flavorful. The delivery is always quick, and the food arrives hot.",
    author: "Kunal Singh",
    rating: 4,
    avatarUrl: "/images/avatars/6.png",
    date: "2024-07-10",
  },
  {
    id: 47,
    content:
      "I am always impressed with the quick service and delicious kulchas. The paneer kulcha is my favorite, and the chai is a perfect match.",
    author: "Chris Lee",
    rating: 5,
    avatarUrl: "/images/avatars/7.png",
    date: "2024-07-09",
  },
  {
    id: 48,
    content:
      "Tried the aloo kulcha, and it was fantastic. The stuffing was flavorful, and the lassi was thick and creamy. Great meal and service.",
    author: "Emma Turner",
    rating: 4,
    avatarUrl: "/images/avatars/8.png",
    date: "2024-07-08",
  },
  {
    id: 49,
    content:
      "The gobi kulcha is always packed with flavor and never disappoints. The sweet lassi is a perfect companion to the spicy flavors.",
    author: "Riya Sethi",
    rating: 5,
    avatarUrl: "/images/avatars/1.png",
    date: "2024-07-07",
  },
  {
    id: 50,
    content:
      "The kulchas are delicious and satisfying. The mix kulcha had a perfect blend of spices, and the service was quick. Great experience overall.",
    author: "Anjali Kapoor",
    rating: 4,
    avatarUrl: "/images/avatars/2.png",
    date: "2024-07-06",
  },
];

const ReviewSlider = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [index, setIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const leftReviewRef = useRef<HTMLDivElement | null>(null);
  const rightReviewRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      // Animate the sliding of the reviews
      animateReviews();

      setTimeout(() => {
        // Update the index after the animation completes
        setIndex((prevIndex) => (prevIndex + 1) % reviews.length);
      }, 1500); // Animation duration matches this timeout
    }, 5000); // The interval between automatic slides

    return () => clearInterval(interval);
  }, [isMobile, reviews.length]);

  const animateReviews = () => {
    if (leftReviewRef.current && rightReviewRef.current) {
      const tl = gsap.timeline();

      // Slide the left-most review out of view
      tl.to(leftReviewRef.current, {
        x: isMobile ? "-100%" : "-350px", // Slide out of view
        opacity: 0,
        duration: 1.2,
        ease: "power2.inOut",
      });

      // Bring the new review in from the right
      tl.fromTo(
        rightReviewRef.current,
        { x: isMobile ? "100%" : "350px", opacity: 0 },
        { x: "0%", opacity: 1, duration: 1.2, ease: "power2.inOut" },
        "-=0.5" // Overlap the animations slightly for smooth transition
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

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        marginTop: 3,
        minWidth: "100%",
        position: "relative",
        overflow: "hidden",
        height: isMobile ? "auto" : "320px",
        paddingRight:2,
        paddingBottom:6,
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
            ref={
              idx === 0
                ? leftReviewRef
                : idx === 2
                ? rightReviewRef
                : undefined
            }
            sx={{
              width: isMobile ? "100%" : 350,
              height: isMobile ? 300 : 240,
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
      </div>
    </Box>
  );
};

export default ReviewSlider;