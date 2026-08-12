"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeftIcon, TrashIcon, PlusIcon, MinusIcon,
  ShoppingBagIcon, CreditCardIcon, Loader2Icon, ShoppingCartIcon,
} from "lucide-react"
import { toast } from "sonner"
import {
  fetchCart, updateCartItem, removeCartItem,
  type CartData,
} from "@/lib/cartOrderService"

export default function CartClient() {
  const router = useRouter()
  const [cart, setCart] = useState<CartData | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    fetchCart()
      .then((c) => {
        setCart(c)
        if (!c || c.items.length === 0) {
          toast.message("কার্ট খালি", { description: "কিছু কিনুন প্রথমে!" })
        }
      })
      .catch(() => toast.error("কার্ট লোড করা যায়নি"))
      .finally(() => setLoading(false))
  }, [])

  async function handleUpdateQty(itemId: string, qty: number) {
    if (qty < 1) return handleRemove(itemId)
    setUpdating(itemId)
    try {
      const updated = await updateCartItem(itemId, qty)
      if (updated) setCart(updated)
    } catch (e: any) {
      toast.error(e.message || "আপডেট করা যায়নি")
    } finally {
      setUpdating(null)
    }
  }

  async function handleRemove(itemId: string) {
    setUpdating(itemId)
    try {
      const updated = await removeCartItem(itemId)
      if (updated) setCart(updated)
      toast.success("আইটেম সরানো হয়েছে")
    } catch (e: any) {
      toast.error(e.message || "সরানো যায়নি")
    } finally {
      setUpdating(null)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050f08]">
        <Loader2Icon className="h-8 w-8 animate-spin text-emerald-400" />
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
          <ArrowLeftIcon className="h-3.5 w-3.5" strokeWidth={2} /> শপিং চালিয়ে যান
        </Link>

        <h1 className="mb-6 flex items-center gap-3 text-2xl font-bold text-emerald-50">
          <ShoppingCartIcon className="h-6 w-6 text-emerald-400" strokeWidth={2} />
          কার্ট ({items.length} টি)
        </h1>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-white/8 bg-[#071310] p-12 text-center">
            <ShoppingBagIcon className="mx-auto mb-4 h-12 w-12 text-white/10" strokeWidth={1.5} />
            <p className="text-sm text-white/30">কার্টে কোনো আইটেম নেই</p>
            <Link href="/kisorkontho"
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-emerald-500/28 bg-emerald-500/8 px-5 py-2.5 text-sm font-bold text-emerald-400 transition-all hover:bg-emerald-500/16">
              কিশোরকণ্ঠ দেখুন
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">

            {/* ── Items List ── */}
            <div className="space-y-3">
              {items.map((item) => {
                const unitPrice = Number(item.issue.finalPrice)
                const lineTotal = unitPrice * item.quantity
                const isUpdating = updating === item.id

                return (
                  <div key={item.id}
                    className={`flex gap-4 rounded-2xl border border-white/8 bg-[#071310] p-4 transition-opacity ${isUpdating ? "opacity-50" : ""}`}>

                    {/* Cover */}
                    <Link href={`/kisorkontho/${item.issue.slug}`}
                      className="relative h-24 w-16 shrink-0 overflow-hidden rounded-xl">
                      <Image src={item.issue.coverImage} alt={item.issue.title} fill
                        sizes="64px" className="object-cover" unoptimized />
                    </Link>

                    {/* Info */}
                    <div className="flex flex-1 flex-col justify-between min-w-0">
                      <div>
                        <Link href={`/kisorkontho/${item.issue.slug}`}
                          className="truncate text-sm font-semibold text-white/70 hover:text-emerald-400 transition-colors">
                          {item.issue.title}
                        </Link>
                        <p className="font-mono text-[11px] text-white/25">
                          ৳{unitPrice} / পিস
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        {/* Qty */}
                        <div className="inline-flex items-center overflow-hidden rounded-lg border border-white/10 bg-[#050f08]">
                          <button onClick={() => handleUpdateQty(item.id, item.quantity - 1)}
                            disabled={isUpdating}
                            className="flex h-8 w-8 items-center justify-center text-white/35 transition-colors hover:bg-white/5 hover:text-white/65">
                            <MinusIcon className="h-3.5 w-3.5" strokeWidth={2.5} />
                          </button>
                          <span className="min-w-8 text-center font-mono text-sm font-bold text-emerald-300">{item.quantity}</span>
                          <button onClick={() => handleUpdateQty(item.id, item.quantity + 1)}
                            disabled={isUpdating || item.quantity >= item.issue.stock}
                            className="flex h-8 w-8 items-center justify-center text-white/35 transition-colors hover:bg-white/5 hover:text-white/65">
                            <PlusIcon className="h-3.5 w-3.5" strokeWidth={2.5} />
                          </button>
                        </div>

                        {/* Price + Remove */}
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm font-bold text-emerald-300">৳{lineTotal}</span>
                          <button onClick={() => handleRemove(item.id)}
                            disabled={isUpdating}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-500/15 text-red-400/40 transition-all hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400">
                            <TrashIcon className="h-3.5 w-3.5" strokeWidth={2} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* ── Summary ── */}
            <div className="rounded-2xl border border-white/8 bg-[#071310] p-6 h-fit">
              <h2 className="mb-4 text-sm font-bold text-white/60">অর্ডার সামারি</h2>

              <div className="space-y-2 border-b border-white/5 pb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-xs text-white/30">
                    <span className="truncate">{item.issue.title} × {item.quantity}</span>
                    <span className="shrink-0 font-mono">৳{Number(item.issue.finalPrice) * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-4">
                <div className="flex justify-between text-xs text-white/30">
                  <span>সাবটোটাল</span>
                  <span className="font-mono">৳{subtotal}</span>
                </div>
                <div className="flex justify-between text-xs text-white/30">
                  <span>ডেলিভারি</span>
                  <span className="font-mono text-emerald-400">ফ্রি</span>
                </div>
                <div className="flex justify-between border-t border-white/5 pt-2 text-base font-bold text-white/60">
                  <span>মোট</span>
                  <span className="font-mono text-emerald-300">৳{subtotal}</span>
                </div>
              </div>

              <button onClick={() => router.push("/checkout")}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-amber-500/35 bg-amber-500/12 py-3.5 text-sm font-bold text-amber-300 transition-all hover:border-amber-500/60 hover:bg-amber-500/22 hover:shadow-[0_0_20px_rgba(251,191,36,0.12)]">
                <CreditCardIcon className="h-4 w-4" strokeWidth={2} /> চেকআউটে যান
              </button>

              <Link href="/kisorkontho"
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-white/8 py-3 text-sm font-bold text-white/30 transition-all hover:border-white/16 hover:text-white/60">
                <ShoppingBagIcon className="h-4 w-4" strokeWidth={2} /> আরও কিনুন
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
