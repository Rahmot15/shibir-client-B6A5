const API_BASE = "/api/v1"

type ApiResponse<T = unknown> = {
  success: boolean
  message: string
  data?: T
  meta?: { page: number; limit: number; total: number; totalPages: number }
}

/* ── Cart ── */

export type CartItemData = {
  id: string
  quantity: number
  issue: {
    id: string
    title: string
    slug: string
    coverImage: string
    finalPrice: number | string
    price: number | string
    currency: string
    stock: number
    isAvailable: boolean
    purchaseType: string
  }
}

export type CartData = {
  id: string
  items: CartItemData[]
  subtotal: number
}

export async function fetchCart(): Promise<CartData | null> {
  const res = await fetch(`${API_BASE}/cart`, { credentials: "include" })
  const data: ApiResponse<CartData> = await res.json()
  if (!data.success) return null
  return data.data ?? null
}

export async function addToCart(issueId: string, quantity = 1): Promise<CartData | null> {
  const res = await fetch(`${API_BASE}/cart`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ issueId, quantity }),
  })
  const data: ApiResponse<CartData> = await res.json()
  if (!data.success) throw new Error(data.message)
  return data.data ?? null
}

export async function updateCartItem(itemId: string, quantity: number): Promise<CartData | null> {
  const res = await fetch(`${API_BASE}/cart/${itemId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ quantity }),
  })
  const data: ApiResponse<CartData> = await res.json()
  if (!data.success) throw new Error(data.message)
  return data.data ?? null
}

export async function removeCartItem(itemId: string): Promise<CartData | null> {
  const res = await fetch(`${API_BASE}/cart/${itemId}`, {
    method: "DELETE",
    credentials: "include",
  })
  const data: ApiResponse<CartData> = await res.json()
  if (!data.success) throw new Error(data.message)
  return data.data ?? null
}

/* ── Orders ── */

export type OrderItemData = {
  id: string
  title: string
  coverImage: string
  unitPrice: number | string
  quantity: number
  total: number | string
}

export type OrderData = {
  id: string
  status: string
  subtotal: number | string
  discount: number | string
  total: number | string
  currency: string
  shippingName: string
  shippingPhone: string
  shippingAddress: string
  notes?: string
  items: OrderItemData[]
  createdAt: string
}

export type CheckoutPayload = {
  shippingName: string
  shippingPhone: string
  shippingAddress: string
  notes?: string
  issueId?: string
  quantity?: number
}

export async function createOrder(payload: CheckoutPayload): Promise<OrderData | null> {
  const res = await fetch(`${API_BASE}/orders/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  })
  const data: ApiResponse<OrderData> = await res.json()
  if (!data.success) throw new Error(data.message)
  return data.data ?? null
}

export async function fetchOrders(params?: { page?: number; status?: string }): Promise<{ orders: OrderData[]; meta: any } | null> {
  const query = new URLSearchParams()
  if (params?.page) query.set("page", String(params.page))
  if (params?.status) query.set("status", params.status)
  const res = await fetch(`${API_BASE}/orders?${query.toString()}`, { credentials: "include" })
  const data: ApiResponse<OrderData[]> = await res.json()
  if (!data.success) return null
  return { orders: data.data ?? [], meta: data.meta }
}

export async function fetchOrderById(id: string): Promise<OrderData | null> {
  const res = await fetch(`${API_BASE}/orders/${id}`, { credentials: "include" })
  const data: ApiResponse<OrderData> = await res.json()
  if (!data.success) return null
  return data.data ?? null
}
