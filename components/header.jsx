import React from "react";
import { Button } from "./ui/button";
import { PenBox, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { checkUser } from "@/lib/checkUser";
import Image from "next/image";

const Header = async () => {
  await checkUser();

  return (
    <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/">
          <Image
            src={
              "https://i.postimg.cc/6pZDcqgm/Screenshot-2025-01-25-115737-removebg-preview.png"
            }
            alt="Finser Logo"
            width={200}
            height={60}
            className="h-12 w-auto object-contain"
          />
        </Link>

        {/* Navigation Links - Different for signed in/out users */}
        <div className="hidden md:flex items-center space-x-8">
          <SignedOut>
            <a
              href="https://ai-user.onrender.com/"
              className="text-gray-600 hover:text-blue-600"
            >
              Queue Nav
            </a>
            <a href="https://token-mrv4.onrender.com/" className="text-gray-600 hover:text-blue-600">
              Prefill
            </a>
            <a href="#user" className="text-gray-600 hover:text-blue-600">
              Help
            </a>
          </SignedOut>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4">
          <SignedIn>
            <a
             href="https://ai-user.onrender.com/"
              className="text-gray-600 hover:text-blue-600"
            >
              Queue Nav
            </a>
            <a href="https://token-mrv4.onrender.com/" className="text-gray-600 hover:text-blue-600">
              Prefill
            </a>
            <a href="#user" className="text-gray-600 hover:text-blue-600">
              Help
            </a>

            <Link
              href="https://dash-512x.onrender.com/"
              className="text-gray-600 hover:text-blue-600 flex items-center gap-2"
            >
              <Button variant="outline">
                <LayoutDashboard size={18} />
                <span className="hidden md:inline">Dashboard</span>
              </Button>
            </Link>
            <a href="/transaction/create">
              <Button className="flex items-center gap-2">
                <PenBox size={18} />
                <span className="hidden md:inline">Add Transaction</span>
              </Button>
            </a>
          </SignedIn>
          <SignedOut>
            <SignInButton forceRedirectUrl="/dashboard">
              <Button variant="outline">Login</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                },
              }}
            />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
};

export default Header;
