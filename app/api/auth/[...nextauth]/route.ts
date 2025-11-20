import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma: PrismaClient = new PrismaClient();

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(
        credentials: Record<string, string> | undefined
      ): Promise<any> {
        if (!credentials) {
          return null;
        }

        const user: Awaited<ReturnType<typeof prisma.user.findUnique>> =
          await prisma.user.findUnique({
            where: { email: credentials.email },
          });

        if (user && bcrypt.compareSync(credentials.password, user.password)) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }): Promise<any> {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({
      session,
      token,
    }: {
      session: any;
      token: any;
    }): Promise<any> {
      if (session.user) {
        session.user.id = token.sub as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler: (req: any, res: any) => any = NextAuth(authOptions);
export { handler as GET, handler as POST };
