'use client'

import React, { useState } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Box, Button, Checkbox, Container, FormControlLabel, TextField, Typography, Link, CssBaseline, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

// Define the Yup schema
const schema = yup.object().shape({
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  remember: yup.boolean().optional(),
});

// Define the TypeScript interface based on the Yup schema
type IFormInput = yup.InferType<typeof schema>;

const Login: React.FC = () => {
  const { control, handleSubmit, formState: { errors } } = useForm<IFormInput>({
    resolver: yupResolver(schema),
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const onSubmit: SubmitHandler<IFormInput> = data => {
    console.log(data);
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
            <Typography component="p" variant="body2" align="left" sx={{ width: '100%', mt: 0.5 }} gutterBottom>
              Please sign-in to your account.
            </Typography>
            <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={handleSubmit(onSubmit)}>
              <Controller
                name="email"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    {...field}
                    error={!!errors.email}
                    helperText={errors.email ? errors.email.message : ''}
                    autoComplete="email"
                    autoFocus
                  />
                )}
              />
              <Controller
                name="password"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    {...field}
                    error={!!errors.password}
                    helperText={errors.password ? errors.password.message : ''}
                    autoComplete="current-password"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <FormControlLabel
                  control={<Checkbox {...control.register('remember')} sx={{ color: 'black', '&.Mui-checked': { color: 'black' } }} />}
                  label="Remember me"
                />
                <Link href="/forgot-password" variant="body2" sx={{ color: 'black', textDecoration: 'none', fontWeight: 'bold', '&:hover': { textDecoration: 'underline' } }}>
                  Forgot password?
                </Link>
              </Box>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, backgroundColor: 'black', '&:hover': { backgroundColor: 'black' }, borderRadius: 1 }}
              >
                Login
              </Button>
              <Typography component="p" variant="body2" align="center" sx={{ mt: 2 }}>
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
