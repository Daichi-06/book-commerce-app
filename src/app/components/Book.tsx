"use client";

import { BookType, User } from "@/app/types/BookType";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

// interface Author {
//   id: number;
//   name: string;
//   description: string;
//   profile_icon: string;
// }

interface BookProps {
  book: BookType;
  isPurchased?: boolean;
}

// eslint-disable-next-line react/display-name
const Book = ({ book, isPurchased }: BookProps) => {
  const [showModal, setShowModal] = useState(false);
  const { data: session } = useSession();
  const user: User = session?.user as User;
  const router = useRouter();

  const handleCancel = () => {
    setShowModal(false);
  };

  const handleBuy = () => {
    if (isPurchased) {
      router.push(`/book/${book.id}`);
    } else {
      setShowModal(true);
    }
  };

  const startCheckout = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookId: book.id, title: book.title, price: book.price, userId: user?.id }),
      });
      const resData = await response.json();
      if (resData && resData.checkout_url) {
        router.push(resData.checkout_url);
      }
    } catch (error) {
      console.error("Error starting checkout:", error);
    }
  };

  const handleConfirm = () => {
    if (!user) {
      setShowModal(false);
      router.push("/login");
    } else {
      startCheckout();
      // stripeで決済を行う
      console.log("購入します");
    }
  };

  return (
    <>
      {/* アニメーションスタイル */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .modal {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>

      <div className="flex flex-col items-center m-4">
        <a onClick={handleBuy} className="cursor-pointer shadow-2xl duration-300 hover:translate-y-1 hover:shadow-none">
          <Image priority src={book.thumbnail.url} alt={book.title} width={450} height={350} className="rounded-t-md" />
          <div className="px-4 py-4 bg-slate-100 rounded-b-md">
            <h2 className="text-lg font-semibold">{book.title}</h2>
            <p className="mt-2 text-lg text-slate-600">この本は○○...</p>
            <p className="mt-2 text-md text-slate-700">値段：{book.price}円</p>
          </div>
        </a>

        {showModal && (
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-slate-900/50 flex justify-center items-center modal">
            <div className="bg-white p-8 rounded-lg">
              <h3 className="text-xl mb-4">本を購入しますか？</h3>
              <button
                onClick={handleConfirm}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
              >
                購入する
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                キャンセル
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Book;
