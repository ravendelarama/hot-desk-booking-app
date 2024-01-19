"use client";

import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";

function Error() {
  const params = useSearchParams();
  const { data: session } = useSession();

  return (
    <div className="flex justify-center items-center min-h-full w-full">
      <h1>{params.get("error")}</h1>d
    </div>
  );
}

export default Error;
