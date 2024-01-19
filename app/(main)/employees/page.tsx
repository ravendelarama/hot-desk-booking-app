import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { getOtherUsers } from "@/actions/actions";
import { getSession } from "@/lib/next-auth";
import { RedirectType, redirect } from "next/navigation";

async function Employees() {
  const employees = await getOtherUsers();
  const formatData = employees.map((item) => {
    return {
      image: item.image,
      name: `${item.firstName} ${item.lastName}`,
      email: item.email,
      isBanned: item.isBanned,
      role: item.role,
      edit: item.edit,
      delete: item.delete,
    };
  });
  const session = await getSession();

  if (session?.user.isBanned) redirect("/signin", RedirectType.replace);

  return (
    <div className="p-3 sm:pt-10 sm:pl-10 flex flex-col space-y-5">
      <h1 className="text-3xl font-bold font-sans">Colleagues</h1>
      {/* @ts-ignore */}
      <DataTable columns={columns} data={formatData} />
    </div>
  );
}

export default Employees;
