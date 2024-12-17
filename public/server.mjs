import { createServer } from "http";
import { Server } from "socket.io";
import CryptoJS from "crypto-js";

const ENCRYPTION_KEY =
  "794315c0ec37ccf11869b641819ebb291f31dabe677a5f4a01d9631d5ece5650";

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

    socket
      .to(decryptedPayload.roomId)
      .emit(
        "joinStatus",
        encryptValue(`${decryptedPayload.name} odaya katıldı.`)
      );
  });

  socket.on("sendMessage", (payload) => {
    const decryptedPayload = decryptObject(payload);

    socket
      .to(decryptedPayload.roomId)
      .emit("message", encryptObject({ ...decryptedPayload, sender: false }));
  });

  // socket.on("leaveRoom", (room) => {
  //   socket.leave(room);
  //   console.log(`${socket.id} kullanıcısı ${room} odasından ayrıldı.`);
  //   socket.to(room).emit("message", `${socket.id} odadan ayrıldı.`);
  // });

  socket.on("disconnect", () => {
    console.log("Bir kullanıcı bağlantıyı kesti:", socket.id);
  });
});

const PORT = 5001;
httpServer.listen(PORT, () => {
  console.log(`🚀 Sunucu çalışıyor: http://localhost:${PORT}`);
});
