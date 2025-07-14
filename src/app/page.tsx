// eslint-disable-next-line @next/next/no-async-client-component
import Book from "@/app/components/Book";
import { getAllBooks } from "@/app/lib/microcms";
import { nextAuthOptions } from "@/app/lib/next-auth";
import { BookType, Purchase, User } from "@/app/types/BookType";
import { getServerSession } from "next-auth";

export default async function Home() {
  const { contents } = await getAllBooks();

  const session = await getServerSession(nextAuthOptions);
  const user: User = session?.user as User;

  let bookDataIds: string[] = []; // 空配列で初期化

  if (user) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/purchases/${user.id}`);
    const datas = await response.json();
    bookDataIds = datas.map((data: Purchase) => data.bookId);
  }

  return (
    <>
      <main className="flex flex-wrap justify-center items-center md:mt-32 mt-20">
        <h2 className="text-center w-full font-bold text-3xl mb-2">Book Commerce</h2>
        {contents.map((book: BookType) => (
          <Book key={book.id} book={book} isPurchased={bookDataIds.includes(book.id.toString()) || false} />
        ))}
      </main>
    </>
  );
}
