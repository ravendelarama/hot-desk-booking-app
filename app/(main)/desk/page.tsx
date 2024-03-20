import { RedirectType, redirect } from "next/navigation";
import { getSession } from "@/lib/next-auth";

import Desk from "./_components";

async function App() {
  const session = await getSession();

  if (session?.user.isBanned) redirect("/signin", RedirectType.replace);

  return (
    <>
      <Desk />
    </>
  );
}

export default App;
