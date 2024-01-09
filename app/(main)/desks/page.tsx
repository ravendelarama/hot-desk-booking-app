import { getSession } from "@/lib/next-auth";
import { RedirectType, redirect } from "next/navigation";

async function Desks() {
  const session = await getSession();

  if (session?.user.isBanned) redirect("/signin", RedirectType.replace);

  return <div>Desks Page</div>;
}

export default Desks;
