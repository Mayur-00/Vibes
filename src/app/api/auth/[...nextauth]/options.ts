import ArtistModel from "@/app/models/artist.model";
import UserModel from "@/app/models/user.model";
import { ConnectToDatabase } from "@/lib/dbConnect";
import { error } from "console";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials: any): Promise<any> {
        await ConnectToDatabase();

        try {
          const user = await UserModel.findOne({ email: credentials.email });

          if (user) {
            const isPasswordCorrect = await user.comparePassword(
              credentials.password
            );

            if (!isPasswordCorrect) {
              throw new Error("incorrect password");
            }
            return user;
          } else {
            const user = await ArtistModel.findOne({
              email: credentials.email,
            });
            if (!user) {
              throw new Error("No User Or Artist Found in this email");
            }
            const isPasswordCorrect = await user.comparePassword(
              credentials.password
            );

            if (!isPasswordCorrect) {
              throw new Error("incorrect password");
            }
            return user;
          }
        } catch (error: any) {
          throw new Error(error);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        token._id = user._id?.toString();
        token.username = user.username;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.user._id = token._id.toString();
        session.user.username = token.username;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/signIn",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
