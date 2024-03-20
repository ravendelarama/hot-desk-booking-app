import { ReactNode } from "react";

import PublicFooter from "@/components/layouts/PublicFooter";

interface Prop {
  children?: ReactNode;
}

function Layout({ children }: Prop) {
  return (
    <div className="min-h-screen px-5 sm:px-0 dark:bg-slate-950">
      {children}

      <PublicFooter />
    </div>
  );
}

export default Layout;
