import { db } from "@/utils";
import { STUDENTS, TEACHER_SUBJECTS, TEACHERS, USER } from "@/utils/schema"; 
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const users = await db.select().from(USER);
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const data = await req.json();
 
        const hashedPassword = await bcrypt.hash(data?.password, 10);

        const result = await db.insert(USER).values({
            name: data?.name,
            email: data?.email,
            password: hashedPassword, // Hash before storing in production
            role_id: data?.role_id
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}



export async function DELETE(req) {
    try {
        // Extract `id` from the URL's query parameters
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }


        const user = await db
                    .select()
                    .from(USER)
                    .where(eq(USER.id, id))
                    .limit(1);
        
        if (!user.length) {
            return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
        }
        
        const {email,role_id} = user[0];
        if(role_id === 3 ){
            const student_result = await db.delete(STUDENTS)
            .where(eq(STUDENTS.email, email));
        }else if(role_id === 2){
            const [teacher] = await db.select().from(TEACHERS).where(eq(TEACHERS.email,email))
            if(teacher){
                const teacher_sub_result = await db.delete(TEACHER_SUBJECTS)
                .where(eq(TEACHER_SUBJECTS.teacherId, teacher.id));

                const teacher_result = await db.delete(TEACHERS)
                .where(eq(TEACHERS.id, teacher.id));
            }
            
        }        

        // Delete the user from the database
        const result = await db.delete(USER).where({ id });

        if (result.affectedRows === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        console.error("Delete User Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}