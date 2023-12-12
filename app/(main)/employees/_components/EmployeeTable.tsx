"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableFooter,
  TableRow,
} from "@/components/ui/table";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import useEmployee from "@/hooks/useEmployee";

function EmployeeTable() {
  const employees = useEmployee();
  // non-interactive table for client
  // admin data table will be implemented...
  return (
    <Table>
      <TableCaption>A list of employees.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Profile</TableHead>
          <TableHead>First Name</TableHead>
          <TableHead>Last Name</TableHead>
          <TableHead>Email</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {employees.map((item) => (
          <TableRow key={item.id}>
            <TableCell>
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>RB</AvatarFallback>
              </Avatar>
            </TableCell>
            <TableCell className="font-medium">{item.firstName}</TableCell>
            <TableCell className="font-medium">{item.lastName}</TableCell>
            <TableCell>{item.email}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">{employees.length}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}

export default EmployeeTable;
