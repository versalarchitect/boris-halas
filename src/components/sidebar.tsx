"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Instagram } from "lucide-react";
import { ShareDialog } from "./share-dialog";

const navItems = [
  { name: "Around", href: "/" },
  { name: "Fashion", href: "/fashion" },
  { name: "Editorial", href: "/editorial" },
  { name: "Music", href: "/music" },
  { name: "Somewhere", href: "/somewhere" },
  { name: "Store", href: "/store" },
  { name: "Info", href: "/info" },
] as const;

const INSTAGRAM_URL = "https://www.instagram.com/borishalas/";

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);
  const openShare = () => {
    setIsOpen(false);
    setIsShareOpen(true);
  };

  return (
    <>
      <ShareDialog isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
      {!isOpen && <MobileHeader onOpen={() => setIsOpen(true)} />}
      <MobileMenu
        open={isOpen}
        pathname={pathname}
        onClose={closeMenu}
        onShare={openShare}
      />
      <DesktopSidebar pathname={pathname} onShare={() => setIsShareOpen(true)} />
    </>
  );
}

function MobileHeader({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="fixed left-0 top-0 z-[60] flex w-full items-center justify-between px-4 py-2 md:hidden">
      <Link href="/" aria-label="Home">
        <Logo />
      </Link>
      <button
        type="button"
        onClick={onOpen}
        aria-label="Open menu"
        className="flex h-10 w-10 cursor-pointer items-center justify-center text-black"
      >
        <Menu className="h-6 w-6" strokeWidth={2} />
      </button>
    </div>
  );
}

function MobileMenu({
  open,
  pathname,
  onClose,
  onShare,
}: {
  open: boolean;
  pathname: string;
  onClose: () => void;
  onShare: () => void;
}) {
  return (
    <div
      className={`fixed inset-0 z-50 flex h-screen w-screen flex-col bg-white font-hn transition-opacity duration-300 md:hidden ${
        open ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div className="flex justify-end px-4 py-4">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="flex h-10 w-10 cursor-pointer items-center justify-center text-black"
        >
          <X className="h-6 w-6" strokeWidth={2} />
        </button>
      </div>

      <nav className="flex flex-1 flex-col items-center justify-center gap-5">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            onClick={onClose}
            className={`text-2xl leading-none no-underline transition-opacity hover:opacity-60 ${
              pathname === item.href ? "font-bold" : "font-normal"
            } text-black`}
          >
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="flex flex-col items-center gap-4 px-6 pb-8 pt-6">
        <Link href="/" onClick={onClose} aria-label="Home">
          <Logo />
        </Link>
        <div className="flex items-center gap-2">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="inline-flex h-8 items-center gap-1.5 rounded-full border border-black bg-white px-3 text-[11px] font-medium text-black transition-colors hover:bg-black hover:text-white"
          >
            <Instagram className="h-3.5 w-3.5" strokeWidth={2} />
            <span>Instagram</span>
          </a>
          <button
            type="button"
            onClick={onShare}
            className="inline-flex h-8 cursor-pointer items-center rounded-full border border-black bg-white px-3 text-[11px] font-medium text-black transition-colors hover:bg-black hover:text-white"
          >
            Share
          </button>
        </div>
        <p className="text-center text-[11px] text-[#888]">
          © {new Date().getFullYear()} Boris Halas<br />Photography. All Rights Reserved.
        </p>
      </div>
    </div>
  );
}

function DesktopSidebar({
  pathname,
  onShare,
}: {
  pathname: string;
  onShare: () => void;
}) {
  return (
    <aside className="relative hidden h-full w-52 flex-col justify-between bg-white px-6 py-8 font-hn md:flex">
      <div>
        <Link href="/" className="mb-8 block" aria-label="Home">
          <Logo />
        </Link>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-[12px] leading-[1.5] no-underline transition-colors hover:text-[#888] ${
                pathname === item.href ? "font-bold" : "font-normal"
              } text-black`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      <div>
        <div className="flex items-center gap-2">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-black transition-colors hover:text-[#888]"
          >
            <Instagram className="h-6 w-6" strokeWidth={2} />
          </a>
          <button
            type="button"
            onClick={onShare}
            className="cursor-pointer text-[12px] font-bold leading-[1.5] text-black no-underline transition-colors hover:text-[#888]"
          >
            Share
          </button>
        </div>
        <p className="mt-3 text-[11px] text-[#888]">
          © {new Date().getFullYear()} Boris Halas<br />Photography. All Rights Reserved.
        </p>
      </div>
    </aside>
  );
}

function Logo() {
  return (
    <Image
      src="/logo.png"
      alt="Boris Halas"
      width={140}
      height={70}
      priority
      style={{ height: "auto" }}
    />
  );
}
