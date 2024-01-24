import { getSession } from "@/lib/next-auth";
import { RedirectType, redirect } from "next/navigation";
import SignUp from "./_component/index";

async function App() {
  const session = await getSession();

  if (session?.user && !session.user.isBanned)
    redirect("/", RedirectType.replace);

  return (
    <>
      <SignUp />
    </>
  );
}

export default App;
