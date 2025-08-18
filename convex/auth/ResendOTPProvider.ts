import { Email } from "@convex-dev/auth/providers/Email";
import { Resend as ResendAPI } from "resend";
import { RandomReader, generateRandomString } from "@oslojs/crypto/random";

export const ResendOTPProvider = Email({
  id: "resend-otp",
  apiKey: process.env.AUTH_RESEND_KEY!,
  maxAge: 60 * 10, // 10 minutes
  
  async generateVerificationToken() {
    // Generate 6-digit numeric code
    const random: RandomReader = {
      read(bytes) {
        crypto.getRandomValues(bytes);
      },
    };
    
    const alphabet = "0123456789";
    const code = generateRandomString(random, alphabet, 6);
    return code;
  },
  
  async sendVerificationRequest({
    identifier: email,
    token,
    provider,
  }) {
    const resend = new ResendAPI(provider.apiKey);
    
    try {
      await resend.emails.send({
        from: "ProComply <procomply@rsvpgeschwister.com>",
        to: [email],
        subject: "ProComply - Verification Code",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #FF3300;">ProComply Verification</h2>
            <p>Your verification code is:</p>
            <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
              <h1 style="font-size: 36px; letter-spacing: 5px; margin: 0; color: #333;">${token}</h1>
            </div>
            <p>This code will expire in 10 minutes.</p>
            <p style="color: #666; font-size: 14px;">If you didn't request this code, please ignore this email.</p>
          </div>
        `,
      });
    } catch (error) {
      console.error("Failed to send OTP email:", error);
      throw new Error("Failed to send verification email");
    }
  },
});