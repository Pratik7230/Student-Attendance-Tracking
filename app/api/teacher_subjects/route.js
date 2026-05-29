import { db } from '@/utils';
import { SUBJECTS, TEACHER_SUBJECTS, TEACHERS, USER } from '@/utils/schema';
import { eq, or } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const searchParams = req.nextUrl.searchParams;
  const userId = searchParams.get('userId');
  let email = '';
  const teacher_email = searchParams.get('teacher_email');
  if (userId && userId != 0) {
    const [{ email: dbEmail }] = await db
      .select()
      .from(USER)
      .where(eq(USER.id, userId));
    email = dbEmail;
  } else if (teacher_email) {
    email = teacher_email;
  }

  console.log({ email });

  const [teacher] = await db
    .select()
    .from(TEACHERS)
    .where(eq(TEACHERS.email, email));
  const teacherId = teacher.id;

  const result = await db
    .select({
      id: SUBJECTS.id,
      name: SUBJECTS.name,
    })
    .from(TEACHER_SUBJECTS)
    .innerJoin(SUBJECTS, eq(TEACHER_SUBJECTS.subjectId, SUBJECTS.id))
    .where(eq(TEACHER_SUBJECTS.teacherId, teacherId));
  return NextResponse.json(result);
}

export async function PUT(req) {
  const searchParams = req.nextUrl.searchParams;
  const userId = searchParams.get('teacherUserId');
  const [{ email }] = await db.select().from(USER).where(eq(USER.id, userId));
  const [teacher] = await db
    .select()
    .from(TEACHERS)
    .where(eq(TEACHERS.email, email));
  const teacherId = teacher.id;
  const selectedSubjects = await req.json();

  if (!teacherId) {
    return new Response('Missing teacherId', { status: 400 });
  }

  if (!Array.isArray(selectedSubjects)) {
    return new Response('Invalid subjects format', { status: 400 });
  }

  try {
    // Step 1: Delete existing subjects for the teacher
    console.log('delete', { teacherId: Number(teacherId), selectedSubjects });
    await db
      .delete(TEACHER_SUBJECTS)
      .where(eq(TEACHER_SUBJECTS.teacherId, Number(teacherId)));

    // Step 2: Insert new subjects
    console.log('update', { teacherId: Number(teacherId), selectedSubjects });
    if (selectedSubjects.length > 0) {
      const insertData = selectedSubjects.map((subjectId) => ({
        teacherId: Number(teacherId),
        subjectId,
      }));

      await db.insert(TEACHER_SUBJECTS).values(insertData);
    }

    return new Response('Subjects updated successfully', { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
