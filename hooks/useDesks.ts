"use client";

import { useState, useEffect } from "react";
import { Desk } from "@prisma/client";
import { getDesks } from "@/actions/actions";

type D = Pick<Desk, "id" | "name" | "coordinates" | "status">;
type Desks = D[];

function useDesks() {
    const [data, setData] = useState<Desks>([]);
    const [floor, setFloor] = useState<string | null>(null)
    const [selectedDesk, setSelectedDesk] = useState<D | null>(null);

    useEffect(() => {
        const initialDesks = async () => {
            const res = await getDesks({
                floor: "F1D10"
            });
            setData([...res?.Desk!]);
        };


        // const resetDesks = () => setData([]);

        // // initialDesks();

        // return resetDesks();
    }, []);

    const setDesks = (desks: Desks, flr: string): void => {
        setData(desks);
        setFloor(flr);
    };

    const desks = data;

    return {
        desks,
        setDesks,
        selectedDesk,
        setSelectedDesk: (value: D | null) => setSelectedDesk(value)
    };
}

export default useDesks;