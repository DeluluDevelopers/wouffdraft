# Taste (Continuously Learned by [CommandCode][cmd])

[cmd]: https://commandcode.ai/

# sms
- For sendSMS: accept both `otp` and `mobileNumber` as inputs, and send the OTP in the SMS message using the MessageCentral API. Confidence: 0.80

# api-handler
- Keep apiHandler wrapper signature minimal — don't force every route handler to declare an unused context parameter; only add params to handlers that actually need them. Confidence: 0.75

