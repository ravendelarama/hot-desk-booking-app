import { getSession } from "@/lib/next-auth";
import { RedirectType, redirect } from "next/navigation";

async function Verify() {
  const session = await getSession();

  return <div>Verification Code</div>;
}

export default Verify;
