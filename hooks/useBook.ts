import { Desk } from "@prisma/client";

import { useState } from "react";

import { addBooking } from "@/actions/booking";

type Book = Pick<Desk, "id" | "name" | "coordinates" | "status">;

function useBook() {
    const [book, setBook] = useState<Book | null>(null);
    const [date, setDate] = useState<Date | null>(null);

    return {
        book,
        setBook: (value: Book) => setBook(value),
        setDate: (value: Date) => setDate(value),
        handleBooking: async () => {
            await addBooking(book!, date!);
        }
    };
}

export default useBook;