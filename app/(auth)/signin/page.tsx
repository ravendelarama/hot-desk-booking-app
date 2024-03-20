import { getSession } from "@/lib/next-auth";
import { RedirectType, permanentRedirect } from "next/navigation";

import SignIn from "./_component";

async function App() {
  const session = await getSession();

  if (session) {
    permanentRedirect("/", RedirectType.replace);
  }

  return (
    <>
      <SignIn />
    </>
  );
}

export default App;
