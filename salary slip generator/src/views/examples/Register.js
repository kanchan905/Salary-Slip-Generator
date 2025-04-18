import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Divider,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import GoogleIcon from '@mui/icons-material/Google';
import 'bootstrap/dist/css/bootstrap.min.css';

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    agreeToTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.agreeToTerms) {
      alert('Please agree to the terms and conditions.');
      return;
    }
    // Implement actual sign-up logic
    console.log('Sign Up Data:', formData);
  };

  return (
    <>
    <div className='header bg-gradient-info pb-5 pt-5 pt-md-8'>
    <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <Box
        sx={{
          bgcolor: '#f9f9f9',
          borderRadius: '12px',
          boxShadow: 3,
          p: 4,
          maxWidth: 400,
          width: '100%',
          border: '1px solid #bde0fe',
        }}
      >
        <Typography variant="h5" align="center" fontWeight="bold" gutterBottom>
          Sign Up
        </Typography>
        <Typography variant="body2" align="center" gutterBottom>
          Join us today by creating your account
        </Typography>

        <Button
          variant="outlined"
          fullWidth
          startIcon={<GitHubIcon />}
          sx={{ mb: 2, textTransform: 'none', borderColor: '#d1d1d1' }}
        >
          Sign Up With GitHub
        </Button>

        <Button
          variant="outlined"
          fullWidth
          startIcon={<GoogleIcon />}
          sx={{ mb: 3, textTransform: 'none', borderColor: '#d1d1d1' }}
        >
          Sign Up With Google
        </Button>

        <Divider sx={{ mb: 3 }}>Or</Divider>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Full Name"
            name="fullName"
            fullWidth
            required
            value={formData.fullName}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            required
            value={formData.email}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            required
            value={formData.password}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />

          <FormControlLabel
            control={
              <Checkbox
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
              />
            }
            label="I agree to the terms and conditions"
            sx={{ mb: 2 }}
          />

          <Button
            variant="contained"
            fullWidth
            type="submit"
            sx={{
              textTransform: 'none',
              backgroundColor: '#1f2937',
              '&:hover': {
                backgroundColor: '#111827',
              },
            }}
          >
            Sign Up With Email
          </Button>
        </form>
      </Box>
    </Container>
    </div>
    </>
  );
};

export default SignUpPage;
