'use client'
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { MenuIcon, XIcon } from "@heroicons/react/outline"; // Ensure using v1
import logo from "../images/w3g.webp"; // Make sure the path is correct

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    // Delete token from storage
    localStorage.removeItem("token");
    // Redirect to logout page
    window.location.href = "/";
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="z-10 fixed top-0 left-0 right-0 bg-mainColor">
      <div className="flex items-center justify-between h-24 px-4 sm:px-0">
        {!isMenuOpen && ( // Render logo only when menu is closed
          <div className="flex items-center ml-10">
            <Image src={logo} alt="Logo" width={80} height={40} className=" h-auto mt-2 sm:w-20 md:w-24 md:pr-5 lg:w-32" />
          </div>
        )}
        <nav className="hidden md:flex md:items-center md:space-x-10 lg:space-x-16">
          <Link href="/UserOnBoarding" className="text-white text-xl md:text-base lg:text-xl ">
            User Onboarding
          </Link>
          <Link href="/UserList" className="text-white text-xl md:text-base lg:text-xl ">
            Users List
          </Link>
        </nav>
        <div className="flex items-center md:hidden">
          <button onClick={toggleMenu} className="text-white focus:outline-none">
            {isMenuOpen ? <XIcon className="" /> : <MenuIcon className="h-8 w-6" />}
          </button>
        </div>
        <div className="hidden md:flex items-center mr-2">
          <div className="w-3/5 mx-2 rounded bg-white md:w-1/3  lg:w-1/2 mr-5 py-0 ">
            <input
              className="w-full border-none bg-transparent px-4 py-2 text-gray-800 md:text:sm outline-none focus:outline-none"
              type="search"
              name="search"
              placeholder="Search..."
            />
          </div>
          <button
            className="text-mainColor py-2 rounded-lg text-xl lg:text-lg md:text-sm md:px-1 ml-6  bg-white"
            onClick={handleLogout}
          >
            Log Out
          </button>
        </div>
      </div>
      {/* Mobile Menu Content */}
      {isMenuOpen && (
        <div className=" md:hidden flex flex-col items-center justify-center bg-mainColor h-screen space-y-10 ">
          <div className="mb-80 md:hidden flex flex-col items-center justify-center bg-mainColor h-screen space-y-10">
          <Link href="/UserOnBoarding" className="text-white text-xl">
            User Onboarding
          </Link>
          <Link href="/UserList" className="text-white text-xl">
            Users List
          </Link>
          <button
            className="text-mainColor py-2 rounded-lg text-xl px-4 bg-white "
            onClick={handleLogout}
          >
            Log Out
          </button>
          </div>
          <button onClick={toggleMenu} className="text-white focus:outline-none absolute top-0 right-6">
            <XIcon className="h-8 w-5 " />
          </button>
        </div>
      )}
    </header>
  );
}
