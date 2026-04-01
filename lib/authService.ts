const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
const API_BASE = `${BACKEND_URL}/api/v1`;

async function parseJsonSafe<T = unknown>(res: Response): Promise<T | null> {
  try {
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

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
  createdAt?: string;
  updatedAt?: string;
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

  const data = await parseJsonSafe<ApiResponse<UserData>>(res);

  if (!res.ok) {
    return {
      success: false,
      message: data?.message || "নিবন্ধন ব্যর্থ হয়েছে",
    };
  }

  return (
    data || {
      success: false,
      message: "নিবন্ধন ব্যর্থ হয়েছে",
    }
  );
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

  const data = await parseJsonSafe<ApiResponse<UserData>>(res);

  if (!res.ok) {
    return {
      success: false,
      message: data?.message || "লগইন ব্যর্থ হয়েছে",
    };
  }

  return (
    data || {
      success: false,
      message: "লগইন ব্যর্থ হয়েছে",
    }
  );
}

export async function getMe(): Promise<ApiResponse<UserData>> {
  const res = await fetch(`${API_BASE}/auth/me`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  const data = await parseJsonSafe<ApiResponse<UserData>>(res);

  if (!res.ok) {
    return {
      success: false,
      message: data?.message || "ব্যবহারকারীর তথ্য পাওয়া যায়নি",
    };
  }

  return (
    data || {
      success: false,
      message: "ব্যবহারকারীর তথ্য পাওয়া যায়নি",
    }
  );
}

export async function logoutUser(): Promise<ApiResponse<null>> {
  const res = await fetch(`${API_BASE}/auth/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  const data = await parseJsonSafe<ApiResponse<null>>(res);

  if (!res.ok) {
    return {
      success: false,
      message: data?.message || "লগআউট ব্যর্থ হয়েছে",
    };
  }

  return (
    data || {
      success: false,
      message: "লগআউট ব্যর্থ হয়েছে",
    }
  );
}
