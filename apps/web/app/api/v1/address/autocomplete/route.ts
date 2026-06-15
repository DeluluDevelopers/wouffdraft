import { NextRequest, NextResponse } from "next/server";
import { apiHandler } from "../../../../lib/api-handler";
import z from "zod";
import { Client } from "@googlemaps/google-maps-services-js";
import { env } from "../../../../lib/env";
import { NotFoundError } from "../../../../lib/error-handler";

const client = new Client({});

const addressAutocompleteSchema = z.object({
  input: z.string().min(1, "Input is required"),
});

export const GET = apiHandler(async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const input = searchParams.get("input");

  const { input: validatedInput } = await addressAutocompleteSchema.parseAsync({
    input,
  });

  const response = await client.placeAutocomplete({
    params: {
      input: validatedInput,
      key: env.GOOGLE_MAPS_API_KEY,
      components: ["country:in"],
    },
  });

  const { data } = response;
  if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
    throw new NotFoundError("Failed to fetch address predictions");
  }

  return NextResponse.json({
    predictions: data.predictions.map((prediction) => ({
      description: prediction.description,
      placeId: prediction.place_id,
    })),
  });
});
