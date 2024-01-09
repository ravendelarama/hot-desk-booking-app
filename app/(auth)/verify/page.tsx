import { getSession } from "@/lib/next-auth";
import { RedirectType, redirect } from "next/navigation";

async function Verify() {
  const session = await getSession();

  if (session) redirect("/home", RedirectType.replace);

  return <div>Verification Code</div>;
}

export default Verify;
