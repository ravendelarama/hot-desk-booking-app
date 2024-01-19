import { getSession } from "@/lib/next-auth";
import SignIn from "./_component";
import { RedirectType, permanentRedirect } from "next/navigation";
import moment from "moment";

async function App() {
  const session = await getSession();

  if (session) {
    permanentRedirect("/home", RedirectType.replace);
  }

  return (
    <>
      <SignIn />
    </>
  );
}

export default App;
