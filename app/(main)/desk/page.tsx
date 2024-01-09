import { RedirectType, redirect } from "next/navigation";
import Desk from "./_components";
import { getSession } from "@/lib/next-auth";

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
