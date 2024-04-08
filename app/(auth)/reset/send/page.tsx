import SendResetEmailForm from "../_components/SendResetEmailForm";
import { getSession } from "@/lib/next-auth";
import { RedirectType, permanentRedirect } from "next/navigation";

async function SendResetPasswordEmailPage() {
  const session = await getSession();
  if (session) {
    permanentRedirect("/", RedirectType.replace);
  }
  return (
    <>
      <SendResetEmailForm />
    </>
  );
}

export default SendResetPasswordEmailPage;
