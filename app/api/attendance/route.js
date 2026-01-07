//app/api/attendance/route.js
import { db } from "@/utils";
import { ATTENDANCE, STUDENTS, USER } from "@/utils/schema";
import { NextResponse } from "next/server";
import { and, eq, isNull, or } from "drizzle-orm"; // Ensure 'like' is imported

export async function GET(req) {
    const searchParams = req.nextUrl.searchParams;
    const month = searchParams.get('month');
    const selectedSubjectId = searchParams.get('selectedSubjectId');
    const gradeId = searchParams.get('gradeId');
    const studentUserId = searchParams.get('studentUserId');
    if (gradeId) {
        //selectedSubjectId
        const result = await db
            .select({
                name: STUDENTS.name,
                present: ATTENDANCE.present,
                day: ATTENDANCE.day,
                date: ATTENDANCE.date,
                gradeId: STUDENTS.gradeId,
                studentId: STUDENTS.id,
                attendanceId: ATTENDANCE.id,
            })
            .from(STUDENTS)
            .leftJoin(ATTENDANCE, and(eq(STUDENTS.id, ATTENDANCE.studentId), eq(ATTENDANCE.subjectId, selectedSubjectId), eq(ATTENDANCE.date, month)))
            .where(and(eq(STUDENTS.gradeId, gradeId)))

        return NextResponse.json(result);
    } else if (studentUserId) {
        const [{ email }] = await db.select().from(USER).where(eq(USER.id, studentUserId))
        const [student] = await db.select().from(STUDENTS).where(eq(STUDENTS.email, email));
        const result = await db
            .select({
                name: STUDENTS.name,
                present: ATTENDANCE.present,
                day: ATTENDANCE.day,
                date: ATTENDANCE.date,
                gradeId: STUDENTS.gradeId,
                studentId: STUDENTS.id,
                attendanceId: ATTENDANCE.id,
            })
            .from(STUDENTS)
            .leftJoin(ATTENDANCE, and(eq(STUDENTS.id, ATTENDANCE.studentId), eq(ATTENDANCE.subjectId, selectedSubjectId), eq(ATTENDANCE.date, month)))
            .where(and(eq(ATTENDANCE.studentId, student.id)))
        return NextResponse.json(result);
    } else {
        return NextResponse.json([]);
    }
}
export async function POST(req, res) {
    const data = await req.json();
    const result = await db.insert(ATTENDANCE)
        .values({
            studentId: data.studentId,
            present: data.present,
            day: data.day,
            date: data.date,
            subjectId: data.subjectId,
            gradeId: data.gradeId
        })
    return NextResponse.json(result)
}

export async function DELETE(req) {
    const searchParams = req.nextUrl.searchParams;
    const studentId = searchParams.get('studentId');
    const date = searchParams.get('date');
    const day = searchParams.get('day');
    const gradeId = searchParams.get('gradeId');
    const subjectId = searchParams.get('subjectId');
    //subjectId
    const result = await db.delete(ATTENDANCE)
        .where(
            and(
                eq(ATTENDANCE.studentId, studentId),
                eq(ATTENDANCE.day, day),
                eq(ATTENDANCE.subjectId, subjectId),
                eq(ATTENDANCE.gradeId, gradeId),
                eq(ATTENDANCE.date, date)
            )
        )

    return NextResponse.json(result);

}
