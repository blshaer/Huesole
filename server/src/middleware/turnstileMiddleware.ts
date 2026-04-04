import { Request, Response, NextFunction } from "express";
import axios from "axios";

/**
 * Middleware to verify Cloudflare Turnstile token
 */
export const verifyTurnstile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Falls back to Cloudflare's "Always Pass" secret key if no env variable is set
  const secretKey = process.env.TURNSTILE_SECRET_KEY || "1x0000000000000000000000000000000AA";

  const token = req.headers["cf-turnstile-response"] || req.body.turnstileToken;

  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Human verification required. Please complete the captcha.",
    });
  }

  try {
    const formData = new URLSearchParams();
    formData.append("secret", secretKey);
    formData.append("response", token as string);
    formData.append("remoteip", req.ip || "");

    const result = await axios.post(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      formData
    );

    const outcome = result.data;

    if (outcome.success) {
      next();
    } else {
      console.error("Turnstile verification failed:", outcome["error-codes"]);
      return res.status(401).json({
        success: false,
        message: "Verification failed. Please try again.",
        errorCodes: outcome["error-codes"],
      });
    }
  } catch (error) {
    console.error("Turnstile verification error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during human verification.",
    });
  }
};
