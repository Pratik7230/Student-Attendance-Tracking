import { db } from "@/utils";
import { ATTENDANCE } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req) {
    const searchParams = req.nextUrl.searchParams;
    const email = searchParams.get("email");

    if (!email) {
        return NextResponse.json({ error: "Email parameter is required" }, { status: 400 });
    }

    try {
        const result = await db.select().from(ATTENDANCE).where(eq(ATTENDANCE.email, email));
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch attendance", details: error.message }, { status: 500 });
    }
}
