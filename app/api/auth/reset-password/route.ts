import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // In a real application, you would:
    // 1. Check if the email exists in your database
    // 2. Generate a unique token and store it with an expiration time
    // 3. Send an email with a link containing the token

    console.log(`Password reset requested for: ${email}`);

    // Simulate a successful response
    return NextResponse.json(
      { success: true, message: "Password reset email sent" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
