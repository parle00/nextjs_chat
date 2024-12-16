// types/socket-io.d.ts

declare module "socket.io-client" {
  import { Socket } from "socket.io-client";
  const io: (url: string, options?: any) => SocketIOClient.Socket;
  export { io };
}
