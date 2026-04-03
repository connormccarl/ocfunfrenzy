'use client'

import Image from "next/image"
import Link from "next/link"

import { Disclosure, DisclosureButton, DisclosurePanel, CloseButton } from "@headlessui/react"
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline"

export default function Header() {
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
        <header className="sticky top-0 z-50 bg-white">
            <div className="hidden sm:flex justify-between items-center">
                <Image src="/logo_horizontal.png" alt="OC Fun Frenzy Logo" width={600} height={250} className="h-20 w-auto" />
                <nav className="flex items-center space-x-8">
                    {menu.map((item) => (
                        <Link key={item.href} href={item.href} className="text-lg font-medium">
                            {item.name}
                        </Link>
                    ))}
                </nav>
            </div>
            {/* Mobile menu */}
            <Disclosure as="div" className="sm:hidden">
                {({ open }) => (
                    <nav className="">
                        <div className="flex justify-between">
                            <Image src="/logo_horizontal.png" alt="OC Fun Frenzy Logo" width={600} height={250} className="h-20 w-auto" />
                            <DisclosureButton className="flex items-center p-2">
                                {open ? (
                                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                ) : (
                                    <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                                )}
                            </DisclosureButton>
                        </div>
                        <DisclosurePanel className="flex flex-col space-y-4 items-center py-4">
                            {menu.map((item) => (
                                <CloseButton as={Link} key={item.href} href={item.href} className="text-lg font-medium">
                                    {item.name}
                                </CloseButton>
                            ))}
                        </DisclosurePanel>
                    </nav>
                )}
            </Disclosure>
        </header>
    )
}
