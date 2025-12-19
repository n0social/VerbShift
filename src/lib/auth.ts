import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        try {
          console.log('Authorize Function: Received credentials', credentials);
          // CSRF protection: require valid CSRF token (double submit cookie pattern)
          const csrfToken = credentials?.csrfToken;
          let csrfCookieValue = null;
          if (typeof req !== 'undefined' && req.headers) {
            const cookieHeader = req.headers.cookie || '';
            const csrfCookie = cookieHeader.split(';').find(c => c.trim().startsWith('csrfToken='));
            csrfCookieValue = csrfCookie ? csrfCookie.split('=')[1] : null;
          } else if (typeof window !== 'undefined') {
            // fallback for client-side (should not happen in authorize)
            csrfCookieValue = document.cookie.split('; ').find(row => row.startsWith('csrfToken='))?.split('=')[1];
          }
          if (!csrfToken || !csrfCookieValue || csrfToken !== csrfCookieValue) {
            console.error('Authorize Function: Invalid or missing CSRF token');
            return null;
          }
          if (!credentials?.email || !credentials?.password) {
            console.error('Authorize Function: Missing email or password');
            return null;
          }
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });
          if (!user) {
            return null;
          }
          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) {
            return null;
          }
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.image,
          };
        } catch (err) {
          console.error('Authorize Function: Exception thrown:', err);
          throw err;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log('JWT Callback: Token before modification:', token);
      console.log('JWT Callback: User provided:', user);
      if (user) {
        console.log('JWT Callback: Adding role and id to token');
        token.role = user.role;
        token.id = user.id;
      }
      console.log('JWT Callback: Token after modification:', token);
      return token
    },
    async session({ session, token }) {
      console.log('Session Callback: Received session:', session);
      console.log('Session Callback: Received token:', token);
      console.log('Session Callback: Session before modification:', session);
      console.log('Session Callback: Token provided:', token);
      if (session.user) {
        console.log('Session Callback: Adding role and id to session');
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      console.log('Session Callback: Session after modification:', session);
      return session
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      console.log('Redirect Callback: URL:', url);
      console.log('Redirect Callback: Base URL:', baseUrl);
      console.log('Redirect Callback: Full details:', {
        url,
        baseUrl,
        isBaseUrl: url.startsWith(baseUrl),
        redirectTo: url.startsWith(baseUrl) ? url : `${baseUrl}/user/dashboard`,
      });
      // Always redirect to the dashboard after login
      return url.startsWith(baseUrl) ? url : `${baseUrl}/user/dashboard`;
    },
  },
  pages: {
    signIn: '/login', // Redirect to the general login page
  },
  debug: true, // Enable debug mode to log detailed information about the authentication process
}
