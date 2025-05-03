import NextAuth, { DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/ prisma";


// Extend the default session type to include `id`
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string; // Include role in the session type
    } & DefaultSession["user"];
  }

  interface JWT {
    id: string;
    role: string; // Include role in the JWT type
  }
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
      profile: async (profile) => {
        const user = await prisma.user.findUnique({ where: { email: profile.email } });
        const userCount = await prisma.user.count(); 
        if (!user) {
          // Create a new user if not found
          const newUser = await prisma.user.create({
            data: {
              email: profile.email,
              name: profile.name,
              image: profile.picture,
              password: await bcrypt.hash(profile.email, 10),
              role: userCount === 0 ? "admin" : "user", // Assign 'admin' role to the first user
            },
          });
          return { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role };
        }
        return { id: user.id, email: user.email, name: user.name, role: user.role, image:user.image };
      },
    }),
    AppleProvider({
      clientId: process.env.APPLE_CLIENT_ID!,
      clientSecret: process.env.APPLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials || {};
        if (!email || !password) {
          throw new Error("Email and password are required");
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          throw new Error("No user found with this email");
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          throw new Error("Invalid password");
        }

        return { id: user.id, email: user.email, name: user.name, role: user.role , image:user.image }; // Include role in the returned user
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = (user as any).role || "user"; // Include role in the token
        token.image = user.image; // Include image in the token
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user = {
          ...session.user,
          id: token.id as string,
          role: token.role as string, // Include role in the session
          image: token.image as string, // Include image in the session
        };
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
  debug: true,
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
