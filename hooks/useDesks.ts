"use client";

import { Desk } from "@prisma/client";
import { getDesks } from "@/actions/desk";

import { useQuery } from "@tanstack/react-query";

function useDesks({ floorId: floor }: { floorId: string; }) {
    // const [desks, setDesks] = useState<Desks>([]);
    // const [floor, setFloor] = useState<string | null>(null)
    const { data: desks } = useQuery({
        queryKey: ["desks"],
        queryFn: async () => await getDesks({ floor }),
        staleTime: 5 * 1000,
        refetchInterval: 5 * 1000,
    });

    console.log("Desks: ")
    console.log(desks)

    return {
        desks
    };
}

export default useDesks;