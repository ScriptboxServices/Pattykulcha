'use client'

// Next Imports
import Link from 'next/link'

// MUI Imports
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

// Third-party Imports
import * as yup from 'yup'

// Validation schema
const schema = yup.object().shape({
  email: yup.string().email('Enter a valid email').required('Email is required')
})

const ForgotPassword = () => {
  // Hooks
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  })

  const onSubmit = (data: any) => {
    console.log(data)
  }

  return (
    <div
      className='flex justify-center items-center'
      style={{
        backgroundImage: 'url(/images/bgimage.png)',
        backgroundSize: 'cover',
        backgroundColor: 'white',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Card
        className='flex justify-center items-center bg-backgroundPaper p-3 md:p-6 md:w-[320px]'
        style={{
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          padding: '32px',
          maxWidth: '30%'
        }}
      >
        <CardContent className='flex flex-col gap-5 w-full'>
          <div>
            <Typography variant='h5' sx={{ fontWeight: 'normal', textAlign: 'center' }}>Forgot Password 🔒</Typography>
            <Typography variant='subtitle1' sx={{ mt: 2, mb:2, textAlign: 'left' }}>
              Enter your email and we&#39;ll send you instructions to reset your password.
            </Typography>
          </div>
          <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5 w-full'>
            <Controller
              name='email'
              control={control}
              defaultValue=''
              render={({ field }) => (
                <TextField
                  {...field}
                  autoFocus
                  fullWidth
                  label='Email'
                  error={!!errors.email}
                  helperText={errors.email ? errors.email.message : ''}
                  sx={{ margin: '0 0 20px 0' }} // Center the TextField
                />
              )}
            />
            <Button fullWidth variant='contained' type='submit' sx={{ backgroundColor: 'black', '&:hover': { backgroundColor: 'black' }, height: '50px', borderRadius: '4px' }}>
              Send reset link
            </Button>
            <Typography className='flex justify-center items-center' sx={{ mt: 2, textAlign: 'center' }}>
              <Link href='/login' className='flex items-center text-black' style={{ textDecoration: 'none', fontWeight: 'bold', }}>
                <span style={{ color: 'black', textDecoration: 'none'}} >Back to Login</span>
              </Link>
            </Typography>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default ForgotPassword