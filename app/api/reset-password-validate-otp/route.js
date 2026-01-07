import { USER } from "@/utils/schema";
import { db } from "@/utils";
import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";

export async function POST(req) {
    try {
        const { email, otp } = await req.json();

        // Fetch user from DB with email & otp
        const user = await db
            .select()
            .from(USER)
            .where(and(eq(USER.email, email), eq(USER.otp, otp)))
            .limit(1);

        if (!user.length) {
            return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
        }

        const userData = user[0];

        // Check if OTP is expired
        const currentTime = new Date();
        if (userData.otp_expiry && new Date(userData.otp_expiry) < currentTime) {
            return NextResponse.json({ error: "OTP expired" }, { status: 400 });
        }       

        return NextResponse.json({ message: "OTP verified successfully." }, { status: 200 });

    } catch (error) {
        console.error("Error validating OTP:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
