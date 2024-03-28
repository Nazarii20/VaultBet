import React, { Fragment } from "react";
import { Container, Typography } from "@mui/material";
import useGlobal from "src/hooks/useGlobal";
import ArcadeGameCard from "@components/ArcadeGameCard/ArcadeGameCard";
import {Usergeek} from "usergeek-ic-js"
import { useNavigate } from 'react-router-dom';
import './Arcade.css';


export default function Arcade() {
  const { arcadeGames } = useGlobal();
  const navigate = useNavigate();

  return (
  <Container sx={{ display: 'flex', flexDirection: 'column' }}>
    <Typography sx={{ padding: 2 }} variant='h3'>Arcade</Typography>
    <div className="arcade-game-cards">
      {arcadeGames.map((game) => {
        return (
          // <Grid xs={12} sm={12} md={6} lg={4} item key={game.id}>
          <Fragment key={game.id}>
            <ArcadeGameCard
              game={game}
              onClick={() => {
                Usergeek.trackEvent("Opened Arcade Game " + game.id);
                navigate(`/arcade/${game.id}`);
              }}
            />
          </Fragment>
          // </Grid>
        );
      })}
    </div>
  </Container>
  );
}
