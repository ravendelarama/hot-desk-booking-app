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

  const user = await prisma.mFAVerificationToken.findFirst({
    where: {
      token,
    },
  });

  return (
    <div>
      <MFAForm token={token} email={user?.email!} password={user?.password!} />
    </div>
  );
}
