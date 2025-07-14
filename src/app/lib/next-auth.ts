import prisma from "@/app/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
// import GoogleProvider from "next-auth/providers/google";

export const nextAuthOptions: NextAuthOptions = {
  debug: false,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID!,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    // }),
  ],
  adapter: PrismaAdapter(prisma),
  callbacks: {
    session: ({ session, user }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
        },
      };
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
