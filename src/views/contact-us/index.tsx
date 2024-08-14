'use client'

import React from 'react'
import { Box, Typography, TextField, Button, Container, Grid, Paper, InputAdornment } from '@mui/material'
import { Person, Email, Phone, Message } from '@mui/icons-material'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'


const schema = yup.object().shape({
  firstName: yup.string().required('First Name is required'),
  lastName: yup.string().required('Last Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().matches(/^[0-9]{10}$/, 'Phone number must be 10 digits').required('Phone is required'),
  message: yup.string().required('Message is required'),
})

const ContactUs: React.FC = () => {
  const { handleSubmit, control, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  })

  const onSubmit = (data: any) => {
    console.log(data)
    // Handle form submission here
  }

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

          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label='First Name'
                      variant='outlined'
                      error={!!errors.firstName}
                      helperText={errors.firstName?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <Person />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="lastName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label='Last Name'
                      variant='outlined'
                      error={!!errors.lastName}
                      helperText={errors.lastName?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <Person />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label='Email'
                      variant='outlined'
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <Email />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label='Phone'
                      variant='outlined'
                      error={!!errors.phone}
                      helperText={errors.phone?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <Phone />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="message"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      multiline
                      rows={4}
                      label='Message'
                      placeholder='Write your message...'
                      variant='outlined'
                      error={!!errors.message}
                      helperText={errors.message?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <Message />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Box display='flex' justifyContent='center'>
                  <Button
                    type="submit"
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
