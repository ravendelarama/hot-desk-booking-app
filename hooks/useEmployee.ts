"use client";
import { getOtherUsers } from "@/actions/user";

import { useEffect, useState } from "react";

type User = {
    image: string | null;
    firstName: string;
    lastName: string;
    role: string;
    email: string | null;
    edit: object;
    delete: string | null;
}
function useEmployee() {
    const [employees, setEmployees] = useState <User[]>([])
    const [count, setCount] = useState<number>(0);

    useEffect(() => {
        const getEmployees = async () => {
            const users = await getOtherUsers();
            // @ts-ignore
            setEmployees([...users]);
            setCount(users.length)
        }

        getEmployees();
    }, []);

    return {employees, count};
}

export default useEmployee;