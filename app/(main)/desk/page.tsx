import { RedirectType, redirect } from "next/navigation";
import { getSession } from "@/lib/next-auth";

import { getFloors } from "@/actions/floor";

// import Desk from "./_components";
import BookTabs from "./_components/BookTabs";
import WorkspaceMap from "@/components/WorkspaceMap";
import { toast } from "@/components/ui/use-toast";

async function App() {
  const session = await getSession();

  if (session?.user.isBanned) redirect("/signin", RedirectType.replace);

  return (
    <div className="p-3 sm:pt-10 sm:pl-10 flex flex-col space-y-5 w-full">
      {/* <Desk /> */}

      <BookTabs />

      {/* <SampleComponent /> */}
    </div>
  );
}

export default App;
