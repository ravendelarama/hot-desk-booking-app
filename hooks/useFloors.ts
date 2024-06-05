"use client";

import { Floor } from "@prisma/client";

import { getFloors } from "@/actions/floor";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

function useFloors(query: string
) {
    // const [floors, setFloors] = useState<Floor[]>([]);
    const { data: floors, fetchStatus, isFetching, isPaused, isStale } = useQuery({
        queryKey: ["floors"],
        queryFn: async () => await getFloors(query),
    });

    return {
        floors,
        fetchStatus,
        isFetching,
        isPaused,
        isStale
    };
}

export default useFloors;