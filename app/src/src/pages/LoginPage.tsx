import * as React from 'react';
import { TextField, Button, Stack, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import { API_URL } from '../const';

export default function LoginPage() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  function signup() {
    navigate('/signup');
  }

  async function login() {
    setIsLoading(true);
    const response = await fetch(`${API_URL}users/${username}`);
    if (response.status == 200) {
      const user = await response.json();
      enqueueSnackbar("Logged in as " + user["name"]);
      navigate('/home', { state: { user: user, }});
    } else{
      enqueueSnackbar("Invalid user!", { variant: "error" });
    }
    setIsLoading(false);
  }

  const [username, setUsername] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

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
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
            />
            {/* <TextField
              label='Password'
              variant='outlined'
              required
              type='password'
            /> */}
          </Stack>
          <Stack>
            <Button
              sx={{ backgroundColor: '#FB3640' }}
              variant='contained'
              onClick={() => login()}
              size='large'
              disabled={isLoading || !username.length}
            >
              LOGIN
            </Button>
            <Button
              sx={{ color: '#031926' }}
              variant='text'
              onClick={() => signup()}
            >
              Or, sign up!
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}
