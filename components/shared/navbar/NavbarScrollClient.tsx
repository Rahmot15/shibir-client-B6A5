"use client"

import { useEffect } from "react"

const SCROLLED = [
  "border-[rgba(0,200,83,0.1)]",
  "bg-[rgba(4,12,7,0.88)]",
  "backdrop-blur-[18px]",
  "shadow-[0_1px_0_rgba(0,200,83,0.06)]",
]
const TOP = ["border-transparent", "bg-transparent"]

export default function NavbarScrollClient() {
  useEffect(() => {
    const nav = document.getElementById("main-navbar")
    if (!nav) return

    const update = () => {
      const scrolled = window.scrollY > 20
      nav.classList.remove(...(scrolled ? TOP : SCROLLED))
      nav.classList.add(...(scrolled ? SCROLLED : TOP))
    }

    update()
    window.addEventListener("scroll", update, { passive: true })
    return () => window.removeEventListener("scroll", update)
  }, [])

  return null
}
