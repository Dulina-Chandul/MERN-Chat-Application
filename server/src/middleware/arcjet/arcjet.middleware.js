import { isSpoofedBot } from "@arcjet/inspect";
import aj from "../../config/arcjet.js";

export const arcjetProtection = async (req, res, next) => {
  try {
    const decision = await aj.protect(req);

    if (decision.isDenied) {
      if (decision.reason.isRateLimit()) {
        return res
          .status(429)
          .json({ message: "Too many requests. Please try again later." });
      } else if (decision.reason.isBot) {
        return res
          .status(403)
          .json({ message: "Access denied. Bot traffic is not allowed." });
      } else {
        return res
          .status(403)
          .json({ message: "Access denied. Please try again later." });
      }
    }

    if (decision.results.some(isSpoofedBot)) {
      return res.status(403).json({
        error: "Access denied. Spoofed bot traffic is not allowed.",
        message:
          "Your request has been identified as coming from a spoofed bot. If you believe this is an error, please contact support.",
      });
    }

    next();
  } catch (error) {
    console.log("Error in Arcjet middleware: " + error.message);
    next();
  }
};
