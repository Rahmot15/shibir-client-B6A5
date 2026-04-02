const BASE_URL = "/api/v1/users";
const USERS_CACHE_TTL_MS = 30 * 1000;

let cachedUsers: ManagedUser[] | null = null;
let usersCacheExpiresAt = 0;
let usersRequestInFlight: Promise<ManagedUser[]> | null = null;

export type UserRole = "ADMIN" | "ASSOCIATE" | "MEMBER" | "SUPPORTER" | "WORKER";

export type ManagedUser = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: UserRole;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

const parseJsonSafe = async <T>(response: Response): Promise<T | null> => {
  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
};

export const invalidateUsersCache = () => {
  cachedUsers = null;
  usersCacheExpiresAt = 0;
};

export const getAllUsers = async (forceRefresh = false): Promise<ManagedUser[]> => {
  const now = Date.now();

  if (!forceRefresh && cachedUsers && now < usersCacheExpiresAt) {
    return cachedUsers;
  }

  if (!forceRefresh && usersRequestInFlight) {
    return usersRequestInFlight;
  }

  usersRequestInFlight = (async () => {
    const response = await fetch(BASE_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      cache: "no-store",
    });

    const data = await parseJsonSafe<ApiResponse<ManagedUser[]>>(response);

    if (!response.ok || !data?.success) {
      throw new Error(data?.message || "Failed to fetch users");
    }

    cachedUsers = data.data;
    usersCacheExpiresAt = Date.now() + USERS_CACHE_TTL_MS;

    return data.data;
  })();

  try {
    return await usersRequestInFlight;
  } finally {
    usersRequestInFlight = null;
  }
};

export const updateUserRole = async (id: string, role: UserRole) => {
  const response = await fetch(`${BASE_URL}/${id}/role`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ role }),
  });

  const data = await parseJsonSafe<ApiResponse<{ id: string; role: UserRole }>>(response);

  if (!response.ok || !data?.success) {
    throw new Error(data?.message || "Failed to update user role");
  }

  invalidateUsersCache();

  return data.data;
};

export const setUserEmailVerified = async (id: string, emailVerified: boolean) => {
  const response = await fetch(`${BASE_URL}/${id}/email-verified`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ emailVerified }),
  });

  const data = await parseJsonSafe<ApiResponse<{ id: string; emailVerified: boolean }>>(response);

  if (!response.ok || !data?.success) {
    throw new Error(data?.message || "Failed to update user status");
  }

  invalidateUsersCache();

  return data.data;
};
