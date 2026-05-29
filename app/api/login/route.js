import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { USER } from '@/utils/schema';
import { db } from '@/utils';
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

export async function POST(req) {
  const SECRET_KEY = process.env.JWT_SECRET_KEY;

  try {
    const { email, password } = await req.json();

    // Fetch user from DB
    const user = await db
      .select()
      .from(USER)
      .where(eq(USER.email, email))
      .limit(1);
    if (!user.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userData = user[0];

    // Verify password
    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role_id: userData.role_id,
      },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    // Role-based redirects
    const roleRedirects = {
      1: '/admin',
      2: '/dashboard',
      3: '/StudentView',
    };

    const redirectUrl = roleRedirects[userData.role_id] || '/';

    // Send token + redirect URL
    return NextResponse.json({ token, redirectUrl }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
