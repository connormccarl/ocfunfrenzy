import Image from "next/image"
import Link from "next/link"

export default function Footer() {
    const menu = [
        {
            name: "Home",
            href: "/",
        },
        {
            name: "About",
            href: "/about",
        },
        {
            name: "Blog",
            href: "/blog",
        },
        {
            name: "Contact",
            href: "/contact",
        },
    ]

    return (
        <footer className="">
            <div className="grid grid-cols-1 sm:grid-cols-3 text-md gap-6">
                <div>
                    <Image src="/logo_horizontal.png" alt="OC Fun Frenzy Logo" width={600} height={250} className="h-20 w-auto mb-1" />
                    <div>Fun adventures in Orange County, CA.</div>
                </div>
                <div className="sm:text-center">
                    <div className="uppercase mb-3">Site Map</div>
                    <nav className="flex flex-col">
                        {menu.map((item) => ( 
                            <Link key={item.href} href={item.href}>
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>
                <div>
                    <div className="uppercase mb-3">Sign Up for Alerts</div>
                    <div className="mb-3">New adventures added weekly.</div>
                    <form className="group">
                        <input type="email" name="email" required className="px-3 py-2 border-1 rounded-md w-full mb-3" />
                        <button type="submit" className="p-2 bg-[#f1a236] w-36 rounded-md group-invalid:opacity-30 group-invalid:pointer-events-none">
                            Subscribe
                        </button>
                    </form>
                </div>
            </div>
            <div className="text-center py-4 text-sm">
                 &copy; {new Date().getFullYear()} &middot; OC Fun Frenzy &middot; All rights reserved
            </div>
        </footer>
    )
}