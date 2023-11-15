import Image from "next/image";
import { getSession } from "../api/auth/[...nextauth]/route";
import { signIn } from "next-auth/react";

export default async function Home() {
  const session = await getSession();

  return (
    <div className="p-6">
      <h1>Hello {session?.user.firstName}!</h1>
    </div>
  );
}
