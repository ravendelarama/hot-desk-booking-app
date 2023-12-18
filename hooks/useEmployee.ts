"use client";

import { User } from "@prisma/client";
import { useEffect, useState } from "react";
import { getOtherUsers } from "@/actions/actions";

function useEmployee() {
    const [employees, setEmployees] = useState<Pick<User, "id" | "firstName" | "lastName" | "email" | "role">[]>([]);
    const [count, setCount] = useState<number>(0);

    useEffect(() => {
        const getEmployees = async () => {
            const users = await getOtherUsers();
            setEmployees([...users]);
            setCount(users.length)
        }

        getEmployees();
    }, []);

    return {employees, count};
}

export default useEmployee;