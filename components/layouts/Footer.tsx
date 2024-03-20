"use client";
import Link from "next/link";

function Footer() {
  function getYear() {
    return new Date().getFullYear();
  }

  return (
    <div
      className="
        w-full
        h-auto
        flex 
        flex-col 
        justify-around 
        items-start 
        gap-5 
        lg:gap-0 
        py-5 
        lg:flex-row 
        lg:justify-between
        lg:items-center
        px-5 
        lg:py-6
        lg:px-10
        border-t
      border-t-slate-300
      dark:border-t-slate-800
      "
    >
      <p className="text-xs font-medium text-slate-600 transition-colors duration-75 ease-in hover:text-slate-400">
        &copy; 2023{getYear() > 2023 && `-${getYear()}`} SpotDesk All rights
        reserved.
      </p>
      <div className="flex flex-col justify-around sm:items-center h-full gap-5 sm:flex-row">
        <Link
          className="
            text-xs 
            font-medium 
            text-slate-600 
            transition-colors 
            duration-75 
            ease-in 
            hover:text-slate-400
          "
          href="/guide"
        >
          Guidelines
        </Link>
        <Link
          className="
            text-xs 
            font-medium 
            text-slate-600 
            transition-colors 
            duration-75 
            ease-in 
            hover:text-slate-400
          "
          href="/faq"
        >
          FAQs
        </Link>
        <Link
          className="
            text-xs 
            font-medium 
            text-slate-600 
            transition-colors 
            duration-75 
            ease-in 
            hover:text-slate-400
          "
          href="https://www.termsfeed.com/live/90cde2b8-5eff-49bc-8f0d-76439c30594c"
          target="_"
        >
          Privacy Policy
        </Link>
        <Link
          className="
            text-xs 
            font-medium 
            text-slate-600 
            transition-colors 
            duration-75 
            ease-in 
            hover:text-slate-400
          "
          href="
            https://www.termsandconditionsgenerator.com/live.php?token=PdpUwBeiWejWjoz8FkuTNxFBvoQkiTGM
          "
          target="_"
        >
          Terms and Conditions
        </Link>
      </div>
    </div>
  );
}

export default Footer;
