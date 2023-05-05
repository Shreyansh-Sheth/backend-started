import config from "./config";

export default function RandomOtp(length = 6) {
  if (config.NODE_ENV === "test") {
    return "1".repeat(length);
  }

  const validChars = "1234567890";
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += validChars[Math.floor(Math.random() * validChars.length)];
  }

  return otp;
}
