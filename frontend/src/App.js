import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Auth from './components/Auth';
import AdminPage from './pages/AdminPage';
import UserPage from './pages/UserPage';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLoginSuccess = (admin) => {
    setIsLoggedIn(true);
    setIsAdmin(admin);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Container maxWidth="md">
          <Routes>
            <Route
              path="/"
              element={
                isLoggedIn ? (
                  <Navigate to={isAdmin ? "/admin" : "/user"} />
                ) : (
                  <Auth onLoginSuccess={handleLoginSuccess} />
                )
              }
            />
            <Route
              path="/admin"
              element={
                isLoggedIn && isAdmin ? (
                  <AdminPage />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/user"
              element={
                isLoggedIn && !isAdmin ? (
                  <UserPage />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App; 