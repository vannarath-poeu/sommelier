import * as React from 'react';
import { Stack, Typography, Rating, IconButton, Button } from '@mui/material';
import {
  ArrowBack,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import { API_URL } from '../const';

export default function WinePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();

  const { user, wine } = location.state as any;

  function back() {
    navigate('/home', { state: { user: user, }});
  }

  const [ratings, setRatings] = React.useState(wine?.rating?.rating || 0);
  const [isRatingDisable, setIsRatingDisable] = React.useState(false);

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

  async function submitRating() {
    setIsRatingDisable(true);
    const newRating = {
      "user_id":  user["id"],
      "item_id": wine["_id"],
      "rating": ratings,
    };
    const response = await fetch(`${API_URL}new-ratings/`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify(newRating)
    });
    if (response.status == 200) {
      const user = await response.json();
      enqueueSnackbar("Successfully rating!");
      wine["rating"] = newRating;
    } else{
      enqueueSnackbar("Something went wrong!", { variant: "error" });
      setIsRatingDisable(false);
    }
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
              variant="h2"
            >
              {wine.wine_name}
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 'bold',
              }}
            >
              {wine.producer || "Unknown producer"}
            </Typography>
            <br />
            <Typography
              variant="h6"
            >
              {wine.explanation || "-"}
            </Typography>
            <br />
            <Stack
              direction="row"
            >
              <Rating
                name="simple-controlled"
                value={ratings}
                onChange={(_event, newValue) => {
                  if (!wine?.rating?.rating) {
                    setRatings(newValue || 0);
                  }
                }}
              />
              {
                (!wine?.rating?.rating && !isRatingDisable) ? (
                  <Button
                    sx={{ color: 'red', padding: 0 }}
                    variant='text'
                    onClick={() => submitRating()}
                  >
                    Rate!
                  </Button>
                ) : null
              }
            </Stack>
            <br />
            {(wine.food_pairings && wine.food_pairings.length) ? (
              <div>
                <Typography
                  variant="h6"
                >
                  This goes well with:
                </Typography>
                <ul>
                {
                  wine.food_pairings.map((fp: string) => (
                    <Typography
                      component="li"
                      key={fp}
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
