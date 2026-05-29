import { db } from '@/utils';
import { STUDENTS, USER } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

export async function POST(req) {
  try {
    const data = await req.json();
    const hashedPassword = await bcrypt.hash('Student#1234', 10);
    if (Array.isArray(data)) {
      // If data is an array, perform bulk insert
      const student_result = await db.insert(STUDENTS).values(data);
      const user_result = await db.insert(USER).values(
        data.map((x) => ({
          name: x.name,
          email: x.email,
          role_id: 3,
          password: hashedPassword,
        }))
      );
      return NextResponse.json(
        {
          message: 'Bulk students added successfully!',
          result: student_result,
        },
        { status: 201 }
      );
    } else {
      // If data is a single object, insert one student
      const result = await db.insert(STUDENTS).values({
        name: data?.name,
        gradeId: data?.gradeId,
        email: data?.email,
        address: data?.address,
        contact: data?.contact,
      });

      const userData = {
        name: data.name,
        email: data.email,
        role_id: 3,
        password: hashedPassword,
      };

      const user_result = await db.insert(USER).values(userData);

      return NextResponse.json(
        { message: 'Student added successfully!', result },
        { status: 201 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to insert students', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  const result = await db.select().from(STUDENTS);
  return NextResponse.json(result);
}

export async function DELETE(req) {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get('id');

  const user = await db
    .select()
    .from(STUDENTS)
    .where(eq(STUDENTS.id, id))
    .limit(1);

  if (!user.length) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  const { email } = user[0];

  const result = await db.delete(STUDENTS).where(eq(STUDENTS.id, id));

  const user_result = await db.delete(USER).where(eq(USER.email, email));

  return NextResponse.json(result);
}
