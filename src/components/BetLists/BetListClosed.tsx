import React from 'react';
import { TableContainer, Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { PortfolioItem } from 'src/interfaces/portfolio';

interface IProps {
  items: PortfolioItem[];
}

export default function BetListClosed({ items }: IProps) {

  return (
    <TableContainer component={Paper}>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center">Match</TableCell>
            <TableCell align="center">Prediction</TableCell>
            <TableCell align="center">Stake</TableCell>
            <TableCell align="center">Odds</TableCell>
            <TableCell align="center">Total price</TableCell>
            <TableCell align="center">Payout</TableCell>
            <TableCell align="center">Result</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item: PortfolioItem) => (
            <TableRow>
              <TableCell align="center">{item.match}</TableCell>
              <TableCell align="center">{item.prediction}</TableCell>
              <TableCell align="center">{item.stake}</TableCell>
              <TableCell align="center">{item.odds}</TableCell>
              <TableCell align="center">{item.totalPrice}</TableCell>
              <TableCell align="center">{item.potentialPayout}</TableCell>
              <TableCell align="center">{item.result}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

  );
}
