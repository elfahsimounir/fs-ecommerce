import bcrypt from "bcrypt";
import { prisma } from '@/lib/ prisma';

// const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const users = await prisma.user.findMany();
    return new Response(JSON.stringify(users), { status: 200 });
  } catch (error: any) {
    console.error('GET /api/user error:', {
      message: error.message,
      stack: error.stack,
      cause: error.cause,
    }); // Log detailed error information
    return new Response(
      JSON.stringify({ error: 'Failed to fetch users. Please check the server logs for more details.' }),
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, password, role = "user" } = body; // Accept role from the request body, default to "user"

    if (!email || !password || !name) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    if (!["user", "admin"].includes(role)) {
      return new Response(JSON.stringify({ error: "Invalid role" }), { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { email, name, password: hashedPassword, role }, // Use the role from the request body
    });

    return new Response(JSON.stringify(newUser), { status: 201 });
  } catch (error: any) {
    console.error("POST /api/user error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, email, password, role } = body;

    if (!id || !name || !email || !role) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { name, email, password, role },
    });

    return new Response(JSON.stringify(updatedUser), { status: 200 });
  } catch (error: any) {
    console.error('PUT /api/user error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), { status: 500 });
  }
}

export async function DELETE(req: Request) {
    try {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get('id');
  
      if (!id) {
        return new Response(JSON.stringify({ error: 'user ID is required' }), { status: 400 });
      }
  
      await prisma.user.delete({ where: { id } });
      return new Response(JSON.stringify({ message: 'user deleted successfully' }), { status: 200 });
    } catch (error: any) {
      console.error('DELETE /api/user error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      return new Response(JSON.stringify({ error: errorMessage }), { status: 500 });
    }
  }