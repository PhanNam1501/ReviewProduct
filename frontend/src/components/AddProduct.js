import React, { useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Button, TextField, Typography, Box, Paper } from '@mui/material';
import { ethers } from 'ethers';
import SupplyChain from '../abi/SupplyChain.json';
// require("dotenv").config();

const AddProduct = () => {
  const { library, account } = useWeb3React();
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!account) {
      setError('Please connect your wallet first');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const contract = new ethers.Contract(
        "0xb879c6DDF2d45667d796Fe917398C31C79A64c8E",
        SupplyChain.abi,
        library.getSigner()
      );

      const tx = await contract.addProduct(
        productName,
        ethers.utils.parseEther(productPrice)
      );

      await tx.wait();
      setProductName('');
      setProductPrice('');
      alert('Product added successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        Add New Product
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          margin="normal"
          required
          fullWidth
          label="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Product Price (ETH)"
          type="number"
          value={productPrice}
          onChange={(e) => setProductPrice(e.target.value)}
        />
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Product'}
        </Button>
      </Box>
    </Paper>
  );
};

export default AddProduct; 