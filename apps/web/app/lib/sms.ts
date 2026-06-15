import axios from "axios";
import { env } from "./env";

const authToken = env.MESSAGECENTRAL_AUTH_TOKEN;

export async function sendSMS({ mobileNumber }: { mobileNumber: string }) {
  console.log(authToken);
  const response = await axios.post(
    "https://cpaas.messagecentral.com/sms/v3/messages",
    {
      mobileNumber,
      message: "Your OTP for Woff is 123456",
    },
    {
      headers: {
        authToken,
        "Content-Type": "application/json",
      },
    },
  );

  console.log(response.data);
}
