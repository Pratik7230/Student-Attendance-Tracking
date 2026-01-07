import { db } from "@/utils";
import { GRADE_SUBJECTS, STUDENTS, SUBJECTS, TEACHER_SUBJECTS, TEACHERS, USER } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req) {
    const searchParams=req.nextUrl.searchParams;
    const studentUserId=searchParams.get('studentUserId');

    const [{ email }] = await db.select().from(USER).where(eq(USER.id, studentUserId))
    const [student] = await db.select().from(STUDENTS).where(eq(STUDENTS.email,email))
    const gradeId = student.gradeId;

    const result = await db.select({
        id: SUBJECTS.id,
        name: SUBJECTS.name
    })
        .from(GRADE_SUBJECTS)
        .innerJoin(SUBJECTS, eq(GRADE_SUBJECTS.subjectId, SUBJECTS.id))
        .where(eq(GRADE_SUBJECTS.gradeId, gradeId));
    return NextResponse.json(result);
}