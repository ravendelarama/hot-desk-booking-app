import { useState, useEffect } from "react";
import { Desk } from "@prisma/client";
import { addBooking } from "@/actions/actions";

type Book = Pick<Desk, "id" | "name" | "coordinates" | "status">;

function useBook() {
    const [book, setBook] = useState<Book | null>(null);
    const [date, setDate] = useState<Date | null>(null);

    return {
        book,
        setBook: (value: Book) => setBook(value),
        setDate: (value: Date) => setDate(value),
        handleBooking: async () => {
            const createBooking = await addBooking(book!, date!);
        }
    };
}

export default useBook;