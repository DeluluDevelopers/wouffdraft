import axios from "axios";
import { env } from "./env";
import { BadRequestError, NotFoundError } from "./error-handler";

const PLACES_API_BASE_URL = "https://places.googleapis.com/v1";

export type AddressPrediction = {
  description: string;
  placeId: string;
};

export type PlaceDetails = {
  address: string;
  latitude: number;
  longitude: number;
};

type AutocompleteResponse = {
  suggestions?: Array<{
    placePrediction?: {
      placeId: string;
      text?: { text: string };
    };
  }>;
};

type PlaceDetailsResponse = {
  formattedAddress?: string;
  location?: { latitude: number; longitude: number };
};

export async function autocompletePlaces(
  input: string,
  includedRegionCodes: string[] = ["in"],
): Promise<AddressPrediction[]> {
  try {
    const response = await axios.post<AutocompleteResponse>(
      `${PLACES_API_BASE_URL}/places:autocomplete`,
      {
        input,
        includedRegionCodes,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": env.GOOGLE_MAPS_API_KEY,
        },
      },
    );

    const suggestions = response.data.suggestions ?? [];
    return suggestions
      .filter((suggestion) => !!suggestion.placePrediction)
      .map((suggestion) => ({
        description: suggestion.placePrediction!.text?.text ?? "",
        placeId: suggestion.placePrediction!.placeId,
      }));
  } catch (error: unknown) {
    const err = error as { response?: { data?: unknown }; message?: string };
    console.error(
      "Places autocomplete failed:",
      err?.response?.data || err?.message || error,
    );
    throw new NotFoundError("Failed to fetch address predictions");
  }
}

export async function getPlaceDetails(placeId: string): Promise<PlaceDetails> {
  let data: PlaceDetailsResponse;
  try {
    const response = await axios.get<PlaceDetailsResponse>(
      `${PLACES_API_BASE_URL}/places/${encodeURIComponent(placeId)}`,
      {
        headers: {
          "X-Goog-Api-Key": env.GOOGLE_MAPS_API_KEY,
          "X-Goog-FieldMask": "id,formattedAddress,location",
        },
      },
    );
    data = response.data;
  } catch (error: unknown) {
    const err = error as {
      response?: { status?: number; data?: unknown };
      message?: string;
    };
    if (err?.response?.status === 404 || err?.response?.status === 400) {
      throw new BadRequestError("Invalid place ID");
    }
    console.error(
      "Place details lookup failed:",
      err?.response?.data || err?.message || error,
    );
    throw new BadRequestError("Invalid place ID");
  }

  const { formattedAddress, location } = data;
  if (
    !formattedAddress ||
    location?.latitude === undefined ||
    location?.longitude === undefined
  ) {
    throw new BadRequestError("Could not resolve address from place ID");
  }

  return {
    address: formattedAddress,
    latitude: location.latitude,
    longitude: location.longitude,
  };
}
