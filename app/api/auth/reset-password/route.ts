import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { z } from "zod";

const requestResetSchema = z.object({
  email: z.string().email("Invalid email address")
});

const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8, "Password must be at least 8 characters")
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const url = new URL(request.url);

    // Check if this is a reset request or password update
    if (url.searchParams.get("action") === "reset") {
      const { email } = requestResetSchema.parse(body);

      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        return NextResponse.json(
          { error: "If an account exists with this email, a reset link will be sent" },
          { status: 200 }
        );
      }

      // Create reset token
      const token = crypto.randomBytes(32).toString("hex");
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      await prisma.passwordReset.create({
        data: {
          email,
          token,
          expires
        }
      });

      // TODO: Send email with reset link
      console.log(`Reset link: /auth/reset-password?token=${token}`);

      return NextResponse.json({
        message: "If an account exists with this email, a reset link will be sent"
      }, { status: 200 });
    }

    // Password reset with token
    const { token, password } = resetPasswordSchema.parse(body);

    const resetRecord = await prisma.passwordReset.findUnique({
      where: { token }
    });

    if (!resetRecord || resetRecord.used || resetRecord.expires < new Date()) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    // Update password
    const hashedPassword = await bcrypt.hash(password, 12);
    await prisma.user.update({
      where: { email: resetRecord.email },
      data: { password: hashedPassword }
    });

    // Mark reset token as used
    await prisma.passwordReset.update({
      where: { token },
      data: { used: true }
    });

    return NextResponse.json({
      message: "Password reset successfully"
    }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "An error occurred" },
      { status: 500 }
    );
  }
}
