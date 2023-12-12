import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";
import EmployeeTable from "./_components/EmployeeTable";

function Employees() {
  // table not showing up
  return (
    <div className="p-3 sm:pt-10 sm:pl-10 flex flex-col space-y-5">
      <h1 className="text-3xl font-bold font-sans">Employees</h1>
      <EmployeeTable />
    </div>
  );
}

export default Employees;
