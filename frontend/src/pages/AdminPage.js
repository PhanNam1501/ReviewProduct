import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import AddProduct from '../components/AddProduct';

const AdminPage = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
        <AddProduct />
      </Box>
    </Container>
  );
};

export default AdminPage; 