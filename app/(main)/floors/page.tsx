import { DataTable } from "./_components/data-table";
import { getAllFloors } from "@/actions/actions";
import { columns } from "./_components/columns";

async function Floors() {
  const floors = await getAllFloors();

  return (
    <div className="p-3 sm:pt-10 sm:pl-10 flex flex-col space-y-5">
      <h1 className="text-3xl font-bold font-sans">Floors</h1>
      <h2 className="text-slate-500 text-sm"></h2>
      {/* @ts-ignore */}
      <DataTable columns={columns} data={floors} />
    </div>
  );
}

export default Floors;
