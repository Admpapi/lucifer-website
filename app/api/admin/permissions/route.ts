import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const permissionsSchema = z.object({
  email: z.string().email(),
  role: z.enum(["ADMIN", "USER"]),
  canAddProducts: z.boolean().optional(),
  canRemoveProducts: z.boolean().optional(),
  canEditPrices: z.boolean().optional(),
  canViewOrders: z.boolean().optional(),
  canManageTickets: z.boolean().optional(),
  canManageAdmins: z.boolean().optional(),
  canViewAnalytics: z.boolean().optional()
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "OWNER") {
      return NextResponse.json(
        { error: "Unauthorized - Owner only" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { email, role, ...permissions } = permissionsSchema.parse(body);

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Update user role
    await prisma.user.update({
      where: { id: user.id },
      data: { role }
    });

    // Create or update admin permissions
    if (role === "ADMIN") {
      await prisma.adminPermission.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          ...permissions
        },
        update: permissions
      });
    }

    return NextResponse.json({
      message: `${email} is now an ${role}`,
      user: { email, role }
    }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Permissions error:", error);
    return NextResponse.json(
      { error: "Failed to update permissions" },
      { status: 500 }
    );
  }
}
