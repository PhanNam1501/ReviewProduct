import React, { useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Button, TextField, Typography, Box, Paper, Tabs, Tab } from '@mui/material';
import { ethers } from 'ethers';
import SupplyChain from '../abi/SupplyChain.json';
import { injected } from '../connectors';

const Auth = ({ onLoginSuccess }) => {
  const { activate, account, active } = useWeb3React();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentTab, setCurrentTab] = useState('admin'); // 'admin', 'login', 'register'

  const connectWallet = async () => {
    try {
      await activate(injected);
    } catch (error) {
      setError('Failed to connect wallet: ' + error.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!active) {
      setError('Please connect your wallet first');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        "0xb879c6DDF2d45667d796Fe917398C31C79A64c8E",
        SupplyChain.abi,
        signer
      );

      console.log('Registering user:', {
        account,
        username,
        password
      });

      // Kiểm tra xem user đã đăng ký chưa
      try {
        const isRegistered = await contract.isUserRegistered(account);
        if (isRegistered) {
          setError('This wallet address is already registered');
          return;
        }
      } catch (err) {
        console.error('Error checking registration:', err);
      }

      // Thực hiện đăng ký
      const tx = await contract.registerUser(username, password);

      // Đợi transaction được xác nhận
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);

      if (receipt.status === 1) {
        alert('Registration successful! Please login.');
        setCurrentTab('login');
        setUsername('');
        setPassword('');
        setConfirmPassword('');
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      if (err.code === 4001) {
        setError('Transaction was rejected by user');
      } else if (err.code === -32603) {
        setError('Insufficient funds for gas');
      } else {
        setError(err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
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

      if (currentTab === 'admin') {
        

        if (username === 'admin' && password === 'admin123') {
          onLoginSuccess(true);
          alert('Admin login successful!');
        } else {
          setError('Invalid admin credentials');
        }
      } else {
        const isValid = await contract.login(username, password);
        if (isValid) {
          onLoginSuccess(false);
          alert('User login successful!');
        } else {
          setError('Invalid username or password');
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    const tabs = ['admin', 'login', 'register'];
    setCurrentTab(tabs[newValue]);
    setError('');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
  };

  const renderForm = () => {
    if (currentTab === 'register') {
      return (
        <Box component="form" onSubmit={handleRegister} noValidate>
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
          <TextField
            margin="normal"
            required
            fullWidth
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </Box>
      );
    }

    return (
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
    );
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        {currentTab === 'register' ? 'Register' : 'Login'}
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
        <>
          <Tabs 
            value={['admin', 'login', 'register'].indexOf(currentTab)}
            onChange={handleTabChange} 
            sx={{ mb: 2 }}
          >
            <Tab label="Admin Login" />
            <Tab label="User Login" />
            <Tab label="Register" />
          </Tabs>

          {renderForm()}
        </>
      )}
    </Paper>
  );
};

export default Auth; 