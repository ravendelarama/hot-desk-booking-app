import ResetPasswordForm from "./_components/ResetPasswordForm";
import { getSession } from "@/lib/next-auth";
import { RedirectType, permanentRedirect } from "next/navigation";

async function ResetPasswordPage({
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
    <>
      <ResetPasswordForm token={token} />
    </>
  );
}

export default ResetPasswordPage;
