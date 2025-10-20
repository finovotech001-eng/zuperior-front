import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const NotFoundPage = () => {
  return (
    <div className="bg-black text-white px-4">
      <div className="flex flex-col gap-10 h-screen items-center justify-center max-w-md mx-auto">
        <video
          autoPlay
          loop
          muted
          playsInline
          controls={false}
          className="rounded-md object-contain z-[9999] relative"
          preload="auto"
        >
          <source src="/logo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
        <p className="text-lg">The page you are looking for does not exist.</p>
        <Link
          href="/"
          className="bg-gradient-to-r from-[#6242a5] to-[#9f8bcf] cursor-pointer text-white p-3 rounded mt-2 flex items-center justify-center disabled:opacity-70 w-full"
        >
          Go back to Home <ArrowUpRight className="ml-4 size-6" />
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
