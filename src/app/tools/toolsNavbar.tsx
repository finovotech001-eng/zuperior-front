import Image from "next/image";
import logo from "../../../public/logo.png";
import Link from "next/link";

const ToolNavbar = () => {
  return (
    <div className="flex items-center gap-2 md:gap-3 flex-1">
      <Link href={"/"} className="flex items-center cursor-pointer">
        <Image
          alt="Zuperior Logo"
          src={logo}
          width={48}
          height={48}
          className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 object-contain"
        />
        <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-white/75 dark:text-white/75">
          Zuperior
        </span>
      </Link>
    </div>
  );
}

export default ToolNavbar;