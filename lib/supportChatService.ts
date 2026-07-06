const getSupportApiBase = () => {
  if (typeof window !== "undefined") {
    const { hostname, origin } = window.location;

    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "http://localhost:5000/api/v1/support";
    }

    return `${origin}/api/v1/support`;
  }

  return `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"}/api/v1/support`;
};

type ApiResponse<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
};

async function parseJsonSafe<T = unknown>(res: Response): Promise<T | null> {
  try {
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export type ConversationType = "VIVA_HELP" | "EXAM_HELP" | "GENERAL_SUPPORT";
export type UserRole = "ADMIN" | "ASSOCIATE" | "MEMBER" | "SUPPORTER" | "WORKER";

export type SupportParticipant = {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
};

export type SupportMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  isSeen: boolean;
  createdAt: string;
  sender: SupportParticipant;
};

export type SupportConversation = {
  id: string;
  userId: string;
  adminId: string | null;
  type: ConversationType;
  createdAt: string;
  updatedAt: string;
  user: SupportParticipant;
  admin: SupportParticipant | null;
};

export type SupportConversationListItem = SupportConversation & {
  messages: SupportMessage[];
  _count: {
    messages: number;
  };
};

export type OpenSupportConversationPayload = {
  type: ConversationType;
};

export type SendSupportMessagePayload = {
  conversationId: string;
  text: string;
};

export async function openSupportConversation(
  payload: OpenSupportConversationPayload
): Promise<ApiResponse<SupportConversation>> {
  const res = await fetch(`${getSupportApiBase()}/conversations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    cache: "no-store",
    body: JSON.stringify(payload),
  });

  const data = await parseJsonSafe<ApiResponse<SupportConversation>>(res);

  if (!res.ok) {
    return {
      success: false,
      message: data?.message || "Support conversation open failed",
    };
  }

  return data || { success: false, message: "Support conversation open failed" };
}

export async function getMySupportConversations(): Promise<
  ApiResponse<SupportConversationListItem[]>
> {
  const res = await fetch(`${getSupportApiBase()}/conversations/my`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    cache: "no-store",
  });

  const data = await parseJsonSafe<ApiResponse<SupportConversationListItem[]>>(res);

  if (!res.ok) {
    return {
      success: false,
      message: data?.message || "Failed to fetch my support conversations",
    };
  }

  return data || { success: false, message: "Failed to fetch my support conversations" };
}

export async function getAdminSupportConversations(): Promise<
  ApiResponse<SupportConversationListItem[]>
> {
  const res = await fetch(`${getSupportApiBase()}/conversations/admin`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    cache: "no-store",
  });

  const data = await parseJsonSafe<ApiResponse<SupportConversationListItem[]>>(res);

  if (!res.ok) {
    return {
      success: false,
      message: data?.message || "Failed to fetch admin support inbox",
    };
  }

  return data || { success: false, message: "Failed to fetch admin support inbox" };
}

export async function getSupportConversationMessages(
  conversationId: string
): Promise<ApiResponse<SupportMessage[]>> {
  const res = await fetch(`${getSupportApiBase()}/conversations/${conversationId}/messages`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    cache: "no-store",
  });

  const data = await parseJsonSafe<ApiResponse<SupportMessage[]>>(res);

  if (!res.ok) {
    return {
      success: false,
      message: data?.message || "Failed to fetch support messages",
    };
  }

  return data || { success: false, message: "Failed to fetch support messages" };
}

export async function sendSupportMessage(
  payload: SendSupportMessagePayload
): Promise<ApiResponse<SupportMessage>> {
  const res = await fetch(`${getSupportApiBase()}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    cache: "no-store",
    body: JSON.stringify(payload),
  });

  const data = await parseJsonSafe<ApiResponse<SupportMessage>>(res);

  if (!res.ok) {
    return {
      success: false,
      message: data?.message || "Failed to send support message",
    };
  }

  return data || { success: false, message: "Failed to send support message" };
}

export type MarkSupportSeenResponse = {
  count: number;
};

export async function markSupportConversationSeen(
  conversationId: string
): Promise<ApiResponse<MarkSupportSeenResponse>> {
  const res = await fetch(`${getSupportApiBase()}/conversations/${conversationId}/seen`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    cache: "no-store",
  });

  const data = await parseJsonSafe<ApiResponse<MarkSupportSeenResponse>>(res);

  if (!res.ok) {
    return {
      success: false,
      message: data?.message || "Failed to mark support conversation as seen",
    };
  }

  return data || {
    success: false,
    message: "Failed to mark support conversation as seen",
  };
}
