// import { Card, CardContent, CardActions, Box } from '@mui/material';
import React from 'react';
import crashcard from '@assets/images/crash.png';
import busride from '@assets/images/ride-the-bus.png';
import plinko from '@assets/images/plinko.png'
import { ArcadeGame } from 'src/interfaces/arcadeGame';


const icons: { [key: number]: string } = {
  1: crashcard,
  2: busride,
  3: plinko
};
interface IProps {
	onClick: () => void;
  game: ArcadeGame;
}

export default function ArcadeGameCard({ onClick, game }: IProps) {
  const iconPath: string | undefined = icons[game.id];
	return (
    // <Card
    //   sx={{
    //     cursor: 'pointer',
    //     // padding: 2,
    //     // backgroundColor: "#000000",
    //     // borderRadius: '40px',
    //     // border: '3px solid #ffffff',
    //     overflow: 'hidden',
    //     width: '200px', // Adjust the width to make the card smaller
    //     transition: 'border-color 0.3s', // Add transition for smooth hover effect
    //     '&:hover': {
    //       borderColor: 'rgba(255, 255, 255, 0.1)', // Change the color of the outside rim when hovering over the card
    //     },
    //   }}
    //   onClick={onClick}
    // >
      // {/* <CardContent></CardContent> */}
      // {/* <CardActions sx={{ pt: 0 }}>
      //   <Box
      //     sx={{
      //       display: 'flex',
      //       flexGrow: 1,
      //       justifyContent: 'center',
      //       maxHeight: '100%',
      //     }}
      //   > */}
        <div style={{ cursor: 'pointer' }} onClick={onClick}>
          <img src={iconPath} style={{ maxHeight: '300px' }} />
        </div>

    //     {/* </Box>
    //   </CardActions> */}
    // // </Card>
	);
}