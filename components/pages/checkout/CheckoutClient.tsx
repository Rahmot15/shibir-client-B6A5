"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeftIcon, CreditCardIcon, CheckCircleIcon,
  MapPinIcon, PhoneIcon, UserIcon, ShoppingBagIcon,
  Loader2Icon, PackageIcon,
} from "lucide-react"
import { toast } from "sonner"
import {
  fetchCart, createOrder,
  type CartData, type CheckoutPayload,
} from "@/lib/cartOrderService"

export default function CheckoutClient() {
  const router = useRouter()
  const [cart, setCart] = useState<CartData | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [orderDone, setOrderDone] = useState(false)
  const [orderId, setOrderId] = useState("")

  const [form, setForm] = useState<CheckoutPayload>({
    shippingName: "",
    shippingPhone: "",
    shippingAddress: "",
    notes: "",
  })

  useEffect(() => {
    fetchCart()
      .then((c) => {
        setCart(c)
        if (!c || c.items.length === 0) router.push("/kisorkontho")
      })
      .catch(() => router.push("/kisorkontho"))
      .finally(() => setLoading(false))
  }, [router])

  function updateField(key: keyof CheckoutPayload, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleOrder() {
    if (!form.shippingName.trim()) { toast.error("নাম লিখুন"); return }
    if (!form.shippingPhone.trim()) { toast.error("ফোন নম্বর লিখুন"); return }
    if (!form.shippingAddress.trim()) { toast.error("ঠিকানা লিখুন"); return }
    if (!cart || cart.items.length === 0) { toast.error("কার্ট খালি"); return }

    setSubmitting(true)
    try {
      const order = await createOrder({
        shippingName: form.shippingName,
        shippingPhone: form.shippingPhone,
        shippingAddress: form.shippingAddress,
        notes: form.notes,
      })
      if (order) {
        setOrderId(order.id)
        setOrderDone(true)
        toast.success("অর্ডার সফল হয়েছে!")
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "অর্ডার ব্যর্থ হয়েছে"
      toast.error(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050f08]">
        <Loader2Icon className="h-8 w-8 animate-spin text-emerald-400" />
      </div>
    )
  }

  if (orderDone) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050f08] px-4">
        <div className="w-full max-w-md rounded-2xl border border-emerald-500/20 bg-[#071310] p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10">
            <CheckCircleIcon className="h-8 w-8 text-emerald-400" />
          </div>
          <h1 className="text-xl font-bold text-emerald-300">অর্ডার সম্পন্ন!</h1>
          <p className="mt-2 text-sm text-white/40">আপনার অর্ডার সফলভাবে গ্রহণ করা হয়েছে।</p>
          <p className="mt-1 font-mono text-xs text-white/25">অর্ডার ID: {orderId.slice(0, 8)}...</p>
          <div className="mt-6 flex gap-3">
            <Link href="/kisorkontho"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-500/28 bg-emerald-500/8 py-3 text-sm font-bold text-emerald-400 transition-all hover:bg-emerald-500/16">
              <ShoppingBagIcon className="h-4 w-4" strokeWidth={2} /> আবার কিনুন
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const items = cart?.items || []
  const subtotal = cart?.subtotal || 0

  return (
    <main className="relative min-h-screen bg-[#050f08] pb-20 pt-24">
      <div className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 55% 45% at 20% 10%,rgba(0,200,83,0.07),transparent)" }} />

      <div className="relative mx-auto max-w-4xl px-4">

        <Link href="/kisorkontho"
          className="mb-6 inline-flex items-center gap-2 font-mono text-[11px] text-white/35 uppercase tracking-widest transition-colors hover:text-emerald-400">
          <ArrowLeftIcon className="h-3.5 w-3.5" strokeWidth={2} /> ফিরে যান
        </Link>

        <h1 className="mb-6 text-2xl font-bold text-emerald-50">চেকআউট</h1>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">

          {/* ── Shipping Form ── */}
          <div className="space-y-4 rounded-2xl border border-white/8 bg-[#071310] p-6">
            <h2 className="flex items-center gap-2 text-sm font-bold text-white/60">
              <MapPinIcon className="h-4 w-4 text-emerald-400" strokeWidth={2} />
              শিপিং তথ্য
            </h2>

            <div>
              <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-white/25">পুরো নাম</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/20" strokeWidth={1.8} />
                <input type="text" value={form.shippingName}
                  onChange={(e) => updateField("shippingName", e.target.value)}
                  placeholder="আপনার নাম"
                  className="w-full rounded-xl border border-white/10 bg-[#050f08] py-3 pl-10 pr-4 text-sm text-white/70 placeholder:text-white/20 focus:border-emerald-500/40 focus:outline-none" />
              </div>
            </div>

            <div>
              <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-white/25">ফোন নম্বর</label>
              <div className="relative">
                <PhoneIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/20" strokeWidth={1.8} />
                <input type="tel" value={form.shippingPhone}
                  onChange={(e) => updateField("shippingPhone", e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full rounded-xl border border-white/10 bg-[#050f08] py-3 pl-10 pr-4 text-sm text-white/70 placeholder:text-white/20 focus:border-emerald-500/40 focus:outline-none" />
              </div>
            </div>

            <div>
              <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-white/25">ডেলিভারি ঠিকানা</label>
              <textarea value={form.shippingAddress}
                onChange={(e) => updateField("shippingAddress", e.target.value)}
                placeholder="বাসা, রোড, এলাকা, শহর..."
                rows={3}
                className="w-full rounded-xl border border-white/10 bg-[#050f08] px-4 py-3 text-sm text-white/70 placeholder:text-white/20 focus:border-emerald-500/40 focus:outline-none" />
            </div>

            <div>
              <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-white/25">অতিরিক্ত নোট (ঐচ্ছিক)</label>
              <input type="text" value={form.notes || ""}
                onChange={(e) => updateField("notes", e.target.value)}
                placeholder="বিশেষ নির্দেশনা..."
                className="w-full rounded-xl border border-white/10 bg-[#050f08] px-4 py-3 text-sm text-white/70 placeholder:text-white/20 focus:border-emerald-500/40 focus:outline-none" />
            </div>
          </div>

          {/* ── Order Summary ── */}
          <div className="space-y-4 rounded-2xl border border-white/8 bg-[#071310] p-6">
            <h2 className="flex items-center gap-2 text-sm font-bold text-white/60">
              <PackageIcon className="h-4 w-4 text-emerald-400" strokeWidth={2} />
              অর্ডার সামারি ({items.length} টি)
            </h2>

            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 rounded-xl border border-white/5 bg-white/2 p-3">
                  <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-lg">
                    <Image src={item.issue.coverImage} alt={item.issue.title} fill
                      sizes="48px" className="object-cover" unoptimized />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-xs font-semibold text-white/70">{item.issue.title}</p>
                    <p className="font-mono text-[10px] text-white/25">পরিমাণ: {item.quantity}</p>
                  </div>
                  <p className="shrink-0 font-mono text-xs font-bold text-emerald-400">
                    ৳{Number(item.issue.finalPrice) * item.quantity}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-white/5 pt-4 space-y-2">
              <div className="flex justify-between text-xs text-white/30">
                <span>সাবটোটাল</span>
                <span className="font-mono">৳{subtotal}</span>
              </div>
              <div className="flex justify-between text-xs text-white/30">
                <span>ডেলিভারি</span>
                <span className="font-mono text-emerald-400">ফ্রি</span>
              </div>
              <div className="flex justify-between border-t border-white/5 pt-2 text-sm font-bold text-white/60">
                <span>মোট</span>
                <span className="font-mono text-emerald-300">৳{subtotal}</span>
              </div>
            </div>

            <button onClick={handleOrder} disabled={submitting}
              className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold transition-all ${
                submitting
                  ? "cursor-not-allowed border border-white/5 bg-white/5 text-white/20"
                  : "border border-amber-500/35 bg-amber-500/12 text-amber-300 hover:border-amber-500/60 hover:bg-amber-500/22 hover:shadow-[0_0_20px_rgba(251,191,36,0.12)]"
              }`}>
              {submitting
                ? <><Loader2Icon className="h-4 w-4 animate-spin" /> প্রক্রিয়া হচ্ছে...</>
                : <><CreditCardIcon className="h-4 w-4" strokeWidth={2} /> অর্ডার কনফার্ম করুন</>
              }
            </button>

            <p className="text-center font-mono text-[10px] text-white/20">
              পেমেন্ট পরবর্তী ধাপে সম্পন্ন হবে
            </p>
          </div>

        </div>
      </div>
    </main>
  )
}
