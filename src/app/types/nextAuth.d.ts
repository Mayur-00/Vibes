import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    _id?: string;
    username: string;
    role: string;
  }
  interface Session {
    user: {
      _id?: string;
      username: string;
      role: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface jwt {
    _id?: string;
    username: string;
    role: string;
  }
}
