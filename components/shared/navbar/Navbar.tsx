import Link from "next/link"
import Image from "next/image"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import NavbarActionsClient  from "@/components/shared/navbar/NavbarActionsClient"
import NavbarScrollClient   from "@/components/shared/navbar/NavbarScrollClient"
import { NAV_LINKS }        from "@/components/shared/navbar/nav-links"

export default function Navbar() {
  return (
    <nav
      id="main-navbar"
      className="fixed inset-x-0 top-0 z-50 h-15 border-b border-transparent bg-transparent transition-all duration-500"
    >
      <NavbarScrollClient />

      <div className="mx-auto flex h-full w-full max-w-[90%] items-center gap-4 px-0">

        {/* ── Brand ── */}
        <Link href="/" className="group flex shrink-0 items-center gap-2.5">
          <div className="relative flex items-center justify-center transition-all duration-300 sm:-mt-0.5 group-hover:drop-shadow-[0_0_10px_rgba(0,200,83,0.28)]">
            <Image
              src="/Bangladesh_Islami_Chhatra_Shibir_Emblem.svg"
              alt="বাংলাদেশ ইসলামী ছাত্রশিবির লোগো"
              width={26}
              height={26}
              className="h-6.5 w-6.5 object-contain"
              priority
            />
          </div>
          <div className="hidden sm:block">
            <p className="text-[13px] font-semibold leading-tight tracking-[0.3px] text-emerald-50">
              ইসলামী ছাত্রশিবির
            </p>
            <p className="text-[8.5px] uppercase tracking-[3px] text-emerald-500/55">
              Bangladesh
            </p>
          </div>
        </Link>

        {/* ── Desktop nav ── */}
        <div className="hidden flex-1 items-center justify-center xl:flex">
          <NavigationMenu>
            <NavigationMenuList className="gap-0.5">
              {NAV_LINKS.map((item) => (
                <NavigationMenuItem key={item.title}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={item.url}
                      className="relative rounded-lg px-3.5 py-1.5 text-[12px] font-medium tracking-[1.2px] text-white/40 transition-all duration-200 hover:bg-emerald-500/6 hover:text-emerald-300 group"
                    >
                      {item.title}
                      {/* hover underline */}
                      <span className="absolute inset-x-3 bottom-0.5 h-px scale-x-0 rounded-full bg-emerald-500/50 transition-transform duration-200 group-hover:scale-x-100" />
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* ── Actions ── */}
        <div className="ml-auto flex items-center gap-2">
          <NavbarActionsClient links={NAV_LINKS} />
        </div>
      </div>
    </nav>
  )
}
