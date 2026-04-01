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

export type WorkerNumericMetric =
  | "QURAN_AYAH"
  | "HADITH_COUNT"
  | "SAHITYA_PAGE"
  | "TEXTBOOK_HOURS"
  | "NAMAZ_JAMAAT"
  | "NAMAZ_QAZA"
  | "CONTACT_MEMBER"
  | "CONTACT_SATHI"
  | "CONTACT_KORMI"
  | "CONTACT_SOMORTHOK"
  | "CONTACT_BONDHU"
  | "CONTACT_MEDHABI"
  | "CONTACT_VORTAKANGKHI"
  | "CONTACT_MUHARRAMA"
  | "DIST_SAHITYA"
  | "DIST_MAGAZINE"
  | "DIST_STICKER_CARD"
  | "DIST_UPOHAR"
  | "ORG_DAWATI"
  | "ORG_SANGOTHONIK";

export type WorkerCheckboxMetric =
  | "CLASS"
  | "SPORTS"
  | "NEWSPAPER"
  | "SELFCRIT";

export type SaveWorkerReportPayload = {
  month: string;
  name?: string;
  institution?: string;
  thana?: string;
  zila?: string;
  phone?: string;
  planSnapshot?: Record<string, unknown>;
  numericEntries: {
    metric: WorkerNumericMetric;
    day: number;
    value: number;
  }[];
  checkboxEntries: {
    metric: WorkerCheckboxMetric;
    day: number;
    checked: boolean;
  }[];
};

export type SaveWorkerPlanPayload = {
  month: string;
  name?: string;
  institution?: string;
  thana?: string;
  zila?: string;
  phone?: string;
  planSnapshot?: Record<string, unknown>;
};

export type WorkerReportDetails = {
  id: string;
  month: string;
  reporterRole: "WORKER" | "MEMBER" | "ASSOCIATE";
  name: string | null;
  institution: string | null;
  thana: string | null;
  zila: string | null;
  phone: string | null;
  planSnapshot?: Record<string, unknown> | null;
  submittedAt: string;
  numericEntries: {
    metric: WorkerNumericMetric;
    day: number;
    value: string | number;
  }[];
  checkboxEntries: {
    metric: WorkerCheckboxMetric;
    day: number;
    checked: boolean;
  }[];
  advices: {
    id: string;
    text: string;
    createdAt: string;
    author?: {
      id: string;
      name: string | null;
      email: string;
      role: string;
    };
  }[];
};

export type WorkerReportHistoryItem = {
  id: string;
  month: string;
  reporterRole: "WORKER" | "MEMBER" | "ASSOCIATE";
  name: string | null;
  institution: string | null;
  thana: string | null;
  zila: string | null;
  submittedAt: string;
  _count: {
    numericEntries: number;
    checkboxEntries: number;
    advices: number;
  };
};

export async function saveOrUpdateMyWorkerReport(
  payload: SaveWorkerReportPayload
): Promise<ApiResponse<WorkerReportDetails>> {
  const res = await fetch(`${API_BASE}/worker-report/my`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    cache: "no-store",
    body: JSON.stringify(payload),
  });

  const data = await parseJsonSafe<ApiResponse<WorkerReportDetails>>(res);

  if (!res.ok) {
    return {
      success: false,
      message: data?.message || "রিপোর্ট সেভ করা যায়নি",
    };
  }

  return data || { success: false, message: "রিপোর্ট সেভ করা যায়নি" };
}

export async function saveOrUpdateMyWorkerPlan(
  payload: SaveWorkerPlanPayload
): Promise<ApiResponse<WorkerReportDetails>> {
  const res = await fetch(`${API_BASE}/worker-report/my/plan`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    cache: "no-store",
    body: JSON.stringify(payload),
  });

  const data = await parseJsonSafe<ApiResponse<WorkerReportDetails>>(res);

  if (!res.ok) {
    return {
      success: false,
      message: data?.message || "পরিকল্পনা সেভ করা যায়নি",
    };
  }

  return data || { success: false, message: "পরিকল্পনা সেভ করা যায়নি" };
}

export async function getMyWorkerReportHistory(): Promise<
  ApiResponse<WorkerReportHistoryItem[]>
> {
  const res = await fetch(`${API_BASE}/worker-report/my/history`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    cache: "no-store",
  });

  const data = await parseJsonSafe<ApiResponse<WorkerReportHistoryItem[]>>(res);

  if (!res.ok) {
    return {
      success: false,
      message: data?.message || "রিপোর্ট হিস্ট্রি পাওয়া যায়নি",
    };
  }

  return data || { success: false, message: "রিপোর্ট হিস্ট্রি পাওয়া যায়নি" };
}

export async function getMyWorkerReportById(
  reportId: string
): Promise<ApiResponse<WorkerReportDetails>> {
  const res = await fetch(`${API_BASE}/worker-report/my/${reportId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    cache: "no-store",
  });

  const data = await parseJsonSafe<ApiResponse<WorkerReportDetails>>(res);

  if (!res.ok) {
    return {
      success: false,
      message: data?.message || "রিপোর্ট পাওয়া যায়নি",
    };
  }

  return data || { success: false, message: "রিপোর্ট পাওয়া যায়নি" };
}

export async function getMyWorkerReportByMonth(
  month: string
): Promise<ApiResponse<WorkerReportDetails>> {
  const res = await fetch(
    `${API_BASE}/worker-report/my/by-month?month=${encodeURIComponent(month)}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      cache: "no-store",
    }
  );

  const data = await parseJsonSafe<ApiResponse<WorkerReportDetails>>(res);

  if (!res.ok) {
    return {
      success: false,
      message: data?.message || "এই মাসের রিপোর্ট পাওয়া যায়নি",
    };
  }

  return data || { success: false, message: "এই মাসের রিপোর্ট পাওয়া যায়নি" };
}

export async function deleteMyWorkerReport(
  reportId: string
): Promise<ApiResponse<null>> {
  const res = await fetch(`${API_BASE}/worker-report/my/${reportId}`, {
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

export async function addWorkerAdvice(
  reportId: string,
  text: string
): Promise<ApiResponse<{ id: string; text: string; createdAt: string }>> {
  const res = await fetch(`${API_BASE}/worker-report/${reportId}/advice`, {
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

export async function getWorkerAdviceList(
  reportId: string
): Promise<ApiResponse<{ id: string; text: string; createdAt: string }[]>> {
  const res = await fetch(`${API_BASE}/worker-report/${reportId}/advice`, {
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
