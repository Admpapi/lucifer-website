import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "OWNER") {
      return NextResponse.json(
        { error: "Unauthorized - Owner only" },
        { status: 401 }
      );
    }

    // Get all analytics
    const [
      totalOrders,
      totalRevenue,
      totalUsers,
      completedOrders,
      openTickets
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { totalAmount: true }
      }),
      prisma.user.count(),
      prisma.order.count({
        where: { status: "COMPLETED" }
      }),
      prisma.supportTicket.count({
        where: { status: "OPEN" }
      })
    ]);

    const analytics = {
      totalOrders,
      totalRevenue: totalRevenue._sum?.totalAmount || 0,
      totalUsers,
      totalProducts: 0, // This would need a Product model
      openTickets,
      completedOrders
    };

    return NextResponse.json({ analytics }, { status: 200 });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
