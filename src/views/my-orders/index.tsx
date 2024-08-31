"use client";

import React, { useEffect, useState, CSSProperties } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Divider,
  Avatar,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LockIcon from "@mui/icons-material/Lock";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useAuthContext } from "@/context";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase";
import CircularLodar from "@/components/CircularLodar";
import Link from "next/link";
import CancelIcon from "@mui/icons-material/Cancel";

const orders = [
  {
    id: "ORD-1234",
    status: "Out For Delivery",
    location: "Ontario, Canada",
    estimatedArrival: "30 min",
    destination: "Toronto, Canada",
    kulcha: {
      name: "Paneer Kulcha",
      price: 15.99,
      quantity: 2,
      image: "/images/Img/5.jpg",
    },
    additional: [
      { items: [{ name: "Imli Chutney", quantity: 1, price: 1.5 }] },
      { items: [{ name: "Channa", quantity: 2, price: 1.5 }] },
    ],
  },
  {
    id: "ORD-5678",
    status: "Delivered",
    location: "Los Angeles, USA",
    estimatedArrival: "15 Aug 2024",
    destination: "Santa Monica, California",
    kulcha: {
      name: "Aloo Kulcha",
      price: 12.99,
      quantity: 1,
      image: "/images/Img/5.jpg",
    },
    additional: [
      { items: [{ name: "Normal Butter", quantity: 1, price: 0.5 }] },
      { items: [{ name: "Hot Coffee", quantity: 1, price: 3.5 }] },
    ],
  },
  {
    id: "ORD-91011",
    status: "Canceled",
    location: "Chicago, USA",
    estimatedArrival: "N/A",
    destination: "Downtown, Chicago",
    kulcha: {
      name: "Mix Kulcha",
      price: 12.99,
      quantity: 3,
      image: "/images/Img/5.jpg",
    },
    additional: [],
  },
];

const order = {
  id: "ORD-1234",
  customer: {
    name: "Thomas Shelby",
    phoneNumber: "718-986-6062",
    email: "peakyFB@gmail.com",
  },
  address: {
    raw: "Small Heath, B10 0HF, UK",
  },
  grand_total: 37.98,
  kulcha: {
    name: "Paneer Kulcha",
    price: 15.99,
    quantity: 2,
    image: "/images/Img/5.jpg",
  },
  additional: [
    { items: [{ name: "Imli Chutney", quantity: 1, price: 1.5 }] },
    { items: [{ name: "Channa", quantity: 2, price: 1.5 }] },
  ],
};

const tableHeaderStyle: CSSProperties = {
  border: "1px solid #ddd",
  padding: "8px",
  backgroundColor: "#e8f5ff",
  fontWeight: "bold",
  textAlign: "left" as "left", // Explicitly type it as a valid CSS 'textAlign' property
};

const tableCellStyle: CSSProperties = {
  border: "1px solid #ddd",
  padding: "8px",
  textAlign: "left" as "left", // Explicitly type it as a valid CSS 'textAlign' property
};

const OrdersPage: React.FC = () => {
  const { user, metaData, kitchenMetaData } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState<boolean>(false);
  const [invoiceImage, setInvoiceImage] = useState<string>("/images/image.png");
  const [myOrders, setMyOrders] = useState<any>([]);

  useEffect(() => {
    const init = async () => {
      try {
        const colRef = collection(db, "orders");
        const q = query(colRef, where("userId", "==", user?.uid));
        setLoading(true);
        const docs = await getDocs(q);
        let orders: any[] = [];
        if (docs.size > 0) {
          docs.forEach((doc) => {
            orders.push({
              id: doc.id,
              ...doc.data(),
            });
          });
          setMyOrders([...orders]);
        }
        setLoading(false);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [user, kitchenMetaData]);

  // const calculateGrandTotal = (order: any) => {
  //   const kulchaTotal = order.kulcha.price * order.kulcha.quantity;
  //   const additionalTotal = order.additional.reduce(
  //     (sum: number, item: any) =>
  //       sum + item.items[0].price * item.items[0].quantity,
  //     0
  //   );
  //   return kulchaTotal + additionalTotal;
  // };

  const handleDownloadInvoice = async () => {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice #ORD-1234</title>
    <style>
        body {
            font-family: 'Roboto', Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f6f8;
            color: #333;
        }
        .container {
            width: 80%;
            margin: 40px auto;
            background-color: #fff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 20px;
            border-bottom: 2px solid #f0f0f0;
            margin-bottom: 20px;
        }
        .header img {
            max-width: 150px;
        }
        .company-details {
            font-size: 14px;
            color: #666;
        }
        .invoice-number {
            text-align: right;
        }
        .invoice-number h2 {
            margin: 0;
            color: #2c3e50;
        }
        .invoice-number p {
            margin: 5px 0;
            color: #7f8c8d;
        }
        .invoice-details {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
        }
        .invoice-details div {
            width: 48%;
            font-size: 14px;
            color: #666;
        }
        .invoice-details div p {
            margin: 5px 0;
        }
        .table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        .table th, .table td {
            border: 1px solid #ecf0f1;
            padding: 12px 15px;
            text-align: left;
            font-size: 14px;
        }
        .table th {
            background-color: #f8f9fa;
            color: #2c3e50;
        }
        .totals {
            text-align: right;
            margin-top: 20px;
        }
        .totals p {
            margin: 5px 0;
            font-size: 16px;
            color: #2c3e50;
        }
        .totals p span {
            margin-left: 20px;
        }
        .totals .total {
            font-size: 18px;
            font-weight: bold;
            margin-top: 10px;
            border-top: 2px solid #ecf0f1;
            padding-top: 10px;
        }
        .footer {
            text-align: center;
            color: #95a5a6;
            font-size: 12px;
            margin-top: 30px;
        }
        @media (max-width: 768px) {
            .container {
                width: 100%;
                padding: 20px;
            }
            .invoice-details {
                flex-direction: column;
            }
            .invoice-details div {
                width: 100%;
                margin-bottom: 20px;
            }
        }
    </style>
</head>
<body>

<div class="container">
    <div class="header">
        <div class="company-details">
            <p><strong>Pattykulcha</strong></p>
            <p>Canada</p>
            <p>+1 (123) 456 7891, +44 (876) 543 2198</p>
        </div>
        <div class="invoice-number">
            <h2>Invoice #ORD-1234</h2>
            <p>Date Issued: August 29, 2024</p>
        </div>
    </div>

    <div class="invoice-details">
        <div>
            <p><strong>Invoice To:</strong></p>
            <p>Thomas Shelby</p>
            <p>Shelby Company Limited</p>
            <p>Small Heath, B10 0HF, UK</p>
            <p>peakyFB@gmail.com</p>
        </div>
        <div>
            <p><strong>Bill To:</strong></p>
            <p>Total Due: $37.98</p>
            <p>Bank Name: American Bank</p>
            <p>Country: United States</p>
            <p>IBAN: ETD95476213874685</p>
            <p>SWIFT Code: BR91905</p>
        </div>
    </div>

    <table class="table">
        <thead>
            <tr>
                <th>Item</th>
                <th>Description</th>
                <th>Cost</th>
                <th>Qty</th>
                <th>Price</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Vuexy Admin Template</td>
                <td>HTML Admin Template</td>
                <td>$32</td>
                <td>1</td>
                <td>$32.00</td>
            </tr>
            <tr>
                <td>Frest Admin Template</td>
                <td>Angular Admin Template</td>
                <td>$22</td>
                <td>1</td>
                <td>$22.00</td>
            </tr>
            <tr>
                <td>Apex Admin Template</td>
                <td>HTML Admin Template</td>
                <td>$17</td>
                <td>2</td>
                <td>$34.00</td>
            </tr>
            <tr>
                <td>Robust Admin Template</td>
                <td>React Admin Template</td>
                <td>$66</td>
                <td>1</td>
                <td>$66.00</td>
            </tr>
        </tbody>
    </table>

    <div class="totals">
        <p><strong>Subtotal:</strong> <span>$154.25</span></p>
        <p><strong>Discount:</strong> <span>$00.00</span></p>
        <p><strong>Tax:</strong> <span>$50.00</span></p>
        <p class="total"><strong>Total:</strong> <span>$204.25</span></p>
    </div>

    <div class="footer">
        <p>Thank you for your business!</p>
        <p>If you have any questions, contact us at support@materialize.com.</p>
    </div>
</div>

</body>
</html>`;
    try {
      const response = await fetch("/api/invoice-download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ html }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "generated.pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        console.error("Failed to generate PDF");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleViewInvoice = () => {
    setOpen(!open);
  };

  return (
    <>
      <CircularLodar isLoading={loading} />
      <Box
        sx={{
          backgroundColor: "#fffaeb",
          minHeight: "100vh",
          padding: 4,
          display: "flex",
          justifyContent: "center",
          overflowY: "auto", // Make the container scrollable
        }}
      >
        <Box sx={{ maxWidth: "600px", width: "100%" }}>
          {" "}
          <Typography
            variant="h3"
            component="h2"
            sx={{
              color: "#333333",
              fontWeight: "bold",
              textAlign: "center",
              mb: 1.75,
            }}
          >
            My Orders
          </Typography>
          {myOrders.length > 0 ? (
            myOrders.map((orderDoc: any) => {
              const { order } = orderDoc;

              return (
                <Paper
                  key={order.id}
                  sx={{
                    padding: 2,
                    borderRadius: 2,
                    marginBottom: 3,
                    position: "relative",
                    boxShadow: 3,
                    minHeight: "150px",
                    width: "100%",
                  }}
                >
                  <OrderStatusChip status={orderDoc?.delivery?.message} />
                  {/* {orderDoc?.delivery?.message == "Delivered" && (
                    <>
                      <IconButton
                        sx={{ position: "absolute", top: 14, right: -3 }} // Position the 3-dot icon next to the status
                        onClick={(event) => handleMenuOpen(event, orderDoc)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                      >
                        <MenuItem onClick={() => handleDownloadInvoice()}>
                          Download Invoice
                        </MenuItem>
                        <MenuItem onClick={handleViewInvoice}>
                          View Invoice
                        </MenuItem>
                      </Menu>
                    </>
                  )} */}

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: 2,
                    }}
                  >
                    <LockIcon sx={{ marginRight: 1 }} />
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                      ORD-1234
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: { xs: "flex-start", sm: "center" },
                      marginBottom: 2,
                      flexDirection: { xs: "column", sm: "row" },
                    }}
                  >
                  </Box>
                  {order?.map((item: any, index: number) => {
                    const { kulcha, additional } = item.order;
                    return (
                      <Grid
                        container
                        spacing={2}
                        sx={{ marginBottom: 2 }}
                        key={index}
                      >
                        <Grid item xs={12} sm={6} sx={{ display: "flex" }}>
                          <Avatar
                            variant="square"
                            src={kulcha?.image}
                            sx={{
                              width: 80,
                              height: 80,
                              borderRadius: 2,
                              marginRight: 2,
                            }}
                          />
                          <Box>
                            <Typography variant="body2" fontWeight="bold">
                              {kulcha.name}
                            </Typography>
                            <Typography variant="body2">
                              ${kulcha.price} x{kulcha.quantity}
                            </Typography>
                          </Box>
                        </Grid>
                        {additional?.length !== 0 && (
                          <Grid item xs={12} sx={{ marginTop: 1 }}>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: "bold", marginBottom: 1 }}
                            >
                              Additional Items:
                            </Typography>
                            {additional.map((item: any, itemIndex: number) => (
                              <Typography
                                key={itemIndex}
                                variant="body2"
                                sx={{ display: "inline", marginRight: 2 }}
                              >
                                {item.items[0].name} ({item.items[0].quantity})
                              </Typography>
                            ))}
                          </Grid>
                        )}
                      </Grid>
                    );
                  })}
                  <Divider sx={{ my: 2 }} />
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: "bold", marginBottom: 1 }}
                    >
                      Billing Address :
                    </Typography>
                    {/*<Typography variant="body2" color="textSecondary">
                      Name: {orderDoc?.customer?.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Phone: {orderDoc?.customer?.phoneNumber}
                    </Typography>*/}
                    <Typography variant="body2" color="textSecondary">
                      Address: {orderDoc?.address?.raw || orderDoc?.address}
                    </Typography>
                    {/* <Typography variant="body2" color="textSecondary">
                      Distance: {orderDoc?.address?.distance?.text || ""}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Instructions: {orderDoc?.instructions}
                    </Typography> */}
                  </Box>
                  <Divider sx={{ marginY: 2 }} />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                      flexDirection: "column",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        gap: 0.56,
                        justifyContent: "flex-start",
                      }}
                    >
                      {/* <Typography
                        variant="body2"
                        fontWeight="bold"
                        textAlign="left"
                      >
                        Total Tax: {orderDoc?.total_tax}
                      </Typography> */}
                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        textAlign="left"
                      >
                        Total: {orderDoc?.grand_total}
                      </Typography>
                    </Box>
                    {orderDoc?.delivery?.message == "Delivered" && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-evenly",
                          marginTop: 1.45,
                          gap: { xs: 0.73 },
                        }}
                      >
                        <Link href={`/product-review/${orderDoc.id}`}>
                          <Button
                            variant="contained"
                            sx={{
                              backgroundColor: "#ECAB21",
                              color: "white",
                              fontWeight: "bold",
                              "&:hover": {
                                backgroundColor: "#FFC107",
                                color: "white",
                              },
                            }}
                          >
                            Review
                          </Button>
                        </Link>
                        {/* <Button
                          variant="contained"
                          sx={{
                            backgroundColor: "#ECAB21",
                            color: "white",
                            fontWeight: "bold",
                            "&:hover": {
                              backgroundColor: "#FFC107",
                              color: "white",
                            },
                          }}
                          onClick={handleViewInvoice}
                        >
                          Invoice
                        </Button> */}

                        {/* <Link href={`/recipt/${orderDoc.id}`}>
                          <Button
                            variant="contained"
                            sx={{
                              backgroundColor: "#ECAB21",
                              color: "white",
                              fontWeight: "bold",
                              "&:hover": {
                                backgroundColor: "#FFC107",
                                color: "white",
                              },
                            }}
                          >
                            Receipt
                          </Button>
                        </Link> */}
                      </Box>
                    )}
                  </Box>
                </Paper>
              );
            })
          ) : (
            <Box
              sx={{
                padding: 4,
                textAlign: "center",
                alignItems: "center",
                height: "50vh",
                display: "flex",
              }}
            >
              <Paper
                sx={{
                  width: "100%",
                  padding: "24px",
                  backgroundColor: "#FFFFFF",
                  textAlign: "center",
                  margin: "0 auto",
                  maxWidth: "400px",
                  borderRadius: "12px",
                }}
              >
                <Typography variant="h6" sx={{ mb: 2 }}>
                  No orders yet
                </Typography>
                <Link href="/home">
                  <Button
                    variant="contained"
                    color="primary"
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
                  >
                    ORDER NOW
                  </Button>
                </Link>
              </Paper>
            </Box>
          )}
          {myOrders.length > 0 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Link href="/home">
                <Button
                  variant="contained"
                  color="primary"
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
                >
                  ORDER NOW
                </Button>
              </Link>
            </Box>
          )}
        </Box>
      </Box>

      <Dialog open={open} onClose={handleViewInvoice} maxWidth="md" fullWidth>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <DialogTitle>Invoice</DialogTitle>
          <IconButton onClick={handleViewInvoice}>
            <CancelIcon />
          </IconButton>
        </Box>
        <DialogContent>
          <Box sx={{ textAlign: "center", overflow: "hidden" }}>
            <img
              src={invoiceImage}
              alt="Invoice"
              style={{ maxWidth: "85%", height: "490px", marginInline: "auto" }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDownloadInvoice}>Download invoice</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

// Custom Order Status Chip Component
const OrderStatusChip: React.FC<{ status: string }> = ({ status }) => {
  const statusColors = {
    "Out For Delivery": "#FFAB00",
    Delivered: "#4CAF50",
    "Canceled": "#F44336",
    "New Order": "#FFAB00",
  };

  return (
    <Chip
      label={status}
      sx={{
        position: "absolute",
        top: 14,
        right: 16,
        backgroundColor:
          statusColors[
            status as
              | "Out For Delivery"
              | "Delivered"
              | "Canceled"
              | "New Order"
          ],
        color: "#fff",
      }}
    />
  );
};

export default OrdersPage;
