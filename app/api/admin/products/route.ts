import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const productSchema = z.object({
  title: z.string().min(3),
  price: z.number().min(0),
  stock: z.number().min(0).optional()
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role === "USER") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const data = productSchema.parse(body);

    // For now, we'll just return success since we don't have a Product model yet
    // In production, you'd save to the database
    const product = {
      id: Math.random().toString(36).substr(2, 9),
      ...data,
      createdAt: new Date()
    };

    return NextResponse.json({
      message: "Product added successfully",
      product
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Products error:", error);
    return NextResponse.json(
      { error: "Failed to add product" },
      { status: 500 }
    );
  }
}
