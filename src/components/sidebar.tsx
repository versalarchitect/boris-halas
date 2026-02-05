"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ShareDialog } from "./share-dialog";

const navItems = [
  { name: "Around", href: "/" },
  { name: "Music", href: "/music" },
  { name: "Editorial", href: "/editorial" },
  { name: "Fashion", href: "/fashion" },
  { name: "Somewhere", href: "/somewhere" },
  { name: "Store", href: "/store" },
  { name: "Info", href: "/info" },
];

const linkStyle = { fontFamily: '"Helvetica Neue", Arial, Helvetica, sans-serif' };

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  return (
    <>
      <ShareDialog isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
      {/* Mobile menu button - hamburger when closed */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed left-4 top-4 z-[60] flex h-10 w-10 items-center justify-center md:hidden"
          aria-label="Open menu"
        >
          <div className="flex flex-col gap-1.5">
            <span className="block h-0.5 w-6 bg-black" />
            <span className="block h-0.5 w-6 bg-black" />
            <span className="block h-0.5 w-6 bg-black" />
          </div>
        </button>
      )}

      {/* Mobile Menu - Full screen overlay */}
      <div
        className={`fixed inset-0 z-50 flex h-screen w-screen flex-col bg-white transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {/* Mobile header with logo and X button */}
        <div className="flex items-center justify-between px-6 py-6">
          <Link href="/" onClick={() => setIsOpen(false)}>
            <Image
              src="/logo.png"
              alt="Boris Halas"
              width={140}
              height={70}
              priority
            />
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="flex h-10 w-10 items-center justify-center"
            aria-label="Close menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Mobile nav links - centered */}
        <div className="flex flex-1 flex-col items-center justify-center">
          <nav className="flex flex-col items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`text-[12px] leading-[1.5] no-underline transition-colors hover:text-muted-foreground ${
                  pathname === item.href ? "font-bold text-black" : "font-normal text-black"
                }`}
                style={linkStyle}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Instagram under links */}
          <div className="mt-8 flex items-center gap-2">
            <a
              href="https://www.instagram.com/borishalas/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black transition-colors hover:text-muted-foreground"
              aria-label="Instagram"
            >
              <InstagramIcon className="h-6 w-6" />
            </a>
            <button
              className="text-[12px] font-bold leading-[1.5] text-black no-underline transition-colors hover:text-muted-foreground"
              style={linkStyle}
              onClick={() => {
                setIsOpen(false);
                setIsShareOpen(true);
              }}
            >
              Share
            </button>
          </div>
        </div>

        {/* Mobile copyright at bottom */}
        <div className="px-6 py-6">
          <p
            className="text-center text-[11px]"
            style={{ color: "rgb(136, 136, 136)", ...linkStyle }}
          >
            © {new Date().getFullYear()} Boris Halas<br />Photography. All Rights Reserved.
          </p>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="relative hidden h-full w-52 flex-col justify-between bg-white px-6 py-8 md:flex">
        <div>
          <Link href="/" className="mb-8 block">
            <Image
              src="/logo.png"
              alt="Boris Halas"
              width={140}
              height={70}
              priority
            />
          </Link>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-[12px] leading-[1.5] no-underline transition-colors hover:text-muted-foreground ${
                  pathname === item.href ? "font-bold text-black" : "font-normal text-black"
                }`}
                style={linkStyle}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <a
              href="https://www.instagram.com/borishalas/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black transition-colors hover:text-muted-foreground"
              aria-label="Instagram"
            >
              <InstagramIcon className="h-6 w-6" />
            </a>
            <button
              className="text-[12px] font-bold leading-[1.5] text-black no-underline transition-colors hover:text-muted-foreground"
              style={linkStyle}
              onClick={() => setIsShareOpen(true)}
            >
              Share
            </button>
          </div>
          <p
            className="mt-3 text-[11px]"
            style={{ color: "rgb(136, 136, 136)", ...linkStyle }}
          >
            © {new Date().getFullYear()} Boris Halas<br />Photography. All Rights Reserved.
          </p>
        </div>
      </aside>
    </>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}
