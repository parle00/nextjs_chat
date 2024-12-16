import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end("<h1>server is running!</h1>");
});

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("✅ Bir istemci bağlandı!");

  socket.on("reciveMessage", (message) => {
    socket.broadcast.emit("reciveMessage", { ...message, inComing: true });
  });

  socket.on("disconnect", (reason) => {
    console.log(`❌ Bağlantı kesildi: ${reason}`);
  });
});

// Sunucuyu başlat
const PORT = 3001;
httpServer.listen(PORT, () => {
  console.log(`🚀 Sunucu çalışıyor: http://localhost:${PORT}`);
});
