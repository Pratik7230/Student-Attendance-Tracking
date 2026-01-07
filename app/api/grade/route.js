import { db } from "@/utils";
import { GRADE_SUBJECTS, GRADES } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req) {
    //selectedSubjectId
    const searchParams = req.nextUrl.searchParams;
    const selectedSubjectId = searchParams.get('selectedSubjectId');

    if (selectedSubjectId) {
        const result = await db.select({
            id: GRADES.id,
            grade: GRADES.grade
        })
            .from(GRADES)
            .innerJoin(GRADE_SUBJECTS, eq(GRADES.id, GRADE_SUBJECTS.gradeId))
            .where(eq(GRADE_SUBJECTS.subjectId, selectedSubjectId));
        return NextResponse.json(result);
    } else {
        const result = await db.select().from(GRADES);
        return NextResponse.json(result);
    }

}