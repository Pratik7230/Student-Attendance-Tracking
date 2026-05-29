import { db } from '@/utils';
import { ATTENDANCE, STUDENTS } from '@/utils/schema';
import { and, desc, eq, sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const searchParams = req.nextUrl.searchParams;
  const date = searchParams.get('date');
  const gradeId = searchParams.get('gradeId');
  const selectedSubjectId = searchParams.get('selectedSubjectId');

  const result = await db
    .select({
      day: ATTENDANCE.day,
      presentCount: sql`count(${ATTENDANCE.day})`,
    })
    .from(ATTENDANCE)
    .innerJoin(
      STUDENTS,
      and(
        eq(ATTENDANCE.studentId, STUDENTS.id),
        eq(ATTENDANCE.subjectId, selectedSubjectId),
        eq(ATTENDANCE.date, date)
      )
    )
    .groupBy(ATTENDANCE.day)
    .where(eq(STUDENTS.gradeId, gradeId))
    .orderBy(desc(ATTENDANCE.day))
    .limit(7);

  return NextResponse.json(result);
}
