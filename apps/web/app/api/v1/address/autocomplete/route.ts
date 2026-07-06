import { NextRequest, NextResponse } from "next/server";
import { apiHandler } from "../../../../lib/api-handler";
import z from "zod";
import { autocompletePlaces } from "../../../../lib/places";

const addressAutocompleteSchema = z.object({
  input: z.string().min(1, "Input is required"),
});

export const GET = apiHandler(async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const input = searchParams.get("input");

  const { input: validatedInput } = await addressAutocompleteSchema.parseAsync({
    input,
  });

  const predictions = await autocompletePlaces(validatedInput);

  return NextResponse.json({ predictions });
});
