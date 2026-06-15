import { NextRequest, NextResponse } from "next/server";
import { apiHandler } from "../../../../lib/api-handler";

export const POST = apiHandler(async (req: NextRequest) => {
    
  return NextResponse.json({ message: "Hello, world!" });
});
