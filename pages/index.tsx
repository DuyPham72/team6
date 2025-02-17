import client from "@/lib/mongodb";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

type ConnectionStatus = {
  isConnected: boolean;
};

const inter = Inter({ subsets: ["latin"] });

export const getServerSideProps: GetServerSideProps<
  ConnectionStatus
> = async () => {
  try {
    await client.connect(); // `await client.connect()` will use the default database passed in the MONGODB_URI
    return {
      props: { isConnected: true },
    };
  } catch (e) {
    console.error(e);
    return {
      props: { isConnected: false },
    };
  }
};

export default function Home({
  isConnected,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/Assets/uta_housing.jpeg" // Ensure this image exists in the public/Assets folder
          alt="UTA Housing"
          layout="fill"
          objectFit="cover"
          quality={100}
        />
        <div className="absolute inset-0 bg-black/40"></div> {/* Overlay for better text visibility */}
      </div>

      {/* Navbar */}
      <nav className="absolute top-0 left-0 w-full flex justify-between items-center p-6 bg-black/30 backdrop-blur-sm">
        {/* Logo */}
        <div className="flex items-center gap-2 text-xl font-bold text-white">
          <Image src="/Assets/uta_logo.png" alt="UTA Logo" width={50} height={50} />
          <span>UTA Housing</span>
        </div>

        {/* Navigation Links */}
        <div className="flex gap-6">
          <Link href="/" className="text-white hover:text-orange-500 transition duration-300">
            Home
          </Link>
          <Link href="/about" className="text-white hover:text-orange-500 transition duration-300">
            About
          </Link>
          <Link href="/contact" className="text-white hover:text-orange-500 transition duration-300">
            Contact
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="flex gap-4">
          <Link href="/login">
            <button className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition duration-300">
              Log In
            </button>
          </Link>
          <Link href="/signup">
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300">
              Sign Up
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white">
        <h1 className="text-5xl font-bold mb-4">Welcome to UTA Housing</h1>
        <p className="text-xl mb-8">Find your perfect home near campus</p>
        <Link href="/explore">
          <button className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition duration-300">
            Explore Listings
          </button>
        </Link>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 w-full p-4 bg-black/30 text-white text-center">
        <p>&copy; 2023 UTA Housing. All rights reserved.</p>
      </footer>
    </div>
  );
}