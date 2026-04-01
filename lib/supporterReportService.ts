const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
const API_BASE = `${BACKEND_URL}/api/v1`;

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

export type NumericMetric =
  | "QURAN"
  | "HADITH"
  | "ISLAMIC_BOOK"
  | "TEXTBOOK_HOURS"
  | "FRIENDS_CONTACT"
  | "GOODWORK_HOURS"
  | "NAMAZ_JAMAAT"
  | "NAMAZ_QAZA";

export type CheckboxMetric = "CLASS" | "SELFCRIT" | "SPORTS" | "NEWSPAPER";

export type SaveSupporterReportPayload = {
  month: string;
  name?: string;
  school?: string;
  numericEntries: {
    metric: NumericMetric;
    day: number;
    value: number;
  }[];
  checkboxEntries: {
    metric: CheckboxMetric;
    day: number;
    checked: boolean;
  }[];
};

export type SupporterReportDetails = {
  id: string;
  month: string;
  name: string | null;
  school: string | null;
  submittedAt: string;
  numericEntries: {
    metric: NumericMetric;
    day: number;
    value: string | number;
  }[];
  checkboxEntries: {
    metric: CheckboxMetric;
    day: number;
    checked: boolean;
  }[];
  advices: {
    id: string;
    text: string;
    createdAt: string;
  }[];
};

export type SupporterReportHistoryItem = {
  id: string;
  month: string;
  name: string | null;
  school: string | null;
  submittedAt: string;
  _count: {
    numericEntries: number;
    checkboxEntries: number;
    advices: number;
  };
};

export async function saveOrUpdateMyReport(
  payload: SaveSupporterReportPayload
): Promise<ApiResponse<SupporterReportDetails>> {
  const res = await fetch(`${API_BASE}/supporter-report/my`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    cache: "no-store",
    body: JSON.stringify(payload),
  });

  const data = await parseJsonSafe<ApiResponse<SupporterReportDetails>>(res);

  if (!res.ok) {
    return {
      success: false,
      message: data?.message || "রিপোর্ট সেভ করা যায়নি",
    };
  }

  return data || { success: false, message: "রিপোর্ট সেভ করা যায়নি" };
}

export async function getMyReportHistory(): Promise<
  ApiResponse<SupporterReportHistoryItem[]>
> {
  const res = await fetch(`${API_BASE}/supporter-report/my/history`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    cache: "no-store",
  });

  const data = await parseJsonSafe<ApiResponse<SupporterReportHistoryItem[]>>(res);

  if (!res.ok) {
    return {
      success: false,
      message: data?.message || "রিপোর্ট হিস্ট্রি পাওয়া যায়নি",
    };
  }

  return data || { success: false, message: "রিপোর্ট হিস্ট্রি পাওয়া যায়নি" };
}

export async function getMyReportById(
  reportId: string
): Promise<ApiResponse<SupporterReportDetails>> {
  const res = await fetch(`${API_BASE}/supporter-report/my/${reportId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    cache: "no-store",
  });

  const data = await parseJsonSafe<ApiResponse<SupporterReportDetails>>(res);

  if (!res.ok) {
    return {
      success: false,
      message: data?.message || "রিপোর্ট পাওয়া যায়নি",
    };
  }

  return data || { success: false, message: "রিপোর্ট পাওয়া যায়নি" };
}

export async function getMyReportByMonth(
  month: string
): Promise<ApiResponse<SupporterReportDetails>> {
  const res = await fetch(
    `${API_BASE}/supporter-report/my/by-month?month=${encodeURIComponent(month)}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      cache: "no-store",
    }
  );

  const data = await parseJsonSafe<ApiResponse<SupporterReportDetails>>(res);

  if (!res.ok) {
    return {
      success: false,
      message: data?.message || "এই মাসের রিপোর্ট পাওয়া যায়নি",
    };
  }

  return data || { success: false, message: "এই মাসের রিপোর্ট পাওয়া যায়নি" };
}

export async function deleteMyReport(
  reportId: string
): Promise<ApiResponse<null>> {
  const res = await fetch(`${API_BASE}/supporter-report/my/${reportId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    cache: "no-store",
  });

  const data = await parseJsonSafe<ApiResponse<null>>(res);

  if (!res.ok) {
    return {
      success: false,
      message: data?.message || "রিপোর্ট ডিলিট করা যায়নি",
    };
  }

  return data || { success: false, message: "রিপোর্ট ডিলিট করা যায়নি" };
}

export async function addAdvice(
  reportId: string,
  text: string
): Promise<ApiResponse<{ id: string; text: string; createdAt: string }>> {
  const res = await fetch(`${API_BASE}/supporter-report/${reportId}/advice`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    cache: "no-store",
    body: JSON.stringify({ text }),
  });

  const data = await parseJsonSafe<ApiResponse<{ id: string; text: string; createdAt: string }>>(res);

  if (!res.ok) {
    return {
      success: false,
      message: data?.message || "পরামর্শ সেভ করা যায়নি",
    };
  }

  return data || { success: false, message: "পরামর্শ সেভ করা যায়নি" };
}

export async function getAdviceList(
  reportId: string
): Promise<ApiResponse<{ id: string; text: string; createdAt: string }[]>> {
  const res = await fetch(`${API_BASE}/supporter-report/${reportId}/advice`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    cache: "no-store",
  });

  const data = await parseJsonSafe<ApiResponse<{ id: string; text: string; createdAt: string }[]>>(res);

  if (!res.ok) {
    return {
      success: false,
      message: data?.message || "পরামর্শ তালিকা পাওয়া যায়নি",
    };
  }

  return data || { success: false, message: "পরামর্শ তালিকা পাওয়া যায়নি" };
}
