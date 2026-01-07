import { db } from "@/utils";
import { TEACHER_SUBJECTS, TEACHERS, USER } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req) {
    try {
        const data = await req.json();

        if (Array.isArray(data)) {
            // If data is an array, perform bulk insert
            const result = await db.insert(TEACHERS).values(data);
            return NextResponse.json({ message: "Bulk students added successfully!", result }, { status: 201 });
        } else {
            // If data is a single object, insert one student
            const result = await db.insert(TEACHERS)
                .values({
                    name: data?.name,
                    email: data?.email,
                    address: data?.address,
                    contact: data?.contact
                });
            
             const teacherSubjects = []
             for (const element of data.selectedSubjects) {
                teacherSubjects.push({
                    teacherId:result[0].insertId,
                    subjectId:element
                })
             };
             const Subject_result = await db.insert(TEACHER_SUBJECTS).values(teacherSubjects);
            
             const hashedPassword = await bcrypt.hash("Teacher#1234", 10);
             const userData = {
                                name: data.name,
                                email: data.email,
                                role_id: 2,
                                password: hashedPassword,
                            };

             const user_result = await db.insert(USER)
                .values(userData);

            return NextResponse.json({ message: "Teacher added successfully!", result }, { status: 201 });
        }
    } catch (error) {
        return NextResponse.json({ error: "Failed to insert students", details: error.message }, { status: 500 });
    }
}

export async function GET(req) {
    const result = await db.select().from(TEACHERS);
    return NextResponse.json(result);
}

export async function DELETE(req) {
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get('id');
    
    const user = await db
                .select()
                .from(TEACHERS)
                .where(and(eq(TEACHERS.id, id)))
                .limit(1);
    
    if (!user.length) {
        return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }
    
    const {email} = user[0];
    
    const result = await db.delete(TEACHERS)
        .where(eq(TEACHERS.id, id));

     const user_result = await db.delete(TEACHERS)
        .where(eq(TEACHERS.email, email));

    return NextResponse.json(result);
}
