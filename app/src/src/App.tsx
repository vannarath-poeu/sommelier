import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Routes, Route } from "react-router-dom";

import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import SignupPage from './pages/SignupPage';
import WinePage from './pages/WinePage';

export default function App() {
  return (
    <Container
      sx={{
        height: '100%',
        width: '100%',
        padding: 0,
      }}
    >
      <Routes>
        <Route path="/wine" element={<WinePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </Container>
  );
}
