import { CircularProgress, GlobalStyles, Stack, SxProps } from "@mui/material";
import React from "react";

function GradientCircularProgress({ sx }: { sx?: SxProps }) {
  return (
    <React.Fragment>
      <svg width={0} height={0}>
        <defs>
          <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e01cd5" />
            <stop offset="100%" stopColor="#1CB5E0" />
          </linearGradient>
        </defs>
      </svg>
      <CircularProgress
        sx={{ "svg circle": { stroke: "url(#my_gradient)" }, ...sx }}
      />
    </React.Fragment>
  );
}

const Loading = () => {
  return (
    <Stack
      width="100%"
      top={0}
      left={0}
      minHeight="100vh"
      bgcolor="#222222"
      position="fixed"
      zIndex={9999}
      justifyContent="center"
      alignItems="center"
    >
      <GlobalStyles styles={{ body: { overflowY: "auto" } }} />
      <GradientCircularProgress />
    </Stack>
  );
};

export default Loading;
