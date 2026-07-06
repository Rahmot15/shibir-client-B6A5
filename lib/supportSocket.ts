"use client";

import { io, type Socket } from "socket.io-client";

type JoinConversationPayload = {
  conversationId: string;
};

type ReceiveMessagePayload = {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  isSeen: boolean;
  createdAt: string;
  sender: {
    id: string;
    name: string | null;
    email: string;
    role: "ADMIN" | "ASSOCIATE" | "MEMBER" | "SUPPORTER" | "WORKER";
  };
};

type MessagesSeenPayload = {
  conversationId: string;
  seenByUserId: string;
  count: number;
};

type ServerToClientEvents = {
  conversation_joined: (payload: JoinConversationPayload) => void;
  receive_message: (payload: ReceiveMessagePayload) => void;
  messages_seen: (payload: MessagesSeenPayload) => void;
};

type ClientToServerEvents = {
  join_conversation: (payload: JoinConversationPayload | string) => void;
};

let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

const getSocketUrl = () => {
  if (typeof window !== "undefined") {
    const { hostname, origin } = window.location;

    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "http://localhost:5000";
    }

    return process.env.NEXT_PUBLIC_SOCKET_URL || process.env.NEXT_PUBLIC_BACKEND_URL || origin;
  }

  return process.env.NEXT_PUBLIC_SOCKET_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
};

export const getSupportSocket = () => {
  if (!socket) {
    socket = io(getSocketUrl(), {
      autoConnect: false,
      withCredentials: true,
      transports: ["websocket", "polling"],
    });
  }

  return socket;
};

export const connectSupportSocket = () => {
  const activeSocket = getSupportSocket();

  if (!activeSocket.connected) {
    activeSocket.connect();
  }

  return activeSocket;
};

export const disconnectSupportSocket = () => {
  if (!socket) {
    return;
  }

  socket.disconnect();
  socket = null;
};

export const joinSupportConversationRoom = (conversationId: string) => {
  const activeSocket = connectSupportSocket();
  activeSocket.emit("join_conversation", { conversationId });
  return activeSocket;
};
