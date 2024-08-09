'use client'

import React from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Box, Button, Container, TextField, Typography, Link, CssBaseline } from '@mui/material';
import { useRouter } from 'next/navigation';

// Define the Yup schema
const schema = yup.object().shape({
  phone: yup
    .string()
    .matches(/^\d+$/, 'Phone number is not valid')
    .min(10, 'Phone number must be at least 10 digits')
    .required('Phone number is required'),
});

// Define the TypeScript interface based on the Yup schema
type IFormInput = yup.InferType<typeof schema>;

const Login: React.FC = () => {
  const { control, handleSubmit, formState: { errors } } = useForm<IFormInput>({
    resolver: yupResolver(schema),
  });

  const router = useRouter();

  const onSubmit: SubmitHandler<IFormInput> = data => {
    console.log(data);
    // Navigate to /verification after successful login
    router.push('/verification');
  };

  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          backgroundImage: 'url(/images/bgimage.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: 'white',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Container component="main" maxWidth="xs" sx={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', padding: 4, borderRadius: 2, boxShadow: 3 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography component="h1" variant="h5">
              Pattykulcha
            </Typography>
            <Typography component="h2" variant="subtitle1" align="left" sx={{ width: '100%', mt: 3 }}>
              Welcome to Pattykulcha!
            </Typography>
            <Typography variant="body2" align="left" sx={{ width: '100%', mt: 0.5 }} gutterBottom>
              Please sign-in to your account.
            </Typography>
            <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={handleSubmit(onSubmit)}>
              <Controller
                name="phone"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="phone"
                    label="Phone Number"
                    type="tel"
                    {...field}
                    error={!!errors.phone}
                    helperText={errors.phone ? errors.phone.message : ''}
                    autoComplete="tel"
                    autoFocus
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                  />
                )}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, backgroundColor: 'black', '&:hover': { backgroundColor: 'black' }, borderRadius: 1 }}
              >
                Login
              </Button>
              <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                New on our platform? <Link href="/createaccount" variant="body2" sx={{ color: 'black', textDecoration: 'none', fontWeight: 'bold', '&:hover': { textDecoration: 'underline' } }}>Create An Account</Link>
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Login;