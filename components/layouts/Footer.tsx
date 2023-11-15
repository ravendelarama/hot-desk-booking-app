"use client";
import Link from "next/link";
import { useState } from "react";

function Footer() {
  function getYear() {
    return new Date().getFullYear();
  }

  return (
    <div className="w-full h-auto flex flex-col justify-around items-start gap-5 lg:gap-0 py-5 lg:py-0 lg:flex-row lg:h-16 lg:justify-between lg:items-center px-5 lg:px-10 border-t border-t-slate-300 dark:border-t-slate-800">
      <p className="text-xs font-medium text-slate-600 transition-colors duration-75 ease-in hover:text-slate-400">
        &copy; 2023{getYear() > 2023 && `-${getYear()}`} Desk Booking All rights
        reserved.
      </p>
      <div className="flex flex-col justify-around sm:items-center h-full gap-5 sm:flex-row">
        <Link
          className="text-xs font-medium text-slate-600 transition-colors duration-75 ease-in hover:text-slate-400"
          href="https://www.termsfeed.com/live/692e4cf6-fab6-4248-b2d1-f70df161dd08"
          target="_"
        >
          Privacy Policy
        </Link>
        <Link
          className="text-xs font-medium text-slate-600 transition-colors duration-75 ease-in hover:text-slate-400"
          href="https://www.termsandconditionsgenerator.com/live.php?token=PdpUwBeiWejWjoz8FkuTNxFBvoQkiTGM "
          target="_"
        >
          Terms and Conditions
        </Link>
      </div>
    </div>
  );
}

export default Footer;
