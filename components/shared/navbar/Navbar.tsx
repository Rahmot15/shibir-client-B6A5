import Link from "next/link";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from "@/components/ui/navigation-menu";
import NavbarActionsClient from "@/components/shared/navbar/NavbarActionsClient";
import NavbarScrollClient from "@/components/shared/navbar/NavbarScrollClient";
import { NAV_LINKS } from "@/components/shared/navbar/nav-links";
import { MoonStar } from "lucide-react";

export default function Navbar() {
	return (
		<nav id="main-navbar" className="fixed inset-x-0 top-0 z-100 h-16 border-b border-transparent bg-transparent transition-all duration-300">
			<NavbarScrollClient />
			<div className="mx-auto flex h-full w-full max-w-10/12 items-center px-3 sm:px-5 md:px-8 xl:px-[clamp(20px,5vw,60px)]">
				<div className="flex min-w-0 flex-1 items-center gap-2.5">
					<Link href="/" className="flex items-center gap-2.5">
						<div className="flex h-8.5 w-8.5 items-center justify-center rounded-full border border-[rgba(0,200,83,0.35)] text-base text-[#f0fff4] shadow-[0_0_12px_rgba(0,200,83,0.2)]">
							<MoonStar className="h-4 w-4" strokeWidth={2} />
						</div>
						<div className="min-w-0">
							<div className="hidden text-[13px] font-semibold leading-[1.2] tracking-[0.5px] text-[#f0fff4] sm:block">
								ইসলামী ছাত্রশিবির
							</div>
							<div className="hidden text-[9px] uppercase tracking-[2.5px] text-[rgba(0,200,83,0.65)] sm:block">
								Bangladesh
							</div>
						</div>
					</Link>
				</div>

				<div className="hidden xl:flex xl:items-center">
					<NavigationMenu>
						<NavigationMenuList className="gap-3">
							{NAV_LINKS.map((item) => (
								<NavigationMenuItem key={item.title}>
									<NavigationMenuLink
										asChild
										className="px-2 py-1 text-[12px] tracking-[1.5px] text-[rgba(232,245,233,0.55)] transition-colors hover:bg-transparent hover:text-[#00c853]"
									>
										<Link href={item.url}>{item.title}</Link>
									</NavigationMenuLink>
								</NavigationMenuItem>
							))}
						</NavigationMenuList>
					</NavigationMenu>
				</div>

				<div className="ml-auto flex items-center gap-2">
					<NavbarActionsClient links={NAV_LINKS} />
				</div>
			</div>
		</nav>
	);
}
