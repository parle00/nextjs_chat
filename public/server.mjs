import { createServer } from "http";
import { Server } from "socket.io";
import CryptoJS from "crypto-js";

const ENCRYPTION_KEY =
  "794315c0ec37ccf11869b641819ebb291f31dabe677a5f4a01d9631d5ece5650";

const roomUsers = new Map();

const encryptObject = (value) => {
  const encrypted = CryptoJS.AES.encrypt(
    JSON.stringify(value),
    ENCRYPTION_KEY
  ).toString();
  return encrypted;
};

const decryptObject = (value) => {
  const bytes = CryptoJS.AES.decrypt(value, ENCRYPTION_KEY);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(decrypted);
};

const encryptValue = (value) => {
  const encrypted = CryptoJS.AES.encrypt(value, ENCRYPTION_KEY).toString();
  return encrypted;
};

const httpServer = createServer((_, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end("<h1>server is running!</h1>");
});

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  socket.on("joinRoom", (payload) => {
    const decryptedPayload = decryptObject(payload);
    socket.join(decryptedPayload.roomId);

    if (!roomUsers.has(decryptedPayload.roomId)) {
      roomUsers.set(decryptedPayload.roomId, new Map());
    }

    const userInfo = {
      socketId: socket.id,
      name: decryptedPayload.name,
    };

    roomUsers.get(decryptedPayload.roomId).set(userInfo.socketId, userInfo);

    io.to(decryptedPayload.roomId).emit(
      "joinStatus",
      encryptObject({
        users: Array.from(roomUsers.get(decryptedPayload.roomId).values()),
        message: `${decryptedPayload.name} joined the room.`,
      })
    );
  });

  socket.on("sendMessage", (payload) => {
    const decryptedPayload = decryptObject(payload);

    socket
      .to(decryptedPayload.roomId)
      .emit("message", encryptObject({ ...decryptedPayload, sender: false }));
  });

  // socket.on("leaveRoom", (payload) => {
  //   const decryptedPayload = decryptObject(payload);
  //   socket.leave(decryptedPayload.roomId);
  // });

  socket.on("disconnect", () => {
    let roomId;
    let userName;
    roomUsers.forEach((users, room) => {
      if (users.has(socket.id)) {
        roomId = room;
        const user = users.get(socket.id);
        userName = user.name;
        users.delete(socket.id);
      }
    });

    if (roomId) {
      io.to(roomId).emit(
        "joinStatus",
        encryptObject({
          users: Array.from(roomUsers.get(roomId).values()),
          message: `${userName} left the room.`,
        })
      );
      const remainingUsers = Array.from(roomUsers.get(roomId).values());

      if (remainingUsers.length === 0) {
        roomUsers.delete(roomId);
        socket.leave(roomId);
      }
    } else {
      console.log(`User ${userName} could not be found in any room.`);
    }
  });
});

const PORT = 5001;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server is running: http://localhost:${PORT}`);
});
