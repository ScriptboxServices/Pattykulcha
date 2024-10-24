import React from 'react'
import {
    Card,
    CardContent,
    Typography,
  } from "@mui/material";
  import { styled } from "@mui/system";

  const StyledCard = styled(Card)({
    borderRadius: "7px",
    backgroundColor: "#FAF3E0",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    width: "80px", // Ensure minimum width for each card
    height:"78px",
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
  });
const KulchaCard = ({name,count} :{name : string,count : number}) => {
  return (
    <StyledCard>
      <CardContent sx={{padding:0}} style={{paddingBottom:'0'}}>
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