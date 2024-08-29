"use client";

import React, { useEffect, useState,CSSProperties } from "react";
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
import jsPDF from "jspdf"; // Import jsPDF
import Link from "next/link";

// Sample data array for orders
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

const tableHeaderStyle:CSSProperties = {
  border: "1px solid #ddd",
  padding: "8px",
  backgroundColor: "#e8f5ff",
  fontWeight: "bold",
  textAlign: "left" as "left", // Explicitly type it as a valid CSS 'textAlign' property
};

const tableCellStyle:CSSProperties = {
  border: "1px solid #ddd",
  padding: "8px",
  textAlign: "left" as "left", // Explicitly type it as a valid CSS 'textAlign' property
};

const OrdersPage: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const { user, metaData, kitchenMetaData } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState<boolean>(false);
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

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, order: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrder(order);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedOrder(null);
  };

  const handleDownloadInvoice = () => {
    const doc = new jsPDF();
    const { kulcha, additional } = order;

    const margin = 20;
    let yPosition = 20;

    // Add Invoice Header with Background
    doc.setFillColor(245, 247, 250); // Light grey background
    doc.rect(margin - 10, yPosition, 170, 30, "F"); // Draw background rectangle
    doc.setFontSize(16);
    doc.setTextColor(58, 102, 179); // Blue color for the logo text
    doc.text("Materialize", margin, yPosition + 10);

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0); // Reset color to black for normal text
    doc.text("Office 149, 450 South Brand Brooklyn", margin, yPosition + 18);
    doc.text("San Diego County, CA 91905, USA", margin, yPosition + 24);
    doc.text("+1 (123) 456 7891, +44 (876) 543 2198", margin, yPosition + 30);

    // Add Invoice Info
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Reset color to black for normal text
    doc.text(`Invoice #${order.id}`, margin + 100, yPosition + 10);
    doc.text("Date Issued: April 25, 2021", margin + 100, yPosition + 18);
    doc.text("Date Due: May 25, 2021", margin + 100, yPosition + 24);

    yPosition += 40; // Move down for customer and billing information

    // Add Customer and Billing Information
    doc.setFontSize(10);
    doc.text("Invoice To:", margin, yPosition);
    doc.text("Bill To:", margin + 100, yPosition);
    yPosition += 5;

    doc.text(`${order.customer?.name || "N/A"}`, margin, yPosition);
    doc.text(
      `Total Due: $${order.grand_total.toFixed(2)}`,
      margin + 100,
      yPosition
    );
    yPosition += 5;

    doc.text("Shelby Company Limited", margin, yPosition);
    doc.text("Bank Name: American Bank", margin + 100, yPosition);
    yPosition += 5;

    doc.text(`${order.address?.raw || "N/A"}`, margin, yPosition);
    doc.text("Country: United States", margin + 100, yPosition);
    yPosition += 5;

    doc.text(`${order.customer?.phoneNumber || "N/A"}`, margin, yPosition);
    doc.text("IBAN: ETD95476213874685", margin + 100, yPosition);
    yPosition += 5;

    doc.text(order.customer?.email || "N/A", margin, yPosition);
    doc.text("SWIFT code: BR91905", margin + 100, yPosition);
    yPosition += 10;

    // Draw table headers for the items
    doc.setFillColor(245, 247, 250); // Light grey background for headers
    doc.rect(margin - 10, yPosition, 170, 8, "F");
    doc.setFontSize(10);
    doc.text("ITEM", margin, yPosition + 5);
    doc.text("DESCRIPTION", margin + 50, yPosition + 5);
    doc.text("COST", margin + 100, yPosition + 5);
    doc.text("QTY", margin + 120, yPosition + 5);
    doc.text("PRICE", margin + 140, yPosition + 5);
    yPosition += 10;

    // Add kulcha and additional items
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0); // Set text color to black
    doc.text(kulcha.name, margin, yPosition);
    doc.text("Delicious Indian bread", margin + 50, yPosition);
    doc.text(`$${kulcha.price.toFixed(2)}`, margin + 100, yPosition);
    doc.text(`${kulcha.quantity}`, margin + 120, yPosition);
    doc.text(
      `$${(kulcha.price * kulcha.quantity).toFixed(2)}`,
      margin + 140,
      yPosition
    );
    yPosition += 5;

    additional?.forEach((addItem: any) => {
      addItem.items.forEach((additionalItem: any) => {
        doc.text(additionalItem.name, margin, yPosition);
        doc.text("Extra item", margin + 50, yPosition);
        doc.text(
          `$${additionalItem.price.toFixed(2)}`,
          margin + 100,
          yPosition
        );
        doc.text(`${additionalItem.quantity}`, margin + 120, yPosition);
        doc.text(
          `$${(additionalItem.price * additionalItem.quantity).toFixed(2)}`,
          margin + 140,
          yPosition
        );
        yPosition += 5;
      });
    });

    yPosition += 10;

    // Add total amounts at the bottom
    doc.setFontSize(12);
    doc.text("Total:", margin + 120, yPosition);
    doc.text(`$${order.grand_total.toFixed(2)}`, margin + 140, yPosition);

    // Save the PDF
    doc.save(`Invoice_${order.id}.pdf`);
  };

  const handleViewInvoice = () => {
    setSelectedOrder(order); // Use dummy data for viewing invoice
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
                  {orderDoc?.delivery?.message == "Delivered" && (
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
                  )}

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
                    <LocationOnIcon
                      sx={{
                        marginRight: 1,
                        display: { xs: "none", sm: "block" },
                      }}
                    />
                    <Typography variant="body2" sx={{ marginRight: 1 }}>
                      {orderDoc?.address?.seperate?.line1 || "Location not set"}
                    </Typography>
                    <Divider
                      orientation="vertical"
                      flexItem
                      sx={{ marginX: 1 }}
                    />
                    <Typography variant="body2" sx={{ marginRight: 1 }}>
                      Estimated arrival: 30 min
                    </Typography>
                    <Divider
                      orientation="vertical"
                      flexItem
                      sx={{ marginX: 1 }}
                    />
                    <Typography variant="body2">
                      {orderDoc?.address?.seperate?.city},{" "}
                      {orderDoc?.address?.seperate?.state}, Canada
                    </Typography>
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
                    <Typography variant="body2" color="textSecondary">
                      Name: {orderDoc?.customer?.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Phone: {orderDoc?.customer?.phoneNumber}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Address: {orderDoc?.address?.raw || orderDoc?.address}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Distance: {orderDoc?.address?.distance?.text || ""}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Instructions: {orderDoc?.instructions}
                    </Typography>
                  </Box>
                  <Divider sx={{ marginY: 2 }} />

                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Box sx={{ display: "flex", gap: 0.56 }}>
                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        textAlign="right"
                      >
                        Total Tax: {orderDoc?.total_tax}
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        textAlign="right"
                      >
                        Total: {orderDoc?.grand_total}
                      </Typography>
                    </Box>
                    {orderDoc?.delivery?.message == "Delivered" && (
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
                          Add Review
                        </Button>
                      </Link>
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
        </Box>
      </Box>
      <Dialog open={open} onClose={handleViewInvoice} maxWidth="md" fullWidth>
        <DialogTitle>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#e8f5ff",
              padding: "10px 20px",
              borderRadius: "4px",
            }}
          >
            <div
              style={{ fontSize: "20px", fontWeight: "bold", color: "#3a66b3" }}
            >
              Materialize
            </div>
            <div
              style={{ textAlign: "right", fontSize: "12px", color: "#666" }}
            >
              <p>Invoice #{order.id}</p>
              <p>Date Issued: April 25, 2021</p>
              <p>Date Due: May 25, 2021</p>
            </div>
          </div>
        </DialogTitle>
        <DialogContent>
          <div style={{ padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <h4 style={{ marginBottom: "5px" }}>Invoice To:</h4>
                <p style={{ margin: 0 }}>{order.customer?.name}</p>
                <p style={{ margin: 0 }}>Shelby Company Limited</p>
                <p style={{ margin: 0 }}>{order.address?.raw}</p>
                <p style={{ margin: 0 }}>{order.customer?.phoneNumber}</p>
                <p style={{ margin: 0 }}>{order.customer?.email}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <h4 style={{ marginBottom: "5px" }}>Bill To:</h4>
                <p style={{ margin: 0 }}>
                  Total Due: ${order.grand_total.toFixed(2)}
                </p>
                <p style={{ margin: 0 }}>Bank Name: American Bank</p>
                <p style={{ margin: 0 }}>Country: United States</p>
                <p style={{ margin: 0 }}>IBAN: ETD95476213874685</p>
                <p style={{ margin: 0 }}>SWIFT code: BR91905</p>
              </div>
            </div>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "20px",
              }}
            >
              <thead>
                <tr>
                  <th style={tableHeaderStyle}>ITEM</th>
                  <th style={tableHeaderStyle}>DESCRIPTION</th>
                  <th style={tableHeaderStyle}>COST</th>
                  <th style={tableHeaderStyle}>QTY</th>
                  <th style={tableHeaderStyle}>PRICE</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={tableCellStyle}>{order.kulcha?.name}</td>
                  <td style={tableCellStyle}>Delicious Indian bread</td>
                  <td style={tableCellStyle}>
                    ${order.kulcha?.price.toFixed(2)}
                  </td>
                  <td style={tableCellStyle}>{order.kulcha?.quantity}</td>
                  <td style={tableCellStyle}>
                    ${(order.kulcha?.price * order.kulcha?.quantity).toFixed(2)}
                  </td>
                </tr>
                {order.additional?.map((addItem: any, index: number) =>
                  addItem.items.map((additionalItem: any, subIndex: number) => (
                    <tr key={`${index}-${subIndex}`}>
                      <td style={tableCellStyle}>{additionalItem.name}</td>
                      <td style={tableCellStyle}>Extra item</td>
                      <td style={tableCellStyle}>
                        ${additionalItem.price.toFixed(2)}
                      </td>
                      <td style={tableCellStyle}>{additionalItem.quantity}</td>
                      <td style={tableCellStyle}>
                        $
                        {(
                          additionalItem.price * additionalItem.quantity
                        ).toFixed(2)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <hr />
            <div
              style={{
                textAlign: "right",
                fontWeight: "bold",
                marginTop: "10px",
              }}
            >
              Total: ${order.grand_total.toFixed(2)}
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleViewInvoice}>Close</Button>
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
    Canceled: "#F44336",
    "New Order": "#FFAB00",
  };

  return (
    <Chip
      label={status}
      sx={{
        position: "absolute",
        top: 16,
        right: 29,
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
