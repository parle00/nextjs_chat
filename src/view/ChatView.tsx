"use client";
import useSocket from "@/hooks/useSocket";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Stack, TextField, IconButton, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useRoomContext } from "@/app/context/RoomContext";
import { MessagesType } from "@/model/message";
import { decryptMessage, encryptMessage, encryptValue } from "@/heplers/utils";
import { useRouter } from "next/navigation";
import Loading from "@/app/Loading";

const ChatView = () => {
  const { push } = useRouter();
  const { socket } = useSocket();
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<MessagesType[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  const { roomValue, isRoomDataLoading, setRoomValue } = useRoomContext();
  const [isLoading, setIsLoading] = useState(true);

  const scrollToBottom = () => {
    if (ref.current) {
      ref.current.scrollTo({
        top: ref.current.scrollHeight,
      });
    }
  };

  const handleSendMessage = () => {
    if (text.trim() && socket) {
      const payload: MessagesType = {
        sender: true,
        roomId: roomValue?.roomname as string,
        message: text.trim(),
        name: roomValue?.name as string,
        socketId: socket.id,
      };

      socket.emit("sendMessage", encryptMessage(payload));
      setMessages([...messages, payload]);

      setText("");
    }
  };

  const prepareRoom = useCallback(() => {
    try {
      socket?.emit(
        "joinRoom",
        encryptValue(
          JSON.stringify({
            roomId: roomValue?.roomname,
            name: roomValue?.name as string,
          })
        )
      );

      socket?.on("message", (msg: string) => {
        scrollToBottom();
        setMessages((prevState) => [
          ...prevState,
          {
            ...decryptMessage(msg),
          },
        ]);
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [roomValue, socket]);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  useEffect(() => {
    if (!isRoomDataLoading && !roomValue) {
      push("/");
    } else if (roomValue && socket) {
      prepareRoom();
    }
  }, [roomValue, socket, isRoomDataLoading]);

  useEffect(() => {
    return () => {
      setRoomValue(null);
    };
  }, []);

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
      {(isRoomDataLoading || isLoading) && <Loading />}
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
            justifyContent={msg.sender ? "flex-end" : "flex-start"}
            mb="10px"
          >
            <Stack
              direction="column"
              alignItems={msg.sender ? "flex-end" : "flex-start"}
              bgcolor={msg.sender ? "#1976d2" : "#e0e0e0"}
              color={msg.sender ? "white" : "black"}
              padding="8px 12px"
              maxWidth={{ xs: "80%", md: "60%" }}
              borderRadius="8px"
              gap="4px"
              sx={{
                wordBreak: "break-word",
              }}
            >
              <Typography
                variant="body2"
                fontWeight="bold"
                sx={{
                  alignSelf: msg.sender ? "flex-end" : "flex-start",
                  marginBottom: "4px",
                }}
              >
                {msg.name}
              </Typography>
              <Typography variant="body2">{msg.message}</Typography>
            </Stack>
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
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Mesajınızı yazın..."
        />
        <IconButton onClick={handleSendMessage} color="primary">
          <SendIcon />
        </IconButton>
      </Stack>
    </Stack>
  );
};

export default ChatView;
