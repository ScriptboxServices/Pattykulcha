'use client'

import React from 'react'
import { Box, Typography, TextField, Button, Container, Grid, Paper, InputAdornment } from '@mui/material'
import { Person, Email, Phone, Message } from '@mui/icons-material'

const ContactUs: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: 'url(/images/bgimage.png)',
        minHeight: '100vh',
        backgroundColor: '#f0f0f0',
        py: 4 
      }}
    >
      <Container maxWidth='md'>
        <Paper
          elevation={4}
          sx={{
            borderRadius: '16px',
            p: 4, 
            backgroundColor: 'rgba(255, 255, 255, 0.85)'
          }}
        >
          <Typography variant='h4' sx={{fontWeight:600}} align='center' gutterBottom>
            Contact Us
          </Typography>

          <form>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label='First Name'
                  variant='outlined'
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <Person />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label='Last Name'
                  variant='outlined'
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <Person />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label='Email'
                  variant='outlined'
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <Email />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label='Phone'
                  variant='outlined'
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <Phone />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label='Message'
                  placeholder='Write your message...'
                  variant='outlined'
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <Message />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Box display='flex' justifyContent='center'>
                  <Button
                    variant='contained'
                    sx={{
                      mt: 2, 
                      backgroundColor: '#000',
                      color: '#fff',
                      borderRadius:'10px',
                      '&:hover': { backgroundColor: '#333' },
                      fontSize: '1rem',
                      padding: '10px 20px' 
                    }}
                  >
                    Send Message
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    </Box>
  )
}

export default ContactUs
