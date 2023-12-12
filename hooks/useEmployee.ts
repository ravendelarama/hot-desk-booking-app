"use client";

import { User } from "@prisma/client";
import { useEffect, useState } from "react";
import { getOtherUsers } from "@/actions/actions";

function useEmployee() {
    const [employees, setEmployees] = useState<Pick<User, "id" | "firstName" | "lastName" | "email" | "role">[]>([]);

    useEffect(() => {
        const getEmployees = async () => {
            const users = await getOtherUsers();
            setEmployees([...users]);
        }

        getEmployees();
    }, []);

    return employees;
}

export default useEmployee;