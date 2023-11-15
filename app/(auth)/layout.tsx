import { ReactNode } from "react";

interface Prop {
  children?: ReactNode;
}

function Layout({ children }: Prop) {
  return (
    <div className="min-h-screen px-5 sm:px-0 dark:bg-slate-950">
      {children}
    </div>
  );
}

export default Layout;
