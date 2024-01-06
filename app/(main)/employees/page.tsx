import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { getOtherUsers } from "@/actions/actions";
import { getSession } from "@/lib/next-auth";
import { Role } from "@prisma/client";

async function Employees() {
  const employees = await getOtherUsers();

  return (
    <div className="p-3 sm:pt-10 sm:pl-10 flex flex-col space-y-5">
      <h1 className="text-3xl font-bold font-sans">Colleagues</h1>
      {/* @ts-ignore */}
      <DataTable columns={columns} data={employees} />
    </div>
  );
}

export default Employees;
