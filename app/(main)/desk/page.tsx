import { RedirectType, redirect } from "next/navigation";
import { getSession } from "@/lib/next-auth";

import Desk from "./_components";
import BookTabs from "./_components/BookTabs";

async function App() {
  const session = await getSession();

  if (session?.user.isBanned) redirect("/signin", RedirectType.replace);

  return (
    <div className="p-3 sm:pt-10 sm:pl-10 flex flex-col space-y-5 w-full">
      {/* <Desk /> */}

      <BookTabs />
    </div>
  );
}

export default App;
