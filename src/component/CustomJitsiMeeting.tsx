import React from "react";
import { JitsiMeeting } from "@jitsi/react-sdk";

const CustomJitsiMeeting = () => {
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <JitsiMeeting
        domain="meet.jit.si"
        roomName="CustomRoom"
        configOverwrite={{
          startWithAudioMuted: true,
          startWithVideoMuted: false,
          disableModeratorIndicator: true,
          enableEmailInStats: false,
          prejoinPageEnabled: false,
          defaultLanguage: "tr",
        }}
        interfaceConfigOverwrite={{
          SHOW_JITSI_WATERMARK: false,
          SHOW_BRAND_WATERMARK: false,
          SHOW_POWERED_BY: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          DEFAULT_BACKGROUND: "#000000",
          TOOLBAR_BUTTONS: [
            "microphone",
            "camera",
            "closedcaptions",
            "desktop",
            "fullscreen",
            "hangup",
            "chat",
            "settings",
            "raisehand",
            "tileview",
          ],
          VIDEO_QUALITY_LABEL_DISABLED: false,
        }}
        getIFrameRef={(iframeRef) => {
          iframeRef.style.height = "100vh";
          iframeRef.style.border = "none";
        }}
      />
    </div>
  );
};

export default CustomJitsiMeeting;
