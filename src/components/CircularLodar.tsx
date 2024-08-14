
import React from 'react'

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const CircularLodar = ({isLoading} : {isLoading : boolean}) => {
  return (
    <Backdrop
    sx={{ color: '#ECAB21', zIndex: (theme : any) => theme.zIndex.drawer + 1 }}
    open={isLoading}
  >
    <CircularProgress color="inherit" />
  </Backdrop>
  )
}

export default CircularLodar