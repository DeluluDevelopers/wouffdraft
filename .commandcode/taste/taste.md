# Taste (Continuously Learned by [CommandCode][cmd])

[cmd]: https://commandcode.ai/

# sms
- For sendSMS: accept both `otp` and `mobileNumber` as inputs, and send the OTP in the SMS message using the MessageCentral API. Confidence: 0.80

# api-handler
- Keep apiHandler wrapper signature minimal — don't force every route handler to declare an unused context parameter; only add params to handlers that actually need them. Confidence: 0.75

# ui
- Use bottom tabs for app navigation instead of top tabs. Confidence: 0.85
- Use white and shades of black as the primary color scheme; use other colors sparingly. Confidence: 0.80

# frontend
- Display phone country code as "91" without the "+" prefix in the frontend. Confidence: 0.65
- Use icons instead of emojis throughout the app. Confidence: 0.85
- For the complete profile flow: collect address via autocomplete (placeId), then pet information across multiple screens, then submit all data in a single API call to the backend. Confidence: 0.70

