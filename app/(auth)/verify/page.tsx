import { getSession } from "@/lib/next-auth";
import { RedirectType, redirect } from "next/navigation";

async function Verify() {
  return <div>Verification Token</div>;
}

export default Verify;
