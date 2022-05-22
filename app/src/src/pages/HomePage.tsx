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
import { useNavigate } from 'react-router-dom';

import WineList from '../wine-info.json';

export default function HomePage() {
  const topWine = WineList[0];
  const recommendedWineList = WineList.slice(1, 5);
  const sweetJuicyWineList = WineList.slice(10, 15);

  const navigate = useNavigate();

  function logout() {
    navigate('/');
  }

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
        <IconButton aria-label="menu">
          <MenuRounded />
        </IconButton>
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
            Top Choice
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
                Lorem ipsum something useful
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
            Recommended for you
          </Typography>
          <Stack
            sx={{
              height: '100%',
              flexDirection: 'row',
              overflowX: 'auto',
              overflowY: 'clip',
              marginTop: 0,
            }}
          >
            {recommendedWineList.map(wine => (
              <Box
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
                      fontSize: '20px',
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
                    Lorem ipsum something useful
                  </Typography>
                </Stack>
              </Box>
            ))}
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
            Sweet and Juicy
          </Typography>
          <Stack
            sx={{
              height: '100%',
              flexDirection: 'row',
              overflowX: 'auto',
              overflowY: 'clip',
              marginTop: 0,
            }}
          >
            {sweetJuicyWineList.map(wine => (
              <Box
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
                      fontSize: '20px',
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
                    Lorem ipsum something useful
                  </Typography>
                </Stack>
              </Box>
            ))}
          </Stack>
        </Stack>
      </Stack>
      <Stack
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
      </Stack>
    </Stack>
  );
}
