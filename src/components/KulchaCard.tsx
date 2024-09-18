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
  } from "@mui/material";
  import { styled } from "@mui/system";

  const StyledCard = styled(Card)({
    borderRadius: "10px",
    backgroundColor: "#FAF3E0",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    width: "115px", // Ensure minimum width for each card
    height:"90px",
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
  });
const KulchaCard = ({name,count} :{name : string,count : number}) => {
  return (
    <StyledCard>
      <CardContent sx={{paddingBottom:0,paddingLeft:0,paddingRight:0}}>
        <Typography
          variant="h6"
          style={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "1.5rem",
          }}
        >
          {count}
        </Typography>
        <Typography variant="h6" sx={{fontSize:"14px",fontWeight: "bold",}}>
          {name}
        </Typography>
      </CardContent>
    </StyledCard>
  )
}

export default KulchaCard