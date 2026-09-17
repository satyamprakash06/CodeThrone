import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db"; // your prisma client instance
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,

      mapProfileToUser: async (profile) => ({
        email: profile.email ?? `${profile.id}@user.noreply.github.com`,
        name: profile.name ?? profile.login,
      }),
    },
  },
  plugins: [nextCookies()], // make sure this is the last plugin in the array
});
