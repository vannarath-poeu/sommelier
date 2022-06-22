import * as React from 'react';
import { Stack, Typography, Box, IconButton } from '@mui/material';
import {
  MenuRounded,
  LogoutOutlined,
  HomeOutlined,
  ShoppingBagOutlined,
  FavoriteBorderOutlined,
  PersonOutlineOutlined,
} from '@mui/icons-material';
import randomColor from 'randomcolor';
import { useNavigate, useLocation } from 'react-router-dom';

import { API_URL } from '../const';

export default function HomePage() {

  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [mostPops, setMostPops] = React.useState<any>([]);
  const [recommendations, setRecommendations] = React.useState<any>([]);

  const navigate = useNavigate();
  const location = useLocation();

  const { user } = location.state as any;

  function logout() {
    navigate('/');
  }

  function goToWine(wine: any) {
    navigate('/wine', { state: { wine: wine, user: user }});
  }

  React.useEffect(() => {
    async function loadRecommendations() {
      if (!user) {
        logout();
        return;
      }
      const username: string = user["id"];
      const response = await fetch(`${API_URL}users/${username}/recommendations`);
      const recommendation: any = await response.json();
      setRecommendations(recommendation["recommendations"]);

      const mostPopResponse = await fetch(`${API_URL}users/unknown/recommendations`);
      const mostPopRecommendation: any = await mostPopResponse.json();
      setMostPops(mostPopRecommendation["recommendations"]);
      setIsLoading(false);
    }
    loadRecommendations();
  }, [])

  if (isLoading) {
    return <div>Loading ...</div>
  }

  function wineList(wines: any) {
    return (
      <Stack
        sx={{
          height: '100%',
          minHeight: '300px',
          flexDirection: 'row',
          overflowX: 'auto',
          overflowY: 'clip',
          marginTop: 0,
        }}
      >
        {wines.map((wine: any) => (
          <Box
            key={wine._id}
            sx={{
              height: '256px',
              width: '192px',
              borderRadius: '8px',
              backgroundColor: randomColor({ luminosity: 'dark' }),
              flexShrink: 0,
              marginRight: '24px',
              marginTop: '16px',
              position: 'relative',
            }}
            onClick={() => goToWine(wine)}
          >
            <img
              style={{
                height: '156px',
                position: 'absolute',
                top: '-16px',
                left: 'calc(50% - 25px)',
              }}
              src={"https:" + wine.wine_image_url}
            />
            <Stack
              sx={{
                alignItems: 'flex-start',
                padding: '16px',
                paddingTop: '156px',
              }}
            >
              <Typography
                sx={{
                  fontWeight: 'bold',
                  fontSize: '16px',
                  color: 'white',
                }}
              >
                {wine.wine_name}
              </Typography>
              <Typography
                sx={{
                  fontSize: '12px',
                  color: 'white',
                }}
              >
                {wine.producer} - {wine.country_name}
              </Typography>
            </Stack>
          </Box>
        ))}
      </Stack>
    )
  }

  const topWine = mostPops[Math.floor(Math.random() * mostPops.length)];
  const mostPopWineList = mostPops.slice(1);
  const forYouWineList = recommendations;

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
        <Typography
          sx={{
            fontWeight: 'bold',
            fontSize: '24px',
          }}
          variant="h6"
        >
          Welcome back, {user.name}!
        </Typography>
        <IconButton aria-label="logout" onClick={() => logout()}>
          <LogoutOutlined />
        </IconButton>
      </Stack>
      <Stack
        sx={{
          height: '100%',
          justifyContent: 'flex-start',
          padding: '16px',
          overflowY: 'scroll',
        }}
        spacing={4}
      >
        <Stack
          sx={{
            flexDirection: 'column',
          }}
          spacing={2}
        >
          <Typography
            sx={{
              fontWeight: 'bold',
              fontSize: '24px',
            }}
          >
            Spotlight
          </Typography>
          <Stack
            sx={{
              height: '128px',
              borderRadius: '8px',
              backgroundColor: randomColor({ luminosity: 'dark' }),
              position: 'relative',
              marginTop: '48px !important',
            }}
          >
            <img
              style={{
                height: '156px',
                position: 'absolute',
                bottom: '16px',
                left: '32px',
              }}
              src={"https:" + topWine.wine_image_url}
            />
            <Stack
              sx={{
                alignItems: 'flex-end',
                padding: '16px',
                paddingLeft: '128px',
              }}
              onClick={() => goToWine(topWine)}
            >
              <Typography
                sx={{
                  fontWeight: 'bold',
                  fontSize: '20px',
                  color: 'white',
                }}
              >
                {topWine.wine_name}
              </Typography>
              <Typography
                sx={{
                  fontSize: '12px',
                  color: 'white',
                }}
              >
                Our top pick! Don't miss out!.
              </Typography>
            </Stack>
          </Stack>
        </Stack>
        <Stack
          sx={{
            flexDirection: 'column',
          }}
          spacing={2}
        >
          <Typography
            sx={{
              fontWeight: 'bold',
              fontSize: '24px',
            }}
          >
            Most Popular
          </Typography>
          {wineList(mostPopWineList)}
        </Stack>

        <Stack
          sx={{
            flexDirection: 'column',
          }}
          spacing={2}
        >
          <Typography
            sx={{
              fontWeight: 'bold',
              fontSize: '24px',
            }}
          >
            Recommended For You
          </Typography>
          {wineList(forYouWineList)}
        </Stack>
      </Stack>
      {/* <Stack
        sx={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: '16px',
        }}
      >
        <IconButton aria-label="menu" sx={{ color: '#FB3640' }}>
          <HomeOutlined />
        </IconButton>
        <IconButton aria-label="menu">
          <ShoppingBagOutlined />
        </IconButton>
        <IconButton aria-label="menu">
          <FavoriteBorderOutlined />
        </IconButton>
        <IconButton aria-label="menu">
          <PersonOutlineOutlined />
        </IconButton>
      </Stack> */}
    </Stack>
  );
}
