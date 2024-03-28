import React from 'react';
import { Paper, Box, Typography, TableContainer, Table, TableBody, TableCell, TableHead, TableRow, Button } from '@mui/material';
import { PortfolioItem } from 'src/interfaces/portfolio';
import { useConnect } from '@connect2ic/react';
import { IConnector } from '@connect2ic/core';
import { _SERVICE } from '@declarations/orderbook';

interface IProps {
  items: PortfolioItem[];
  isPending: boolean
}

async function cancelOrder(activeProvider: IConnector | undefined, orderbookActor: _SERVICE, orderId: bigint) {

  const cancelResult = await orderbookActor.cancelOrder(orderId)
  alert("Your Order was Sucessfully Cancelled")
  return cancelResult
}

export default function BetList({ items, isPending }: IProps) {
  const { activeProvider } = useConnect();

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
            <TableCell align="center">Potential payout</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item: PortfolioItem) => (
            <TableRow>
              <TableCell align="center">
                <Box>{item.match}</Box>
              </TableCell>
              <TableCell align="center">
                <Box>{item.prediction}</Box>
              </TableCell>
              <TableCell align="center">
                <Box>{item.stake}</Box>
              </TableCell>
              <TableCell align="center">
                <Box>{item.odds}</Box>
              </TableCell>
              <TableCell align="center">
                <Box>{item.totalPrice}</Box>
              </TableCell>
              <TableCell align="center">
                <Box>{item.potentialPayout}</Box>
              </TableCell>
              <TableCell align="center">
                {isPending ? (
                  <Button onClick={() => cancelOrder(activeProvider, item.orderbookActor, item.orderId)}>
                    <Typography variant="button">Cancel Order</Typography>
                  </Button>
                ) : null}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

  );
}
