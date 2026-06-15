import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { AppError } from "./error-handler";

export function apiHandler(
  handler: (req: NextRequest) => Promise<NextResponse>,
) {
  return async (req: NextRequest) => {
    try {
      return await handler(req);
    } catch (error) {
      if (error instanceof AppError) {
        return NextResponse.json(
          {
            success: false,
            message: error.message,
          },
          {
            status: error.statusCode,
          },
        );
      }

      if (error instanceof ZodError) {
        return NextResponse.json(
          {
            success: false,
            message: "Validation failed",
            errors: error.issues.map((issue) => ({
              path: issue.path.join("."),
              message: issue.message,
            })),
          },
          { status: 422 },
        );
      }
      console.error("Unexpected error:", error);

      return NextResponse.json(
        {
          success: false,
          message: "Internal Server Error",
        },
        {
          status: 500,
        },
      );
    }
  };
}
