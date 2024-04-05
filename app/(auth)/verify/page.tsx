import { getSession } from "@/lib/next-auth";
import VerifyForm from "./_component";
import prisma from "@/lib/db";

async function Verify({
  searchParams: { token },
}: {
  searchParams: {
    token: string;
  };
}) {
  return (
    <div>
      <VerifyForm token={token} />
    </div>
  );
}

export default Verify;
