import NodeCache from "node-cache";
import axios from "axios";
import { env } from "./env";
import { InternalServerError } from "./error-handler";

const myCache = new NodeCache();
const AUTH_TOKEN_KEY = "authToken";
const EXPIRATION_SECONDS = 7 * 24 * 60 * 60;
const API_BASE_URL = "https://api-prod.messagecentral.com";

async function getAuthToken(): Promise<string> {
  const cached = myCache.get<string>(AUTH_TOKEN_KEY);
  if (cached) return cached;

  const response = await axios.get(
    `${API_BASE_URL}/auth/v1/authentication/token`,
    {
      params: {
        country: "IN",
        customerId: env.MESSAGECENTRAL_CUSTOMER_ID,
        key: env.MESSAGECENTRAL_BASE64_KEY,
        scope: "NEW",
      },
    },
  );
  console.log(env.MESSAGECENTRAL_BASE64_KEY);
  console.log("Auth token response:", response.data);

  const token = response.data.token;
  myCache.set(AUTH_TOKEN_KEY, token, EXPIRATION_SECONDS);
  return token;
}

export async function sendSMS({
  mobileNumber,
  otp,
}: {
  mobileNumber: string;
  otp: string;
}) {
  const authToken = await getAuthToken();
  console.log(authToken);

  try {
    const response = await axios.post(
      "https://cpaas.messagecentral.com/verification/v3/send",
      null,
      {
        params: {
          countryCode: "91",
          flowType: "SMS",
          mobileNumber,
          senderId: env.MESSAGECENTRAL_CUSTOMER_ID,
          type: "SMS",
          message: `Your OTP for Woff is ${otp}`,
          messageType: "TRANSACTION",
        },
        headers: {
          authToken,
        },
      },
    );

    return response.data;
  } catch (error: any) {
    console.error(
      "Failed to send SMS:",
      error?.response?.data || error?.message || error,
    );
    throw new InternalServerError("Unable to send SMS. Please try again later");
  }
}
