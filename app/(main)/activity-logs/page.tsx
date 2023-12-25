import { getActivityLogs } from "@/actions/actions";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";

async function ActivityLogs() {
  const logs = await getActivityLogs();
  return (
    <div className="p-3 sm:pt-10 sm:pl-10 flex flex-col space-y-5">
      <h1 className="text-3xl font-bold font-sans">Activity Logs</h1>
      <h2 className="text-slate-500 text-sm">
        It shows every users' activity logs
      </h2>
      <DataTable columns={columns} data={logs} />
    </div>
  );
}

export default ActivityLogs;
