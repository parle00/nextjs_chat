import type { Metadata } from "next";
import "./globals.css";
import { RoomProvider } from "./context/RoomContext";

export const metadata: Metadata = {
  title: "NEXT-CHAT",
  description: "developed by yunus emre çıracı",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body>
        <RoomProvider>{children}</RoomProvider>
      </body>
    </html>
  );
}
