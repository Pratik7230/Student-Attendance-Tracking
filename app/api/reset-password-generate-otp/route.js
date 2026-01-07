import { USER } from "@/utils/schema";
import { db } from "@/utils";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import sendEmail from "@/lib/email-util";

// Function to generate a 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();
export async function POST(req) {
    try {
      const { email } = await req.json();
  
      // Fetch user from DB
      const user = await db.select().from(USER).where(eq(USER.email, email)).limit(1);
      if (!user.length) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
  
      // Generate OTP and expiry time (5 minutes from now)
      const otp = generateOTP();
      const otpExpiry = new Date();
      otpExpiry.setMinutes(otpExpiry.getMinutes() + 5);
  
      // Store OTP in database
      await db
        .update(USER)
        .set({ otp, otp_expiry: otpExpiry })
        .where(eq(USER.email, email));
  
      // Send OTP via email
      await sendEmail({
        from: '"Students Attendance" <Pratik7230.1@gmail.com>',
        to:email,
        subject:"OTP for Password Reset",
        //text:` Your OTP is: <h1>${otp}</h1>. It is valid for 5 minutes.`
        text: `
            <p>Hi there,</p>
            <p>Please use the code below to reset your Password and continue on Students Attendance.</p>
            <p>This code will expire in 5 Minutes. If you don't think you should be receiving this email, you can safely ignore it.</p>
            <h1>${otp}</h1>
            <p>You received this email because you requested a Password Reset code from Students Attendance.</p>
        `,
      });
  
      return NextResponse.json({ message: "OTP generated and sent successfully." }, { status: 200 });
    } catch (error) {
      console.error("Error generating OTP:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }