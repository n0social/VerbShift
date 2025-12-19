import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

  try {
    const body = await req.json();
    const { name, email, password, csrfToken } = body;

    // CSRF protection: require valid CSRF token (double submit cookie pattern)
    // The client should send a CSRF token in both a cookie and the request body/header
    const csrfCookie = req.headers.get('cookie')?.split(';').find(c => c.trim().startsWith('csrfToken='));
    const csrfCookieValue = csrfCookie ? csrfCookie.split('=')[1] : null;
    if (!csrfToken || !csrfCookieValue || csrfToken !== csrfCookieValue) {
      return NextResponse.json({ error: 'Invalid or missing CSRF token' }, { status: 403 });
    }

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Enforce strong password
    const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    if (!strongPassword.test(password)) {
      return NextResponse.json({
        error:
          'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.'
      }, { status: 400 });
    }

    // Prevent duplicate accounts by email (case-insensitive)
    const existingUser = await prisma.user.findFirst({ where: { email: { equals: email, mode: 'insensitive' } } });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'user',
      },
    });

    return NextResponse.json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error('Signup API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}