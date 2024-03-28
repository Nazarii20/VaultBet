import { Button, Grid } from "@mui/material";
import React from "react";
interface MultiplierHistoryProps {
  multiplierHistory: number[];
}
export function MultiplierHistory({
  multiplierHistory,
}: MultiplierHistoryProps) {
  return (
    // <div className="absolute right-4 top-40 flex w-16 flex-col gap-1 overflow-hidden rounded-md bg-background md:top-60">
    <Grid
      container
      item
      direction={{ md: "column", sm: "row" }}
      spacing={1}
      justifyContent="center"
    >
      {multiplierHistory.map((multiplier, index) => {
        if (index > 3 || !multiplier) return null;
        return (
          <Grid item>
            <Button
              size="small"
              style={{
                cursor: "default",
                textTransform: "none",
                color: "#FFFFFF",
                backgroundColor: "#8D27B3",
              }}
            >
              {multiplier}x
            </Button>
          </Grid>
        );
      })}
    </Grid>
  );
}
