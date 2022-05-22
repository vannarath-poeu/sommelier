import * as React from 'react';
import { TextField, Button, Stack, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();

  function login() {
    navigate('/home');
  }

  return (
    <Stack
      sx={{
        height: '100%',
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box>
        <img src="/logo.png" height="192px" width="192px" />
      </Box>
      <Stack
        sx={{
          justifyContent: 'center',
          padding: '32px',
        }}
      >
        <Typography
          sx={{
            fontWeight: 'bold',
          }}
          variant='h3'
          component='h3'
        >
          Sommelier!
        </Typography>
        <Typography gutterBottom>
          Your personalised wine experience awaits.
        </Typography>
        <Stack>
          <Stack
            sx={{
              flexDirection: 'column',
            }}
            spacing={1}
            paddingY={2}
          >
            <TextField
              label='Username'
              variant='outlined'
              required
            />
            <TextField
              label='Password'
              variant='outlined'
              required
              type='password'
            />
          </Stack>
          <Stack>
            <Button
              sx={{ backgroundColor: '#FB3640' }}
              variant='contained'
              onClick={() => login()}
              size='large'
            >
              LOGIN
            </Button>
            <Button
              sx={{ color: '#031926' }}
              variant='text'
            >
              Or, sign up!
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}
