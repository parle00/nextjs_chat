"use client";

import { GlobalStyles } from "@mui/material";
import dynamic from "next/dynamic";
import React from "react";
const CustomJitsiMeeting = dynamic(
  () => import("@/component/CustomJitsiMeeting"),
  {
    ssr: false,
    loading: () => <p>Loading Jitsi...</p>,
  }
);

const VideoChatView = () => {
  return (
    <>
      <GlobalStyles styles={{ body: { overflowY: "hidden" } }} />
      <CustomJitsiMeeting />
    </>
  );
};

export default VideoChatView;
