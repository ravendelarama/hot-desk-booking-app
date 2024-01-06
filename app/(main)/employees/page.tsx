"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import useEmployee from "@/hooks/useEmployee";

function Employees() {
  // table not showing up
  const { employees } = useEmployee();

  return (
    <div className="p-3 sm:pt-10 sm:pl-10 flex flex-col space-y-5">
      <h1 className="text-3xl font-bold font-sans">Employees</h1>
      {/* @ts-ignore */}
      <DataTable columns={columns} data={employees} />
    </div>
  );
}

export default Employees;
