import connectDB from "@/lib/mongo";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    await connectDB();
    const { user_name, user_email, user_account_id } = await request.json();
    const user = new User({
      user_name,
      user_email,
      user_account_id,
    });
    await user.save();
    return NextResponse.json({ message: "User created successfully" }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const user_account_id = searchParams.get("user_account_id");
    console.log("🚀 ~ GET ~ user_account_id:", user_account_id);
    if (!user_account_id) {
      return NextResponse.json({ error: "Account ID is required" }, { status: 400 });
    }
    const id = user_account_id.toLowerCase();
    const response = await User.findOne({ id });
    console.log(response);
    if (!response) {
      return NextResponse.json({ found: false }, { status: 200 });
    } else {
      return NextResponse.json({ found: true, user: response }, { status: 200 });
    }    
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
