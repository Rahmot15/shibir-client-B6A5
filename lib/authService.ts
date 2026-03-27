const API_BASE = "http://localhost:5000/api/v1";

type ApiResponse<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
};

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

export type UserData = {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
};

export async function registerUser(
  payload: RegisterPayload
): Promise<ApiResponse<UserData>> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    return {
      success: false,
      message: data?.message || "নিবন্ধন ব্যর্থ হয়েছে",
    };
  }

  return data as ApiResponse<UserData>;
}

export async function loginUser(
  payload: LoginPayload
): Promise<ApiResponse<UserData>> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    return {
      success: false,
      message: data?.message || "লগইন ব্যর্থ হয়েছে",
    };
  }

  return data as ApiResponse<UserData>;
}

export async function getMe(): Promise<ApiResponse<UserData>> {
  const res = await fetch(`${API_BASE}/auth/me`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    return {
      success: false,
      message: data?.message || "ব্যবহারকারীর তথ্য পাওয়া যায়নি",
    };
  }

  return data as ApiResponse<UserData>;
}

export async function logoutUser(): Promise<ApiResponse<null>> {
  const res = await fetch(`${API_BASE}/auth/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    return {
      success: false,
      message: data?.message || "লগআউট ব্যর্থ হয়েছে",
    };
  }

  return data as ApiResponse<null>;
}
