import { getServerSession } from "next-auth/next";
import { NextAuthOptions, User } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";
import jsonwebtoken from "jsonwebtoken";
import { JWT } from "next-auth/jwt";
import { createClient } from '@sanity/client';
import { groq } from 'next-sanity';

import { SessionInterface, UserProfile } from "@/common.types";

// Sanity Client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2021-03-25',
  useCdn: process.env.NODE_ENV === 'production',
});

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  jwt: {
    encode: ({ secret, token }) => {
      // ... JWT encode logic
    },
    decode: async ({ secret, token }) => {
      // ... JWT decode logic
    },
  },
  theme: {
    colorScheme: "light",
    logo: "/logo.svg",
  },
  callbacks: {
    async session({ session }) {
      const email = session?.user?.email as string;

      try {
        // GROQ Query to fetch user
        const query = groq`*[_type == "user" && email == $email][0]`;
        const user = await client.fetch(query, { email }) as UserProfile;

        return {
          ...session,
          user: {
            ...session.user,
            ...user,
          },
        };
      } catch (error) {
        console.error("Error retrieving user data: ", error.message);
        return session;
      }
    },
    async signIn({ user }: { user: AdapterUser | User }) {
      try {
        // GROQ Query to check if user exists
        const query = groq`*[_type == "user" && email == $email][0]`;
        const existingUser = await client.fetch(query, { email: user.email }) as UserProfile;

        if (!existingUser) {
          // Create user if not exists
          await client.create({
            _type: 'user',
            name: user.name,
            email: user.email,
            image: user.image,
          });
        }

        return true;
      } catch (error) {
        console.error("Error checking if user exists: ", error.message);
        return false;
      }
    },
  },
};

export async function getCurrentUser() {
  const session = (await getServerSession(authOptions)) as SessionInterface;
  return session;
}
