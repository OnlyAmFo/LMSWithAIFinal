"use client";
import { Dispatch, SetStateAction } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react"; // You can use any icon set like Lucide or Heroicons
import clsx from "clsx";
import ButtonWithBorder from "../ui/ButtonWithBorder";
import { RegistrationForm } from "../authcomponents/RegistrationForm";
import { LoginForm } from "../authcomponents/LoginForm";
const navLinks = [
  { href: "/", label: "Home+" },
  { href: "/courses", label: "Courses+" },
  { href: "/dashboard", label: "Dashboard+" },
  { href: "/admin", label: "Admin+" },
  { href: "/contact", label: "Contact Us+" },
];

interface NavLinkElement {
  href: string;
  label: string;
}
const MobileNavigation = ({
  menuOpen,
  setMenuOpen,
}: {
  menuOpen:boolean;
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <div className={clsx("fixed  h-full w-full top-0 bg-slate-900 z-[9999] px-10 pt-10 transition-all duration-500",menuOpen ? "left-[0%]" : "left-[100%]")}>
      <nav
        className="flex flex-col gap-20 text-white"
        role="navigation"
        aria-label="Main Navigation"
      >
        <div className="flex justify-between">
          <Link href="/" className="text-xl font-bold text-[#FF8C5A]">
            MyLMS
          </Link>
          <div onClick={()=>setMenuOpen(false)}>
            <X size={30}/>
          </div>
        </div>
        <ul className="flex flex-col gap-10">
          {navLinks.map((element: NavLinkElement, index: number) => {
            return (
              <Link href={element.href} key={index}>
                {element.label}
              </Link>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};
const Header = () => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="relative w-full h-20  flex justify-between items-center bg-[#FFF5F0] border-b border-[#FF8C5A] px-5 md:px-20 lg:px-30 overflow-hidden">
      <nav
        className="flex gap-20"
        role="navigation"
        aria-label="Main Navigation"
      >
        <Link href="/" className="text-xl font-bold text-[#FF8C5A]">
          MyLMS
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex space-x-6">
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={clsx(
                  " hover:text-[#006A62] transition",
                  pathname === href && "font-semibold text-[#006A62]"
                )}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      {/* login and register buttons */}
      <div className="relative flex gap-5 md:gap-10 z-30 lg:mr-[8%] items-center">
        <div className="hidden sm:block">
          <LoginForm />
        </div>
        <div>
          <RegistrationForm />
        </div>
        <div
          className="h-10 w-10 bg-[#006A62] rounded-sm text-white grid place-content-center md:hidden"
          onClick={() => setMenuOpen(true)}
        >
          <Menu />
        </div>
      </div>
      {/* mobilenavigatin */}
        <MobileNavigation menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
    </header>
  );
};
export default Header;
