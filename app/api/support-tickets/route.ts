import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import crypto from "crypto";

const createTicketSchema = z.object({
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters")
});

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const tickets = await prisma.supportTicket.findMany({
      where: { userId: session.user.id },
      include: { responses: { orderBy: { createdAt: "asc" } } },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ tickets }, { status: 200 });
  } catch (error) {
    console.error("Tickets error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tickets" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { subject, message } = createTicketSchema.parse(body);

    const ticketNumber = `TKT-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

    const ticket = await prisma.supportTicket.create({
      data: {
        userId: session.user.id,
        ticketNumber,
        subject,
        message,
        status: "OPEN",
        priority: "NORMAL",
        responses: {
          create: {
            message,
            isAdmin: false
          }
        }
      },
      include: { responses: true }
    });

    return NextResponse.json({
      message: "Ticket created successfully",
      ticket
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Create ticket error:", error);
    return NextResponse.json(
      { error: "Failed to create ticket" },
      { status: 500 }
    );
  }
}
