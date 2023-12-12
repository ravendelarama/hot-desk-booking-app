"use client";

import { getFloors } from "@/actions/actions";
import { Floor } from "@prisma/client";
import { useEffect, useState } from "react";

function useFloors() {
    const [floors, setFloors] = useState<Floor[]>([]);
    const [activeFloor, setActiveFloor] = useState<string | null>(null);
    const [activeImage, setActiveImage] = useState<string | null>(null);
    
    useEffect(() => {
        const initialFloors = async () => {
            const res = await getFloors();
            setFloors([...res]);
            // setActiveFloor(res[0].floor);
            // setActiveImage(res[0].image!);
        };

        initialFloors();
    }, []);

    return {
        floors,
        activeFloor,
        setActiveFloor: (active: string, image: string) => {
            setActiveFloor(active);
            setActiveImage(image)
        },
        activeImage
    };
}

export default useFloors;