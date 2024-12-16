"use client";
import useSocket from "@/hooks/useSocket";
import React, { useEffect, useRef, useState } from "react";
import { Stack, Box, TextField, IconButton, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

interface Messages {
  id: string;
  message: string;
  inComing: boolean;
}

const HomeView = () => {
  const { socket } = useSocket();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Messages[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (ref.current) {
      ref.current.scrollTo({
        top: ref.current.scrollHeight,
      });
    }
  };

  const handleSendMessage = () => {
    if (message.trim() && socket) {
      const payload: Messages = {
        inComing: false,
        id: socket.id,
        message: message.trim(),
      };
      setMessages([...messages, payload]);
      scrollToBottom();
      socket.emit("reciveMessage", payload);
      setMessage("");
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on("reciveMessage", (msg: Messages) => {
        scrollToBottom();
        setMessages((prevState) => [
          ...prevState,
          {
            ...msg,
          },
        ]);
      });
    }
  }, [socket, ref]);

  return (
    <Stack
      margin="auto"
      height="calc(100vh - 40px)"
      sx={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "10px",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Stack
        ref={ref}
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          marginBottom: "10px",
          paddingRight: "5px",
        }}
      >
        {messages.map((msg, index) => (
          <Stack
            key={index}
            flexDirection="row"
            justifyContent={msg.inComing === false ? "flex-end" : "flex-start"}
            mb="10px"
          >
            <Box
              bgcolor={msg.inComing === false ? "#1976d2" : "#e0e0e0"}
              color={msg.inComing === false ? "white" : "black"}
              padding="8px 12px"
              maxWidth="60%"
              borderRadius="20px"
              sx={{
                wordBreak: "break-word",
              }}
            >
              <Typography variant="body2">{msg.message}</Typography>
            </Box>
          </Stack>
        ))}
      </Stack>

      <Stack flexDirection="row" alignItems="center">
        <TextField
          onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) => {
            if (event.key === "Enter") {
              event.preventDefault(); // Alt satıra geçmeyi engeller
              handleSendMessage(); // Mesajı gönderir
            }
          }}
          fullWidth
          variant="outlined"
          multiline
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Mesajınızı yazın..."
        />
        <IconButton onClick={handleSendMessage} color="primary">
          <SendIcon />
        </IconButton>
      </Stack>
    </Stack>
  );
};

export default HomeView;
