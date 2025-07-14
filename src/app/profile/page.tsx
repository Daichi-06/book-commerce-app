import PurchaseProduct from "@/app/components/PurchaseProduct";
import { getDetailBook } from "@/app/lib/microcms";
import { nextAuthOptions } from "@/app/lib/next-auth";
import { BookType, Purchase, User } from "@/app/types/BookType";
import { getServerSession } from "next-auth";
import Image from "next/image";

export default async function ProfilePage() {
  const session = await getServerSession(nextAuthOptions);
  const user: User = session?.user as User;

  let books: BookType[] = [];
  if (user) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/purchases/${user.id}`);
    const datas = await response.json();

    books = await Promise.all(
      datas.map(async (purchase: Purchase) => {
        const book = await getDetailBook(purchase.bookId);
        return book;
      })
    );
    console.log(books);
  }
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">プロフィール</h1>

      <div className="bg-white shadow-md rounded p-4">
        <div className="flex items-center">
          <Image
            priority
            src={user.image || "/default_icon.png"}
            alt="user profile_icon"
            width={60}
            height={60}
            className="rounded-t-md"
          />
          <h2 className="text-lg ml-4 font-semibold">お名前：{user.name}</h2>
        </div>
      </div>

      <span className="font-medium text-lg mb-4 mt-4 block">購入した記事</span>
      <div className="flex items-center gap-6">
        {books.map((book) => (
          <PurchaseProduct key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
}
