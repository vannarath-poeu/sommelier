import * as React from 'react';
import { TextField, Button, Stack, FormGroup, FormControlLabel, Checkbox, Typography, IconButton } from '@mui/material';
import {
  ArrowBack,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import { API_URL } from '../const';

import wineStyles from '../wine_style.json';
import foodList from '../food_list.json';

export default function SignupPage() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const foodOptions = foodList.slice(0, 5);
  const styleOptions = wineStyles.slice(5, 10);

  const [name, setName] = React.useState<string>("");
  const [username, setUsername] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const [preferredStyles, setPreferredStyles] = React.useState<number[]>([0, 0, 0, 0, 0]);
  const [preferredFood, setPreferredFood] = React.useState<number[]>([0, 0, 0, 0, 0]);

  function flipStyle(idx: number) {
    const selectedStyles = preferredStyles.slice()
    selectedStyles[idx] = (selectedStyles[idx] === 0) ? 1 : 0;
    setPreferredStyles(selectedStyles);
  }

  function flipFood(idx: number) {
    const selectedFood = preferredFood.slice()
    selectedFood[idx] = (selectedFood[idx] === 0 )? 1 : 0;
    setPreferredFood(selectedFood);
  }

  async function signup() {
    setIsLoading(true);
    const food: string[] = [];
    const styles: string[] = [];
    for (let i=0; i < 5; i++) {
      if (preferredFood[i] === 1) {
        food.push(foodOptions[i]);
      }
      if (preferredStyles[i] === 1) {
        styles.push(styleOptions[i]);
      }
    }
    const response = await fetch(`${API_URL}users/`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({
        "id": username,
        "name": name,
        "food": food,
        "styles": styles,
      })
    });
    if (response.status == 200) {
      const user = await response.json();
      enqueueSnackbar("Successfully signed up! Welcome, " + name);
      navigate('/', { state: { user: user, }});
    } else{
      enqueueSnackbar("User already exists!", { variant: "error" });
    }
    setIsLoading(false);
  }

  function back() {
    navigate("/");
  }

  const validSignup = name.length && username.length && preferredStyles.some(e => e == 1) && preferredFood.some(e => e == 1)
;
  return (
    <Stack
      sx={{
        height: '100%',
        width: '100%',
        padding: 0,
      }}
    >
      <Stack
        sx={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: '16px',
        }}
      >
        <IconButton
          aria-label="menu"
          onClick={() => back()}
        >
          <ArrowBack />
        </IconButton>
      </Stack>
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
              label='Name'
              variant='outlined'
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
            <TextField
              label='Username'
              variant='outlined'
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
            />
          </Stack>
          <Stack
            sx={{
              flexDirection: 'column',
            }}
            spacing={1}
            paddingY={2}
          >
            <Typography variant='h6' gutterBottom>
              Select your preferred Food
            </Typography>
            <FormGroup>
              {foodOptions.map((food, idx) => (
                <FormControlLabel key={`food${idx}`} control={<Checkbox checked={preferredFood[idx] === 1} onClick={() => flipFood(idx)} />} label={food} />
              ))}
            </FormGroup>
          </Stack>
          <Stack
            sx={{
              flexDirection: 'column',
            }}
            spacing={1}
            paddingY={2}
          >
            <Typography variant='h6' gutterBottom>
              Select your preferred Wine Style
            </Typography>
            <FormGroup>
              {styleOptions.map((style, idx) => (
                <FormControlLabel key={`style${idx}`} control={<Checkbox checked={preferredStyles[idx] === 1} onClick={() => flipStyle(idx)} />} label={style} />
              ))}
            </FormGroup>
          </Stack>
          <Stack>
            <Button
              sx={{ backgroundColor: '#FB3640' }}
              variant='contained'
              onClick={() => signup()}
              size='large'
              disabled={isLoading || !validSignup}
            >
              SIGNUP
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}
