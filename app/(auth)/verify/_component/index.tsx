"use client";

import { verifyEmail } from "@/actions/user";
import { Button } from "@/components/ui/button";

function VerifyForm({ token }: { token: string }) {
  return (
    <div>
      {token && (
        <Button
          onClick={async () => {
            await verifyEmail(token! as string);
          }}
        >
          Verify email account
        </Button>
      )}
    </div>
  );
}

export default VerifyForm;
