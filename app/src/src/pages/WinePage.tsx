import * as React from 'react';
import { Stack, Typography, Box, IconButton } from '@mui/material';
import {
  ArrowBack,
  LogoutOutlined,
  HomeOutlined,
  ShoppingBagOutlined,
  FavoriteBorderOutlined,
  PersonOutlineOutlined,
} from '@mui/icons-material';
import randomColor from 'randomcolor';
import { useNavigate, useLocation } from 'react-router-dom';

import { API_URL } from '../const';

export default function WinePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, wine } = location.state as any;

  function back() {
    navigate('/home', { state: { user: user, }});
  }

  // React.useEffect(() => {
  //   async function loadRecommendations() {
  //     const username: string = user["id"];
  //     const response = await fetch(`${API_URL}users/${username}/recommendations`);
  //     const recommendation: any = await response.json();
  //     setRecommendations(recommendation["recommendations"]);

  //     const mostPopResponse = await fetch(`${API_URL}users/unknown/recommendations`);
  //     const mostPopRecommendation: any = await mostPopResponse.json();
  //     setMostPops(mostPopRecommendation["recommendations"]);
  //     setIsLoading(false);
  //   }
  //   loadRecommendations();
  // }, [])

  // if (isLoading) {
  //   return <div>Loading ...</div>
  // }

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
          padding: '24px',
        }}
      >
        <Stack
          sx={{
            borderRadius: '8px',
            position: 'relative',
          }}
          direction="column"
        >
          <img
            style={{
              height: '256px',
              position: 'absolute',
              top: '0',
              left: '32px',
            }}
            src={"https:" + wine.wine_image_url}
          />
          <Stack
            sx={{
              alignItems: 'flex-start',
              padding: '16px',
              paddingTop: '256px',
            }}
          >
            <Typography
              variant="h3"
            >
              {wine.wine_name}
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 'bold',
              }}
            >
              {wine.producer || "Unknown producer"}
            </Typography>
            <br />
            <br />
            {(wine.food_pairings && wine.food_pairings.length) ? (
              <div>
                <Typography
                  variant="h6"
                >
                  Goes well with:
                </Typography>
                <ul>
                {
                  wine.food_pairings.map((fp: string) => (
                    <Typography
                      component="li"
                    >
                      {fp}
                    </Typography>
                  ))
                }
                </ul>
              </div>
            ) : null}
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}
