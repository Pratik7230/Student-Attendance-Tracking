import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { USER } from "@/utils/schema";
import { db } from "@/utils";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function POST(req) {
  const SECRET_KEY = process.env.JWT_SECRET_KEY;

  try {
    const { currentPassword, newPassword } = await req.json();
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Decode JWT to get user info
    let decoded;
    try {
      decoded = jwt.verify(token, SECRET_KEY);
    } catch (error) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    const userId = decoded.id;
    const userEmail = decoded.email;

    // Fetch user from DB
    const user = await db.select().from(USER).where(eq(USER.id, userId)).limit(1);
    if (!user.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userData = user[0];

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, userData.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    await db
      .update(USER)
      .set({ password: hashedPassword })
      .where(eq(USER.id, userId));

    return NextResponse.json({ message: "Password updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error changing password:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


