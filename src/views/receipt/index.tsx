"use client";

import React from "react";
import {
  Container,
  Paper,
  Typography,
  Divider,
  Box,
  List,
  ListItem,
  ListItemText,
  Grid,
  Avatar,
  Button,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import Image from "next/image";
import PreviousOrdersPage from "./PreviousOrder";

const receiptData = {
  total: 11.98,
  subtotal: 15.86,
  tax: 1.39,
  id: "ORD-5678",
  status: "Delivered",
  name: "John Doe",
  phoneNumber: "+1 (555) 123-4567",
  address: "1234 Elm Street, Los Angeles, USA",
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
};

const handleReceiptInvoice = async () => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Receipt #ORD-1234</title>
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
      .receipt-number {
          text-align: right;
      }
      .receipt-number h2 {
          margin: 0;
          color: #2c3e50;
      }
      .receipt-number p {
          margin: 5px 0;
          color: #7f8c8d;
      }
      .receipt-details {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
      }
      .receipt-details div {
          width: 48%;
          font-size: 14px;
          color: #666;
      }
      .receipt-details div p {
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
          .receipt-details {
              flex-direction: column;
          }
          .receipt-details div {
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
          <p>1234 Foodie Lane, Culinary City, USA</p>
          <p>+1 (123) 456 7890</p>
      </div>
      <div class="receipt-number">
          <h2>Receipt #ORD-1234</h2>
          <p>Date Issued: August 30, 2024</p>
      </div>
  </div>

  <div class="receipt-details">
      <div>
          <p><strong>Customer:</strong></p>
          <p>Thomas Shelby</p>
          <p>Small Heath, B10 0HF, UK</p>
          <p>peakyFB@gmail.com</p>
      </div>
      <div>
          <p><strong>Total Paid:</strong></p>
          <p>$154.25</p>
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
              <td>Paneer Kulcha</td>
              <td>Delicious paneer-stuffed kulcha</td>
              <td>$15.99</td>
              <td>2</td>
              <td>$31.98</td>
          </tr>
          <tr>
              <td>Aloo Kulcha</td>
              <td>Potato-stuffed kulcha</td>
              <td>$12.99</td>
              <td>1</td>
              <td>$12.99</td>
          </tr>
          <tr>
              <td>Imli Chutney</td>
              <td>Tangy tamarind chutney</td>
              <td>$1.50</td>
              <td>1</td>
              <td>$1.50</td>
          </tr>
          <tr>
              <td>Hot Coffee</td>
              <td>Freshly brewed hot coffee</td>
              <td>$3.50</td>
              <td>1</td>
              <td>$3.50</td>
          </tr>
      </tbody>
  </table>
  <div class="footer">
      <p>Thank you for your business!</p>
      <p>If you have any questions, contact us at support@pattykulcha.com.</p>
  </div>
</div>

</body>
</html>
`;
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

const ReceiptPage: React.FC = () => {
  return (
    <>
      <Box
        sx={{
          backgroundColor: "#fffaeb",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={3}
            sx={{ padding: 2, marginTop: 2, marginBottom: 2 }}
          >
            <Grid container justifyContent="center" alignItems="center">
              <Grid item>
                <Image
                  src="/images/logo.png"
                  alt="logo"
                  height={120}
                  layout="fixed"
                  width={136}
                  priority
                />
              </Grid>
            </Grid>

            <Divider sx={{ marginY: 0.5 }} />

            <Typography variant="h6">Order Details</Typography>
            <Grid container>
              <Grid item xs={6}>
                <List sx={{ padding: 0 }}>
                  <ListItem sx={{ paddingY: 0.5 }}>
                    <ListItemText
                      primary="Order ID"
                      secondary={receiptData.id}
                    />
                  </ListItem>
                  <ListItem sx={{ paddingY: 0.5 }}>
                    <ListItemText
                      primary="Phone Number"
                      secondary={receiptData.phoneNumber}
                    />
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={6}>
                <List sx={{ padding: 0 }}>
                  <ListItem sx={{ paddingY: 0.5 }}>
                    <ListItemText primary="Name" secondary={receiptData.name} />
                  </ListItem>
                  <ListItem sx={{ paddingY: 0.5 }}>
                    <ListItemText
                      primary="Address"
                      secondary={receiptData.address}
                    />
                  </ListItem>
                </List>
              </Grid>
            </Grid>

            <Divider sx={{ marginY: 0.5 }} />

            <Typography variant="h6" sx={{ marginBottom: 1 }}>
              Items Ordered
            </Typography>
            <List sx={{ padding: 0 }}>
              <ListItem sx={{ paddingY: 0.5 }}>
                <Grid container alignItems="center">
                  <Grid item>
                    <Avatar
                      variant="square"
                      src={receiptData.kulcha.image}
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: 2,
                        marginRight: 1,
                      }}
                    />
                  </Grid>
                  <Grid item xs>
                    <ListItemText
                      primary={receiptData.kulcha.name}
                      secondary={`Quantity: ${receiptData.kulcha.quantity}`}
                    />
                  </Grid>
                  <Grid item>
                    <Typography>
                      ${receiptData.kulcha.price.toFixed(2)}
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
              {receiptData.additional.map((group, index) =>
                group.items.map((item, idx) => (
                  <ListItem key={`${index}-${idx}`} sx={{ paddingY: 0.5 }}>
                    <ListItemText
                      primary={item.name}
                      secondary={`Quantity: ${item.quantity}`}
                    />
                    <Typography>${item.price.toFixed(2)}</Typography>
                  </ListItem>
                ))
              )}
            </List>

            <Divider sx={{ marginY: 0.5 }} />

            <List sx={{ padding: 0 }}>
              <ListItem sx={{ paddingY: 0.5 }}>
                <ListItemText primary="Subtotal" />
                <Typography>${receiptData.subtotal.toFixed(2)}</Typography>
              </ListItem>
              <ListItem sx={{ paddingY: 0.5 }}>
                <ListItemText primary="Tax" />
                <Typography>${receiptData.tax.toFixed(2)}</Typography>
              </ListItem>
            </List>

            <Divider sx={{ marginY: 0.5 }} />

            <Box
              display="flex"
              justifyContent="space-between"
              sx={{ paddingY: 0.5 }}
            >
              <Typography variant="h6">Amount Charged</Typography>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                ${receiptData.total.toFixed(2)}
              </Typography>
            </Box>

            <Divider sx={{ marginY: 0.5 }} />

            <Box
              display="flex"
              flexDirection="column"
              alignItems="flex-center"
              sx={{ mt: 2 }}
            >
              <Button
                startIcon={
                  <DownloadIcon sx={{ display: { xs: "none", sm: "block" } }} />
                }
                onClick={handleReceiptInvoice}
                sx={{
                  textTransform: "none",
                  backgroundColor: "#ECAB21",
                  color: "white",
                  paddingX: 4,
                  marginInline: "auto",
                  width: {xs:"100%",sm:"50%"},
                  paddingY: 1,
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: "#FFC107",
                    color: "white",
                  },
                }}
              >
                Download PDF
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
      <PreviousOrdersPage />
    </>
  );
};

export default ReceiptPage;
