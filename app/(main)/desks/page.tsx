import { DataTable } from "./_components/data-table";
import { getAllDesks } from "@/actions/desk";
import { columns } from "./_components/columns";
import { getFloors } from "@/actions/floor";

async function Desks() {
  const desks = await getAllDesks();

  return (
    <div className="p-3 sm:pt-10 sm:pl-10 flex flex-col space-y-5">
      <h1 className="text-3xl font-bold font-sans">Desks</h1>
      <h2 className="text-slate-500 text-sm"></h2>
      <DataTable columns={columns} data={desks} />
    </div>
  );
}

export default Desks;
