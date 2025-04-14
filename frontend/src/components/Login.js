import React, { useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Button, TextField, Typography, Box, Paper } from '@mui/material';
import { ethers } from 'ethers';
import SupplyChain from '../abi/SupplyChain.json';
import { injected } from '../connectors';

const Login = ({ onLoginSuccess }) => {
  const { activate, account, active } = useWeb3React();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const connectWallet = async () => {
    try {
      await activate(injected);
    } catch (error) {
      setError('Failed to connect wallet: ' + error.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!active) {
      setError('Please connect your wallet first');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        "0xb879c6DDF2d45667d796Fe917398C31C79A64c8E",
        SupplyChain.abi,
        provider.getSigner()
      );

      // Kiểm tra xem tài khoản có phải là admin không
      // const isAdmin = await contract.isAdmin(account);
      
      // if (!isAdmin) {
      //   setError('You are not an admin');
      //   return;
      // }

      // Kiểm tra thông tin đăng nhập
      if (username === 'admin' && password === 'admin123') {
        onLoginSuccess();
        alert('Login successful!');
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        Admin Login
      </Typography>
      {!active ? (
        <Button
          variant="contained"
          color="primary"
          onClick={connectWallet}
          fullWidth
          sx={{ mt: 2 }}
        >
          Connect Wallet
        </Button>
      ) : (
        <Box component="form" onSubmit={handleLogin} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default Login; 
 