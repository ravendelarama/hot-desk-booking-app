import { getSession } from "@/lib/next-auth";
import { RedirectType, redirect } from "next/navigation";

export default async function Home() {
  const session = await getSession();

  if (session?.user.isBanned) redirect("/signin", RedirectType.replace);

  return (
    <div className="p-6">
      <h1 className="text-xl">Hello {session?.user.firstName}!</h1>
    </div>
  );
}
