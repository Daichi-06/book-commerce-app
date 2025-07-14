import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import Header from "@/app/components/Header";
import AuthProvider from "@/app/components/AuthProvider";
import { Suspense } from "react";
import LoadingSpinner from "@/app/loading";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "マイナンバー",
  description: "マイナンバー",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${notoSansJP.variable} ${notoSansJP.variable} antialiased`}>
        <AuthProvider>
          <Header />
          <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
        </AuthProvider>
      </body>
    </html>
  );
}
