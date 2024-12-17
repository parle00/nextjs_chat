"use client";

import React, {
  useEffect,
  useState,
  createContext,
  useContext,
  ReactNode,
} from "react";

import { ROOM_STORAGE } from "@/services/const";

interface RoomType {
  roomname: string;
  name: string;
}

const RoomContext = createContext<{
  roomValue: RoomType | null;
  isRoomDataLoading: boolean;
  setRoomValue: (user: RoomType | null) => void;
  setIsRoomDataLoading: React.Dispatch<React.SetStateAction<boolean>>;
} | null>(null);

interface UserProviderProps {
  children: ReactNode;
}

export const RoomProvider = ({ children }: UserProviderProps) => {
  const [roomValue, setRoomValue] = useState<RoomType | null>(() => {
    if (typeof window !== "undefined") {
      const room = sessionStorage.getItem(ROOM_STORAGE);
      return room ? JSON.parse(room) : null;
    }
    return null;
  });

  const [isRoomDataLoading, setIsRoomDataLoading] = useState(true);

  useEffect(() => {
    setIsRoomDataLoading(false);
  }, []);

  useEffect(() => {
    if (roomValue) {
      sessionStorage.setItem(ROOM_STORAGE, JSON.stringify(roomValue));
    } else if (roomValue === null) {
      sessionStorage.clear();
    }
  }, [roomValue]);

  return (
    <RoomContext.Provider
      value={{
        roomValue,
        isRoomDataLoading,
        setRoomValue,
        setIsRoomDataLoading,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export const useRoomContext = () => {
  const context = useContext(RoomContext);

  useEffect(() => {
    if (context?.roomValue === null) {
      localStorage.removeItem(ROOM_STORAGE);
    }
  }, [context?.roomValue]);

  if (!context) {
    throw new Error("useRoomContext must be used within a RoomProvider");
  }

  return context;
};
