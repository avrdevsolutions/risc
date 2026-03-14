import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

import { db } from '../../db'
import { users } from '../../db/schema'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const email = (credentials.email as string)?.toLowerCase().trim()
        const user = await db.query.users.findFirst({
          where: eq(users.email, email),
        })
        if (!user) return null

        const valid = await bcrypt.compare(credentials.password as string, user.passwordHash)
        if (!valid) return null

        return { id: user.id, email: user.email, name: user.name, role: user.role }
      },
    }),
  ],
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    session({ session, token }) {
      if (token.sub) session.user.id = token.sub
      if (token.role) session.user.role = token.role as string
      return session
    },
    jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role
      }
      return token
    },
  },
})
