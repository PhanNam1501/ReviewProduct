import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const UserPage = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          User Dashboard
        </Typography>
        <Typography variant="body1">
          Welcome to your dashboard! Here you can view and manage your products.
        </Typography>
      </Box>
    </Container>
  );
};

export default UserPage; 