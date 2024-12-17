import { SOCKET_SERVER_URL } from "@/services/const";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

interface UseSocketReturn {
  socket: SocketIOClient.Socket | null;
  onDisconnect: () => void;
}

const useSocket = (): UseSocketReturn => {
  const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);

  const onDisconnect = () => {
    if (socket) {
      socket.disconnect();
    }
  };

  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL, {
      transports: ["websocket"],
    });

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return { socket, onDisconnect };
};

export default useSocket;
