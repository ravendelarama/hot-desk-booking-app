import { getSession } from "@/lib/next-auth";
import { RedirectType, redirect } from "next/navigation";

async function Floors() {
  const session = await getSession();

  if (session?.user.isBanned) redirect("/signin", RedirectType.replace);

  return <div>Floors Page</div>;
}

export default Floors;
