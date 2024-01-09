"use client";

import { useSearchParams } from "next/navigation";

function Error() {
  const params = useSearchParams();

  return (
    <div className="flex justify-center items-center h-full w-full">
      <h1>{params.get("error")}</h1>
    </div>
  );
}

export default Error;
