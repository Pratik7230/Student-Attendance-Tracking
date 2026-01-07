import { USER } from "@/utils/schema";
import { db } from "@/utils";
import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import bcrypt from "bcrypt";

export async function POST(req) {
    try {
        const { email, otp, password } = await req.json();

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

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update the user's password and clear OTP fields
        await db
            .update(USER)
            .set({ password: hashedPassword, otp: null, otp_expiry: null })
            .where(eq(USER.email, email));

        return NextResponse.json({ message: "Password updated successfully." }, { status: 200 });

    } catch (error) {
        console.error("Error resetting password:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
