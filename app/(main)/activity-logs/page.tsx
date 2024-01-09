import { getActivityLogs } from "@/actions/actions";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import { getSession } from "@/lib/next-auth";
import { RedirectType, redirect } from "next/navigation";

async function ActivityLogs() {
  const logs = await getActivityLogs();
  const session = await getSession();

  if (session?.user.isBanned) redirect("/signin", RedirectType.replace);

  return (
    <div className="p-3 sm:pt-10 sm:pl-10 flex flex-col space-y-5">
      <h1 className="text-3xl font-bold font-sans">Activity Logs</h1>
      <h2 className="text-slate-500 text-sm">
        It shows every users&apos; activity logs
      </h2>
      <DataTable columns={columns} data={logs} />
    </div>
  );
}

export default ActivityLogs;
