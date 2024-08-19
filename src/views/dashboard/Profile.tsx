import React from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  Button,
  Typography,
  Avatar,
  Paper,
  Grid,
  FormControl,
  InputLabel,
} from '@mui/material';
import { styled } from '@mui/system';
import EmailIcon from '@mui/icons-material/Email';
import { useForm, Controller } from 'react-hook-form';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: 900,
  margin: '25px auto',
  backgroundColor: '#f8f8f8',
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 80,
  height: 80,
  margin: 'auto',
  cursor: 'pointer',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius,
    padding: '4px 8px', // Padding adjusted for consistency
    height: '40px', // Adjust height for uniformity
  },
  '& .MuiInputLabel-root': {
    fontSize: '0.9rem',
    fontWeight: '500',
    marginTop: '-4px', // Adjust label position to reduce space
  },
  '& .MuiOutlinedInput-input': {
    padding: '4px 0px', // Adjusted padding inside the input for compactness
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#dcdcdc',
  },
  '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#dcdcdc',
  },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius,
    padding: '4px 8px', // Matches the padding of the text fields
    height: '40px', // Same height as the TextField for uniformity
    fontSize: '0.9rem', // Ensures font size is consistent with the TextField
  },
  '& .MuiInputLabel-root': {
    fontSize: '0.9rem',
    fontWeight: '500',
    marginTop: '-4px', // Adjust label position to reduce space
  },
  '& .MuiOutlinedInput-input': {
    padding: '4px 0px', // Matches padding inside the input
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#dcdcdc',
  },
  '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#dcdcdc',
  },
}));

const EmailBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1),
  backgroundColor: '#f5f5f5',
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1), // Reduced margin to minimize space
}));

const StyledButton = styled(Button)(({ theme }) => ({
  fontWeight: 500,
  textTransform: 'none',
  borderRadius: theme.shape.borderRadius,
}));

const DashboardProfile: React.FC = () => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
      addressLine1: '',
      addressLine2: '',
      state: '',
      city: '',
      zipcode: '',
    },
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <StyledPaper elevation={3}>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <StyledAvatar src="/path-to-avatar-image.jpg" />
        <Typography color="primary" sx={{ mt: 1, cursor: 'pointer' }}>
          Edit Picture
        </Typography>
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2} alignItems="center" padding={3}>
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle2" gutterBottom>
              First Name
            </Typography>
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <StyledTextField {...field} fullWidth placeholder="Type here" variant="outlined" />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={4} >
            <Typography variant="subtitle2" gutterBottom>
              Last Name
            </Typography>
            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <StyledTextField {...field} fullWidth placeholder="Type here" variant="outlined" />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={4} >
            <Typography variant="subtitle2" gutterBottom>
              Phone Number
            </Typography>
            <Controller
              name="phoneNumber"
              control={control}
              render={({ field }) => (
                <StyledTextField {...field} fullWidth placeholder="Type here" variant="outlined" />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={4} >
            <Typography variant="subtitle2" gutterBottom>
              Email
            </Typography>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <StyledTextField {...field} fullWidth placeholder="Type here" variant="outlined" />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={4} >
            <Typography variant="subtitle2" gutterBottom>
              Address line 1
            </Typography>
            <Controller
              name="addressLine1"
              control={control}
              render={({ field }) => (
                <StyledTextField {...field} fullWidth placeholder="Type here" variant="outlined" />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle2" gutterBottom>
              Address line 2
            </Typography>
            <Controller
              name="addressLine2"
              control={control}
              render={({ field }) => (
                <StyledTextField {...field} fullWidth placeholder="Type here" variant="outlined" />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={4} mt={1}>
            <Typography variant="subtitle2" gutterBottom>
              State
            </Typography>
            <Controller
              name="state"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <StyledSelect {...field} fullWidth>
                    <MenuItem value="">State</MenuItem>
                    <MenuItem value="California">California</MenuItem>
                    <MenuItem value="New York">New York</MenuItem>
                    <MenuItem value="Texas">Texas</MenuItem>
                  </StyledSelect>
                </FormControl>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={4} mt={1}>
            <Typography variant="subtitle2" gutterBottom>
              City
            </Typography>
            <Controller
              name="city"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <StyledSelect {...field} fullWidth>
                    <MenuItem value="">City</MenuItem>
                    <MenuItem value="Los Angeles">Los Angeles</MenuItem>
                    <MenuItem value="New York City">New York City</MenuItem>
                    <MenuItem value="Houston">Houston</MenuItem>
                  </StyledSelect>
                </FormControl>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={4} mt={1}>
            <Typography variant="subtitle2" gutterBottom>
              Zipcode
            </Typography>
            <Controller
              name="zipcode"
              control={control}
              render={({ field }) => (
                <StyledTextField {...field} fullWidth placeholder="Type here" variant="outlined" />
              )}
            />
          </Grid>
        </Grid>

        {/* Email Address Section */}
        <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" gutterBottom>
              My email Address
            </Typography>
            <EmailBox>
              <EmailIcon sx={{ mr: 1, color: '#1a73e8' }} />
              <Box>
                <Typography variant="body1">abcde@gmail.com</Typography>
                <Typography variant="caption" color="text.secondary">
                  1 month ago
                </Typography>
              </Box>
            </EmailBox>
          </Box>
          <Button
            variant="outlined"
            color="primary"
            sx={{
              ml: 3,
              backgroundColor: '#f0f4ff',
              color: '#1a73e8',
              fontWeight: 500,
              height: 'fit-content',
              padding: '8px 16px',
              textTransform: 'none',
            }}
          >
            + Add Email Address
          </Button>
        </Box>

        {/* Buttons Section */}
        <Box sx={{ mt: 2, textAlign: 'right' }}>
          <StyledButton
            variant="outlined"
            sx={{
              color: '#000',
              borderColor: '#dcdcdc',
              mr: 2,
              '&:hover': {
                borderColor: '#000',
              },
            }}
          >
            Cancel
          </StyledButton>
          <StyledButton
            variant="contained"
            sx={{
              backgroundColor: '#000',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#333',
              },
            }}
          >
            Update changes
          </StyledButton>
        </Box>
      </form>
    </StyledPaper>
  );
};

export default DashboardProfile;
