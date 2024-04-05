import { getSession } from "@/lib/next-auth";
import VerifyForm from "./_component";
import { RedirectType, permanentRedirect } from "next/navigation";

async function Verify({
  searchParams: { token },
}: {
  searchParams: {
    token: string;
  };
}) {
  const session = await getSession();
  if (session) {
    permanentRedirect("/", RedirectType.replace);
  }
  return (
    <div>
      <VerifyForm token={token} />
    </div>
  );
}

export default Verify;
