import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export function useSocket(onConnect?: (socket: Socket) => void, onDisconnect?: () => void) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io();
    socketRef.current = socket;

    socket.on("connect", () => {
      onConnect && onConnect(socket);
    });

    socket.on("disconnect", () => {
      onDisconnect && onDisconnect();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return socketRef;
}