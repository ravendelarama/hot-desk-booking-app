"use client";

import { Floor } from "@prisma/client";

import { getFloors } from "@/actions/floor";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

function useFloors() {
    // const [floors, setFloors] = useState<Floor[]>([]);
    const { data: floors, fetchStatus, isFetching, isPaused, isStale } = useQuery({
        queryKey: ["floors"],
        queryFn: async () => await getFloors(),
        staleTime: 60 * 1000,
        refetchInterval: 60 * 1000,
        refetchIntervalInBackground: true
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