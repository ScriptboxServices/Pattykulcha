import React from 'react'
import {
    Box,
    Avatar,
    Card,
    CardContent,
    Chip,
    Divider,
    IconButton,
    Button,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Grid,
    Paper,
    TextField
  } from "@mui/material";
  import {
    formatTimestampToCustomDate,
    ShortTime,
  } from "@/utils/commonFunctions";
const CartItemCard = ({order,additional} : {order :any, additional  :any}) => {
  return (
    <Box key={order.orderId} sx={{ padding: 2 }}>
    <Card
      sx={{
        marginBottom: 1,
        borderRadius: 2,
        boxShadow: 3,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Avatar
              src={order?.order?.kulcha?.image}
              sx={{
                width: 50,
                height: 50,
                mr: 2,
              }}
            />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body1">
                {order?.order?.kulcha?.name}
              </Typography>
            </Box>
            <Box sx={{ textAlign: "right" }}>
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{
                  display: "flex",
                  width: "50px",
                  justifyContent: "flex-end",
                  fontWeight: "bold",
                }}
              >
                Qty:{" "}
                {order?.order?.kulcha?.quantity}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ width: "100%", mt: 1 }}>
            {additional?.length !== 0 && (
              <>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: "12px",
                    color: "#1F2937",
                    paddingBottom: "4px",
                  }}
                >
                  Add on items :
                </Typography>
                {additional.map((add: any) => {
                  return (
                    <Box
                      key={add?.id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent:
                          "space-between",
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          color: "#1F2937",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {add?.items?.[0]?.name}: x
                        {
                          add?.items?.[0]
                            ?.quantity
                        }
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: "#1F2937",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        ${add?.items?.[0]?.price}{" "}
                        x{" "}
                        {
                          add?.items?.[0]
                            ?.quantity
                        }
                      </Typography>
                    </Box>
                  );
                })}
              </>
            )}
          </Box>
        </Box>
        {/* {!isExpanded && (
          <Box
            sx={{ textAlign: "center", mt: 1 }}
          >
            <Button
              variant="text"
              onClick={() =>
                handleToggleExpand(order.id)
              }
              size="small"
              sx={{
                fontWeight: "bold",
                fontSize: "10px",
              }}
            >
              Show More
            </Button>
          </Box>
        )} */}
        {/* {isExpanded && (
          <> */}
        <Box>
          <Divider sx={{ my: 1 }} />
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              gap: 0.56,
            }}
          >
            <Typography
              variant="body2"
              component="span"
              sx={{
                fontWeight: "bold",
              }}
            >
              Time:
            </Typography>
            <Typography
              variant="body2"
              component="span"
            >
              {formatTimestampToCustomDate(
                order.createdAt
              )}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2">
              <Typography
                variant="body2"
                component="span"
                sx={{
                  fontWeight: "bold",
                }}
              >
                Name:
              </Typography>{" "}
              {order?.customer?.name}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2">
              <Typography
                variant="body2"
                component="span"
                sx={{
                  fontWeight: "bold",
                }}
              >
                Phone:
              </Typography>{" "}
              {order?.customer?.phoneNumber}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2">
              <Typography
                variant="body2"
                component="span"
                sx={{
                  fontWeight: "bold",
                }}
              >
                Address:
              </Typography>{" "}
              {order?.customer?.address?.raw ||
                ""}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2">
              <Typography
                variant="body2"
                component="span"
                sx={{
                  fontWeight: "bold",
                }}
              >
                Distance:
              </Typography>{" "}
              {order?.customer?.address?.distance
                ?.text || ""}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2">
              <Typography
                variant="body2"
                component="span"
                sx={{
                  fontWeight: "bold",
                }}
              >
                User:
              </Typography>{" "}
              {order.isUserExist
                ? "Existing User"
                : "New User"}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  </Box>
  )
}

export default CartItemCard