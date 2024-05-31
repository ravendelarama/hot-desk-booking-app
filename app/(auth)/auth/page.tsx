import MFAForm from "./_components/form";
import { getSession } from "@/lib/next-auth";
import { RedirectType, permanentRedirect } from "next/navigation";
import prisma from "@/lib/db";

export default async function MultiFactorAuthPage({
  searchParams: { token },
}: {
  searchParams: { token: string };
}) {
  const session = await getSession();

  if (session) {
    permanentRedirect("/", RedirectType.replace);
  }

  return (
    <div>
      <MFAForm token={token} />
    </div>
  );
}
